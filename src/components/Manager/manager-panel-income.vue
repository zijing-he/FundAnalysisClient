<template>
  <div>
    <h4>基金经理收益图</h4>
    <div id='managerIncome' style='width: 50vm; height: 300px'></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import FundTool from "@/utils/fund-tool";

let myChart

export default {
  name: 'ManagerIncomePanel',
  props: {
    managerIncomeData: Object,
    managerDate: Array,
  },
  emits: [
    'updateDate'
  ],
  data () {
    return {
      echartsData: null,
    }
  },
  watch: {
    managerIncomeData: function () {
      this.echartsData = FundTool.managerNav2income(this.managerIncomeData, 0)
      this.renderChart()
    },
    managerDate: function () {
      let _option = myChart.getOption()
      _option.series = FundTool.managerNav2income(this.managerIncomeData, this.managerDate[0])['series']
      _option.dataZoom[0].start = this.managerDate[0]
      _option.dataZoom[0].end = this.managerDate[1]
      myChart.setOption(_option, true)
    }
  },
  mounted () {
    this.initChart();
  },
  methods: {
    initChart () {
      myChart = echarts.init(document.getElementById('managerIncome'))
      myChart.setOption({
        toolbox: {
          orient: 'vertical',
          feature: {
            dataZoom: {yAxisIndex: false},
            magicType: {type: ['line', 'bar']},
            dataView: {readOnly: false},
            restore: {},
            saveAsImage: {}
          }
        },
        tooltip: {show: true, trigger: 'axis'},
      })
    },
    renderChart () {
      myChart.setOption({
        legend: {width: '50%', selector: true, data: this.echartsData['legendData']},
        xAxis: {data: this.echartsData['xData']},
        yAxis: {name: '单位净值', splitLine: {show: false}},
        series: this.echartsData['series'],
        dataZoom: [{start: 80}],
      })
      myChart.on('datazoom', (e) => this.$emit('updateDate', [e.start, e.end]))
    },
  },
}
</script>

<style scoped>
</style>
