'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  uid: number;
  name: string;
  avatar?: string;
}

interface InvitedUserData {
  user: User;
  tradeAmount: number;
  fees: number;
  firstLevelRebate: number;
  subInvitedCount: number; 
  secondLevelRebateFromSubUsers: number;
}

interface UserStats {
  totalTradeAmount: number;
  totalFees: number;
  directInvitedCount: number;
  secondLevelInvitedCount: number;
  totalInvitedCount: number;
  firstLevelRebate: number;
  secondLevelRebate: number;
  totalRebate: number;
}

interface InviterInfo {
  firstLevel: User | null;
  secondLevel: User | null;
}

interface RebateRates {
  firstLevel: string;
  secondLevel: string;
}

interface UserData {
  success: boolean;
  user: User;
  inviterInfo: InviterInfo;
  stats: UserStats;
  rebateRates: RebateRates;
  invitedUsers: InvitedUserData[];
  recentRebates: any[];
}

export default function Dashboard({ params }: { params: { uid: string } }) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/user/${params.uid}`);
        const data = await response.json();
        
        if (data.success) {
          setUserData(data);
        } else {
          setError(data.message || '获取数据失败');
          setTimeout(() => {
            router.push('/');
          }, 3000);
        }
      } catch {
        setError('服务器错误，请稍后重试');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [params.uid, router]);
  
  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  
  const handleLogout = () => {
    router.push('/');
  };
  
  const exportToCSV = () => {
    if (!userData) return;
    
    const headers = ['用户ID', '用户名', '交易金额', '手续费', '一级返佣', '二级用户数', '二级返佣'];
    const rows = userData.invitedUsers.map(user => [
      user.user.uid,
      user.user.name,
      user.tradeAmount,
      user.fees,
      user.firstLevelRebate,
      user.subInvitedCount,
      user.secondLevelRebateFromSubUsers
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `返佣数据_${userData.user.name}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold">加载中...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center">
            <p className="text-xl font-semibold text-red-600 mb-4">错误</p>
            <p className="mb-6">{error}</p>
            <p className="text-sm text-gray-500">正在返回登录页面...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!userData) return null;
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部导航 */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">返佣后台系统</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {userData.user.avatar ? (
                <img 
                  src={userData.user.avatar} 
                  alt={`${userData.user.name}的头像`}
                  className="h-10 w-10 rounded-full mr-2 object-cover"
                />
              ) : (
                <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                  {userData.user.name.charAt(0)}
                </div>
              )}
              <span className="text-gray-600">欢迎，{userData.user.name}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
            >
              退出
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-sm font-medium text-gray-500">总交易金额</h2>
            <p className="mt-2 text-2xl font-semibold text-gray-900">$ {formatNumber(userData.stats.totalTradeAmount)}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-sm font-medium text-gray-500">总手续费</h2>
            <p className="mt-2 text-2xl font-semibold text-gray-900">$ {formatNumber(userData.stats.totalFees)}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-sm font-medium text-gray-500">邀请人数</h2>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{userData.stats.directInvitedCount} 人 (二级: {userData.stats.secondLevelInvitedCount})</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-sm font-medium text-gray-500">获得返佣</h2>
            <p className="mt-2 text-2xl font-semibold text-green-600">$ {formatNumber(userData.stats.totalRebate)}</p>
          </div>
        </div>
        
        {/* 返佣比例信息 */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-sm font-medium text-gray-700 mb-2">返佣比例：</h2>
          <p className="text-sm text-gray-600">
            一级返佣：{userData.rebateRates?.firstLevel || '10%'} | 
            二级返佣：{userData.rebateRates?.secondLevel || '5%'}
          </p>
        </div>
        
        {/* 邀请用户列表 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 flex justify-between items-center border-b">
            <h2 className="text-lg font-medium text-gray-900">邀请用户列表</h2>
            <button 
              onClick={exportToCSV}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
            >
              导出CSV
            </button>
          </div>
          
          {userData.stats.directInvitedCount > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">交易金额</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">手续费</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">一级返佣</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">二级用户</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">二级返佣</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userData.invitedUsers.map((user) => (
                    <tr key={user.user.uid}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {user.user.avatar ? (
                              <img 
                                src={user.user.avatar} 
                                alt={`${user.user.name}的头像`}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                {user.user.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.user.name}</div>
                            <div className="text-sm text-gray-500">ID: {user.user.uid}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        $ {formatNumber(user.tradeAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        $ {formatNumber(user.fees)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                        $ {formatNumber(user.firstLevelRebate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.subInvitedCount} 人
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                        $ {formatNumber(user.secondLevelRebateFromSubUsers)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500">
              <p>您还没有邀请用户</p>
              <p className="mt-2 text-sm">邀请用户加入平台，获得他们交易手续费的10%作为一级返佣，5%作为二级返佣</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 