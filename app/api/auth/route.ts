import { NextResponse } from 'next/server';
import { users } from '../../data/mockData';

export async function POST(request: Request) {
  try {
    const { uid } = await request.json();
    
    // 查找用户
    const user = users.find(u => u.uid === Number(uid));
    
    if (user) {
      return NextResponse.json({ success: true, user });
    } else {
      return NextResponse.json({ success: false, message: '用户不存在' }, { status: 404 });
    }
  } catch {
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 });
  }
} 