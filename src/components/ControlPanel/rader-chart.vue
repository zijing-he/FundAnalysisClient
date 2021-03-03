<template>
  <div id="market_raderchart"></div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "ControlPanelRaderChart2",
  props: {
    value: Number,
    axis: String,
  },
  components: {},
  data() {
    return {
      svg: null,
      raderChart: null,
      margin: { top: 45, right: 120, bottom: 55, left: 55 },
      width: 165,
      height: 165,
      factor: 1,
      levels: 15,
      maxValue: 3,
      radians: 2 * Math.PI,
      color: d3.scaleLinear().domain([0, 1]).range(d3.schemeCategory10),
      dataScale: d3.scaleLinear().domain([1, 3]).range([-1, 1]), //数据映射
      data: [
        { axis: "unit_nav", value: 2.5 },
        { axis: "stock", value: 2.5 },
        { axis: "bond", value: 2.5 },
        { axis: "cash", value: 2.5 },
        { axis: "other", value: 2.5 },
        { axis: "size", value: 2.5 },
        { axis: "instl_weight", value: 2.5 },
        { axis: "alpha", value: 2.5 },
        { axis: "beta", value: 2.5 },
        { axis: "sharp_ratio", value: 2.5 },
        { axis: "information_ratio", value: 2.5 },
        { axis: "detail_car", value: 2.5 },
        { axis: "risk", value: 2.5 },
        { axis: "holding", value: 2.5 },
        { axis: "holding_values", value: 2.5 },
      ],
      dataValues: [],
      // minDataValues: [],
      // maxDataValues: [],
      allAxis: [],
      total: 0,
      radius: 0,
    };
  },
  watch: {
    value: function () {
      this.data.forEach((d) => {
        if (d.axis === this.axis) {
          d.value = this.value;
        }
      });
      this.svg.selectAll("polygon").remove();
      this.svg.selectAll(".nodes").remove();
      this.renderUpdate();
    },
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

      // 计算界限
      // this.data.forEach((d, i) => {
      //   this.minDataValues.push([
      //     (this.width / 2) *
      //       (1 -
      //         (1 / this.maxValue) * //1是min边界
      //           this.factor *
      //           Math.sin((i * this.radians) / this.total)),
      //     (this.height / 2) *
      //       (1 -
      //         (1 / this.maxValue) *
      //           this.factor *
      //           Math.cos((i * this.radians) / this.total)),
      //   ]);
      // });
      // this.data.forEach((d, i) => {
      //   this.maxDataValues.push([
      //     (this.width / 2) *
      //       (1 - this.factor * Math.sin((i * this.radians) / this.total)),
      //     (this.height / 2) *
      //       (1 - this.factor * Math.cos((i * this.radians) / this.total)),
      //   ]);
      // });

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
        .text((d) => d)
        .attr("id", (d) => "text_" + d)
        .style("font-family", "sans-serif")
        .style("font-size", "11px")
        .attr("text-anchor", "middle")
        .attr(
          "x",
          (d, i) =>
            (this.width / 2) *
            (1 - 1.2 * Math.sin((i * this.radians) / this.total))
        )
        .attr(
          "y",
          (d, i) =>
            (this.height / 2) *
            (1 - 1.2 * Math.cos((i * this.radians) / this.total))
        );

      // axis.select("#text_unit_nav").attr("dy","-1px");

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
        .attr("class", "area")
        .style("stroke-width", "1.5px")
        .style("stroke", "#5ABDB8")
        .style("fill", "#5ABDB8")
        .style("fill-opacity", 0.4)
        // .transition()
        // .duration(2000)
        .attr("points", str);

      let dragstarted = function (event, d) {
        d3.select(this).raise().attr("stroke", "black");
      };
      let move = function (event, d) {
        let width = 165;
        let height = 165;
        console.log(event);
        // console.log(d);
        const e = nodesGroup.nodes();
        const i = e.indexOf(this); //获取index
        this.parentNode.appendChild(this);
        let dragTarget = d3.select(this);

        //dragTarget.data()[0] == d
        let oldX = dragTarget.attr("cx"); //165是width
        let oldY = dragTarget.attr("cy"); //165是height

        //Bug for vector @ 270deg -Infinity/Infinity slope
        oldX = Math.abs(oldX) < 0.0000001 ? 0 : oldX;
        oldY = Math.abs(oldY) < 0.0000001 ? 0 : oldY;
        console.log(oldX, oldY);
        let raderGroup = d3.select("#raderChartGroup");
        raderGroup
          .append("circle")
          .attr("cx", oldX)
          .attr("cy", oldY)
          .attr("r", 3)
          .attr("fill", "red");

        let newY = 0,
          newX = 0,
          newValue = 0;
        let maxX = maxDataValues[i][0];
        let maxY = maxDataValues[i][1];

        // if (oldX === 0) {
        //   newY = oldY - event.dy;
        //   if (Math.abs(newY) > Math.abs(maxY)) {
        //     newY = maxY;
        //   }
        //   newValue = ((newY / oldY) * d.value).toFixed(2);
        // } else {
          let slope = oldY / oldX;

          newX = event.dx + dragTarget.attr("cx"); //测试是否为字符串？

          if (Math.abs(newX) > Math.abs(maxX)) {
            newX = maxX;
          }
          newY = newX * slope;

          console.log(newX,newY);
          raderGroup
          .append("circle")
          .attr("cx", newX)
          .attr("cy", newY)
          .attr("r", 3)
          .attr("fill", "blue");

          let ratio = newX / oldX;
          newValue = (ratio * d.value).toFixed(2);
        // }
        //Bound the drag behavior to the max and min of the axis, not by pixels but by value calc (easier)
        if (newValue >= 1 && newValue <= 3) {
          // dragTarget
          //   .attr("cx", (d.x = newX + width / 2))
          //   .attr("cy", (d.y = height / 2 - newY));

          //Updating the data set with the new value
          d.value = newValue;

          // updatePoly();
        } else {
          if (newValue <= 1) {
            newValue = 1;
          } else if (newValue >= 3) {
            newValue = 3;
          }
          console.log("越界了！");
          // dragTarget.on("drag", null);
          // dragTarget.call(d3.drag(), null);
        }

        d3.select(this)
          .attr("cx", (d.x = event.x))
          .attr("cy", (d.y = event.y));
      };
      let dragended = function (event, d) {
        d3.select(this).attr("stroke", null);
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
        .style("fill", this.color(0))
        .style("fill-opacity", 0.8)
        .call(
          d3
            .drag()
            .on("start", dragstarted)
            .on("drag", move)
            .on("end", dragended)
        );
    },
  },
};
</script>

<style scoped>
</style>