<template>
  <div id="market_raderchart2"></div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "ControlPanelRaderChart2",
  props: {
    value: Number,
    axis: String,
  },
  components: {},
  data() {
    return {
      svg: null,
      raderChart: null,
      margin: { top: 75, right: 120, bottom: 120, left: 65 },
      width: 80,
      height: 80,
      factor: 1,
      levels: 5,
      maxValue: 1,
      radians: 2 * Math.PI,
      color: d3.scaleLinear().domain([0, 1]).range(d3.schemeCategory10),
      data: [
        { axis: "收益", value: 0 },
        { axis: "最大回撤率", value: 0 },
        { axis: "风险", value: 0 },
        { axis: "机构占比", value: 0 },
        { axis: "规模", value: 0 },
      ],
      dataValues: [],
      allAxis: [],
      total: 0,
      radius: 0,
    };
  },
  watch: {
    value: function () {
      this.data.forEach((d) => {
        if (d.axis === this.axis) {
          d.value = this.value;
        }
      });
      this.svg.selectAll("polygon").remove();
      this.svg.selectAll(".nodes").remove();
      this.renderUpdate();
    },
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
  },

  methods: {
    renderInit() {
      this.allAxis = this.data.map((d) => d.axis);
      this.maxValue = Math.max(
        this.maxValue,
        d3.max(this.data, (d) => d.value)
      );
      this.total = this.allAxis.length;
      this.radius = this.factor * Math.min(this.width / 2, this.height / 2);

      this.svg = d3
        .select("#market_raderchart2")
        .append("svg")
        .attr("width", this.width + this.margin.right)
        .attr("height", this.height + this.margin.bottom)
        .append("g")
        .attr("transform", `translate(${this.margin.left},${this.margin.top})`);

      this.raderChart = this.svg.append("g");

      for (let i = 0; i < this.levels; i++) {
        let levelFactor = this.factor * this.radius * ((i + 1) / this.levels);
        this.raderChart
          .selectAll(".levels")
          .data(this.allAxis)
          .enter()
          .append("line")
          .attr(
            "x1",
            (d, i) =>
              levelFactor *
              (1 - this.factor * Math.sin((i * this.radians) / this.total))
          )
          .attr(
            "y1",
            (d, i) =>
              levelFactor *
              (1 - this.factor * Math.cos((i * this.radians) / this.total))
          )
          .attr(
            "x2",
            (d, i) =>
              levelFactor *
              (1 -
                this.factor * Math.sin(((i + 1) * this.radians) / this.total))
          )
          .attr(
            "y2",
            (d, i) =>
              levelFactor *
              (1 -
                this.factor * Math.cos(((i + 1) * this.radians) / this.total))
          )
          .attr("class", "line")
          .style("stroke", "#bbb")
          .style("stroke-opacity", "0.75")
          .style("stroke-width", "1px")
          .attr(
            "transform",
            `translate(${this.width / 2 - levelFactor},${
              this.height / 2 - levelFactor
            })`
          );
      }
      let axis = this.raderChart
        .selectAll(".axis")
        .data(this.allAxis)
        .enter()
        .append("g");
      axis
        .append("line")
        .attr("x1", this.width / 2)
        .attr("y1", this.height / 2)
        .attr(
          "x2",
          (d, i) =>
            (this.width / 2) *
            (1 - this.factor * Math.sin((i * this.radians) / this.total))
        )
        .attr(
          "y2",
          (d, i) =>
            (this.height / 2) *
            (1 - this.factor * Math.cos((i * this.radians) / this.total))
        )
        .style("stroke", "#D5D5D5")
        .style("stroke-width", "1px");

      let textgroup = this.svg.append("g").attr("font-size", "11px");
      textgroup.append("text").attr("x", "23").attr("y", "-35").text("收益");
      textgroup
        .append("text")
        .attr("x", "-65")
        .attr("y", "4")
        .text("最大回撤率");
      textgroup.append("text").attr("x", "-20").attr("y", "85").text("风险");
      textgroup.append("text").attr("x", "52").attr("y", "85").text("机构占比");
      textgroup.append("text").attr("x", "87").attr("y", "4").text("规模");

      this.raderChart.attr("transform", "translate(-6,-16)");
    },
    renderUpdate() {
      //计算value的坐标
      this.data.forEach((d, i) => {
        this.dataValues.push([
          (this.width / 2) *
            (1 -
              (parseFloat(Math.max(d.value, 0)) / this.maxValue) *
                this.factor *
                Math.sin((i * this.radians) / this.total)),
          (this.height / 2) *
            (1 -
              (parseFloat(Math.max(d.value, 0)) / this.maxValue) *
                this.factor *
                Math.cos((i * this.radians) / this.total)),
        ]);
      });

      let str = "";
      for (let i = 0; i < this.dataValues.length; i++) {
        str = str + this.dataValues[i][0] + "," + this.dataValues[i][1] + " ";
      }

      this.raderChart
        .selectAll(".area")
        .data([this.dataValues])
        .enter()
        .append("polygon")
        .attr("class", "area")
        .style("stroke-width", "1.5px")
        .style("stroke", "#5ABDB8")
        .style("fill", "#5ABDB8")
        .style("fill-opacity", 0.5)
        // .transition()
        // .duration(2000)
        .attr("points", str);

      this.raderChart
        .selectAll(".nodes")
        .data(this.data)
        .enter()
        .append("circle")
        .attr("class", "nodes")
        .attr("r", 2)
        .attr(
          "cx",
          (d, i) =>
            (this.width / 2) *
            (1 -
              (Math.max(d.value, 0) / this.maxValue) *
                this.factor *
                Math.sin((i * this.radians) / this.total))
        )
        .attr(
          "cy",
          (d, i) =>
            (this.height / 2) *
            (1 -
              (Math.max(d.value, 0) / this.maxValue) *
                this.factor *
                Math.cos((i * this.radians) / this.total))
        )
        .attr("data-id", (d) => d.axis)
        .style("fill", this.color(0))
        .style("fill-opacity", 0.8);
    },
  },
};
</script>

<style scoped>
</style>