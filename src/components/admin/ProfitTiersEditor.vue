<template>
  <div class="profit-tiers-editor">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-subtitle1 text-weight-bold">Profit Tiers</div>
      <q-btn outline color="primary" label="Add Tier" icon="las la-plus" size="sm" @click="addTier" />
    </div>

    <q-markup-table flat bordered dense class="q-mb-md shadow-0">
      <thead class="bg-grey-1">
        <tr>
          <th class="text-left" style="width: 150px">Min Price</th>
          <th class="text-left" style="width: 150px">Max Price</th>
          <th class="text-left" style="width: 150px">Profit Value</th>
          <th class="text-left" style="width: 120px">Type</th>
          <th style="width: 50px"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(tier, index) in modelValue" :key="index">
          <td>
            <q-input 
              v-model.number="tier.min_price" 
              type="number" 
              dense 
              filled 
              prefix="€"
              placeholder="0.00"
            />
          </td>
          <td>
            <q-input 
              v-model.number="tier.max_price" 
              type="number" 
              dense 
              filled 
              prefix="€"
              placeholder="10.00"
            />
          </td>
          <td>
            <q-input 
              v-model.number="tier.profit_value" 
              type="number" 
              dense 
              filled 
              :suffix="variationType === 'PERCENT' ? '%' : '€'"
              placeholder="5.00"
            />
          </td>
          <td>
            <q-btn-toggle
              v-model="variationType"
              toggle-color="primary"
              flat
              dense
              unelevated
              size="sm"
              :options="[
                {label: '%', value: 'PERCENT'},
                {label: 'Unit', value: 'UNIT'}
              ]"
              @update:model-value="$emit('update:variationType', $event)"
            />
          </td>
          <td class="text-center">
            <q-btn 
              flat 
              round 
              color="negative" 
              icon="las la-trash" 
              size="sm" 
              @click="removeTier(index)" 
            />
          </td>
        </tr>
        <tr v-if="!modelValue || modelValue.length === 0">
          <td colspan="5" class="text-center q-pa-md text-grey-6 italic">
            No profit tiers defined. Click "Add Tier" to start.
          </td>
        </tr>
      </tbody>
    </q-markup-table>
    
    <div class="text-caption text-grey-6">
      <q-icon name="las la-info-circle" size="xs" />
      Standard ranges recommendation: 0-10, 10-25, 25-50, 50-100, 100+.
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
  methods: {
    addTier() {
      const newList = [...this.modelValue];
      newList.push({
        min_price: 0,
        max_price: 0,
        profit_value: 0
      });
      this.$emit('update:modelValue', newList);
    },
    removeTier(index) {
      const newList = [...this.modelValue];
      newList.splice(index, 1);
      this.$emit('update:modelValue', newList);
    }
  }
}
</script>

<style lang="scss" scoped>
.profit-tiers-editor {
  .q-input {
    body.body--dark & {
      :deep(.q-field__inner) {
        background: rgba(255, 255, 255, 0.05);
      }
    }
  }
}
</style>
