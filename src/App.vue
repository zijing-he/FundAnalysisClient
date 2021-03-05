<template>
  <a-row :gutter="[8, 8]">
    <a-col :span="5">
      <ControlPanelLayout
        v-on:updateChart="updateBubbleChart"
        v-on:updateFundProfile="updateFundProfile"
      />
    </a-col>
    <a-col :span="19">
      <a-row>
        <MarketAnalysisLayout v-on:handleBrush="updateTimeBoundary" />
      </a-row>
      <a-row>
        <OverViewLayout :fundsData="fundsData" />
      </a-row>
      <a-row>
        <FundProfileLayout :fundsID="fundsID" :start="start" :end="end"/>
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
  // provide() {
  //   return {
  //     // todoLength: Vue.computed(() => this.todos.length)
  //     origin: this.start,
  //   };
  // },
  data() {
    return {
      // funds:null,
      // managers:null,
      fundsData: null,
      fundsID: [],
      start:undefined,
      end:undefined,
    };
  },
  methods: {
    updateTimeBoundary(start, end) {
      console.log("让我康康：",start,end);
      this.start = start;
      this.end = end;
    
     
    },
    updateBubbleChart(funds_info) {
      // console.log("传到App了！");
      // console.log(funds_info);
      this.fundsData = funds_info;
    },
    updateFundProfile(funds_id) {
      // console.log("传到App了！");
      // console.log(funds_id);
      this.fundsID = funds_id;
    },
  },
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
