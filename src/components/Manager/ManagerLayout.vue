<template>
    <div>
      <h1>基金经理</h1>
      <label>基金经理编号<input id="managerId" type="text" defaultValue="101001715" ref="managerId"></label>
<!--      <label>开始时间<input id="startDate" type="text" defaultValue="20130101" ref="startDate"></label>-->
      <button @click="drawChild" type="button">查询</button>
      <IncomeRatePanel ref="IncomeRatePanel"></IncomeRatePanel>
      <UnitNetPanel ref="UnitNetPanel"></UnitNetPanel>
      <AccNetPanel ref="AccNetPanel"></AccNetPanel>
      <NetAssetPanel ref="NetAssetPanel"></NetAssetPanel>
      <SectorValuePanel ref="SectorValuePanel"></SectorValuePanel>
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
    methods :{
        drawChild(){
          let managerId = this.$refs.managerId.value
          this.$refs.IncomeRatePanel.$emit('childMethod',managerId)
          this.$refs.UnitNetPanel.$emit('childMethod',managerId)
          this.$refs.AccNetPanel.$emit('childMethod',managerId)
          this.$refs.NetAssetPanel.$emit('childMethod',managerId)
          this.$refs.SectorValuePanel.$emit('childMethod',managerId)
        }
    },
    data () {
        return {}
    },
    components: {
        IncomeRatePanel, UnitNetPanel, AccNetPanel, NetAssetPanel, SectorValuePanel
    },
    mounted () {

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
