<template>
    <div>
        <h4>基金经理单位净值图</h4>
        <div id='managerUnitNet' style='width: 50vm; height: 300px'></div>
    </div>
</template>

<script>
let myChart, layout, isFirstDraw

function drawNav (legendData, xData, series, isFirstDraw) {
    if (isFirstDraw) {
        myChart = myChart.init(document.getElementById('managerUnitNet'))
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
            yAxis: {name: '单位净值', splitLine: {show: false}},
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
    _option.dataZoom[0].start = start
    _option.dataZoom[0].end = end
    myChart.setOption(_option, true)
}

export default {
    name: 'unitNetPanel',
    methods: {
        draw (managerID) {
            this.$http.post(this.$remoteIP + 'get_manager_nav', {
                'm_ids': [managerID]
            }).then(response => {
                let echartsData = this.$fundTool.json2echartData(response.data)
                drawNav(echartsData['legendData'], echartsData['xData'], echartsData['series'], isFirstDraw)
                isFirstDraw = false
            })
        },
        monitoring () { // 监听事件
            this.$on('drawManager', (managerID) => {
                this.draw(managerID)
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
        layout = this.$parent
        this.monitoring() // 注册监听事件
    }
}
</script>

<style scoped>
</style>
