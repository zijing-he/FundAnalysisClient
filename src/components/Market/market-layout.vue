<template>
  <div>
    <h2>基金市场</h2>
    <a-col>
      <MarketUnitNavPanel :market-unit-nav-data="marketUnitNavData"></MarketUnitNavPanel>
    </a-col>
    <a-col>
      <MarketAssetPanel></MarketAssetPanel>
    </a-col>
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
