import React from 'react'
import {i18n} from '../../i18n';

export const DragBar = () => {
	return (
		<div>
			<div className="areaTitle">
				{i18n('拖拽条')}
				<div className="w-20 relative ml-[20px]">
					<div className=" absolute left-0 right-0 m-auto w-[50px] h-[3px] bg-[#888888] rounded opacity-30 transition-all duration-300 cursor-move hover:w-20 hover:opacity-100 before:content-[''] before:px-5 before:py-1 before:w-full before:absolute before:-top-1 before:h-[3px] before:box-content before:-left-5 before:-left-[20px]"/>
				</div>
			</div>

			<div>
				<div>{i18n('点击并拖拽此处可调整面板位置，会自动记忆位置。')}</div>
				<div className="newPart">
					<span className="new">new</span>
					<div>{i18n('如果因为修改了浏览器窗口宽高导致面板位置异常（如修改窗口大小、打开控制台等），会在下一次打开时自动临时重置位置。')}</div>
					<div>{i18n('如果超过了设备的宽高，会在下一次打开时自动重置位置并清除记忆的位置。')}</div>
				</div>
			</div>
		</div>
	)
}
