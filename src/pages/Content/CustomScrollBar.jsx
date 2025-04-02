import React, {useEffect, useState} from 'react'
import '../../output.css'
import PropTypes from 'prop-types'

export const CustomScrollBar = (props) => {
	const { current } = props

	const [ resultList, setResultList ] = useState([])
	const [ positionList, setPositionList ] = useState([])
	const [ scrollStyle, setScrollStyle ] = useState({})

	useEffect(() => {
		chrome.storage.sync.get('scrollObject').then(res => {
			if (Object.keys(res).length === 0) {
				setScrollStyle({
					isShowScroll: true,
					bgColor: 'rgba(219,219,219,0.1)',
					width: 12,
					blockHeight: 4,
					normalColor: '#ffff37',
					normalBorderColor: '#a3a3a3',
					activeColor: '#ff8b3a',
					activeBorderColor: '#a3a3a3',
				})
			} else {
				setScrollStyle(res.scrollObject)
			}
		})

		const handler = (e) => setResultList(e.detail)
		window.addEventListener('filteredRangeListChange', handler);
		return () => window.removeEventListener('filteredRangeListChange', handler);
	}, []);

	useEffect(() => {
		console.log(document.scrollingElement)
		console.log(document.scrollingElement.scrollHeight === document.body.clientHeight)

		const tempList = []
		for (let i = 0; i < resultList.length; i++) {
			const rect = resultList[i].getBoundingClientRect()
			console.log(resultList[i], rect.top, document.scrollingElement.scrollTop, document.scrollingElement.scrollHeight)
			const percent = (rect.top+document.scrollingElement.scrollTop)/document.scrollingElement.scrollHeight
			const index = tempList.findIndex(t => t.percent === percent)

			if (index > -1) {
				tempList[index].indexArr.push(i+1)
			} else {
				tempList.push({
					indexArr: [i+1],
					percent
				})
			}
		}
		setPositionList(tempList)
	}, [resultList]);

	if (!scrollStyle.isShowScroll) {
		return null
	}
	//
	// if (document.scrollingElement.scrollHeight === document.body.clientHeight) {
	// 	return null
	// }

	return (
		<div className="fixed right-0 top-0 h-[100%]" style={{ width: `${scrollStyle.width}px`, backgroundColor: scrollStyle.bgColor }}>
			{
				positionList.map((position, idx) => {
					return (
						<div className="absolute w-full" key={idx} style={{ borderWidth: '1px', borderStyle: 'solid', height: `${scrollStyle.blockHeight}px`, top: position.percent*100+'%', backgroundColor: position.indexArr.includes(current) ? scrollStyle.activeColor : scrollStyle.normalColor, borderColor: position.indexArr.includes(current) ? scrollStyle.activeBorderColor : scrollStyle.normalBorderColor, }}></div>
					)
				})
			}
		</div>
	)
}

CustomScrollBar.propTypes = {
	current: PropTypes.number,
}
