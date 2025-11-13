import React, { useContext, useEffect, useState } from 'react'
import { i18n } from '../../i18n';
import { Radio, Switch, Tag } from 'antd';
import { SettingContext } from '../Options'
import TipsSvg from '../../../assets/svg/tips.svg'
import DownSvg from '../../../assets/svg/down.svg'

export const Total = () => {
	const { setting, updateSetting } = useContext(SettingContext)
	const [ commandText, setCommandText ] = useState('')
	const [ isShowPreview, setIsShowPreview ] = useState(false)
	const [ activeIndex, setActiveIndex ] = useState(0)

	useEffect(() => {
		chrome.commands.getAll(res =>  {
			setCommandText(res[0].shortcut)
		})
	}, []);

	const GetImage = () => {
		let url = ''
		switch (activeIndex) {
			case 0: url = 'https://i2.letvimg.com/lc17_lemf/202511/11/17/59/image2.png'; break;
			case 1: url = 'https://i0.letvimg.com/lc17_lemf/202511/11/17/59/image1.png'; break;
			case 2: url = 'https://i0.letvimg.com/lc18_lemf/202511/11/18/00/image6.png'; break;
			case 3: url = 'https://i3.letvimg.com/lc18_lemf/202511/11/18/00/image5.png'; break;
			case 4: url = 'https://i3.letvimg.com/lc18_lemf/202511/11/18/00/image4.png'; break;
			case 5: url = 'https://i0.letvimg.com/lc19_lemf/202511/11/17/59/image3.png'; break;
			case 6: url = 'https://i0.letvimg.com/lc18_lemf/202511/11/18/00/image7.png'; break;
			case 7: url = 'https://i0.letvimg.com/lc17_lemf/202511/11/18/01/image8.png'; break;
		}
		return <img onClick={() => window.open(url)} src={url} />
	}

	return (
		<div>
			<div className="areaTitle">{i18n('整体')}</div>

			<div>{i18n('现在打开面板的默认快捷键为 Alt+F。')}</div>
			<div>{i18n('当前快捷键为')} <Tag color="cyan">{commandText || i18n('无')}</Tag>。</div>
			<div>{i18n('未设置快捷键会导致面板只能通过点击图标打开。')}</div>
			<div>
				{
					navigator.language === 'zh' || navigator.language === 'zh-CN'
						? <span>您可以在 <a href="chrome://extensions/shortcuts" style={{ textDecoration: 'underline' }}>chrome://extensions</a> 自定义快捷键，</span>
						: <span>You can customize shortcut keys at <a href="chrome://extensions/shortcuts" style={{ textDecoration: 'underline' }}>chrome://extensions</a>, </span>
				}
				<span>{i18n('设置 Command+F(macOS) 或者 Ctrl+F(windows等) 时会覆盖浏览器自带的查找。')}</span>
			</div>
			<div className="setting-area mb-[10px]">
				<div className="setting-row">
					<div>{i18n('颜色模式')}：</div>
					<Radio.Group value={setting.colorMode} onChange={e  => updateSetting('colorMode', e.target.value)}>
						<Radio value={'auto'}>{i18n('跟随系统')}</Radio>
						<Radio value={'light'}>{i18n('浅色')}</Radio>
						<Radio value={'dark'}>{i18n('深色')}</Radio>
					</Radio.Group>
				</div>
				<div className="setting-row">
					<div>{i18n('是否使用毛玻璃效果面板')}：</div>
					<Switch size="small" checked={setting.isUseGlassEffect} onChange={e => updateSetting('isUseGlassEffect', e)} />
				</div>
			</div>

			<div className="info-area">
				<div className="title" onClick={() => setIsShowPreview(!isShowPreview)}>{i18n('点击此处来展开颜色模式、毛玻璃效果面板的说明和预览')}<DownSvg style={{ width: '20px', height: '20px', marginLeft: '8px', transition: 'transform .3s ease', transform: `rotate(${isShowPreview ? 180 : 0}deg)` }} /></div>
				{
					isShowPreview &&
					<div className="content">
						<div style={{ paddingLeft: '22px', position: 'relative' }}>
							<TipsSvg style={{ width: '18px', height: '18px', position: 'absolute', left: '0', top: '2px' }} />

							{
								navigator.language === 'zh' || navigator.language === 'zh-CN'
									? <div>页面的背景色仅以黑白作为示例，切换时小心<span style={{backgroundColor: 'black', color: 'white', padding: '2px 4px', borderRadius: '4px'}}>眩光</span>。</div>
									: <div>The background color of the page is only shown in black and white as an example, be careful with <span style={{backgroundColor: 'black', color: 'white', padding: '2px 4px', borderRadius: '4px'}}>glare</span> when switching.</div>
							}
							{i18n('毛玻璃效果在相反的色调下不太好看，但是在相同色调下表现非常好，这也是我保留这个功能的原因。')}
						</div>
						<div className="previewWp">
							<ul className="case">
								<li className={activeIndex === 0 ? 'active' : ''} onMouseEnter={() => setActiveIndex(0)}>{i18n('浅色模式-浅色页面')}</li>
								<li className={activeIndex === 1 ? 'active' : ''} onMouseEnter={() => setActiveIndex(1)}>{i18n('浅色模式-深色页面')}</li>
								<li className={activeIndex === 2 ? 'active' : ''} onMouseEnter={() => setActiveIndex(2)}>{i18n('深色模式-浅色页面')}</li>
								<li className={activeIndex === 3 ? 'active' : ''} onMouseEnter={() => setActiveIndex(3)}>{i18n('深色模式-深色页面')}</li>
								<li className={activeIndex === 4 ? 'active' : ''} onMouseEnter={() => setActiveIndex(4)}>{i18n('浅色模式-浅色页面-毛玻璃')}</li>
								<li className={activeIndex === 5 ? 'active' : ''} onMouseEnter={() => setActiveIndex(5)}>{i18n('浅色模式-深色页面-毛玻璃')}</li>
								<li className={activeIndex === 6 ? 'active' : ''} onMouseEnter={() => setActiveIndex(6)}>{i18n('深色模式-浅色页面-毛玻璃')}</li>
								<li className={activeIndex === 7 ? 'active' : ''} onMouseEnter={() => setActiveIndex(7)}>{i18n('深色模式-深色页面-毛玻璃')}</li>
							</ul>
							<div className="preview">
								{GetImage()}
							</div>
						</div>
					</div>
				}
			</div>

			<div>{i18n('我不是专业的UI设计师，所以颜色搭配做的很不自信。如果你有更好的想法，欢迎帮助我做出更美观的界面。')}🤝</div>
		</div>
	)
}
