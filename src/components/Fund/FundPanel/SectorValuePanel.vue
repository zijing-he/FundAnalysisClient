<template>
    <div>
        <h2>基金持仓的行业规模图</h2>
        <!--        <div>-->
        <!--          <label>基金编号<input id="fundId-sectorValue" type="text" defaultValue="510310" ref="fundIdSectorValue"></label>-->
        <!--          <button @click="()=>draw(this.$refs.fundIdSectorValue.value)" type="button">查询</button>-->
        <!--        </div>-->
        <div id='fundSectorValue' style='width: 50vm; height: 300px'></div>
    </div>
</template>

<script>
import $ from 'jquery'

let myChart
let fundTool
let sectorValues
let isFirstDraw = true

function drawSectorValues (timelineData, xData, seriesData, isFirstDraw) {
    if (isFirstDraw) {
        myChart = myChart.init($('#fundSectorValue').get(0))
        let option = {
            baseOption: {
                timeline: {
                    axisType: 'category',
                    // realtime: false,
                    // loop: false,
                    autoPlay: true,
                    playInterval: 1000,

                    data: timelineData,
                    label: {
                        // formatter: function (s) {
                        //   return (new Date(s)).getFullYear()
                        // }
                    }
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

export default {
    name: 'sectorValuePanel',
    methods: {
        draw (fundId) {
            this.$http.post(this.$remoteIP + 'get_fund_sector', {
                'f_ids': [fundId]
            }).then(response => {
                sectorValues = response.data
                console.log('Fund sectorValues:', sectorValues)
                let echartsData = this.$fundTool.fundSector2echartsData(Object.values(sectorValues)[0])
                drawSectorValues(echartsData['timelineData'], echartsData['xData'], echartsData['seriesData'], isFirstDraw)
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
