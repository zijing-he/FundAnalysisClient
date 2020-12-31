<template>
  <div>
    <h1>基金市场</h1>
    <MarketUnitNavPanel :market-unit-nav-data="marketUnitNavData"></MarketUnitNavPanel>
    <MarketAssetPanel></MarketAssetPanel>
    <!--        <SectorPanel ref='SectorPanel'></SectorPanel>-->
  </div>
</template>

<script>
import DataService from "@/utils/data-service";
import MarketUnitNavPanel from "@/components/Market/market-panel-unit-nav";
import MarketAssetPanel from "@/components/Market/market-panel-asset";
// import SectorPanel from './MarketPanel/SectorPanel'

export default {
  name: 'MarketLayout',
  data () {
    return {
      marketUnitNavData: null,
    }
  },
  components: {
    MarketUnitNavPanel,
    MarketAssetPanel,
    // SectorPanel
  },
  mounted() {
    DataService.post('get_market_unit_nav', {}, data => {
      this.marketUnitNavData = data
    })
  }
}
</script>

<style scoped>
</style>
