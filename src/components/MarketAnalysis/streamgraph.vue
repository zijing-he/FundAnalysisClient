
<template>
  <div class="selectedContainer">
    <!-- type="flex" justify="start" -->
    <a-row>
      <a-col :span="24">
        <a-select
          v-model:value="selectedIndustries"
          mode="multiple"
          showArrow
          style="
            width: 91%;
            border: 1px solid #aeaeae;
            box-shadow: 0 20px 15px -12px rgba(21, 85, 194, 0.13);
            border-radius: 5px;
          "
          placeholder="选择您所关注的行业"
          @change="handleChange"
        >
          <a-select-option v-for="item in sectors" :key="item" :value="item">
            <span>
              <svg
                class="icon"
                aria-hidden="true"
                :style="activationSelect(item)"
              >
                <use v-if="item === '医药生物'" xlink:href="#iconyiyao"></use>
                <use v-if="item === '电子'" xlink:href="#icondianzi"></use>
              </svg>
              <!-- <text :style="activationSelect(item)">██ </text> -->
              <text>{{ item }}</text>
            </span>
          </a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <a-row>
      <a-col>
        <div id="market_streamgraph"></div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import * as d3 from "d3";
import dataJSON from "@/data/StreamGraph/market_date_sector.json";
import sectorJSON from "@/data/market_sector_date.json";
import sectorDict from "@/data/sector_dict.json";
export default {
  name: "MarketAnalysisStramGraph",
  props: {},
  components: {},
  data() {
    return {
      svg: null,
      margin: { top: 60, right: 20, bottom: 30, left: 55 },
      width: 519,
      height: 350,
      date: Object.keys(dataJSON),
      data: dataJSON,
      sector_data: sectorJSON,
      sectors: [],
      selectedIndustries: [],
    };
  },

  mounted: function () {
    this.renderInit();
    this.renderUpdate();
  },
  computed: {
    iconScale() {
      return d3
        .scaleOrdinal()
        .domain(this.sectors)
        .range(["iconyiyao", "icondianzi", "iconshipinyinliao", "iconhuagong"]);
    },
    colorScale() {
      return d3
        .scaleOrdinal()
        .domain(this.sectors)
        .range(["#D6AA9F", "#B7E6C7", "#B2C0E0"]);
    },
    //根据内容不同改变颜色
    activationSelect() {
      return (item) => {
        // return { color: sectorDict[item].color };
        return { color: this.colorScale(item) };
      };
    },
    innerWidth() {
      return this.width - this.margin.left - this.margin.right;
    },
    innerHeight() {
      return this.height - this.margin.top - this.margin.bottom;
    },
    xScale() {
      return d3
        .scaleTime()
        .domain([this.date[0], this.date[this.date.length - 1]])
        .range([0, this.innerWidth])
        .nice();
    },
    yScale() {
      let yscale = d3.scaleLinear().range([this.innerHeight, 0]);
      let maxArray = [d3.max(Object.values(this.data), (d) => d.avg)];
      this.selectedIndustries.forEach((d) => {
        maxArray.push(d3.max(Object.values(this.sector_data[d])));
      });

      return yscale.domain([0, d3.max(maxArray)]);
    },
    linePath() {
      return d3
        .line()
        .curve(d3.curveCatmullRom)
        .x((d, i) => this.xScale(this.date[i]))
        .y((d) => this.yScale(d));
    },
    area() {
      return d3
        .area()
        .x((d, i) => this.xScale(this.date[i]))
        .y0((d) => this.yScale(0))
        .y1((d) => this.yScale(d.avg));
    },
    // stackedData() {
    //   // offset(d3.stackOffsetSilhouette) ——>河流图
    //   return d3.stack().keys(this.sectors)(Object.values(this.data));
    // },
  },
  methods: {
    handleChange(value) {
      this.renderUpdate();
    },
    // handleMenuClick(e) {
    //   this.selectedIndustries.push(e.key);
    //   this.selectedIndustries = Array.from(new Set(this.selectedIndustries));
    //   this.renderUpdate();
    // },
    // handleButtonClick(event) {
    //   //点击删除相应的行业
    //   this.selectedIndustries.splice(
    //     this.selectedIndustries.indexOf(event.toElement.innerText),
    //     1
    //   );
    //   this.renderUpdate();
    // },
    renderInit() {
      this.sectors = Object.keys(sectorDict);
      this.date = this.date.map(
        (d) =>
          new Date(
            d.substring(0, 4) + "-" + d.substring(4, 6) + "-" + d.substring(6)
          )
      );
      this.svg = d3
        .select("#market_streamgraph")
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("viewBox", [0, 0, this.width, this.height])
        .append("g")
        .attr("transform", `translate(${this.margin.left},${this.margin.top})`);
    },
    renderUpdate() {
      this.svg.selectAll("g").remove();
      // Add X axis
      this.svg
        .append("g")
        .attr("class", "xAxis")
        .attr("transform", `translate(0,${this.innerHeight})`)
        .call(
          d3.axisBottom(this.xScale).ticks(d3.timeYear.every(2))
          // .tickValues([2010,2020])
          // .tickSize(this.innerHeight / 2 - 3)
        )
        //删除坐标tick line
        .select(".domain")
        .remove();

      this.svg
        .append("g")
        .attr("class", "yAxis")
        .call(
          d3.axisLeft(this.yScale).tickFormat(d3.format("~s")).ticks(5)
          // .ticks(d3.timeYear.every(2))
          // .tickValues([2010,2020])
          // .tickSize(this.innerHeight / 2 - 3)
        )
        .select(".domain")
        .remove();

      this.svg.selectAll(".tick line").remove();
      this.svg
        .select(".xAxis")
        .selectAll(".tick text")
        .style("font-size", "13px")
        .style("font-family", "PingFangSC-Regular")
        .style("letter-spacing", "-0.08px")
        .style("color", "#6C7B8A");
      this.svg
        .select(".yAxis")
        .selectAll(".tick text")
        .style("font-family", "Helvetica")
        .style("font-size", "10px")
        .style("color", "#6C7B8A");

      // Customization
      // this.svg.selectAll(".tick line").attr("stroke", "#595959");
      // Add X axis label:
      // this.svg
      //   .append("text")
      //   .attr("text-anchor", "end")
      //   .attr("x", this.innerWidth)
      //   .attr("y", this.innerHeight)
      //   .text("Time (year)");
      // color palette

      // create a tooltip
      // let Tooltip = this.svg
      //   .append("text")
      //   .attr("x", 5)
      //   .attr("y", 10)
      //   .style("opacity", 0)
      //   .style("font-size", 14);
      // Three function that change the tooltip when user hover / move / leave a cell
      // var mouseenter = function (d, i) {
      //   Tooltip.text(i.key);
      //   Tooltip.style("opacity", 1).style("fill", color(i.key));
      //   d3.selectAll(".streamGraph").style("opacity", 0.2);
      //   d3.select(this).style("stroke", "black").style("opacity", 1);
      // };
      // var mouseleave = function (d) {
      //   Tooltip.style("opacity", 0);
      //   d3.selectAll(".streamGraph")
      //     .style("opacity", 1)
      //     .style("stroke", "none");
      // };
      // Show the areas
      // let color = d3
      //   .scaleOrdinal()
      //   .domain(this.sectors)
      //   .range([...d3.schemeCategory10, ...d3.schemePaired, ...d3.schemeSet1]);

      this.svg.selectAll("#streamGraphLayers").remove();
      let streamGraph = this.svg.append("g").attr("id", "streamGraphLayers");

      // this.yScale.domain([0, d3.max(Object.values(this.data), (d) => d.avg)]);
      streamGraph
        .append("path")
        .datum(Object.values(this.data))
        .attr("class", "streamGraphLayers")
        .style("stroke", "rgba(80,161,255,0.10")
        .style("fill", "rgba(80,161,255,0.10")
        // .style("stroke-width", "0.1px")
        // .style("fill", "#9F9D9D")
        .attr("d", this.area);
      //   .on("mouseenter", mouseenter)
      //   .on("mouseleave", mouseleave);
      this.svg.selectAll("#sectorChartLayers").remove();
      let sectorChart = this.svg
        .append("g")
        .attr("id", "sectorChartLayers")
        .selectAll(".sectorLegend")
        .data(this.selectedIndustries)
        .enter();

      // this.yScale.domain([0, 154677212676.10007]);
      // let color = d3
      //   .scaleOrdinal()
      //   .domain(this.sectors)
      //   .range(["#D6AA9F", "#B7E6C7", "#B2C0E0"]);
      // let handleMouseover = function (event, d) {
      //   d3.selectAll(".line-path-sector").attr("stroke", "#B8B8B8");
      //   d3.select(this).attr("stroke", color(d)).attr("stroke-width", 5);
      // };
      // let handleMouseout = function (event, d) {
      //   d3.selectAll(".line-path-sector")
      //     .attr("stroke", color(d))
      //     .attr("stroke-width", "3px");
      // };
      sectorChart
        .append("path")
        .attr("class", "line-path-sector")
        .attr("d", (d) => this.linePath(Object.values(this.sector_data[d])))
        .attr("fill", "none")
        .attr("stroke-width", "3px")
        // .attr("stroke", (d) => sectorDict[d].color)
        .attr("stroke", (d) => this.colorScale(d));
      // .on("mouseover", handleMouseover)
      // .on("mouseout", handleMouseout);

      this.svg
        .append("circle")
        .attr("cx", this.innerWidth - 151)
        .attr("cy", -16)
        .attr("r", 7)
        .style("fill", "rgba(80,161,255,0.30)");
      // .style("fill", "red");
      this.svg
        .append("text")
        .attr("x", this.innerWidth - 134)
        .attr("y", -15)
        .style("fill", "#9F9F9F")
        .style("font-family", "PingFangSC-Regular")
        .style("letter-spacing", "-0.18px")
        .style("font-size", "17px")
        .text("Industry average")
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");
      this.svg
        .append("text")
        .attr("x", -30)
        .attr("y", -15)
        .style("fill", "#6A6A6A")
        .style("font-family", "Helvetica")
        .style("letter-spacing", "0.2px")
        .style("font-size", "13px")
        .text("(rmb)")
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");
    },
  },
};
</script>

<style scoped>
.selectedContainer {
  width: 100%;
  /* border: 1px solid red; */
}
#market_streamgraph {
  height: 20.7%;
  width: 100%;
  /* border: 1px solid black; */
}
</style>