<template>
  <a-row :gutter="[8, 8]">
    <a-col :span="5">
      <ControlPanelLayout
        v-on:updateSortedList="handleUpdateSortedList"
        :start_date="startDate"
        :end_date="endDate"
      />
       <a-row>
        <MarketAnalysisLayout
          v-on:updateTimeBoundary="handleUpdateTimeBoundary"
        />
      </a-row>
    </a-col>
    <a-col :span="19">
      <a-row>
        <OverViewLayout
          :fundsData="fundsData"
          :totalWidth="totalWidth"
          :scrollLeft="scrollLeft"
        />
      </a-row>
      <a-row>
        <FundProfileLayout
          :fundsID="needFundsID"
          :start_date="startDate"
          :end_date="endDate"
          @updateWidth="handleUpdateWidth"
          @updateScrollLeft="handleScrollLeft"
        />
      </a-row>
    </a-col>
  </a-row>
  <a-row>
    <SortedList :list="sortedList" v-on:updateFundId="handleUpdateFundId" />
  </a-row>
</template>

<script>
import FundProfileLayout from "@/components/FundProfile/FundProfileLayout";
import ControlPanelLayout from "@/components/ControlPanel/layout";
import MarketAnalysisLayout from "@/components/MarketAnalysis/layout";
import OverViewLayout from "@/components/Overview/layout";
import DataService from "@/utils/data-service";
import SortedList from "@/components/SortedList/sorted-list";

export default {
  name: "App",
  components: {
    ControlPanelLayout,
    MarketAnalysisLayout,
    OverViewLayout,
    FundProfileLayout,
    SortedList
  },
  data() {
    return {
      fundsData: null,
      fundsID: null,
      startDate: "20110331", //默认起始值
      endDate: "20191231",
      userWeight: null,
      needFundsID: null,
      totalWidth: 900,
      scrollLeft: 0,
      sortedList: null,
    };
  },
  computed: {},
  methods: {
    
    handleUpdateSortedList(weight){
      console.log("weights到app了",weight);
      this.userWeight = weight;
         DataService.post(
        "get_fund_ranks",
        {
          weights: this.userWeight,
          start_date: this.startDate,
          end_date: this.endDate,
        },
        (data) => {
          this.sortedList = data.ranks.slice(0, 10);
        }
      );
    },
    handleUpdateFundId(fundsID) {
      this.fundsID = fundsID;
      this.needFundsID = this.fundsID;
      this.getFundManagers();
    },
    getTimeBoundary() {
      DataService.post(
        "get_fund_time_border",
        { f_ids: this.fundsID },
        (data) => {
          console.log(data);
          this.startDate = data["start_date"].toString();
          this.endDate = data["end_date"].toString();
          this.needFundsID = this.fundsID;
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
          this.fundsData = data;
        }
      );
    },
    handleUpdateTimeBoundary(start, end) {
      console.log("起始点：", start, end);
      this.startDate = start; //start发生变化，FundProfileLayout里的start也会改变，导致getviewFunds改变
      this.endDate = end;
      if (this.fundsID && this.userWeight) {
        this.getFundManagers();
      }
    },
    // handleUpdateWeightsAndId(fundsID, userWeight) {
    //   this.fundsID = fundsID;
    //   this.userWeight = userWeight;
    //   // if (!this.startDate && !this.endDate) {
    //   // if (this.startDate == "20110331" && this.endDate == "20191231") {
    //   //   this.getTimeBoundary();
    //   // } else {
    //   this.needFundsID = this.fundsID;
    //   this.getFundManagers();
    //   // }
    // },
    handleUpdateWidth(width) {
      console.log(width);
      this.totalWidth = width;
    },
    handleScrollLeft(value) {
      console.log(value);
      this.scrollLeft = value;
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
  padding: 5px;
}
</style>
