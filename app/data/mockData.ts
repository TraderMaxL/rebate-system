// 用户数据
export interface User {
  uid: number;
  name: string;
  avatar?: string;
}

// 交易数据
export interface Trade {
  id: number;
  uid: number;
  amount: number;
  fee: number;
  timestamp: number;
  // 添加标记字段，表示是否已经计算返佣
  rebateCalculated: boolean;
}

// 用户关系数据
export interface UserRelation {
  uid: number;
  inviter_uid: number | null;
}

// 返佣记录数据
export interface RebateRecord {
  id: number;
  trade_id: number;
  from_uid: number;
  to_uid: number;
  amount: number;
  level: number; // 1表示一级返佣，2表示二级返佣
  timestamp: number;
}

// 返佣比例
export const FIRST_LEVEL_REBATE_RATE = 0.1; // 一级返佣10%
export const SECOND_LEVEL_REBATE_RATE = 0.05; // 二级返佣5%

// 模拟用户数据
export const users: User[] = [
  { uid: 1, name: '张三', avatar: '/avatars/user1.png' },
  { uid: 2, name: '李四', avatar: '/avatars/user2.png' },
  { uid: 3, name: '王五', avatar: '/avatars/user3.png' },
  { uid: 4, name: '赵六', avatar: '/avatars/user4.png' },
  { uid: 5, name: '钱七', avatar: '/avatars/user5.png' },
  { uid: 6, name: '孙八', avatar: '/avatars/user6.png' },
  { uid: 7, name: '周九', avatar: '/avatars/user7.png' },
  { uid: 8, name: '吴十', avatar: '/avatars/user8.png' },
];

// 模拟交易数据
export const trades: Trade[] = [
  { id: 1, uid: 1, amount: 5000, fee: 50, timestamp: Date.now() - 86400000 * 5, rebateCalculated: false },
  { id: 2, uid: 1, amount: 3000, fee: 30, timestamp: Date.now() - 86400000 * 4, rebateCalculated: false },
  { id: 3, uid: 2, amount: 7000, fee: 70, timestamp: Date.now() - 86400000 * 3, rebateCalculated: false },
  { id: 4, uid: 2, amount: 4000, fee: 40, timestamp: Date.now() - 86400000 * 2, rebateCalculated: false },
  { id: 5, uid: 3, amount: 9000, fee: 90, timestamp: Date.now() - 86400000 * 1, rebateCalculated: false },
  { id: 6, uid: 3, amount: 6000, fee: 60, timestamp: Date.now(), rebateCalculated: false },
  { id: 7, uid: 4, amount: 8000, fee: 80, timestamp: Date.now() - 86400000 * 6, rebateCalculated: false },
  { id: 8, uid: 5, amount: 10000, fee: 100, timestamp: Date.now() - 86400000 * 7, rebateCalculated: false },
  { id: 9, uid: 6, amount: 12000, fee: 120, timestamp: Date.now() - 86400000 * 8, rebateCalculated: false },
  { id: 10, uid: 7, amount: 15000, fee: 150, timestamp: Date.now() - 86400000 * 9, rebateCalculated: false },
  { id: 11, uid: 8, amount: 20000, fee: 200, timestamp: Date.now() - 86400000 * 10, rebateCalculated: false },
];

// 模拟用户关系数据 (uid, inviter_uid)
export const userRelations: UserRelation[] = [
  { uid: 1, inviter_uid: null }, // 张三没有邀请人
  { uid: 2, inviter_uid: 1 },    // 李四由张三邀请
  { uid: 3, inviter_uid: 2 },    // 王五由李四邀请 (张三是王五的二级邀请人)
  { uid: 4, inviter_uid: 1 },    // 赵六由张三邀请
  { uid: 5, inviter_uid: 2 },    // 钱七由李四邀请
  { uid: 6, inviter_uid: 3 },    // 孙八由王五邀请
  { uid: 7, inviter_uid: 3 },    // 周九由王五邀请
  { uid: 8, inviter_uid: 4 },    // 吴十由赵六邀请
];

// 模拟返佣记录
export const rebateRecords: RebateRecord[] = [];

// 获取用户的上级邀请人
export function getInviter(uid: number): number | null {
  const relation = userRelations.find(r => r.uid === uid);
  return relation ? relation.inviter_uid : null;
}

// 获取用户的上上级邀请人
export function getSecondLevelInviter(uid: number): number | null {
  const inviterUid = getInviter(uid);
  if (!inviterUid) return null;
  return getInviter(inviterUid);
}

// 按小时获取交易记录
export function getTradesByHour(hour: Date): Trade[] {
  const startTime = new Date(hour);
  startTime.setMinutes(0, 0, 0);
  
  const endTime = new Date(startTime);
  endTime.setHours(endTime.getHours() + 1);
  
  return trades.filter(trade => {
    const tradeTime = new Date(trade.timestamp);
    return tradeTime >= startTime && tradeTime < endTime && !trade.rebateCalculated;
  });
} 