<template>
    <div>
        <h2>基金持仓的行业规模图</h2>
        <div>
          <label>基金编号<input id="fundId" type="text" defaultValue="510310"></label>
          <button @click="draw" type="button">查询</button>
        </div>
        <div id="fundSectorValue" style="width: 50vm; height: 300px"></div>
    </div>
</template>

<script>
import $ from 'jquery'

let myChart
let fundTool
let sectorValues
let isFirstDraw = true

function drawSectorValues (timelineData, xData, seriesData, isFirstDraw) {
    if (isFirstDraw) {
      myChart = myChart.init($('#fundSectorValue').get(0))
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
          series: [
            {name: '规模', type: 'bar'}
          ]
        },
        options: seriesData
      }
      myChart.setOption(option)
    }else {
      let option = myChart.getOption();
      console.log("option.baseOption",option.baseOption.timeline.data)
      option.xAxis[0].data = xData;
      option.options = seriesData;
      myChart.setOption(option);
    }

}

export default {
    name: '',
    methods: {
        draw () {
            this.$http.post(this.$remoteIP + 'get_fund_sector', {
                'f_ids': [$('#fundId').val()]
            }).then(response => {
                sectorValues = response.data
                            console.log("fund",Object.values(sectorValues)[0])
                let echartsData = this.$fundTool.marketSector2echartsData(Object.values(sectorValues)[0])
                drawSectorValues(echartsData['xData'], echartsData['timelineData'], echartsData['seriesData'], isFirstDraw)
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
