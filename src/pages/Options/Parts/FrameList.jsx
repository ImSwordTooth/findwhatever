import React from'react'
import { useTranslation } from 'react-i18next'

export const FrameList = () => {
	const { t } = useTranslation();

	return (
		<div>
			<div className="areaTitle mt-[30px]">{t('页面列表')}</div>
			<div>
				<div>{t('包含当前页，和页面中的 iframe，每个页面在右侧列出了匹配结果的数量。')}</div>
				<div>{t('iframe 做了判断，只有“有实际内容的”和“没发生错误的”才会参与查找。')}</div>
				<div>{t('页面下方的小横条代表了页面的数量和状态。')}</div>
				<div>{t('不再限制页面的 http 协议，现在可以搜索本地文件和 srcdoc 的页面了。')}</div>
			</div>
		</div>
	)
}
