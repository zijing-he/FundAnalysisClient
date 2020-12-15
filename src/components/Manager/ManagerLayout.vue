<template>
    <div>
        <h1>基金经理</h1>
        <label>基金经理编号<input value='101001715' ref='managerId' type='text'></label>
        <button @click='drawManager' type='button'>查询</button>
        <UnitNetPanel ref='UnitNetPanel'></UnitNetPanel>
        <AccNetPanel ref='AccNetPanel'></AccNetPanel>
        <IncomeRatePanel ref='IncomeRatePanel'></IncomeRatePanel>
        <NetAssetPanel ref='NetAssetPanel'></NetAssetPanel>
        <SectorValuePanel ref='SectorValuePanel'></SectorValuePanel>
    </div>
</template>

<script>
import IncomeRatePanel from './ManagerPanel/IncomeRatePanel'
import UnitNetPanel from './ManagerPanel/UnitNetPanel'
import AccNetPanel from './ManagerPanel/AccNetPanel'
import NetAssetPanel from './ManagerPanel/NetAssetPanel'
import SectorValuePanel from './ManagerPanel/SectorValuePanel'

export default {
    name: 'managerLayout',
    methods: {
        drawManager () {
            let managerId = this.$refs.managerId.value
            this.$refs.UnitNetPanel.$emit('drawManager', managerId)
            this.$refs.AccNetPanel.$emit('drawManager', managerId)
            this.$refs.IncomeRatePanel.$emit('drawManager', managerId)
            this.$refs.NetAssetPanel.$emit('drawManager', managerId)
            this.$refs.SectorValuePanel.$emit('childMethod', managerId)
        },
        updateDate (start, end) {
            this.$refs.UnitNetPanel.$emit('updateDataZoom', start, end)
            this.$refs.AccNetPanel.$emit('updateDataZoom', start, end)
            this.$refs.IncomeRatePanel.$emit('updateDataZoom', start, end)
            this.$refs.NetAssetPanel.$emit('updateDataZoom', start, end)
        }
    },
    data () {
        return {}
    },
    components: {
        IncomeRatePanel, UnitNetPanel, AccNetPanel, NetAssetPanel, SectorValuePanel
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
