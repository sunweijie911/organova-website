# Organova Website

Organova 官网全栈项目，包含面向用户的门户网站和内容管理后台。

## 技术栈

| 层级     | 技术                                                                      |
| -------- | ------------------------------------------------------------------------- |
| 框架     | [Next.js 16](https://nextjs.org) (App Router + Turbopack)                 |
| API      | [tRPC](https://trpc.io) — 端到端类型安全                                  |
| ORM      | [Drizzle ORM](https://orm.drizzle.team)                                   |
| 数据库   | [PostgreSQL 18](https://www.postgresql.org/)                              |
| 认证     | [Better Auth](https://www.better-auth.com/)（邮箱验证码 / 邮箱密码）      |
| CSS      | [UnoCSS](https://unocss.dev/) + [Ant Design](https://ant.design/)（后台） |
| 校验     | [Zod](https://zod.dev/)                                                   |
| 文件存储 | 本地 / 阿里云 OSS / AWS S3                                                |

## 工程化

| 工具                                       | 用途                                            |
| ------------------------------------------ | ----------------------------------------------- |
| [Biome](https://biomejs.dev/)              | 代码格式化与 Lint                               |
| [Vitest](https://vitest.dev/)              | 单元测试                                        |
| [Playwright](https://playwright.dev/)      | E2E 测试                                        |
| [Husky](https://typicode.github.io/husky/) | Git hooks（pre-commit / commit-msg / pre-push） |
| [Commitlint](https://commitlint.js.org/)   | 提交信息规范 (`type: subject`)                  |
| [cspell](https://cspell.org/)              | 拼写检查                                        |

## 项目结构

```
src/
├── app/                    # Next.js App Router 路由
│   ├── (portal)/           # 门户网站页面
│   ├── admin/              # 管理后台页面
│   ├── api/                # API 路由（tRPC、Better Auth、文件上传）
│   └── signin/             # 登录页
├── components/             # 通用组件
├── constants/              # 前端配置 schema 等常量
├── context/                # React Context
├── hooks/                  # 自定义 React hooks
├── lib/                    # 客户端/通用工具（tRPC 客户端、auth-client 等）
├── server/
│   ├── api/routers/        # tRPC routers
│   ├── db/                 # Drizzle schema & 数据库连接
│   ├── better-auth/        # Better Auth 配置
│   └── services/           # 业务服务层
├── styles/                 # 全局样式
└── types/                  # 共享类型与枚举
```

## 功能模块

### 门户网站

| 页面         | 路径                    |
| ------------ | ----------------------- |
| 首页         | `/`                     |
| 关于我们     | `/about`                |
| 平台介绍     | `/platform`             |
| 免疫肿瘤学   | `/immuno-oncology`      |
| 生物科技合作 | `/biotech-partnerships` |
| 制药解决方案 | `/pharma-solutions`     |
| 肿瘤类型     | `/tumor-types`          |
| 案例研究     | `/case-studies`         |
| 出版物       | `/publications`         |
| 常见问题     | `/faq`                  |
| 联系我们     | `/contact`              |
| 报价申请     | `/request-quote`        |

### 管理后台

| 模块     | 说明                    |
| -------- | ----------------------- |
| 癌症类型 | 肿瘤分类数据管理        |
| 案例研究 | 案例内容的增删改查      |
| 常见问题 | FAQ 分类与条目管理      |
| 线索管理 | 用户提交的联系/报价表单 |
| 新闻资讯 | 新闻内容发布与管理      |
| 出版物   | 学术出版物管理          |
| 资源管理 | 页面资源配置            |
| 团队成员 | 团队信息管理            |
| 系统设置 | 站点配置                |

## 快速开始

**环境要求：** Node.js ≥ 22、pnpm ≥ 10、Docker

```bash
# 1. 安装依赖
pnpm install

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env，填入数据库连接和认证配置

# 3. 启动数据库（Docker；compose 文件要求 APP_IMAGE / NGINX_IMAGE，仅起 db 时填占位值即可）
APP_IMAGE=unused NGINX_IMAGE=unused docker compose --profile dev up -d db

# 4. 执行数据库迁移
pnpm db:migrate

# 5. 启动开发服务器
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看门户，[http://localhost:3000/admin](http://localhost:3000/admin) 进入管理后台。

## 环境变量

完整配置说明见 [.env.example](.env.example)，以下为必填项：

| 变量                 | 说明                         |
| -------------------- | ---------------------------- |
| `DATABASE_URL`       | PostgreSQL 连接字符串        |
| `BETTER_AUTH_SECRET` | JWT 签发密钥（生产环境必填） |
| `BETTER_AUTH_URL`    | 应用访问地址                 |
| `ADMIN_EMAILS`       | 管理员邮箱白名单（逗号分隔） |

### 认证方式

通过 `AUTH_METHOD` 切换：

- `email-otp`（默认）— 邮箱验证码登录，需配置 SMTP
- `email-password` — 邮箱密码登录

### 文件存储

通过 `STORAGE_PROVIDER` 切换：

- `local`（默认）— 存储到 `public/uploads/`，仅适合单机开发
- `oss` — 阿里云 OSS，需配置 `OSS_*` 变量
- `s3` — AWS S3 或兼容服务（MinIO、Cloudflare R2 等），需配置 `S3_*` 变量

## 常用命令

| 命令                 | 说明                           |
| -------------------- | ------------------------------ |
| `pnpm dev`           | 启动开发服务器（Turbopack）    |
| `pnpm build`         | 生产构建                       |
| `pnpm start`         | 启动生产服务器                 |
| `pnpm lint`          | Biome lint 检查                |
| `pnpm lint:fix`      | Biome 自动修复                 |
| `pnpm type-check`    | TypeScript 类型检查            |
| `pnpm spell-check`   | 拼写检查                       |
| `pnpm test`          | 运行单元测试                   |
| `pnpm test:watch`    | 监听模式运行测试               |
| `pnpm test:coverage` | 测试覆盖率报告                 |
| `pnpm test:e2e`      | 运行 E2E 测试                  |
| `pnpm db:generate`   | 生成数据库迁移文件             |
| `pnpm db:migrate`    | 执行数据库迁移                 |
| `pnpm db:push`       | 推送 schema 到数据库（开发用） |
| `pnpm db:seed`       | 导入测试数据                   |
| `pnpm db:studio`     | 打开 Drizzle Studio            |
| `pnpm commit`        | 交互式规范提交（czg）          |

## 部署

项目提供 `Dockerfile` 和 `docker-compose.yml`，支持容器化部署。

```bash
# 构建应用镜像与 nginx 镜像（nginx 镜像内含 Next.js 静态资源，不能直接用官方 nginx:alpine）
docker build --target runner -t organova-app .
docker build --target nginx -t organova-nginx .

# 启动服务
APP_IMAGE=organova-app NGINX_IMAGE=organova-nginx docker compose up -d
```

本地存在 `docker-compose.override.yml` 时，`docker compose up -d --build` 会自动构建并使用 `organova-app:local` / `organova-nginx:local`。

生产环境默认监听 `HOST_PORT`（默认 80），通过 Nginx 反向代理到应用容器。线上部署走 GitHub Actions（`Build and Deploy`，仅允许默认分支且 Check Quality 通过的提交）。

数据库迁移在容器启动时自动执行（`node migrate.mjs`），无需单独操作；本地开发用 `pnpm db:migrate`（同一脚本）。迁移需保持向后兼容（先加后删），因为回滚只回退镜像、不回退表结构。
