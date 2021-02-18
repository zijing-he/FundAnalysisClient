<template>
  <div class="container">
    <h4>基金控制面板</h4>
    
    <a-row>
      <a-col :span="10">
        <ControlPanelRaderChart />
      </a-col>
      <a-col :span="4">
        <a-button type="primary" size="small" style="margin-top: 80px">
          保守型
          </a-button>
      </a-col>
      <a-col :span="10"> 雷达图 </a-col>
    </a-row>
  </div>
</template>
<script>
import ControlPanelRaderChart from "@/components/ControlPanel/rader-chart";
export default {
  name: "ControlPanelLayout",
  data() {
    return {
      svg_id1: "market_raderchart1",
      svg_id2: "market_raderchart2",
      svg_id3: "market_raderchart3",
    };
  },
  components: {
    ControlPanelRaderChart,
  },
  methods: {},
  mounted() {},
};
</script>

<style scoped>
.container {
  height: 696px;
  width: 100%;
  border: 1px solid black;
}
.container h4 {
  border-bottom: 1px solid black;
  margin-bottom: 0;
}
</style>