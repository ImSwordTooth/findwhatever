[中文](./readme.md) | [English](./readme_en.md)

---

# Find whatever 🔍

> **The ultimate search experience beyond native browser limits.**
> A powerful, aesthetically pleasing, and highly customizable text-finding tool for your browser. It doesn't just find words; it redefines how you interact with content through cross-tag matching, regex support, and dynamic DOM monitoring.

<div>
	<img width="410" height="100" alt="image" src="https://github.com/user-attachments/assets/c5ffc073-1986-4267-85fd-d9d5f7b28487" />
	<img width="410" height="100" alt="image" src="https://github.com/user-attachments/assets/9eda61e8-8157-40ba-b9af-1270d5c32619" />
</div>
<div>
	<img width="407" height="100" alt="image" src="https://github.com/user-attachments/assets/048c1c49-d3e4-46ab-b9e0-04b0c2c4c942" />
	<img width="407" height="100" alt="image" src="https://github.com/user-attachments/assets/4c7ba082-68a7-4800-b070-90d9bf010c9e" />
</div>

## ✨ Key Features

| 🎨 **Stunning UI** | 🚀 **Advanced Search** | ⌨️ **Total Control** |
| :--- | :--- | :--- |
| Supports Auto/Light/Dark modes with an optional Frosted Glass effect. | Regex, Whole Word, Case Sensitive, and groundbreaking **Cross-Tag** search. | Fully customizable shortcuts. Can even override the native `Ctrl+F`. |

## 🎯 Detailed Functionality

### 1. Intelligent Control Panel
*   **Adaptive Positioning**: A dedicated drag bar allows you to move the panel anywhere. It remembers your preferred location.
*   **Smart Reset**: Automatically recalibrates the position if the browser window resizes or the console opens, preventing the panel from getting lost.
*   **Transparency & Hover**: Adjust opacity to see content behind the panel. Toggle "Temporary Transparency" on hover or keep it permanently semi-transparent.

### 2. Powerful Search Engine
*   **Cross-Tag Search (v3.0+)**: Breaks the limitations of HTML. Locate text even if it's split by tags like `<span>`, `<b>`, or `<a>`.
*   **Iframe Penetration**: Automatically detects and searches within all valid iframes on the current page.
*   **Dynamic Monitoring (DOM Observer)**: Turn on `Ctrl+D` to monitor page changes. Ideal for infinite-scroll pages or dynamic web apps where content updates in real-time.

### 3. Smart Input & History
*   **Auto-Fill**: Automatically focuses the input and fills it with your currently selected text (or your last search) upon opening.
*   **Search Debounce**: Customizable delay to optimize performance, especially when using complex Regular Expressions.
*   **Smart History**: Stores up to 50 recent searches. You can "Pin" frequently used keywords to a fixed list for instant access.

### 4. Result Navigation
*   **Visual Progress**: A status bar at the bottom indicates the distribution of results across different page sections/iframes.
*   **Quick Copy**: Click the result count to copy the keyword to your clipboard instantly.
*   **Smart Scrolling**: Automatically scrolls the target result to the center of the viewport.


## ⌨️ Shortcut Guide

| Action | Windows/Linux | macOS |
| :--- | :--- | :--- |
| **Open/Close Panel** | `Alt + F` (Default) | `Alt + F` |
| **Next Match** | `Enter` | `Enter` |
| **Previous Match** | `Shift + Enter` | `Shift + Enter` |
| **Case Sensitive** | `Ctrl + C` | `Cmd + C` |
| **Whole Word** | `Ctrl + W` | `Cmd + W` |
| **Regex Mode** | `Ctrl + R` | `Cmd + R` |
| **Dynamic Monitor** | `Ctrl + D` | `Cmd + D` |
| **Exit & Clear** | `Esc` | `Esc` |

> *Pro Tip: Go to `chrome://extensions/shortcuts` to set the key to `Ctrl+F` if you wish to replace the default browser find function.*

## 📦 Installation
- chrome：https://chromewebstore.google.com/detail/find-whatever-regex-auto/pdpkckoiaiinjlhddhcoknjhdncepnbo
- edge：https://microsoftedge.microsoft.com/addons/detail/find-whatever-regex-a/dfmiobmbhchkjnehfkgpoddfkhonafmk
- firefox：https://addons.mozilla.org/zh-CN/firefox/addon/find-whatever/


## 🤝 Feedback

If you encounter incorrect search results, performance issues, or have feature requests:
*   Please report via GitHub Issues or 2223133607@qq.com.
*   When reporting a bug, please provide the URL of the page where the error occurred.

## 🌟 Support me
If you find this project helpful, feel free to give me a star 🌟 or leave me a rating and review on the Chrome Store. This will be my biggest motivation to continue creating!

## 🛠 For developer
1. Run `npm install`
2. Run `npm run start`
3. Run `npx tailwindcss -i ./src/global.css -o ./src/output.css --watch`
4. Open your browser's extensions page in developer mode, press "load unpacked" and select the `build` directory

*Firefox version special commands: `npm run start:ff` and `npm run build:ff`*

## License
[GPL-3.0-only](LICENSE)
