
<template>
  <svg id="mainsvg" width="993" height="150"></svg>
  <!-- <a-row>
    <a-col :span="24">
      <temporalView :time-interval="timeInterval" @updateDate="debounceZoom" />
    </a-col>
  </a-row> -->
</template>

<script>
import _ from "lodash";
import * as d3 from "d3";
import dataJSON from "@/data/tsne_date_loc.json";
// import temporalView from "@/components/Overview/temporalView";
export default {
  name: "fundScatterDiagram",
  props: {
    loadData: Object,
    threshold: Number,
  },
  components: {
    // temporalView,
  },
  data() {
    return {
      svg: null,
      data: dataJSON["20190331"],
      timeInterval: [0, 50],
    };
  },
  watch: {
    threshold: function () {
      // When data is changed in parent, render this component
      this.renderUpdate();
    },
  },
  mounted: function () {
    this.renderInit();
    this.renderUpdate();
  },
  created() {
    this.debounceZoom = _.debounce(this.handleupdateDate, 33);
  },
  unmounted() {
    this.debounceZoom.cancel();
  },
  methods: {
    handleupdateDate(interval) {
      this.timeInterval = interval;
      // console.log(this.timeInterval);
      this.renderUpdate();
    },
    renderInit() {
      console.log(this.data);
      let width = d3.select("#mainsvg").attr("width");
      let height = d3.select("#mainsvg").attr("height");
      this.svg = d3.select("#mainsvg").attr("viewBox", [0, 0, width, height]);
    },
    renderUpdate() {
      // Remove all groups in svg
      this.svg.selectAll("g").remove();

      // Configuration
      let width = d3.select("#mainsvg").attr("width");
      let height = d3.select("#mainsvg").attr("height");
      let margin = { top: 20, right: 0, bottom: 30, left: 40 };
      let innerWidth = width - margin.left - margin.right;
      let innerHeight = height - margin.top - margin.bottom;
      // let xValue = date => d3.min(Object.values(this.data[date]),d => d.x);
      let xValue = (d) => this.data[d].x;
      let yValue = (d) => this.data[d].y;

      // let time = "2019/03/31";

      let colorScaleRed = d3
        .scaleOrdinal()
        .domain(d3.extent(Object.keys(this.data), (d) => this.data[d].nav))
        .range(d3.schemeReds[9]);
      let colorScaleGreen = d3
        .scaleOrdinal()
        .domain(d3.extent(Object.keys(this.data), (d) => this.data[d].nav))
        .range(d3.schemeGreens[9]);

      // console.log(d3.extent(Object.keys(this.data), (d) => this.data[d].nav));
      // console.log(Object.keys(this.data));
      // console.log(this.threshold);
      // console.log(
      //   Object.keys(this.data).filter((d) => this.data[d].nav >= this.threshold)
      // );

      let timeScale = d3.scaleLinear().domain([0, 100]).range([0, 28]);

      let timeStart = Math.round(timeScale(this.timeInterval[0]));
      let timeEnd = Math.round(timeScale(this.timeInterval[1]));
      // console.log(timeStart, timeEnd);

      let timeRange = Object.keys(this.data);

      // console.log(Object.values(this.data["20190110"]));

      //  console.log( d3.min(timeRange,xValue));

      let xScale = d3
        .scaleLinear()
        .domain(d3.extent(Object.keys(this.data), xValue))
        .range([margin.left, width - margin.right])
        .nice();

      let yScale = d3
        .scaleLinear()
        .domain(d3.extent(Object.keys(this.data), yValue))
        .range([margin.top, height - margin.bottom])
        .nice();

      // this.svg
      //   .append("g")
      //   .append("text")
      //   .attr("class", "date_text")
      //   .attr("x", innerWidth / 3 + 60)
      //   .attr("y", innerHeight / 10 - 10)
      //   .attr("dy", ".5em")
      //   .attr("font-size", "5em")
      //   .style("text-anchor", "end")
      //   .attr("fill", "#504f4f")
      //   .attr("font-weight", "bold")
      //   .text(time);

      this.svg
        .append("g")
        .selectAll("circle")
        .data(
          Object.keys(this.data).filter(
            (d) => this.data[d].nav >= this.threshold
          )
        ) //绑定基金id
        .join("circle")
        .attr("cx", (d) => xScale(xValue(d)))
        .attr("cy", (d) => yScale(yValue(d)))
        .attr("r", (d) => this.data[d].size + 1)
        .style("fill", (d) => colorScaleRed(this.data[d].nav));
    },
  },
};
</script>

<style scoped>
svg {
  background-color: #000;
}
</style>