import { createRoot } from 'preact/compat/client'
import '../../i18n'
import { Options } from './Options'
import styles from '../../global.css'

const container = document.getElementById('app-container')
if (container) {
	const root = createRoot(container)
	root.render(
		<div style={{ height: '100%' }}>
			<Options title={'Settings'} />
			<style type="text/css">{styles}</style>
		</div>
	)
}
