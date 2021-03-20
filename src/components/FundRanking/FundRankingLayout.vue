<template>
  <div class="container">
    <div class="title">
      <svg class="icon menuIcon" aria-hidden="true">
        <use xlink:href="#iconxitongcaidan"></use>
      </svg>
      <text>Funds Ranking</text>
    </div>
    <div class="search-box">
      <a-form :label-col="{ span: 9 }" :wrapper-col="{ span: 14 }">
        <a-form-item label="Fund Code">
          <a-input
            id="fundCode"
            :placeholder="fundPlaceHolder"
            :disabled="isFundDisable"
            @change="handleFundCodeChange"
          ></a-input>
        </a-form-item>
        <a-form-item label="Manager Code">
          <a-input
            id="managerCode"
            :placeholder="managerPlaceHolder"
            :disabled="isManagerDisable"
            @change="handleManagerCodeChange"
          ></a-input>
        </a-form-item>
        <a-form-item>
          <a-button
            class="submit-btn"
            type="primary"
            html-type="submit"
            @click="handleSubmit"
          >
            <text>Submit</text>
          </a-button>
        </a-form-item>
      </a-form>
    </div>
    <a-divider />
    <a-spin v-if="isRequestRanking" size="large" tip="Loading..." />
    <div
      class="ranking"
      ref="ranking"
      @scroll="handleScroll"
      v-if="!isRequestRanking"
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
              :fundData="rankFundsData[item]"
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
            <input
              type="checkbox"
              style="height: 127px"
              :value="item"
              :id="item + '_checkbox'"
              @change="handleCheckbox"
            />
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
            {{ rankNumber(index) }}
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
    isRequestRanking: Boolean,
    searchFundsID: Array, // 搜索得到的基金
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
      fundPlaceHolder: "",
      managerPlaceHolder: "",
      isFundDisable: false,
      isManagerDisable: false,
    };
  },
  watch: {
    isRequestRanking(val) {
      if (val === true) {
        this.showFundProfileIDs = this.lineStartYPos = [];
        this.isFundProfileIDChecked = new Map();
        this.$emit(
          "showFundIDChange",
          this.showFundProfileIDs,
          this.lineStartYPos
        );
      }
    },
  },
  mounted: function() {},
  methods: {
    rankNumber(index) {
      if (index < this.searchFundsID.length) {
        return "S";
      } else {
        return index + 1 - this.searchFundsID.length;
      }
    },
    handleFundCodeChange(e) {
      // console.log(e.target.value);
      this.queryParam.fundCode = e.target.value;
      if (e.target.value !== "") {
        this.isManagerDisable = true;
        this.managerPlaceHolder = "Cannot search both.";
      } else {
        this.isManagerDisable = false;
        this.managerPlaceHolder = "";
      }
    },
    handleManagerCodeChange(e) {
      // console.log(e.target.value);
      this.queryParam.managerCode = e.target.value;
      if (e.target.value !== "") {
        this.isFundDisable = true;
        this.fundPlaceHolder = "Cannot search both.";
      } else {
        this.isFundDisable = false;
        this.fundPlaceHolder = "";
      }
    },
    handleSubmit() {
      // console.log(this.queryParam);
      if (this.queryParam.fundCode !== "") {
        this.$emit("searchFundCode", this.queryParam.fundCode);
      } else if (this.queryParam.managerCode !== "") {
        this.$emit("searchManagerCode", this.queryParam.managerCode);
      } else {
        this.$message.warn("At least enter one field to search!");
      }
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
            i * 127 + 63.5 + 127 - 38 - this.$refs["ranking"].scrollTop
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
    handleChangeHistoryIndex(val) {
      this.showFundProfileIDs = val;
      for (let i = 0; i < this.rankFundsID.length; i++) {
        let isChecked =
          this.showFundProfileIDs.indexOf(this.rankFundsID[i]) !== -1;
        document.getElementById(
          `${this.rankFundsID[i]}_checkbox`
        ).checked = isChecked;
        this.isFundProfileIDChecked.set(this.rankFundsID[i], isChecked);
        // 手动更新下lineStartYPos
        this.lineStartYPos = [];
        this.rankFundsID.forEach((d, i) => {
          if (this.isFundProfileIDChecked.get(d)) {
            this.lineStartYPos.push(
              i * 127 + 63.5 + 127 - 38 - this.$refs["ranking"].scrollTop
            );
          }
        });
        this.$emit("lineStartYPosChange", this.lineStartYPos);
      }
    },
  },
};
</script>

<style scoped>
.container {
  background: #ffffff;
  width: 100%;
  /* box-shadow: 12px 2px 44px 0 rgba(0, 0, 0, 0.05); */
  /* border: 1px solid black; */
}

.title {
  display: flex;
  margin-left: 10px;
}

.title text {
  font-family: PingFangSC-Semibold;
  font-size: 19px;
  font-weight: 800;
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

.submit-btn {
  border-radius: 6px;
}

.submit-btn text {
  font-size: 13px;
  font-family: "PingFangSC-Semibold";
  letter-spacing: 0;
  color: #ffffff;
  margin: auto;
}

.ranking {
  max-height: 982px;
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
