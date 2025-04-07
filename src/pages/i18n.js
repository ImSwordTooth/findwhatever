export const i18n = (text) => {
	const isChinese = navigator.language === 'zh' || navigator.language === 'zh-CN'

	if (isChinese) {
		return text
	}
	switch (text) {
		case '当前页': return 'Page'
		case '查找结果': return 'Result'
		case '输入文本以查找': return 'Enter text to find'
		case '大小写敏感': return 'Match Case'
		case '匹配单词': return 'Words'
		case '正则表达式': return 'Regex'
		case '实时监测 DOM 变化': return 'Listen for DOM changes in real time'
		case '在不适合实时监测的情况下请临时关闭此功能': return 'Please temporarily disable this function when it is not suitable for real-time monitoring'
		case '隐藏中': return 'Hidden'
		case '被遮盖': return 'Be covered'
		case '最近': return 'Recent'
		case '固定': return 'Fixed'
		case '填入并开启正则模式': return 'Fill in and enable regular mode'
		case '固定之': return 'Fix'
		case '取消固定': return 'Cancel fix'
		case '暂无数据': return 'Empty'
		case '为了避免输入正则表达式的过程中卡死，开启此选项后的输入防抖会持续 1 秒': return 'To avoid the input of regular expressions from freezing, the input debounce will be continuous for 1 second after enabling this option'

		case '设置项': return 'SETTING'
		case '外观': return 'Appearance'
		case '功能': return 'Feature'

		case '高亮样式': return 'Highlight Style'
		case '字体颜色': return 'text color'
		case '是否启用下划线': return 'enable underline'
		case '下划线间距': return 'underline offset'
		case '下划线线条高度': return 'underline thickness'
		case '下划线样式': return 'underline style'
		case '下划线颜色': return 'underline color'
		case '下划线是否和 search-results 一致': return 'underline: same with search-results'

		case '非正则模式防抖时长': return 'Debounce duration in non-regular mode'
		case '正则模式防抖时长': return 'Debounce duration in regular mode'

		case '重置本页': return 'reset this page'
		case '确定重置吗？': return 'Confirm reset?'
		case '确定': return 'confirm'
		case '取消': return 'cancel'

		case '保存本页': return 'Save this page'
		case '保存后需刷新旧页面': return 'After saving, you need to refresh the old page'
	}
}
