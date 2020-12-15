<template>
    <div>
        <h2>基金经理行业市值分布图</h2>
<!--        <div>-->
<!--            <label>基金经理编号<input id="managerId-sectorValue" type="text" defaultValue="101001715" ref="managerIdSectorValue"></label>-->
<!--            <button @click="()=>draw(this.$refs.managerIdSectorValue.value)" type="button">查询</button>-->
<!--        </div>-->
        <div id="managerSectorValue" style="width: 50vm; height: 300px"></div>
    </div>
</template>

<script>
import $ from 'jquery'

let myChart
let fundTool
let managerSectorValues
let isFirstDraw = true

function drawSectorValues (legendData, timelineData, xData, seriesData, optionsData, isFirstDraw) {
    if (isFirstDraw) {
      myChart = myChart.init($('#managerSectorValue').get(0))
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
          legend: {
            left: 'right',
            data: legendData
          },
          calculable: true,
          grid: {
            top: 80,
            bottom: 100
          },
          xAxis: [
            {
              'type': 'category',
              'axisLabel': {'interval': 0},
              data: xData,
              splitLine: {show: false}
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '规模（元）',
            }
          ],
          series: seriesData
        },
        options: optionsData
      }
      myChart.setOption(option)
    }else {
      let option = myChart.getOption();
      option.legend[0].data = legendData;
      option.timeline[0].data = timelineData;
      option.xAxis[0].data = xData;
      option.series[0].data = seriesData;
      option.options = optionsData;
      myChart.setOption(option);
    }

}

export default {
    name: '',
    methods: {
        draw (managerID) {
            this.$http.post(this.$remoteIP + 'get_manager_sector', {
                'm_ids': [managerID]
            }).then(response => {
                managerSectorValues = response.data
                let echartsData = this.$fundTool.managerSector2echartsData(managerSectorValues)
                drawSectorValues(echartsData['legendData'], echartsData['timelineData'], echartsData['xData'], echartsData['seriesData'], echartsData['optionsData'], isFirstDraw)
                if(isFirstDraw) isFirstDraw = false
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
