import React, { useContext } from 'react'
import { i18n } from '../../i18n';
import { Button, Switch, InputNumber } from 'antd';
import { SettingContext } from '../Options'
import { Shortcut } from '../Shortcut';
import UpArrowSvg from '../../../assets/svg/upArrow.svg'
import DownArrowSvg from '../../../assets/svg/downArrow.svg'
import LiveSvg from '../../../assets/svg/live.svg'
import CloseSvg from '../../../assets/svg/close.svg'

export const Feature = () => {

	const { setting, updateSetting } = useContext(SettingContext)

	return (
		<div>
			<div className="areaTitle mt-[30px]">{i18n('功能区')}</div>
			<div className="mt-[6px]">
				<UpArrowSvg className="w-[16px] h-[16px]" />
				<DownArrowSvg className="w-[16px] h-[16px]" />
				<div>{i18n('切换当前定位的结果的下标(search-results-active)，切换时会尽量地把对应的元素滚动到视口内。')}</div>
				<div>{i18n('在输入框 focus 的状态下，也可以按')} <code>Enter</code> 和 <code>Shift+Enter</code> {i18n('来切换。')}</div>
				<div className="text-[#ff4d4f]"><strong>{i18n('切换 search-results-active 时，需要更新缓存来执行高亮和定位的动作，浏览器的 MAX_WRITE_OPERATIONS_PER_MINUTE 限制了一分钟只能更新 120 次，所以切换的时候最好别“幻影键舞”，否则可能会更新失败。')}</strong></div>
			</div>

			<div className="mt-[6px]">
				<div className="flex items-center mt-2 mb-2">
					<button className="normalButton ml-[0px]">
						<span className="text-xs select-none">Cc</span>
					</button>
					<button className="normalButton activeButton">
						<span className="text-xs select-none">Cc</span>
					</button>
				</div>

				<div>
					<Shortcut isMulti shortkey="c" />
					<div>{i18n('激活后会严格根据字母的大小写匹配。原理是正则表达式的 i 模式。')}</div>
				</div>
			</div>

			<div className="mt-[6px]">
				<div className="flex items-center mt-2 mb-2">
					<button className="normalButton ml-[0px]">
						<span className="text-xs select-none">W</span>
					</button>
					<button className="normalButton activeButton">
						<span className="text-xs select-none">W</span>
					</button>
				</div>

				<div>
					<Shortcut shortkey="w" isMulti />
					<div>{i18n('激活后只能匹配一个完整的单词，比如 special 这个单词，激活单词模式后搜索 spec 是搜不到的。原理是在内容前后加上正则表达式的 \\b。')}</div>
				</div>
			</div>

			<div className="mt-[6px]">
				<div className="flex items-center mt-2 mb-2">
					<button className="normalButton ml-[0px]">
						<span className="text-xs select-none">.*</span>
					</button>
					<button className="normalButton activeButton">
						<span className="text-xs select-none">.*</span>
					</button>
				</div>

				<div>
					<Shortcut shortkey="r" isMulti />
					<div>{i18n('激活后可以使用正则表达式的语法进行搜索，为了避免输入过程中出现 .* 这种会匹配所有字符的情况出现，正则模式开启后，会有一段较长的防抖时间，默认 1000ms。')}</div>
				</div>
			</div>

			<div className="setting-area">
				<div className="setting-row">
					<div>{i18n('正则模式防抖时长')}</div>
					<InputNumber size="small" style={{ width: '140px' }} addonAfter="ms" min={500} value={setting.regexDebounceDuration} onChange={e => updateSetting('regexDebounceDuration', e)} />
				</div>
				<div className="setting-row">
					<div>{i18n('正则表达式是否启用 Unicode 模式')}</div>
					<Switch size="small" checked={setting.isOpenUnicode} onChange={ e => updateSetting('isOpenUnicode', e) } />
				</div>
			</div>

			<div className="mt-[6px]">
				<div className="flex items-center mt-2 mb-2">
					<div className={`w-5 h-5 justify-center rounded-[6px] select-none inline-flex items-center cursor-pointer ml-1`}>
						<LiveSvg className="w-4 h-4" />
					</div>
					<div className={`w-5 h-5 justify-center rounded-[6px] select-none inline-flex items-center cursor-pointer ml-1 activeButton`}>
						<LiveSvg className="w-4 h-4" />
					</div>
				</div>

				<Shortcut shortkey="d" isMulti />
				<div>{i18n('激活后会启用一个 MutationObserver，监听页面里的 DOM 变化，变化后会自动更新查找结果。')}</div>
				<div>{i18n('但是网页的 DOM 变化是个很常见的行为，无法判断变化是否频繁、是否需要监听，因此这里需要用户判断，如果觉得没什么影响就可以开着，觉得不需要，或者某页面下 DOM 变化很频繁，就可以关闭。')}</div>
			</div>

			<div className="mt-[6px]">
				<div className="mt-1 mb-1">
					<Button type="text" danger shape="circle" className="w-6 !h-6 min-w-0 cursor-pointer ">
						<CloseSvg className="icon w-2.5 h-2.5" />
					</Button>
				</div>

				<div>
					<Shortcut shortkey="Esc" />
					<div>{i18n('点击后移除 MutationObserver、清除高亮、关闭面板、置零查找结果、保存查找记录。')}</div>
				</div>

				<div className="setting-row">
					<div>{i18n('是否显示关闭按钮')}</div>
					<Switch size="small" checked={setting.isShowClose} onChange={e => updateSetting('isShowClose', e)} />
				</div>
			</div>
		</div>
	)
}
