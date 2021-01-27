<template>
    <div id="temporal_view"></div>
</template>

<script>
  /*
  Original source: https://www.echartsjs.com/examples/en/editor.html?c=area-simple
  Documentation for option: https://www.echartsjs.com/en/option.html#title
   */
  import * as echarts from "echarts";
  import DateService from "../../utils/data-service";

  export default {
    name: "TemporalView",
    props:{
      temporalOverview: Object,
      loadingTimeSlider: Boolean
    },
    data() {
      return {
        // the DOM element
        timeSlider: null,

        defaultStartDate: '2014-01-01',
        defaultEndDate: ' 2014-12-31',
      }
    },
    watch:{
      temporalOverview: function() {
        this.renderTimeSlider();
      },
    },
    mounted:function(){
      this.initTimeSlider();
      this.renderTimeSlider();
    },
    methods: {
      setPeriod(params) {
        let data = this.temporalOverview.date;
        let n = data.length;

        // dataZoom can be triggered by the slider or the above click listener
        let periodStart = params.start? data[Math.floor(n * params.start / 100)]: params.startValue? params.startValue: '2014-01-01';
        let periodEnd = params.end? data[Math.min(Math.floor(n * params.end / 100), n-1)]: params.endValue? params.endValue: '2015-12-31';

        this.$emit('setPeriod', {periodStart: periodStart, periodEnd: periodEnd});
      },
      initTimeSlider() {
        this.timeSlider = echarts.init(document.getElementById('temporal_view'));
        this.timeSlider.setOption({
          // size of the chart, value is the padding to the direction
          grid: {
            left: '35',
            right: '35',
            top: '30',
            bottom: '25',
          },
          xAxis: {
            type: 'category',
            // boundaryGap: false,
            axisLabel: {
              // shows only the first of month
              interval: function (index, value) {
                return value.slice(-2) === '01';
              },
              // shows the name of month
              formatter: function (value) {
                const MONTH = [
                  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                ];
                return MONTH[parseInt(value.slice(5,7))-1] + value.slice(2,4);
              },
              showMinLabel: true,
              showMaxLabel: true,
            },
            axisTick: {
              alignWithLabel: true,
              // shows only the first of month
              interval: function (index, value) {
                return value.slice(-2) === '01';
              },
            },
            data: null,
          },
          yAxis: {
            type: 'value',
            boundaryGap: false,
            min: 0
          },
          dataZoom: [
            {
              type: 'slider',
              show: true,
              xAxisIndex: 0,
              filterMode: 'filter',
              start: 0,
              end: 49.9,
              top: 'top',
              minValueSpan: 27  // at least one month
            },
            {
              type: 'slider',
              show: true,
              yAxisIndex: 0,
              filterMode: 'empty',
              left: 'right',
              start: 0,
              end: 100
            }
          ],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
            },
            formatter: function (params) {
              return params[0].value.toFixed(2) + ' million';
            },
          },
          toolbox: {
            top: 'top',
            right: 'right',
            feature: {
              restore: {
                title: ' ',
              }
            }
          }
        });
        this.timeSlider.showLoading();

        // click for quarter context
        this.timeSlider.on('click', function (params) {
          let date = this.temporalOverview.date[params.dataIndex];
          let quarterRange = DateService.parseDateToRange(date);

          this.timeSlider.dispatchAction({
            type: 'dataZoom',
            dataZoomIndex: 0,
            startValue: quarterRange[0],
            endValue: quarterRange[1]
          });
        }, this);

        // obtain the time interval in the slider
        this.timeSlider.on('dataZoom', (params) => {
          // arbitrary echarts id to check if the dataZoom is on x-axis
          if (!params.dataZoomId || params.dataZoomId.replace(/\0/g, '') === 'series00') {
            this.setPeriod(params);
          }
        }, this);
        this.timeSlider.on('restore', () => {
          this.setPeriod({startValue: this.defaultStartDate, endValue: this.defaultEndDate})
        }, this);
      },
      renderTimeSlider() {
        // set the data
        this.timeSlider.setOption({
          xAxis: {
            data: this.temporalOverview.date
          },
          series: {
            type: 'bar',
            animation: false,  // setting to false for better performance
            data: this.temporalOverview['ap_txn_amount'], color: ['#80b1d3'],
          }
        });
        this.timeSlider.hideLoading();
      }
    }
  }
</script>

<style scoped>

</style>