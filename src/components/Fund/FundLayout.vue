<template>
    <div>
        <h1>基金</h1>
        <label>基金编号<input defaultValue='510310' id='fundId' ref='fundId' type='text'></label>
        <button @click='drawChild' type='button'>查询</button>
        <FundSectorValuePanel ref='FundSectorValuePanel'></FundSectorValuePanel>
        <FundIncomeRatePanel ref='FundIncomeRatePanel'></FundIncomeRatePanel>
    </div>
</template>

<script>
import FundSectorValuePanel from './FundPanel/SectorValuePanel'
import FundIncomeRatePanel from './FundPanel/IncomeRatePanel'

export default {
    name: 'fundLayout',
    methods: {
        drawChild () {
            let fundId = this.$refs.fundId.value
            this.$refs.FundSectorValuePanel.$emit('childMethod', fundId)
            this.$refs.FundIncomeRatePanel.$emit('childMethod', fundId)
        }
    },
    data () {
        return {}
    },
    components: {
        FundSectorValuePanel, FundIncomeRatePanel
    },
    mounted () {

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
