<template>
  <q-card
    class="base-card q-mb-md"
    :class="{ 'shadow-1': !flat, 'q-card--bordered': bordered }"
    :flat="flat"
  >
    <q-card-section v-if="title || $slots.header" class="row items-center q-pb-none">
      <div v-if="title" class="text-subtitle1 text-weight-medium">{{ title }}</div>
      <slot name="header"></slot>
    </q-card-section>

    <q-card-section>
      <slot></slot>
    </q-card-section>

    <q-card-actions v-if="$slots.actions" :align="actionAlign">
      <slot name="actions"></slot>
    </q-card-actions>
  </q-card>
</template>

<script>
export default {
  name: 'BaseCard',
  props: {
    title: {
      type: String,
      default: ''
    },
    flat: {
      type: Boolean,
      default: false
    },
    bordered: {
      type: Boolean,
      default: false
    },
    actionAlign: {
      type: String,
      default: 'right',
      validator: (val) => ['left', 'center', 'right', 'around', 'between'].includes(val)
    }
  }
}
</script>

<style lang="scss" scoped>
.base-card {
  border-radius: $border-radius;
  transition: box-shadow 0.3s ease;
}
</style>
