<template>
  <div id="market_linechart"></div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "ControlPanelLineChart",
  props: { id: String, data: Object },
  components: {},
  data() {
    return {
      svg: null,
      margin: { top: 5, right: 5, bottom: 15, left: 75 },
      width: 200,
      height: 33,
      brush: null,
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
        .scaleLinear()
        .domain([0, this.data.length - 1])
        .range([0, this.innerWidth])
        .nice();
    },
    yScale() {
      return d3
        .scaleLinear()
        .domain([0, d3.max(this.data, (d) => d.length)])
        .range([this.innerHeight, 0])
        .nice();
    },
    linePath() {
      return d3
        .line()
        .curve(d3.curveCatmullRom)
        .x((d, i) => this.xScale(i))
        .y((d) => this.yScale(d.length));
    },
    colorScale() {
      return d3
        .scaleOrdinal()
        .domain(["income", "size", "holder", "risk", "max_drop"])
        .range(d3.schemeTableau10);
    },
    nameScale() {
      return d3
        .scaleOrdinal()
        .domain(["income", "size", "holder", "risk", "max_drop"])
        .range(["收益", "规模", "机构占比", "风险", "最大回撤率"]);
    },
  },

  methods: {
    updateChart({ selection }) {
      let start = Math.floor(this.xScale.invert(selection[0]));
      let end = Math.floor(this.xScale.invert(selection[1]));
      if (end >= this.data.length) {
        end = this.data.length - 1;
      }
      let sum = 0,
        temp = 0;
      for (let i = 0; i < this.data.length; i++) {
        temp += this.data[i].length;
        if (i >= start && i <= end) {
          sum += this.data[i].length;
        }
      }
      let res = sum / temp;
      this.$emit("updateValue", res, this.nameScale(this.id));
      // this.svg.select(".brush").call(this.brush.move, null);  //情况brush后会报错，但是不影响
    },
    renderInit() {
      this.brush = d3
        .brushX()
        .extent([
          [0, -this.margin.top],
          [this.innerWidth, this.innerHeight],
        ])
        .on("end", this.updateChart);

      d3.select("#market_linechart").attr("id", this.id);
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
      let lineChart = this.svg.append("g");
      lineChart
        .append("g")
        .call(
          d3
            .axisBottom(this.xScale)
            .tickSize(1)
            .tickValues([0, this.data.length - 1])
        )
        .attr("transform", `translate(0,${this.innerHeight})`);

      lineChart.append("g").call(
        d3
          .axisLeft(this.yScale)
          .tickSize(0)
          .tickValues([0, d3.max(this.data, (d) => d.length)])
      );

      lineChart
        .append("g")
        .append("path")
        .attr("class", `line-path-${this.id}`)
        .attr("d", this.linePath(this.data))
        .attr("fill", "none")
        .attr("stroke-width", 1)
        .attr("stroke", this.colorScale(this.id));

      lineChart
        .append("text")
        .attr("x", "-74")
        .attr("y", "10")
        .text(this.nameScale(this.id))
        .style("font-size", "11px");

      lineChart.append("g").attr("class", "brush").call(this.brush);
    },
  },
};
</script>

<style scoped>
</style>