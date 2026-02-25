<template>
  <div class="base-chart-container">
    <apexchart
      :type="type"
      :height="height"
      :options="computedOptions"
      :series="series"
    />
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'

export default {
  name: 'BaseChart',
  components: {
    apexchart: VueApexCharts
  },
  props: {
    type: { type: String, default: 'line' },
    height: { type: [String, Number], default: 300 },
    options: { type: Object, required: true },
    series: { type: Array, required: true }
  },
  computed: {
    isDark() {
      return this.$q.dark.isActive;
    },
    computedOptions() {
      // Merge base options with theme-specific overrides
      return {
        ...this.options,
        theme: {
          mode: this.isDark ? 'dark' : 'light'
        },
        chart: {
          ...this.options.chart,
          background: 'transparent',
          toolbar: { show: false }
        },
        grid: {
          borderColor: this.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          strokeDashArray: 4
        }
      };
    }
  }
}
</script>
