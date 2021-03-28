
<template>
  <!-- <h5>基金经理气泡图</h5> -->
  <div id="manager_bubble_chart_container">
    <a-row>
      <span id="manager_relation_text">Manager Exploration</span>
    </a-row>
    <a-row>
      <div id="manager_bubble_chart"></div>
    </a-row>
  </div>
</template>

<script>
import * as d3 from "d3";
import managerToIndex from "@/data/manager_index.json";
export default {
  name: "managerBubbleChart",
  props: {
    fundManagers: Object,
    selectedManager: Array,
    isRefresh: Number,
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
      priority: 1,
    };
  },
  watch: {
    fundManagers: function (value) {
      this.data = value;
      this.renderUpdate();
      // this.ClickUpdate();
    },
    isRefresh: function () {
      this.renderUpdate();
      // this.ClickUpdate();
    },
  },
  mounted: function () {
    // console.log("基金经理信息：", this.data);
    this.renderInit();
    this.renderUpdate();
    // this.ClickUpdate();
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
        .style("width", "200px")
        .style("max-height", "110px")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "11px")
        .style("color", "white");

      let showTooltip = (event, d) => {
        tooltip
          .style("visibility", "visible")
          .html(
            "Name: " +
              this.data[d].en_name +
              "<br /> ID: " +
              managerToIndex[d] +
              "<br /> Tenure: " +
              this.data[d].days
          )
          .style("left", event.layerX + 70 + "px")
          .style("top", event.layerY - 10 + "px");
      };

      let moveTooltip = (event) => {
        tooltip
          .style("left", event.layerX + 70 + "px")
          .style("top", event.layerY - 10 + "px");
      };

      let hideTooltip = (event) => {
        tooltip.style("visibility", "hidden");
      };
      let managerData = this.data;
      let _this = this;
      let showManagerFn = (d, isDelete) => {
        //function拿不到外面的this，就自己包装一下
        // console.log(d, isDelete);
        // _this.ClickUpdate(); //点击之后高亮
        if (!isDelete) {
          //是否删除
          this.showManagerArray.push(d);
          this.showManagerArray = Array.from(new Set(this.showManagerArray));
        } else {
          if (this.showManagerArray.indexOf(d) !== -1) {
            //删除d
            this.showManagerArray.splice(this.showManagerArray.indexOf(d), 1);
          }
        }
        //增加或删除后，都凸显最后一个！
        // this.Highlight();
        // console.log(this.showManagerArray);
        // this.$emit("showManager", d);
        console.log("showManagerArray1", this.showManagerArray);
        this.$emit(
          "showManager",
          this.showManagerArray,
          this.showManagerArray.length
        );
      };

      let clickTooltip = function (event, d) {
        // console.log("看managerData[d]['isShow']", managerData[d]["isShow"]);
        if (!managerData[d]["isShow"]) {
          managerData[d]["isShow"] = true; //点亮
          showManagerFn(d, false);
          d3.select(this)
            .raise()
            .style("fill", (d) => managerData[d].color);
        } else {
          //再点击关闭
          managerData[d]["isShow"] = false;
          showManagerFn(d, true);
          d3.select(this).style("fill", "#D8D8D8");
        }
      };

      this.svg.selectAll("g").remove();
      this.svg
        .selectAll(".manager_bubbles_rect")
        .data(this.managerId.filter((d) => this.data[d].other === true))
        .enter()
        .append("g")
        .append("rect")
        .attr("class", "manager_bubbles_rect")
        .attr("x", (d) => this.xScale(this.data[d].loc[0]))
        .attr("y", (d) => this.yScale(this.data[d].loc[1]))
        .attr("width", (d) => this.sizeScale(this.data[d].size) * 2)
        .attr("height", (d) => this.sizeScale(this.data[d].size) * 2)
        .style("fill", "#D8D8D8")
        .style("stroke", "white")
        .style("stroke-width", "0.5px")
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideTooltip)
        .on("click", clickTooltip);

      let managerCircles = this.svg
        .selectAll(".manager_bubbles_circle")
        .data(this.managerId.filter((d) => this.data[d].other === false))
        .enter()
        .append("g");

      managerCircles
        .append("circle")
        .attr("class", "manager_bubbles_circle")
        .attr("cx", (d) => this.xScale(this.data[d].loc[0]))
        .attr("cy", (d) => this.yScale(this.data[d].loc[1]))
        .attr("r", (d) => this.sizeScale(this.data[d].size))
        // .style("fill", (d) => this.data[d].color)
        .style("fill", (d) => {
          // console.log("this.managerId:", d);
          // console.log("this:", d3.select(this));
          if (this.selectedManager.indexOf(d) !== -1) {
            this.showManagerArray.push(d); //加入现在选的基金经理
            this.showManagerArray = Array.from(new Set(this.showManagerArray));
            this.data[d]["isShow"] = true;
            return managerData[d].color;
          }
          return "#D8D8D8";
        })
        .style("stroke", "white")
        .style("stroke-width", "0.5px")
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideTooltip)
        .on("click", clickTooltip);
      //预设高亮几个
      // console.log("现在的showManagerArray:", this.showManagerArray);
      this.$emit(
        "showManager",
        this.showManagerArray,
        this.showManagerArray.length
      );

      let topManager = managerCircles.filter((d) => {
        // console.log("circle:", d);
        if (this.showManagerArray.indexOf(d) !== -1) {
          return true;
        } else return false;
      });
      topManager.raise();

      //初次画完，凸显最后一个：
      // this.Highlight();
    },
    //加入到showArray的最后一个，重画一遍覆盖
    Highlight() {
      //每次只能有一个凸显，先清除掉之前冗余的
      d3.selectAll(".manager_bubbles_top_circle").remove();
      d3.selectAll(".manager_bubbles_top_rect").remove();

      //凸显出来的一层支持的事件
      let managerData = this.data;
      let _this = this;
      let showManagerFn = (d, isDelete) => {
        //function拿不到外面的this，就自己包装一下
        // console.log(d, isDelete);
        // _this.ClickUpdate(); //点击之后高亮
        if (!isDelete) {
          //是否删除
          this.showManagerArray.push(d);
          this.showManagerArray = Array.from(new Set(this.showManagerArray));
        } else {
          if (this.showManagerArray.indexOf(d) !== -1) {
            //删除d
            this.showManagerArray.splice(this.showManagerArray.indexOf(d), 1);
          }
        }
        //增加或删除后，都凸显最后一个！
        // this.Highlight();
        // console.log(this.showManagerArray);
        // this.$emit("showManager", d);
        // console.log("showManagerArray2", this.showManagerArray);
        this.$emit(
          "showManager",
          this.showManagerArray,
          this.showManagerArray.length
        );
      };

      let clickTooltip = function (event, d) {
        if (!managerData[d]["isShow"]) {
          managerData[d]["isShow"] = true; //点亮
          showManagerFn(d, false);
          d3.select(this).style("fill", (d) => managerData[d].color);
        } else {
          //再点击关闭
          managerData[d]["isShow"] = false;
          showManagerFn(d, true);
          d3.select(this).style("fill", "#D8D8D8");
        }
      };

      //高亮一层
      this.svg
        .append("g")
        .selectAll("dot")
        .data(
          this.managerId.filter((d) => {
            if (
              this.data[d].other === false &&
              this.showManagerArray.length > 0 &&
              d === this.showManagerArray[this.showManagerArray.length - 1]
            ) {
              return true;
            } else {
              return false;
            }
          })
        )
        .enter()
        .append("circle")
        .attr("class", "manager_bubbles_top_circle")
        .attr("cx", (d) => this.xScale(this.data[d].loc[0]))
        .attr("cy", (d) => this.yScale(this.data[d].loc[1]))
        .attr("r", (d) => this.sizeScale(this.data[d].size))
        .style("fill", (d) => this.data[d].color)
        // .style("fill", "black")
        .style("stroke", "white")
        .style("stroke-width", "0.5px")
        // .on("mouseover", showTooltip)
        // .on("mousemove", moveTooltip)
        // .on("mouseleave", hideTooltip)
        .on("click", clickTooltip); //凸显出来的也要只支持删除！

      this.svg
        .append("g")
        .selectAll("dot")
        .data(
          this.managerId.filter((d) => {
            if (
              this.data[d].other === true &&
              this.showManagerArray.length > 0 &&
              d === this.showManagerArray[this.showManagerArray.length - 1]
            ) {
              return true;
            } else {
              return false;
            }
          })
        )
        .enter()
        .append("rect")
        .attr("class", "manager_bubbles_top_rect")
        .attr("x", (d) => this.xScale(this.data[d].loc[0]))
        .attr("y", (d) => this.yScale(this.data[d].loc[1]))
        .attr("width", (d) => this.sizeScale(this.data[d].size) * 2)
        .attr("height", (d) => this.sizeScale(this.data[d].size) * 2)
        // .style("fill", (d) => this.data[d].color)
        .style("fill", "black")
        .style("stroke", "white")
        .style("stroke-width", "0.5px")
        // .on("mouseover", showTooltip)
        // .on("mousemove", moveTooltip)
        // .on("mouseleave", hideTooltip)
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