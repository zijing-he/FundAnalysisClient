<template>
    <div>
        <h4>基金收益率变化图</h4>
        <div id='fundIncome' style='width: 50vm; height: 300px'></div>
    </div>
</template>

<script>
let myChart, fundTool,fundNav,layout,isFirstDraw

function drawFund (legendData, xData, series, isFirstDraw) {
    if (isFirstDraw) {
        myChart = myChart.init(document.getElementById('fundIncome'))
        let option = {
            toolbox: {
                orient: 'vertical',
                feature: {
                    dataZoom: {yAxisIndex: false},
                    magicType: {type: ['line', 'bar']},
                    dataView: {readOnly: false},
                    restore: {}, saveAsImage: {}
                }
            },
            tooltip: {show: true, trigger: 'axis'},
            dataZoom: [{start: 80}],
            legend: {width: '50%', selector: true, data: legendData},
            xAxis: {data: xData},
            yAxis: {name: '收益率', splitLine: {show: false}},
            series: series
        }
        myChart.setOption(option)
        myChart.on('datazoom', function (e) {
            layout.updateDate(e.start, e.end)
        })
    } else {
        let option = myChart.getOption()
        option.legend[0].data = legendData
        option.xAxis[0].data = xData
        option.series = series
        myChart.setOption(option)
    }
}

function update (start, end) {
    let _option = myChart.getOption()
    let echartsData = fundTool.fundNav2echartsData(fundNav, start)
    _option.series = echartsData.series
    _option.dataZoom[0].start = start
    _option.dataZoom[0].end = end
    myChart.setOption(_option, true)
}

export default {
    name: 'fundIncomePanel',
    methods: {
        draw (fundId) {
            this.$http.post(this.$remoteIP + 'get_fund_nav', {
                'f_ids': [fundId]
            }).then(response => {
                fundNav = response.data
                let echartsData = this.$fundTool.fundNav2echartsData(fundNav, 0)
                drawFund(echartsData['legendData'], echartsData['xData'], echartsData['series'], isFirstDraw)
                isFirstDraw = false
            })
        },
        monitoring () { // 监听事件
            this.$on('drawFund', (fundId) => {
                this.draw(fundId)
            })
            this.$on('updateDataZoom', (start, end) => {
                update(start, end)
            })
        }
    },
    data () {
        return {}
    },
    mounted () {
        isFirstDraw = true
        myChart = this.$chart
        fundTool = this.$fundTool
        layout = this.$parent
        this.monitoring() // 注册监听事件
    }
}
</script>

<style scoped>
</style>
