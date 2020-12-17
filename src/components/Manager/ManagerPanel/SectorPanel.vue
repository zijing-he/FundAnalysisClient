<template>
    <div>
        <h4>基金经理行业市值分布图</h4>
        <div id='managerSector' style='width: 50vm; height: 300px'></div>
    </div>
</template>

<script>
let myChart, layout, isFirstDraw

function drawManager (legendData, timelineData, xData, seriesData, optionsData, isFirstDraw) {
    if (isFirstDraw) {
        myChart = myChart.init(document.getElementById('managerSector'))
        let option = {
            baseOption: {
                timeline: {
                    axisType: 'category',
                    autoPlay: true,
                    playInterval: 1000,
                    data: timelineData,
                    label: {}
                },
                tooltip: {},
                legend: {left: 'right', data: legendData},
                calculable: true,
                grid: {top: 80, bottom: 100},
                xAxis: [{'type': 'category', 'axisLabel': {'interval': 0}, data: xData, splitLine: {show: false}}],
                yAxis: [{type: 'value', name: '规模（元）',}],
                series: seriesData
            },
            options: optionsData
        }
        myChart.setOption(option)
    } else {
        let option = myChart.getOption()
        option.legend[0].data = legendData
        option.timeline[0].data = timelineData
        option.xAxis[0].data = xData
        option.series = seriesData
        option.options = optionsData
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
    name: 'managerSectorPanel',
    methods: {
        draw (managerID) {
            this.$http.post(this.$remoteIP + 'get_manager_sector', {
                'm_ids': [managerID]
            }).then(response => {
                let echartsData = this.$fundTool.managerSector2echartsData(response.data)
                drawManager(echartsData['legendData'], echartsData['timelineData'], echartsData['xData'], echartsData['seriesData'], echartsData['optionsData'], isFirstDraw)
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
        layout = this.$parent
        this.monitoring() // 注册监听事件
    }
}
</script>

<style scoped>
</style>
