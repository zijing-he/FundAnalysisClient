<template>
    <div>
        <h1>基金市场</h1>
        <UnitNavPanel ref='UnitNavPanel'></UnitNavPanel>
		<ReturnDistributionPanel ref='ReturnDistributionPanel'></ReturnDistributionPanel>
		<ReturnAvgPanel ref="ReturnAvgPanel"></ReturnAvgPanel>
        <AssetPanel ref='AssetPanel'></AssetPanel>
        <SectorPanel ref='SectorPanel'></SectorPanel>
    </div>
</template>

<script>
import UnitNavPanel from './MarketPanel/UnitNavPanel'
import ReturnDistributionPanel from './MarketPanel/ReturnDistributionPanel'
import ReturnAvgPanel from './MarketPanel/ReturnAvgPanel'
import AssetPanel from './MarketPanel/AssetPanel'
import SectorPanel from './MarketPanel/SectorPanel'

export default {
    name: 'marketLayout',
    data () {
        return {}
    },
    components: {
        UnitNavPanel, ReturnDistributionPanel, ReturnAvgPanel, AssetPanel, SectorPanel
    }
}
</script>

<style scoped>
</style>
