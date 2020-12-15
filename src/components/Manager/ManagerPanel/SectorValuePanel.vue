<template>
    <div>
        <h2>基金经理行业市值分布图</h2>
        <div id='managerSectorValue' style='width: 50vm; height: 300px'></div>
    </div>
</template>

<script>
let myChart, layout, isFirstDraw

function drawSectorValues (legendData, seriesData, isFirstDraw) {
    if (isFirstDraw) {
        myChart = myChart.init(document.getElementById('managerSectorValue'))
        let option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                left: 'center',
                data: legendData
            },
            toolbox: {
                show: true,
                feature: {
                    mark: {show: true},
                    dataView: {show: true, readOnly: false},
                    magicType: {show: true, type: ['pie', 'funnel']},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            series: [
                {
                    name: '',
                    type: 'pie',
                    radius: [30, 110],
                    center: ['50%', '50%'],
                    top: '20%',
                    roseType: 'area',
                    data: seriesData
                }
            ]
        }
        myChart.setOption(option)
    } else {
        let option = myChart.getOption()
        option.legend[0].data = legendData
        option.series[0].data = seriesData
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
    name: '',
    methods: {
        draw (managerID) {
            this.$http.post(this.$remoteIP + 'get_manager_sector', {
                'm_ids': [managerID]
            }).then(response => {
                let echartsData = this.$fundTool.managerSector2echartsData(response.data)
                drawSectorValues(echartsData['legendData'], echartsData['seriesData'], isFirstDraw)
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
