<template>
  <div class="rose-chart" id="rose_chart">
    <a-spin v-if="isRequesting" tip="Loading..." />
  </div>
</template>

<script>
import * as d3 from "d3";
import DataService from "@/utils/data-service";

const colorMap = {
  all_hs300_return: "#fddaec",
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
};

export default {
  name: "NightingaleRoseChart",
  props: {
    fundId: String,
    start_date: String,
    end_date: String,
  },
  data() {
    return {
      svg: null,
      width: 127,
      height: 127,
      datum: [],
      isRequesting: true,
    };
  },
  computed: {
    pie() {
      return d3.pie().value((d) => d.norm);
    },
    scaleRadius() {
      const maxRadius = Math.min(this.width, this.height) / 2;
      return d3
        .scaleLinear()
        .domain([0, d3.max(this.datum.map((d) => d.norm))])
        .range([0, maxRadius]);
    },
  },
  mounted: function() {
    this.width = document.getElementById("rose_chart").clientWidth;
    this.renderInit();
    this.getFundData();
  },
  methods: {
    renderInit() {
      d3.select("#rose_chart").attr("id", `rose_chart_${this.fundId}`);
      this.svg = d3
        .select(`#rose_chart_${this.fundId}`)
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("viewbox", [0, 0, this.width, this.height]);
    },
    renderUpdate() {
      this.svg.selectAll("g").remove();

      const arcs = this.pie(this.datum);
      const gChart = this.svg
        .append("g")
        .attr("transform", `translate(${this.width / 2}, ${this.height / 2})`);
      const that = this;
      gChart
        .selectAll("path")
        .data(arcs)
        .join("path")
        .attr("fill", (d) => colorMap[d.data.name])
        .transition()
        .duration(300)
        .attrTween("d", function(d) {
          let curRadius = this._current;
          if (!curRadius) curRadius = 0;
          const interpolate = d3.interpolate(
            curRadius,
            that.scaleRadius(d.data.norm)
          );
          this._current = interpolate(1);
          return function(t) {
          let arc = d3
            .arc()
            .innerRadius(0)
            .outerRadius(interpolate(t));
          return arc(d);
          };
        });
      gChart
        .selectAll("path")
        .data(arcs)
        .append("title")
        .text((d) => `${d.data.name}: ${d.data.value.toFixed(2)}`);
    },
    getFundData() {
      this.isRequesting = true;
      DataService.post(
        "get_view_funds",
        {
          f_ids: [this.fundId],
          start_date: this.start_date,
          end_date: this.end_date,
        },
        (data) => {
          for (let key in data["total"][this.fundId]) {
            this.datum.push({
              name: key,
              norm: data["total"][this.fundId][key].norm,
              value: data["total"][this.fundId][key].value,
            });
            this.isRequesting = false;
            this.renderUpdate();
          }
        }
      );
    },
  },
};
</script>

<style scoped>
.rose-chart {
  height: 127px;
  width: 100%;
}
</style>
