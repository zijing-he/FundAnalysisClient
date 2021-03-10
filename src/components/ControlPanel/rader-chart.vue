<template>
  <div id="market_raderchart"></div>
  <div class="update_value"></div>
</template>

<script>
import * as d3 from "d3";
import nameDictionary from "@/data/RaderChart/weight_key.json";
export default {
  name: "ControlPanelRaderChart2",

  components: {},
  emits: ["updateUserData"],

  data() {
    return {
      svg: null,
      raderChart: null,
      margin: { top: 45, right: 152, bottom: 60, left: 70 },
      width: 200,
      height: 200,
      factor: 1,
      levels: 15,
      maxValue: 3,
      radians: 2 * Math.PI,
      data: [
        { axis: "size", value: 2.5 },
        { axis: "instl_weight", value: 2.5 },
        { axis: "alpha", value: 2.5 },
        { axis: "beta", value: 2.5 },
        { axis: "sharp_ratio", value: 2.5 },
        { axis: "max_drop_down", value: 2.5 },
        { axis: "information_ratio", value: 2.5 },
        { axis: "risk", value: 2.5 },
        { axis: "one_quarter_return", value: 2.5 },
        { axis: "one_year_return", value: 2.5 },
        { axis: "three_year_return", value: 2.5 },
        { axis: "one_quarter_car", value: 2.5 },
        { axis: "one_year_car", value: 2.5 },
        { axis: "three_year_car", value: 2.5 },
      ],
      dataValues: [],
      allAxis: [],
      total: 0,
      radius: 0,
    };
  },
  watch: {
  },
  mounted: function () {
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
      this.allAxis = this.data.map((d) => d.axis);
      this.maxValue = Math.max(
        this.maxValue,
        d3.max(this.data, (d) => d.value)
      );
      this.total = this.allAxis.length;
      this.radius = this.factor * Math.min(this.width / 2, this.height / 2);

      this.svg = d3
        .select("#market_raderchart")
        .append("svg")
        .attr("width", this.width + this.margin.right)
        .attr("height", this.height + this.margin.bottom)
        .append("g")
        .attr("transform", `translate(${this.margin.left},${this.margin.top})`);

      this.raderChart = this.svg.append("g").attr("id", "raderChartGroup");

      // 生成环
      // for (let i = 0; i < this.levels; i++) {
      for (let i = 9; i < 10; i++) {
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
          .style("stroke", "#bbb")
          .style("stroke-opacity", "0.75")
          .style("stroke-width", "1px")
          .attr("stroke-dasharray", "2,2")
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
        .attr(
          "x1",
          (d, i) =>
            (this.width / 2) *
            (1 -
              0.33 * //比例
                this.factor *
                Math.sin((i * this.radians) / this.total))
        )
        .attr(
          "y1",
          (d, i) =>
            (this.height / 2) *
            (1 - 0.33 * this.factor * Math.cos((i * this.radians) / this.total))
        )
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
        .style("stroke", "#D5D5D5")
        .style("stroke-width", "1px");

      axis
        .append("text")
        .text((d) => nameDictionary[d].cn_name)
        .attr("id", (d) => "text_" + d)
        .style("font-family", "sans-serif")
        .style("font-size", "11px")
        .attr("text-anchor", "middle")
        .attr("dy", "1.5em")
        .attr("transform", "translate(3,-12)")
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

      this.raderChart.attr("transform", "translate(-6,-16)");
    },
    renderUpdate() {
      let maxDataValues = [];
      //计算value的坐标
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
        .selectAll(".area")
        .data([this.dataValues])
        .enter()
        .append("polygon")
        .attr("class", "radar-chart-area")
        .attr("id", "radar-chart-area")
        .style("stroke-width", "2px")
        .style("stroke", "#d62728")
        .style("fill", "#d62728")
        .style("fill-opacity", 0.2)
        .attr("points", str);

      let dragstarted = function (event, d) {
        d3.select(this).raise().attr("stroke", "black");
        d3.select(".update_value_weight")
          .text(nameDictionary[d.axis].cn_name)
          .style("margin-top", "8px");
        if (nameDictionary[d.axis].cn_name.length <= 5) {
          d3.select(".update_value_weight").style("margin-top", "16px");
        }
         d3.select(".update_value_value")
            .text(d.value-2)
            .style("display", "block")
            .style("text-align", "center");
          
        toolTip.style("visibility", "visible");
      };
      let move = function (event, d) {
        let width = 200; //this.width更新，这儿也要更新
        let height = 200;
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
          //更新数值

          d3.select(".update_value_value")
            .text((newValue - 2).toFixed(2))
            .style("display", "block")
            .style("text-align", "center")
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
      };

      let dragended = function (event, d) {
        d3.select(this).attr("stroke", null);
        toolTip.style("visibility", "hidden");
        // d3.select(".update_value_value").style("visibility", "hidden");
      };
      let nodesGroup = this.raderChart
        .append("g")
        .selectAll(".nodes")
        .data(this.data)
        .enter()
        .append("circle")
        .attr("class", "nodes")
        .attr("r", 3)
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
        .style("fill", "#d62728")
        .style("fill-opacity", 0.75)
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
        .style("margin-top", "14px");
      toolTip.append("g").attr("class", "update_value_value");
      toolTip.style("visibility", "hidden");
    },
  },
};
</script>

<style scoped>
.update_value {
  position: absolute;
  left: 171px;
  top: 95.5px;
  width: 66px;
  height: 66px;
  background-color: #a8a8a8;
  color: white;
  border-radius: 50%;
  opacity: 1;
  z-index: 1;
}
</style>