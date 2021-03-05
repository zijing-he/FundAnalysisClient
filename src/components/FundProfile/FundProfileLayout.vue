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
      v-if="fundData == undefined"
      size="large"
      tip="Loading..."
      style="margin-top: 20px; margin-bottom: 20px"
    />
    <div v-if="fundData !== undefined">
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
    start: Number,
    end: Number,
  },
  watch: {
    start: function () {
      console.log("起始点改变了:", this.start, this.end);
    },
    fundsID: function () {
      console.log("我到了", this.start, this.end);
      if (this.start == undefined) {
        DataService.post(
          "get_fund_time_border",
          { f_ids: this.fundsID },
          (data) => {
            this.start_date = data["start_date"];
            this.end_date = data["end_date"];
            // console.log(this.start_date, this.end_date);
            DataService.post(
              "get_view_funds",
              {
                f_ids: this.fundsID,
                start_date: this.start_date,
                end_date: this.end_date,
              },
              (data) => {
                // console.log(data);
                this.fundData = data;
              }
            );
          }
        );
      } else {
        DataService.post(
          "get_view_funds",
          {
            f_ids: this.fundsID,
            start_date: this.start,
            end_date: this.end,
          },
          (data) => {
            // console.log(data);
            this.fundData = data;
          }
        );
      }
    },
  },
  data() {
    return {
      componentName: "FundProfile",
      // fundIds: [
      //   "000001",
      //   "000006",
      //   "000011",
      //   "000020",
      //   "000021",
      //   "000029",
      //   "000031",
      //   "000039",
      //   "000059",
      // ],
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
    };
  },
  components: {
    FundProfile,
  },
  methods: {},
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
