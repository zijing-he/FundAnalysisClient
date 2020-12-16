<template>
    <div>
        <h4>基金持仓的行业规模图</h4>
        <div id='fundSector' style='width: 50vm; height: 300px'></div>
    </div>
</template>

<script>
let myChart, layout, isFirstDraw

function drawSectorValues (timelineData, xData, seriesData, isFirstDraw) {
    if (isFirstDraw) {
        myChart = myChart.init(document.getElementById('fundSector'))
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
                calculable: true,
                grid: {top: 80, bottom: 100},
                xAxis: [{'type': 'category', 'axisLabel': {'interval': 0}, data: xData, splitLine: {show: false}}],
                yAxis: [{type: 'value', name: '规模（元）',}],
                series: [{name: '规模', type: 'bar'}]
            },
            options: seriesData
        }
        myChart.setOption(option)
    } else {
        let option = myChart.getOption()
        option.timeline[0].data = timelineData
        option.xAxis[0].data = xData
        option.options = seriesData
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
    name: 'fundSectorPanel',
    methods: {
        draw (fundId) {
            this.$http.post(this.$remoteIP + 'get_fund_sector', {
                'f_ids': [fundId]
            }).then(response => {
                let echartsData = this.$fundTool.fundSector2echartsData(Object.values(response.data)[0])
                drawSectorValues(echartsData['timelineData'], echartsData['xData'], echartsData['seriesData'], isFirstDraw)
                isFirstDraw = false
            })
        },
        monitoring () { // 监听事件
            this.$on('drawFund', (managerId) => {
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
