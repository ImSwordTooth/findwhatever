import React from'react'

export const FrameList = () => {
	return (
		<div>
			<div className="areaTitle mt-[30px]">页面列表</div>
			<div>
				<div>包含当前页，和页面中的 iframe，每个页面在右侧列出了匹配结果的数量。</div>
				<div>iframe 做了判断，只有 <strong>有实际内容</strong> 并且 <strong>没发生错误</strong> 的才会参与查找。</div>
				<div>页面下方的小横条代表了页面的数量和状态，默认<span style={{ color: '#e0e0e0' }}>灰色</span>；如果没有搜索结果，不展示；如果当前结果在该页面内，变为<span style={{ color: '#000000' }}>黑色</span>。</div>
				<div className="newPart">
					<div className="new">new</div>
					不再显示页面的 http 协议，可以搜索本地文件和 srcdoc 的页面了。
				</div>
			</div>
		</div>
	)
}
