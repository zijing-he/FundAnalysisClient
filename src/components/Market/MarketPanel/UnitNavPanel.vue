<template>
    <div>
        <h4>市场基金净值分布图</h4>
        <div id='marketUnitNav' style='width: 50vm; height: 300px'></div>
    </div>
</template>

<script>
let myChart

function drawMarket (data, seriesData) {
    myChart = myChart.init(document.getElementById('marketUnitNav'))
    let option = {
        baseOption: {
            timeline: {
                axisType: 'category',
                autoPlay: true,
                playInterval: 1000,
                data: Object.keys(data),
                label: {
                    formatter: (s) => {
                        return (new Date(s)).getFullYear()
                    }
                }
            },
            tooltip: {},
            legend: {
                left: 'right',
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            },
            calculable: true,
            grid: {top: 80, bottom: 100},
            xAxis: [
                {
                    'type': 'category',
                    'axisLabel': {'interval': 0},
                    'data': Object.keys(data['2019']['201901']),
                    splitLine: {show: false}
                }
            ],
            yAxis: [{type: 'value', name: '基金个数',}
            ],
            color: ['#ffffcc', '#ffcc99', '#ffff99', '#ffff66', '#ffff33', '#ffff00', '#ffcc00', '#ff9933', '#ff9900', '#ff6600', '#A52A2A', '#8B0000'],
            series: [
                {name: '1月', type: 'line'}, {name: '2月', type: 'line'}, {name: '3月', type: 'line'},
                {name: '4月', type: 'line'}, {name: '5月', type: 'line'}, {name: '6月', type: 'line'},
                {name: '7月', type: 'line'}, {name: '8月', type: 'line'}, {name: '9月', type: 'line'},
                {name: '10月', type: 'line'}, {name: '11月', type: 'line'}, {name: '12月', type: 'line'}
            ]
        },
        options: seriesData
    }
    myChart.setOption(option)
}

export default {
    name: 'marketUnitNav',
    methods: {
        draw () {
            this.$http.post(this.$remoteIP + 'get_market_unit_nav'
            ).then(response => {
                let seriesData = this.$fundTool.nav2seriesData(response.data)
                drawMarket(response.data, seriesData)
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
