<template>
  <div class="container">
    <!-- <component
      :is="componentName"
      :fundData="fundData[i]"
      :fundId="d"
      :key="d"
      :returnData="returnData"
      :carData="carData"
      :stockData="stockData"
      :bondData="bondData"
      :cashData="cashData"
      :otherData="otherData"
      :avgSizeData="sizeData"
      :alphaData="alphaData"
      :betaData="betaData"
      :sharpData="sharpData"
      :dropData="dropData"
      :infoData="infoData"
      :riskData="riskData"
      :weightData="weightData"
      v-for="(d, i) in fundIds"
    >
    </component> -->
    <a-spin
      v-if="isRequesting"
      size="large"
      tip="Loading..."
      style="margin-top: 105px; margin-bottom: 105px"
    />
    <div v-if="!isRequesting">
      <component
        :is="componentName"
        :fundData="fundData"
        :fundIds="fundsID"
        :fundId="item"
        :key="item"
        v-for="item in fundsID"
      >
      </component>
    </div>
  </div>
</template>
<script>
import FundProfile from "@/components/FundProfile/FundProfile";
import DataService from "@/utils/data-service";

export default {
  name: "FundProfileLayout",
  props: {
    fundsID: Array,
  },
  inject: ["getStart", "getEnd"],
  computed: {
    getReactiveStart() {
      return this.getStart();
    },
    getReactiveEnd() {
      return this.getEnd();
    },
  },
  watch: {
    getReactiveStart: function () {  //筛选时间功能
      this.isRequesting = true;
      this.start_date = this.getStart();
      this.end_date = this.getEnd();
      this.getViewFunds();
    },
    fundsID: function () {
      this.isRequesting = true;
      DataService.post(
        "get_fund_time_border",
        { f_ids: this.fundsID },
        (data) => {
          console.log("最大的起止时间：",data);
          this.start_date = data["start_date"];
          this.end_date = data["end_date"];
          this.getViewFunds();
        }
      );
    },
  },
  data() {
    return {
      componentName: "FundProfile",
      fundData: undefined,
      returnData: [],
      carData: [],
      stockData: [],
      bondData: [],
      cashData: [],
      otherData: [],
      sizeData: [],
      alphaData: [],
      betaData: [],
      sharpData: [],
      dropData: [],
      infoData: [],
      riskData: [],
      weightData: [],
      start_date: null,
      end_date: null,
      isRequesting: true,
    };
  },
  components: {
    FundProfile,
  },
  methods: {
    getViewFunds() {
      DataService.post(
        "get_view_funds",
        {
          f_ids: this.fundsID,
          start_date: this.start_date,
          end_date: this.end_date,
        },
        (data) => {
          this.fundData = data;
          this.isRequesting = false;
        }
      );
    },
  },
  mounted() {
    // DataService.post(
    //   "get_fund_time_border",
    //   { f_ids: this.fundIds },
    //   (data) => {
    //     this.start_date = data["start_date"];
    //     this.end_date = data["end_date"];
    //     console.log(this.start_date, this.end_date);
    //     DataService.post(
    //       "get_view_funds",
    //       {
    //         f_ids: this.fundIds,
    //         start_date: this.start_date,
    //         end_date: this.end_date,
    //       },
    //       (data) => {
    //         console.log(data);
    //         this.fundData = data;
    //         // this.fundIds.forEach((d) => {
    //         //   this.fundData.push(data["detail"][d]);
    //         //   this.returnData.push(data["total"][d]["return"]);
    //         //   this.carData.push(data["total"][d]["car"]);
    //         //   this.stockData.push(data["total"][d]["stock"]);
    //         //   this.bondData.push(data["total"][d]["bond"]);
    //         //   this.cashData.push(data["total"][d]["cash"]);
    //         //   this.otherData.push(data["total"][d]["other"]);
    //         //   this.sizeData.push(data["total"][d]["size"]);
    //         //   this.alphaData.push(data["total"][d]["alpha"]);
    //         //   this.betaData.push(data["total"][d]["beta"]);
    //         //   this.sharpData.push(data["total"][d]["sharp_ratio"]);
    //         //   this.dropData.push(data["total"][d]["max_drop_down"]);
    //         //   this.infoData.push(data["total"][d]["information_ratio"]);
    //         //   this.riskData.push(data["total"][d]["risk"]);
    //         //   this.weightData.push(data["total"][d]["instl_weight"]);
    //         // });
    //       }
    //     );
    //   }
    // );
  },
};
</script>

<style scoped>
.container {
  margin-top: 5px;
  width: 100%;
  border: 1px solid black;
}
</style>
