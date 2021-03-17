<template>
  <div class="container">
    <a-row type="flex" class="funds_market_style">
      <svg class="icon menu_icon" aria-hidden="true">
        <use xlink:href="#iconxitongcaidan"></use>
      </svg>
      <text>Funds Market</text>
    </a-row>
    <a-row>
      <div id="market_curvechart"></div>
    </a-row>
  </div>
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
      margin: { top: 70, right: 20, bottom: 30, left: 55 },
      width: 520,
      height: 253,
      date: Object.keys(market_income),
      fund_size: Object.values(market_size),
      fund_number: Object.values(market_number),
      fund_income: Object.values(market_income),
      fund_hs300: Object.values(market_hs300),
      keys: ["基金平均收益", "基金规模"],
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
        .domain(this.keys)
        .range(["#855FFA", "#FE6AAC", "rgba(80,161,255,0.30)"]);
    },
    area() {
      return d3
        .area()
        .x((d, i) => this.xScale(this.date[i]))
        .y0((d) => this.yScale(0))
        .y1((d) => this.yScale(d));
    },
  },

  methods: {
    updateDate({ selection }) {
      if (selection) {
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

        this.$emit("updateBrush", start, end);
      }

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
        .attr("class", "xAxis")
        .call(d3.axisBottom(this.xScale).ticks(d3.timeYear.every(2), "%Y"))
        .attr("transform", `translate(0,${this.innerHeight})`)
        .select(".domain")
        .remove();

      this.svg
        .append("g")
        .attr("class", "yAxis")
        .call(
          d3.axisLeft(this.yScale).tickFormat(d3.format(".0%")).ticks(5)
          // .ticks(d3.timeYear.every(2))
          // .tickValues([2010,2020])
          // .tickSize(this.innerHeight / 2 - 3)
        )
        .select(".domain")
        .remove();
      this.svg.selectAll(".tick line").remove();
      this.svg
        .select(".xAxis")
        .selectAll(".tick text")
        .style("font-size", "13px")
        .style("font-family", "PingFangSC-Regular")
        .style("letter-spacing", "-0.08px")
        .style("color", "#6C7B8A");
      this.svg
        .select(".yAxis")
        .selectAll(".tick text")
        .style("font-family", "Helvetica")
        .style("font-size", "10px")
        .style("color", "#6C7B8A");

      // .attr("transform", `translate(0,${this.innerHeight})`);

      // this.svg
      // .append("g")
      // .call(d3.axisBottom(this.xScale).ticks(d3.timeYear.every(1), "%Y"))
      // .attr("transform", `translate(0,${this.innerHeight})`);

      let brush = d3
        .brushX()
        .extent([
          [0, -this.margin.top + 35],
          [this.innerWidth, this.innerHeight],
        ])
        .on("end", this.updateDate);

      let curveChart = this.svg.append("g");

      //fund_size
      this.yScale.domain([0, d3.max(this.fund_size)]);
      // console.log(this.yScale(0),this.yScale(100000));
      // curveChart
      //   .append("g")
      //   .append("path")
      //   .attr("class", "line-path-size")
      //   .attr("d", this.linePath(this.fund_size))
      //   .attr("fill", "none")
      //   .attr("stroke-width", 1.5)
      //   // .attr("stroke", "rgba(80,161,255,0.30)");
      //   .attr("stroke", "red");
      curveChart
        .append("g")
        .append("path")
        .datum(this.fund_size)
        .attr("class", "streamGraphLayers")
        .style("stroke", "rgba(80,161,255,0.30)")
        .style("fill", "rgba(80,161,255,0.30)")
        // .style("stroke-width", "0.1px")
        // .style("fill", "#9F9D9D")
        .attr("d", this.area);

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
        .attr("stroke", "#FE6AAC");

      // fund_hs300——紫色
      // this.yScale.domain(d3.extent(this.fund_hs300));
      // curveChart
      //   .append("g")
      //   .append("path")
      //   .attr("class", "line-path-fund_hs300")
      //   .attr("d", this.linePath(this.fund_hs300))
      //   .attr("fill", "none")
      //   .attr("stroke-width", 2)
      //   .attr("stroke", "#855FFA");

      curveChart.append("g").attr("class", "brush").call(brush);

      //legend
      this.svg
        .selectAll(".legend")
        .data(this.keys)
        .enter()
        .append("circle")
        .attr("cx", (d, i) => 210 + i * 150)
        .attr("cy", -50)
        .attr("r", "6px")
        .style("fill", (d) => this.colorScale(d));

      this.svg
        .selectAll(".labels")
        .data(["Average return", "Fund size"])
        .enter()
        .append("text")
        .attr("x", (d, i) => 230 + i * 150)
        .attr("y", -48)
        .style("fill", "#9F9F9F")
        .style("font-family", "PingFangSC-Medium")
        .style("font-size", "14px")
        .style("letter-spacing", "-0.18px")
        .text((d) => d)
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");
    },
  },
};
</script>

<style scoped>
.container {
  height: 307px;
  width: 523px;
}
#market_curvechart {
  height: 253px;
  width: 100%;
}
.funds_market_style {
  margin-top: 3%;
  margin-bottom: 1%;
}
.funds_market_style text {
  font-family: "PingFangSC-Semibold";
  font-size: 19px;
  height: 32px;
  font-weight: 800;
  color: #185bbd;
  letter-spacing: 0;
  margin-left: 25px;
}
.funds_market_style .menu_icon {
  position: relative;
  color: #185bbd;
  font-size: 23px;
  bottom: 4px;
  left: 20px;
}
</style>