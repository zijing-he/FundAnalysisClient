<template>
  <a-row>
    <a-col :span="6">
      雷达图
    </a-col>
    <a-col :span="18">
      <MarketAnalysisLayout />
      
    </a-col>
  
  </a-row>

</template>

<script>
import MarketAnalysisLayout from "@/components/MarketAnalysis/market-analysis-layout";
// import OverView from "@/components/Overview/overView";
// import MarketLayout from "@/components/Market/market-layout";
// import ManagerLayout from "@/components/Manager/manager-layout";
// import FundLayout from "@/components/Fund/FundLayout";
// import CompanyLayout from "@/components/Company/CompanyLayout";

export default {
  name: "App",
  components: {
    MarketAnalysisLayout,
    // OverView,
    // MarketLayout,
    // ManagerLayout,
    // FundLayout,
    // CompanyLayout
  },
  mounted() {},
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  width: 90%;
  height: 90%;
  margin: 10px;
  border: 2px solid lightblue;
}
</style>
