<template>
  <div style="width: 535px;">
    <a-row class="first_row">
      <MarketAnalysisCurveChart
        :start="marketStart"
        :end="marketEnd"
        v-on:updateBrush="handleUpdateBrush"
      />
    </a-row>
    <a-row id="divider"></a-row>
    <a-row class="second_row">
      <!-- <a-row type="flex" class="industry_selection_style">
        <svg class="icon menu_icon" aria-hidden="true">
          <use xlink:href="#iconxitongcaidan"></use>
        </svg>
        <text>Sector Market</text>
      </a-row> -->
      <a-row><text id="sector_market_text">Sector Market</text></a-row>
      <MarketAnalysisStramGraph
        :start="industryStart"
        :end="industryEnd"
        v-on:updateBrushStream="handleupdateBrushStream"
        v-on:getSector="handleGetSector"
      />
    </a-row>
  </div>
</template>
<script>
import MarketAnalysisCurveChart from "@/components/MarketAnalysis/curvechart";
import MarketAnalysisStramGraph from "@/components/MarketAnalysis/streamgraph";
export default {
  name: "MarketAnalysisLayout",
  data() {
    return {
      marketStart: null,
      marketEnd: null,
      industryStart: null,
      industryEnd: null,
    };
  },
  components: {
    MarketAnalysisCurveChart,
    MarketAnalysisStramGraph,
  },
  emits: ["updateTimeBoundary", "updateSector"],
  methods: {
    handleGetSector(sector) {
      this.$emit("updateSector", sector);
    },
    handleUpdateBrush(start, end, oriStart, oriEnd) {
      this.industryStart = oriStart;
      this.industryEnd = oriEnd;
      this.$emit("updateTimeBoundary", start, end);
    },
    //更新market的brush
    handleupdateBrushStream(start, end, oriStart, oriEnd) {
      this.marketStart = oriStart;
      this.marketEnd = oriEnd;
      this.$emit("updateTimeBoundary", start, end);
    },
  },
  mounted() {},
};
</script>

<style scoped>
.first_row {
  height: 349px;
  width: 535px;
  background: white;
  /* box-shadow: 12px 2px 44px 0 rgba(0, 0, 0, 0.05); */
}
.second_row {
  /* border-top: 1px solid black; */
  height: 380px;
  width: 535px;
  /* border: 1px solid red; */
  /* transform: rotate(-90deg); */
  background: white;
  /* box-shadow: 12px 2px 44px 0 rgba(0, 0, 0, 0.05); */
}

.industry_selection_style {
  margin-top: 3%;
  margin-bottom: 1%;
}
.industry_selection_style text {
  font-family: "PingFangSC-Semibold";
  font-size: 19px;
  height: 32px;
  font-weight: 800;
  color: #185bbd;
  letter-spacing: 0;
  margin-left: 25px;
}
.industry_selection_style .menu_icon {
  position: relative;
  color: #185bbd;
  font-size: 23px;
  bottom: 4px;
  left: 20px;
}
#sector_market_text {
  font-family: "PingFangSC-Medium";
  font-size: 15px;
  font-weight: 600;
  line-height: 32px;
  color: #4b4b4b;
  letter-spacing: -0.22px;
  text-align: right;
  margin-left: 28px;
  margin-top: 10px;
}
#divider {
  margin: auto;
  width: 89%;
  /* height: 1px; */
  border-bottom: 1px solid #dedede;
}
</style>
