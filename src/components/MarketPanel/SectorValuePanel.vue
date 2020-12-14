<template>
    <div>
        <h2>市场基金行业规模图</h2>
        <div id="sectorValue" style="width: 50vm; height: 300px"></div>
    </div>
</template>

<script>
import $ from 'jquery'

let myChart
let fundTool
let sectorValues

function drawNavDistribution (timelineData, xData, seriesData) {
    myChart = myChart.init($('#sectorValue').get(0))

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
                    formatter: function(s) {
                        return (new Date(s)).getFullYear()
                    }
                }
            },
            tooltip: {},
            // legend: {
            //     left: 'right',
            //     data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            // },
            calculable : true,
            grid: {
                top: 80,
                bottom: 100
            },
            xAxis: [
                {
                    'type': 'category',
                    'axisLabel': {'interval':0},
                    'data': xData,
                    splitLine: {show: false}
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '规模（万元）',
                    // max: 53500
                }
            ],
            series: [
                {name: '规模', type: 'bar'}
            ]
        },
        options: seriesData
    }
    myChart.setOption(option)
}

export default {
    name: '',
    methods: {
        draw () {
            this.$http.post(this.$remoteIP + 'get_market_sector'
            ).then(response => {
                sectorValues = response.data
                let echartData = this.$fundTool.marketSector2echartsData(sectorValues)
                drawNavDistribution(echartData['timelineData'], echartData['xData'], echartData['seriesData'])
            })
        }
    },
    data () {
        return {}
    },
    mounted () {
        myChart = this.$chart
        fundTool = this.$fundTool
        this.draw()
    }
}
</script>

<style scoped>

</style>
