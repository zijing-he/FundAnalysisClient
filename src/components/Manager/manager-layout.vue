<template>
  <div>
    <a-row>
      <a-col :span="10">
        <h2>基金经理</h2>
      </a-col>
      <a-col :span="10">
        <label>基金经理编号<input v-model="managerID" type='text'></label>
      </a-col>
      <a-col :span="4">
        <a-button type="primary" @click='drawManager'>
          <SearchOutlined/>查询
        </a-button>
      </a-col>
    </a-row>
    <ManagerUnitNavPanel
        :manager-unit-nav-data="managerUnitNavData"
        :manager-date="managerDate"
        @updateDate="debounceZoom"
    ></ManagerUnitNavPanel>
    <!--    <AccNavPanel ref='AccNavPanel'></AccNavPanel>-->
    <ManagerIncomePanel
        :manager-income-data="managerUnitNavData"
        :manager-date="managerDate"
        @updateDate="debounceZoom"
    ></ManagerIncomePanel>
    <!--    <AssetPanel ref='AssetPanel'></AssetPanel>-->
    <!--    <SectorPanel ref='SectorPanel'></SectorPanel>-->
  </div>
</template>

<script>
import _ from "lodash";
import DataService from "@/utils/data-service";
import { SearchOutlined } from '@ant-design/icons-vue';
import ManagerUnitNavPanel from "@/components/Manager/manager-panel-unit-nav"
// import AccNavPanel from './ManagerPanel/AccNavPanel'
import ManagerIncomePanel from "@/components/Manager/manager-panel-income"
// import AssetPanel from './ManagerPanel/AssetPanel'
// import SectorPanel from './ManagerPanel/SectorPanel'

export default {
  name: 'ManagerLayout',
  components: {
    SearchOutlined,
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
  created() {
    this.debounceZoom = _.debounce(this.updateDate,33);
  },
  unmounted() {
    this.debounceZoom.cancel();
  },
  methods: {
    drawManager () {
      DataService.post('get_fund_ids', {'f_ids': [this.managerID]}, //
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
