import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'
import { Quasar } from 'quasar'

export default ({ app }) => {
  // 1. Detect saved language or fallback to browser
  let langIso = localStorage.getItem('app-lang');

  if (!langIso) {
    const browserLang = Quasar.lang.getLocale();
    langIso = messages[browserLang] ? browserLang : 'en-US';
    localStorage.setItem('app-lang', langIso);
  }

  const i18n = createI18n({
    locale: langIso,
    fallbackLocale: 'en-US',
    messages
  })

  app.use(i18n)
}
