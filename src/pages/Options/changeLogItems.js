export const CHANGELOG_ITEMS = [
	{
		version: 'v4.1.0',
		date: '2026-04-23',
		contentList: [
			'现在遍历节点时会跳过 display 为 none 的元素',
			'自动检测新增对 dom 属性的检测',
			'自动检测添加防抖',
			'提取正则表达式的判断和生成，放到公共部分，不再在每个 iframe 中都运行一遍了',
			'合并异步请求，优化查询速度',
			'优化代码',
			'去除 i18nnext 带来的广告信息'
		]
	},
	{
		version: 'v4.0.0',
		date: '2026-03-02',
		content: '添加 8 国语言，重写 i18n'
	},
	{
		version: 'v3.10.0',
		date: '2026-02-26',
		contentList: [
			'兼容阿拉伯语（和其他语言）的单词边界',
			'正则表达式现在默认开启 Unicode 模式',
			'设置页添加更新日志',
			'修复一些 shadow-dom 的 bug'
		]
	},
	{
		version: 'v3.9.0',
		date: '2026-02-03',
		content: '添加正则表达式黑名单，检测不合法和过于宽泛的'
	},
	{
		version: 'v3.8.0',
		date: '2026-01-29',
		content: '添加主题色功能，极大地提升了颜值'
	},
	{
		version: 'v3.7.0',
		date: '2025-12-01',
		content: '修复正则模式查找时长度 bug'
	},
	{
		version: 'v3.6.0',
		date: '2025-11-27',
		content: '修复规范化过程中不可克隆 shadowroot 的兼容方案'
	},
	{
		version: 'v3.5.2',
		date: '2025-11-13',
		content: '设置页新增颜色模式和毛玻璃效果的说明和预览'
	},
	{
		version: 'v3.5.1',
		date: '2025-10-21',
		contentList: [
			'优化样式',
			'修复查找结果在规范化过程中存在注释节点时高亮下标可能错乱的 bug',
		]
	},
	{
		version: 'v3.5.0',
		date: '2025-10-10',
		content: '添加深色模式'
	},
	{
		version: 'v3.4.1',
		date: '2025-10-01',
		contentList: [
			'现在可以搜索 svg 中的文本',
			'添加 LICENSE',
		]
	},
	{
		version: 'v3.4.0',
		date: '2025-09-01',
		contentList: [
			'修复 MutationObserver 无法检测到 body 本身和 shadow-root 的变动的问题',
			'拖拽面板时，不选中其他文本',
			'修复若干 bug'
		]
	},
	{
		version: 'v3.3.1',
		date: '2025-08-08',
		content: '拖拽区域为整个面板时，文本框内不再可以拖拽'
	},
	{
		version: 'v3.3.0',
		date: '2025-07-21',
		contentList: [
			'丰富快捷键',
			'丰富设置项',
			'自动选中文本，快速开始下一次检索'
		]
	},
	{
		version: 'v3.2.0',
		date: '2025-07-11',
		contentList: [
			'添加可选的毛玻璃特效',
			'替换默认快捷键',
			'查找结果总数添加动画'
		]
	},
	{
		version: 'v3.1.0',
		date: '2025-06-26',
		contentList: [
			'添加“一段时间后重置所有搜索词、筛选项”功能',
			'修复 bugs，优化性能'
		]
	},
	{
		version: 'v3.0.1',
		date: '2025-06-23',
		contentList: [
			'插件更新后不再自动打开设置页',
			'新增可拖拽区域设置'
		]
	},
	{
		version: 'v3.0.0',
		date: '2025-06-19',
		contentList: [
			'完成跨标签搜索功能',
			'现在只有在页面加载完成后才会弹出窗口',
			'不再限制 iframe 的协议',
			'添加了离场动画',
			'重写 frames 列表',
			'优化查找函数',
			'重写设置页'
		]
	},
	{
		version: 'v2.8.0',
		date: '2025-06-06',
		content: 'iframe 现在只会检测有实际内容的'
	},
	{
		version: 'v2.7.0',
		date: '2025-05-28',
		content: '启动插件时自动监测位置，如果位置异常，自动重置'
	},
	{
		version: 'v2.6.0',
		date: '2025-05-12',
		content: '支持 Unicode 正则表达式'
	},
	{
		version: 'v2.5.0',
		date: '2025-04-21',
		content: 'dom 变化后的自动重新查找不再触发滚动元素到视口'
	},
	{
		version: 'v2.4.0',
		date: '2025-04-10',
		contentList: [
			'修复输入时触发页面的全局快捷键的 bug',
			'临时透明度可设置'
		]
	},
	{
		version: 'v2.3.0',
		date: '2025-04-07',
		content: '添加 i18n'
	},
	{
		version: 'v2.2.0',
		date: '2025-04-03',
		content: '添加防抖功能',
	},
	{
		version: 'v2.1.0',
		date: '2025-03-14',
		contentList: [
			'添加设置页',
			'支持自定义高亮样式',
			'修复了不能查找元素的直接文本节点的 bug',
		]
	},
	{
		version: 'v2.0.1',
		date: '2025-03-13',
		content: '修复面板可调整大小的bug',
	},
	{
		version: 'v2.0.0',
		date: '2025-03-07',
		contentList: [
			'添加“最近”和“固定查找”功能',
			'修复尾部空格 bug',
			'面板内的元素现在不会被翻译软件翻译',
			'修复拖拽bug，现在不再能拖到视口外部'
		]
	},
	{
		version: 'v1.4.1',
		date: '2026-02-27',
		content: '修复查找结果和iframe顺序不一致的问题',
	},
	{
		version: 'v1.4.0',
		date: '2025-02-13',
		content: '支持搜索 shadow-dom 中的内容',
	},
	{
		version: 'v1.3.0',
		date: '2025-02-13',
		content: '添加“调整透明度”功能'
	},
	{
		version: 'v1.2.1',
		date: '2025-01-23',
		content: '更新了插件名称和 icon',
	},
	{
		version: 'v1.2.0',
		date: '2025-01-09',
		contentList: [
			'添加“复制查找结果”的功能',
			'修复切换 tabs 时 iframe 未更新的 bug'
		]
	},
	{
		version: 'v1.1.3',
		date: '2024-12-26',
		content: '添加“关闭”和“上一个”的快捷键',
	},
	{
		version: 'v1.1.2',
		date: '2024-12-06',
		contentList: [
			'输入时禁用文本穿透',
			'修复切换标签页时文本、设置没有同步的bug',
			'修复切换标签页时原标签页的监听 dom 没有停止的bug'
		]
	},
	{
		version: 'v1.1.1',
		date: '2024-11-07',
		contentList: [
			'tailwindcss的单位改成px',
			'修复初始位置bug；'
		]
	},
	{
		version: 'v1.1.0',
		date: '2024-11-01',
		content: '调通大部分功能，代码放置在 ShadowDOM 中',
	},
	{
		version: 'v1.0.0',
		date: '2024-10-29',
		content: '重构为 React 写法',
	},
	{
		version: 'v0.0.7',
		date: '2024-09-06',
		content: 'fix bugs',
	},
	{
		version: 'v0.0.6',
		date: '2024-07-29',
		contentList: [
			'现在“当前页”的查找结果总是出现在首位',
			'修复关闭查找面板后注入的 CSS没有正确清除的bug',
			'修复选中的文本没有自动填充到文本框的bug',
			'优化查找结果的滚动定向'
		]
	},
	{
		version: 'v0.0.5',
		date: '2024-07-01',
		content: '添加设置高亮颜色功能',
	},
	{
		version: 'v0.0.4',
		date: '2024-06-27',
		contentList: [
			'查找下标现在从0开始',
			'dom 变动后的查找不再重置查找下标'
		]
	},
	{
		version: 'v0.0.3',
		date: '2024-06-25',
		contentList: [
			'过滤无效的 iframe',
			'添加拖拽功能'
		]
	},
	{
		version: 'v0.0.1',
		date: '2024-06-14',
		content: '正式发布 Find whatever，旅途的开始'
	}
]
