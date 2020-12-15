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
        <div id="managerLayout">
          <ManagerLayout/>
        </div>
        <div id="fundLayout">
          <FundLayout/>
        </div>
    </div>
</template>

<script>
import MarketNavDistributionPanel from './Market/NavDistributionPanel'
import MarketAssetDistributionPanel from './Market/AssetDisPanel'
import MarketSectorValuePanel from './Market/SectorValuePanel'
import ManagerLayout from './Manager/ManagerLayout'
import FundLayout from './Fund/FundLayout'

// let manage_id = $('#manageID').val()
export default {
    name: 'layout',
    methods :{

    },
    data () {
        return {}
    },
    components: {
        MarketNavDistributionPanel, MarketAssetDistributionPanel, MarketSectorValuePanel,
      ManagerLayout, FundLayout
    },
    mounted () {
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
