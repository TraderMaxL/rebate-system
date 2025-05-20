import { NextResponse } from 'next/server';
import { users, trades, userRelations, REBATE_RATE } from '../../../data/mockData';

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
    
    // 获取用户交易数据
    const userTrades = trades.filter(t => t.uid === uid);
    const totalTradeAmount = userTrades.reduce((sum, trade) => sum + trade.amount, 0);
    const totalFees = userTrades.reduce((sum, trade) => sum + trade.fee, 0);
    
    // 获取邀请的用户
    const invitedUsers = userRelations.filter(relation => relation.inviter_uid === uid);
    const invitedCount = invitedUsers.length;
    
    // 计算获得的返佣
    let totalRebate = 0;
    invitedUsers.forEach(relation => {
      const invitedUserTrades = trades.filter(t => t.uid === relation.uid);
      const invitedUserFees = invitedUserTrades.reduce((sum, trade) => sum + trade.fee, 0);
      totalRebate += invitedUserFees * REBATE_RATE;
    });
    
    return NextResponse.json({
      success: true,
      user,
      stats: {
        totalTradeAmount,
        totalFees,
        invitedCount,
        totalRebate,
      },
      invitedUsers: invitedUsers.map(relation => {
        const invitedUser = users.find(u => u.uid === relation.uid);
        const userTrades = trades.filter(t => t.uid === relation.uid);
        const tradeAmount = userTrades.reduce((sum, trade) => sum + trade.amount, 0);
        const fees = userTrades.reduce((sum, trade) => sum + trade.fee, 0);
        const rebate = fees * REBATE_RATE;
        
        return {
          user: invitedUser,
          tradeAmount,
          fees,
          rebate,
        };
      }),
    });
  } catch {
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 });
  }
} 