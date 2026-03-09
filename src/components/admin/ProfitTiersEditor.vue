<template>
  <div class="profit-tiers-editor">
    <div class="row items-center justify-between q-mb-lg">
      <div class="column">
        <div class="text-h6 text-weight-bold tracking-tight">Profit Margin Tiers</div>
        <div class="text-caption text-grey-6">Define automatic pricing based on supplier cost.</div>
      </div>
      <q-btn 
        outline 
        color="primary" 
        label="Add New Tier" 
        icon="las la-plus" 
        size="sm" 
        @click="addTier" 
        class="rounded-sm border-dashed"
      />
    </div>

    <div class="tiers-table-container shadow-sm border rounded-base overflow-hidden">
      <q-markup-table flat dense class="modern-table">
        <thead>
          <tr>
            <th class="text-left">Min Cost</th>
            <th class="text-left">Max Cost</th>
            <th class="text-left">Profit Value</th>
            <th class="text-center" style="width: 100px">Unit</th>
            <th style="width: 50px"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(tier, index) in internalModelValue" :key="index" class="tier-row">
            <td class="q-py-md">
              <q-input
                v-model.number="tier.min_price"
                type="number"
                dense
                filled
                prefix="€"
                placeholder="0.00"
                class="compact-input"
              />
            </td>
            <td class="q-py-md">
              <q-input
                v-model.number="tier.max_price"
                type="number"
                dense
                filled
                prefix="€"
                placeholder="10.00"
                class="compact-input"
              />
            </td>
            <td class="q-py-md">
              <q-input
                v-model.number="tier.profit_value"
                type="number"
                dense
                filled
                :suffix="variationType === 'PERCENT' ? '%' : '€'"
                placeholder="5.00"
                class="compact-input"
              />
            </td>
            <td class="text-center">
              <q-badge 
                :color="variationType === 'PERCENT' ? 'blue-1' : 'amber-1'" 
                :text-color="variationType === 'PERCENT' ? 'blue-9' : 'amber-9'"
                class="q-pa-sm text-weight-bold"
              >
                {{ variationType === 'PERCENT' ? 'Percentage' : 'Fixed Unit' }}
              </q-badge>
            </td>
            <td class="text-center">
              <q-btn
                flat
                round
                color="negative"
                icon="las la-trash-alt"
                size="sm"
                @click="removeTier(index)"
                class="delete-btn"
              />
            </td>
          </tr>
          <tr v-if="!internalModelValue || internalModelValue.length === 0">
            <td colspan="5" class="text-center q-pa-xl text-grey-5 empty-row">
              <q-icon name="las la-layer-group" size="48px" class="q-mb-md opacity-20" />
              <div>No profit tiers defined yet.</div>
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>

    <div class="row items-center q-mt-lg info-box q-pa-md rounded-sm bg-grey-1">
      <q-icon name="las la-info-circle" color="grey-7" size="sm" class="q-mr-sm" />
      <div class="text-caption text-grey-7">
        <b>Tip:</b> Standard recommended ranges are 0-10, 10-25, 25-50, 50-100, and 100+.
      </div>
      <q-space />
      <div class="row items-center no-wrap">
        <div class="text-caption text-grey-7 q-mr-md">Calculation Type:</div>
        <q-btn-toggle
          v-model="localVariationType"
          toggle-color="primary"
          flat
          dense
          unelevated
          size="sm"
          class="modern-toggle"
          :options="[
            {label: 'Percentage', value: 'PERCENT'},
            {label: 'Fixed Unit', value: 'UNIT'}
          ]"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfitTiersEditor',
  props: {
    modelValue: {
      type: Array,
      required: true,
      default: () => []
    },
    variationType: {
      type: String,
      default: 'PERCENT'
    }
  },
  emits: ['update:modelValue', 'update:variationType'],
  data() {
    return {
      internalModelValue: JSON.parse(JSON.stringify(this.modelValue))
    }
  },
  computed: {
    localVariationType: {
      get() {
        return this.variationType;
      },
      set(newValue) {
        this.$emit('update:variationType', newValue);
      }
    }
  },
  watch: {
    modelValue: {
      handler(newVal) {
        const currentStr = JSON.stringify(this.internalModelValue);
        const nextStr = JSON.stringify(newVal || []);
        if (currentStr !== nextStr) {
          this.internalModelValue = JSON.parse(nextStr);
        }
      },
      deep: true
    },
    internalModelValue: {
      handler(newVal) {
        const currentStr = JSON.stringify(this.modelValue);
        const nextStr = JSON.stringify(newVal || []);
        if (currentStr !== nextStr) {
          this.$emit('update:modelValue', newVal);
        }
      },
      deep: true
    }
  },
  methods: {
    addTier() {
      if (!this.internalModelValue) this.internalModelValue = [];
      this.internalModelValue.push({
        min_price: 0,
        max_price: 0,
        profit_value: 0
      });
    },
    removeTier(index) {
      this.internalModelValue.splice(index, 1);
    }
  }
}
</script>

<style lang="scss" scoped>
.profit-tiers-editor {
  .rounded-base {
    border-radius: 16px;
  }
  
  .border-dashed {
    border-style: dashed;
  }

  .modern-table {
    background: transparent;
    thead tr th {
      background: rgba(0, 0, 0, 0.03);
      color: #64748b;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
      padding: 16px;
      body.body--dark & {
        background: rgba(255, 255, 255, 0.05);
        color: #94a3b8;
      }
    }
  }

  .compact-input {
    :deep(.q-field__control) {
      height: 40px;
      min-height: 40px;
      background: rgba(0, 0, 0, 0.03);
      border: 1px solid transparent;
      transition: all 0.2s ease;
      &:hover {
        background: rgba(0, 0, 0, 0.05);
      }
      body.body--dark & {
        background: rgba(255, 255, 255, 0.05);
        &:hover {
          background: rgba(255, 255, 255, 0.08);
        }
      }
    }
    :deep(.q-field__marginal) {
      height: 40px;
    }
  }

  .tier-row {
    transition: background 0.2s ease;
    &:hover {
      background: rgba(0, 0, 0, 0.01);
      body.body--dark & {
        background: rgba(255, 255, 255, 0.02);
      }
      .delete-btn {
        opacity: 1;
      }
    }
  }

  .delete-btn {
    opacity: 0.5;
    transition: all 0.2s ease;
    &:hover {
      background: rgba($negative, 0.1);
      opacity: 1;
    }
  }

  .modern-toggle {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    padding: 2px;
    body.body--dark & {
      background: rgba(255, 255, 255, 0.1);
    }
    :deep(.q-btn) {
      border-radius: 6px;
      padding: 4px 12px;
    }
  }

  .info-box {
    border: 1px solid rgba(0,0,0,0.05);
    body.body--dark & {
      border-color: rgba(255,255,255,0.05);
      background: rgba(255,255,255,0.02) !important;
    }
  }

  .tracking-tight {
    letter-spacing: -0.025em;
  }
  
  .opacity-20 {
    opacity: 0.2;
  }
}
</style>
