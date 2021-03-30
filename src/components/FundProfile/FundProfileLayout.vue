<template>
  <div
    class="container"
    ref="container"
    id="container"
    @scroll="handleProfileScroll"
  >
    <div class="line" id="line"></div>
    <!-- <div class="title">
      <svg class="icon menuIcon" aria-hidden="true">
        <use xlink:href="#iconxitongcaidan"></use>
      </svg>
      <text>Funds</text>
    </div> -->
    <div class="fund-profiles" id="fund_profiles" v-if="refresh">
      <FundProfile
        :index="index"
        :ref="item"
        :fundId="item"
        :fundIds="fundsID"
        :startDate="start_date"
        :endDate="end_date"
        :boxHeight="eachHeight"
        :fundLikeScore="fundsLikeScore_n[item]"
        :userSectors="userSectors"
        :key="item"
        @handleScroll="handleScroll"
        @updateWidth="updateWidth"
        @updateMargin="updateMargin"
        @turn="handleTurn"
        @changeManagerID="handleChangeManagerID"
        v-for="(item, index) in fundsID"
      >
      </FundProfile>
    </div>
  </div>
</template>
<script>
import * as d3 from "d3";
import FundProfile from "@/components/FundProfile/FundProfile";
import DataService from "@/utils/data-service";

export default {
  name: "FundProfileLayout",
  props: {
    fundsID: Array,
    fundsLikeScore: Object,
    start_date: String,
    end_date: String,
    lineStartYPos: Array,
    isTotalChange: Boolean,
    userSectors: Array,
  },
  watch: {
    fundsID: function(newVal, oldVal) {
      // console.log(`new fundsID: ${newVal}`);
      if (newVal.length === 0) {
        if (this.svg) this.svg.select("#connectLines").remove();
        this.lineStartYPos_n = this.lineEndYPos = [];
      }
      if (this.isFirst) {
        this.isFirst = false;
      }
      if (this.isTotalChange) {
        // 重置基金喜好分数
        this.historyFundsLikeScore = [];
      }
      this.fundsLikeScore_n = {};
      for (let i = 0; i < newVal.length; i++)
        this.fundsLikeScore_n[newVal[i]] = this.fundsLikeScore[newVal[i]];
      // 当前呈现的所有基金数组变了，必须强制重新渲染每个组件
      this.refresh = false;
      this.$nextTick(() => {
        this.refresh = true;
      });
    },
    refresh: function(val) {
      this.$nextTick(() => {
        if (val) {
          if (this.svg === null) {
            this.svg = d3
              .select("#line")
              .append("svg")
              .attr("width", 30);
          }
          this.svg.attr(
            "height",
            Math.max(document.getElementById("fund_profiles").scrollHeight, 965)
          );
          this.drawConnectLines();
        }
      });
    },
    lineStartYPos: function(val) {
      // console.log("ypos change: ", val);
      this.lineStartYPos_n = val.map(
        (d) => d + document.getElementById("container").scrollTop
      );
      if (this.svg !== null) this.drawConnectLines();
    },
    isTotalChange: function(val) {
      if (val) this.historyFundsLikeScore = [];
    },
  },
  data() {
    return {
      isRequesting: true,
      isFirst: true,
      eachHeight: 225,
      fundsLikeScore_n: this.fundsLikeScore,
      historyFundsLikeScore: [],
      refresh: true,
      svg: null, // 用于绘制rank与profile之间的连接线
      lineStartYPos_n: [],
      lineEndYPos: [],
    };
  },
  components: {
    FundProfile,
  },
  methods: {
    handleProfileScroll() {
      this.lineStartYPos_n = this.lineStartYPos.map(
        (d) => d + document.getElementById("container").scrollTop
      );
      this.drawConnectLines();
    },
    handleScroll(value) {
      this.$emit("updateScrollLeft", value);
      for (let i = 0; i < this.fundsID.length; i++)
        this.$refs[this.fundsID[i]].handleScroll(value);
    },
    updateWidth(value) {
      this.$emit("updateWidth", value);
    },
    updateMargin(value) {
      this.$emit("updateMarginLeft", value);
    },
    handleTurn(value, callID) {
      if (value) {
        for (let i = 0; i < this.fundsID.length; i++)
          if (this.fundsID[i] !== callID)
            this.$refs[this.fundsID[i]].turnClockwise(true);
      } else {
        for (let i = 0; i < this.fundsID.length; i++)
          if (this.fundsID[i] !== callID)
            this.$refs[this.fundsID[i]].turnCounterClockwise(true);
      }
    },
    handleChangeManagerID(newVal, oldVal) {
      this.$emit("changeManagerID", newVal, oldVal);
    },
    saveCurFundsLikeScore() {
      if (this.fundsID.length < 2) return 1;
      let isAllZero = true;
      for (let i = 0; i < this.fundsID.length; i++) {
        if (this.$refs[this.fundsID[i]].thisFundLikeScore !== 0)
          isAllZero = false;
        this.fundsLikeScore_n[this.fundsID[i]] = this.$refs[
          this.fundsID[i]
        ].thisFundLikeScore;
      }
      if (isAllZero) return 2; // 不允许一个分都不打
      // 检测此次比较是否已存入history，也就是是否保存后重新打分，这种情况视为更新之前的记录
      let isExist = false,
        index = -1;
      for (let i = 0; i < this.historyFundsLikeScore.length && !isExist; i++) {
        if (
          JSON.stringify(Object.keys(this.fundsLikeScore_n)) ===
          JSON.stringify(Object.keys(this.historyFundsLikeScore[i]))
        ) {
          // 一般是不能采用这种比较方式，但此处fundsID的顺序一定是一样的，所以可以这么比
          isExist = true;
          index = i;
          break;
        }
      }
      if (!isExist) {
        this.historyFundsLikeScore.push(this.fundsLikeScore_n);
        return 0; // 新纪录
      } else {
        this.historyFundsLikeScore[index] = this.fundsLikeScore_n;
        return index + 100; // 更新已有记录
      }
    },
    calcLineEndYPos() {
      this.lineEndYPos = [];
      for (let i = 0; i < this.fundsID.length; i++) {
        this.lineEndYPos.push(
          5 + 20 * (i + 1) + i * this.eachHeight + this.eachHeight / 2
        );
      }
    },
    drawConnectLines() {
      this.svg.select("#connectLines").remove();
      const gConnectLines = this.svg.append("g").attr("id", "connectLines");
      this.calcLineEndYPos();
      for (let i = 0; i < this.lineStartYPos_n.length; i++) {
        gConnectLines
          .append("path")
          .attr("fill", "none")
          .attr("stroke", "#979797")
          .attr(
            "d",
            `M 0 ${this.lineStartYPos_n[i]} C 15 ${this.lineStartYPos_n[i]} 15 ${this.lineEndYPos[i]} 30 ${this.lineEndYPos[i]}`
          );
      }
    },
  },
};
</script>

<style scoped>
.container {
  background: #ffffff;
  position: relative;
  margin-top: 50px;
  width: 100%;
  height: 1003px;
  /* border: 1px solid black; */
  overflow-y: auto;
  overflow-x: hidden;
}

.line {
  position: absolute;
}

.title {
  position: absolute;
  display: flex;
  left: 20px;
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

.fund-profiles {
  position: absolute;
  width: calc(100% - 30px);
  left: 30px;
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
