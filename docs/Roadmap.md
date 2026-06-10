# 开发路线图 — 甜品面包店前端网页

## 项目概览

| 属性 | 值 |
|------|-----|
| 项目名称 | 蜜语甜心 Sweet Whisper Bakery |
| 项目类型 | 纯前端品牌展示 SPA |
| 技术栈 | Vue 3 + Pinia + Vue Router + Axios + axios-mock-adapter + Element Plus + Vite |
| 交付方式 | Docker（Nginx 静态服务） |
| 前端端口 | 8081 |

## 技术架构

```
┌──────────────────────────────────────────────┐
│                  Browser                     │
├──────────────────────────────────────────────┤
│              Vue 3 SPA (Vite)                │
│  ┌──────────┬──────────┬──────────────────┐  │
│  │  Router   │  Pinia   │  Element Plus    │  │
│  │ (5 pages) │(1 store) │  (UI Components) │  │
│  └────┬─────┴────┬─────┴────────┬─────────┘  │
│       │          │              │             │
│  ┌────▼──────────▼──────────────▼──────────┐  │
│  │          Axios (API Layer)              │  │
│  │   ┌─────────────────────────────────┐  │  │
│  │   │  axios-mock-adapter (Mock网络层) │  │  │
│  │   │  GET/POST /api/* → Mock Data    │  │  │
│  │   └─────────────────────────────────┘  │  │
│  └─────────────────────────────────────────┘  │
├──────────────────────────────────────────────┤
│          Docker (Nginx Alpine)               │
│          Port: 8081 → 80                     │
└──────────────────────────────────────────────┘
```

## 文件结构

```
label-02271/
├── .alkaid-sop              # SOP 协议标记文件
├── .dockerignore            # Docker 构建忽略规则
├── .gitignore               # Git 忽略规则
├── Dockerfile               # 多阶段构建（Node→Nginx + curl）
├── docker-compose.yml       # Docker Compose 编排（端口 8081）
├── README.md                # 项目说明（SOP 标准格式）
├── docs/
│   ├── Requirements.md      # 需求规格说明书
│   ├── Roadmap.md           # 开发路线图（本文档）
│   ├── DesignSpec.md        # 设计规范
│   ├── SelfTestReport.md    # 自测报告
│   └── AuditReport.md       # 审计报告
└── frontend-user/           # 用户端前端（Alkaid-SOP 命名规范）
    ├── package.json         # 依赖声明
    ├── package-lock.json    # 依赖锁定
    ├── vite.config.js       # Vite 构建配置
    ├── index.html           # 入口 HTML
    ├── nginx.conf           # Nginx 配置（SPA 路由 + gzip + 健康检查）
    ├── public/
    │   ├── vite.svg         # 站点图标
    │   └── images/          # 本地静态图片（31张）
    │       ├── banners/     # 轮播横幅（3张）
    │       ├── products/    # 产品图片（23张）
    │       ├── about/       # 品牌故事 + 关于页横幅（2张）
    │       └── team/        # 团队头像（3张）
    └── src/
        ├── main.js              # 应用入口
        ├── App.vue              # 根组件（Header + RouterView + Footer）
        ├── config/
        │   └── index.js         # 全局配置（API参数等）
        ├── api/
        │   └── index.js         # Axios 实例 + 拦截器 + 业务 API 函数
        ├── assets/
        │   └── styles/
        │       └── main.css     # 全局样式 + Element Plus 主题覆盖
        ├── components/
        │   ├── AppHeader.vue    # 顶部导航栏（搜索、移动端抽屉）
        │   ├── AppFooter.vue    # 页脚（品牌、链接、联系方式）
        │   ├── HeroBanner.vue   # 首页轮播横幅
        │   └── ProductCard.vue  # 产品卡片（图片、标签、价格、评分）
        ├── mock/
        │   ├── products.js      # Mock 数据（12款产品 + 3个分类）
        │   └── adapter.js       # axios-mock-adapter 路由注册（4个接口）
        ├── router/
        │   └── index.js         # 路由配置（5条路由 + 守卫）
        ├── stores/
        │   └── product.js       # 产品 Store（列表、分类、搜索、筛选）
        └── views/
            ├── HomeView.vue          # 首页
            ├── ProductsView.vue      # 产品列表页
            ├── ProductDetailView.vue # 产品详情页
            ├── AboutView.vue         # 关于我们页
            └── ContactView.vue       # 联系我们页
```

## 依赖清单

| 包名 | 版本 | 类型 |
|------|------|------|
| vue | ^3.4.0 | dependencies |
| vue-router | ^4.3.0 | dependencies |
| pinia | ^2.1.0 | dependencies |
| axios | ^1.7.0 | dependencies |
| axios-mock-adapter | ^2.1.0 | dependencies |
| element-plus | ^2.7.0 | dependencies |
| @element-plus/icons-vue | ^2.3.0 | dependencies |
| vite | ^5.4.0 | devDependencies |
| @vitejs/plugin-vue | ^5.0.0 | devDependencies |
| unplugin-auto-import | ^0.17.0 | devDependencies |
| unplugin-vue-components | ^0.27.0 | devDependencies |

---

## Phase 1：项目基础搭建

| ID | 任务 | 状态 |
|----|------|------|
| P1-01 | 初始化 Vite + Vue 3 项目，配置 package.json | [x] |
| P1-02 | 配置 vite.config.js（路径别名、Element Plus 按需导入） | [x] |
| P1-03 | 创建入口文件 main.js（注册 Pinia、Router、Element Plus） | [x] |
| P1-04 | 创建 App.vue 根组件（Header + RouterView 过渡 + Footer） | [x] |
| P1-05 | 创建全局样式 main.css（重置样式、Element Plus 主题覆盖、滚动条） | [x] |

## Phase 2：路由与状态管理

| ID | 任务 | 状态 |
|----|------|------|
| P2-01 | 配置 Vue Router（5 个页面路由 + 懒加载 + 滚动行为 + 路由守卫） | [x] |
| P2-02 | 创建 Product Pinia Store（产品列表、分类、搜索、筛选、API 调用） | [x] |

## Phase 3：API 层与数据

| ID | 任务 | 状态 |
|----|------|------|
| P3-01 | 封装 Axios 实例（baseURL、timeout、请求/响应拦截器） | [x] |
| P3-02 | 创建 Mock 数据（12 款产品、3 个分类） | [x] |
| P3-03 | 配置 axios-mock-adapter，注册 4 个 API 接口 | [x] |

## Phase 4：公共组件

| ID | 任务 | 状态 |
|----|------|------|
| P4-01 | AppHeader 组件（Logo、导航、搜索、移动端抽屉菜单、滚动效果） | [x] |
| P4-02 | AppFooter 组件（品牌信息、快速链接、分类链接、联系方式） | [x] |
| P4-03 | ProductCard 组件（图片悬浮、标签、价格、评分、查看详情） | [x] |
| P4-04 | HeroBanner 组件（轮播、3 张 Slide、CTA 按钮） | [x] |

## Phase 5：页面视图

| ID | 任务 | 状态 |
|----|------|------|
| P5-01 | HomeView 首页（轮播 + 分类入口 + 推荐 + 品牌故事 + 新品 + 特色优势） | [x] |
| P5-02 | ProductsView 产品列表页（分类筛选 + 排序 + 搜索 + 空状态） | [x] |
| P5-03 | ProductDetailView 产品详情页（图片切换 + 价格 + 描述 + 服务 + 引导预约） | [x] |
| P5-04 | AboutView 关于我们页（品牌故事 + 理念 + 数据 + 团队） | [x] |
| P5-05 | ContactView 联系我们页（联系信息 + 表单验证） | [x] |

## Phase 6：Docker 交付与文档

| ID | 任务 | 状态 |
|----|------|------|
| P6-01 | 创建 .gitignore 并初始化 Git 仓库 | [x] |
| P6-02 | 创建 Dockerfile（多阶段构建：Node 20 Alpine → Nginx Alpine） | [x] |
| P6-03 | 创建 nginx.conf（SPA 路由、gzip、缓存策略） | [x] |
| P6-04 | 创建 docker-compose.yml（端口 8081、健康检查） | [x] |
| P6-05 | 创建 README.md（SOP 标准格式） | [x] |
| P6-06 | 创建 docs/DesignSpec.md | [x] |
| P6-07 | 创建 docs/SelfTestReport.md | [x] |

## Phase 7：审计修复

| ID | 任务 | 状态 |
|----|------|------|
| P7-01 | 修复 Docker 健康检查（nginx:alpine 安装 curl，wget → curl -f） | [x] |
| P7-02 | 移除生产代码 console.error，替换为 ElMessage.error 用户提示 | [x] |
| P7-03 | ProductDetailView 添加空状态处理（el-empty + 返回按钮） | [x] |
| P7-04 | 提取硬编码配置值至 src/config/index.js | [x] |
| P7-05 | 下载 31 张图片至本地 public/images/，替换所有外部 URL | [x] |
| P7-06 | 创建 docs/AuditReport.md 并更新所有问题为已修复 | [x] |
| P7-07 | 引入 axios-mock-adapter，重写 API 函数使 axios 调用链真实生效 | [x] |
