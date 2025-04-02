import React, { useState } from 'react'
import {Appearance} from "./tabs/Appearance";
import {Scroll} from "./tabs/Scroll";
import { i18n } from './i18n'

export const Options = () => {
	const menuList = [i18n('外观'), i18n('滚动条信息')]

	const [ activeIndex, setActiveIndex ] = useState(1)

	const RightContent = () => {
		switch (activeIndex) {
			case 0: return <Appearance />
			case 1: return <Scroll />
		}
	}

	return (
		<div className="flex flex-col select-none" style={{ height: '100%', padding:'20px 20px' }}>
			<div className="flex items-center mb-[40px]">
				<img className="w-[48px] h-[48px] mr-2" src="https://i2.letvimg.com/lc18_lemf/202503/31/13/43/icon.png" alt="" />
				<div className="font-mono text-2xl">Find whatever {i18n('设置项')}</div>
			</div>

			<div className="flex-1 flex">
				<div className="w-[200px] relative mr-[40px]" style={{ borderRight: '1px solid #dddddd' }}>
					{
						menuList.map((menu, index) => {
							return (
								<div className="h-[40px] flex items-center cursor-pointer" style={{ fontSize: '14px', padding: '12px 12px 12px 40px', backgroundColor: index === activeIndex ? 'rgb(80 179 234 / 29%)' :'' }} key={index} onClick={() => setActiveIndex(index)}>{ menu }</div>
							)
						})
					}
					<div className="w-[4px] h-[24px] absolute left-0" style={{ backgroundColor: 'rgb(80 179 234)', top: `${activeIndex*40 + 8}px` }} />
				</div>
				<div className="flex-1">
					{RightContent()}
				</div>
			</div>
		</div>
	)
}
