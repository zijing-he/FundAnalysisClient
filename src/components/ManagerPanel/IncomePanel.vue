<template>
    <div>
        <h2>基金经理收益图</h2>
        <div>
            <label>基金经理编号<input id="managerId" type="text" defaultValue="101001596"></label>
            <label>开始时间<input type="startDate" value="20130101"></label>
            <button @click="draw" type="button">查询</button>
        </div>
        <div id="managerIncome" style="width: 50vm; height: 300px"></div>
    </div>
</template>

<script>
import $ from 'jquery'

let myChart
let fundTool
let managerFundNav
let isFirstDraw = true

function drawIncome (legendData, xData, series, isFirstDraw) {
    if (isFirstDraw){
      myChart = myChart.init($('#managerIncome').get(0))
      let option = {
        toolbox: {
          orient: 'vertical',
          feature: {
            dataZoom: {yAxisIndex: false},
            magicType: {
              type: ['line', 'bar']
            },
            dataView: {
              readOnly: false
            },
            restore: {},
            saveAsImage: {}
          }
        },
        tooltip: {show: true, trigger: 'axis'},
        dataZoom: [{start: 80}, {type: 'inside'}],
        legend: {
          width: '50%',
          selector: true,
          data: legendData
        },
        xAxis: {data: xData},
        yAxis: {
          name: '收益',
          splitLine: {show: false}
        },
        series: series
      }
      myChart.setOption(option)
      myChart.on('datazoom', function (e) {
        let stateDate = xData[parseInt(xData.length * e.start / 100)]
        let echartsData = fundTool.nav2income(managerFundNav, stateDate)
        let _option = myChart.getOption()
        _option.series = echartsData.series
        myChart.setOption(_option, true)
      })
    }else {
      let option = myChart.getOption();
      option.legend[0].data = legendData;
      option.xAxis[0].data = xData;
      option.series = series;
      myChart.setOption(option);
    }
}

export default {
    name: '',
    methods: {
        draw () {
            this.$http.post(this.$remoteIP + 'get_manager_nav', {
                'm_ids': [$('#managerId').val()]
            }).then(response => {
                console.log([$('#managerId').val()])
                console.log(response)
                managerFundNav = response.data
                let echartsData = this.$fundTool.nav2income(response.data, $('#startDate').val())
                drawIncome(echartsData['legendData'], echartsData['xData'], echartsData['series'], isFirstDraw)
                if(isFirstDraw) isFirstDraw = false
            })
        }
    },
    data () {
        return {}
    },
    mounted () {
        myChart = this.$chart
        fundTool = this.$fundTool
    }
}
</script>

<style scoped>

</style>
