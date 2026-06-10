# 需求规格说明书 — 甜品面包店前端网页

## 1. 原始 Prompt

> 设计一个甜品面包店的前端网页设计。技术使用pinia,router,axios,element-plus

## 2. 项目概述

为一家甜品面包店（品牌名：蜜语甜心 Sweet Whisper Bakery）设计并实现一套完整的品牌展示前端 Web 应用。项目为纯前端 SPA 应用，使用 Vue 3 生态技术栈，通过 `axios-mock-adapter` 拦截 axios 请求返回 Mock 数据，展示甜品面包店的品牌形象、产品目录、品牌故事、门店联系信息等核心展示内容。

前端源码位于 `frontend-user/` 目录（遵循 Alkaid-SOP 命名规范）。

## 3. 业务需求

### 3.1 页面清单

| 页面 | 路由 | 功能描述 |
|------|------|----------|
| 首页 | `/` | 轮播Banner、分类入口、人气推荐、品牌故事、新品上市、品牌优势 |
| 全部产品 | `/products` | 产品目录、分类筛选、排序、搜索 |
| 产品详情 | `/product/:id` | 产品大图展示、描述、价格参考、服务说明、引导联系 |
| 关于我们 | `/about` | 品牌故事、理念、数据展示、团队介绍 |
| 联系我们 | `/contact` | 联系信息、留言表单（含表单验证） |

### 3.2 功能需求

- **产品展示**：支持按分类（面包/蛋糕/甜品）筛选，按价格、销量、评分排序
- **搜索功能**：Header 搜索栏支持关键词搜索产品
- **响应式设计**：适配桌面端和移动端，移动端使用抽屉式菜单
- **路由过渡**：页面切换带 fade 过渡动画
- **表单验证**：联系我们页面表单包含姓名、电话、邮箱、类型、留言的完整验证

### 3.3 产品数据

共 12 款甜品产品，涵盖 3 个分类：
- **面包**（bread）：经典法式可颂、全麦核桃欧包、伯爵红茶司康、丹麦肉桂卷
- **蛋糕**（cake）：抹茶白巧克力蛋糕、草莓千层蛋糕、巧克力熔岩蛋糕、蓝莓芝士蛋糕
- **甜品**（dessert）：焦糖玛奇朵泡芙、提拉米苏杯、芒果椰奶冻、柠檬马卡龙礼盒

## 4. 技术规格

### 4.1 指定技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue 3 | ^3.4 | 前端框架（Composition API） |
| Pinia | ^2.1 | 状态管理（产品数据、分类、搜索） |
| Vue Router | ^4.3 | 路由管理（5个页面 + 路由守卫） |
| Axios | ^1.7 | HTTP 请求封装（请求/响应拦截器） |
| Element Plus | ^2.7 | UI 组件库 |

### 4.2 辅助技术

| 技术 | 用途 |
|------|------|
| Vite 5 | 构建工具 |
| axios-mock-adapter | Mock 网络层，使 axios 拦截器真实生效 |
| @element-plus/icons-vue | 图标库 |
| unplugin-auto-import / unplugin-vue-components | Element Plus 按需导入 |
| Nginx | 生产环境静态文件服务 |

### 4.3 Pinia Store 设计

| Store | 状态 | 核心功能 |
|-------|------|----------|
| `product` | products, categories, currentCategory, searchKeyword, loading | fetchProducts, fetchProductById, fetchCategories, filteredProducts, featuredProducts |

### 4.4 Axios 封装

- 创建独立 axios 实例，配置 baseURL、timeout、headers
- 挂载 `axios-mock-adapter`：拦截全部 `/api/*` 请求，返回 Mock 数据，保证 axios 拦截器真实生效
- 请求拦截器：注入 Authorization Token（localStorage）
- 响应拦截器：统一解包 `response.data.data`，业务错误 reject 由调用层处理
- Mock API 接口清单：

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/categories` | 获取分类列表 |
| GET | `/api/products` | 获取产品列表 |
| GET | `/api/products/:id` | 获取产品详情（含404处理） |
| POST | `/api/contact` | 提交联系表单 |

## 5. Docker 交付适配策略

| 项目 | 方案 |
|------|------|
| 构建方式 | 多阶段构建：Node 构建 → Nginx 静态服务 |
| 基础镜像 | `node:20-alpine`（构建）→ `nginx:alpine`（运行），均支持 ARM64/AMD64 |
| 端口映射 | 容器内 80 → 宿主机 8081 |
| 健康检查 | `curl -f http://localhost/health \|\| exit 1` |
| 启动日志 | 打印 "Startup Success" 及访问 URL |

## 6. 冲突解决日志

| 冲突项 | AI 分析 | 用户决策 |
|--------|---------|----------|
| （暂无冲突） | — | — |

## 7. 确认事项

| 序号 | 确认项 | 状态 |
|------|--------|------|
| 1 | 纯前端展示项目，使用 axios-mock-adapter 模拟后端 API | ✅ 已确认 |
| 2 | 技术栈：Vue3 + Pinia + Router + Axios + Element Plus | ✅ 已确认 |
| 3 | Docker 交付：Nginx 静态服务，端口 8081 | ✅ 已确认 |
| 4 | 项目结构遵循 Alkaid-SOP 命名规范（frontend-user/） | ✅ 已确认 |
| 5 | 无购物车/支付/订单功能，为品牌展示型网站 | ✅ 已确认 |
