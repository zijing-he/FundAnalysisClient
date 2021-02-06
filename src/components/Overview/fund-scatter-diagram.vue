
<template>
  <h5>{{date}}</h5>
  <div id="fund_scatter_diagram"></div>
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
    id: String,
    date: String,
    threshold: Number,
  },
  components: {
    // temporalView,
  },
  data() {
    return {
      svg: null,
      width: 198.6,
      height: 134,
      margin: { top: 20, right: 20, bottom: 20, left: 20 },
      data: dataJSON[this.date],
      // timeInterval: [0, 50],
    };
  },
  watch: {
    threshold: function () {
      // When data is changed in parent, render this component
      this.renderUpdate();
    },
  },
  mounted: function () {
    console.log(this.date);
    this.renderInit();
    this.renderUpdate();
  },
  // created() {
  //   this.debounceZoom = _.debounce(this.handleupdateDate, 33);
  // },
  // unmounted() {
  //   this.debounceZoom.cancel();
  // },
  computed: {
    innerWidth() {
      return this.width - this.margin.left - this.margin.right;
    },
    innerHeight() {
      return this.height - this.margin.top - this.margin.bottom;
    },
    xScale(){
      return d3
        .scaleLinear()
        .domain(d3.extent(Object.keys(this.data), (d) => this.data[d].x))
        .range([0, this.innerWidth])
        .nice();
    },
    yScale(){
      return d3
        .scaleLinear()
        .domain(d3.extent(Object.keys(this.data), (d) => this.data[d].y))
        .range([this.innerHeight, 0])
        .nice();
    },
    colorScaleRed(){
      return d3
        .scaleOrdinal()
        .domain(d3.extent(Object.keys(this.data), (d) => this.data[d].nav))
        .range(d3.schemeReds[9]);
    },
    colorScaleGreen(){
      return d3
        .scaleOrdinal()
        .domain(d3.extent(Object.keys(this.data), (d) => this.data[d].nav))
        .range(d3.schemeGreens[9]);
    }

  },
  methods: {
    // handleupdateDate(interval) {
    //   this.timeInterval = interval;
    //   // console.log(this.timeInterval);
    //   this.renderUpdate();
    // },
    renderInit() {
      d3.select("#fund_scatter_diagram").attr("id", this.id);
      this.svg = d3
        .select(`#${this.id}`)
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("viewBox", [0, 0, this.width, this.height])
        .append("g")
        .attr("transform", `translate(${this.margin.left},${this.margin.top})`);
    },
    renderUpdate() {
      this.svg.selectAll("g").remove();

      // let timeScale = d3.scaleLinear().domain([0, 100]).range([0, 28]);

      // let timeStart = Math.round(timeScale(this.timeInterval[0]));
      // let timeEnd = Math.round(timeScale(this.timeInterval[1]));

      // let timeRange = Object.keys(this.data);

      this.svg
        .append("g")
        .selectAll("circle")
        .data(
          Object.keys(this.data).filter(
            (d) => this.data[d].nav >= this.threshold
          )
        )
        .join("circle")
        .attr("cx", (d) => this.xScale(this.data[d].x))
        .attr("cy", (d) => this.yScale(this.data[d].y))
        .attr("r", (d) => this.data[d].size + 1)
        .style("fill", (d) => this.colorScaleRed(this.data[d].nav));
    },
  },
};
</script>

<style scoped>
h5{
   margin-bottom: 0;
}
</style>