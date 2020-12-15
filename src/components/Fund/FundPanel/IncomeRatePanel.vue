<template>
    <div>
        <h2>基金收益率变化图</h2>
        <!--        <div>-->
        <!--            <label>基金编号<input id="fundId-incomeRate" type="text" defaultValue="510310" ref="fundIdIncomeRate"></label>-->
        <!--            <button @click="()=>draw(this.$refs.fundIdIncomeRate.value)" type="button">查询</button>-->
        <!--        </div>-->
        <div id='fundIncomeRate' style='width: 50vm; height: 300px'></div>
    </div>
</template>

<script>
import $ from 'jquery'

let myChart
let fundTool
let fundNav
let isFirstDraw = true

function drawIncome (legendData, xData, series, isFirstDraw) {
    if (isFirstDraw) {
        myChart = myChart.init($('#fundIncomeRate').get(0))
        let option = {
            toolbox: {
                orient: 'vertical',
                feature: {
                    dataZoom: {yAxisIndex: false},
                    magicType: {type: ['line', 'bar']},
                    dataView: {readOnly: false},
                    restore: {},
                    saveAsImage: {}
                }
            },
            tooltip: {show: true, trigger: 'axis'},
            dataZoom: [{start: 80}, {type: 'inside'}],
            legend: {width: '50%', selector: true, data: legendData},
            xAxis: {data: xData},
            yAxis: {name: '收益率', splitLine: {show: false}},
            series: series
        }
        myChart.setOption(option)
        myChart.on('datazoom', function (e) {
            let stateDate = xData[parseInt(xData.length * e.start / 100)]
            console.log(e.start)
            console.log(stateDate)
            let echartsData = fundTool.fundNav2echartsData(fundNav, stateDate)
            let _option = myChart.getOption()
            _option.series = echartsData.series
            myChart.setOption(_option, true)
        })
    } else {
        let option = myChart.getOption()
        option.legend[0].data = legendData
        option.xAxis[0].data = xData
        option.series = series
        myChart.setOption(option)
    }
}

export default {
    name: 'incomeRatePanel',
    methods: {
        draw (fundId) {
            this.$http.post(this.$remoteIP + 'get_fund_nav', {
                'f_ids': [fundId]
            }).then(response => {
                fundNav = response.data
                let firstStartDate = Object.keys(Object.values(fundNav)[0])[0]
                let echartsData = this.$fundTool.fundNav2echartsData(fundNav, firstStartDate)
                drawIncome(echartsData['legendData'], echartsData['xData'], echartsData['series'], isFirstDraw)
                if (isFirstDraw) isFirstDraw = false
            })
        },
        monitoring () { // 监听事件
            this.$on('childMethod', (res) => {
                this.draw(res)
            })
        }
    },
    data () {
        return {}
    },
    mounted () {
        myChart = this.$chart
        fundTool = this.$fundTool
        this.monitoring() // 注册监听事件
    }
}
</script>

<style scoped>

</style>
