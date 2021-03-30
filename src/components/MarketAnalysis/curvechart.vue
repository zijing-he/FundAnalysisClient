<template>
  <div class="container">
    <a-row type="flex" class="funds_market_style">
      <svg class="icon menu_icon" aria-hidden="true">
        <use xlink:href="#iconxitongcaidan"></use>
      </svg>
      <text>Market Timing</text>
    </a-row>
    <a-row><text id="fund_market_text">Fund Market</text></a-row>
    <a-row>
      <div id="market_curvechart"></div>
    </a-row>
  </div>
</template>

<script>
import * as d3 from "d3";
import market_nav_date from "@/data/CurveChart/market_nav_date.json";
import market_number_date from "@/data/CurveChart/market_number_date.json";

export default {
  name: "MarketAnalysisCurveChart",
  props: {
    start: Number,
    end: Number,
  },
  components: {},
  data() {
    return {
      svg: null,
      margin: { top: 70, right: 30, bottom: 30, left: 55 },
      width: 520,
      height: 253,
      isSelf: true,
      date: Object.keys(market_nav_date),
      marketNav: Object.values(market_nav_date),
      marketShares: Object.values(market_number_date),
      keys: ["Fund Market Total Asset", "CSI 300"],
    };
  },
  watch: {
    start: function() {
      this.isSelf = false;
      this.updateTimeBrush();
    },
    end: function() {
      this.isSelf = false;
      this.updateTimeBrush();
    },
  },
  mounted: function() {
    this.renderInit();
    this.renderUpdate();
  },
  emits: ["updateBrush"],
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
      return d3
        .scaleLinear()
        .range([this.innerHeight, 0])
        .nice();
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
        .range(["rgba(80,161,255,0.30)", "#FE6AAC"]);
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
    updateTimeBrush() {
      //Time Brush
      let brush = d3
        .brushX()
        .extent([
          [0, -this.margin.top + 65],
          [this.innerWidth, this.innerHeight],
        ])
        .on("end", this.updateDate);
      this.svg.select(".brush").remove();
      this.svg
        .append("g")
        .attr("class", "brush")
        .call(brush)
        .call(brush.move, [this.start, this.end]);
    },
    updateDate({ selection }) {
      if (selection && this.isSelf) {
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
        if (start !== end) {
          this.$emit("updateBrush", start, end, selection[0], selection[1]);
        }
      }
      this.isSelf = true;

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
        .call(d3.axisBottom(this.xScale).ticks(d3.timeYear.every(1), "%Y"))
        .attr("transform", `translate(0,${this.innerHeight})`)
        .select(".domain")
        .remove();

      this.svg
        .select(".xAxis")
        .selectAll(".tick text")
        .style("font-size", "13px")
        .style("font-family", "PingFangSC-Regular")
        .style("letter-spacing", "-0.08px")
        .style("color", "#6C7B8A");
      // this.svg
      //   .append("g")
      //   .attr("class", "yAxis")
      //   .call(
      //     d3.axisLeft(this.yScale).tickFormat(d3.format(".0%")).ticks(5)
      //     // .ticks(d3.timeYear.every(2))
      //     // .tickValues([2010,2020])
      //     // .tickSize(this.innerHeight / 2 - 3)
      //   )
      // .select(".domain")
      // .remove();

      // this.svg
      //   .select(".yAxis")
      //   .selectAll(".tick text")
      //   .style("font-family", "Helvetica")
      //   .style("font-size", "10px")
      //   .style("color", "#6C7B8A");

      let curveChart = this.svg.append("g");

      //market shares
      //画y轴
      this.yScale.domain([0, d3.max(this.marketShares)]);
      this.svg
        .append("g")
        .attr("id", "marketShares_yAxis")
        .call(
          d3.axisLeft(this.yScale).tickFormat(d3.format("~s"))
          // .ticks(5)
          // .tickFormat(d3.format(".0%")).ticks(5)
          // .ticks(d3.timeYear.every(2))
          // .tickValues([2010,2020])
          // .tickSize(this.innerHeight / 2 - 3)
        )
        .select(".domain")
        .remove();
      this.svg
        .select("#marketShares_yAxis")
        .selectAll(".tick text")
        .style("font-family", "Helvetica")
        .style("font-size", "10px")
        .style("color", "#6C7B8A");

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
        .datum(this.marketShares)
        .attr("class", "streamGraphLayers")
        .style("stroke", "rgba(80,161,255,0.30)")
        .style("fill", "rgba(80,161,255,0.30)")
        .attr("d", this.area);

      //marketNav
      this.yScale.domain([0.8, d3.max(this.marketNav)]);
      this.svg
        .append("g")
        .attr("id", "marketNav_yAxis")
        .call(d3.axisRight(this.yScale).ticks(6))
        .attr("transform", `translate(${this.innerWidth},0)`)
        .select(".domain")
        .remove();
      this.svg
        .select("#marketNav_yAxis")
        .selectAll(".tick text")
        .style("font-family", "Helvetica")
        .style("font-size", "10px")
        .style("color", "#6C7B8A");

      curveChart
        .append("g")
        .append("path")
        .attr("class", "line-path-income")
        .attr("d", this.linePath(this.marketNav))
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .attr("stroke", "#FE6AAC");

      //legend
      this.svg
        .selectAll(".legend")
        .data(this.keys)
        .enter()
        .append("circle")
        .attr("cx", (d, i) => 170 + i * 200)
        .attr("cy", -49)
        .attr("r", "6px")
        .style("fill", (d) => this.colorScale(d));

      this.svg
        .selectAll(".labels")
        .data(this.keys)
        .enter()
        .append("text")
        .attr("x", (d, i) => 185 + i * 200)
        .attr("y", -48)
        .style("fill", "#9F9F9F")
        .style("font-family", "PingFangSC-Medium")
        .style("font-size", "13px")
        .style("letter-spacing", "-0.18px")
        .text((d) => d)
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");

      //删除刻度线
      this.svg.selectAll(".tick line").remove();

      //timebrush
      let brush = d3
        .brushX()
        .extent([
          [0, -this.margin.top + 65],
          [this.innerWidth, this.innerHeight],
        ])
        .on("end", this.updateDate);
      this.svg
        .append("g")
        .attr("class", "brush")
        .call(brush);
    },
  },
};
</script>

<style scoped>
.container {
  height: 349px;
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

#fund_market_text {
  font-family: "PingFangSC-Medium";
  font-size: 15px;
  font-weight: 600;
  line-height: 32px;
  color: #4b4b4b;
  letter-spacing: -0.22px;
  text-align: right;
  margin-left: 28px;
  margin-top: 10px;
}
</style>
