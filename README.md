## 1. How to Run

```bash
docker compose up --build -d
```

## 2. Services

| 服务 | 地址 |
|------|------|
| 用户端前端 | http://localhost:8081 |

## 3. 测试账号

本项目为纯前端展示项目，无需登录，无测试账号。

## 4. 题目内容

> 设计一个甜品面包店的前端网页设计。技术使用pinia,router,axios,element-plus

---

## 项目简介

**蜜语甜心 Sweet Whisper Bakery** — 一套甜品面包店品牌展示前端 Web 应用。

基于 Vue 3 生态构建的单页应用（SPA），纯展示性质，展示甜品面包店的品牌形象、产品目录、品牌故事、门店信息等内容。使用 `axios-mock-adapter` 拦截 axios 请求返回 Mock 数据，可独立运行。

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue 3 | ^3.4.0 | 前端框架（Composition API） |
| Pinia | ^2.1.0 | 状态管理（产品 Store） |
| Vue Router | ^4.3.0 | 路由管理（5 页面 + 懒加载 + 路由守卫） |
| Axios | ^1.7.0 | HTTP 请求封装（实例 + 拦截器） |
| axios-mock-adapter | ^2.1.0 | Mock 网络层（真实走 axios 调用链） |
| Element Plus | ^2.7.0 | UI 组件库（15+ 组件深度集成） |
| Vite | ^5.4.0 | 构建工具 |
| Nginx | alpine | 生产环境静态服务 |

## 项目结构

```
label-02271/
├── .alkaid-sop              # SOP 协议标记
├── .dockerignore            # Docker 构建忽略规则
├── .gitignore               # Git 忽略规则
├── Dockerfile               # 多阶段构建（Node 20 → Nginx + curl）
├── docker-compose.yml       # Docker 编排（端口 8081）
├── README.md                # 项目说明（本文档）
├── docs/
│   ├── Requirements.md      # 需求规格说明书
│   ├── Roadmap.md           # 开发路线图
│   ├── DesignSpec.md        # 设计规范
│   ├── SelfTestReport.md    # 自测报告
│   └── AuditReport.md       # 审计报告
└── frontend-user/           # 用户端前端
    ├── package.json
    ├── vite.config.js
    ├── index.html
    ├── nginx.conf
    ├── public/images/        # 本地静态图片（31张）
    └── src/
        ├── main.js           # 入口
        ├── App.vue           # 根组件
        ├── config/index.js   # 全局配置
        ├── api/index.js      # Axios 封装 + 业务 API 函数
        ├── mock/
        │   ├── products.js   # Mock 数据（12款产品 + 3个分类）
        │   └── adapter.js    # axios-mock-adapter 路由注册
        ├── router/index.js   # 路由配置（5条路由）
        ├── stores/
        │   └── product.js    # 产品 Pinia Store
        ├── components/       # 公共组件（4个）
        │   ├── AppHeader.vue
        │   ├── AppFooter.vue
        │   ├── HeroBanner.vue
        │   └── ProductCard.vue
        ├── views/            # 页面视图（5个）
        │   ├── HomeView.vue
        │   ├── ProductsView.vue
        │   ├── ProductDetailView.vue
        │   ├── AboutView.vue
        │   └── ContactView.vue
        └── assets/styles/    # 全局样式
```

## 功能特性

- **首页**：轮播 Banner、分类入口、人气推荐、品牌故事、新品上市、品牌优势
- **产品列表**：分类筛选（面包/蛋糕/甜品）、4 种排序、关键词搜索
- **产品详情**：图片画廊、价格展示、产品描述、服务保障、引导预约
- **关于我们**：品牌故事、核心理念、数据展示、团队介绍
- **联系我们**：门店信息、留言表单（含 5 项验证规则）
- **响应式设计**：桌面端 + 移动端适配，移动端抽屉菜单

## 冲突解决日志

| 冲突项 | AI 分析 | 用户决策 |
|--------|---------|----------|
| （无冲突） | — | — |
