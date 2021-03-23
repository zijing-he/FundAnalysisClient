<template>
  <div
    ref="fund_pie_chart_container"
    class="fund_pie_chart_inner_container"
    :style="autoLeft"
  >
    <div class="text">{{ thisDate }}</div>
    <div id="fund_pie_chart_item" class="fund_pie_chart_item"></div>
  </div>
</template>

<script>
import * as d3 from "d3";
var jsnx = require("jsnetworkx");
export default {
  name: "fundPieChart",
  props: {
    date: String,
    quarterFundData: Object, //该季度，基金的位置
    fundManagers: Object, //经理的位置与颜色
    managerGruop: Object, //该季度，每个经理手下的基金
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

    showManagerIdLength: function (value) {
      //watch无法监测数组length的长度
      // console.log("最终的变化,", this.showManagerId, value);
      this.graphInit();
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
      thisDate: `${this.date.substring(0, 4)}-${this.date.substring(
        4,
        6
      )}-${this.date.substring(6)}`,
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
        //遍历每只基金
        let strData = "";
        let colorArray = [];
        this.quarterFundData[id].manager_ids.forEach((manager) => {
          if (
            this.showManagerIdLength &&
            this.showManagerId.indexOf(manager) !== -1
          ) {
            //这个基金的基金经理在showArray里
            if (strData.length === 0) strData += "1";
            else strData += "-1";
            colorArray.push(this.fundManagers[manager].color);
          }
        });
        // console.log("基金：",id,strData,colorArray);
        this.G.addNode(id, {
          managerId: this.quarterFundData[id].manager_ids,
          x: this.quarterFundData[id].loc[0],
          y: this.quarterFundData[id].loc[1],
          // new: this.quarterFundData[id]["new"],
          // delete: this.quarterFundData[id]["delete"],
          other: this.quarterFundData[id]["other"],
          data: JSON.parse(JSON.stringify(strData)), //d3.pie()算弧长的参考值：目前点击了几个基金经理
          color: JSON.parse(JSON.stringify(colorArray)), //存放点击了的基金经理的id
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
        .select("#fund_pie_chart_item")
        .attr("id", "fund_pie_chart_item_" + this.date)
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
      this.svg.selectAll("g").remove();
      this.data_values = Object.values(this.quarterFundData);
      //tooltip
      let tooltip = d3
        .select(`#fund_pie_chart_item_${this.date}`)
        .append("div")
        .style("position", "absolute")
        .attr("class", "tooltip")
        // .style("visibility", "hidden")
        .style("width", "150px")
        .style("height", "50px")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "15px")
        .style("color", "white");
      let showTooltip = (event, d) => {
        tooltip
          .style("width", "150px")
          .style("height", "50px")
          .style("visibility", "visible")
          .html("fundID: " + d.id)
          .style("left", event.layerX + 10 + "px")
          .style("top", event.layerY - 30 + "px");
      };

      let moveTooltip = (event) => {
        tooltip
          .style("left", event.layerX + 10 + "px")
          .style("top", event.layerY - 30 + "px");
      };

      let hideTooltip = (event) => {
        tooltip.style("visibility", "hidden");
      };

      //pieChart
      let pie = d3.pie().value((d) => d);
      let radius = 6;
      let arc = d3.arc().innerRadius(0).outerRadius(radius);
      let points = this.svg
        .selectAll("g")
        .data(this.G.nodes(true))
        .enter()
        .append("g")
        .attr(
          "transform",
          (d) => `translate(${this.xScale(d[1].x)},${this.yScale(d[1].y)})`
        )
        .attr("class", "pies");

      let pies = points
        .selectAll(".pies")
        .data((d) => {
          let res = pie(d[1].data.split("-"));
          // console.log(" d[1].other:",d[1].other)
          if (res.length === 1 && res[0].data.length === 0) {
            //没有被选中，画灰色
            res[0].id = d[0];
            res[0].endAngle = 6.283185307179586;
            res[0].value = 1;
            res[0].color = ["#D8D8D8"];
            d[1].color.push("#D8D8D8");
            res[0].other = d[1].other;
          } else if (res.length >= 1) {
            res.forEach((dd) => {
              dd.id = d[0];
              dd.color = JSON.parse(JSON.stringify(d[1].color));
              dd.other = d[1].other;
            });
          }
          // console.log("d:", d, res);
          return res;
        })
        .enter()
        .append("g")
        .attr("class", "arc")
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideTooltip);

      pies
        .append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => {
          // console.log("d,i:", d, i);
          return d.color[i];
        })
        .style("stroke", (d) => (d.other === true ? "black" : "none"))
        // d.new == true : "特殊操作" ? "默认"
        .style("stroke-dasharray", (d) => (d.other === true ? "2 2" : "0"));

      //画圆
      // this.svg
      //   .append("g")
      //   .selectAll("circle")
      //   .data(this.G.nodes(true)) // this.G.nodes(true)
      //   .enter()
      //   .append("circle")
      //   // .attr("class", (d) => `funds_manager_${d[1].managerId[0]}`) //展示时注意：可能一个基金有多个基金经理
      //   .attr("r", 6)
      //   .style("fill", (d) => {
      //     // console.log("点d：", d);
      //     //点只展示目前点击的基金经理的颜色
      //     for (let id of d[1].managerId) {
      //       // if (id === this.showManagerId) {
      //       if (
      //         this.showManagerIdLength &&
      //         this.showManagerId.indexOf(id) !== -1
      //       ) {
      //         // return this.fundManagers[this.showMangerId].color;
      //         return this.fundManagers[
      //           this.showManagerId[this.showManagerId.indexOf(id)]
      //         ].color;
      //       }
      //     }

      //     return "#D8D8D8";
      //   })
      //   .style("stroke", (d) =>
      //     d[1].new == true || d[1].delete == true ? "black" : "none"
      //   )
      //   // d.new == true : "特殊操作" ? "默认"
      //   .style("stroke-dasharray", (d) =>
      //     d[1].new == true || d[1].delete == true ? "2" : "0"
      //   )

      //   .attr("cx", (d) => this.xScale(d[1].x))
      //   .attr("cy", (d) => this.yScale(d[1].y));
      let showLineTooltip = (event, d) => {
        // console.log(d);
        tooltip
          .style("visibility", "visible")
          .style("width", "150px")
          .style("height", "70px")
          .html("fundManagerID: " + d[2].managerId)
          .style("left", event.layerX + 10 + "px")
          .style("top", event.layerY - 30 + "px");
      };

      let moveLineTooltip = (event) => {
        tooltip
          .style("left", event.layerX + 10 + "px")
          .style("top", event.layerY - 30 + "px");
      };

      let hideLineTooltip = (event) => {
        tooltip.style("visibility", "hidden");
      };

      //画边
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
        .attr("y2", (d) => this.yScale(d[2].target.y))
        .on("mouseover", showLineTooltip)
        .on("mousemove", moveLineTooltip)
        .on("mouseleave", hideLineTooltip);
    },
  },
};
</script>

<style scoped>
.fund_pie_chart_inner_container {
  position: relative;
  height: 176px;
  width: 157.766px;
  flex-shrink: 0;
  /* border: 1px dashed #979797; */
}
.fund_pie_chart_inner_container .fund_pie_chart_item {
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
