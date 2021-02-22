<template>
  <div class="container">
    <h4>基金详细对比</h4>
    <a-row>
      <a-col>
        <fundBubbleChart
          :id="svg_id1"
          :date="date1"
          :threshold="threshold"
        />
      </a-col>
      <a-col>
        <fundBubbleChart
          :id="svg_id2"
          :date="date2"
          :threshold="threshold"
        />
      </a-col>
      <a-col>
        <fundBubbleChart
          :id="svg_id3"
          :date="date3"
          :threshold="threshold"
        />
      </a-col>
      <a-col>
        <fundBubbleChart
          :id="svg_id4"
          :date="date4"
          :threshold="threshold"
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

export default {
  name: "OverViewLayout",
  data() {
    return {
      threshold: 0,
      svg_id1: "fund_bubble_chart1",
      svg_id2: "fund_bubble_chart2",
      svg_id3: "fund_bubble_chart3",
      svg_id4: "fund_bubble_chart4",
      date1: "20190331",
      date2: "20190630",
      date3: "20190930",
      date4: "20191231",
    };
  },
  components: {
    fundBubbleChart,
    managerBubbleChart
  },
  methods: {},
  mounted() {},
};
</script>

<style scoped>
.container {
  height: 175px;
  width: 100%;
  border: 1px solid black;
}
.container h4 {
  border-bottom: 1px solid black;
  margin-bottom: 0;
}
</style>
