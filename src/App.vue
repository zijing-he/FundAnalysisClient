<template>
  <a-row :gutter="[8,8]">
    <a-col :span="5">
      <ControlPanelLayout />
    </a-col>
    <a-col :span="19">
      <a-row >
        <MarketAnalysisLayout />
      </a-row>
      <a-row >
        <OverViewLayout />
      </a-row>
      <a-row>
        <FundProfileLayout />
      </a-row>
    </a-col>
  </a-row>
</template>

<script>
import FundProfileLayout from "@/components/FundProfile/FundProfileLayout";
import ControlPanelLayout from "@/components/ControlPanel/layout";
import MarketAnalysisLayout from "@/components/MarketAnalysis/layout";
import OverViewLayout from "@/components/Overview/layout";

export default {
  name: "App",
  components: {
    ControlPanelLayout,
    MarketAnalysisLayout,
    OverViewLayout,
    FundProfileLayout,
    
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
  width: 100%;
  height: 100%;
  padding: 10px;
  /* border: 2px solid lightblue; */
}
</style>
