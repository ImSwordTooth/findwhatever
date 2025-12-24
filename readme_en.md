[中文](./readme.md) | [English](./readme_en.md)

Automatically set the text language according to the language of your browser. Currently, only Chinese and English versions are available. If you need more languages, please leave a comment in the Chrome Store or leave an issue.

---

# Find whatever 🔍

> **The ultimate search experience beyond native browser limits.**
> A powerful, aesthetically pleasing, and highly customizable text-finding tool for your browser. It doesn't just find words; it redefines how you interact with content through cross-tag matching, regex support, and dynamic DOM monitoring.

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
If you find this project helpful, feel free to give me a star 🌟 or leave me a rating and review on the Chrome Store or Product Hunt. This will be my biggest motivation to continue creating!

<a href="https://www.producthunt.com/products/find-whatever-regex-auto-re-find?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-find&#0045;whatever&#0045;regex&#0045;auto&#0045;re&#0045;find" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=987390&theme=light&t=1751507461541" alt="Find&#0032;whatever&#0032;&#0045;&#0032;regex&#0032;&#0038;&#0032;auto&#0032;re&#0045;find - Enhance&#0032;your&#0032;browser&#0039;s&#0032;find&#0032;capabilities&#0046; | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

## 🛠 For developer
1. Run `npm install`
2. Run `npm run start`
3. Run `npx tailwindcss -i ./src/global.css -o ./src/output.css --watch`
4. Open your browser's extensions page in developer mode, press "load unpacked" and select the `build` directory

*Firefox version special commands: `npm run start:ff` and `npm run build:ff`*

## License
[GPL-3.0-only](LICENSE)
