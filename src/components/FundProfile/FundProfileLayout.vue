<template>
  <div
    class="container"
    ref="container"
    id="container"
    @scroll="handleProfileScroll"
  >
    <div class="line" id="line"></div>
    <div class="title">
      <svg class="icon menuIcon" aria-hidden="true">
        <use xlink:href="#iconxitongcaidan"></use>
      </svg>
      <text>Funds</text>
    </div>
    <div class="fund-profiles" id="fund_profiles" v-if="refresh">
      <FundProfile
        :ref="item"
        :fundId="item"
        :fundIds="fundsID"
        :startDate="start_date"
        :endDate="end_date"
        :boxHeight="eachHeight"
        :fundLikeScore="fundsLikeScore[item]"
        :key="item"
        @handleScroll="handleScroll"
        @updateWidth="updateWidth"
        v-for="item in fundsID"
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
    start_date: String,
    end_date: String,
    unranksStart: Number, //未排序数组的起点
    lineStartYPos: Array,
  },
  watch: {
    start_date: function(newVal, oldVal) {
      console.log("In FundProfileLayout: ", newVal);
      // 保存原分数
      if (oldVal !== null) {
        for (let i = 0; i < this.fundsID.length; i++) {
          this.fundsLikeScore[this.fundsID[i]] = this.$refs[
            this.fundsID[i]
          ].thisFundLikeScore;
        }
      }
      //限制第一次是因为id获取慢于起止点，会报错
      if (!this.isFirst) {
        this.getViewFunds();
      }
    },
    fundsID: function(newVal, oldVal) {
      console.log(`new fundsID: ${newVal}`);
      // this.totalPage = newVal.length / this.size;
      // this.updateViewFunds();
      // this.updateViewFundsID("down");
      // 保存原分数
      if (oldVal !== null) {
        for (let i = 0; i < oldVal.length; i++) {
          this.fundsLikeScore[oldVal[i]] = this.$refs[
            oldVal[i]
          ].thisFundLikeScore;
        }
        this.historyFundsLikeScore.push(this.fundsLikeScore);
      }
      // console.log(this.historyFundsLikeScore);
      if (this.isFirst) {
        this.isFirst = false;
      }
      // 当前呈现的所有基金数组变了，必须强制重新渲染每个组件
      this.refresh = false;
      this.$nextTick(() => {
        this.refresh = true;
      });
      // this.isRequesting = true;
      // this.getViewFunds();
      // 重置基金喜好分数
      // this.fundsLikeScore = {};
      // for (let i = 0; i < newVal.length; i++)
      //   this.fundsLikeScore[newVal[i]] = 0;
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
            Math.max(document.getElementById("fund_profiles").scrollHeight, 905)
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
  },
  data() {
    return {
      // fundData: undefined,
      // viewFundsID: [],
      // viewFundProfilesID: [],
      // donutChartData: [],
      isRequesting: true,
      isFirst: true,
      eachHeight: 270,
      fundsLikeScore: {},
      historyFundsLikeScore: [],
      refresh: true,
      svg: null, // 用于绘制rank与profile之间的连接线
      lineStartYPos_n: [],
      lineEndYPos: [],
      // 无限下滑相关参数
      // size: 4, // 单页个数
      // page: 0, // 当前页码
      // totalPage: 10, // 后台总页数
      // lastScrollTop: 0, // 上次滚动条距顶部距离
      // initScrollTop: 0,
      // lastPaddingTop: 0,
    };
  },
  components: {
    FundProfile,
  },
  methods: {
    // handleTotalScroll() {
    //   const scrollTop = this.$refs["container"].scrollTop;
    //   const windowHeight = this.$refs["container"].clientHeight;
    //   const scrollHeight = this.$refs["container"].scrollHeight;
    //   if (scrollTop + windowHeight >= scrollHeight - windowHeight) {
    //     this.page++;
    //     this.updateViewFunds();
    //   }
    //   if (scrollTop !== 0)
    //     this.initScrollTop = this.$refs["container"].scrollTop;
    // },
    // updateViewFunds() {
    //   this.viewFundsID.push(
    //     ...this.fundsID.slice(
    //       this.page * this.size,
    //       (this.page + 1) * this.size
    //     )
    //   );
    //   this.getViewFunds();
    // },
    // handleTotalScroll() {
    //   // 处理无限下滑
    //   const scrollTop = this.$refs["container"].scrollTop;
    //   const windowHeight = this.$refs["container"].clientHeight;
    //   const scrollHeight = this.$refs["container"].scrollHeight;
    //   if (this.lastScrollTop > scrollTop) {
    //     // 上滑
    //     // 若滚动条距顶部小于等于空白区，更新顶部（预留windowHeight作为反应时间）
    //     if (
    //       this.page > 2 &&
    //       (this.page - 2) * this.size * this.eachHeight >= scrollTop
    //     ) {
    //       this.updateViewFundsID("up");
    //     }
    //   } else {
    //     // 下滑
    //     // 同样预留windowHeight作为反应时间
    //     if (
    //       this.page < this.totalPage &&
    //       scrollTop + windowHeight >= scrollHeight
    //     ) {
    //       this.updateViewFundsID("down");
    //     }
    //   }
    //   this.lastScrollTop = scrollTop;
    // },
    // updateViewFundsID(dir) {
    //   console.log(dir);
    //   if (dir === "up") {
    //     this.viewFundsID.unshift(
    //       ...this.fundsID.slice(
    //         (this.page - 3) * this.size,
    //         (this.page - 2) * this.size
    //       )
    //     );
    //     d3.select("#container").style(
    //       "padding-top",
    //       this.eachHeight * (this.page - 3) * this.size + "px"
    //     );
    //     this.viewFundsID.splice(
    //       this.viewFundsID.length - this.size,
    //       this.viewFundsID.length
    //     );
    //     this.page--;
    //   } else {
    //     this.viewFundsID.push(
    //       ...this.fundsID.slice(
    //         this.page * this.size,
    //         (this.page + 1) * this.size
    //       )
    //     );
    //     if (this.page > 1) {
    //       this.viewFundsID.splice(0, this.size);
    //       d3.select("#container").style(
    //         "padding-top",
    //         this.eachHeight * (this.page - 1) * this.size + "px"
    //       );
    //     }
    //     this.page++;
    //   }
    //   console.log(this.viewFundsID);
    //   this.lastPaddingTop = parseFloat(
    //     d3.select("#container").style("padding-top")
    //   );
    //   console.log(this.lastPaddingTop);
    //   this.initScrollTop =
    //     this.$refs["container"].scrollTop + this.lastPaddingTop;
    //   this.getViewFunds();
    // },
    // getViewFunds() {
    //   this.isRequesting = true;
    //   DataService.post(
    //     "get_view_funds",
    //     {
    //       f_ids: this.viewFundsID,
    //       start_date: this.start_date,
    //       end_date: this.end_date,
    //     },
    //     (data) => {
    //       console.log("get_view_funds", data);
    //       // this.fundData = data;
    //       this.donutChartData = [];
    //       for (let i = 0; i < this.viewFundsID.length; i++) {
    //         const totalData = data["total"][this.viewFundsID[i]];
    //         let thisDonutChartData = [];
    //         let sum = 0;
    //         for (let key in totalData) {
    //           thisDonutChartData.push({
    //             name: key,
    //             value: totalData[key],
    //           });
    //           sum += totalData[key];
    //         }
    //         thisDonutChartData.push({
    //           name: "empty",
    //           value: { norm: 13 - sum, value: 13 - sum },
    //         });
    //         this.donutChartData.push(thisDonutChartData);
    //       }
    //       console.log(this.donutChartData);
    //       this.isRequesting = false;
    //       this.$nextTick(function() {
    //         // d3.select("#container").style(
    //         //   "padding-top",
    //         //   this.lastPaddingTop + "px"
    //         // );
    //         console.log(this.initScrollTop);
    //         this.$refs["container"].scrollTop = this.initScrollTop;
    //       });
    //     }
    //   );
    // },
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
    getHistoryFundsLikeScore() {
      // 点了提交，主动获取每个基金此时的score
      for (let i = 0; i < this.fundsID.length; i++) {
        this.fundsLikeScore[this.fundsID[i]] = this.$refs[
          this.fundsID[i]
        ].thisFundLikeScore;
      }
      this.historyFundsLikeScore.push(this.fundsLikeScore);
      return this.historyFundsLikeScore;
    },
    calcLineEndYPos() {
      this.lineEndYPos = [];
      for (let i = 0; i < this.fundsID.length; i++) {
        this.lineEndYPos.push(
          5 + 33 + 30 * (i + 1) + i * this.eachHeight + this.eachHeight / 2
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
  position: relative;
  margin-top: 5px;
  width: 100%;
  /* border: 1px solid black; */
  height: 905px;
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
  top: 33px;
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
