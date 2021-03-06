<template>
  <div class="container">
    <h4>历史数据对比</h4>
    <a-spin
      v-if="isRequesting"
      size="large"
      tip="Loading..."
      style="margin-top: 89.3px; margin-bottom: 89.3px"
    />
    <div class="fund_bubble_chart_outer_container"   v-if="!isRequesting" >
      <fundBubbleChart
        :quarterFundData="val"
        :fundManagers="managers"
        :date="key"
        :key="key"
        v-for="(val, key) in funds"
      >
      </fundBubbleChart>
    </div>
  </div>
</template>

<script>
import fundBubbleChart from "@/components/Overview/fund-bubble-chart.vue";
import managerBubbleChart from "@/components/Overview/manager-bubble-chart";

export default {
  name: "OverViewLayout",
  props: {
    fundsData: Object,
  },
  data() {
    return {
      componentName: fundBubbleChart,
      managers: null,
      funds: null,
      isRequesting:true,
    };
  },
  components: {
    fundBubbleChart,
  },
  watch: {
    fundsData: function () {
      this.managers = this.fundsData.managers;
      this.funds = this.fundsData.funds;
      this.isRequesting = false;
    },
  },
  methods: {
    updateData() {
      //获取基金id list
      // DataService.post("get_fund_ids", {}, (data) => {
      //   this.fund_id = data.fund_ids.slice(0,5);
      //   //返还基金气泡图信息（参数数组最少4个id)
      //   DataService.post(
      //     "get_manager_fund_local",
      //     { f_ids: this.fund_id },
      //     (info) => {
      //       this.data = info;
      //     }
      //   );
      // });
      // //返还基金起止时间（参数数组最少4个id)
      // DataService.post(
      //   "get_fund_time_border",
      //   { f_ids: ["112002", "481006", "005270", "590006"] },
      //   (data) => {
      //     console.log(data);
      //   }
      // );
      //  //返还基金画像的信息（参数数组最少4个id)
      // DataService.post(
      //   "get_view_funds",
      //   {
      //     f_ids: ["112002", "481006", "005270", "590006"],
      //     start_date: "20060816",
      //     end_date: "20191231",
      //   },
      //   (data) => {
      //     console.log(data);
      //   }
      // );
    },
  },
  created() {
    // this.updateData();
  },
  mounted() {},
};
</script>

<style scoped>
.container {
  height: 30%;
  width: 100%;
  margin-top: 10px;
  border: 1px solid black;
}
.container h4 {
  border-bottom: 1px solid black;
  margin-bottom: 0;
  font-weight: bold;
}
.fund_bubble_chart_outer_container {
  /* position: absolute; */
  display: flex;
  width: 80%;
  overflow-x: auto;
  overflow-y: hidden;
  border-right: 1px solid black;
}
</style>
