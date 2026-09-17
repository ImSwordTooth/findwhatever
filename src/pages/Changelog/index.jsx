import { createRoot } from 'preact/compat/client'
import '../../i18n'
import { ChangelogPage } from './ChangelogPage'
import styles from '../../global.css'

const container = document.getElementById('app-container')
if (container) {
	const root = createRoot(container)
	root.render(
		<>
			<ChangelogPage />
			<style type="text/css">{styles[0][1].toString()}</style>
		</>
	)
}
