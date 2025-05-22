import { NextResponse } from 'next/server';
import { 
  users, 
  trades, 
  userRelations, 
  rebateRecords,
  getInviter,
  getSecondLevelInviter,
  FIRST_LEVEL_REBATE_RATE, 
  SECOND_LEVEL_REBATE_RATE,
  UserRelation
} from '../../../data/mockData';

// 获取用户统计数据
export async function GET(
  request: Request,
  { params }: { params: { uid: string } }
) {
  try {
    const uid = Number(params.uid);
    
    // 查找用户
    const user = users.find(u => u.uid === uid);
    if (!user) {
      return NextResponse.json({ success: false, message: '用户不存在' }, { status: 404 });
    }
    
    // 获取用户的上级和上上级
    const firstLevelInviter = getInviter(uid);
    const secondLevelInviter = getSecondLevelInviter(uid);
    
    const firstLevelInviterUser = firstLevelInviter 
      ? users.find(u => u.uid === firstLevelInviter) 
      : null;
      
    const secondLevelInviterUser = secondLevelInviter 
      ? users.find(u => u.uid === secondLevelInviter) 
      : null;
    
    // 获取用户交易数据
    const userTrades = trades.filter(t => t.uid === uid);
    const totalTradeAmount = userTrades.reduce((sum, trade) => sum + trade.amount, 0);
    const totalFees = userTrades.reduce((sum, trade) => sum + trade.fee, 0);
    
    // 获取下级用户（直接邀请的用户）
    const directInvitedUsers = userRelations.filter(relation => relation.inviter_uid === uid);
    const directInvitedCount = directInvitedUsers.length;
    
    // 获取二级下级用户（下级邀请的用户）
    const secondLevelInvitedUsers: UserRelation[] = [];
    directInvitedUsers.forEach(relation => {
      const subInvited = userRelations.filter(r => r.inviter_uid === relation.uid);
      secondLevelInvitedUsers.push(...subInvited);
    });
    const secondLevelInvitedCount = secondLevelInvitedUsers.length;
    
    // 计算从已记录的返佣中获得的金额
    const userRebateRecords = rebateRecords.filter(record => record.to_uid === uid);
    const recordedFirstLevelRebate = userRebateRecords
      .filter(record => record.level === 1)
      .reduce((sum, record) => sum + record.amount, 0);
    const recordedSecondLevelRebate = userRebateRecords
      .filter(record => record.level === 2)
      .reduce((sum, record) => sum + record.amount, 0);
    
    // 计算理论上应该获得的一级返佣（所有直接邀请用户的手续费*返佣比例）
    let theoreticalFirstLevelRebate = 0;
    directInvitedUsers.forEach(relation => {
      const invitedUserTrades = trades.filter(t => t.uid === relation.uid);
      const invitedUserFees = invitedUserTrades.reduce((sum, trade) => sum + trade.fee, 0);
      theoreticalFirstLevelRebate += invitedUserFees * FIRST_LEVEL_REBATE_RATE;
    });
    
    // 计算理论上应该获得的二级返佣（所有二级邀请用户的手续费*返佣比例）
    let theoreticalSecondLevelRebate = 0;
    secondLevelInvitedUsers.forEach(relation => {
      const invitedUserTrades = trades.filter(t => t.uid === relation.uid);
      const invitedUserFees = invitedUserTrades.reduce((sum, trade) => sum + trade.fee, 0);
      theoreticalSecondLevelRebate += invitedUserFees * SECOND_LEVEL_REBATE_RATE;
    });
    
    // 使用理论值和已记录值的最大值作为显示值
    const firstLevelRebate = Math.max(recordedFirstLevelRebate, theoreticalFirstLevelRebate);
    const secondLevelRebate = Math.max(recordedSecondLevelRebate, theoreticalSecondLevelRebate);
    const totalRebate = firstLevelRebate + secondLevelRebate;
    
    // 获取最近的返佣记录
    const recentRebates = [...userRebateRecords].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
    
    return NextResponse.json({
      success: true,
      user,
      inviterInfo: {
        firstLevel: firstLevelInviterUser,
        secondLevel: secondLevelInviterUser
      },
      stats: {
        totalTradeAmount,
        totalFees,
        directInvitedCount,
        secondLevelInvitedCount,
        totalInvitedCount: directInvitedCount + secondLevelInvitedCount,
        firstLevelRebate,
        secondLevelRebate,
        totalRebate
      },
      rebateRates: {
        firstLevel: FIRST_LEVEL_REBATE_RATE * 100 + '%',
        secondLevel: SECOND_LEVEL_REBATE_RATE * 100 + '%'
      },
      recentRebates: recentRebates.map(record => {
        const fromUser = users.find(u => u.uid === record.from_uid);
        return {
          id: record.id,
          fromUser,
          amount: record.amount,
          level: record.level,
          timestamp: record.timestamp
        };
      }),
      invitedUsers: directInvitedUsers.map(relation => {
        const invitedUser = users.find(u => u.uid === relation.uid);
        const userTrades = trades.filter(t => t.uid === relation.uid);
        const tradeAmount = userTrades.reduce((sum, trade) => sum + trade.amount, 0);
        const fees = userTrades.reduce((sum, trade) => sum + trade.fee, 0);
        const firstLevelRebate = fees * FIRST_LEVEL_REBATE_RATE;
        
        // 获取该用户邀请的二级用户
        const subInvited = userRelations.filter(r => r.inviter_uid === relation.uid);
        const subInvitedCount = subInvited.length;
        
        // 计算二级返佣
        let secondLevelRebateFromSubUsers = 0;
        subInvited.forEach(subRelation => {
          const subUserTrades = trades.filter(t => t.uid === subRelation.uid);
          const subFees = subUserTrades.reduce((sum, trade) => sum + trade.fee, 0);
          secondLevelRebateFromSubUsers += subFees * SECOND_LEVEL_REBATE_RATE;
        });
        
        return {
          user: invitedUser,
          tradeAmount,
          fees,
          firstLevelRebate,
          subInvitedCount,
          secondLevelRebateFromSubUsers
        };
      }),
    });
  } catch (error) {
    console.error('获取用户详情时出错:', error);
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 });
  }
} 