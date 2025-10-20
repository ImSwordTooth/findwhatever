import React, {useContext} from 'react'
import {i18n} from '../../i18n';
import {SettingContext} from '../Options';
import {Switch, Popover, Select, Slider} from 'antd';
import {SketchPicker} from 'react-color';
import CopySvg from '../../../assets/svg/copy.svg'

export const FindResult = () => {
	const { setting, updateSetting } = useContext(SettingContext)

	const colorFormat = (colorObj) => {
		if (colorObj.rgb.a !== 1) {
			return `rgba(${colorObj.rgb.r}, ${colorObj.rgb.g}, ${colorObj.rgb.b}, ${colorObj.rgb.a})`
		} else {
			return colorObj.hex
		}
	}

	return (
		<div>
			<div className="areaTitle mt-[30px]">{i18n('查找结果')}</div>
			<div>
				{
					navigator.language === 'zh' || navigator.language === 'zh-CN'
						? <div>展示查找结果(<strong>search-results</strong>)的数量和当前定位的结果的下标(<strong>search-results-active</strong>)。</div>
						: <div>Displays the number of search-results and the subscript of the currently targeted results (search-results-active).</div>
				}
				<div>{i18n('点击')}
					<span className="inline-flex items-center cursor-grab active:cursor-grabbing hover:text-[#3aa9e3] transition-colors">
						<div className="scale-90 origin-right">{i18n('查找结果')}</div>
						<CopySvg className="w-2.5 h-2.5 ml-[1px]" />
					</span>
					{i18n('，会把结果复制到剪贴板。')}</div>

				<div>{i18n('v3.0 新增了跨标签搜索。启用跨标签搜索方案的条件为：')}</div>
				<ol style={{ margin: '0' }}>
					<li>{i18n('没有嵌套结构')}</li>
					<li>{i18n('子节点中至少包含这些标签其中的一个：')}['STRONG','WBR','EM', 'ABBR', 'A', 'SPAN', 'ADDRESS', 'B', 'BDI', 'BDO', 'CITE', 'I', 'KBD', 'MARK', 'Q', 'S', 'DEL', 'INS', 'SAMP', 'SMALL', 'SUB', 'SUP', 'TIME', 'U', 'VAR']</li>
					<li>{i18n('没有换行')}</li>
					<li>{i18n('子节点长度大于 1，')}{'<div><a>1111</a></div>'} {i18n('这种结构，没必要规范化')}</li>
				</ol>
				<div><em>{i18n('核心且复杂的功能，如果有搜索结果错误的页面，请及时联系我，谢谢！')}</em></div>

				<div className="setting-row">
					<div>{i18n('是否显示查找结果的文本')}</div>
					<Switch size="small" checked={setting.isShowResultText} onChange={e => updateSetting('isShowResultText', e)} />
				</div>

				<h3 className="mt-[12px]">search-results</h3>
				<div className="setting-area">
					<div className="setting-row">
						<div>
							{i18n('背景色')}
						</div>
						<Popover trigger={['click']} placement="rightTop" content={<SketchPicker color={setting.bgColor} onChange={e => updateSetting('bgColor', colorFormat(e))} />}>
							<div className="color-picker">
								<div className="color-block" style={{ backgroundColor: setting.bgColor }} />
								{setting.bgColor}
							</div>
						</Popover>
					</div>
					<div className="setting-row">
						<div>{i18n('字体颜色')}</div>
						<Popover trigger={['click']} placement="rightTop" content={<SketchPicker color={setting.textColor} onChange={ e => updateSetting('textColor', colorFormat(e))} />}>
							<div className="color-picker">
								<div className="color-block" style={{ backgroundColor: setting.textColor }} />
								{setting.textColor}
							</div>
						</Popover>
					</div>
					<div className="setting-row">
						<div>{i18n('是否启用下划线')}</div>
						<Switch size="small" checked={setting.isOpenUnderline} onChange={ e => updateSetting('isOpenUnderline', e) } />
					</div>
					{
						setting.isOpenUnderline &&
						<>
							<div className="setting-row">
								<div>{i18n('下划线间距')}</div>
								<div className="flex items-center">
									<Slider style={{ width: '120px', margin: 0 }} min={0} max={10} value={setting.underlineOffset} onChange={e => updateSetting('underlineOffset', e)} />
									<div className="ml-2">{setting.underlineOffset}px</div>
								</div>
							</div>
							<div className="setting-row">
								<div>{i18n('下划线线条高度')}</div>
								<div className="flex items-center">
									<Slider style={{ width: '120px', margin: 0 }} min={1} max={10} value={setting.underlineThickness} onChange={e => updateSetting('underlineThickness', e)} />
									<div className="ml-2">{setting.underlineThickness}px</div>
								</div>
							</div>
							<div className="setting-row">
								<div>{i18n('下划线样式')}</div>
								<Select
									value={setting.underlineStyle}
									onChange={e => updateSetting('underlineStyle', e)}
									size="small"
									getPopupContainer={e => e.parentNode}
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
								<Popover trigger={['click']} placement="rightTop" content={<SketchPicker color={setting.underlineColor} onChange={ e => updateSetting('underlineColor', colorFormat(e))} />}>
									<div className="color-picker">
										<div className="color-block" style={{ backgroundColor: setting.underlineColor }} />
										{setting.underlineColor}
									</div>
								</Popover>
							</div>
						</>
					}
				</div>

				<h3 className="mt-[12px]">search-results-active</h3>
				<div className="setting-area">
					<div className="setting-row">
						<div>
							{i18n('背景色')}
						</div>
						<Popover trigger={['click']} placement="rightTop" content={<SketchPicker color={setting.bgColorActive} onChange={e => updateSetting('bgColorActive', colorFormat(e))} />}>
							<div className="color-picker">
								<div className="color-block" style={{ backgroundColor: setting.bgColorActive }} />
								{setting.bgColorActive}
							</div>
						</Popover>
					</div>
					<div className="setting-row">
						<div>{i18n('字体颜色')}</div>
						<Popover trigger={['click']} placement="rightTop" content={<SketchPicker color={setting.textColorActive} onChange={ e => updateSetting('textColorActive', colorFormat(e))} />}>
							<div className="color-picker">
								<div className="color-block" style={{ backgroundColor: setting.textColorActive }} />
								{setting.textColorActive}
							</div>
						</Popover>
					</div>
					<div className="setting-row">
						<div>{i18n('下划线是否和 search-results 一致')}</div>
						<Switch size="small" checked={setting.isSame} onChange={ e => updateSetting('isSame', e) } />
					</div>

					{
						!setting.isSame &&
						<>
							<div className="setting-row">
								<div>{i18n('是否启用下划线')}</div>
								<Switch size="small" checked={setting.isOpenUnderlineActive} onChange={ e => updateSetting('isOpenUnderlineActive', e) } />
							</div>
							{
								setting.isOpenUnderlineActive &&
								<>
									<div className="setting-row">
										<div>{i18n('下划线间距')}</div>
										<div className="flex items-center">
											<Slider style={{ width: '120px', margin: 0 }} min={0} max={10} value={setting.underlineOffsetActive} onChange={e => updateSetting('underlineOffsetActive', e)} />
											<div className="ml-2">{setting.underlineOffsetActive}px</div>
										</div>
									</div>
									<div className="setting-row">
										<div>{i18n('下划线线条高度')}</div>
										<div className="flex items-center">
											<Slider style={{ width: '120px', margin: 0 }} min={1} max={10} value={setting.underlineThicknessActive} onChange={e => updateSetting('underlineThicknessActive', e)} />
											<div className="ml-2">{setting.underlineThicknessActive}px</div>
										</div>
									</div>
									<div className="setting-row">
										<div>{i18n('下划线样式')}</div>
										<Select
											value={setting.underlineStyleActive}
											onChange={e => updateSetting('underlineStyleActive', e)}
											size="small"
											getPopupContainer={e => e.parentNode}
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
										<Popover trigger={['click']} placement="rightTop" content={<SketchPicker color={setting.underlineColorActive} onChange={ e => updateSetting('underlineColorActive', colorFormat(e))} />}>
											<div className="color-picker">
												<div className="color-block" style={{ backgroundColor: setting.underlineColorActive }} />
												{setting.underlineColorActive}
											</div>
										</Popover>
									</div>
								</>
							}
						</>
					}
				</div>
				{/*<Appearance />*/}
			</div>
		</div>
	)
}
