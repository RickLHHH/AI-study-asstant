# AI法考案例分析助手

基于 DeepSeek-R1 深度思考模型的智能法律案例分析工具，专为法考（国家统一法律职业资格考试）考生设计。

![Version](https://img.shields.io/badge/version-1.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-cyan.svg)

## ✨ 核心功能

- 🔍 **案例智能分析** - 输入法律案例，AI自动提取涉案法条、考点
- 🧠 **思维链展示** - 展示 DeepSeek-R1 的完整推理过程
- 📝 **智能出题** - 基于案例生成符合法考大纲的选择题
- ❌ **错题解析** - 提供详细解析和常见错误分析
- 📚 **历史记录** - 自动保存分析历史，支持回顾复习

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript 5.x
- **样式**: Tailwind CSS 3.4
- **UI组件**: shadcn/ui (基于 Radix UI)
- **动画**: Framer Motion
- **图表**: Recharts
- **状态管理**: Zustand (客户端状态)
- **数据存储**: localStorage (历史记录持久化)
- **AI服务**: DeepSeek API (deepseek-reasoner模型)

## 🚀 快速开始

### 本地开发

1. **克隆项目**
```bash
git clone <your-repo-url>
cd my-app
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
```bash
cp .env.example .env.local
# 编辑 .env.local，填入你的 DeepSeek API Key
```

4. **启动开发服务器**
```bash
npm run dev
```

访问 http://localhost:3000

### 获取 DeepSeek API Key

1. 访问 [DeepSeek 开放平台](https://platform.deepseek.com/)
2. 注册/登录账号
3. 进入「API Keys」页面创建新密钥
4. 将密钥填入 `.env.local` 文件

## 🌐 部署到 Railway

### 方式一：通过 GitHub 自动部署

1. **Fork 或推送代码到 GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. **在 Railway 创建项目**
   - 登录 [Railway](https://railway.app/)
   - 点击 "New Project"
   - 选择 "Deploy from GitHub repo"
   - 选择你的仓库

3. **配置环境变量**
   - 进入项目 Settings → Variables
   - 添加变量：`DEEPSEEK_API_KEY=your_api_key_here`

4. **部署**
   - Railway 会自动检测 `railway.json` 和 `nixpacks.toml` 配置
   - 每次推送到 main 分支会自动重新部署

### 方式二：Railway CLI 部署

```bash
# 安装 Railway CLI
npm install -g @railway/cli

# 登录
railway login

# 初始化项目
railway init

# 添加环境变量
railway variables set DEEPSEEK_API_KEY=your_api_key_here

# 部署
railway up
```

## 📁 项目结构

```
my-app/
├── app/                          # Next.js App Router
│   ├── api/analyze-case/         # 案例分析 API (流式 SSE)
│   ├── page.tsx                  # 主页面
│   ├── layout.tsx                # 根布局
│   └── globals.css               # 全局样式
├── components/
│   ├── ui/                       # shadcn/ui 基础组件
│   ├── case-input/               # 左侧输入区
│   ├── analysis-result/          # 中央分析区
│   ├── quiz-section/             # 右侧题目区
│   └── layout/                   # 布局组件
├── lib/                          # 工具库
├── stores/                       # Zustand 状态管理
├── types/                        # TypeScript 类型定义
└── public/                       # 静态资源
```

## 🎨 界面预览

- **桌面端**: 三栏布局 (3:4:3)，左侧输入、中央分析、右侧答题
- **平板端**: 两栏布局，输入区40%、结果区60%
- **移动端**: 单栏步骤流程，底部固定导航

## 🔒 环境变量

| 变量名 | 必填 | 说明 |
|-------|------|------|
| `DEEPSEEK_API_KEY` | ✅ | DeepSeek API 密钥 |

## 📝 使用说明

1. 在左侧输入框粘贴法律案例（至少20字）
2. 可选择性指定科目分类，或让AI自动识别
3. 点击「开始分析」，AI将展示推理过程
4. 查看分析结果：法条、考点、思维链
5. 在右侧完成AI生成的模拟题
6. 查看解析和常见错误分析

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
