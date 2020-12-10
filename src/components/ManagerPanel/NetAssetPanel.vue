<template>
    <div>
        <h2>基金经理基金规模图</h2>
        <div>
            <label>基金经理编号<input id="managerId" type="text" defaultValue="101001596"></label>
            <label>开始时间<input type="startDate" value="20130101"></label>
            <button @click="draw" type="button">查询</button>
        </div>
        <div id="managerAsset" style="width: 50vm; height: 300px"></div>
    </div>
</template>

<script>
import $ from 'jquery'

let myChart
let fundTool
let managerFundNav
let isFirstDraw = true

function drawNetAsset (legendData, xData, series) {
    if (isFirstDraw) {
      myChart = myChart.init($('#managerAsset').get(0))
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
          name: '规模',
          splitLine: {show: false}
        },
        series: series
      }
      myChart.setOption(option)
      myChart.on('datazoom', function (e) {
        let stateDate = xData[parseInt(xData.length * e.start / 100)]
        let echartData = fundTool.nav(managerFundNav, stateDate)
        let _option = myChart.getOption()
        _option.series = echartData.series
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
            this.$http.post(this.$remoteIP + 'get_manager_asset_value', {
                'm_ids': [$('#managerId').val()]
            }).then(response => {
                // debugger
                managerFundNav = response.data
                let echartsData = this.$fundTool.nav(response.data, $('#startDate').val())
                drawNetAsset(echartsData['legendData'], echartsData['xData'], echartsData['series'], isFirstDraw)
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
