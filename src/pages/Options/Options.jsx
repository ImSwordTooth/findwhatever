import React, { useState } from 'react'
import {Appearance} from "./tabs/Appearance";
import {Feature} from "./tabs/Feature";
import { i18n } from '../i18n'
import { Popover } from 'antd'

export const Options = () => {
	const menuList = [i18n('外观'), i18n('功能')]

	const [ activeIndex, setActiveIndex ] = useState(0)

	const RightContent = () => {
		switch (activeIndex) {
			case 0: return <Appearance />
			case 1: return <Feature />
		}
	}

	return (
		<div className="flex flex-col select-none" style={{ height: '100%', padding:'20px 20px' }}>
			<div className="flex items-center justify-between mb-[40px]">
				<div className="flex items-center">
					<img className="w-[48px] h-[48px] mr-2" src="https://i2.letvimg.com/lc18_lemf/202503/31/13/43/icon.png"
						 alt=""/>
					<div className="font-mono text-2xl">Find whatever {i18n('设置项')}</div>
				</div>


				<div className="flex items-center">
					<Popover
						content={
							<div style={{padding: '8px', width: '240px'}}>
								{
									(navigator.language === 'zh' || navigator.language === 'zh-CN')
									?
										<div>
											根据您的浏览器语言自动设置文本语言，目前只准备了中文和英语两个版本，如果需要更多，请在
											<a style={{ color: '#0788dc' }} href="https://chromewebstore.google.com/detail/find-whatever-regex-auto/pdpkckoiaiinjlhddhcoknjhdncepnbo/reviews" target="_blank">chrome 商店</a>或者 <a style={{ color: '#0788dc' }} href="https://github.com/ImSwordTooth/findwhatever/issues" target="_blank">Github</a> 评论留言
										</div>
										:
										<div>
											Automatically set the text language according to the language of your browser. Currently, only Chinese and English versions are available. If you need more languages, please leave a comment in <a style={{ color: '#0788dc' }} href="https://chromewebstore.google.com/detail/find-whatever-regex-auto/pdpkckoiaiinjlhddhcoknjhdncepnbo/reviews" target="_blank">the Chrome Store</a> or on <a style={{ color: '#0788dc' }} href="https://github.com/ImSwordTooth/findwhatever/issues" target="_blank">Github</a>.
										</div>
								}
								</div>
						}
					>
						<svg className="w-[28px] h-[28px] mr-2 cursor-pointer" viewBox="0 0 1024 1024" version="1.1"
							 xmlns="http://www.w3.org/2000/svg" p-id="5925" width="200" height="200">
							<path
								d="M585.152 804.544H146.304a73.152 73.152 0 0 1-73.152-73.152V146.304a73.152 73.152 0 0 1 73.152-73.152h585.152a73.152 73.152 0 0 1 73.152 73.152v298.432a36.608 36.608 0 1 0 73.152 0V146.304A146.304 146.304 0 0 0 731.456 0H146.304A146.304 146.304 0 0 0 0 146.304v585.152a146.304 146.304 0 0 0 146.304 146.304h438.848a36.608 36.608 0 0 0 0-73.152z m-427.904-230.4a35.84 35.84 0 0 1-10.944-25.6V256a37.312 37.312 0 0 1 36.544-36.544h219.456a36.608 36.608 0 0 1 0 73.152H219.456v73.088h182.848a36.608 36.608 0 0 1 0 73.152H219.456V512h182.848a36.608 36.608 0 1 1 0 73.152H182.848a35.84 35.84 0 0 1-25.6-10.944zM512 550.784V374.464a33.152 33.152 0 0 1 34.368-37.312 29.248 29.248 0 0 1 30.72 28.544A68.736 68.736 0 0 1 640 338.624a84.864 84.864 0 0 1 91.456 84.864v127.296a32.896 32.896 0 0 1-36.544 34.368 33.664 33.664 0 0 1-36.544-34.368V438.848c0-28.544-8.768-44.8-36.544-46.784s-36.544 13.888-36.544 46.784v111.936a33.664 33.664 0 0 1-36.544 34.368A32.896 32.896 0 0 1 512 550.784zM841.152 512a36.544 36.544 0 0 1 36.544 36.544v438.848a36.608 36.608 0 0 1-73.152 0V548.544A36.544 36.544 0 0 1 841.152 512z m-138.944 146.304h277.952a43.904 43.904 0 0 1 43.904 43.904v131.648a43.904 43.904 0 0 1-43.904 43.904h-278.016a43.904 43.904 0 0 1-43.904-43.904v-131.712a43.904 43.904 0 0 1 43.904-43.904z m43.904 73.152a14.656 14.656 0 0 0-14.656 14.656v43.904a14.656 14.656 0 0 0 14.656 14.656h190.144a14.656 14.656 0 0 0 14.656-14.656v-43.904a14.656 14.656 0 0 0-14.656-14.656z"
								fill="#252631" p-id="5926"></path>
						</svg>
					</Popover>
					<a href="https://github.com/ImSwordTooth/findwhatever" target="_blank">
						<svg className="w-[28px] h-[28px] cursor-pointer" viewBox="0 0 1024 1024" version="1.1"
							 xmlns="http://www.w3.org/2000/svg" p-id="4118" width="200" height="200">
							<path
								d="M512 42.666667A464.64 464.64 0 0 0 42.666667 502.186667 460.373333 460.373333 0 0 0 363.52 938.666667c23.466667 4.266667 32-9.813333 32-22.186667v-78.08c-130.56 27.733333-158.293333-61.44-158.293333-61.44a122.026667 122.026667 0 0 0-52.053334-67.413333c-42.666667-28.16 3.413333-27.733333 3.413334-27.733334a98.56 98.56 0 0 1 71.68 47.36 101.12 101.12 0 0 0 136.533333 37.973334 99.413333 99.413333 0 0 1 29.866667-61.44c-104.106667-11.52-213.333333-50.773333-213.333334-226.986667a177.066667 177.066667 0 0 1 47.36-124.16 161.28 161.28 0 0 1 4.693334-121.173333s39.68-12.373333 128 46.933333a455.68 455.68 0 0 1 234.666666 0c89.6-59.306667 128-46.933333 128-46.933333a161.28 161.28 0 0 1 4.693334 121.173333A177.066667 177.066667 0 0 1 810.666667 477.866667c0 176.64-110.08 215.466667-213.333334 226.986666a106.666667 106.666667 0 0 1 32 85.333334v125.866666c0 14.933333 8.533333 26.88 32 22.186667A460.8 460.8 0 0 0 981.333333 502.186667 464.64 464.64 0 0 0 512 42.666667"
								fill="#231F20" p-id="4119"></path>
						</svg>
					</a>
				</div>


			</div>

			<div className="flex-1 flex">
				<div className="w-[200px] relative mr-[40px]" style={{borderRight: '1px solid #dddddd'}}>
					{
						menuList.map((menu, index) => {
							return (
								<div className="h-[40px] flex items-center cursor-pointer" style={{
									fontSize: '14px',
									padding: '12px 12px 12px 40px',
									backgroundColor: index === activeIndex ? 'rgb(80 179 234 / 29%)' : ''
								}} key={index} onClick={() => setActiveIndex(index)}>{menu}</div>
							)
						})
					}
					<div className="w-[4px] h-[24px] absolute left-0"
						 style={{backgroundColor: 'rgb(80 179 234)', top: `${activeIndex * 40 + 8}px`}}/>
				</div>
				<div className="flex-1">
					{RightContent()}
				</div>
			</div>
		</div>
	)
}
