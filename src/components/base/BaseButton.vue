<template>
  <q-btn
    :color="color"
    :icon="icon"
    :label="label"
    :outline="outline"
    :flat="flat"
    :unelevated="!flat && !outline"
    :loading="loading"
    class="base-button"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </q-btn>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    label: { type: String, default: '' },
    icon: { type: String, default: '' },
    color: { type: String, default: 'primary' },
    outline: { type: Boolean, default: false },
    flat: { type: Boolean, default: false },
    loading: { type: Boolean, default: false }
  }
}
</script>

<style lang="scss" scoped>
.base-button {
  border-radius: $border-radius;
  font-weight: 500;
  text-transform: none; // Better readability than uppercase
}
</style>
