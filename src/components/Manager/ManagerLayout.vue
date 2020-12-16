<template>
    <div>
        <h1>基金经理</h1>
        <label>基金经理编号<input ref='managerId' type='text' value='101001715'></label>
        <button @click='drawManager' type='button'>查询</button>
        <UnitNavPanel ref='UnitNavPanel'></UnitNavPanel>
        <AccNavPanel ref='AccNavPanel'></AccNavPanel>
        <IncomePanel ref='IncomePanel'></IncomePanel>
        <AssetPanel ref='AssetPanel'></AssetPanel>
        <SectorPanel ref='SectorPanel'></SectorPanel>
    </div>
</template>

<script>
import UnitNavPanel from './ManagerPanel/UnitNavPanel'
import AccNavPanel from './ManagerPanel/AccNavPanel'
import IncomePanel from './ManagerPanel/IncomePanel'
import AssetPanel from './ManagerPanel/AssetPanel'
import SectorPanel from './ManagerPanel/SectorPanel'

export default {
    name: 'managerLayout',
    methods: {
        drawManager () {
            let managerId = this.$refs.managerId.value
            this.$refs.UnitNavPanel.$emit('drawManager', managerId)
            this.$refs.AccNavPanel.$emit('drawManager', managerId)
            this.$refs.IncomePanel.$emit('drawManager', managerId)
            this.$refs.AssetPanel.$emit('drawManager', managerId)
            this.$refs.SectorPanel.$emit('drawManager', managerId)
        },
        updateDate (start, end) {
            this.$refs.UnitNavPanel.$emit('updateDataZoom', start, end)
            this.$refs.AccNavPanel.$emit('updateDataZoom', start, end)
            this.$refs.IncomePanel.$emit('updateDataZoom', start, end)
            this.$refs.AssetPanel.$emit('updateDataZoom', start, end)
        }
    },
    data () {
        return {}
    },
    components: {
        UnitNavPanel, AccNavPanel, IncomePanel, AssetPanel, SectorPanel
    }
}
</script>

<style scoped>
</style>
