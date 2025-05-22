import { NextResponse } from 'next/server';
import { 
  trades, 
  rebateRecords, 
  getInviter, 
  getSecondLevelInviter, 
  FIRST_LEVEL_REBATE_RATE, 
  SECOND_LEVEL_REBATE_RATE, 
  getTradesByHour,
  RebateRecord 
} from '../../../data/mockData';

// 按小时计算返佣
export async function POST(request: Request) {
  try {
    const { hour } = await request.json();
    
    if (!hour) {
      return NextResponse.json({ success: false, message: '缺少参数' }, { status: 400 });
    }
    
    const hourDate = new Date(hour);
    const tradesToProcess = getTradesByHour(hourDate);
    
    if (tradesToProcess.length === 0) {
      return NextResponse.json({ 
        success: true,
        message: '当前时间段没有需要计算返佣的交易',
        count: 0
      });
    }
    
    // 批量计算返佣
    const newRebateRecords: RebateRecord[] = [];
    
    for (const trade of tradesToProcess) {
      // 获取用户的一级和二级邀请人
      const firstLevelInviter = getInviter(trade.uid);
      const secondLevelInviter = getSecondLevelInviter(trade.uid);
      
      // 计算一级返佣
      if (firstLevelInviter) {
        const firstLevelRebateAmount = trade.fee * FIRST_LEVEL_REBATE_RATE;
        const firstLevelRecord: RebateRecord = {
          id: rebateRecords.length + newRebateRecords.length + 1,
          trade_id: trade.id,
          from_uid: trade.uid,
          to_uid: firstLevelInviter,
          amount: firstLevelRebateAmount,
          level: 1,
          timestamp: Date.now()
        };
        newRebateRecords.push(firstLevelRecord);
      }
      
      // 计算二级返佣
      if (secondLevelInviter) {
        const secondLevelRebateAmount = trade.fee * SECOND_LEVEL_REBATE_RATE;
        const secondLevelRecord: RebateRecord = {
          id: rebateRecords.length + newRebateRecords.length + 1,
          trade_id: trade.id,
          from_uid: trade.uid,
          to_uid: secondLevelInviter,
          amount: secondLevelRebateAmount,
          level: 2,
          timestamp: Date.now()
        };
        newRebateRecords.push(secondLevelRecord);
      }
      
      // 标记交易已计算返佣
      trade.rebateCalculated = true;
    }
    
    // 将新生成的返佣记录添加到返佣记录列表中
    rebateRecords.push(...newRebateRecords);
    
    return NextResponse.json({
      success: true,
      message: '返佣计算成功',
      count: tradesToProcess.length,
      rebateRecords: newRebateRecords
    });
  } catch (error) {
    console.error('计算返佣时出错:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    );
  }
} 