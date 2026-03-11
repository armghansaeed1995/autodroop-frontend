<template>
  <q-page class="settings-wrapper">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </q-page>
</template>

<script>
export default {
  name: 'CustomerSettingsPage'
}
</script>

<style lang="scss" scoped>
.settings-wrapper {
  background-color: var(--q-bg-light);
  body.body--dark & {
    background-color: var(--q-bg-dark);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
