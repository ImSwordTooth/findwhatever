[中文](./readme.md) | [English](./readme_en.md)

---

# Find whatever 🔍

针对复杂现代网页量身打造的页面内查找增强扩展。专为解决深层 iframe、Shadow DOM、跨 HTML 标签分词以及动态加载页面的查找痛点。

<div>
	<img width="410" height="100" alt="image" src="https://github.com/user-attachments/assets/c5ffc073-1986-4267-85fd-d9d5f7b28487" />
	<img width="410" height="100" alt="image" src="https://github.com/user-attachments/assets/9eda61e8-8157-40ba-b9af-1270d5c32619" />
</div>
<div>
	<img width="407" height="100" alt="image" src="https://github.com/user-attachments/assets/048c1c49-d3e4-46ab-b9e0-04b0c2c4c942" />
	<img width="407" height="100" alt="image" src="https://github.com/user-attachments/assets/4c7ba082-68a7-4800-b070-90d9bf010c9e" />
</div>

## 核心能力

- **跨标签与跨换行连续查找**：基于纯内存文本投影映射，突破 `<span>`、`<code>`、`<b>` 等行内标签及换行符的限制，无损匹配完整词句。
- **深度穿透**：原生穿透开放式 Shadow-DOM、嵌套 iframe 及内嵌 SVG 文本，页面列表自动跳过 0 命中的空帧。
- **动态监听与自动重检**：接入 MutationObserver，在页面异步加载、瀑布流滚动或 Tab 切换时实时自动更新查找结果。
- **正则模式与安全防护**：支持完整正则表达式与 Unicode 模式，内置防挂起探针机制，防止死循环正则导致页面卡顿。
- **0 DOM 污染与零重排**：浮窗完全封装于隔离的 ShadowRoot 中；接入浏览器底层 `checkVisibility` 判定可见性，消除页面布局抖动。
- **轻量纯粹**：5.0 全面剔除 React、AntD 等重型依赖，基于 Preact + Rspack 构建，占用更低的浏览器前台资源。

## 快捷键

| 功能 | Windows / Linux | macOS |
| :--- | :--- | :--- |
| **打开 / 关闭面板** | `Alt + F` (默认) | `Alt + F` |
| **下一个匹配项** | `Enter` | `Enter` |
| **上一个匹配项** | `Shift + Enter` | `Shift + Enter` |
| **大小写敏感切换** | `Ctrl + C` | `Cmd + C` |
| **全字匹配切换** | `Ctrl + W` | `Cmd + W` |
| **正则模式切换** | `Ctrl + R` | `Cmd + R` |
| **动态监听开关** | `Ctrl + D` | `Cmd + D` |
| **关闭浮窗** | `Esc` | `Esc` |

> *提示：可以在浏览器的快捷键管理页（`chrome://extensions/shortcuts` 或 `edge://extensions/shortcuts`）中将快捷键直接映射为 `Ctrl+F` 或 `Cmd+F`，无缝替代浏览器自带的查找栏。*

## 安装

- **Chrome 网上应用店**：[Find whatever on Chrome Web Store](https://chromewebstore.google.com/detail/find-whatever-regex-auto/pdpkckoiaiinjlhddhcoknjhdncepnbo)
- **Edge 外接程序**：[Find whatever on Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/find-whatever-regex-a/dfmiobmbhchkjnehfkgpoddfkhonafmk)

## 本地开发

1. 克隆仓库并安装依赖：`npm install`
2. 启动开发模式（实时监听构建）：`npm run start`
3. 打开浏览器扩展程序管理页，开启“开发者模式”，点击“加载已解压的扩展程序”，选择项目生成的 `build` 目录
4. 生产打包：`npm run build`（自动在 `zip/` 目录生成发布包）

## 反馈与交流

如果在使用中遇到任何匹配异常、边界情况或有改进建议，欢迎提交 [GitHub Issues](https://github.com/ImSwordTooth/findwhatever/issues) 或邮件联系 2223133607@qq.com（反馈时建议附带问题页面的 URL）。

## License

[GPL-3.0-only](LICENSE)
