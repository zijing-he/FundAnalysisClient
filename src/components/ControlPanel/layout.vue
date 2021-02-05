<template>
  <div class="container">
    <h4>基金控制面板</h4>
    <a-button size="small" style="margin-top:10px">积极型</a-button>
    <ControlPanelRaderChart :id="svg_id1"/>
    <a-button type="primary" size="small">保守型</a-button>
    <ControlPanelRaderChart :id="svg_id2"/>
    <a-button size="small">稳健型</a-button>
    <ControlPanelRaderChart :id="svg_id3"/>
  </div>
</template>
<script>
import ControlPanelRaderChart from "@/components/ControlPanel/rader-chart";
export default {
  name: "ControlPanelLayout",
  data() {
    return {
      svg_id1:"market_raderchart1",
      svg_id2:"market_raderchart2",
      svg_id3:"market_raderchart3",
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