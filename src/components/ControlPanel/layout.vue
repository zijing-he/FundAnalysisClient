<template>
  <div class="container">
    <h4>基金控制面板</h4>
    <a-row>
      <a-col :span="12">
        <!-- <ControlPanelRaderChart1 /> -->
        <ControlPanelLineChart
          :id="linechart_id1"
          :data="income"
          v-on:updateValue="updateRaderChart"
        />
        <ControlPanelLineChart
          :id="linechart_id2"
          :data="size"
          v-on:updateValue="updateRaderChart"
        />
        <ControlPanelLineChart
          :id="linechart_id3"
          :data="holder"
          v-on:updateValue="updateRaderChart"
        />
        <ControlPanelLineChart
          :id="linechart_id4"
          :data="risk"
          v-on:updateValue="updateRaderChart"
        />
        <ControlPanelLineChart
          :id="linechart_id5"
          :data="max_drop"
          v-on:updateValue="updateRaderChart"
        />
      </a-col>
      <!-- <a-col :span="4">
        <a-button type="primary" size="small" style="margin-top: 80px">
          保守型
        </a-button>
      </a-col> -->
      <a-col :span="12">
        <ControlPanelRaderChart :value="rader_value" :axis="rader_axis"/>
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
import ControlPanelLineChart from "@/components/ControlPanel/line-chart";
import ControlPanelRaderChart from "@/components/ControlPanel/rader-chart";
import holderJSON from "@/data/RaderChart/holder.json";
import incomeJSON from "@/data/RaderChart/income.json";
import max_dropJSON from "@/data/RaderChart/max_drop.json";
import riskJSON from "@/data/RaderChart/risk.json";
import sizeJSON from "@/data/RaderChart/size.json";

export default {
  name: "ControlPanelLayout",
  data() {
    return {
      linechart_id1: "income",
      linechart_id2: "size",
      linechart_id3: "holder",
      linechart_id4: "risk",
      linechart_id5: "max_drop",
      income: Object.values(incomeJSON),
      holder: Object.values(holderJSON),
      max_drop: Object.values(max_dropJSON),
      risk: Object.values(riskJSON),
      size: Object.values(sizeJSON),

      rader_value:0,
      rader_axis: "",
    };
  },
  components: {
    ControlPanelLineChart,
    ControlPanelRaderChart,
  },
  methods: {
    updateRaderChart(value,id) {
      this.rader_value = value;
      this.rader_axis = id;
    },
  },
  mounted() {},
};
</script>

<style scoped>
.container {
  height: 255px;
  width: 100%;
  border: 1px solid black;
}
.container h4 {
  border-bottom: 1px solid black;
  margin-bottom: 5px;
  font-weight: bold;
}
.sectror_ontainer {
  margin-top: -0.5em;
  margin-left: 1em;
}

.text {
  font-size: 13px;
}

.icon {
  width: 1.2em;
  height: 1.2em;
  margin-top: 0.2em;
  margin-right: 0.5em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>