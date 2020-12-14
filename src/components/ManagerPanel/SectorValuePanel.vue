<template>
    <div>
        <h2>基金经理基金的行业市值分布图</h2>
        <div>
            <label>基金经理编号<input id="managerId-sectorValue" type="text" defaultValue="101001596"></label>
            <button @click="draw" type="button">查询</button>
        </div>
        <div id="managerSectorValue" style="width: 50vm; height: 300px"></div>
    </div>
</template>

<script>
import $ from 'jquery'

let myChart
let fundTool
let managerSectorValues
let isFirstDraw = true

function drawSectorValues (legendData, seriesData) {
    if (isFirstDraw) {
      myChart = myChart.init($('#managerSectorValue').get(0))
      let option = {
        title: {
          text: '',
          subtext: ''
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          data: legendData
        },
        toolbox: {
          show: true,
          feature: {
            mark: {show: true},
            dataView: {show: true, readOnly: false},
            magicType: {
              show: true,
              type: ['pie', 'funnel']
            },
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: [30, 110],
            center: ['50%', '50%'],
            top: '20%',
            roseType: 'area',
            data: seriesData
          }
        ]
      }
      myChart.setOption(option)
    }else {
      let option = myChart.getOption();
      option.legend[0].data = legendData;
      option.series[0].data = seriesData;
      myChart.setOption(option);
    }

}

export default {
    name: '',
    methods: {
        draw () {
            this.$http.post(this.$remoteIP + 'get_manager_sector', {
                'm_ids': [$('#managerId-sectorValue').val()]
            }).then(response => {
                managerSectorValues = response.data
                console.log(managerSectorValues)
                let echartsData = this.$fundTool.managerSector2echartsData(managerSectorValues)
                drawSectorValues(echartsData['legendData'], echartsData['seriesData'], isFirstDraw)
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
