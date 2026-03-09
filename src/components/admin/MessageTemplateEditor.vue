<template>
  <div class="message-template-editor">
    <div class="column q-mb-xl">
      <div class="text-h6 text-weight-bold tracking-tight">Auto Message Templates</div>
      <div class="text-caption text-grey-6">Configure automatic messages sent to customers at different order stages.</div>
    </div>

    <div class="row q-col-gutter-lg">
      <div v-for="type in messageTypes" :key="type.key" class="col-12">
        <q-card flat class="message-card border transition-all shadow-hover">
          <q-card-section class="q-pa-lg">
            <div class="row items-center justify-between q-mb-md">
              <div class="row items-center">
                <div class="icon-box q-mr-md" :class="internalValue[type.statusKey] ? 'bg-primary-1' : 'bg-grey-2'">
                  <q-icon :name="type.icon" :color="internalValue[type.statusKey] ? 'primary' : 'grey-6'" size="24px" />
                </div>
                <div>
                  <div class="text-subtitle1 text-weight-bold">{{ type.label }}</div>
                  <div class="text-caption text-grey-6" v-if="internalValue[type.statusKey]">This message is currently active.</div>
                  <div class="text-caption text-grey-5 italic" v-else>This message is disabled.</div>
                </div>
              </div>
              <q-toggle
                v-model="internalValue[type.statusKey]"
                label="Active"
                color="primary"
                class="text-weight-medium"
                dense
              />
            </div>

            <q-input
              v-model="internalValue[type.key]"
              type="textarea"
              filled
              dense
              rows="4"
              :placeholder="'Write your ' + type.label.toLowerCase() + ' message here...'"
              :disable="!internalValue[type.statusKey]"
              class="modern-textarea"
            />

            <div class="q-mt-md rounded-sm bg-grey-1 q-pa-sm border-dashed">
              <div class="row items-center q-mb-xs">
                <q-icon name="las la-terminal" color="grey-6" size="xs" class="q-mr-xs" />
                <span class="text-caption text-weight-bold text-grey-7">Dynamic Variables</span>
              </div>
              <div class="row q-gutter-x-sm q-gutter-y-xs">
                <q-chip
                  v-for="token in type.tokens || commonTokens"
                  :key="token"
                  dense
                  clickable
                  outline
                  size="sm"
                  color="primary"
                  class="token-chip bg-white"
                  @click="insertToken(type.key, token)"
                  :disable="!internalValue[type.statusKey]"
                >
                  {{ token }}
                </q-chip>
              </div>
            </div>
          </q-card-section>
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
      internalValue: JSON.parse(JSON.stringify(this.modelValue || {})),
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
  watch: {
    modelValue: {
      handler(newVal) {
        const currentStr = JSON.stringify(this.internalValue);
        const nextStr = JSON.stringify(newVal || {});
        if (currentStr !== nextStr) {
          this.internalValue = JSON.parse(nextStr);
        }
      },
      deep: true
    },
    internalValue: {
      handler(newVal) {
        const currentStr = JSON.stringify(this.modelValue);
        const nextStr = JSON.stringify(newVal || {});
        if (currentStr !== nextStr) {
          this.$emit('update:modelValue', newVal);
        }
      },
      deep: true
    }
  },
  methods: {
    insertToken(field, token) {
      if (!this.internalValue[field]) {
        this.internalValue[field] = '';
      }
      this.internalValue[field] += ` ${token}`;
    }
  }
}
</script>

<style lang="scss" scoped>
.message-template-editor {
  .message-card {
    border-radius: 20px;
    background: transparent;
    &:hover {
      border-color: $primary;
    }
  }

  .icon-box {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    &.bg-grey-2 {
      body.body--dark & {
        background: rgba(255, 255, 255, 0.05) !important;
      }
    }
  }

  .modern-textarea {
    :deep(.q-field__control) {
      background: rgba(0, 0, 0, 0.02);
      border-radius: 12px;
      padding: 8px;
      transition: all 0.2s ease;
      &:hover {
        background: rgba(0, 0, 0, 0.04);
      }
      body.body--dark & {
        background: rgba(255, 255, 255, 0.05);
        &:hover {
          background: rgba(255, 255, 255, 0.08);
        }
      }
    }
  }

  .token-chip {
    font-family: monospace;
    font-weight: 600;
    transition: all 0.2s ease;
    body.body--dark & {
      background: rgba(255, 255, 255, 0.05) !important;
    }
    &:hover:not(.q-chip--disabled) {
      background: $primary !important;
      color: white !important;
      transform: translateY(-2px);
    }
  }

  .border-dashed {
    border: 1px dashed rgba(0,0,0,0.1);
    body.body--dark & {
      border-color: rgba(255,255,255,0.1);
      background: rgba(255, 255, 255, 0.02) !important;
    }
  }

  .transition-all {
    transition: all 0.3s ease;
  }

  .shadow-hover:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05) !important;
  }

  .tracking-tight {
    letter-spacing: -0.025em;
  }
  
  .bg-primary-1 {
    background-color: rgba($primary, 0.08);
  }
}
</style>
