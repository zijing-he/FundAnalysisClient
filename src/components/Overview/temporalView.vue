<template>
  <div id="temporal_view" style="height: 200px"></div>
</template>

<script>
import * as echarts from "echarts";
import dataJSON from "@/data/tsne_date_loc.json";

export default {
  name: "temporalView",
  props: {
    timeInterval: Array,
  },
  emits: ["updateDate"],
  data() {
    return {
      data: Object.keys(dataJSON),
      timeSlider: null,
      // defaultStartDate: "20190110",
      // defaultEndDate: "20190331",
    };
  },
  watch: {
    timeInterval: function () {
      let _option = this.timeSlider.getOption();
      // console.log(_option);
      _option.dataZoom[0].start = this.timeInterval[0];
      _option.dataZoom[0].end = this.timeInterval[1];
      this.timeSlider.setOption(_option, false);
    },
  },
  mounted() {
    //  console.log(dataJSON);
    this.initTimeSlider();
    this.renderTimeSlider();
  },
  methods: {
    initTimeSlider() {
      this.timeSlider = echarts.init(document.getElementById("temporal_view"));
      this.timeSlider.setOption({
        xAxis: [
          {
            show: false,
            type: "category",
            boundaryGap: false,
            data: this.data,
          },
        ],
        yAxis: [{ show: false }],
        dataZoom: [
          {
            top:"10%",
            type: "slider",
            start: 0,
            end: 50,
            handleIcon:
              "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
            handleSize: "80%",
            handleStyle: {
              color: "#fff",
              shadowBlur: 3,
              shadowColor: "rgba(0, 0, 0, 0.6)",
              shadowOffsetX: 2,
              shadowOffsetY: 2,
            },
          },
        ],
        animation: false,
        series: [
          {
            type: "scatter",
            data: [],
          },
        ],
      });
    },
    renderTimeSlider() {
      this.timeSlider.on("datazoom", (e) =>
        this.$emit("updateDate", [e.start, e.end])
      );
    },
  },
};
</script>

<style scoped>
</style>
