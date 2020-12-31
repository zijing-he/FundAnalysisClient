<template>
  <div>
    <h1>基金经理</h1>
    <label>基金经理编号<input v-model="managerID" type='text'></label>
    <button @click='drawManager' type='button'>查询</button>
    <ManagerUnitNavPanel
        :manager-unit-nav-data="managerUnitNavData"
        :manager-date="managerDate"
        @updateDate="updateDate"></ManagerUnitNavPanel>
    <!--    <AccNavPanel ref='AccNavPanel'></AccNavPanel>-->
    <ManagerIncomePanel
        :manager-income-data="managerUnitNavData"
        :manager-date="managerDate"
        @updateDate="updateDate"></ManagerIncomePanel>
    <!--    <AssetPanel ref='AssetPanel'></AssetPanel>-->
    <!--    <SectorPanel ref='SectorPanel'></SectorPanel>-->
  </div>
</template>

<script>
import DataService from "@/utils/data-service";
import ManagerUnitNavPanel from "@/components/Manager/manager-panel-unit-nav"
// import AccNavPanel from './ManagerPanel/AccNavPanel'
import ManagerIncomePanel from "@/components/Manager/manager-panel-income"
// import AssetPanel from './ManagerPanel/AssetPanel'
// import SectorPanel from './ManagerPanel/SectorPanel'

export default {
  name: 'ManagerLayout',
  components: {
    ManagerUnitNavPanel,
    // AccNavPanel,
    ManagerIncomePanel,
    // AssetPanel,
    // SectorPanel
  },
  data () {
    return {
      managerID: '101001715',
      managerUnitNavData: null,
      managerDate: [0, 100],
    }
  },
  methods: {
    drawManager () {
      DataService.post('get_manager_nav', {'m_ids': [this.managerID]},
          data => this.managerUnitNavData = data)
      // this.$refs.AccNavPanel.$emit('drawManager', managerId)
      // this.$refs.AssetPanel.$emit('drawManager', managerId)
      // this.$refs.SectorPanel.$emit('drawManager', managerId)
    },
    updateDate (interval) {
      this.managerDate = interval
      // this.$refs.UnitNavPanel.$emit('updateDataZoom', start, end)
      // this.$refs.AccNavPanel.$emit('updateDataZoom', start, end)
      // this.$refs.IncomePanel.$emit('updateDataZoom', start, end)
      // this.$refs.AssetPanel.$emit('updateDataZoom', start, end)
    }
  },
}
</script>

<style scoped>
</style>
