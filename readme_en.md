[中文](./readme.md) | [English](./readme_en.md)

---

# Find whatever 🔍

An in-page search enhancement extension tailored for complex modern web pages. Built to resolve search limitations across nested iframes, Shadow DOM, segmented HTML tags, and dynamically loaded content.

<div>
	<img width="410" height="100" alt="image" src="https://github.com/user-attachments/assets/c5ffc073-1986-4267-85fd-d9d5f7b28487" />
	<img width="410" height="100" alt="image" src="https://github.com/user-attachments/assets/9eda61e8-8157-40ba-b9af-1270d5c32619" />
</div>
<div>
	<img width="407" height="100" alt="image" src="https://github.com/user-attachments/assets/048c1c49-d3e4-46ab-b9e0-04b0c2c4c942" />
	<img width="407" height="100" alt="image" src="https://github.com/user-attachments/assets/4c7ba082-68a7-4800-b070-90d9bf010c9e" />
</div>

## Key Capabilities

- **Cross-Tag & Cross-Line Matching**: Powered by an in-memory text projection model, it continuously matches text split across inline tags (`<span>`, `<code>`, `<b>`) and line breaks without altering DOM structure.
- **Deep Penetration**: Traverses open Shadow DOM, nested multi-domain iframes, and inline SVG text. The frame navigator automatically skips empty frames with zero matches.
- **Dynamic DOM Monitoring**: Backed by MutationObserver, it automatically re-runs search when content dynamically loads via infinite scroll, AJAX, or Tab switching.
- **Regex Support & Safety Protection**: Supports full regular expressions with Unicode mode (`u` flag) and includes an anti-freeze heuristic probe to block dangerous runaway patterns.
- **Zero DOM Pollution & No Layout Thrashing**: The floating UI is isolated in an independent ShadowRoot. Visibility checking leverages native `checkVisibility` to eliminate layout recalculation.
- **Lightweight & Fast**: Completely decoupled from React and Ant Design in v5.0, built with Preact and Rspack for minimal memory overhead.

## Shortcuts

| Action | Windows / Linux | macOS |
| :--- | :--- | :--- |
| **Open / Close Panel** | `Alt + F` (Default) | `Alt + F` |
| **Next Match** | `Enter` | `Enter` |
| **Previous Match** | `Shift + Enter` | `Shift + Enter` |
| **Toggle Case Sensitive** | `Ctrl + C` | `Cmd + C` |
| **Toggle Whole Word** | `Ctrl + W` | `Cmd + W` |
| **Toggle Regex Mode** | `Ctrl + R` | `Cmd + R` |
| **Toggle Dynamic Monitor** | `Ctrl + D` | `Cmd + D` |
| **Close Panel** | `Esc` | `Esc` |

> *Tip: You can rebind the shortcut to `Ctrl+F` or `Cmd+F` in `chrome://extensions/shortcuts` or `edge://extensions/shortcuts` to seamlessly replace the browser's built-in find bar.*

## Installation

- **Chrome Web Store**: [Find whatever on Chrome Web Store](https://chromewebstore.google.com/detail/find-whatever-regex-auto/pdpkckoiaiinjlhddhcoknjhdncepnbo)
- **Edge Add-ons**: [Find whatever on Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/find-whatever-regex-a/dfmiobmbhchkjnehfkgpoddfkhonafmk)

## Development

1. Clone repo and install dependencies: `npm install`
2. Start development mode with hot rebuild: `npm run start`
3. Open browser extension settings, enable "Developer mode", click "Load unpacked", and select the `build` directory
4. Build production bundle: `npm run build` (generates the release archive in `zip/`)

## Feedback

If you encounter inaccurate search results, edge cases, or have suggestions, feel free to open a [GitHub Issue](https://github.com/ImSwordTooth/findwhatever/issues) or reach out via email at 2223133607@qq.com.

## License

[GPL-3.0-only](LICENSE)
