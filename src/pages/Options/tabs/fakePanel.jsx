import React, {useRef} from 'react'
import {Button, Divider, Dropdown, Menu, Tabs, Tooltip} from "antd";
import {Input} from "../../../components/Input";

export const FakePanel = () => {

	const popContainerRef = useRef(null)

	const BottomGradient = () => {
		return (
			<>
				<span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
				<span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
			</>
		);
	};


	return (
		<div style={{ position: 'relative', width: '400px', padding:'18px 12px 10px', background: '#fff', borderRadius: '12px',boxShadow: '0px 0px 5px 0px rgba(0,0,0,.02),0px 2px 10px 0px rgba(0,0,0,.06),0px 0px 1px 0px rgba(0,0,0,.3),0px 0px 16px 1px rgba(233,233,233,0.58) '}}>
			<div id="searchWhateverPopup" ref={popContainerRef}>
				<div className="flex justify-center absolute top-[7px] left-0 right-0 m-auto z-10 w-full">
					<div className="searchWhateverMoveHandler w-[50px] h-[3px] bg-[#888888] rounded opacity-30 transition-all duration-300 cursor-move hover:w-20 hover:opacity-100"/>
				</div>
				<div className="flex items-center justify-between -mt-0.5 h-7 border-b-1 border-[#f5f5f5] mb-1">
					<Tabs className="w-[262px] !mr-[4px]" activeKey="0" items={[
						{
							disabled: false,
							key: '0',
							label: (
								<div className="flex items-baseline select-none">
									当前页
									<div className="bg-[#f4f4f4] py-[1px] px-[5px] rounded-[7px] ml-0.5 h-[13px] leading-[14px] box-content">
										5
									</div>
								</div>
							)
						}
					]}
						  size={'small'}
						  getPopupContainer={e => e.parentElement}
					>
					</Tabs>
					<div id="searchwhatever_result" className="text-xs flex items-center select-none text-[#333] justify-end">
						<div className="flex items-center text-xs text-[#a0a0a0] cursor-grabbing opacity-60 absolute right-[22px] top-[5px]">
							<svg className="mr-1 w-2.5 h-2.5" viewBox="0 0 1024 1024" version="1.1"
								 xmlns="http://www.w3.org/2000/svg" width="200"
								 height="200">
								<path
									d="M764.394366 588.97307c-93.111887 0-170.503211 64.930254-190.69476 151.667381-47.118423-20.148282-90.861972-14.552338-123.399212-0.562479C429.546366 653.340845 352.155042 588.97307 259.605634 588.97307c-108.255549 0-196.305127 87.862085-196.305127 195.886874C63.300507 892.87031 151.350085 980.732394 259.605634 980.732394c103.207662 0 186.771831-79.468169 194.61769-180.209577 16.831099-11.754366 61.151549-33.575662 115.553352 1.124958C578.747493 901.826704 661.749183 980.732394 764.394366 980.732394c108.255549 0 196.305127-87.862085 196.305127-195.87245 0-108.024789-88.049577-195.886873-196.305127-195.886874z m-504.788732 55.959437c77.405746 0 140.215887 62.694761 140.215887 139.927437 0 77.232676-62.810141 139.898592-140.215887 139.898591-77.405746 0-140.215887-62.665915-140.215888-139.898591 0-77.232676 62.810141-139.927437 140.215888-139.927437z m504.788732 0c77.405746 0 140.215887 62.694761 140.215888 139.927437 0 77.232676-62.810141 139.898592-140.215888 139.898591-77.405746 0-140.215887-62.665915-140.215887-139.898591 0-77.232676 62.810141-139.927437 140.215887-139.927437zM1016.788732 475.943662H7.211268v57.690141h1009.577464v-57.690141zM697.675718 77.016338c-11.538028-26.249014-41.334986-40.094648-69.011831-30.907493L512 85.294873l-117.226366-39.186028-2.769127-0.836507c-27.806648-7.687211-57.026704 7.355493-67.338817 34.426592L196.78107 418.253521h630.43786L698.771831 79.69893l-1.096113-2.682592z"
									fill="#a0a0a0"/>
							</svg>
							<div
								className="inline-block scale-[0.8] origin-left text-xs cursor-grabbing text-[#a0a0a0]">已隐藏</div>
						</div>
						<div className="flex items-center text-xs text-[#a0a0a0] cursor-grab opacity-80 absolute right-[12px] top-[6px] active:cursor-grabbing z-30">
							<svg className="w-3 h-3" viewBox="0 0 1194 1024" version="1.1"
								 xmlns="http://www.w3.org/2000/svg" width="200" height="200">
								<path
									d="M597.333333 964.266667c-190.577778 0-366.933333-102.4-520.533333-301.511111-25.6-31.288889-25.6-76.8 0-108.088889C230.4 358.4 406.755556 256 597.333333 256c190.577778 0 366.933333 102.4 520.533334 301.511111 25.6 31.288889 25.6 76.8 0 108.088889-153.6 199.111111-329.955556 298.666667-520.533334 298.666667zM597.333333 312.888889c-173.511111 0-332.8 93.866667-477.866666 278.755555-8.533333 11.377778-8.533333 25.6 0 39.822223C261.688889 816.355556 423.822222 910.222222 597.333333 910.222222c173.511111 0 332.8-93.866667 477.866667-278.755555 8.533333-11.377778 8.533333-25.6 0-39.822223C930.133333 406.755556 770.844444 312.888889 597.333333 312.888889z"
									fill="#388CFF"></path>
								<path
									d="M597.333333 768c-93.866667 0-170.666667-76.8-170.666666-170.666667s76.8-170.666667 170.666666-170.666666 170.666667 76.8 170.666667 170.666666-76.8 170.666667-170.666667 170.666667z m0-284.444444c-62.577778 0-113.777778 51.2-113.777777 113.777777s51.2 113.777778 113.777777 113.777778 113.777778-51.2 113.777778-113.777778-51.2-113.777778-113.777778-113.777777z"
									fill="#388CFF"></path>
								<path
									d="M597.333333 56.888889c17.066667 0 28.444444 11.377778 28.444445 28.444444v170.666667c0 17.066667-11.377778 28.444444-28.444445 28.444444s-28.444444-11.377778-28.444444-28.444444V85.333333c0-17.066667 11.377778-28.444444 28.444444-28.444444zM1075.2 233.244444c11.377778 11.377778 11.377778 28.444444 0 39.822223l-119.466667 119.466666c-11.377778 11.377778-28.444444 11.377778-39.822222 0-11.377778-11.377778-11.377778-28.444444 0-39.822222l119.466667-119.466667c11.377778-11.377778 28.444444-11.377778 39.822222 0zM119.466667 233.244444c11.377778-11.377778 28.444444-11.377778 39.822222 0l119.466667 119.466667c11.377778 11.377778 11.377778 28.444444 0 39.822222-11.377778 11.377778-28.444444 11.377778-39.822223 0L119.466667 273.066667c-11.377778-11.377778-11.377778-28.444444 0-39.822223z"
									fill="#388CFF"></path>
							</svg>
						</div>
						<div className="flex items-center cursor-grab shrink-0 active:cursor-grabbing hover:text-[#3aa9e3] transition-colors">
							查找结果
							<svg className="w-2.5 h-2.5 ml-[1px]" fill="#3aa9e3" viewBox="64 64 896 896" version="1.1"
								 xmlns="http://www.w3.org/2000/svg">
								<path
									d="M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z"></path>
							</svg>
						</div>
						：<span id="__swe_current"
							   className="mr-1 ml-0.5 inline-block min-w-2.5 text-right">1</span> / <span
						className="ml-1 inline-block min-w-2.5 text-left"
						id="__swe_total">3</span>
					</div>
				</div>
				<div className="flex items-center w-full">
					<div className="swe_search relative">
						<svg
							className="absolute left-[5px] top-0 bottom-0 p-1 box-content m-auto w-4 h-4 z-10 rounded cursor-pointer transition-colors hover:bg-[#e9e9e9] hover:fill-[#50a3d2]"
							viewBox="0 0 1024 1024" version="1.1"
							xmlns="http://www.w3.org/2000/svg" p-id="3578" width="32" height="32"
							fill="#272636">
							<path
								d="M924.352 844.256l-163.968-163.968c44.992-62.912 71.808-139.648 71.808-222.72 0-211.776-172.224-384-384-384s-384 172.224-384 384 172.224 384 384 384c82.56 0 158.912-26.432 221.568-70.912l164.16 164.16c12.416 12.416 38.592 15.04 51.072 2.624l45.248-45.248c12.416-12.544 6.592-35.392-5.888-47.936zM128.128 457.568c0-176.448 143.552-320 320-320s320 143.552 320 320-143.552 320-320 320-320-143.552-320-320z"
								p-id="3579"></path>
						</svg>
						<svg className="absolute w-[8px] h-[8px] left-[24px] top-[14px] z-10"
							 viewBox="0 0 1024 1024" version="1.1"
							 xmlns="http://www.w3.org/2000/svg" p-id="7932" width="200" height="200">
							<path
								d="M500.2 721.4l1 1 424.2-424.2-56.6-56.6-369 369-368.6-368.7-56.6 56.6 424.2 424.3z"
								fill="#696969" p-id="7933"></path>
						</svg>

						<Input
							id="swe_searchInput"
							autoFocus
							placeholder="输入文本以查找"
							value="乙己"
						>
							<div className="flex items-center bg-white rounded-lg p-0.5 absolute right-1 top-[6px]">
								<svg
									className="absolute -left-[18px] w-3 h-3 opacity-25 hover:opacity-45 cursor-pointer"
									viewBox="64 64 896 896" focusable="false" data-icon="close-circle"
									width="1em"
									height="1em" fill="currentColor" aria-hidden="true">
									<path
										d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"></path>
								</svg>
								<Button type="text"
										className="w-5 !h-5 min-w-5 cursor-pointer rounded-[6px] !inline-flex items-center justify-center">
									<svg className="w-3.5 h-3.5 peer/svg" viewBox="0 0 1024 1024"
										 version="1.1"
										 xmlns="http://www.w3.org/2000/svg" p-id="1466" width="32" height="32">
										<path
											d="M512.00988746 141.21142578c10.45623779 0 19.24145531 3.50024414 26.37542748 10.71331811l259.5421145 259.55200196C805.03668189 418.58105492 808.63085938 427.33660865 808.63085938 437.84228516c0 10.60949731-3.53485132 19.46887183-10.56994606 26.46936011-7.02026391 7.00543237-15.88952661 10.60949731-26.50891137 10.60949731-10.44140625 0-19.22167969-3.60900903-26.35565185-10.71331811L549.09863305 267.79370094V845.7097168c0 10.19915748-3.62384057 18.94976782-10.89624071 26.16284179-7.23284888 7.31195068-15.97357177 10.91601563-26.2122798 10.91601563-10.23376465 0-18.959656-3.60900903-26.22216796-10.91601563-7.24273705-7.21307397-10.87646508-15.96862769-10.87646508-26.16284179V267.79370094l-196.10760522 196.41906761C271.65484619 471.31213355 262.87951684 474.92114258 252.41833496 474.92114258c-10.61938477 0-19.45898438-3.60900903-26.4990232-10.60949731C218.86444068 457.31115699 215.36914062 448.45178247 215.36914062 437.84228516c0-10.50567651 3.55462623-19.26123023 10.69354248-26.36553931l259.53717042-259.55200196C492.7288816 144.71166992 501.52398658 141.21142578 511.97033691 141.21142578h0.03955055z"
											p-id="1467"></path>
									</svg>
								</Button>
								<Button type="text"
										className="w-5 !h-5 min-w-5 ml-1 cursor-pointer rounded-[6px] !inline-flex items-center justify-center">
									<svg t="1729650383779" className="w-3.5 h-3.5" viewBox="0 0 1024 1024"
										 version="1.1"
										 xmlns="http://www.w3.org/2000/svg" p-id="2570" width="32" height="32">
										<path
											d="M511.99011254 141.21142578c10.23376465 0 18.95471191 3.60900903 26.2122798 10.81713891 7.25262451 7.20812988 10.86657691 15.96862769 10.86657763 26.2666626v577.89129615l196.1619873-196.43884254c7.099365-7.00543237 15.90435815-10.61444068 26.34082031-10.61444139 10.61938477 0 19.43426538 3.50518822 26.51385474 10.51062059 7.04498291 7.10430908 10.54522705 15.96862769 10.54522706 26.57318092 0 10.40679908-3.54473877 19.16235352-10.69354248 26.37542748l-259.55694604 259.48278761C531.23156714 879.28833008 522.44635033 882.78857422 512.00988746 882.78857422c-10.45623779 0-19.24145531-3.50024414-26.3704834-10.71331811l-259.55200195-259.48278761C218.94848656 605.37939453 215.36914062 596.62384009 215.36914062 586.21704102c0-10.60949731 3.52496314-19.46887183 10.56994606-26.57318092C232.99395776 552.63842773 241.82861328 549.12829614 252.44799805 549.12829614c10.42163062 0 19.2167356 3.60900903 26.36553931 10.61444068l196.1125493 196.43884253V178.29522729c0-10.30297828 3.60900903-19.05853271 10.88635255-26.2666626C493.05517555 144.81549073 501.80084252 141.21142578 512.02966309 141.21142578h-0.03955055z"
											p-id="2571"></path>
									</svg>
								</Button>
								<div className="w-[1px] h-3.5 bg-[#dfdfdf] mx-1.5"></div>
								<Tooltip
									arrowPointAtCenter={true}
									placement="bottom"
									getPopupContainer={(e) => e.parentElement}
									title={<div className="scale-90 origin-left">大小写敏感</div>}
								>
									<button
										className={`relative cursor-pointer group/btn justify-center flex w-5 h-5 items-center text-black rounded-[6px] dark:bg-zinc-900 bg-white ml-1 px-[0px]`}
									>
										<span className="text-xs select-none">Cc</span>
										<BottomGradient/>
									</button>
								</Tooltip>
								<Tooltip
									arrowPointAtCenter={true}
									placement="bottom"
									getPopupContainer={(e) => e.parentElement}
									title={<div className="scale-90 origin-left">匹配单词</div>}
								>
									<button
										className={`relative cursor-pointer group/btn justify-center flex w-5 h-5 items-center text-black rounded-[6px] dark:bg-zinc-900 bg-white ml-1 px-[0px]`}
									>
										<span className="text-xs select-none">W</span>
										<BottomGradient/>
									</button>
								</Tooltip>
								<Tooltip
									arrowPointAtCenter={true}
									placement="bottom"
									getPopupContainer={(e) => e.parentElement}
									title={<div className="scale-90 origin-left">正则表达式</div>}
								>
									<button
										className={`relative cursor-pointer group/btn justify-center flex w-5 h-5 items-center text-black rounded-[6px] dark:bg-zinc-900 bg-white ml-1 px-[0px]`}
									>
										<span className="text-xs select-none">.*</span>
										<BottomGradient/>
									</button>
								</Tooltip>
								<Tooltip
									arrowPointAtCenter={true}
									placement="bottomRight"
									getPopupContainer={(e) => e.parentElement}
									title={(
										<div className="text-xs w-[244px] scale-90 origin-left">
											<div>实时监测 DOM 变化</div>
											<div>在不适合实时监测的情况下请临时关闭此功能</div>
										</div>
									)}
									align={{offset: [20, 0]}}
								>
									<div
										className={`w-5 h-5 justify-center rounded-[6px] cursor-pointer select-none inline-flex items-center cursor-pointer ml-1`}
									>
										<svg className="w-4 h-4" viewBox="0 0 1025 1024" version="1.1"
											 xmlns="http://www.w3.org/2000/svg" p-id="2617" width="32" height="32">
											<path
												d="M432.877037 518.755668a88.046876 88.046876 0 0 0 175.973139 0 85.755245 85.755245 0 0 0-10.734482-42.093643l353.031788-180.918238a21.951413 21.951413 0 0 0 12.061216-14.111623 24.122432 24.122432 0 0 0-1.567958-18.333048c-31.359161-59.341182-82.619329-116.631957-152.212544-170.063143S649.978922 8.325013 546.252466 0.123386a22.554474 22.554474 0 0 0-18.333048 6.513057A24.122432 24.122432 0 0 0 520.320852 24.245818v406.462974a88.2881 88.2881 0 0 0-87.443815 88.046876z m88.046876 39.922624A39.922624 39.922624 0 1 1 560.846537 518.755668a39.802012 39.802012 0 0 1-39.922624 39.922624z"
												fill="#444444" p-id="2618"></path>
											<path
												d="M253.285533 358.100273a312.626715 312.626715 0 0 0 267.035319 473.402722 334.095679 334.095679 0 0 0 76.106272-9.166524 312.867939 312.867939 0 0 0 227.836367-378.963402 24.122432 24.122432 0 0 0-10.975706-14.714684 24.122432 24.122432 0 0 0-35.459975 26.655288 264.502464 264.502464 0 1 1-483.654755-72.367296 261.004711 261.004711 0 0 1 162.464577-119.888485 23.157534 23.157534 0 0 0 14.714684-10.975707 24.122432 24.122432 0 0 0-8.322239-32.927119 24.122432 24.122432 0 0 0-18.212436-2.532855A307.922841 307.922841 0 0 0 253.285533 358.100273z"
												fill="#444444" p-id="2619"></path>
											<path
												d="M1015.916211 413.220029a24.122432 24.122432 0 0 0-10.131421-15.07652 24.122432 24.122432 0 0 0-17.971212-3.618364 24.122432 24.122432 0 0 0-15.197132 10.131421 23.157534 23.157534 0 0 0-3.618364 17.971212A464.598035 464.598035 0 1 1 423.710513 54.157633a24.122432 24.122432 0 0 0 15.317744-10.010809 24.122432 24.122432 0 0 0 3.618365-17.971212 24.122432 24.122432 0 0 0-10.131422-15.317744 24.122432 24.122432 0 0 0-17.971211-3.618364 511.878001 511.878001 0 0 0-326.497113 217.101885 512.239837 512.239837 0 0 0 138.100921 711.611735 510.310043 510.310043 0 0 0 285.609592 88.046876 522.491871 522.491871 0 0 0 98.781357-9.769585 512.601674 512.601674 0 0 0 405.377465-601.010386z"
												fill="#444444" p-id="2620"></path>
											<path
												d="M567.842042 50.418656a429.982345 429.982345 0 0 1 211.674339 80.930759 511.395552 511.395552 0 0 1 126.763378 133.397047L566.877145 438.548582V50.418656z"
												fill="#50B3EA"></path>
										</svg>
									</div>
								</Tooltip>
							</div>
						</Input>
					</div>
					<div className="flex items-center">
						<Button type="text" danger shape="circle" className="w-6 !h-6 min-w-0 ml-2 cursor-pointer">
							<svg className="icon w-2.5 h-2.5" viewBox="0 0 1024 1024" version="1.1"
								 xmlns="http://www.w3.org/2000/svg" width="32" height="32">
								<path
									d="M12.47232 12.51328C26.74688-1.76128 49.5104-2.90816 65.15712 9.84064l2.93888 2.70336L1009.664 955.37152c14.96064 14.80704 15.62624 38.76864 1.51552 54.38464-14.12096 15.616-38.02112 17.3568-54.26176 3.95264l-2.9696-2.70336L12.41088 68.17792c-15.34976-15.39072-15.31904-40.30464 0.06144-55.66464z m0 0"
									fill="red"/>
								<path
									d="M1009.67424 12.51328c-14.2848-14.27456-37.04832-15.42144-52.69504-2.67264l-2.99008 2.70336L12.41088 955.37152c-14.96064 14.80704-15.62624 38.76864-1.51552 54.38464 14.12096 15.616 38.02112 17.3568 54.25152 3.95264l2.9696-2.70336 941.568-942.82752c15.34976-15.38048 15.32928-40.30464-0.0512-55.66464h0.04096z m0 0"
									fill="red"/>
							</svg>
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
