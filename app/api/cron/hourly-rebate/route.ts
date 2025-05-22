import { NextResponse } from 'next/server';
import { getTradesByHour } from '../../../data/mockData';

// 按小时计算返佣的定时任务
export async function GET(request: Request) {
  try {
    // 获取当前小时
    const now = new Date();
    const currentHour = new Date(now);
    currentHour.setMinutes(0, 0, 0);
    
    // 调用返佣计算API
    const calculateResponse = await fetch(new URL('/api/rebate/calculate', request.url), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ hour: currentHour.toISOString() }),
    });
    
    const result = await calculateResponse.json();
    
    if (!result.success) {
      return NextResponse.json({
        success: false,
        message: '返佣计算失败',
        error: result.message,
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: `成功计算 ${currentHour.toISOString()} 的返佣数据`,
      result,
    });
  } catch (error) {
    console.error('定时计算返佣时出错:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    );
  }
} 