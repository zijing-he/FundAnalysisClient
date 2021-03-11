
<template>
  <div>
    <!-- justify="end" -->
    <a-row type="flex" justify="center">
      <a-col :span="4">
        <a-dropdown>
          <template #overlay>
            <a-menu @click="handleMenuClick">
              <a-menu-item :key="item" v-for="item in sectors">
                <!-- <UserOutlined /> -->
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icontesila"></use>
                </svg>
                {{ item }}
              </a-menu-item>
            </a-menu>
          </template>
          <a-button>
            选择您所关注的行业
            <DownOutlined />
          </a-button>
        </a-dropdown>
      </a-col>
      <a-col :span="12">
        <a-button
          :key="item"
          v-for="item in selectedIndustries"
          @click="handleButtonClick"
        >
          <div :style="activationButton(item)">{{ item }}</div>
        </a-button>
      </a-col>
      
      <a-col :span="8">
        <a-select
          v-model:value="selectedIndustries"
          mode="multiple"
          showArrow
          style="width: 100%"
          placeholder="选择您所关注的行业"
          @change="handleChange"
        >
          <a-select-option
            v-for="item in sectors"
            :key="item"
            :value="item"
          >
            <!-- {{ item }} -->
            <div :style="activationSelect(item)">{{ item }}</div>
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
import { UserOutlined, DownOutlined } from "@ant-design/icons-vue";
export default {
  name: "MarketAnalysisStramGraph",
  props: {},
  components: {
    // UserOutlined,
    DownOutlined,
  },
  data() {
    return {
      svg: null,
      margin: { top: 10, right: 20, bottom: 20, left: 15 },
      width: 990,
      height: 110,
      date: Object.keys(dataJSON),
      keys: [],
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
    //根据内容不同改变颜色
    activationButton() {
      return (item) => {
        return { color: sectorDict[item].color };
      };
    },
    activationSelect() {
      return (item) => {
        return { "background-color": sectorDict[item].color, color: "black" };
        // return { color: sectorDict[item].color };
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
      return d3
        .scaleLinear()
        .domain([
          0,
          d3.max(Object.values(this.data), (d) => d.avg),
          // d3.max(Object.values(this.data), (d) => d3.max(Object.values(d))),
        ])
        .range([this.innerHeight, 0]);
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
    stackedData() {
      // offset(d3.stackOffsetSilhouette) ——>河流图
      return d3.stack().keys(this.keys)(Object.values(this.data));
    },
  },
  methods: {
    handleChange(value) {
      this.renderUpdate();
    },
    handleMenuClick(e) {
      // console.log("click", e);
      this.selectedIndustries.push(e.key);
      this.selectedIndustries = Array.from(new Set(this.selectedIndustries));
      this.renderUpdate();
    },
    handleButtonClick(event) {
      //点击删除相应的行业
      this.selectedIndustries.splice(
        this.selectedIndustries.indexOf(event.toElement.innerText),
        1
      );
      this.renderUpdate();
    },
    renderInit() {
      this.sectors = Object.keys(sectorDict);
      this.keys = Object.keys(this.data[this.date[0]]);
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
      // Add X axis
      this.svg
        .append("g")
        .attr("transform", `translate(0,${this.innerHeight})`)
        .call(
          d3.axisBottom(this.xScale).ticks(d3.timeYear.every(1))
          // .tickSize(this.innerHeight / 2 - 3)
        );
      // .select(".domain")
      // .remove();
      // Customization
      this.svg.selectAll(".tick line").attr("stroke", "#595959");
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
      let color = d3
        .scaleOrdinal()
        .domain(this.keys)
        .range([...d3.schemeCategory10, ...d3.schemePaired, ...d3.schemeSet1]);

      this.svg.selectAll("#streamGraphLayers").remove();
      let streamGraph = this.svg.append("g").attr("id", "streamGraphLayers");

      this.yScale.domain([0, d3.max(Object.values(this.data), (d) => d.avg)]);
      streamGraph
        .append("path")
        .datum(Object.values(this.data))
        .attr("class", "streamGraphLayers")
        .style("stroke", "#9F9D9D")
        .style("fill", "#9F9D9D")
        // .style("stroke-width", "0.1px")
        // .style("fill", "#9F9D9D")
        .attr("d", this.area);
      //   .on("mouseenter", mouseenter)
      //   .on("mouseleave", mouseleave);
      this.svg.selectAll("#sectorChartLayers").remove();
      let sectorChart = this.svg.append("g").attr("id", "sectorChartLayers");

      this.yScale.domain([0, 154677212676.10007]);
      for (let item of this.selectedIndustries) {
        sectorChart
          .append("g")
          .append("path")
          .attr("class", "line-path-sector")
          .attr("d", this.linePath(Object.values(this.sector_data[item])))
          .attr("fill", "none")
          .attr("stroke-width", "2px")
          .attr("stroke", sectorDict[item].color);
      }
    },
  },
};
</script>

<style scoped>
#market_streamgraph {
  height: 110px;
  width: 50%;
}

.icon {
  width: 1.2em;
  height: 1.2em;
  margin-top: 0.2em;
  margin-right: 0.5em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

</style>