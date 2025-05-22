import { NextResponse } from 'next/server';
import { rebateRecords, users } from '../../../data/mockData';

// 查询用户返佣记录
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const uid = Number(url.searchParams.get('uid'));
    const type = url.searchParams.get('type'); // 'received' 或 'generated'
    
    if (!uid) {
      return NextResponse.json(
        { success: false, message: '缺少用户ID参数' },
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
    
    let records = [];
    
    // 根据查询类型过滤记录
    if (type === 'received') {
      // 查询用户获得的返佣记录
      records = rebateRecords.filter(record => record.to_uid === uid);
    } else if (type === 'generated') {
      // 查询用户产生的返佣记录
      records = rebateRecords.filter(record => record.from_uid === uid);
    } else {
      // 默认查询所有与用户相关的返佣记录
      records = rebateRecords.filter(
        record => record.to_uid === uid || record.from_uid === uid
      );
    }
    
    // 按时间倒序排序
    records.sort((a, b) => b.timestamp - a.timestamp);
    
    // 统计一级和二级返佣总额
    const firstLevelTotal = records
      .filter(r => r.to_uid === uid && r.level === 1)
      .reduce((sum, r) => sum + r.amount, 0);
      
    const secondLevelTotal = records
      .filter(r => r.to_uid === uid && r.level === 2)
      .reduce((sum, r) => sum + r.amount, 0);
    
    return NextResponse.json({
      success: true,
      user,
      records,
      stats: {
        total: firstLevelTotal + secondLevelTotal,
        firstLevelTotal,
        secondLevelTotal,
        count: records.length
      }
    });
  } catch (error) {
    console.error('查询返佣记录时出错:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    );
  }
} 