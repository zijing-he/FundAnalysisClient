<template>
    <div>
        <h4>基金经理收益图</h4>
        <div id='managerIncome' style='width: 50vm; height: 300px'></div>
    </div>
</template>

<script>
let myChart, fundTool, managerNav, layout, isFirstDraw

function drawManager (legendData, xData, series, isFirstDraw) {
    if (isFirstDraw) {
        myChart = myChart.init(document.getElementById('managerIncome'))
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
    let echartsData = fundTool.managerNav2income(managerNav, start)
    _option.series = echartsData.series
    _option.dataZoom[0].start = start
    _option.dataZoom[0].end = end
    myChart.setOption(_option, true)
}

export default {
    name: 'managerIncomePanel',
    methods: {
        draw (managerId) {
            this.$http.post(this.$remoteIP + 'get_manager_nav', {
                'm_ids': [managerId]
            }).then(response => {
                managerNav = response.data
                let echartsData = this.$fundTool.managerNav2income(managerNav, 0)
                drawManager(echartsData['legendData'], echartsData['xData'], echartsData['series'], isFirstDraw)
                isFirstDraw = false
            })
        },
        monitoring () { // 监听事件
            this.$on('drawManager', (managerId) => {
                this.draw(managerId)
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
