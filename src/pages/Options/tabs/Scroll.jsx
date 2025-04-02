import React, {useEffect, useRef, useState} from 'react'
import {Checkbox, Popover, Slider, Select, Button, message, Popconfirm} from 'antd'
import { SketchPicker } from 'react-color'
import { i18n } from '../i18n'

export const Scroll = () => {
	const [ isShowScroll, setIsShowScroll ] = useState(true)
	const [ bgColor, setBgColor ] = useState('rgba(219,219,219,0.1)')
	const [ width, setWidth ] = useState(12)

	const [ blockHeight, setBlockHeight ] = useState(4)
	const [ normalColor, setNormalColor ] = useState('#ffff37')
	const [ normalBorderColor, setNormalBorderColor ] = useState('#a3a3a3')
	const [ activeColor, setActiveColor ] = useState('#ff8b3a')
	const [ activeBorderColor, setActiveBorderColor ] = useState('#a3a3a3')

	useEffect(() => {
		init()
	}, [])

	const init = async () => {
		const res = await chrome.storage.sync.get('scrollObject')

		if (Object.keys(res).length === 0) {
			return
		}
		setIsShowScroll(res.scrollObject.isShowScroll)
		setBgColor(res.scrollObject.bgColor)
		setWidth(res.scrollObject.width)
		setBlockHeight(res.scrollObject.blockHeight)
		setNormalColor(res.scrollObject.normalColor)
		setActiveColor(res.scrollObject.activeColor)
		setActiveBorderColor(res.scrollObject.activeBorderColor)
		setNormalBorderColor(res.scrollObject.normalBorderColor)
	}

	const colorFormat = (colorObj) => {
		if (colorObj.rgb.a !== 1) {
			return `rgba(${colorObj.rgb.r}, ${colorObj.rgb.g}, ${colorObj.rgb.b}, ${colorObj.rgb.a})`
		} else {
			return colorObj.hex
		}
	}

	const reset = () => {
		setIsShowScroll(true)
		setBgColor('rgba(219,219,219,0.1)')
		setWidth(12)
		setBlockHeight(4)
		setNormalColor('#ffff37')
		setNormalBorderColor('#a3a3a3')
		setActiveColor('#ff8b3a')
		setActiveBorderColor('#a3a3a3')
		chrome.storage.sync.remove('scrollObject')
		message.success('重置成功')
	}

	const save = () => {
		chrome.storage.sync.set({
			scrollObject: {
				isShowScroll,
				bgColor,
				width,
				blockHeight,
				normalColor,
				normalBorderColor,
				activeColor,
				activeBorderColor
			},
		}, () => {
			message.success('保存成功')
		})
	}

	return (
		<div className="flex select-none">
			<div className="flex-1">
				<h1 className="flex items-center">
					{i18n('滚动条信息样式')}

					<div className="flex items-center ml-[40px]">
						<svg t="1743559777487" className="w-[20px] h-[20px] mr-1" viewBox="0 0 1024 1024" version="1.1"
							 xmlns="http://www.w3.org/2000/svg" p-id="3553" width="200" height="200">
							<path
								d="M444.8 580.053333c18.944 0 34.346667-15.36 34.346667-34.304s-15.36-34.432-34.346667-34.432c-18.986667 0-34.346667 15.488-34.346667 34.432S425.813333 580.053333 444.8 580.053333zM150.613333 936.405333C184.789333 976.896 240.896 981.333333 263.594667 981.333333c5.632 0 9.216-0.256 9.856-0.341333l196.266667 0.085333c0.042667 0 0.085333 0 0.128 0l282.24 0c0.298667 0.042667 3.498667 0.298667 8.746667 0.298667 21.546667 0 77.994667-4.266667 112.384-45.013333 51.456-60.970667 22.272-130.56 21.034667-133.461333l-181.546667-313.130667c-5.930667-10.197333-18.986667-13.653333-29.184-7.722667-10.154667 5.930667-13.610667 18.986667-7.722667 29.184l91.093333 157.226667c-37.674667 16.213333-113.408 35.541333-223.744 1.024-121.002667-37.930667-214.826667-37.205333-269.098667-31.104l173.482667-298.624 0.341333-106.197333-12.672-12.544L423.594667 221.184c-9.386667 0.128-41.216 0.554667-47.317333 0.085333C345.173333 219.434667 323.328 200.021333 323.328 175.104c0-43.818667 49.493333-47.018667 51.584-47.146667L490.752 128c0 0 0.042667 0 0.042667 0l159.274667 0c8.362667 0.085333 50.432 2.688 50.432 47.104 0 42.282667-41.770667 45.952-50.688 46.208L597.333333 221.141333c-0.085333 0-0.085333 0-0.085333 0-5.674667 0-11.093333 2.218667-15.104 6.229333s-6.229333 9.429333-6.229333 15.104l0 91.562667c0 3.754667 0.981333 7.466667 2.858667 10.709333l43.008 72.704c3.968 6.826667 11.136 10.624 18.474667 10.624 3.669333 0 7.338667-0.938667 10.709333-2.901333 10.197333-5.930667 13.610667-18.986667 7.722667-29.184l-40.064-67.712L618.624 263.893333l31.402667 0.085333L650.026667 263.68c15.744 1.066667 35.072-6.357333 40.021333-8.405333 34.304-14.208 53.162667-42.666667 53.162667-80.170667 0-25.642667-8.064-46.677333-23.978667-62.506667C692.48 86.016 653.696 85.589333 649.984 85.333333l-116.992 0-42.197333 0L373.717333 85.333333C340.778667 87.125333 280.661333 108.074667 280.661333 175.104c0 48.256 38.784 85.546667 92.16 88.661333 0.768 0.128 3.413333 0.426667 32.384 0.256L404.949333 328.234667 130.688 800.682667C128.298667 805.845333 99.114667 875.434667 150.613333 936.405333zM168.789333 819.754667l77.653333-133.674667c33.792-7.04 137.984-21.589333 283.989333 24.106667 49.28 15.445333 92.842667 21.12 130.176 21.12 58.410667 0 101.12-13.866667 127.744-25.984l67.882667 116.778667c0-0.042667 0-0.042667-0.042667-0.042667-0.170667 0 18.432 46.506667-15.573333 86.741333-28.245333 33.493333-86.101333 29.610667-86.741333 29.653333l-199.893333-0.085333 0 0L271.701333 938.368c-2.346667 0.128-60.074667 4.181333-88.490667-29.525333C149.077333 868.437333 167.978667 821.717333 168.789333 819.754667zM286.549333 877.312c-3.626667 0-7.338667-0.896-10.709333-2.901333-10.197333-5.930667-13.610667-18.944-7.722667-29.184l56.661333-97.322667c5.930667-10.154667 18.986667-13.610667 29.184-7.68 10.197333 5.930667 13.610667 18.944 7.722667 29.184l-56.661333 97.322667C301.056 873.557333 293.888 877.312 286.549333 877.312z"
								p-id="3554"></path>
						</svg>
						<div style={{ fontSize: '14px', fontWeight: 'normal' }}>
							这是一个实验功能，可能会有一些bug，比如显示的位置不准，但不会引起页面卡顿
						</div>

					</div>
				</h1>
				<div className="w-[400px]">
					<div className="rounded-xl overflow-hidden">
						<div className="setting-row">
							<div>{i18n('是否显示滚动条旁边的位置信息')}</div>
							<Checkbox checked={isShowScroll} onChange={e => setIsShowScroll(e.target.checked)}/>
						</div>
						{
							isShowScroll &&
							<>
								<div className="setting-row">
									<div>{i18n('背景色')}</div>
									<Popover trigger={['click']} placement="rightTop"
											 content={<SketchPicker color={bgColor}
																	onChange={e => setBgColor(colorFormat(e))}/>}>
										<div className="color-picker">
											<div className="color-block" style={{backgroundColor: bgColor}}/>
											{bgColor}
										</div>
									</Popover>
								</div>
								<div className="setting-row">
									<div>{i18n('宽度')}</div>
									<div className="flex items-center">
										<Slider style={{width: '120px', margin: 0}} min={2} max={100} value={width}
												onChange={setWidth}/>
										<div className="ml-2">{width}px</div>
									</div>
								</div>
								<div className="setting-row">
									<div>{i18n('高亮色块高度')}</div>
									<div className="flex items-center">
										<Slider style={{width: '120px', margin: 0}} min={4} max={10} value={blockHeight}
												onChange={setBlockHeight}/>
										<div className="ml-2">{blockHeight}px</div>
									</div>
								</div>
								<div className="setting-row">
									<div>{i18n('普通结果颜色')}</div>
									<Popover trigger={['click']} placement="rightTop"
											 content={<SketchPicker color={normalColor}
																	onChange={e => setNormalColor(colorFormat(e))}/>}>
										<div className="color-picker">
											<div className="color-block" style={{backgroundColor: normalColor}}/>
											{normalColor}
										</div>
									</Popover>
								</div>
								<div className="setting-row">
									<div>{i18n('普通结果边框颜色')}</div>
									<Popover trigger={['click']} placement="rightTop"
											 content={<SketchPicker color={normalBorderColor}
																	onChange={e => setNormalBorderColor(colorFormat(e))}/>}>
										<div className="color-picker">
											<div className="color-block" style={{backgroundColor: normalBorderColor}}/>
											{normalBorderColor}
										</div>
									</Popover>
								</div>
								<div className="setting-row">
									<div>{i18n('当前结果颜色')}</div>
									<Popover trigger={['click']} placement="rightTop"
											 content={<SketchPicker color={activeColor}
																	onChange={e => setActiveColor(colorFormat(e))}/>}>
										<div className="color-picker">
											<div className="color-block" style={{backgroundColor: activeColor}}/>
											{activeColor}
										</div>
									</Popover>
								</div>
								<div className="setting-row">
									<div>{i18n('当前结果边框颜色')}</div>
									<Popover trigger={['click']} placement="rightTop"
											 content={<SketchPicker color={activeBorderColor}
																	onChange={e => setActiveBorderColor(colorFormat(e))}/>}>
										<div className="color-picker">
											<div className="color-block" style={{backgroundColor: activeBorderColor}}/>
											{activeBorderColor}
										</div>
									</Popover>
								</div>
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
						okButtonProps={{ style: { width: '45px' } }}
						cancelButtonProps={{ style: { width: '45px' } }}
					>
						<Button className="w-[120px] mr-[12px]">{i18n('重置本页')}</Button>
					</Popconfirm>
					<Button className="flex-1" type="primary" onClick={save}>{i18n('保存本页')}</Button>
				</div>
				<div className="mt-2 text-[#cccccc]">* {i18n('保存后需刷新旧页面')}</div>
			</div>

			<div className="relative scale-100">
				<div className="ml-[20px] overflow-auto h-[400px] w-[400px]" style={{ border: 'solid 1px #f1f1f1' }}>
					<div className="h-[2000px]">
					</div>
				</div>
				<div className="fixed right-[16px] top-0" style={{ width: `${width}px`, height: '400px', backgroundColor: bgColor }}>
					<div style={{ position: 'absolute', width: '100%', height: `${blockHeight}px`, top: '17%', backgroundColor: normalColor, border: `solid 1px ${normalBorderColor}` }}></div>
					<div style={{ position: 'absolute', width: '100%', height: `${blockHeight}px`, top: '37%', backgroundColor: normalColor, border: `solid 1px ${normalBorderColor}` }}></div>
					<div style={{ position: 'absolute', width: '100%', height: `${blockHeight}px`, top: '42%', backgroundColor: activeColor, border: `solid 1px ${activeBorderColor}` }}></div>
					<div style={{ position: 'absolute', width: '100%', height: `${blockHeight}px`, top: '89%', backgroundColor: normalColor, border: `solid 1px ${normalBorderColor}` }}></div>
				</div>
			</div>
		</div>
	)
}
