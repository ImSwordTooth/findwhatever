import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locales/en.json'
import ko from './locales/ko.json'
import ja from './locales/ja.json'
import ru from './locales/ru.json'
import es from './locales/es.json'
import fr from './locales/fr.json'
import de from './locales/de.json'
import pt from './locales/pt.json'
import ar from './locales/ar.json'

export const resources = {
	English: { translation: en },
	Korean: { translation: ko },
	Japanese: { translation: ja },
	Russian: { translation: ru },
	Spanish: { translation: es },
	French: { translation: fr },
	German: { translation: de },
	Portuguese: { translation: pt },
	Arabic: { translation: ar }
}

i18n
	.use(initReactI18next)
	.init({
		resources,
		interpolation: {
			escapeValue: false
		},
		showSupportNotice: false
	})

export default i18n
export * from './helpers'
