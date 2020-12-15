<template>
    <div>
        <h2>市场基金资产配置分布图</h2>
        <div id='assetDistribution' style='width: 50vm; height: 300px'></div>
    </div>
</template>

<script>
import $ from 'jquery'

let myChart
let fundTool
let assetDistributionValues

function drawAssetDistribution (data, seriesData) {
    myChart = myChart.init($('#assetDistribution').get(0))
    const labelOption = {show: true, position: 'insideRight'}
    const tooltipOption = {
        trigger: 'item',
        axisPointer: {
            type: 'shadow'
        },
    }

    let option = {
        baseOption: {
            timeline: {
                axisType: 'category',
                // realtime: false,
                // loop: false,
                autoPlay: true,
                playInterval: 1000,

                data: Object.keys(data),
                label: {
                    formatter: function (s) {
                        return (new Date(s)).getFullYear()
                    }
                }
            },
            // title: {
            //     subtext: '数据来自国家统计局'
            // },
            tooltip: {},
            legend: {
                left: 'right',
                data: ['0.0~0.2', '0.2~0.4', '0.4~0.6', '0.6~0.8', '0.8~1.0'],
            },
            calculable: true,
            grid: {
                top: 80,
                bottom: 100
            },
            xAxis: [
                {
                    name: '时间',
                    'type': 'category',
                    'axisLabel': {'interval': 0},
                    'data': ['第一季度', '第二季度', '第三季度', '第四季度'],
                    splitLine: {show: false},
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '基金个数',
                    // max: 53500
                }
            ],
            color: ['#FA8072', '#FFC0CB', '#EEEE00', '#43CD80', '#5CACEE'],
            series: [
                {
                    name: '0.0~0.2',
                    type: 'bar',
                    stack: 'stock',
                    label: labelOption,
                    barWidth: '10%',
                    tooltip: tooltipOption
                },
                {
                    name: '0.2~0.4',
                    type: 'bar',
                    stack: 'stock',
                    label: labelOption,
                    barWidth: '10%',
                    tooltip: tooltipOption
                },
                {
                    name: '0.4~0.6',
                    type: 'bar',
                    stack: 'stock',
                    label: labelOption,
                    barWidth: '10%',
                    tooltip: tooltipOption
                },
                {
                    name: '0.6~0.8',
                    type: 'bar',
                    stack: 'stock',
                    label: labelOption,
                    barWidth: '10%',
                    tooltip: tooltipOption
                },
                {
                    name: '0.8~1.0',
                    type: 'bar',
                    stack: 'stock',
                    label: labelOption,
                    barWidth: '10%',
                    tooltip: tooltipOption
                },
                {
                    name: '0.0~0.2',
                    type: 'bar',
                    stack: 'bond',
                    label: labelOption,
                    barWidth: '10%',
                    tooltip: tooltipOption
                },
                {
                    name: '0.2~0.4',
                    type: 'bar',
                    stack: 'bond',
                    label: labelOption,
                    barWidth: '10%',
                    tooltip: tooltipOption
                },
                {
                    name: '0.4~0.6',
                    type: 'bar',
                    stack: 'bond',
                    label: labelOption,
                    barWidth: '10%',
                    tooltip: tooltipOption
                },
                {
                    name: '0.6~0.8',
                    type: 'bar',
                    stack: 'bond',
                    label: labelOption,
                    barWidth: '10%',
                    tooltip: tooltipOption
                },
                {
                    name: '0.8~1.0',
                    type: 'bar',
                    stack: 'bond',
                    label: labelOption,
                    barWidth: '10%',
                    tooltip: tooltipOption
                },
                {
                    name: '0.0~0.2',
                    type: 'bar',
                    stack: 'cash',
                    label: labelOption,
                    barWidth: '10%',
                    tooltip: tooltipOption
                },
                {
                    name: '0.2~0.4',
                    type: 'bar',
                    stack: 'cash',
                    label: labelOption,
                    barWidth: '10%',
                    tooltip: tooltipOption
                },
                {
                    name: '0.4~0.6',
                    type: 'bar',
                    stack: 'cash',
                    label: labelOption,
                    barWidth: '10%',
                    tooltip: tooltipOption
                },
                {
                    name: '0.6~0.8',
                    type: 'bar',
                    stack: 'cash',
                    label: labelOption,
                    barWidth: '10%',
                    tooltip: tooltipOption
                },
                {
                    name: '0.8~1.0',
                    type: 'bar',
                    stack: 'cash',
                    label: labelOption,
                    barWidth: '10%',
                    tooltip: tooltipOption
                },
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
            this.$http.post(this.$remoteIP + 'get_market_asset_distribution'
            ).then(response => {
                assetDistributionValues = response.data
                let seriesData = this.$fundTool.asset2seriesData(assetDistributionValues)
                drawAssetDistribution(assetDistributionValues, seriesData)
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
