export const i18n = (text) => {
	const isChinese = navigator.language === 'zh' || navigator.language === 'zh-CN'
	// const isChinese = false

	if (isChinese) {
		return text
	}
	switch (text) {
		case '当前页': return 'Page'
		case '查找结果': return 'Results'
		case '输入文本以查找...': return 'Start typing to search...'
		case '大小写敏感': return 'Match case'
		case '匹配单词': return 'Words'
		case '正则表达式': return 'Regex'
		case '实时监测 DOM 变化': return 'Listen for DOM changes in real-time'
		case '在不适合实时监测的情况下请临时关闭此功能': return 'Please temporarily disable this function if real-time monitoring isn\'t necessary'
		case '隐藏中': return 'Hidden'
		case '被遮盖': return 'Covered'
		case '最近': return 'Recent'
		case '固定': return 'Pinned'
		case '填入并开启正则模式': return 'Restore as regular expression'
		case '固定之': return 'Pin'
		case '取消固定': return 'Unpin'
		case '暂无数据': return 'Empty'
		case '为了避免输入正则表达式的过程中卡死，开启此选项后的输入防抖会持续数秒': return 'To avoid the regular expressions from freezing the page, the search will automatically be aborted after a few seconds'

		case '设置项': return 'SETTINGS'
		case '外观': return 'Appearance'
		case '功能': return 'Functionality'

		case '高亮样式': return 'Highlight style'
		case '背景色': return 'Highlight color'
		case '字体颜色': return 'Text color'
		case '是否启用下划线': return 'Enable underline'
		case '下划线间距': return 'Underline offset'
		case '下划线线条高度': return 'Underline thickness'
		case '下划线样式': return 'Underline style'
		case '下划线颜色': return 'Underline color'
		case '下划线是否和 search-results 一致': return 'Underline: same as search-results'
		case '其他': return 'Others'
		case '临时透明度': return 'Temporary opacity'

		case '非正则模式防抖时长': return 'Search abortion timeout in non-regex mode'
		case '正则模式防抖时长': return 'Search abortion timeout in regex mode'
		case '正则表达式是否启用 Unicode 模式': return 'Whether the regular expression enables Unicode mode'

		case '重置本页': return 'Revert to default settings'
		case '确定重置吗？': return 'Are you sure you want to revert your settings to the default settings?'
		case '确定': return 'Yes'
		case '取消': return 'Cancel'
		case '重置成功': return 'Reverted successfully'

		case '保存本页': return 'Save settings'
		case '保存后需刷新旧页面': return 'After saving, you need to refresh the page for the changes to take effect'
		case '保存成功': return 'Saved successfully'
	}
}
