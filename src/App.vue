<template>
  <a-row :gutter="[8, 8]">
    <a-col :span="5">
      <ControlPanelLayout v-on:updateWeightsAndId="handleUpdateWeightsAndId" />
    </a-col>
    <a-col :span="19">
      <a-row>
        <MarketAnalysisLayout v-on:handleBrush="updateTimeBoundary" />
      </a-row>
      <a-row>
        <OverViewLayout :fundsData="fundsData" />
      </a-row>
      <a-row>
        <!-- <FundProfileLayout :fundsID="fundsID"/> -->
      </a-row>
    </a-col>
  </a-row>
</template>

<script>
import FundProfileLayout from "@/components/FundProfile/FundProfileLayout";
import ControlPanelLayout from "@/components/ControlPanel/layout";
import MarketAnalysisLayout from "@/components/MarketAnalysis/layout";
import OverViewLayout from "@/components/Overview/layout";
import DataService from "@/utils/data-service";

export default {
  name: "App",
  components: {
    ControlPanelLayout,
    MarketAnalysisLayout,
    OverViewLayout,
    // FundProfileLayout,
  },
  provide() {
    return {
      getStart: () => this.startDate,
      getEnd: () => this.startDate,
    };
  },
  data() {
    return {
      fundsData: null,
      fundsID: [],
      startDate: 0,
      endDate: 100,
      userWeight: null,
    };
  },
  computed: {},
  methods: {
    getTimeBoundary() {
      DataService.post(
        "get_fund_time_border",
        { f_ids: this.fundsID },
        (data) => {
          console.log("最大的起止时间：", data);
          this.startDate = data["start_date"];
          this.endDate = data["end_date"];

          //先后
          this.getFundManagers();
        }
      );
    },

    getFundManagers() {
      //得到基金散点图和基金经理信息
      DataService.post(
        "get_manager_fund_local",
        {
          weights: this.userWeight,
          num_top: 10,
          f_ids: this.fundsID,
          start_date: this.startDate,
          end_date: this.endDate,
        },
        (data) => {
          console.log("基金经理相关信息：", data);
          this.fundsData = data;
        }
      );
    },
    updateTimeBoundary(start, end) {
      console.log("让我康康起始点：", start, end);
      this.start = start;
      this.end = end;


    
    },
    handleUpdateWeightsAndId(fundsID, userWeight) {
      this.fundsID = fundsID;
      this.userWeight = userWeight;

      this.getTimeBoundary();
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
