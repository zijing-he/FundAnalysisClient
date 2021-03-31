<template>
  <div class="rose-chart" id="rose_chart"></div>
</template>

<script>
import * as d3 from "d3";
import weightKey from "@/data/weight_key.json";

const colorMap = {
  // performance
  one_quarter_return: "#b3cde3",
  one_year_return: "#b3cde3",
  three_year_return: "#b3cde3",
  // risk
  risk: "#ccebc5",
  // active performance
  sharp_ratio: "#fbb4ae",
  // basic
  size: "#decbe4",
};

const dataGroup = [
  ["one_quarter_return", "one_year_return", "three_year_return"],
  ["risk"],
  ["sharp_ratio"],
  ["size"],
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
      let randNum = Math.floor(Math.random() * Math.floor(100));
      d3.select("#rose_chart").attr(
        "id",
        `rose_chart_${this.fundId}_${randNum}`
      );
      this.svg = d3
        .select(`#rose_chart_${this.fundId}_${randNum}`)
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("viewbox", [0, 0, this.width, this.height]);
    },
    renderUpdate() {
      this.svg.selectAll("g").remove();

      // const arcs = this.pie(this.datum);
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
        .append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", "100%")
        .attr("fill", `url(#pattern_stripe_${this.fundId})`);
      const gChart = this.svg
        .append("g")
        .attr("transform", `translate(${this.width / 2}, ${this.height / 2})`);
      const that = this;
      for (let i = 0; i < dataGroup.length; i++) {
        let curGroup = dataGroup[i];
        let eachAngle = (Math.PI * 2) / 4 / curGroup.length;
        for (let j = 0; j < curGroup.length; j++) {
          gChart
            .append("path")
            .attr("id", `path_${this.fundId}_${curGroup[j]}`)
            .attr("stroke", "rgb(147, 147, 147)")
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
                that.scaleRadius(Math.abs(that.fundData[curGroup[j]].norm))
              );
              this._current = interpolate(1);
              return function(t) {
                let arc = d3
                  .arc()
                  .innerRadius(0)
                  .outerRadius(interpolate(t))
                  .startAngle(
                    -Math.PI / 4 + ((Math.PI * 2) / 4) * i + j * eachAngle
                  )
                  .endAngle(
                    -Math.PI / 4 + ((Math.PI * 2) / 4) * i + (j + 1) * eachAngle
                  );
                return arc();
              };
            });
          d3.select(`#path_${this.fundId}_${curGroup[j]}`)
            .append("title")
            .text(
              `${weightKey[curGroup[j]].en_name} ${this.fundData[
                curGroup[j]
              ].value.toFixed(2)}`
            );
          // 使用mask会导致边框为虚线，再描一遍path
          setTimeout(() => {
            if (this.fundData[curGroup[j]].norm < 0) {
              gChart
                .append("path")
                .attr("stroke", "rgb(147, 147, 147)")
                .attr("fill", "none")
                .attr(
                  "d",
                  d3.select(`#path_${this.fundId}_${curGroup[j]}`).attr("d")
                );
            }
          }, 300);
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
