<template>
  <div class="q-pa-md q-pa-md-xl">
    <div class="text-h4 q-mb-xl text-weight-bold">Settings</div>

    <div class="row q-col-gutter-lg">
      <div class="col-12 col-md-6">
        <q-card flat class="q-pa-md">
          <div class="text-h6 q-mb-md">Preferences</div>

          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label>Language</q-item-label>
                <q-item-label caption>Select your preferred language</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-select
                  v-model="selectedLang"
                  :options="langOptions"
                  filled dense emit-value map-options
                  @update:model-value="updateLanguage"
                  style="min-width: 150px"
                />
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label>Dark Mode</q-item-label>
                <q-item-label caption>Toggle application theme</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-toggle v-model="isDarkMode" @update:model-value="updateTheme" color="primary" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageSettings',
  data() {
    return {
      selectedLang: this.$i18n.locale,
      isDarkMode: this.$q.dark.isActive,
      langOptions: [
        { label: 'English (US)', value: 'en-US' },
        { label: 'Italiano', value: 'it' },
        { label: 'Español', value: 'es' }
      ]
    }
  },
  watch: {
    '$q.dark.isActive'(val) {
      this.isDarkMode = val;
    }
  },
  methods: {
    updateLanguage(lang) {
      this.$i18n.locale = lang;
      this.$q.localStorage.set('app-lang', lang);

      import(/* @vite-ignore */ `../i18n/${lang}`).then(langConfig => {
        this.$q.lang.set(langConfig.default);
      }).catch(() => console.warn('Quasar lang pack missing.'));
    },
    updateTheme(isDark) {
      this.$q.dark.set(isDark);
      this.$q.localStorage.set('app-theme', isDark ? 'dark' : 'light');
    }
  }
}
</script>
