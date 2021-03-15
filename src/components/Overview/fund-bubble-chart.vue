<template>
  <div
    id="fund_bubble_chart_inner_container"
    class="fund_bubble_chart_inner_container"
  >
    <div class="text">{{ date }}</div>
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
  },
  components: {},
  watch: {
    quarterFundData: function (fundData) {
      // this.renderUpdate();
    },
    mangerId: function () {
      // this.renderUpdate();
    },
  },
  data() {
    return {
      svg: null,
      width: 200,
      height: 180,
      margin: { top: 20, right: 20, bottom: 20, left: 20 },
      data: null,
      data_values: [],
      fund_id: [],
      managersKey: [],
      G: null,
    };
  },
  mounted: function () {
    console.log(this.date);
    console.log(this.quarterFundData);
    console.log(this.fundManagers);
    // console.log(this.managerGruop);
    this.graphInit();
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
      // let managerGruop = {};

      for (let id in this.quarterFundData) {
        this.G.addNode(id, {
          managerId: this.quarterFundData[id].manager_ids,
          x: this.quarterFundData[id].loc[0],
          y: this.quarterFundData[id].loc[1],
        });
        // this.quarterFundData[id].manager_ids.forEach((d) => {
        //   if (!Object.prototype.hasOwnProperty.call(managerGruop, `${d}`)) {
        //     managerGruop[d] = [];
        //   }
        //   managerGruop[d].push(id);
        // });
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
      // console.log(this.G.nodes(true));
      // console.log(this.G.edges(true));
      // console.log(this.G);
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
      this.data = this.quarterFundData;
      this.data_values = Object.values(this.quarterFundData);
      // this.fund_id = Object.keys(this.quarterFundData);
      // this.data_values.forEach((d) => {
      //   this.managers.push(d.manager_id[0]);
      // });
      // this.managersKey = Object.keys(this.fundManagers);
      this.svg.selectAll("circle").remove();

      let node = this.svg
        .selectAll("circle")
        .data(this.G.nodes(true)) // this.G.nodes(true)
        .enter()
        .append("circle")
        .attr("class", (d) => `funds_manager_${d[1].managerId[0]}`) //展示时注意：可能一个基金有多个基金经理
        .attr("r", 10)
        .style("fill", (d) => {
          if (this.fundManagers[d[1].managerId[0]]) {
            return this.fundManagers[d[1].managerId[0]].color;
          } else {
            return "#aaa";
          }
        })
        .style("opacity","0.4")
        .attr("cx", (d) => {
          // console.log(d);

          return this.xScale(d[1].x);
        })
        .attr("cy", (d) => this.yScale(d[1].y));

      let link = this.svg
        .selectAll("line")
        .data(this.G.edges(true)) //this.G.edges(true)
        .enter()
        .append("line")
        .attr("class", (d) => `funds_manager_${d[2].managerId}`) 
        .style("stroke", (d) => {
          console.log(d, d[2].managerId, this.fundManagers[d[2].managerId]);
          if (this.fundManagers[d[2].managerId]) {
            return this.fundManagers[d[2].managerId].color;
          } else return "#aaa";
        })
        .style("stroke-width", "16")
        .style("opacity","0.4")
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
      //   .style("stroke", (d) =>
      //     d.new == true || d.delete == true ? "black" : "none"
      //   )
      //   // d.new == true : "特殊操作" ? "默认"
      //   .style("stroke-dasharray", (d) => (d.new == true ? "2" : "0"))
      //   .style("fill-opacity", (d) => (d.delete == true ? "0.5" : "1"));
    },
  },
};
</script>

<style scoped>
h5 {
  margin-bottom: 0;
}
.fund_bubble_chart_inner_container {
  position: relative;
  height: 200px;
  width: 200px;
  flex-shrink: 0;
  margin-right: 30px;
  margin-top: 5px;
  border: 1px solid black;
}
.text {
  width: 200px;
  height: 20px;
  text-align: center;
  font-size: 13px;
}
</style>
