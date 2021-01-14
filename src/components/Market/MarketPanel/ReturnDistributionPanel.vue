<template>
    <div>
        <h4>市场基金收益率分布图</h4>
        <div id='marketReturnDistribution' style='width: 50vm; height: 300px'></div>
    </div>
</template>

<script>
let myChart;
import return_distribution_value from '@/tools/return_distribution_value.json'

function drawMarket (data, seriesData) {
    myChart = myChart.init(document.getElementById('marketReturnDistribution'))
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
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', '13月'],
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
            yAxis: [
				{
					type: 'value', 
					name: '基金个数', 
					// max:800,
					// min:0,
					// splitNumber:10,
					// boundaryGap: [0.2, 0.2],
				},
            {
                type: 'value',
                scale: true,
                splitLine:{
                    show:true,
                    lineStyle:{
                        type:'dashed',
                        color: '#0786b3'
                    }
                },
                max: 100,
                min: 0,
                axisLine: {
                    lineStyle: {
                        color: '#1d5fcb'
                    }
                },
                axisLabel : {
                    formatter: '{value}%',  //右侧以百分比进行展示
                    show: true,
                    textStyle: {
                        color: '#00c3f4',
                        fontSize:'16'
                    }
                },
                textStyle: {
                    color: '#00c3f4',
                    fontSize:'16'
                }
            }
            ],
            dataZoom: [
              { //Y轴固定,让内容滚动
                type: 'slider',
                show: false,
                xAxisIndex: [0],
                start: 1,
                end: 80,//设置X轴刻度之间的间隔(根据数据量来调整)
                zoomLock: false, //锁定区域禁止缩放(鼠标滚动会缩放,所以禁止)
              },
              {
                type: 'inside',
                xAxisIndex: [0],
                start: 1,
                end: 80,
                zoomLock: false, //锁定区域禁止缩放
              }],
            color: ['#9999ff', '#9900ff', '#0000ff', '#ffff66', '#3300ff', '#003366', '#ffcc00', '#0000ffs', '#ff9900', '#ff6600', '#ffcccc', '#8B0000', '#339999'],
            series: [
                {name: '1月', type: 'line'}, {name: '2月', type: 'line'}, {name: '3月', type: 'line'},
                {name: '4月', type: 'line'}, {name: '5月', type: 'line'}, {name: '6月', type: 'line'},
                {name: '7月', type: 'line'}, {name: '8月', type: 'line'}, {name: '9月', type: 'line'},
                {name: '10月', type: 'line'}, {name: '11月', type: 'line'}, {name: '12月', type: 'line'},{name: '13月', type: 'line'}
            ]
        },
        options: seriesData
    }
    myChart.setOption(option)
}

export default {
    name: 'marketReturnDistribution',
    methods: {
		draw () {
			let seriesData = this.$fundTool.return2seriesData(return_distribution_value)
			drawMarket(return_distribution_value, seriesData)
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
