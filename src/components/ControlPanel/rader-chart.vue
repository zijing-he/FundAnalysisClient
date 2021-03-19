<template>
  <div id="market_raderchart"></div>
  <div class="update_value"></div>
</template>

<script>
import * as d3 from "d3";
import nameDictionary from "@/data/weight_key.json";
export default {
  name: "ControlPanelRaderChart2",
  props: {
    proData: Array,
  },
  components: {},
  emits: ["updateUserData"],

  data() {
    return {
      svg: null,
      raderChart: null,
      margin: { top: 35, right: 265, bottom: 94, left: 70 },
      width: 260,
      height: 260,
      factor: 1,
      levels: 6,
      maxValue: 3,
      radians: 2 * Math.PI,
      data: this.proData,
      dataValues: [],
      allAxis: [],
      total: 0,
      radius: 0,
    };
  },
  watch: {
    proData: function (value) {
      this.data = value;
      this.svg.selectAll("g").remove();
      this.renderInit();
      this.renderUpdate();
    },
  },
  mounted: function () {
    // console.log(this.data);
    this.svg = d3
      .select("#market_raderchart")
      .append("svg")
      .attr("width", this.width + this.margin.right)
      .attr("height", this.height + this.margin.bottom)
      .append("g")
      .attr("transform", `translate(${this.margin.left},${this.margin.top})`);
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
      //计算画雷达图所需的参数
      this.allAxis = this.data.map((d) => d.axis);
      this.maxValue = Math.max(
        this.maxValue,
        d3.max(this.data, (d) => d.value)
      );
      this.total = this.allAxis.length;
      this.radius = this.factor * Math.min(this.width / 2, this.height / 2);

      this.raderChart = this.svg.append("g").attr("id", "raderChartGroup");

      // 生成环
      for (let i = 1; i < this.levels; i++) {
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
          .style("stroke", () => {
            // if (i === 3) return "red";
            // else
            return "#979797";
          })
          .style("stroke-opacity", "0.56")
          .style("stroke-width", "1px")
          .attr("stroke-dasharray", () => {
            if (i === 3) return "0";
            else return "4";
          })
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
        // .attr(
        //   "x1",
        //   (d, i) =>
        //     (this.width / 2) *
        //     (1 -
        //       0.33 * //比例
        //         this.factor *
        //         Math.sin((i * this.radians) / this.total))
        // )
        // .attr(
        //   "y1",
        //   (d, i) =>
        //     (this.height / 2) *
        //     (1 - 0.33 * this.factor * Math.cos((i * this.radians) / this.total))
        // )
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
        .style("stroke", "#979797")
        .style("opacity", "0.56")
        .style("stroke-width", (d, i) => {
          if (i % 2) return "0px";
          else return "1px";
        })
        .style("stroke-dasharray", "4");

      axis
        .append("text")
        .text((d) => nameDictionary[d].en_sx)
        .attr("id", (d) => "text_" + d)
        .style("font-family", "PingFangSC-Regular")
        .style("font-size", "14px")
        .attr("text-anchor", "middle")
        .style("fill", "#939393")
        .attr("dy", "1.5em")
        .attr("transform", "translate(3,-15)")
        .attr(
          "x",
          (d, i) =>
            (this.width / 2) *
              (1 - 0.85 * Math.sin((i * this.radians) / this.total)) -
            50 * Math.sin((i * this.radians) / this.total)
        )
        .attr(
          "y",
          (d, i) =>
            (this.height / 2) *
              (1 - Math.cos((i * this.radians) / this.total)) -
            20 * Math.cos((i * this.radians) / this.total)
        );

      this.raderChart.attr("transform", "translate(28,0)");

      axis.select("#text_sharp_ratio").attr("transform", "translate(-10,-10)");
      axis
        .select("#text_information_ratio")
        .attr("transform", "translate(35,-10)");
      axis.select("#text_instl_weight").attr("transform", "translate(50,-35)");
      axis.select("#text_risk").attr("transform", "translate(-20,-5)");
      
      axis.select("#text_max_drop_down").attr("transform", "translate(-15,-12)");
    
      axis.select("#text_size").attr("transform", "translate(20,-28)");
      axis
        .select("#text_three_year_return")
        .attr("transform", "translate(-12,-18)");
      axis
        .select("#text_one_year_return")
        .attr("transform", "translate(0,-26)");
      axis
        .select("#text_one_quarter_return")
        .attr("transform", "translate(0,-20)");
      axis.select("#text_beta").attr("transform", "translate(8,-18)");
      axis.select("#text_alpha").attr("transform", "translate(13,-5)");
    },
    renderUpdate() {
      let maxDataValues = [];
      //计算value的坐标
      this.dataValues = [];
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
        maxDataValues.push([
          (this.width / 2) *
            (1 - this.factor * Math.sin((i * this.radians) / this.total)),
          (this.height / 2) *
            (1 - this.factor * Math.cos((i * this.radians) / this.total)),
        ]);
      });

      let str = "";
      for (let i = 0; i < this.dataValues.length; i++) {
        str = str + this.dataValues[i][0] + "," + this.dataValues[i][1] + " ";
      }

      this.raderChart
        .append("g")
        .selectAll(".area")
        .data([this.dataValues])
        .enter()
        .append("polygon")
        .attr("class", "radar-chart-area")
        .attr("id", "radar-chart-area")
        .style("stroke-width", "3px")
        .style("stroke", "#50A1FF")
        .style("fill", "rgba(80,161,255,0.10)")
        // .style("fill-opacity", 0.2)
        .attr("points", str);

      let dragstarted = function (event, d) {
        d3.select(this).raise().attr("r", "8px").style("opacity", "0.8");
        d3.select(".update_value_weight").text((d.value - 2).toFixed(2));
        // .style("fill", "#FFFFFF")
        // if (nameDictionary[d.axis].en_sx.length <= 5) {
        //   d3.select(".update_value_weight").style("margin-top", "16px");
        // }
        // d3.select(".update_value_value")
        //   .text(d.value - 2)
        //   .style("display", "block")
        //   .style("text-align", "center");
      };
      let move = function (event, d) {
        let width = 260; //this.width更新，这儿也要更新
        let height = 260;
        const e = nodesGroup.nodes();
        const i = e.indexOf(this); //获取index
        let dragTarget = d3.select(this);

        let oldX = parseFloat(dragTarget.attr("cx")) - width / 2;
        let oldY = height / 2 - parseFloat(dragTarget.attr("cy"));
        oldX = Math.abs(oldX) < 0.0000001 ? 0 : oldX;
        oldY = Math.abs(oldY) < 0.0000001 ? 0 : oldY;

        let newY = 0,
          newX = 0,
          newValue = 0;
        let maxX = maxDataValues[i][0] - width / 2;
        let maxY = height / 2 - maxDataValues[i][1];

        if (oldX === 0) {
          newY = oldY - event.dy;
          if (Math.abs(newY) > Math.abs(maxY)) {
            newY = maxY;
          }
          newValue = ((newY / oldY) * d.value).toFixed(2);
        } else {
          let slope = oldY / oldX;

          newX = event.dx + parseFloat(dragTarget.attr("cx")) - width / 2;

          if (Math.abs(newX) > Math.abs(maxX)) {
            newX = maxX;
          }
          newY = newX * slope;

          let ratio = newX / oldX;
          newValue = (ratio * d.value).toFixed(2);
        }
        //Bound the drag behavior to the max and min of the axis, not by pixels but by value calc (easier)
        if (newValue >= 1 && newValue <= 3) {
          dragTarget.attr("cx", newX + width / 2).attr("cy", height / 2 - newY);

          d.value = newValue;

          toolTip
            .style("left", newX + width / 2 + 75 + "px")
            .style("top", height / 2 - newY - 20 + "px")
            .style("visibility", "visible");
          d3.select(".update_value_weight").text((newValue - 2).toFixed(2));

          // d3.select(".update_value_value")
          //   .text((newValue - 2).toFixed(2))
          //   .style("display", "block")
          //   .style("text-align", "center");
          // .style("visibility", "visible");

          updatePoly();
        } else {
          if (newValue <= 1) {
            newValue = 1;
          } else if (newValue >= 3) {
            newValue = 3;
          }
        }
      };

      let updatePoly = () => {
        this.dataValues = [];
        let userData = {};
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
          userData[d.axis] = (parseFloat(d.value) - 2).toFixed(4);
        });

        let str = "";
        for (let i = 0; i < this.dataValues.length; i++) {
          str = str + this.dataValues[i][0] + "," + this.dataValues[i][1] + " ";
        }
        this.raderChart
          .select("#radar-chart-area")
          .data([this.dataValues])
          .attr("points", str);

        //传数据
        this.$emit("updateUserData", userData);
        //   setTimeout(() => {
        //   this.$emit("updateUserData", userData);
        // }, 1000);
      };

      let dragended = function (event, d) {
        d3.select(this).style("r", "3.5px").style("opacity", "1");
        toolTip.style("visibility", "hidden");
        // d3.select(".update_value_value").style("visibility", "hidden");
      };
      let nodesGroup = this.raderChart
        .append("g")
        .attr("id", "nodesGroup")
        .selectAll(".nodes")
        .data(this.data)
        .enter()
        .append("circle")
        .attr("class", "nodes")
        .attr("r", "3.5px")
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
        .style("fill", "#50A1FF")
        // .style("fill-opacity", 0.75)
        .style("cursor", "pointer")
        .call(
          d3
            .drag()
            .on("start", dragstarted)
            .on("drag", move)
            .on("end", dragended)
        );
      //添加中心数值查看框

      let toolTip = d3.select(".update_value");
      toolTip
        .append("g")
        .attr("class", "update_value_weight")
        .style("display", "block")
        .style("text-align", "center")
        .style("font-size", "11px")
        // .style("margin-top", "14px")
        .style("font-family", "PingFangSC-Regular");
      // toolTip.append("g").attr("class", "update_value_value");
      toolTip.style("visibility", "hidden");
    },
  },
};
</script>

<style scoped>
.update_value {
  position: absolute;
  background-image: linear-gradient(-153deg, #f15887 0%, #fe9b86 100%);
  width: 44px;
  height: 25px;

  top: 130px;
  left: 200px;

  padding: 5px 8px;
  display: inline-block;
  border-radius: 4px;
  margin: 10px 0 10px 10px;
  /* position: relative; */
}
.update_value::after {
  content: "";
  border: 4px solid #edf5ff;
  border-top: 5px solid #fc8d87;
  position: absolute;
  right: 27px;
  top: 25px;
}
</style>