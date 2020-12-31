<template>
  <div>
    <h4>基金经理单位净值图</h4>
    <div id='managerUnitNav' style='width: 50vm; height: 300px'></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import FundTool from "@/utils/fund-tool";

let myChart

export default {
  name: 'ManagerUnitNavPanel',
  props: {
    managerUnitNavData: Object,
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
    managerUnitNavData: function () {
      this.echartsData = FundTool.json2echartData(this.managerUnitNavData)
      this.renderChart()
    },
    managerDate: function () {
      let _option = myChart.getOption()
      _option.dataZoom[0].start = this.managerDate[0]
      _option.dataZoom[0].end = this.managerDate[1]
      myChart.setOption(_option, true)
    }
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart () {
      myChart = echarts.init(document.getElementById('managerUnitNav'))
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
