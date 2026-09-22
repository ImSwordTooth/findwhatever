export const CHANGELOG_DATA = [
	{
		version: 'v5.0.0',
		date: '2026-09-22',
		isMajor: true,
		contentList: [
			'采用纯内存文本投影检索架构，支持跨 span、code 等行内标签及换行符的连续查找',
			'接入浏览器原生 checkVisibility 判定元素可见性，消除检索触发的 DOM 频繁重排',
			'修复深层视口外元素因坐标越界被错误判定为被遮盖的缺陷',
			'支持 details 折叠标签，激活匹配项时自动展开并平滑滚动居中',
			'彻底移除 antd、react 及相关重型依赖，全面迁移至 Preact，大幅降低前台内存占用',
			'底层构建工具全面迁移至 Rust Rspack，清理冗余工具链，打包与编译速度显著提升',
			'重塑设置页全部 8 大配置模块，改用卡片化表单规范并优化文案排版',
			'搜索历史面板改为输入框正下方等宽展开，支持键盘上下方向键选词',
			'输入框加入右侧长文本渐变羽化遮罩与中文输入法回车防误触保护',
			'新增查找结果首尾循环跳转时的脱壳虚影提示（Ghost Echo），并支持在设置中自定义开关',
			'新增按钮提示气泡（Tooltip）全局总开关，支持纯净无干扰模式',
			'页面列表支持自动跳过 0 命中的空 iframe，在各有效 frame 间平滑跳转',
			'优化 Service Worker 帧探测，修复多标签页切换时高亮恢复错位与贴边位置记忆',
			'扩展支持 Chrome 商店原生中英双语展示，设置页内置 8 国语言动态切换',
			'上线全新独立 Changelog 版本历史页面'
		]
	},
	{
		version: 'v4.1.0',
		date: '2026-04-23',
		isMajor: false,
		contentList: [
			'遍历节点时跳过 display 为 none 的隐藏元素',
			'自动检测新增对 DOM 属性变化的实时响应',
			'自动检测机制加入智能防抖策略',
			'提取正则表达式判断与生成到公共逻辑，避免各 iframe 重复运算',
			'合并异步请求，大幅优化复杂页面查询速度',
			'去除 i18next 引入的多余广告信息'
		]
	},
	{
		version: 'v4.0.0',
		date: '2026-03-02',
		isMajor: true,
		badgeText: 'MILESTONE',
		tagline: '国际化多语言重塑与全球化体验扩展',
		contentList: [
			'支持 8 国语言动态切换（英语、西班牙语、法语、德语、俄语、阿拉伯语、韩语、日语）',
			'底层国际化架构由 i18next 全面重写',
			'优化语言自动跟随浏览器系统语言切换逻辑'
		]
	},
	{
		version: 'v3.10.0',
		date: '2026-02-26',
		isMajor: false,
		contentList: [
			'兼容阿拉伯语（及其他小语种）的复杂单词边界判定',
			'正则表达式模式现在默认开启 Unicode 增强模式（u 标志）',
			'设置页初步加入版本历史功能',
			'修复多层 Shadow-DOM 中的特定匹配缺陷'
		]
	},
	{
		version: 'v3.9.0',
		date: '2026-02-03',
		isMajor: false,
		contentList: [
			'引入动态探针启发式正则黑名单机制，防御过于宽泛导致卡死的危险正则',
			'优化正则表达式输入防抖与加载状态'
		]
	},
	{
		version: 'v3.8.0',
		date: '2026-01-29',
		isMajor: false,
		contentList: [
			'添加个性化主题色自定义功能，支持实时预览与深浅色独立配色',
			'大幅提升浮窗与高亮色彩协调度'
		]
	},
	{
		version: 'v3.7.0',
		date: '2025-12-01',
		isMajor: false,
		contentList: [
			'修复正则查找模式下高亮长度计算错位的边界 Bug',
			'优化长文本正则表达式匹配效率'
		]
	},
	{
		version: 'v3.6.0',
		date: '2025-11-27',
		isMajor: false,
		contentList: [
			'修复规范化过程中遇到 closed ShadowRoot 无法访问的兼容回退方案'
		]
	},
	{
		version: 'v3.5.2',
		date: '2025-11-13',
		isMajor: false,
		contentList: [
			'设置页新增颜色模式与毛玻璃效果的实时渲染说明和预览部件'
		]
	},
	{
		version: 'v3.5.1',
		date: '2025-10-21',
		isMajor: false,
		contentList: [
			'优化微观交互样式',
			'修复查找结果在处理注释节点时高亮下标错乱的偶发 Bug'
		]
	},
	{
		version: 'v3.5.0',
		date: '2025-10-10',
		isMajor: false,
		contentList: [
			'全面加入深色模式（Dark Mode），支持跟随系统与手动强制锁定'
		]
	},
	{
		version: 'v3.4.1',
		date: '2025-10-01',
		isMajor: false,
		contentList: [
			'支持对页面内嵌 SVG 元素中的文字内容进行深层匹配与高亮',
			'补充开源许可证'
		]
	},
	{
		version: 'v3.4.0',
		date: '2025-09-01',
		isMajor: false,
		contentList: [
			'修复 MutationObserver 无法捕捉到 body 本身及部分 ShadowRoot 变动的缺陷',
			'拖拽面板时禁止选中宿主页面的背景文字',
			'修复若干交互缺陷'
		]
	},
	{
		version: 'v3.3.1',
		date: '2025-08-08',
		isMajor: false,
		contentList: [
			'优化拖拽判定：当拖拽区域设为整个面板时，搜索输入框内禁用拖拽手势'
		]
	},
	{
		version: 'v3.3.0',
		date: '2025-07-21',
		isMajor: false,
		contentList: [
			'扩展全键盘快捷键体系（大小写敏感、全字匹配、正则模式、DOM 监听）',
			'丰富设置面板参数选项',
			'唤起浮窗时自动选中文本，方便即刻开始下一轮输入'
		]
	},
	{
		version: 'v3.2.0',
		date: '2025-07-11',
		isMajor: false,
		contentList: [
			'添加优雅的背景毛玻璃拟态特效',
			'替换默认快捷键映射',
			'查找结果总数变动加入动态数字过渡动效'
		]
	},
	{
		version: 'v3.1.0',
		date: '2025-06-26',
		isMajor: false,
		contentList: [
			'添加“闲置一定时间后自动重置搜索词与筛选项”的智能重置功能',
			'修复多处边界 Bug 并进行性能微调'
		]
	},
	{
		version: 'v3.0.1',
		date: '2025-06-23',
		isMajor: false,
		contentList: [
			'插件更新后不再强行打扰弹出设置页',
			'新增可拖拽区域自定义设置'
		]
	},
	{
		version: 'v3.0.0',
		date: '2025-06-19',
		isMajor: true,
		badgeText: 'MILESTONE',
		tagline: '跨页面与多 iframe 架构成型',
		contentList: [
			'完整实现跨 iframe 穿透查找并统计各 frame 命中结果',
			'页面加载完成前限制弹窗注入',
			'解除子 frame 的协议限制',
			'添加平滑退出动效',
			'重写 frames 列表组件与设置页'
		]
	},
	{
		version: 'v2.8.0',
		date: '2025-06-06',
		isMajor: false,
		contentList: [
			'子 iframe 增加有效内容判定，仅展示包含实际文字内容的 iframe'
		]
	},
	{
		version: 'v2.7.0',
		date: '2025-05-28',
		isMajor: false,
		contentList: [
			'启动插件时自动校验坐标，若超出屏幕边界自动归位'
		]
	},
	{
		version: 'v2.6.0',
		date: '2025-05-12',
		isMajor: false,
		contentList: [
			'正式支持 Unicode 字符集正则表达式检索'
		]
	},
	{
		version: 'v2.5.0',
		date: '2025-04-21',
		isMajor: false,
		contentList: [
			'DOM 变动后的自动重新查找不再强行将元素滚动打扰用户视线'
		]
	},
	{
		version: 'v2.4.0',
		date: '2025-04-10',
		isMajor: false,
		contentList: [
			'修复输入过程中意外触发宿主页面全局快捷键的问题',
			'支持自定义设置悬浮临时透明度'
		]
	},
	{
		version: 'v2.3.0',
		date: '2025-04-07',
		isMajor: false,
		contentList: [
			'初始引入国际化 i18n 体系'
		]
	},
	{
		version: 'v2.2.0',
		date: '2025-04-03',
		isMajor: false,
		contentList: [
			'输入框引入自适应防抖策略，降低输入卡顿'
		]
	},
	{
		version: 'v2.1.0',
		date: '2025-03-14',
		isMajor: false,
		contentList: [
			'首次推出独立设置页面',
			'支持自定义高亮背景色与文字色',
			'修复无法匹配某些直接文本节点的边界问题'
		]
	},
	{
		version: 'v2.0.1',
		date: '2025-03-13',
		isMajor: false,
		contentList: [
			'修复面板意外被拉伸尺寸的样式 bug'
		]
	},
	{
		version: 'v2.0.0',
		date: '2025-03-07',
		isMajor: true,
		badgeText: 'MILESTONE',
		tagline: '搜索建议与智能浮窗时代',
		contentList: [
			'首次加入“最近搜索”历史建议列表',
			'修复尾部空格干扰搜索词的 bug',
			'面板添加 translate="no" 防止被网页翻译插件破坏',
			'修复拖拽溢出屏幕边缘的缺陷'
		]
	},
	{
		version: 'v1.4.1',
		date: '2025-02-27',
		isMajor: false,
		contentList: [
			'修复查找结果与 iframe 顺序不一致的问题'
		]
	},
	{
		version: 'v1.4.0',
		date: '2025-02-13',
		isMajor: false,
		contentList: [
			'首次突破原生界限，支持检索开放式 Shadow-DOM 中的内容'
		]
	},
	{
		version: 'v1.3.0',
		date: '2025-02-13',
		isMajor: false,
		contentList: [
			'添加面板半透明切换功能，方便透视背后的遮挡内容'
		]
	},
	{
		version: 'v1.2.1',
		date: '2025-01-23',
		isMajor: false,
		contentList: [
			'更新扩展正式品牌名称为 Find whatever 并升级 Logo 图标'
		]
	},
	{
		version: 'v1.2.0',
		date: '2025-01-09',
		isMajor: false,
		contentList: [
			'新增“一键复制所有查找结果”功能',
			'修复多标签页切换时 iframe 列表未同步的缺陷'
		]
	},
	{
		version: 'v1.1.3',
		date: '2024-12-26',
		isMajor: false,
		contentList: [
			'添加关闭面板与快速聚焦上一个命中的快捷键支持'
		]
	},
	{
		version: 'v1.1.2',
		date: '2024-12-06',
		isMajor: false,
		contentList: [
			'输入时禁用事件文本穿透',
			'修复标签页切换时搜索词与设置项不同步的 bug'
		]
	},
	{
		version: 'v1.1.1',
		date: '2024-11-07',
		isMajor: false,
		contentList: [
			'全面迁移样式单位为标准像素 px',
			'修复浮窗初始居中定位 bug'
		]
	},
	{
		version: 'v1.1.0',
		date: '2024-11-01',
		isMajor: false,
		contentList: [
			'重塑架构：将内容脚本完全封装注入在宿主页面的独立 ShadowDOM 中，实现样式零污染'
		]
	},
	{
		version: 'v1.0.0',
		date: '2024-10-29',
		isMajor: true,
		badgeText: 'GENESIS',
		tagline: '组件化重构：基于现代组件树打造',
		contentList: [
			'全面重构为基于现代前端组件化规范的响应式体系',
			'确立插件核心架构原型'
		]
	},
	{
		version: 'v0.0.1',
		date: '2024-06-14',
		isMajor: false,
		contentList: [
			'Find whatever 正式诞生，探索更强大的浏览器查找体验'
		]
	}
]
