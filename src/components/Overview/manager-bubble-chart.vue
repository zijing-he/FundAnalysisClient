
<template>
  <h5>基金经理气泡图</h5>
  <div id="manager_bubble_chart"></div>
</template>

<script>
import * as d3 from "d3";
export default {
  name: "managerBubbleChart",
  props: {
    date: String,
  },
  components: {},
  data() {
    return {
      svg: null,
      width: 198.6,
      height: 134,
      margin: { top: 20, right: 20, bottom: 20, left: 20 },
      data: {
        张坤: {
          x: 500,
          y: 720,
          number: 5,
        },
        朱少醒: {
          x: 150,
          y: 270,
          number: 3,
        },
        孙迪: {
          x: 340,
          y: 730,
          number: 12,
        },
        郑澄然: {
          x: 390,
          y: 540,
          number: 7,
        },
        闰思倩: {
          x: 500,
          y: 423,
          number: 3,
        },
        葛兰: {
          x: 230,
          y: 870,
          number: 7,
        },
        任琳娜: {
          x: 600,
          y: 290,
          number: 1,
        },
        李瑞: {
          x: 400,
          y: 90,
          number: 6,
        },
        董承飞: {
          x: 80,
          y: 390,
          number: 3,
        },
        童兰: {
          x: 235,
          y: 560,
          number: 2,
        },
        姚志鹏: {
          x: 420,
          y: 200,
          number: 8,
        },
        闰东: {
          x: 120,
          y: 600,
          number: 4,
        },
        张羽翔: {
          x: 262,
          y: 740,
          number: 16,
        },
        王园园: {
          x: 600,
          y: 240,
          number: 7,
        },
        候昊: {
          x: 210,
          y: 540,
          number: 9,
        },
        沙川: {
          x: 430,
          y: 150,
          number: 13,
        },
        刘涛: {
          x: 123,
          y: 530,
          number: 15,
        },
        李游: {
          x: 582,
          y: 472,
          number: 8,
        },
        蔡嵩松: {
          x: 212,
          y: 592,
          number: 2,
        },
        赵诣: {
          x: 712,
          y: 912,
          number: 4,
        },
        董季周: {
          x: 409,
          y: 821,
          number: 3,
        },
        郑泽鸿: {
          x: 129,
          y: 542,
          number: 1,
        },
        郑巍山: {
          x: 320,
          y: 282,
          number: 4,
        },
        李轩: {
          x: 179,
          y: 882,
          number: 1,
        },
      },
      name: [],
    };
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
    xScale() {
      return d3
        .scaleLinear()
        .domain(d3.extent(this.name, (d) => this.data[d].x))
        .range([0, this.innerWidth])
        .nice();
    },
    yScale() {
      return d3
        .scaleLinear()
        .domain(d3.extent(this.name, (d) => this.data[d].y))
        .range([this.innerHeight, 0])
        .nice();
    },
    numberScale() {
      return d3
        .scaleLinear()
        .domain(d3.extent(this.name, (d) => this.data[d].number))
        .range([3, 10]);
    },
    colorScale() {
      return d3.scaleOrdinal().domain(this.name).range(d3.schemeGreens[9]);
    },
  },
  methods: {
    renderInit() {
      this.name = Object.keys(this.data);
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
      let tooltip = d3
        .select("#manager_bubble_chart")
        .append("div")
        .style("position", "absolute")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("width","140px")
        .style("height","55px")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "7px")
        .style("color", "white");

      let showTooltip = (event, d) => {
        tooltip.transition().duration(200);
        tooltip
          .style("opacity", 1)
          .html("基金经理：" + d + "<br /> 掌管基金：" + this.data[d].number)
          .style("left", (event.pageX-1050)  + "px")
          .style("top", (event.pageY - 190) + "px");
      };

      let moveTooltip = (event) => {
        tooltip
          .style("left", (event.pageX-1050) + "px")
          .style("top", (event.pageY - 190) + "px");
      };

      let hideTooltip = (event) => {
        tooltip.transition().duration(200).style("opacity", 0);
      };

      this.svg
        .append("g")
        .selectAll("dot")
        .data(this.name)
        .enter()
        .append("circle")
        .attr("class", "bubbles")
        .attr("cx", (d) => this.xScale(this.data[d].x))
        .attr("cy", (d) => this.yScale(this.data[d].y))
        .attr("r", (d) => this.numberScale(this.data[d].number))
        .style("fill", (d) => this.colorScale(d))
        .style("stroke","white")
        .style("stroke-width","0.5px")
        .style(":hover","stroke: black")
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideTooltip);
    },
  },
};
</script>

<style scoped>
h5 {
  margin-bottom: 0;
}
</style>