<template>
    <div>
        <h1>基金</h1>
        <label>基金编号<input ref='fundId' type='text' value='510310'></label>
        <button @click='drawFund' type='button'>查询</button>
        <FundIncomePanel ref='FundIncomePanel'></FundIncomePanel>
        <FundSectorPanel ref='FundSectorPanel'></FundSectorPanel>
    </div>
</template>

<script>
import FundSectorPanel from './FundPanel/FundSectorPanel'
import FundIncomePanel from './FundPanel/FundIncomePanel'

export default {
    name: 'fundLayout',
    methods: {
        drawFund () {
            let fundId = this.$refs.fundId.value
            this.$refs.FundIncomePanel.$emit('drawFund', fundId)
            this.$refs.FundSectorPanel.$emit('drawFund', fundId)
        },
        updateDate (start, end) {
            this.$refs.FundIncomePanel.$emit('updateDataZoom', start, end)
            this.$refs.FundSectorPanel.$emit('updateDataZoom', start, end)
        }
    },
    data () {
        return {}
    },
    components: {
        FundSectorPanel, FundIncomePanel
    }
}
</script>

<style scoped>
</style>
