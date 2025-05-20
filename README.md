# 返佣后台系统 MVP

这是一个简单的返佣后台系统的MVP实现，用于实时统计和展示用户的交易数据与返佣奖励。系统支持一级返佣结构。

## 功能特点

- 用户登录（模拟登录，无需密码）
- 个人交易数据展示：总交易额、总手续费
- 邀请情况展示：
  - 邀请人数（一级）
  - 邀请用户产生的返佣总额（基于其交易手续费）
- 返佣规则：获得被邀请用户交易手续费的20%作为返佣
- 导出报表（CSV格式）

## 技术栈

- 前端：React
- 框架：Next.js
- 样式：Tailwind CSS
- 数据：使用模拟数据

## 开始使用

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
```

## 使用说明

1. 在登录页面输入用户ID（1-8中的任意一个）
2. 登录后可以查看：
   - 个人交易数据
   - 邀请的用户列表
   - 返佣统计
3. 点击"导出CSV"按钮可以导出邀请用户的返佣数据报表

## 项目结构

- `/app/api/*` - API路由
- `/app/data/` - 模拟数据
- `/app/dashboard/[uid]/` - 用户仪表盘页面
- `/app/page.tsx` - 登录页面

## 数据结构

系统使用以下数据结构：

- 用户数据：`uid`, `name`, `avatar`
- 交易数据：`id`, `uid`, `amount`, `fee`, `timestamp`
- 用户关系数据：`uid`, `inviter_uid`

## 示例用户

系统预设了8个测试用户，其中：

- 用户1（张三）是顶级用户，邀请了用户2、3、4
- 用户2（李四）邀请了用户5、6
- 用户3（王五）邀请了用户7
- 用户4（赵六）邀请了用户8

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
