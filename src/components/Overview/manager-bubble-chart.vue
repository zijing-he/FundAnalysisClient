
<template>
  <!-- <h5>基金经理气泡图</h5> -->
  <div id="manager_bubble_chart_container">
    <a-row>
      <span id="manager_relation_text">Manager relation</span>
    </a-row>
    <a-row>
      <div id="manager_bubble_chart"></div>
    </a-row>
  </div>
</template>

<script>
import * as d3 from "d3";
export default {
  name: "managerBubbleChart",
  props: {
    fundManagers: Object,
  },
  components: {},
  data() {
    return {
      svg: null,
      width: 165,
      height: 165,
      margin: { top: 20, right: 20, bottom: 20, left: 20 },
      data: this.fundManagers,
      name: [],
      managerId: [],
      showManagerArray: [],
    };
  },
  watch: {
    fundManagers: function (value) {
      this.data = value;
      this.renderUpdate();
    },
  },
  mounted: function () {
    // console.log("基金经理信息：", this.data);
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
        .domain(d3.extent(this.managerId, (d) => this.data[d].loc[0]))
        .range([0, this.innerWidth])
        .nice();
    },
    yScale() {
      return d3
        .scaleLinear()
        .domain(d3.extent(this.managerId, (d) => this.data[d].loc[1]))
        .range([this.innerHeight, 0])
        .nice();
    },
    sizeScale() {
      return d3
        .scaleLinear()
        .domain(d3.extent(this.managerId, (d) => this.data[d].size))
        .range([3, 13]);
    },
  },
  emits: ["showManager"],
  methods: {
    renderInit() {
      this.svg = d3
        .select("#manager_bubble_chart")
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("viewBox", [0, 0, this.width, this.height])
        .append("g")
        .attr("transform", `translate(${this.margin.left},${this.margin.top})`);
    },
    renderUpdate() {
       this.showManagerArray = [];
      this.managerId = Object.keys(this.data);
      let tooltip = d3
        .select("#manager_bubble_chart")
        .append("div")
        .style("position", "absolute")
        // .style("opacity", 0)
        .attr("class", "tooltip")
        .style("visibility", "hidden")
        .style("width", "150px")
        .style("height", "90px")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "11px")
        .style("color", "white");

      let showTooltip = (event, d) => {
        tooltip
          .style("visibility", "visible")
          .html(
            "基金经理：" +
              this.data[d].cn_name +
              "<br /> 经理ID：" +
              d +
              "<br /> 任职天数：" +
              this.data[d].days
          )
          .style("left", event.pageX - 850 + "px")
          .style("top", event.pageY - 100 + "px");
      };

      let moveTooltip = (event) => {
        tooltip
          .style("left", event.pageX - 850 + "px")
          .style("top", event.pageY - 100 + "px");
      };

      let hideTooltip = (event) => {
        tooltip.style("visibility", "hidden");
      };
      let managerData = this.data;
      let showManagerFn = (d, isDelete) => {
        //function拿不到外面的this，就自己包装一下
        // console.log(d, isDelete);
        if (!isDelete) {
          //是否删除
          this.showManagerArray.push(d);
        } else {
          if (this.showManagerArray.indexOf(d) !== -1) {
            //删除d
            this.showManagerArray.splice(this.showManagerArray.indexOf(d), 1);
          }
        }
        // console.log(this.showManagerArray);
        // this.$emit("showManager", d);
        this.$emit("showManager", this.showManagerArray,this.showManagerArray.length);
      };

      let clickTooltip = function (event, d) {
        // console.log("看managerData[d]['isShow']", managerData[d]["isShow"]);
        if (!managerData[d]["isShow"]) {
          managerData[d]["isShow"] = true; //点亮
          d3.select(this).style("fill", (d) => managerData[d].color);
          showManagerFn(d, false);
        } else {
          //再点击关闭
          managerData[d]["isShow"] = false;
          d3.select(this).style("fill", "#D8D8D8");
          showManagerFn(d, true);
        }
      };

      this.svg.selectAll("circle").remove();
      this.svg
        .append("g")
        .selectAll("dot")
        .data(this.managerId)
        .enter()
        .append("circle")
        .attr("class", "manager_bubbles")
        .attr("cx", (d) => this.xScale(this.data[d].loc[0]))
        .attr("cy", (d) => this.yScale(this.data[d].loc[1]))
        .attr("r", (d) => this.sizeScale(this.data[d].size))
        // .style("fill", (d) => this.data[d].color)
        .style("fill", "#D8D8D8")
        .style("stroke", "white")
        .style("stroke-width", "0.5px")
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideTooltip)
        .on("click", clickTooltip);
    },
  },
};
</script>

<style scoped>
#manager_bubble_chart_container {
  border-right: 1px dashed #979797;
  height: 190px;
  width: 247px;
  margin-bottom: 10px;
  text-align: center;
}
#manager_bubble_chart {
  height: 165px;
  width: 165px;
  margin: auto;
}
#manager_relation_text {
  font-family: "PingFangSC-Medium";
  font-size: 15px;
  width: 100%;
  /* margin:auto; */
  /* font-weight: 600; */
  /* line-height: 32px; */
  color: #4b4b4b;
  letter-spacing: -0.22px;
  /* margin-left: 28px; */
  /* margin-top: 10px; */
}
/* h5 {
  margin-bottom: 0;
} */
</style>