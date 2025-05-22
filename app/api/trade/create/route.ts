import { NextResponse } from 'next/server';
import { trades, users } from '../../../data/mockData';

// 创建交易记录
export async function POST(request: Request) {
  try {
    const { uid, amount, fee } = await request.json();

    // 验证参数
    if (!uid || !amount || !fee) {
      return NextResponse.json(
        { success: false, message: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 检查用户是否存在
    const user = users.find(u => u.uid === uid);
    if (!user) {
      return NextResponse.json(
        { success: false, message: '用户不存在' },
        { status: 404 }
      );
    }

    // 创建新交易记录
    const newTrade = {
      id: trades.length + 1,
      uid,
      amount,
      fee,
      timestamp: Date.now(),
      rebateCalculated: false
    };

    // 添加到交易列表
    trades.push(newTrade);

    return NextResponse.json({
      success: true,
      message: '交易记录创建成功',
      trade: newTrade
    });
  } catch (error) {
    console.error('创建交易记录时出错:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    );
  }
} 