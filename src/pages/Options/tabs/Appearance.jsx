import React, {useEffect, useRef, useState} from 'react'
import { FakePanel } from './fakePanel'
import {Checkbox, Popover, Slider, Select, Button, message, Popconfirm} from 'antd'
import { SketchPicker } from 'react-color'
import { i18n } from '../../i18n'

export const Appearance = () => {
	const [ bgColor, setBgColor ] = useState('#ffff37')
	const [ textColor, setTextColor ] = useState('#000000')
	const [ isOpenUnderline, setIsOpenUnderline ] = useState(false)
	const [ underlineOffset, setUnderlineOffset ] = useState(2)
	const [ underlineThickness, setUnderlineThickness ] = useState(2)
	const [ underlineStyle, setUnderlineStyle ] = useState('solid')
	const [ underlineColor, setUnderlineColor ] = useState('#000000')

	const [ bgColorActive, setBgColorActive ] = useState('#ff8b3a')
	const [ textColorActive, setTextColorActive ] = useState('#000000')
	const [ isSame, setIsSame ] = useState(true)
	const [ isOpenUnderlineActive, setIsOpenUnderlineActive ] = useState(false)
	const [ underlineOffsetActive, setUnderlineOffsetActive ] = useState(2)
	const [ underlineThicknessActive, setUnderlineThicknessActive ] = useState(2)
	const [ underlineStyleActive, setUnderlineStyleActive ] = useState('solid')
	const [ underlineColorActive, setUnderlineColorActive ] = useState('#000000')

	const textRef = useRef(null)

	const text = '   孔乙己是站着喝酒而穿长衫的唯一的人。\n   他身材很高大；青白脸色，皱纹间时常夹些伤痕；一部乱蓬蓬的花白的胡子。\n   穿的虽然是长衫，可是又脏又破，似乎十多年没有补，也没有洗。\n   他对人说话，总是满口之乎者也，教人半懂不懂的。因为他姓孔，别人便从描红纸上的‘上大人孔乙己’这半懂不懂的话里，替他取下一个绰号，叫作孔乙己。'

	useEffect(() => {
		getInit()

		const range1 = new Range()
		range1.setStart(textRef.current.childNodes[0], 4)
		range1.setEnd(textRef.current.childNodes[0], 6)
		CSS.highlights.set('search-results-active', new Highlight(range1))

		const range2 = new Range()
		range2.setStart(textRef.current.childNodes[0], 139)
		range2.setEnd(textRef.current.childNodes[0], 141)
		const range3 = new Range()
		range3.setStart(textRef.current.childNodes[0], 163)
		range3.setEnd(textRef.current.childNodes[0], 165)
		CSS.highlights.set('search-results', new Highlight(range2, range3))
	}, []);

	useEffect(() => {
		const oldElement = document.getElementById('customStyle')
		if (oldElement) {
			oldElement.remove()
		}
		const styleElement = document.createElement('style');
		styleElement.id = 'customStyle'
		// 定义 CSS 规则
		const cssRules = `
            ::highlight(search-results) {
    			background-color: ${bgColor};
    			color: ${textColor};
				${isOpenUnderline? `text-decoration: underline; text-decoration-color: ${underlineColor}; text-underline-offset: ${underlineOffset}px; text-decoration-thickness: ${underlineThickness}px; text-decoration-style: ${underlineStyle}` : ''}
			}
			::highlight(search-results-active) {
    			background-color: ${bgColorActive};
    			color: ${textColorActive};
    			${isSame
			? (isOpenUnderline ? `text-decoration: underline; text-decoration-color: ${underlineColor}; text-underline-offset: ${underlineOffset}px; text-decoration-thickness: ${underlineThickness}px; text-decoration-style: ${underlineStyle}` : '' )
			: (isOpenUnderlineActive ? `text-decoration: underline; text-decoration-color: ${underlineColorActive}; text-underline-offset: ${underlineOffsetActive}px; text-decoration-thickness: ${underlineThicknessActive}px; text-decoration-style: ${underlineStyleActive}` : '')
		}
			}
			.sketch-picker * {
				box-sizing: unset!important;
			}
		`;
		// 将 CSS 规则添加到 style 元素的文本内容中
		styleElement.textContent = cssRules;
		// 将 style 元素插入到 head 部分
		document.head.appendChild(styleElement);
	}, [bgColor, textColor, isOpenUnderline, underlineColor, underlineOffset, underlineStyle, underlineThickness, bgColorActive, textColorActive, isSame, isOpenUnderlineActive, underlineOffsetActive, underlineThicknessActive, underlineStyleActive, underlineColorActive]);


	const getInit = async () => {
		const { styleObject } = await chrome.storage.sync.get(['styleObject'])

		if (!styleObject) {
			return
		}
		setBgColor(styleObject.bgColor)
		setTextColor(styleObject.textColor)
		setIsOpenUnderline(styleObject.isOpenUnderline)
		setUnderlineOffset(styleObject.underlineOffset)
		setUnderlineThickness(styleObject.underlineThickness)
		setUnderlineStyle(styleObject.underlineStyle)
		setUnderlineColor(styleObject.underlineColor)

		setBgColorActive(styleObject.bgColorActive)
		setTextColorActive(styleObject.textColorActive)
		setIsSame(styleObject.isSame)
		setIsOpenUnderlineActive(styleObject.isOpenUnderlineActive)
		setUnderlineOffsetActive(styleObject.underlineOffsetActive)
		setUnderlineThicknessActive(styleObject.underlineThicknessActive)
		setUnderlineStyleActive(styleObject.underlineStyleActive)
		setUnderlineColorActive(styleObject.underlineColorActive)
	}

	const colorFormat = (colorObj) => {
		if (colorObj.rgb.a !== 1) {
			return `rgba(${colorObj.rgb.r}, ${colorObj.rgb.g}, ${colorObj.rgb.b}, ${colorObj.rgb.a})`
		} else {
			return colorObj.hex
		}
	}

	const reset = () => {
		setBgColor('#ffff37')
		setTextColor('#000000')
		setIsOpenUnderline(false)
		setUnderlineOffset(2)
		setUnderlineThickness(2)
		setUnderlineStyle('solid')
		setUnderlineColor('#000000')

		setBgColorActive('#ff8b3a')
		setTextColorActive('#000000')
		setIsSame(true)
		setIsOpenUnderlineActive(false)
		setUnderlineOffsetActive(2)
		setUnderlineThicknessActive(2)
		setUnderlineStyleActive('solid')
		setUnderlineColorActive('#000000')
		chrome.storage.sync.remove(['styleObject', 'styleText'])
		message.success(i18n('重置成功'))
	}

	const save = () => {
		chrome.storage.sync.set({
			styleObject: {
				bgColor, textColor, isOpenUnderline, underlineOffset, underlineThickness, underlineStyle, underlineColor,
				bgColorActive, textColorActive, isSame, isOpenUnderlineActive, underlineOffsetActive, underlineThicknessActive, underlineStyleActive, underlineColorActive
			},
			styleText: `
            ::highlight(search-results) {
    			background-color: ${bgColor};
    			color: ${textColor};
				${isOpenUnderline? `text-decoration: underline; text-decoration-color: ${underlineColor}; text-underline-offset: ${underlineOffset}px; text-decoration-thickness: ${underlineThickness}px; text-decoration-style: ${underlineStyle}` : ''}
			}
			::highlight(search-results-active) {
    			background-color: ${bgColorActive};
    			color: ${textColorActive};
    			${isSame
				? (isOpenUnderline ? `text-decoration: underline; text-decoration-color: ${underlineColor}; text-underline-offset: ${underlineOffset}px; text-decoration-thickness: ${underlineThickness}px; text-decoration-style: ${underlineStyle}` : '' )
				: (isOpenUnderlineActive ? `text-decoration: underline; text-decoration-color: ${underlineColorActive}; text-underline-offset: ${underlineOffsetActive}px; text-decoration-thickness: ${underlineThicknessActive}px; text-decoration-style: ${underlineStyleActive}` : '')
			}
			}
		`
		}, () => {
			message.success(i18n('保存成功'))
		})
	}

	return (
		<div className="flex select-none">

			<div className="flex-1">
				<h1>{i18n('高亮样式')}</h1>
				<div className="w-[400px] mb-[40px]">
					<h2>search-results</h2>
					<div className="rounded-xl overflow-hidden">
						<div className="setting-row">
							<div>
								{i18n('背景色')}
							</div>
							<Popover trigger={['click']} placement="rightTop" content={<SketchPicker color={bgColor} onChange={ e => setBgColor(colorFormat(e))} />}>
								<div className="color-picker">
									<div className="color-block" style={{ backgroundColor: bgColor }} />
									{bgColor}
								</div>
							</Popover>
						</div>
						<div className="setting-row">
							<div>{i18n('字体颜色')}</div>
							<Popover trigger={['click']} placement="rightTop" content={<SketchPicker color={textColor} onChange={ e => setTextColor(colorFormat(e))} />}>
								<div className="color-picker">
									<div className="color-block" style={{ backgroundColor: textColor }} />
									{textColor}
								</div>
							</Popover>
						</div>
						<div className="setting-row">
							<div>{i18n('是否启用下划线')}</div>
							<Checkbox checked={isOpenUnderline} onChange={ e => setIsOpenUnderline(e.target.checked) } />
						</div>
						{
							isOpenUnderline &&
							<>
								<div className="setting-row">
									<div>{i18n('下划线间距')}</div>
									<div className="flex items-center">
										<Slider style={{ width: '120px', margin: 0 }} min={0} max={10} value={underlineOffset} onChange={setUnderlineOffset} />
										<div className="ml-2">{underlineOffset}px</div>
									</div>
								</div>
								<div className="setting-row">
									<div>{i18n('下划线线条高度')}</div>
									<div className="flex items-center">
										<Slider style={{ width: '120px', margin: 0 }} min={1} max={10} value={underlineThickness} onChange={setUnderlineThickness} />
										<div className="ml-2">{underlineThickness}px</div>
									</div>
								</div>
								<div className="setting-row">
									<div>{i18n('下划线样式')}</div>
									<Select
										value={underlineStyle}
										onChange={setUnderlineStyle}
										options={[
											{
												label: 'solid',
												value: 'solid'
											},
											{
												label: 'double',
												value: 'double'
											},
											{
												label: 'dotted',
												value: 'dotted'
											},
											{
												label: 'dashed',
												value: 'dashed'
											},
											{
												label: 'wavy',
												value: 'wavy'
											},
										]} />
								</div>
								<div className="setting-row">
									<div>{i18n('下划线颜色')}</div>
									<Popover trigger={['click']} placement="rightTop" content={<SketchPicker color={underlineColor} onChange={ e => setUnderlineColor(colorFormat(e))} />}>
										<div className="color-picker">
											<div className="color-block" style={{ backgroundColor: underlineColor }} />
											{underlineColor}
										</div>
									</Popover>
								</div>
							</>
						}
					</div>
				</div>
				<div className="w-[400px]">
					<h2>search-results-active</h2>
					<div className="rounded-xl overflow-hidden">
						<div className="setting-row">
							<div>
								{i18n('背景色')}
							</div>
							<Popover trigger={['click']} placement="rightTop" content={<SketchPicker color={bgColorActive} onChange={ e => setBgColorActive(colorFormat(e))} />}>
								<div className="color-picker">
									<div className="color-block" style={{ backgroundColor: bgColorActive }} />
									{bgColorActive}
								</div>
							</Popover>
						</div>
						<div className="setting-row">
							<div>{i18n('字体颜色')}</div>
							<Popover trigger={['click']} placement="rightTop" content={<SketchPicker color={textColorActive} onChange={ e => setTextColorActive(colorFormat(e))} />}>
								<div className="color-picker">
									<div className="color-block" style={{ backgroundColor: textColorActive }} />
									{textColorActive}
								</div>
							</Popover>
						</div>
						<div className="setting-row">
							<div>{i18n('下划线是否和 search-results 一致')}</div>
							<Checkbox checked={isSame} onChange={ e => setIsSame(e.target.checked) } />
						</div>
						{
							!isSame &&
							<>
								<div className="setting-row">
									<div>{i18n('是否启用下划线')}</div>
									<Checkbox checked={isOpenUnderlineActive} onChange={ e => setIsOpenUnderlineActive(e.target.checked) } />
								</div>
								{
									isOpenUnderlineActive &&
									<>
										<div className="setting-row">
											<div>{i18n('下划线间距')}</div>
											<div className="flex items-center">
												<Slider style={{ width: '120px', margin: 0 }} min={0} max={10} value={underlineOffsetActive} onChange={setUnderlineOffsetActive} />
												<div className="ml-2">{underlineOffsetActive}px</div>
											</div>
										</div>
										<div className="setting-row">
											<div>{i18n('下划线线条高度')}</div>
											<div className="flex items-center">
												<Slider style={{ width: '120px', margin: 0 }} min={1} max={10} value={underlineThicknessActive} onChange={setUnderlineThicknessActive} />
												<div className="ml-2">{underlineThicknessActive}px</div>
											</div>
										</div>
										<div className="setting-row">
											<div>{i18n('下划线样式')}</div>
											<Select
												value={underlineStyleActive}
												onChange={setUnderlineStyleActive}
												options={[
													{
														label: 'solid',
														value: 'solid'
													},
													{
														label: 'double',
														value: 'double'
													},
													{
														label: 'dotted',
														value: 'dotted'
													},
													{
														label: 'dashed',
														value: 'dashed'
													},
													{
														label: 'wavy',
														value: 'wavy'
													},
												]} />
										</div>
										<div className="setting-row">
											<div>{i18n('下划线颜色')}</div>
											<Popover trigger={['click']} placement="rightTop" content={<SketchPicker color={underlineColorActive} onChange={ e => setUnderlineColorActive(colorFormat(e))} />}>
												<div className="color-picker">
													<div className="color-block" style={{ backgroundColor: underlineColorActive }} />
													{underlineColorActive}
												</div>
											</Popover>
										</div>
									</>
								}
							</>
						}
					</div>
				</div>

				<div className="flex items-center w-[400px] mt-[40px]">
					<Popconfirm
						title={i18n('确定重置吗？')}
						onConfirm={reset}
						okText={i18n('确定')}
						cancelText={i18n('取消')}
						okButtonProps={{ style: { width: '90px' } }}
						cancelButtonProps={{ style: { width: '50px' } }}
					>
						<Button className="w-[160px] flex-shrink-0 mr-[12px]">{i18n('重置本页')}</Button>
					</Popconfirm>
					<Button className="flex-1" type="primary" onClick={save}>{i18n('保存本页')}</Button>
				</div>
				<div className="mt-2 text-[#cccccc]">* {i18n('保存后需刷新旧页面')}</div>
			</div>

			<div className="ml-[20px] w-[400px]">
				<FakePanel />
				<pre ref={textRef} className="mt-[20px] rounded-2xl p-[12px] bg-[#f1f1f1] text-[14px] whitespace-pre-wrap select-none">
					{text}
				</pre>
			</div>
		</div>
	)
}
