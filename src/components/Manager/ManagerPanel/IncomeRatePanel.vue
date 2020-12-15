<template>
    <div>
        <h2>基金经理收益图</h2>
<!--        <div>-->
<!--            <label>基金经理编号<input id="managerId-incomeRate" type="text" defaultValue="101001715" ref="managerIdIncomeRate"></label>-->
<!--&lt;!&ndash;            <label>开始时间<input id="startDate-incomeRate" defaultValue="20130101" ref="startDateIncomeRate"></label>&ndash;&gt;-->
<!--            <button @click="()=>draw(this.$refs.managerIdIncomeRate.value)" type="button">查询</button>-->
<!--        </div>-->
        <div id="managerIncomeRate" style="width: 50vm; height: 300px"></div>
    </div>
</template>

<script>
import $ from 'jquery'

let myChart
let fundTool
let managerFundNav
let isFirstDraw = true

function drawIncome(legendData, xData, series, isFirstDraw) {
    if (isFirstDraw){
      myChart = myChart.init($('#managerIncomeRate').get(0))
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
          name: '收益率',
          splitLine: {show: false}
        },
        series: series
      }
      myChart.setOption(option)
      myChart.on('datazoom', function (e) {
        console.log(e.start)
        console.log(parseInt(xData.length * e.start / 100))
        let stateDate = xData[parseInt(xData.length * e.start / 100)]
        let echartsData = fundTool.managerNav2income(managerFundNav, stateDate)
        let _option = myChart.getOption()
        _option.series = echartsData.series
        myChart.setOption(_option, true)
        console.log(stateDate)
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
        draw (managerID) {
            this.$http.post(this.$remoteIP + 'get_manager_nav', {
                'm_ids': [managerID]
            }).then(response => {
                managerFundNav = response.data
                let echartsData = this.$fundTool.managerNav2income(managerFundNav, '19980101')
                drawIncome(echartsData['legendData'], echartsData['xData'], echartsData['series'], isFirstDraw)
                if(isFirstDraw) isFirstDraw = false
            })
        },
        monitoring () { // 监听事件
          this.$on('childMethod', (managerID) => {
            this.draw(managerID)
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
