# 迁移为标准 React + Vite 应用

## Context
当前项目使用 `vinext`、Cloudflare Workers 与 React Server Components 启动。Enter 的实时预览需运行轻量、稳定的 Vite 客户端开发服务器；现有架构会额外启动 `workerd` 并经历多阶段编译，导致预览健康检查反复重启、停留在 “working in progress”。

本次迁移保留现有 GRIPH 首页的视觉效果、交互动效和 `public/assets` 全部图片资源，只替换运行架构；不新增后端、数据库或商品结算功能。

## 实施方案

1. 建立标准 Vite 入口
   - 新建 `index.html`，提供 `#root` 容器、法语页面语言、标题、描述和 favicon。
   - 新建 `src/main.tsx`，使用 `createRoot` 挂载应用并导入全局样式。
   - 将 `app/page.tsx` 的现有客户端首页逻辑迁移为 `src/App.tsx`。保留：开场动画、菜单/搜索/购物车面板、海报交互、滚动展示与当前图片路径。
   - 将 `app/globals.css` 迁移为 `src/index.css`，确保所有现有类名与响应式样式保持可用。

2. 精简配置与依赖
   - 用仅包含 `@vitejs/plugin-react`、`vite-plugin-enter-dev` 的 `vite.config.ts` 替换 vinext、Cloudflare、RSC 和 sites 插件；保持 `host: "0.0.0.0"`，使预览代理可访问。
   - 更新 `package.json` 的 `dev`、`build`、`preview` 与 `lint` 脚本为 Vite/ESLint 标准命令，并移除 Next.js、vinext、Wrangler、Cloudflare、Drizzle 与 RSC 专用包。
   - 更新 `tsconfig.json`，移除 Next.js 类型插件和 `.next` 输入，保留 React JSX、严格类型与 Vite 适用的编译选项。
   - 移除已经不再参与运行的 Next.js / Workers / Sites / Drizzle 相关配置、脚本、测试与应用目录文件，避免误用旧构建路径。

3. 清理生成目录
   - 保留 `public/assets` 作为静态资源来源。
   - 保持 `.vinext/` 忽略规则，并删除其遗留的跟踪文件，防止再次引用机器特定绝对路径。

## Implementation checklist

- [x] 创建 `index.html`、`src/bootstrap.tsx` 和 `src/App.tsx`，使 React 首页能从 `#root` 独立挂载。
- [x] 将 `app/page.tsx` 的首页状态、键盘事件、动画与图片资源路径完整迁移到 `src/App.tsx`。
- [x] 将 `app/globals.css` 迁移到 `src/index.css`，并由 `src/bootstrap.tsx` 导入。
- [x] 将 `vite.config.ts` 改为只使用 Enter 预览插件内置的 React 插件，监听 `0.0.0.0`。
- [x] 将 `package.json` 脚本和依赖收敛为 React + Vite + ESLint 所需集合，并更新锁文件。
- [x] 将 `tsconfig.json` 移除 Next.js 特有配置，保留 Vite + React TypeScript 配置。
- [x] 删除未使用的 Next.js、vinext、Workers、Drizzle 与 Sites 运行文件；保留 `public/assets` 和 favicon。
- [x] 取消追踪 `.vinext/` 遗留生成文件，并保留其忽略规则。

## Verification checklist

- [ ] `pnpm run dev` 启动为单一 Vite 客户端服务，不再启动 `workerd` 或 vinext 多环境编译。
- [ ] 实时预览入口能在健康检查窗口内返回页面，不再显示 “working in progress”。
- [ ] 首页能加载 `/assets/hero.jpg`、海报图片、logo、tiger 和 footer 图像，浏览器网络请求无 404。
- [ ] 开场遮罩按默认动画退出；系统“减少动态效果”偏好下仍能快速进入首页。
- [ ] 菜单、搜索弹层、购物车抽屉和海报 hover/focus 状态仍可交互；Escape 能关闭弹层。
- [ ] 窄视口下导航、横向海报轨道、卡片和页脚保持可见且无水平页面溢出。
- [ ] `pnpm run build` 成功输出 Vite 静态产物。
- [ ] `pnpm run lint` 无 error；仅允许已有样式/图片相关非阻断 warning。
