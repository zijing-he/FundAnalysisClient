<template>
    <div id="main">
        <h1>总对比图</h1>
        <div id="marketNavDistributionPanel">
            <MarketNavDistributionPanel/>
        </div>
        <div id="marketAssetDistributionPanel">
            <MarketAssetDistributionPanel/>
        </div>
        <div id="marketSectorValuePanel">
          <MarketSectorValuePanel/>
        </div>
        <div id="manageIncomePanel">
            <ManagerIncomePanel/>
        </div>
        <div id="managerUnitNetPanel">
            <ManagerUnitNetPanel/>
        </div>
        <div id="managerAccNetPanel">
            <ManagerAccNetPanel/>
        </div>
        <div id="managerNetAssetPanel">
            <ManagerNetAssetPanel/>
        </div>
        <div id="managerSectorValuePanel">
            <ManagerSectorValuePanel/>
        </div>
        <div id="fundSectorValuePanel">
          <FundSectorValuePanel/>
        </div>
    </div>
</template>

<script>
import MarketNavDistributionPanel from './MarketPanel/NavDistributionPanel'
import MarketAssetDistributionPanel from './MarketPanel/AssetDisPanel'
import MarketSectorValuePanel from './MarketPanel/SectorValuePanel'
import ManagerIncomePanel from './ManagerPanel/IncomePanel'
import ManagerUnitNetPanel from './ManagerPanel/UnitNetPanel'
import ManagerAccNetPanel from './ManagerPanel/AccNetPanel'
import ManagerNetAssetPanel from './ManagerPanel/NetAssetPanel'
import ManagerSectorValuePanel from './ManagerPanel/SectorValuePanel'
import FundSectorValuePanel from './FundPanel/SectorValuePanel'

export default {
    name: 'layout',
    data () {
        return {}
    },
    components: {
        MarketNavDistributionPanel, MarketAssetDistributionPanel, MarketSectorValuePanel, ManagerIncomePanel, ManagerUnitNetPanel, ManagerAccNetPanel, ManagerNetAssetPanel, ManagerSectorValuePanel,
      FundSectorValuePanel
    },
    mounted () {
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
