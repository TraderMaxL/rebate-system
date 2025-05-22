# 二级返佣系统

这是一个基于Next.js实现的二级返佣系统，支持按用户层级关系计算一级和二级返佣，并支持按小时批量进行返佣计算。

## 系统功能

- **二级层级关系**：支持用户一级和二级层级关系管理
- **返佣比例设置**：一级返佣10%，二级返佣5%
- **交易记录**：记录用户交易数据
- **小时级批量返佣**：按照自然小时批量计算返佣，避免频繁计算
- **返佣记录查询**：支持查询用户接收和产生的返佣记录

## 系统架构

### 数据模型

- **User**: 用户信息
- **Trade**: 交易记录
- **UserRelation**: 用户关系
- **RebateRecord**: 返佣记录

### API接口

- **用户相关**
  - `GET /api/user/[uid]` - 获取用户详情及返佣信息

- **交易相关**
  - `POST /api/trade/create` - 创建新交易记录

- **返佣相关**
  - `POST /api/rebate/calculate` - 手动触发按小时计算返佣
  - `GET /api/rebate/records` - 查询用户返佣记录

- **定时任务**
  - `GET /api/cron/hourly-rebate` - 按小时自动计算返佣的定时任务接口

## 使用方法

### 1. 安装依赖

```bash
npm install
```

### 2. 开发环境运行

```bash
npm run dev
```

### 3. 生产环境构建

```bash
npm run build
npm start
```

## 返佣计算流程

1. 用户进行交易，交易数据存入 `trades` 表，并设置 `rebateCalculated = false`
2. 定时任务每小时触发一次返佣计算（通过 cron 或其他定时服务调用）
3. 返佣计算过程：
   - 获取指定小时内未计算返佣的交易记录
   - 根据交易用户查找其上级（一级邀请人）和上上级（二级邀请人）
   - 计算一级和二级返佣金额并记录
   - 标记交易记录已计算返佣（`rebateCalculated = true`）

## 示例场景

用户关系：A -> B -> C（A是B的邀请人，B是C的邀请人，所以A是C的二级邀请人）

当C产生交易时：
- B获得C交易手续费的10%作为一级返佣
- A获得C交易手续费的5%作为二级返佣

## 注意事项

1. 本项目使用内存模拟数据，实际生产环境应改为数据库存储
2. 返佣计算应考虑事务处理，确保数据一致性
3. 在高并发环境下，可考虑使用消息队列处理返佣计算任务

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
