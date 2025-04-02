export const i18n = (text) => {
	const isChinese = navigator.language === 'zh' || navigator.language === 'zh-CN'

	if (isChinese) {
		return text
	}
	switch (text) {
		case '设置项': return 'SETTING'
		case '外观': return 'Appearance'
		case '滚动条信息': return 'Scrollbar Info'

		case '高亮样式': return 'Highlight Style'
		case '字体颜色': return 'text color'
		case '是否启用下划线': return 'enable underline'
		case '下划线间距': return 'underline offset'
		case '下划线线条高度': return 'underline thickness'
		case '下划线样式': return 'underline style'
		case '下划线颜色': return 'underline color'
		case '下划线是否和 search-results 一致': return 'underline: same with search-results'

		case '滚动条信息样式': return 'Scrollbar Info Style'
		case '是否显示滚动条旁边的位置信息': return 'show'
		case '背景色': return 'background color'
		case '宽度': return 'width'
		case '高亮色块高度': return 'highlight block height'
		case '普通结果颜色': return 'search-results color'
		case '普通结果边框颜色': return 'search-results border color'
		case '当前结果颜色': return 'search-results-active color'
		case '当前结果边框颜色': return 'search-results-active border color'
		case '重置本页': return 'reset this page'
		case '确定重置吗？': return 'Confirm reset?'
		case '确定': return 'confirm'
		case '取消': return 'cancel'

		case '保存本页': return 'Save this page'
		case '保存后需刷新旧页面': return 'After saving, you need to refresh the old page'
	}
}
