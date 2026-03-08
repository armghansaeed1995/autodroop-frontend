<template>
  <div class="message-template-editor">
    <div class="text-subtitle1 text-weight-bold q-mb-md">Message Templates Configuration</div>
    
    <div class="row q-col-gutter-lg">
      <div v-for="type in messageTypes" :key="type.key" class="col-12">
        <q-card flat bordered class="q-pa-md">
          <div class="row items-center justify-between q-mb-sm">
            <div class="row items-center">
              <q-avatar size="32px" color="primary-1" text-color="primary" :icon="type.icon" class="q-mr-sm" />
              <div class="text-subtitle2 text-weight-bold">{{ type.label }}</div>
            </div>
            <q-toggle 
              v-model="modelValue[type.statusKey]" 
              label="Active" 
              color="primary"
              dense
              @update:model-value="$emit('update:modelValue', modelValue)"
            />
          </div>
          
          <q-input
            v-model="modelValue[type.key]"
            type="textarea"
            filled
            dense
            rows="3"
            :placeholder="'Enter ' + type.label.toLowerCase() + ' message...'"
            :disable="!modelValue[type.statusKey]"
            @update:model-value="$emit('update:modelValue', modelValue)"
          />
          
          <div class="bg-grey-1 q-pa-sm q-mt-sm rounded-sm border">
            <div class="text-caption text-weight-bold text-grey-7 q-mb-xs">Variable Helper</div>
            <div class="row q-gutter-x-sm">
              <q-chip 
                v-for="token in type.tokens || commonTokens" 
                :key="token" 
                dense 
                outline 
                size="xs" 
                color="primary" 
                class="cursor-pointer"
                @click="insertToken(type.key, token)"
              >
                {{ token }}
              </q-chip>
            </div>
          </div>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessageTemplateEditor',
  props: {
    modelValue: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      commonTokens: ['{buyer_first_name}', '{order_id}', '{shop_name}'],
      messageTypes: [
        { key: 'msg_pending', statusKey: 'msg_pending_status', label: 'Order Pending', icon: 'las la-clock' },
        { key: 'msg_ordered', statusKey: 'msg_ordered_status', label: 'Order Placed', icon: 'las la-shopping-cart' },
        { key: 'msg_shipped', statusKey: 'msg_shipped_status', label: 'Order Shipped', icon: 'las la-shipping-fast', tokens: ['{tracking_code}', '{carrier_name}'] },
        { key: 'msg_delivered', statusKey: 'msg_delivered_status', label: 'Order Delivered', icon: 'las la-check-circle' },
        { key: 'msg_cancelled', statusKey: 'msg_cancelled_status', label: 'Order Cancelled', icon: 'las la-times-circle' },
        { key: 'msg_feedback', statusKey: 'msg_feedback_status', label: 'Feedback Request', icon: 'las la-star' },
        { key: 'msg_offer', statusKey: 'msg_offer_status', label: 'Special Offer', icon: 'las la-percentage' }
      ]
    }
  },
  methods: {
    insertToken(field, token) {
      if (!this.modelValue[field]) this.modelValue[field] = '';
      this.modelValue[field] += ` ${token}`;
      this.$emit('update:modelValue', this.modelValue);
    }
  }
}
</script>

<style lang="scss" scoped>
.rounded-sm {
  border-radius: 4px;
}
.border {
  border: 1px solid rgba(0, 0, 0, 0.05);
}
.bg-primary-1 {
  background-color: rgba($primary, 0.05);
}
</style>
