
<template>
  <h5>{{ date }}</h5>
  <div id="fund_bubble_chart"></div>
</template>

<script>
import * as d3 from "d3";
export default {
  name: "fundBubbleChart",

  props: {
    id: String,
    date: String,
    fundData: Object,
  },
  components: {},
  watch: {
    fundData: function () {
      // console.log("我已经到气泡图了！");
      // console.log(this.fundData);
      this.renderUpdate();
    },
  },
  data() {
    return {
      svg: null,
      width: 251.866,
      height: 134,
      margin: { top: 20, right: 20, bottom: 20, left: 20 },
      data:null,
      data_values: [],
      managers: [],
    };
  },

  mounted: function () {
    this.renderInit();
  },
  computed: {
    innerWidth() {
      return this.width - this.margin.left - this.margin.right;
    },
    innerHeight() {
      return this.height - this.margin.top - this.margin.bottom;
    },
    xScale() {
      return d3
        .scaleLinear()
        .domain(d3.extent(this.data_values, (d) => d.loc[0]))
        .range([0, this.innerWidth])
        .nice();
    },
    yScale() {
      return d3
        .scaleLinear()
        .domain(d3.extent(this.data_values, (d) => d.loc[1]))
        .range([this.innerHeight, 0])
        .nice();
    },
    colorScale() {
      return d3.scaleOrdinal().domain(this.managers).range(([...d3.schemeCategory10, ...d3.schemePaired, ...d3.schemeSet1, ...d3.schemeTableau10]));
    },
  },
  methods: {
    renderInit() {
      d3.select("#fund_bubble_chart").attr("id", this.id);
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
      this.data = this.fundData.funds[this.date];
      this.data_values = Object.values(this.data);
      // this.data_values.forEach((d) => {
      //   this.managers.push(d.manager_id[0]);
      // });
      this.managers = Object.keys(this.fundData.managers);
      
      this.svg
        .append("g")
        .selectAll("circle")
        .data(this.data_values)
        .join("circle")
        .attr("cx", (d) => this.xScale(d.loc[0]))
        .attr("cy", (d) => this.yScale(d.loc[1]))
        .attr("r", 4)
        .style("fill", (d) => this.colorScale(d.manager_id[0]));
    },
  },
};
</script>

<style scoped>
h5 {
  margin-bottom: 0;
}
</style>