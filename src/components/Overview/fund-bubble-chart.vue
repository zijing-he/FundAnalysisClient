
<template>
  <div
    id="fund_bubble_chart_inner_container"
    class="fund_bubble_chart_inner_container"
  >
    <div class="text">{{ date }}</div>
    <div id="fund_bubble_chart_item" class="fund_bubble_chart_item"></div>
  </div>
</template>

<script>
import * as d3 from "d3";
export default {
  name: "fundBubbleChart",
  props: {
    date: String,
    quarterFundData: Object,
    fundManagers: Object,
  },
  components: {},
  watch: {
    quarterFundData: function () {
      console.log("季度数据改变了");

      this.renderUpdate();
    },
  },
  data() {
    return {
      svg: null,
      width: 200,
      height: 200,
      margin: { top: 20, right: 20, bottom: 20, left: 20 },
      data: null,
      data_values: [],
      fund_id: [],
      managers: [],
    };
  },
  //v-if == true之后就到mounted，没有到watch
  mounted: function () {
    // console.log("这里是", this.date);
    // console.log(this.quarterFundData);
    // console.log(this.fundManagers);
    this.renderInit();
    this.renderUpdate();
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
      return d3
        .scaleOrdinal()
        .domain(this.managers)
        .range([
          ...d3.schemeCategory10,
          ...d3.schemePaired,
          ...d3.schemeSet1,
          ...d3.schemeTableau10,
        ]);
    },
  },
  methods: {
    renderInit() {
      this.svg = d3
        .select("#fund_bubble_chart_item")
        .attr("id", "fund_bubble_chart_item_" + this.date)
        .style("width", this.width + "px")
        .style("height", this.height + "px")
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("viewBox", [0, 0, this.width, this.height])
        .append("g")
        .attr("transform", `translate(${this.margin.left},${this.margin.top})`);
    },
    renderUpdate() {
      this.data = this.quarterFundData;
      this.data_values = Object.values(this.quarterFundData);
      this.fund_id = Object.keys(this.quarterFundData);
      // this.data_values.forEach((d) => {
      //   this.managers.push(d.manager_id[0]);
      // });
      this.managers = Object.keys(this.fundManagers);
      this.svg
        .append("g")
        .selectAll("circle")
        .data(this.data_values)
        .join("circle")
        .attr("cx", (d) => this.xScale(d.loc[0]))
        .attr("cy", (d) => this.yScale(d.loc[1]))
        .attr("r", 4)
        .style("fill", (d) => this.colorScale(d.manager_id[0]))
        .style("stroke", (d) =>
          d.new == true || d.delete == true ? "black" : "none"
        )
        // d.new == true : "特殊操作" ? "默认"
        .style("stroke-dasharray", (d) => (d.new == true ? "2" : "0"))
        .style("fill-opacity", (d) => (d.delete == true ? "0.5" : "1"));
    },
  },
};
</script>

<style scoped>
h5 {
  margin-bottom: 0;
}
.fund_bubble_chart_inner_container {
  position: relative;
  height: 220px;
  width: 200px;
  flex-shrink: 0;
  margin-right: 30px;
  margin-top: 5px;
  border: 1px solid black;
}
.text {
  width: 200px;
  height: 20px;
  text-align: center;
  font-size: 13px;
}
</style>