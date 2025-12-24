[中文](./readme.md) | [English](./readme_en.md)

根据您的浏览器语言自动设置文本语言，目前只准备了中文和英语两个版本，如果需要更多，请提 issue 或者在商店页留言。

---

# Find whatever 🔍

> **超越浏览器原生搜索的极致体验。**
> 这是一个功能强大、界面美观、深度定制的网页文本查找工具。它不仅支持传统的关键词搜索，还引入了跨标签搜索、正则匹配、动态监听等高级功能。

## ✨ 核心特性

| 🎨 **极致视觉** | 🚀 **强大搜索** | ⌨️ **快捷操作** |
| :--- | :--- | :--- |
| 支持 自动/明亮/暗黑 模式，提供毛玻璃（Frosted Glass）环境感知效果。 | 支持正则表达式、全字匹配、大小写敏感，甚至可以跨 HTML 标签查找文本。 | 深度集成快捷键，完全自定义，支持覆盖浏览器内置 `Ctrl+F`。 |



## 🎯 功能大观

### 1. 智能交互面板
*   **随心拖拽**：专设拖拽条，支持自定义位置并自动记忆。窗口大小变动时智能重置，防止面板“走丢”。
*   **透明度控制**：悬浮时临时透明，或一键设为永久半透明，查找内容时不遮挡视线。
*   **多种显示模式**：可选择仅拖拽条触发或全面板拖拽。

### 2. 深度搜索能力
*   **跨标签搜索 (v3.0+)**：打破 HTML 标签限制（如 `<span>`, `<b>`, `<a>` 等），即使文字被标签切分也能精准定位。
*   **多页面/iframe 支持**：自动识别并穿透页面中的 `iframe`。
*   **动态监听 (MutationObserver)**：开启后，当页面内容发生变化（如瀑布流加载）时，搜索结果将自动实时更新。

### 3. 输入与历史记录
*   **自动填充**：选中文本自动填入，打开面板自动聚焦。
*   **搜索防抖**：内置 Debounce 机制，在高频输入或正则模式下保护浏览器性能。
*   **历史管理**：最近 50 条记录自动保存，支持“一键固定（Pin）”常用搜索词。

### 4. 结果定位与反馈
*   **状态概览**：底边栏通过色块展示搜索结果在不同 iframe 中的分布与当前状态。
*   **快速复制**：点击搜索结果统计数字，即可直接复制当前关键词。
*   **智能滚动**：自动将目标结果滚动至视口中心。

## ⌨️ 快捷键指南 (Shortcuts)

为了极致的效率，我们提供了丰富的快捷键支持：

| 功能 | Windows/Linux | macOS |
| :--- | :--- | :--- |
| **打开/关闭面板** | `Alt + F` (默认) | `Alt + F` |
| **下一个匹配项** | `Enter` | `Enter` |
| **上一个匹配项** | `Shift + Enter` | `Shift + Enter` |
| **大小写敏感切换** | `Ctrl + C` | `Cmd + C` |
| **全字匹配切换** | `Ctrl + W` | `Cmd + W` |
| **正则模式切换** | `Ctrl + R` | `Cmd + R` |
| **动态监听开关** | `Ctrl + D` | `Cmd + D` |
| **关闭并清除痕迹** | `Esc` | `Esc` |

> *提示：您可以在 `chrome://extensions` 中将快捷键设置为 `Ctrl+F` 或 `Cmd+F` 来完美替代系统原生搜索。*


## 📦 如何安装

- **chrome**：https://chromewebstore.google.com/detail/find-whatever-regex-auto/pdpkckoiaiinjlhddhcoknjhdncepnbo
- **edge**：https://microsoftedge.microsoft.com/addons/detail/find-whatever-regex-a/dfmiobmbhchkjnehfkgpoddfkhonafmk
- **firefox**：https://addons.mozilla.org/zh-CN/firefox/addon/find-whatever/


## 🤝 反馈与建议

如果您在使用过程中遇到搜索结果不准确、页面卡顿或有更好的功能建议：
*   请及时通过 GitHub Issues 或者 2223133607@qq.com 联系我。
*   反馈 Bug 时，请附带该页面的 URL。

## 🌟 支持我

如果您觉得这个项目对您有帮助，欢迎给我点个 Star 🌟 或在 Chrome 商店或 Product Hunt 上给我留下评分和评论。这将是我持续创作的最大动力！

<a href="https://www.producthunt.com/products/find-whatever-regex-auto-re-find?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-find&#0045;whatever&#0045;regex&#0045;auto&#0045;re&#0045;find" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=987390&theme=light&t=1751507461541" alt="Find&#0032;whatever&#0032;&#0045;&#0032;regex&#0032;&#0038;&#0032;auto&#0032;re&#0045;find - Enhance&#0032;your&#0032;browser&#0039;s&#0032;find&#0032;capabilities&#0046; | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>


## 🛠 开发

1. 执行 `npm install`
2. 执行 `npm run start`
3. 执行 `npx tailwindcss -i ./src/global.css -o ./src/output.css --watch`
4. 打开扩展程序的开发者模式，加载已解压的扩展程序，把 `build` 目录放进去

*firefox 版本特殊命令：`npm run start:ff` 和 `npm run build:ff`*

## License
[GPL-3.0-only](LICENSE)
