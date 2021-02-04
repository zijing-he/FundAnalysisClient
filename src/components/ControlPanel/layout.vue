<template>
  <div class="container">
    <h4>基金控制面板</h4>
    <ControlPanelRaderChart />
    <ControlPanelRaderChart />
    <ControlPanelRaderChart />
  </div>
</template>
<script>
import ControlPanelRaderChart from "@/components/ControlPanel/rader-chart";
export default {
  name: "ControlPanelLayout",
  data() {
    return {};
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