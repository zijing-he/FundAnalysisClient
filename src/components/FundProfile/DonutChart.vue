<template>
  <div class="donut-chart" id="donut_chart"></div>
</template>

<script>
import * as d3 from "d3";

const colorMap = {
  one_quarter_return: "#fddaec",
  one_year_return: "#fddaec",
  three_year_return: "#fddaec",
  all_return: "#fddaec",
  stock: "#a65628",
  bond: "#377eb8",
  cash: "#f781bf",
  other: "#999999",
  size: "#e5d8bd",
  alpha: "#ffff33",
  beta: "#ffffcc",
  sharp_ratio: "#984ea3",
  max_drop_down: "#b3cde3",
  information_ratio: "#decbe4",
  risk: "#fed9a6",
  instl_weight: "#f2f2f2",
  empty: "white",
};

export default {
  name: "DonutChart",
  props: {
    fundId: String,
    datum: Object,
    rank: Number,
  },
  data() {
    return {
      svg: null,
      width: 100,
      height: 270,
    };
  },
  computed: {
    pie() {
      return d3.pie().value((d) => d.value.norm);
    },
    arc() {
      const radius = Math.min(this.width, this.height) / 2;
      return d3
        .arc()
        .innerRadius(radius * 0.67)
        .outerRadius(radius - 1);
    },
  },
  mounted: function() {
    // console.log(this.datum);
    this.width = document.getElementById("donut_chart").clientWidth;
    this.renderInit();
    this.renderUpdate();
  },
  methods: {
    renderInit() {
      d3.select("#donut_chart").attr("id", `donut_chart_${this.fundId}`);
      this.svg = d3
        .select(`#donut_chart_${this.fundId}`)
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("viewbox", [0, 0, this.width, this.height]);
    },
    renderUpdate() {
      this.svg.selectAll("g").remove();

      const arcs = this.pie(this.datum);
      const gDonut = this.svg
        .append("g")
        .attr("transform", `translate(${this.width / 2}, ${this.height / 2})`);
      gDonut
        .selectAll("path")
        .data(arcs)
        .join("path")
        .attr("fill", (d) => colorMap[d.data.name])
        .attr("d", this.arc)
        .append("title")
        .text((d) => `${d.data.name}: ${d.data.value.norm.toFixed(2)}`);

      gDonut.append("text")
        .attr("font-weight", "bold")
        .attr("font-size", 30)
        .attr("dx", -5)
        .attr("dy", 5)
        .text(this.rank + 1)
        .on("click", this.handleClick);
    },
    handleClick() {
      this.$emit("showFundProfile", this.fundId);
    },
  },
};
</script>

<style scoped>
.donut-chart {
  position: relative;
  height: 270px;
  width: 100%;
  border: 1px solid black;
}
</style>
