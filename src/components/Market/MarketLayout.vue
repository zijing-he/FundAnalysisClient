<template>
    <div>
        <h1>基金市场</h1>
        <UnitNavPanel ref='UnitNavPanel'></UnitNavPanel>
        <AssetPanel ref='AssetPanel'></AssetPanel>
        <SectorPanel ref='SectorPanel'></SectorPanel>
    </div>
</template>

<script>
import UnitNavPanel from './MarketPanel/UnitNavPanel'
import AssetPanel from './MarketPanel/AssetPanel'
import SectorPanel from './MarketPanel/SectorPanel'

export default {
    name: 'marketLayout',
    data () {
        return {}
    },
    components: {
        UnitNavPanel, AssetPanel, SectorPanel
    }
}
</script>

<style scoped>
</style>
