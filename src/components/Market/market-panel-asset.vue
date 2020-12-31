<template>
  <div>
    <h4>市场基金资产配置分布图</h4>
    <div id='marketAsset' style='width: 50vm; height: 400px'></div>
  </div>
</template>

<script>
import DataService from "@/utils/data-service";
import FundTool from "@/utils/fund-tool";
import * as echarts from "echarts";

let myChart

export default {
  name: 'MarketAsset',
  data() {
    return {
      postData: null,
      seriesData: null,
    }
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart () {
      myChart = echarts.init(document.getElementById('marketAsset'));
      DataService.post('get_market_asset', {}, data => {
        this.postData = data
        this.seriesData = FundTool.asset2seriesData(data)
        this.renderChart()
      })
    },
    renderChart () {
      const labelOption = {show: true, position: 'insideRight'}
      const tooltipOption = {trigger: 'item', axisPointer: {type: 'shadow'},}

      let option = {
        baseOption: {
          timeline: {
            axisType: 'category',
            autoPlay: true,
            playInterval: 1000,
            data: Object.keys(this.postData),
            label: {
              formatter: (s) => {
                return (new Date(s)).getFullYear()
              }
            }
          },
          tooltip: {},
          legend: {
            left: 'right',
            data: ['0.0~0.2', '0.2~0.4', '0.4~0.6', '0.6~0.8', '0.8~1.0'],
          },
          calculable: true,
          grid: {top: 80, bottom: 100},
          xAxis: [
            {
              name: '时间',
              'type': 'category',
              'axisLabel': {'interval': 0},
              'data': ['第一季度', '第二季度', '第三季度', '第四季度'],
              splitLine: {show: false}, axisTick: {alignWithLabel: true}
            }
          ],
          yAxis: [{type: 'value', name: '基金个数', max: 2400, min: 0, splitNumber: 15, boundaryGap: [0.2, 0.2]}
          ],
          color: ['#FA8072', '#FFC0CB', '#EEEE00', '#43CD80', '#5CACEE'],
          series: [
            {
              name: '0.0~0.2', type: 'bar', stack: 'stock',
              label: labelOption, barWidth: '10%', tooltip: tooltipOption
            },
            {
              name: '0.2~0.4', type: 'bar', stack: 'stock',
              label: labelOption, barWidth: '10%', tooltip: tooltipOption
            },
            {
              name: '0.4~0.6', type: 'bar', stack: 'stock',
              label: labelOption, barWidth: '10%', tooltip: tooltipOption
            },
            {
              name: '0.6~0.8', type: 'bar', stack: 'stock',
              label: labelOption, barWidth: '10%', tooltip: tooltipOption
            },
            {
              name: '0.8~1.0', type: 'bar', stack: 'stock',
              label: labelOption, barWidth: '10%', tooltip: tooltipOption
            },
            {
              name: '0.0~0.2', type: 'bar', stack: 'bond',
              label: labelOption, barWidth: '10%', tooltip: tooltipOption
            },
            {
              name: '0.2~0.4', type: 'bar', stack: 'bond',
              label: labelOption, barWidth: '10%', tooltip: tooltipOption
            },
            {
              name: '0.4~0.6', type: 'bar', stack: 'bond',
              label: labelOption, barWidth: '10%', tooltip: tooltipOption
            },
            {
              name: '0.6~0.8', type: 'bar', stack: 'bond',
              label: labelOption, barWidth: '10%', tooltip: tooltipOption
            },
            {
              name: '0.8~1.0', type: 'bar', stack: 'bond',
              label: labelOption, barWidth: '10%', tooltip: tooltipOption
            },
            {
              name: '0.0~0.2', type: 'bar', stack: 'cash',
              label: labelOption, barWidth: '10%', tooltip: tooltipOption
            },
            {
              name: '0.2~0.4', type: 'bar', stack: 'cash',
              label: labelOption, barWidth: '10%', tooltip: tooltipOption
            },
            {
              name: '0.4~0.6', type: 'bar', stack: 'cash',
              label: labelOption, barWidth: '10%', tooltip: tooltipOption
            },
            {
              name: '0.6~0.8', type: 'bar', stack: 'cash',
              label: labelOption, barWidth: '10%', tooltip: tooltipOption
            },
            {
              name: '0.8~1.0', type: 'bar', stack: 'cash',
              label: labelOption, barWidth: '10%', tooltip: tooltipOption
            },
          ]
        },
        options: this.seriesData
      }
      myChart.setOption(option)
    }
  }
}
</script>

<style scoped>
</style>
