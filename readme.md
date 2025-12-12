[中文](./readme.md) | [English](./readme_en.md)

<a href="https://www.producthunt.com/products/find-whatever-regex-auto-re-find?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-find&#0045;whatever&#0045;regex&#0045;auto&#0045;re&#0045;find" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=987390&theme=light&t=1751507461541" alt="Find&#0032;whatever&#0032;&#0045;&#0032;regex&#0032;&#0038;&#0032;auto&#0032;re&#0045;find - Enhance&#0032;your&#0032;browser&#0039;s&#0032;find&#0032;capabilities&#0046; | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

## 启动
1. 执行 `npm install`
2. 执行 `npm run start`
3. 执行 `npx tailwindcss -i ./src/global.css -o ./src/output.css --watch`
4. 打开扩展程序的开发者模式，加载已解压的扩展程序，把 `build` 目录放进去

## 扩展程序链接
- chrome：https://chromewebstore.google.com/detail/find-whatever-regex-auto/pdpkckoiaiinjlhddhcoknjhdncepnbo
- edge：https://microsoftedge.microsoft.com/addons/detail/find-whatever-regex-a/dfmiobmbhchkjnehfkgpoddfkhonafmk

对我最大的支持就是在商店页面留下评分和评论～，<small>还有上面的 producthunt ☺️</small>

## firefox 的差异
1. 文本框中的输入优先级高于扩展程序快捷键，因此在聚焦在文本框中时还需要额外的逻辑来关闭面板
2. 不支持 `storage.session`，换成了 `storage.sync`
3. manifest.json 中的 `background.service_worker` 换成了 `background.scripts`；需要添加 `browser_specific_settings.gecko.id` 字段
4. shadow-dom 中的文本暂时不能应用高亮样式

## 其他
根据您的浏览器语言自动设置文本语言，目前只准备了中文和英语两个版本，如果需要更多，请提 issue 或者在商店页留言。

## License
[GPL-3.0-only](LICENSE)
