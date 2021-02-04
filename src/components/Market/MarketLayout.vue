<template>
    <div>
        <h1>基金市场</h1>
        <UnitNavPanel ref='UnitNavPanel'></UnitNavPanel>
		<ReturnDistributionPanel ref='ReturnDistributionPanel'></ReturnDistributionPanel>
		<ReturnAvgPanel ref="ReturnAvgPanel"></ReturnAvgPanel>
        <AssetPanel ref='AssetPanel'></AssetPanel>
        <SectorPanel ref='SectorPanel'></SectorPanel>
		<IncomePanel ref="IncomePanel"></IncomePanel>
    </div>
</template>

<script>
import UnitNavPanel from './MarketPanel/UnitNavPanel'
import ReturnDistributionPanel from './MarketPanel/ReturnDistributionPanel'
import ReturnAvgPanel from './MarketPanel/ReturnAvgPanel'
import AssetPanel from './MarketPanel/AssetPanel'
import SectorPanel from './MarketPanel/SectorPanel'
import IncomePanel from './MarketPanel/IncomePanel'

export default {
    name: 'marketLayout',
    data () {
        return {}
    },
    components: {
        UnitNavPanel, ReturnDistributionPanel, ReturnAvgPanel, AssetPanel, SectorPanel, IncomePanel
    }
}
</script>

<style scoped>
</style>
