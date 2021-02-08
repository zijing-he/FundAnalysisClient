<template>
  <a-row>
    <a-col :span="4">
      <ControlPanelLayout />
    </a-col>
    <a-col :span="16">
      <a-row>
        <MarketAnalysisLayout />
      </a-row>
      <a-row>
        <OverViewLayout />
      </a-row>
      <a-row >
        <FundProfileLayout />
      </a-row>
    </a-col>
    <a-col :span="4"> 用户画像 </a-col>
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
    FundProfileLayout,
    OverViewLayout,
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
  width: 1500px;
  height: 700px;
  margin: 10px;
  border: 2px solid lightblue;
}
</style>
