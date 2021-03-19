<template>
  <div class="rose-chart" id="rose_chart"></div>
</template>

<script>
import * as d3 from "d3";
import { eachRight } from "lodash";

const colorMap = {
  all_hs300_return: "#d8d8d8",
  one_quarter_return: "#d8d8d8",
  one_year_return: "#d8d8d8",
  three_year_return: "#d8d8d8",
  all_return: "#d8d8d8",
  stock: "#d8d8d8",
  bond: "#d8d8d8",
  cash: "#d8d8d8",
  other: "#d8d8d8",
  size: "#d8d8d8",
  alpha: "#d8d8d8",
  beta: "#d8d8d8",
  sharp_ratio: "#d8d8d8",
  max_drop_down: "#d8d8d8",
  information_ratio: "#d8d8d8",
  risk: "#d8d8d8",
  instl_weight: "#d8d8d8",
};

const dataGroup = [
  ["one_quarter_return", "one_year_return", "three_year_return"],
  ["max_drop_down", "risk", "size", "beta"],
  ["alpha", "sharp_ratio", "information_ratio"],
];

export default {
  name: "NightingaleRoseChart",
  props: {
    fundId: String,
    fundData: Object,
    start_date: String,
    end_date: String,
  },
  data() {
    return {
      svg: null,
      width: 127,
      height: 127,
      // datum: [],
    };
  },
  computed: {
    // pie() {
    //   return d3
    //     .pie()
    //     .value((d) => d.norm)
    //     .sort(null)
    //     .sortValues(null);
    // },
    scaleRadius() {
      const maxRadius = Math.min(this.width, this.height) / 2;
      const minRadius = maxRadius / 3;
      return d3
        .scaleLinear()
        .domain([0, 1.1])
        .range([minRadius, maxRadius]);
    },
  },
  mounted: function() {
    this.width = document.getElementById("rose_chart").clientWidth;
    this.renderInit();
    // this.parseFundData();
    this.renderUpdate();
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

      // const arcs = this.pie(this.datum);
      const gChart = this.svg
        .append("g")
        .attr("transform", `translate(${this.width / 2}, ${this.height / 2})`);
      // 条纹
      const defs = this.svg.append("defs");
      defs
        .append("pattern")
        .attr("id", `pattern_stripe_${this.fundId}`)
        .attr("width", 4)
        .attr("height", 4)
        .attr("patternUnits", "userSpaceOnUse")
        .attr("patternTransform", "rotate(45)")
        .append("rect")
        .attr("width", 2)
        .attr("height", 4)
        .attr("transform", "translate(0, 0)")
        .attr("fill", "white");
      defs
        .append("mask")
        .attr("id", `mask_stripe_${this.fundId}`)
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", `url(#pattern_stripe_${this.fundId})`);
      const that = this;
      for (let i = 0; i < dataGroup.length; i++) {
        let curGroup = dataGroup[i];
        let eachAngle = (Math.PI * 2) / 3 / curGroup.length;
        for (let j = 0; j < curGroup.length; j++) {
          gChart
            .append("path")
            .attr("id", `path_${this.fundId}_${curGroup[j]}`)
            .attr("stroke", "black")
            .attr("fill", colorMap[curGroup[j]])
            .attr(
              "mask",
              this.fundData[curGroup[j]].norm < 0
                ? `url(#mask_stripe_${this.fundId})`
                : "none"
            )
            .transition()
            .duration(300)
            .attrTween("d", function() {
              let curRadius = this._current;
              if (!curRadius) curRadius = 0;
              const interpolate = d3.interpolate(
                curRadius,
                that.scaleRadius(that.fundData[curGroup[j]].norm)
              );
              this._current = interpolate(1);
              return function(t) {
                let arc = d3
                  .arc()
                  .innerRadius(0)
                  .outerRadius(interpolate(t))
                  .startAngle((Math.PI * 2) / 3 * i + j * eachAngle)
                  .endAngle((Math.PI * 2) / 3 * i + (j + 1) * eachAngle);
                return arc();
              };
            });
          d3.select(`#path_${this.fundId}_${curGroup[j]}`)
            .append("title")
            .text(`${curGroup[j]} ${this.fundData[curGroup[j]].value.toFixed(2)}`);
        }
      }
      // gChart
      //   .selectAll("path")
      //   .data(arcs)
      //   .join("path")
      //   .attr("stroke", "black")
      //   .attr("fill", (d) => colorMap[d.data.name])
      //   .attr("mask", (d) => {
      //     d.data.norm < 0 ? `url(#mask_stripe_${this.fundId})` : "none";
      //   })
      //   .transition()
      //   .duration(300)
      //   .attrTween("d", function(d) {
      //     let curRadius = this._current;
      //     if (!curRadius) curRadius = 0;
      //     const interpolate = d3.interpolate(
      //       curRadius,
      //       that.scaleRadius(d.data.norm)
      //     );
      //     this._current = interpolate(1);
      //     return function(t) {
      //       let arc = d3
      //         .arc()
      //         .innerRadius(0)
      //         .outerRadius(interpolate(t));
      //       return arc(d);
      //     };
      //   });
      // gChart
      //   .selectAll("path")
      //   .append("title")
      //   .text((d) => `${d.data.name}: ${d.data.value.toFixed(2)}`);
    },
    // parseFundData() {
    //   for (let key in this.fundData) {
    //     this.datum.push({
    //       name: key,
    //       norm: this.fundData[key].norm,
    //       value: this.fundData[key].value,
    //     });
    //   }
    // },
  },
};
</script>

<style scoped>
.rose-chart {
  height: 127px;
  width: 100%;
}
</style>
