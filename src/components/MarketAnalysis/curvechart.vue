<template>
  <div id="market_curvechart"></div>
</template>

<script>
import * as d3 from "d3";
import market_income from "@/data/CurveChart/market_fund_income.json";
import market_number from "@/data/CurveChart/market_fund_number.json";
import market_size from "@/data/CurveChart/market_fund_size.json";
import market_hs300 from "@/data/CurveChart/market_hs300.json";

export default {
  name: "MarketAnalysisCurveChart",
  props: {},
  components: {},
  data() {
    return {
      svg: null,
      margin: { top: 15, right: 20, bottom: 20, left: 15 },
      width: 515,
      height: 200,
      date: Object.keys(market_income),
      fund_size: Object.values(market_size),
      fund_number: Object.values(market_number),
      fund_income: Object.values(market_income),
      fund_hs300: Object.values(market_hs300),
      keys: ["基金规模", "沪深300","基金平均收益",],
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
        .scaleTime()
        .domain([this.date[0], this.date[this.date.length - 1]])
        .range([0, this.innerWidth])
        .nice();
    },
    yScale() {
      return d3.scaleLinear().range([this.innerHeight, 0]);
    },
    linePath() {
      return d3
        .line()
        .curve(d3.curveCatmullRom)
        .x((d, i) => this.xScale(this.date[i]))
        .y((d) => this.yScale(d));
    },
    colorScale() {
      return d3
        .scaleOrdinal()
        .domain(this.keys) //["基金规模", "基金数量", "基金平均收益","沪深三百"]
        .range(["#928a97", "#283c63", "#f85f73"]);
    },
  },

  methods: {
    updateDate({ selection }) {
      let start = this.xScale
        .invert(selection[0])
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "");
      let end = this.xScale
        .invert(selection[1])
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "");

      // console.log(start, end);
      this.$emit("updateBrush", start, end);
      // this.svg.select(".brush").call(this.brush.move, null);  //情况brush后会报错，但是不影响
    },
    renderInit() {
      this.date = this.date.map(
        (d) =>
          new Date(
            d.substring(0, 4) + "-" + d.substring(4, 6) + "-" + d.substring(6)
          )
      );
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
      // Add X axis
      this.svg
        .append("g")
        .call(d3.axisBottom(this.xScale).ticks(d3.timeYear.every(1), "%Y"))
        .attr("transform", `translate(0,${this.innerHeight})`);

      let brush = d3
        .brushX()
        .extent([
          [0, -this.margin.top],
          [this.innerWidth, this.innerHeight],
        ])
        .on("end", this.updateDate);

      let curveChart = this.svg.append("g");

      //fund_size
      this.yScale.domain(d3.extent(this.fund_size));
      // console.log(this.yScale(0),this.yScale(100000));
      curveChart
        .append("g")
        .append("path")
        .attr("class", "line-path-size")
        .attr("d", this.linePath(this.fund_size))
        .attr("fill", "none")
        .attr("stroke-width", 1.5)
        .attr("stroke", "#928a97");

      // curveChart
      //   .selectAll(".points")
      //   .data(this.fund_size)
      //   .enter()
      //   .append("circle")
      //   .attr("cx", (d, i) => this.xScale(this.date[i]))
      //   .attr("cy", (d) => this.yScale(d))
      //   .attr("r", 1)
      //   .attr("fill", "red");

      // fund_number
      // this.yScale.domain(d3.extent(this.fund_number));
      // curveChart
      //   .append("g")
      //   .append("path")
      //   .attr("class", "line-path-number")
      //   .attr("d", this.linePath(this.fund_number))
      //   .attr("fill", "none")
      //   .attr("stroke-width", 2)
      //   .attr("stroke", "#fbe8d3");

      //fund_income
      this.yScale.domain(d3.extent(this.fund_income));
      curveChart
        .append("g")
        .append("path")
        .attr("class", "line-path-income")
        .attr("d", this.linePath(this.fund_income))
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .attr("stroke", "#f85f73");

      // fund_hs300——紫色
      this.yScale.domain(d3.extent(this.fund_hs300));
      curveChart
        .append("g")
        .append("path")
        .attr("class", "line-path-fund_hs300")
        .attr("d", this.linePath(this.fund_hs300))
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .attr("stroke", "#283c63");

      curveChart.append("g").attr("class", "brush").call(brush);

      //legend
      this.svg
        .selectAll(".legend")
        .data(this.keys)
        .enter()
        .append("circle")
        .attr("cx", (d, i) => 5 + i * 75)
        .attr("cy", -2)
        .attr("r", 4)
        .style("fill", (d) => this.colorScale(d));
      this.svg
        .selectAll(".labels")
        .data(this.keys)
        .enter()
        .append("text")
        .attr("x", (d, i) => 15 + i * 75)
        .attr("y", -2)
        .style("fill", (d) => this.colorScale(d))
        .text((d) => d)
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");
    },
  },
};
</script>

<style scoped>
#market_curvechart {
  height: 200px;
  width: 100%;
  margin-top:10px;
}
</style>