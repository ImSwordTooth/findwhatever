import React, {useEffect, useRef} from 'react'
import { FakePanel } from './fakePanel'
import { Checkbox } from 'antd'
import { SketchPicker } from 'react-color'


export const Options = () => {

	const textRef = useRef(null)

	const text = '孔乙己是站着喝酒而穿长衫的唯一的人。\n他身材很高大；青白脸色，皱纹间时常夹些伤痕；一部乱蓬蓬的花白的胡子。\n穿的虽然是长衫，可是又脏又破，似乎十多年没有补，也没有洗。\n他对人说话，总是满口之乎者也，教人半懂不懂的。因为他姓孔，别人便从描红纸上的‘上大人孔乙己’这半懂不懂的话里，替他取下一个绰号，叫作孔乙己。'

	useEffect(() => {
		const range1 = new Range()
		range1.setStart(textRef.current.childNodes[0], 1)
		range1.setEnd(textRef.current.childNodes[0], 3)
		CSS.highlights.set('search-results-active', new Highlight(range1))

		const range2 = new Range()
		range2.setStart(textRef.current.childNodes[0], 127)
		range2.setEnd(textRef.current.childNodes[0], 129)
		const range3 = new Range()
		range3.setStart(textRef.current.childNodes[0], 151)
		range3.setEnd(textRef.current.childNodes[0], 153)
		CSS.highlights.set('search-results', new Highlight(range2, range3))

		const styleElement = document.createElement('style');
		// 定义 CSS 规则
		const cssRules = `
            ::highlight(search-results) {
    			background-color: #ffff37;
    			color: black;
			}
			::highlight(search-results-active) {
    			background-color: #ff8b3a;
    			color: black;
			}
			.sketch-picker * {
				box-sizing: unset!important;
			}
		`;
		// 将 CSS 规则添加到 style 元素的文本内容中
		styleElement.textContent = cssRules;
		// 将 style 元素插入到 head 部分
		document.head.appendChild(styleElement);
	}, []);

	return (
		<div className="flex p-[40px]">

			<div className="flex-1">
				<h1>设置区</h1>
				<div>
					<h2>search-results</h2>
					<div>
						背景色 <SketchPicker color="#f5f5f5" />
						字体颜色
						是否启用下划线 <Checkbox defaultChecked={true} />
						（启用下划线后打开）
						下划线 offset
						下划线样式
						下划线颜色
					</div>
				</div>
				<div>
					<h2>search-results-active</h2>
					背景色
					字体颜色
					是否启用下划线
					（启用下划线后打开）
					下划线 offset
					下划线样式
					下划线颜色
				</div>
			</div>

			<div className="ml-[20px] w-[400px]">
				<FakePanel />
				<pre ref={textRef} className="mt-[20px] rounded-2xl p-[12px] bg-[#f1f1f1] text-[14px] whitespace-pre-wrap">
					{text}
				</pre>
			</div>
		</div>
	)
}
