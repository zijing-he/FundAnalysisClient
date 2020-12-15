<template>
    <div id='main'>
        <h1>总对比图</h1>
        <div id='marketLayout'>
            <MarketLayout/>
        </div>
        <div id='managerLayout'>
            <ManagerLayout/>
        </div>
        <div id='fundLayout'>
            <FundLayout/>
        </div>
    </div>
</template>

<script>
import MarketLayout from './Market/MarketLayout'
import ManagerLayout from './Manager/ManagerLayout'
import FundLayout from './Fund/FundLayout'

export default {
    name: 'layout',
    methods: {},
    data () {
        return {}
    },
    components: {
        MarketLayout, ManagerLayout, FundLayout
    },
    mounted () {
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
