<template>
    <div>
        <h1>基金公司</h1>
        <label>基金公司<input ref='companyName' type='text' value='银河基金管理有限公司'></label>
		<button @click="drawCompany" type="button">查询</button>
        <FundSumPanel ref="FundSumPanel"></FundSumPanel>
		<ManagerSumPanel ref="ManagerSumPanel"></ManagerSumPanel>
		<FundAssetPanel ref="FundAssetPanel"></FundAssetPanel>
    </div>
</template>

<script>
import FundSumPanel from './CompanyPanel/FundSumPanel'
import ManagerSumPanel from './CompanyPanel/ManagerSumPanel'
import FundAssetPanel from './CompanyPanel/FundAssetPanel'


export default {
    name: 'companyLayout',
	methods: {
		drawCompany() {
			let companyName = this.$refs.companyName.value
			this.$refs.FundSumPanel.$emit('drawCompany', companyName)
			this.$refs.ManagerSumPanel.$emit('drawCompany', companyName)
			this.$refs.FundAssetPanel.$emit('drawCompany', companyName)
		}
	},
    data () {
        return {}
    },
    components: {FundSumPanel, ManagerSumPanel, FundAssetPanel}
}
</script>

<style scoped>
</style>
