import React from'react'
import {i18n} from '../../i18n';

export const FrameList = () => {
	return (
		<div>
			<div className="areaTitle mt-[30px]">{i18n('页面列表')}</div>
			<div>
				<div>{i18n('包含当前页，和页面中的 iframe，每个页面在右侧列出了匹配结果的数量。')}</div>
				{
					navigator.language === 'zh' || navigator.language === 'zh-CN'
						? <div>iframe 做了判断，只有 <strong>有实际内容</strong> 并且 <strong>没发生错误</strong> 的才会参与查找。</div>
						: <div>iframes are determined, and only those that <strong>have actual content</strong> and <strong>no errors</strong> will be involved in the lookup.</div>
				}
				{
					navigator.language === 'zh' || navigator.language === 'zh-CN'
						? <div>页面下方的小横条代表了页面的数量和状态，默认<span style={{ color: '#e0e0e0' }}>灰色</span>；如果没有搜索结果，不展示；如果当前结果在该页面内，变为<span style={{ color: '#000000' }}>黑色</span>。</div>
						: <div>The small bar at the bottom of the page represents the number and status of the page, which is <span style={{ color: '#e0e0e0' }}>gray</span> by default; If there are no search results, they are not displayed; If the current result is on this page, it will turn <span style={{ color: '#000000' }}>black</span>.</div>
				}
				<div>{i18n('不再限制页面的 http 协议，现在可以搜索本地文件和 srcdoc 的页面了。')}</div>
			</div>
		</div>
	)
}
