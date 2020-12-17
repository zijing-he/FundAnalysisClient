<template>
    <div>
        <h4>基金公司的基金产品数量</h4>
        <div id='companyFundSum' style='width: 50vm; height: 300px'></div>
    </div>
</template>

<script>
let myChart, fundTool, layout, isFirstDraw

function drawCompany (xData, seriesData, isFirstDraw) {
	if (isFirstDraw) {
		myChart = myChart.init(document.getElementById('companyFundSum'))
		let option = {
			tooltip: {
				trigger: 'axis'
			},
			xAxis: {
				type: 'category',
				data: xData
			},
			yAxis: {
				type: 'value'
			},
			series: [{
				data: seriesData,
				type: 'line'
			}]
		}
		myChart.setOption(option)
	}else {
        let option = myChart.getOption()
        option.xAxis[0].data = xData
        option.series = seriesData
        myChart.setOption(option)
	}

}

export default {
    name: 'companyFundSumPanel',
    methods: {
        draw (companyName) {
            this.$http.post(this.$remoteIP + 'get_company_fund_sum', {
                'c_names': [companyName]
            }).then(response => {
                let echartsData = this.$fundTool.fundSum2echartsData(response.data)
				drawCompany(echartsData['xData'], echartsData['seriesData'], isFirstDraw)
				isFirstDraw = false
            })
        },
        monitoring () { // 监听事件
            this.$on('drawCompany', (companyName) => {
                this.draw(companyName)
            })
        }
    },
    data () {
        return {}
    },
    mounted () {
        isFirstDraw = true
        myChart = this.$chart
        fundTool = this.$fundTool
        layout = this.$parent
        this.monitoring() // 注册监听事件
    }
}
</script>

<style scoped>
</style>
