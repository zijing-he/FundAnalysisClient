<template>
  <div
    ref="fund_bubble_chart_container"
    class="fund_bubble_chart_inner_container"
    :style="autoLeft"
  >
  <!-- `${i.substring(0, 4)}-${i.substring(4, 6)}-${i.substring(6)}` -->
    <div class="text">{{thisDate}}</div>
    <div id="fund_bubble_chart_item" class="fund_bubble_chart_item"></div>
  </div>
</template>

<script>
import * as d3 from "d3";
var jsnx = require("jsnetworkx");
export default {
  name: "fundBubbleChart",
  props: {
    date: String,
    quarterFundData: Object,
    fundManagers: Object,
    managerGruop: Object,
    marginLeft: Number,
    scrollLeft: Number,
    showManagerId: Array,
    showManagerIdLength: Number,
  },
  components: {},
  watch: {
    quarterFundData: function (fundData) {
      this.graphInit();
      this.renderUpdate();
    },
    mangerId: function () {
      // this.renderUpdate();
    },
    showManagerIdLength: function (value) {
      //watch无法监测数组length的长度
      // console.log("最终的变化,", this.showManagerId, value);
      this.renderUpdate();
      // this.svg.selectAll("g").remove();
    },
  },
  data() {
    return {
      svg: null,
      width: 157.766,
      height: 157.766,
      margin: { top: 20, right: 20, bottom: 20, left: 20 },
      data: null,
      data_values: [],
      fund_id: [],
      thisDate:`${this.date.substring(0, 4)}-${this.date.substring(4, 6)}-${this.date.substring(6)}`,
      managersKey: [],
      G: null,
    };
  },
  mounted: function () {
    // console.log(this.date);
    // console.log(this.quarterFundData);
    this.graphInit();
    this.renderInit();
    this.renderUpdate();
  },
  computed: {
    autoLeft() {
      const style = {};
      style["margin-left"] = this.marginLeft + "px"; //动态左边距
      return style;
    },
    innerWidth() {
      return this.width - this.margin.left - this.margin.right;
    },
    innerHeight() {
      return this.height - this.margin.top - this.margin.bottom;
    },
    xScale() {
      return d3
        .scaleLinear()
        .domain(d3.extent(this.data_values, (d) => d.loc[0]))
        .range([0, this.innerWidth])
        .nice();
    },
    yScale() {
      return d3
        .scaleLinear()
        .domain(d3.extent(this.data_values, (d) => d.loc[1]))
        .range([this.innerHeight, 0])
        .nice();
    },
  },
  methods: {
    graphInit() {
      //创建图和顶点：
      this.G = new jsnx.Graph();

      for (let id in this.quarterFundData) {
        this.G.addNode(id, {
          managerId: this.quarterFundData[id].manager_ids,
          x: this.quarterFundData[id].loc[0],
          y: this.quarterFundData[id].loc[1],
          new: this.quarterFundData[id]["new"],
          delete: this.quarterFundData[id]["delete"],
        });
      }

      for (let key in this.managerGruop) {
        if (this.managerGruop[key].length > 1) {
          this.managerGruop[key].forEach((d, i) => {
            if (i - 1 >= 0) {
              let startId = this.managerGruop[key][i - 1];
              let endId = d;
              this.G.addEdge(startId, endId, {
                source: {
                  id: startId,
                  x: this.quarterFundData[startId].loc[0],
                  y: this.quarterFundData[startId].loc[1],
                },
                target: {
                  id: endId,
                  x: this.quarterFundData[endId].loc[0],
                  y: this.quarterFundData[endId].loc[1],
                },
                managerId: key,
              });
            }
          });
        }
      }
    },

    renderInit() {
      this.svg = d3
        .select("#fund_bubble_chart_item")
        .attr("id", "fund_bubble_chart_item_" + this.date)
        .style("width", this.width + "px")
        .style("height", this.height + "px")
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("viewBox", [0, 0, this.width, this.height])
        .append("g")
        .attr("transform", `translate(${this.margin.left},${this.margin.top})`);
    },
    renderUpdate() {
      this.data_values = Object.values(this.quarterFundData);
      this.svg.selectAll("g").remove();
      // console.log(
      //   "检查基金经理：",
      //   this.showManagerId,
      //   this.showManagerIdLength
      // );
      this.svg
        .append("g")
        .selectAll("circle")
        .data(this.G.nodes(true)) // this.G.nodes(true)
        .enter()
        .append("circle")
        // .attr("class", (d) => `funds_manager_${d[1].managerId[0]}`) //展示时注意：可能一个基金有多个基金经理
        .attr("r", 6)
        .style("fill", (d) => {
          //点只展示目前点击的基金经理的颜色
          for (let id of d[1].managerId) {
            // if (id === this.showManagerId) {
            if (
              this.showManagerIdLength &&
              this.showManagerId.indexOf(id) !== -1
            ) {
              // return this.fundManagers[this.showMangerId].color;
              return this.fundManagers[
                this.showManagerId[this.showManagerId.indexOf(id)]
              ].color;
            }
          }

          return "#D8D8D8";
        })
        .style("stroke", (d) =>
          d[1].new == true || d[1].delete == true ? "black" : "none"
        )
        // d.new == true : "特殊操作" ? "默认"
        .style("stroke-dasharray", (d) =>
          d[1].new == true || d[1].delete == true ? "2" : "0"
        )

        .attr("cx", (d) => this.xScale(d[1].x))
        .attr("cy", (d) => this.yScale(d[1].y));

      let link = this.svg
        .append("g")
        .selectAll("line")
        .data(this.G.edges(true)) //this.G.edges(true)
        .enter()
        .append("line")
        .attr("class", (d) => `funds_manager_${d[2].managerId}`)
        .style("stroke", (d) => {
          // console.log(
          //   "康康边：",
          //   d,
          //   d[2].managerId,
          //   this.fundManagers[d[2].managerId]
          // );

          // if (d[2].managerId === this.showMangerId) {
          if (
            this.showManagerIdLength &&
            this.showManagerId.indexOf(d[2].managerId) !== -1
          ) {
            return this.fundManagers[
              this.showManagerId[this.showManagerId.indexOf(d[2].managerId)]
            ].color;
          } else {
            return "#D8D8D8";
          }
        })
        .style("stroke-width", "2")
        .style("visibility", (d) => {
          // if (d[2].managerId === this.showMangerId) {
          if (
            this.showManagerIdLength &&
            this.showManagerId.indexOf(d[2].managerId) !== -1
          ) {
            return "visible";
          } else {
            return "hidden";
          }
        })
        // .style("opacity", "0.4")
        .attr("x1", (d) => {
          // console.log(d);
          return this.xScale(d[2].source.x);
        })
        .attr("y1", (d) => this.yScale(d[2].source.y))
        .attr("x2", (d) => this.xScale(d[2].target.x))
        .attr("y2", (d) => this.yScale(d[2].target.y));

      // this.svg
      //   .append("g")
      //   .selectAll("circle")
      //   .data(this.data_values)
      //   .enter()
      //   .append("circle")
      //   // .join("circle")
      //   .attr("cx", (d) => this.xScale(d.loc[0]))
      //   .attr("cy", (d) => this.yScale(d.loc[1]))
      //   .attr("r", 4)
      //   .style("fill", (d, i) => {
      //     if (this.mangerId) {
      //       let flag = false;
      //       d.manager_ids.forEach((dd) => {
      //         if (dd == this.mangerId) {
      //           flag = true;
      //         }
      //       });
      //       if (flag) {
      //         return this.fundManagers[this.mangerId].color;
      //       } else {
      //         return "#B6B6B6";
      //       }
      //     } else {
      //       return "#B6B6B6";
      //     }
      //   })
      // .style("stroke", (d) =>
      //   d.new == true || d.delete == true ? "black" : "none"
      // )
      // // d.new == true : "特殊操作" ? "默认"
      // .style("stroke-dasharray", (d) => (d.new == true ? "2" : "0"))
      //   .style("fill-opacity", (d) => (d.delete == true ? "0.5" : "1"));
    },
  },
};
</script>

<style scoped>
.fund_bubble_chart_inner_container {
  position: relative;
  height: 176px;
  width: 157.766px;
  flex-shrink: 0;
  /* border: 1px dashed #979797; */
}
.fund_bubble_chart_inner_container .fund_bubble_chart_item {
  border: 1px dashed #979797;
}
.text {
  text-align: center;
  font-family: "PingFangSC-Regular";
  font-size: 10px;
  color: #185bbd;
  letter-spacing: 0;
  margin-bottom: 5px;
}
</style>
