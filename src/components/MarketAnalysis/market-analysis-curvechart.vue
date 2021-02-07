<template>
  <div id="market_curvechart"></div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "MarketAnalysisCurveChart",
  props: {},
  components: {},
  data() {
    return {
      svg: null,
      margin: { top: 10, right: 20, bottom: 20, left: 20 },
      width: 993,
      height: 75.2,
      data: [
        ["20190110", 224, 100, 0.1],
        ["20190111", 528, 150, 0.12],
        ["20190114", 756, 200, 0.14],
        ["20190322", 632, 250, 0.15],
        ["20190331", 582, 180, 0.13],
        ["20190423", 704, 190, 0.138],
        ["20190509", 766, 250, 0.16],
        ["20190515", 804, 300, 0.165],
        ["20190604", 960, 350, 0.168],
        ["20190610", 1095, 380, 0.174],
        ["20191230", 1250, 450, 0.18],
      ],
    };
  },

  mounted: function () {
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
        .scaleBand()
        .domain(this.data.map((d) => d[0]))
        .range([0, this.innerWidth]);
    },
    yScale() {
      return d3
        .scaleLinear()
        .domain(d3.extent(this.data, (d) => d[1]))
        .range([this.innerHeight, 0])
        .nice();
    },
    linePath() {
      return d3
        .line()
        .curve(d3.curveCatmullRom)
        .x((d) => this.xScale(d[0]) + 51.8513513514)
        .y((d) => this.yScale(d[1]));
    },
  },

  methods: {
    renderInit() {
      this.svg = d3
        .select("#market_curvechart")
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("viewBox", [0, 0, this.width, this.height])
        .append("g")
        .attr("transform", `translate(${this.margin.left},${this.margin.top})`);
    },
    renderUpdate() {
      // Remove all groups in svg
      this.svg.selectAll("g").remove();

      // Add X axis
      this.svg
        .append("g")
        .call(d3.axisBottom(this.xScale))
        .attr("transform", `translate(0,${this.innerHeight})`);

      let brush = d3
        .brushX()
        .extent([
          [0, -this.margin.top],
          [this.innerWidth, this.innerHeight],
        ])
        .on("end", updateChart);

      //曲线绘制
      let curveChart = this.svg.append("g");

      //fund_size
      curveChart
        .append("g")
        .append("path")
        .attr("class", "line-path-size")
        .attr("d", this.linePath(this.data))
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .attr("stroke", "#BBE6E9");

      // fund_number
      curveChart
        .append("g")
        .append("path")
        .attr("class", "line-path-number")
        .attr(
          "d",
          this.linePath.y((d) =>
            this.yScale.domain(d3.extent(this.data, (d) => d[2]))(d[2])
          )(this.data)
        )
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .attr("stroke", "#FFD9DF");

      // fund_return
      curveChart
        .append("g")
        .append("path")
        .attr("class", "line-path-return")
        .attr(
          "d",
          this.linePath.y((d) =>
            this.yScale.domain(d3.extent(this.data, (d) => d[3]))(d[3])
          )(this.data)
        )
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .attr("stroke", "#CEBDED");

      curveChart.append("g").attr("class", "brush").call(brush);

      d3.selectAll(".tick text").attr("font-size", "1em");

      function updateChart({ selection }) {
        console.log(selection); //打印选中的像素点
      }

      // this.svg.append("g")
      //   .selectAll("circle")
      //   .data(this.data) //绑定基金id
      //   .join("circle")
      //   .attr("cx", d => this.xScale(d[0]) + 51.8513513514)
      //   .attr("cy", d => this.yScale(d[1]))
      //   .attr("r", 2)
      //   .style("fill", "green");
    },
  },
};
</script>

<style scoped>
#market_curvechart {
  height: 75.2px;
  width: 100%;
}
</style>