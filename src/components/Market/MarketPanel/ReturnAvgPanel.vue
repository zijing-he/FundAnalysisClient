<template>
	<div>
		<h4>市场基金月平均收益率分布图</h4>
		<div id="marketAvgReturn" style="width: 50vm; height: 300px"></div>
	</div>
</template>

<script>
let myChart

function drawMarket (seriesData, legendData, xAxisData) {
	myChart = myChart.init(document.getElementById('marketAvgReturn'))
	let option = {
		// title: {
		// 	text: '市场基金月平均收益率分布图'
		// },
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			data: legendData
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		toolbox: {
			feature: {
				saveAsImage: {}
			}
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: xAxisData
		},
		yAxis: {
			type: 'value'
		},
		series: seriesData

	}
	myChart.setOption(option)
}

export default {
	name: 'marketUnitNav',
	methods: {
		draw () {
			this.$http.post(this.$remoteIP + 'get_market_avg_return'
			).then((response) => {
				let echartsData = this.$fundTool.avgReturn2echartsData(response.data)
				drawMarket(echartsData['seriesData'], echartsData['legendData'], echartsData['xAxisData'])
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
