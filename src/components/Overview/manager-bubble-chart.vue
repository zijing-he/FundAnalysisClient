
<template>
  <!-- <h5>基金经理气泡图</h5> -->
  <div id="manager_bubble_chart"></div>
</template>

<script>
import * as d3 from "d3";
export default {
  name: "managerBubbleChart",
  props: {
    fundManagers: Object,
  },
  components: {},
  data() {
    return {
      svg: null,
      width: 390,
      height: 200,
      margin: { top: 20, right: 20, bottom: 20, left: 20 },
      data: this.fundManagers,
      name: [],
      managerId:[],
    };
  },
  mounted: function () {
    // console.log("我康康基金经理：",this.fundManagers);
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
        .domain(d3.extent(this.managerId, (d) => this.data[d].loc[0]))
        .range([0, this.innerWidth])
        .nice();
    },
    yScale() {
      return d3
        .scaleLinear()
        .domain(d3.extent(this.managerId, (d) => this.data[d].loc[1]))
        .range([this.innerHeight, 0])
        .nice();
    },
    sizeScale() {
      return d3
        .scaleLinear()
        .domain(d3.extent(this.managerId, (d) => this.data[d].size))
        .range([3, 13]);
    },
  },
  methods: {
    renderInit() {
      this.managerId = Object.keys(this.data);
      this.svg = d3
        .select("#manager_bubble_chart")
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("viewBox", [0, 0, this.width, this.height])
        .append("g")
        .attr("transform", `translate(${this.margin.left},${this.margin.top})`);
    },
    renderUpdate() {
      // let tooltip = d3
      //   .select("#manager_bubble_chart")
      //   .append("div")
      //   .style("position", "absolute")
      //   .style("opacity", 0)
      //   .attr("class", "tooltip")
      //   .style("width","140px")
      //   .style("height","55px")
      //   .style("background-color", "black")
      //   .style("border-radius", "5px")
      //   .style("padding", "7px")
      //   .style("color", "white");

      // let showTooltip = (event, d) => {
      //   tooltip.transition().duration(200);
      //   tooltip
      //     .style("opacity", 1)
      //     .html("基金经理：" + d + "<br /> 掌管基金：" + this.data[d].number)
      //     .style("left", (event.pageX-1300)  + "px")
      //     .style("top", (event.pageY - 190) + "px");
      // };

      // let moveTooltip = (event) => {
      //   tooltip
      //     .style("left", (event.pageX-1300) + "px")
      //     .style("top", (event.pageY - 190) + "px");
      // };

      // let hideTooltip = (event) => {
      //   tooltip.transition().duration(200).style("opacity", 0);
      // };

      this.svg
        .append("g")
        .selectAll("dot")
        .data(this.managerId)
        .enter()
        .append("circle")
        .attr("class", "manager_bubbles")
        .attr("cx", (d) => this.xScale(this.data[d].loc[0]))
        .attr("cy", (d) => this.yScale(this.data[d].loc[1]))
        .attr("r", (d) => this.sizeScale(this.data[d].size))
        .style("fill", (d) => this.data[d].color)
        // .style("stroke","white")
        // .style("stroke-width","0.5px")
        // .style(":hover","stroke: black")
        // .on("mouseover", showTooltip)
        // .on("mousemove", moveTooltip)
        // .on("mouseleave", hideTooltip);
    },
  },
};
</script>

<style scoped>
/* #manager_bubble_chart{
  height:200px;
  width:200px;
  border:1px solid red;
} */
/* h5 {
  margin-bottom: 0;
} */
</style>