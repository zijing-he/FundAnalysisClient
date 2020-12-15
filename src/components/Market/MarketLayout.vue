<template>
    <div>
        <h1>基金市场</h1>
    </div>
</template>

<script>
import AssetDisPanel from './MarketPanel/AssetDisPanel'
import UnitNetPanel from './MarketPanel/NavDistributionPanel'
import SectorValuePanel from './MarketPanel/SectorValuePanel'

export default {
    name: 'marketLayout',
    methods: {},
    data () {
        return {}
    },
    components: {
        AssetDisPanel, UnitNetPanel, SectorValuePanel
    },
    mounted () {
    }
}
</script>

<style scoped>
</style>
