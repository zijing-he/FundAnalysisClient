<template>
  <div class="container">
    <h4>历史数据对比</h4>
    <a-row>
      <a-col>
        <fundBubbleChart
          v-if="data"
          :id="svg_id1"
          :date="date1"
          :fundData="data"
        />
      </a-col>
      <a-col>
        <fundBubbleChart
          v-if="data"
          :id="svg_id2"
          :date="date2"
          :fundData="data"
        />
      </a-col>
      <a-col>
        <fundBubbleChart
          v-if="data"
          :id="svg_id3"
          :date="date3"
          :fundData="data"
        />
      </a-col>
      <a-col>
        <fundBubbleChart
          v-if="data"
          :id="svg_id4"
          :date="date4"
          :fundData="data"
        />
      </a-col>
      <a-col>
        <managerBubbleChart />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import fundBubbleChart from "@/components/Overview/fund-bubble-chart.vue";
import managerBubbleChart from "@/components/Overview/manager-bubble-chart";
import DataService from "@/utils/data-service";

export default {
  name: "OverViewLayout",
  data() {
    return {
      svg_id1: "fund_bubble_chart1",
      svg_id2: "fund_bubble_chart2",
      svg_id3: "fund_bubble_chart3",
      svg_id4: "fund_bubble_chart4",
      date1: "20190331",
      date2: "20190630",
      date3: "20190930",
      date4: "20191231",
      fund_id: ["112002", "481006", "005270", "590006"],
      data: null,
      waitData: false,
    };
  },
  components: {
    fundBubbleChart,
    managerBubbleChart,
  },
  methods: {
    updateData() {
      //获取基金id list
      DataService.post("get_fund_ids", {}, (data) => {
        this.fund_id = data.fund_ids.slice(0,5);
        //返还基金气泡图信息（参数数组最少4个id)
        DataService.post(
          "get_manager_fund_local",
          { f_ids: this.fund_id },
          (info) => {
            this.data = info;
          }
        );
      });
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
    this.updateData();
  },
  mounted() {},
};
</script>

<style scoped>
.container {
  height: 30%;
  width: 100%;
  margin-top: 3px;
  border: 1px solid black;
}
.container h4 {
  border-bottom: 1px solid black;
  margin-bottom: 0;
  font-weight: bold;
}
</style>
