<template>
  <div>
    <h4>基金详细对比</h4>
    <a-row>
      <!-- <div style="width: 20px; height: 600px">
        <div style="display: inline-block; height: 300px; margin-top: 60px">
          <a-slider
            vertical
            v-model:value="threshold"
            :min="0"
            :max="10"
            :step="0.001"
          />
        </div>
      </div> -->
      <a-col>
        <fundScatterDiagram :threshold="threshold" />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import fundScatterDiagram from "@/components/Overview/fund-scatter-diagram";

export default {
  name: "OverViewLayout",
  data() {
    return {
      value: 510310,
      threshold: 0,
    };
  },
  components: {
    fundScatterDiagram,
  },
  methods: {
    onClickFundType({ key }) {
      console.log(`Click on item ${key}`);
    },
    onClickIndustryType({ key }) {
      console.log(`Click on item ${key}`);
    },
  },
  mounted() {},
};
</script>

<style>
.ant-col .ant-input {
  width: 100px;
}
</style>
