<template>
  <div class="container">
    <div class="title">
      <svg class="icon menuIcon" aria-hidden="true">
        <use xlink:href="#iconxitongcaidan"></use>
      </svg>
      <text>Fund Ranking</text>
    </div>
    <div class="search-box">
      <a-form :label-col="{ span: 9 }" :wrapper-col="{ span: 14 }">
        <a-form-item label="Fund Code">
          <a-input v-model="queryParam.fundCode"></a-input>
        </a-form-item>
        <a-form-item label="Manager Code">
          <a-input v-model="queryParam.managerCode"></a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" @click="handleSubmit">
            Submit
          </a-button>
        </a-form-item>
      </a-form>
    </div>
    <a-divider />
    <a-spin v-if="!rankFundsID" size="large" tip="Loading..." />
    <div
      class="ranking"
      ref="ranking"
      @scroll="handleScroll"
      v-if="rankFundsID"
    >
      <a-row>
        <a-col :span="10">
          <a-row type="flex" justify="center">Fund</a-row>
          <a-row
            type="flex"
            justify="center"
            :key="item + '_chart'"
            v-for="item in rankFundsID"
          >
            <NightingaleRoseChart
              :fundId="item"
              :start_date="start_date"
              :end_date="end_date"
            />
          </a-row>
        </a-col>
        <a-col :span="7">
          <a-row type="flex" justify="center">Compare</a-row>
          <a-row
            type="flex"
            justify="center"
            :key="item + '_checkbox'"
            v-for="item in rankFundsID"
          >
            <a-checkbox :value="item" @change="handleCheckbox"></a-checkbox>
          </a-row>
        </a-col>
        <a-col :span="7">
          <a-row type="flex" justify="center">Rank</a-row>
          <a-row
            type="flex"
            justify="center"
            :key="item + '_rank'"
            v-for="(item, index) in rankFundsID"
          >
            {{ index + 1 }}
          </a-row>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import NightingaleRoseChart from "@/components/FundRanking/NightingaleRoseChart";

export default {
  name: "FundRankingLayout",
  components: {
    NightingaleRoseChart,
  },
  props: {
    rankFundsID: Object,
    rankFundsData: Object,
    start_date: String,
    end_date: String,
  },
  data() {
    return {
      queryParam: {
        fundCode: "",
        managerCode: "",
      },
      showFundProfileIDs: [],
      lineStartYPos: [], // 连线起始坐标
      isFundProfileIDChecked: new Map(),
      lastScrollTop: 0,
    };
  },
  computed: {},
  mounted: function() {},
  methods: {
    handleSubmit() {
      console.log(this.queryParam);
    },
    handleCheckbox(e) {
      // 设置Map的目的是为了保证右边展示的顺序与左边rank的顺序始终一致
      this.isFundProfileIDChecked.set(e.target.value, e.target.checked);
      this.showFundProfileIDs = [];
      this.lineStartYPos = [];
      this.rankFundsID.forEach((d, i) => {
        if (this.isFundProfileIDChecked.get(d)) {
          this.showFundProfileIDs.push(d);
          this.lineStartYPos.push(
            i * 127 + 63.5 + 127 + 24 - this.$refs["ranking"].scrollTop
          );
        }
      });
      // console.log(this.showFundProfileIDs);
      this.$emit(
        "showFundIDChange",
        this.showFundProfileIDs,
        this.lineStartYPos
      );
    },
    handleScroll() {
      this.lineStartYPos = this.lineStartYPos.map(
        (d) => d + this.lastScrollTop - this.$refs["ranking"].scrollTop
      );
      this.lastScrollTop = this.$refs["ranking"].scrollTop;
      this.$emit("lineStartYPosChange", this.lineStartYPos);
    },
  },
};
</script>

<style scoped>
.title {
  display: flex;
  margin-left: 10px;
}

.title text {
  font-family: PingFangSC-Semibold;
  font-size: 19px;
  color: #185bbd;
  letter-spacing: 0;
  white-space: nowrap;
  margin-top: 5px;
  margin-left: 5px;
}

.menuIcon {
  color: #185bbd;
  font-size: 23px;
  bottom: 4px;
}

.search-box {
  margin-top: 10px;
}

.ranking {
  max-height: 995px;
  overflow-y: auto;
  overflow-x: hidden;
  font-size: 15px;
  line-height: 127px;
  direction: rtl;
}

/* 设置滚动条的样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
/* 滚动槽 */
::-webkit-scrollbar-track {
  border-radius: 10px;
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.1);
}
</style>
