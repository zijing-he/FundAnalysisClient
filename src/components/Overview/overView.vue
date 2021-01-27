<template>
  <div>
    <h2>基金全局概览</h2>
    <a-row>
      <a-col :span="6"> 基金代码：<a-input v-model:value="value" /> </a-col>
      <a-col :span="6">
        基金类型：
        <a-dropdown>
          <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
            下拉选择 <DownOutlined />
          </a>
          <template #overlay>
            <a-menu @click="onClickFundType">
              <a-menu-item key="1"> 股票型基金 </a-menu-item>
              <a-menu-item key="2"> 债券型基金 </a-menu-item>
              <a-menu-item key="3"> 货币型基金 </a-menu-item>
              <a-menu-item key="4"> 混合型基金 </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-col>
      <a-col :span="6">
        所属行业：<a-dropdown>
          <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
            下拉选择 <DownOutlined />
          </a>
          <template #overlay>
            <a-menu @click="onClickIndustryType">
              <a-menu-item key="1"> 新能源 </a-menu-item>
              <a-menu-item key="2"> 白酒 </a-menu-item>
              <a-menu-item key="3"> 半导体 </a-menu-item>
              <a-menu-item key="4"> 电子 </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown></a-col
      >
      <a-col :span="6">
        <a-button type="primary"> 推荐相似基金 </a-button>
      </a-col>
    </a-row>
    <a-row>
      <div style="width: 20px; height: 600px">
        <div style="display: inline-block; height: 300px; margin-top: 60px">
          <a-slider
            vertical
            v-model:value="threshold"
            :min="0"
            :max="10"
            :step="0.001"
          />
        </div>
      </div>
      <a-col
        style="
          width: 1073px;
          height: 600px;
          border: 2px solid lightseagreen;
          margin: 10px;
          margin-left: 10px;
        "
      >
        <fundStarlitSky :threshold="threshold" />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { DownOutlined } from "@ant-design/icons-vue";
import fundStarlitSky from "@/components/Overview/fundStarlitSky";

export default {
  name: "OverView",
  data() {
    return {
      value: 510310,
      threshold: 0,
    };
  },
  components: {
    DownOutlined,
    fundStarlitSky,
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
