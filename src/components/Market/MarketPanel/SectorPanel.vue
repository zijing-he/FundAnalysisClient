<template>
    <div>
        <h4>市场基金行业规模图</h4>
        <div id='marketSector' style='width: 50vm; height: 400px'></div>
    </div>
</template>

<script>
let myChart

function drawMarket (timelineData, xData, seriesData) {
    myChart = myChart.init(document.getElementById('marketSector'))

    let option = {
        baseOption: {
            timeline: {
                axisType: 'category',
                autoPlay: true,
                playInterval: 1000,
                data: timelineData,
                label: {
                    formatter: (s) => {
                        return (new Date(s)).getFullYear()
                    }
                }
            },
            tooltip: {},
            calculable: true,
            grid: {top: 80, bottom: 100},
            xAxis: [{'type': 'category', 'axisLabel': {'interval': 0}, 'data': xData, splitLine: {show: false}}],
            yAxis: [{type: 'value', name: '规模（万元）', max:22000000, min:0, splitNumber:10, boundaryGap: [0.2, 0.2]}],
            series: [{name: '规模', type: 'bar'}]
        },
        options: seriesData
    }
    myChart.setOption(option)
}

export default {
    name: 'marketSector',
    methods: {
        draw () {
            this.$http.post(this.$remoteIP + 'get_market_sector'
            ).then(response => {
                let echartData = this.$fundTool.marketSector2echartsData(response.data)
                drawMarket(echartData['timelineData'], echartData['xData'], echartData['seriesData'])
            })
        }
    },
    data () {
        return {}
    },
    mounted () {
        myChart = this.$chart
        this.draw()
    }
}
</script>

<style scoped>

</style>
