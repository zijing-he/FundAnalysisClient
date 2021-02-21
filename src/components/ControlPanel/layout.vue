<template>
  <div class="container">
    <h4>基金控制面板</h4>
    <a-row>
      <a-col :span="10">
        <ControlPanelRaderChart1 />
      </a-col>
      <a-col :span="4">
        <a-button type="primary" size="small" style="margin-top: 80px">
          保守型
        </a-button>
      </a-col>
      <a-col :span="10">
        <ControlPanelRaderChart2 />
      </a-col>
    </a-row>
    <a-row class="sectror_ontainer">
      <text class="text">关注行业：</text>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#iconbaijiu_duose_"></use>
      </svg>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#iconxinnengyuankaifa"></use>
      </svg>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#iconyinhang"></use>
      </svg>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon55-fangdichandaikuan"></use>
      </svg>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icontesila"></use>
      </svg>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#iconmeitanjianguanqu"></use>
      </svg>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#iconshipin"></use>
      </svg>
    </a-row>
  </div>
</template>
<script>
import ControlPanelRaderChart1 from "@/components/ControlPanel/rader-chart1";
import ControlPanelRaderChart2 from "@/components/ControlPanel/rader-chart2";

export default {
  name: "ControlPanelLayout",
  data() {
    return {};
  },
  components: {
    ControlPanelRaderChart1,
    ControlPanelRaderChart2,
  },
  methods: {},
  mounted() {},
};
</script>

<style scoped>
.container {
  height: 45%;
  width: 100%;
  border: 1px solid black;
}
.container h4 {
  border-bottom: 1px solid black;
  margin-bottom: 0;
}
.sectror_ontainer{
  margin-top: -1em;
  margin-left:1em;
}

.text{
  font-size: 13px;
}

.icon {
  width: 1.2em;
  height: 1.2em;
  margin-top: 0.2em;
  margin-right:0.5em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>