<template>
  <router-view />
</template>

<script>
export default {
  name: 'App',
  created() {
    // Initialize Theme
    const savedTheme = this.$q.LocalStorage.getItem('app-theme');
    if (savedTheme) {
      this.$q.dark.set(savedTheme === 'dark');
    } else {
      this.$q.dark.set('auto'); // Follow OS preference
    }

    // Sync Quasar internal language with Vue-i18n
    const langIso = this.$q.LocalStorage.getItem('app-lang') || 'en-US';
    import(/* @vite-ignore */`../i18n/${langIso}`).then(lang => {
      this.$q.lang.set(lang.default);
    }).catch(err => console.warn('Language pack not found:', err));
  }
}
</script>
