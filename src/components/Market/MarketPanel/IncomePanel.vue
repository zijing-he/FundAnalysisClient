<template>
    <div>
        <h4>市场基金行业收益图</h4>
        <div id='marketIncome' style='width: 50vm; height: 300px'></div>
    </div>
</template>

<script>
let myChart, fundTool, marketNav, layout, isFirstDraw

function drawManager (legendData, xData, series, isFirstDraw) {
    if (isFirstDraw) {
        myChart = myChart.init(document.getElementById('marketIncome'))
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
            update(e.start, e.end)
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
    let echartsData = fundTool.marketNav2income(marketNav, start)
    _option.series = echartsData.series
    _option.dataZoom[0].start = start
    _option.dataZoom[0].end = end
    myChart.setOption(_option, true)
}

export default {
    name: 'marketIncomePanel',
    methods: {
        draw () {
            this.$http.post(this.$remoteIP + 'get_market_sector_nav'
			).then(response => {
					marketNav = response.data
					let echartsData = this.$fundTool.marketNav2income(marketNav, 0)
					drawManager(echartsData['legendData'], echartsData['xData'], echartsData['series'], isFirstDraw)
					isFirstDraw = false
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
		this.draw()
    }
}
</script>

<style scoped>
</style>
