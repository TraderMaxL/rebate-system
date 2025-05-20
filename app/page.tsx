'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [uid, setUid] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uid || isNaN(Number(uid))) {
      setError('请输入有效的用户ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid: Number(uid) }),
      });

      const data = await response.json();

      if (data.success) {
        // 登录成功，跳转到仪表盘
        router.push(`/dashboard/${uid}`);
      } else {
        setError(data.message || '登录失败');
      }
    } catch {
      setError('服务器错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        <div className="flex flex-col items-center mb-8">
          <h1 className="mt-4 text-2xl font-bold text-center text-gray-800">返佣后台系统</h1>
          <p className="mt-2 text-center text-gray-600">请登录以查看您的返佣数据</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="uid" className="block text-sm font-medium text-gray-700">
              用户ID
            </label>
            <input
              id="uid"
              name="uid"
              type="text"
              required
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="请输入用户ID (1-8)"
            />
            <p className="mt-1 text-xs text-gray-500">
              提示: 测试用户ID为1-8
            </p>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
