import { boot } from 'quasar/wrappers'

const GLOBAL_CONSTANTS = {
  SUPPLIERS: ['Amazon']
}

export default boot(({ app }) => {
  // Set as a global property so it can be accessed in any component via this.$SUPPLIERS
  app.config.globalProperties.$SUPPLIERS = GLOBAL_CONSTANTS.SUPPLIERS
})

export { GLOBAL_CONSTANTS }
