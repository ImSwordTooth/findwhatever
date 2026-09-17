import { useTranslation } from 'react-i18next'

export const FrameList = () => {
	const { t } = useTranslation()

	return (
		<div>
			<div className="areaTitle">{t('页面列表')}</div>
			<div className="space-y-2.5">
				<p className="mb-2.5">{t('包含当前页，和页面中的 iframe，每个页面在右侧列出了匹配结果的数量。')}</p>
				<p className="mb-2.5">{t('iframe 做了判断，只有“有实际内容的”和“没发生错误的”才会参与查找。')}</p>
				<p className="mb-2.5">{t('页面下方的小横条代表了页面的数量和状态。')}</p>
				<p className="mb-2.5">{t('不再限制页面的 http 协议，现在可以搜索本地文件和 srcdoc 的页面了。')}</p>
			</div>
		</div>
	)
}
