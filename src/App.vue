<template>
  <a-row>
    <a-col :span="5">
      <ControlPanelLayout
        v-on:updateFundWeight="handleUpdateFundWeight"
        :weights="incomingWeight"
      />
      <a-row>
        <MarketAnalysisLayout
          v-on:updateTimeBoundary="handleUpdateTimeBoundary"
          v-on:updateSector="handleUpdateSector"
        />
      </a-row>
      <a-row id="update_button_container">
        <a-button type="primary" @click="handleUpdateClick" id="update_button">
          <text>UPDATE</text>
        </a-button>
      </a-row>
    </a-col>

    <a-col :span="3">
      <!-- <a-row class="fund_list"> -->
      <!-- <svg class="icon fund_list_icon" aria-hidden="true">
          <use xlink:href="#iconfund"></use>
        </svg>
        <text>Fund Panel</text> -->
      <!-- </a-row> -->
      <a-row>
        <FundRankingLayout
          :rankFundsID="rankFundsID"
          :searchFundsID="searchFundsID"
          :searchFundsRank="searchFundsRank"
          :rankFundsData="rankFundsData"
          :start_date="startDate"
          :end_date="endDate"
          :isRequestRanking="isRequestRanking"
          ref="fundRankingLayout"
          @showFundIDChange="handleFundProfileIDChange"
          @lineStartYPosChange="handleLineStartYPosChange"
          @searchFundCode="handleSearchFundCode"
          @searchManagerCode="handleSearchManagerCode"
          @clearCurManagerIDs="handleClearManagerIDs"
        />
      </a-row>
    </a-col>
    <a-col :span="16">
      <!-- <a-row id="fund_list_extent">
        <text>FundPicker</text>
      </a-row> -->
      <a-row class="funds_title" style="margin-top: 0px">
        <svg class="icon menuIcon" aria-hidden="true">
          <use xlink:href="#iconxitongcaidan"></use>
        </svg>
        <text>Fund Manager</text>
      </a-row>
      <a-row>
        <div v-if="!isfundsID" id="fakeOverViewLayout"></div>
        <OverViewLayout
          v-if="isfundsID"
          :fundsData="fundsData"
          :totalWidth="totalWidth"
          :scrollLeft="scrollLeft"
          :marginLeft="marginLeft"
          :selectedManager="curManagerIDs"
          :isRefresh="isRefresh"
          v-on:updateScroll="handleUpdateScroll"
        />
      </a-row>
      <a-row class="funds_title">
        <svg class="icon menuIcon" aria-hidden="true">
          <use xlink:href="#iconxitongcaidan"></use>
        </svg>
        <text>Fund Comparison</text>
        <div id="comparison_buttons">
          <select
            style="
              width: 180px;
              margin-top: 2px;
              border-radius: 6px;
              cursor: pointer;
            "
            v-model="selectIndex"
          >
            <option value="-1" disabled>History Comparison</option>
            <option
              :value="index"
              :key="index"
              v-for="(item, index) in historyFundsLikeScore"
            >
              {{ index + 1 }}
            </option>
          </select>
          <a-button
            type="primary"
            class="button"
            @click="handleResetComparison"
          >
            <text>Reset</text>
          </a-button>
          <a-button type="primary" class="button" @click="handleSaveComparison">
            <text>Save Comparison</text>
          </a-button>
          <a-button type="primary" class="button" @click="handleUpdateWeight">
            <text>Update Weight</text>
          </a-button>
        </div>
      </a-row>
      <a-row>
        <FundProfileLayout
          :fundsID="showFundsID"
          :fundsLikeScore="showFundsLikeScore"
          :start_date="startDate"
          :end_date="endDate"
          :lineStartYPos="lineStartYPos"
          :isTotalChange="isTotalChange"
          :userSectors="userSectors"
          :searchManagerShowFundsManagerID="searchManagerShowFundsManagerID"
          ref="fundProfileLayout"
          @updateWidth="handleUpdateWidth"
          @updateScrollLeft="handleScrollLeft"
          @updateMarginLeft="handleMarginLeft"
          @changeManagerID="handleChangeManagerID"
        />
      </a-row>
    </a-col>
  </a-row>
</template>

<script>
import FundProfileLayout from "@/components/FundProfile/FundProfileLayout";
import ControlPanelLayout from "@/components/ControlPanel/layout";
import MarketAnalysisLayout from "@/components/MarketAnalysis/layout";
import OverViewLayout from "@/components/Overview/layout";
import FundRankingLayout from "@/components/FundRanking/FundRankingLayout";
import DataService from "@/utils/data-service";
import managerToIndex from "@/data/manager_index.json";
import indexToManager from "@/data/index_manager.json";

export default {
  name: "App",
  components: {
    ControlPanelLayout,
    MarketAnalysisLayout,
    OverViewLayout,
    FundProfileLayout,
    FundRankingLayout,
  },
  watch: {
    selectIndex: function(val) {
      if (val === -1) return;
      // 重置基金经理ID
      this.curManagerIDs = [];
      this.isTotalChange = false;
      this.showFundsLikeScore = this.historyFundsLikeScore[val];
      // this.showFundsID = Object.keys(this.historyFundsLikeScore[val]);
      // js对象不保留顺序，只能遍历以确保展示顺序
      let tmpShowFundsID = [];
      for (let i = 0; i < this.searchFundsID.length; i++)
        for (let j = 0; j < this.searchFundsID[i].length; j++)
          if (
            this.searchFundsID[i][j] in this.historyFundsLikeScore[val] &&
            tmpShowFundsID.indexOf(this.searchFundsID[i][j]) === -1
          )
            tmpShowFundsID.push(this.searchFundsID[i][j]);

      for (let i = 0; i < this.rankFundsID.length; i++) {
        if (
          this.rankFundsID[i] in this.historyFundsLikeScore[val] &&
          tmpShowFundsID.indexOf(this.rankFundsID[i]) === -1
        )
          tmpShowFundsID.push(this.rankFundsID[i]);
      }
      this.showFundsID = tmpShowFundsID;
      // 更新rank里面的选中情况
      this.$refs["fundRankingLayout"].handleChangeHistoryIndex(
        this.showFundsID
      );
    },
  },
  data() {
    return {
      fundsData: null,
      fundsID: null, // 给散点图的
      isfundsID: false, //决定显不显示散点图
      startDate: "20110331", // 默认起始值
      endDate: "20191231",
      lastStartDate: null,
      lastEndDate: null,
      //初始化权重
      userWeight: {
        one_quarter_return: "1.0",
        one_year_return: "1.0",
        three_year_return: "1.0",
        max_drop_down: "0.0",
        risk: "1.0",
        sharp_ratio: "0.0",
        information_ratio: "0.0",
        alpha: "0.0",
        beta: "0.0",
        size: "1.0",
        instl_weight: "0.0",
      },
      incomingWeight: null, //基金画像调整后传入的权重存放在这
      isRequestRanking: true,
      rankFundsID: null, // 给FundRanking
      searchFundsID: null, // 搜索得到的基金ID，二维数组，每行表示一次搜索
      searchFundsRank: null, // 搜索得到的基金排名，同样为二维数组
      rankFundsData: null,
      showFundsID: [], // 展示的FundProfile
      searchManagerShowFundsID: [], // 通过基金经理搜出来的，要将搜索的经理置顶
      searchManagerShowFundsManagerID: {},
      showFundsLikeScore: {},
      lineStartYPos: [], // 连线起始y坐标
      // 3个给气泡图的变量
      totalWidth: 1395,
      scrollLeft: 0,
      marginLeft: [],
      historyFundsLikeScore: [],
      historyFundsSelectGroup: [], // 搜索可能重复，确定到底是哪一个组内点击的基金, [{fundID0: g0, fundID1: g1, ...}, ...]
      selectIndex: -1, // 选中的历史记录index
      isTotalChange: true, // 为真表示是改变了所有rank的数据，要重置historyFundsLikeScore；为假则表示查看历史记录或者重新选取rank，无需重置
      userSectors: null,
      managerToFund: {},
      allFundsID: [],
      allFundsData: [],
      curManagerIDs: [], // 展示的基金经理ID
      isRefresh: 0, //提醒组件，展示的基金经理ID已改变
    };
  },
  computed: {},
  methods: {
    handleUpdateSector(sector) {
      this.userSectors = sector;
    },
    //点击update获得id
    handleUpdateClick() {
      this.isRequestRanking = true;
      this.showFundsID = [];
      this.curManagerIDs = [];
      this.searchManagerShowFundsID = [];
      this.searchManagerShowFundsManagerID = {};
      DataService.post(
        "get_fund_ranks",
        {
          weights: this.userWeight,
          start_date: this.startDate,
          end_date: this.endDate,
          sectors: this.userSectors,
        },
        (data) => {
          // console.log(data);
          this.allFundsID = data.ranking.map((d) => d[0]);
          this.allFundsData = data.ranking.map((d) => d[1]);
          this.searchFundsID = [];
          this.searchFundsRank = [];
          this.rankFundsID = this.allFundsID.slice(0, 20); // 默认展示前20个
          this.rankFundsData = {};
          this.allFundsID.forEach((d, i) => {
            this.rankFundsData[d] = this.allFundsData[i];
          });
          this.managerToFund = data.manager2fund;
          // 时间不变则保留历史记录
          if (
            this.startDate === this.lastStartDate &&
            this.endDate === this.lastEndDate
          ) {
            this.isTotalChange = false;
            this.historyFundsLikeScore = this.$refs[
              "fundProfileLayout"
            ].historyFundsLikeScore;
          } else {
            this.isTotalChange = true;
            // 重置历史记录
            this.historyFundsLikeScore = [];
          }
          this.selectIndex = -1;
          this.isRequestRanking = false;

          this.lastStartDate = this.startDate;
          this.lastEndDate = this.endDate;
        }
      );
    },
    // 从雷达图获取权重
    handleUpdateFundWeight(weight) {
      this.userWeight = weight;
    },

    getFundManagers() {
      // console.log("得到基金散点图和基金经理信息");
      //得到基金散点图和基金经理信息
      DataService.post(
        "get_manager_fund_local",
        {
          weights: this.userWeight,
          num_top: 10,
          f_ids: this.fundsID,
          start_date: this.startDate,
          end_date: this.endDate,
        },
        (data) => {
          // console.log("fundsData:", data);
          this.fundsData = data;
        }
      );
    },
    //第二部，选取时间段
    handleUpdateTimeBoundary(start, end) {
      this.startDate = start; //start发生变化，FundProfileLayout里的start也会改变，导致getviewFunds改变
      this.endDate = end;
      // if (this.fundsID && this.userWeight) {
      //   this.getFundManagers();
      // }
    },
    handleUpdateWidth(width) {
      this.totalWidth = width;
    },
    handleScrollLeft(value) {
      this.scrollLeft = value;
    },
    handleMarginLeft(value) {
      this.marginLeft = value;
    },
    handleUpdateScroll(value) {
      this.scrollLeft = value;
      this.$refs["fundProfileLayout"].handleScroll(value);
    },
    handleClearManagerIDs() {
      this.curManagerIDs = [];
    },
    handleChangeManagerID(newVal, oldVal) {
      if (oldVal === null) this.curManagerIDs.push(indexToManager[newVal]);
      else
        this.curManagerIDs.splice(
          this.curManagerIDs.indexOf(indexToManager[oldVal]),
          1,
          indexToManager[newVal]
        );
      ++this.isRefresh;
      // console.log("curManagerIDs:", this.curManagerIDs, this.isRefresh);
    },
    handleFundProfileIDChange(showFundsID, lineStartYPos) {
      this.isTotalChange = false;
      this.showFundsID = showFundsID;
      this.lineStartYPos = lineStartYPos;
      this.showFundsLikeScore = {};
      this.showFundsID.forEach((d) => {
        this.showFundsLikeScore[d] = 0;
      });
      this.selectIndex = -1;
      // 刷新散点图
      this.fundsID = showFundsID;
      if (this.fundsID.length > 0) {
        this.isfundsID = true;
        this.getFundManagers();
      } else {
        // this.getFundManagers();
        this.isfundsID = false;
      }
    },
    handleLineStartYPosChange(val) {
      this.lineStartYPos = val;
    },
    handleResetComparison() {
      this.selectIndex = -1;
      this.showFundsID = [];
      this.$refs["fundRankingLayout"].handleChangeHistoryIndex(
        this.showFundsID
      );
    },
    handleSaveComparison() {
      let res = this.$refs["fundProfileLayout"].saveCurFundsLikeScore();
      if (res === 1) {
        this.$message.warn("Please choose at least two funds to compare.");
        return;
      } else if (res === 2) {
        this.$message.warn("Please score at least one fund.");
        return;
      }
      this.historyFundsLikeScore = this.$refs[
        "fundProfileLayout"
      ].historyFundsLikeScore;
      if (res === 0) this.selectIndex = this.historyFundsLikeScore.length - 1;
      // 更新已有记录
      if (res >= 100) this.selectIndex = res - 100;
      this.$message.success("Saving successful!");
    },
    handleUpdateWeight() {
      if (this.historyFundsLikeScore.length === 0) {
        this.$message.warn("Please save at least one comparison first.");
        return;
      }
      this.$refs["fundProfileLayout"].saveCurFundsLikeScore();
      this.historyFundsLikeScore = this.$refs[
        "fundProfileLayout"
      ].historyFundsLikeScore;
      // console.log(this.historyFundsLikeScore);
      DataService.post(
        "update_weights",
        {
          weights: this.userWeight,
          pairs: this.historyFundsLikeScore,
          start_date: this.startDate,
          end_date: this.endDate,
        },
        (data) => {
          // console.log(data);
          for (let key in data) {
            data[key] = data[key].toFixed(4);
          }
          this.incomingWeight = data;
          // console.log("incomingWeight:", data);
          this.$message.success(
            "Weight updated! Please click the Update button."
          );
          // 重置各种参数
          this.rankFundsID = [];
          this.searchFundsID = [];
          this.searchFundsRank = [];
          this.rankFundsData = {};
          this.showFundsID = [];
          this.showFundsLikeScore = {};
          this.curManagerIDs = [];
          this.searchManagerShowFundsID = [];
          this.searchManagerShowFundsManagerID = {};
          // 重置历史记录
          this.historyFundsLikeScore = [];
          this.selectIndex = -1;
        }
      );
    },
    handleSearchFundCode(val) {
      this.isRequestRanking = true;
      let index = this.allFundsID.indexOf(val);
      // let rankIndex = this.rankFundsID.indexOf(val);
      // let searchIndex = this.searchFundsID.indexOf(val);
      // if (index === -1) {
      //   this.$message.warn("Nothing found in current Ranking.");
      // } else if (searchIndex !== -1) {
      //   this.$message.warn(
      //     `Fund ${val} is already in Rank ${this.searchFundsRank[searchIndex]}.`
      //   );
      // } else if (rankIndex !== -1) {
      //   this.$message.warn(
      //     `Fund ${val} is already in Rank ${rankIndex +
      //       1 -
      //       this.searchFundsID.length}.`
      //   );
      // } else {
      //   this.searchFundsID.unshift(this.allFundsID[index]);
      //   this.searchFundsRank.unshift(index + 1);
      //   this.rankFundsID.unshift(this.allFundsID[index]);
      //   this.rankFundsData[this.allFundsID[index]] = this.allFundsData[index];
      //   this.$message.success(`Fund ${val} has been added to current Ranking.`);
      // }
      if (index === -1) {
        this.$message.warn("Nothing found in current Ranking.");
      } else {
        this.searchFundsID.unshift([this.allFundsID[index]]);
        this.searchFundsRank.unshift([index + 1]);
        this.rankFundsData[this.allFundsID[index]] = this.allFundsData[index];
        this.$message.success(`Fund ${val} has been added to current Ranking.`);
      }
      // 不知为何，不设延迟的话FundRankingLayout里面无法watch到isRequestRanking的变化
      setTimeout(() => {
        this.isRequestRanking = false;
      }, 20);
    },
    handleSearchManagerCode(val) {
      this.isRequestRanking = true;
      if (!(val in this.managerToFund)) {
        this.$message.warn("Nothing found in current Ranking.");
      } else {
        // let addCnt = 0,
        //   existCnt = 0;
        // let thisManagerFundsID = this.managerToFund[val];
        // for (let i = 0; i < thisManagerFundsID.length; i++) {
        //   let index = this.allFundsID.indexOf(thisManagerFundsID[i]);
        //   let rankIndex = this.rankFundsID.indexOf(thisManagerFundsID[i]);
        //   let searchIndex = this.searchFundsID.indexOf(thisManagerFundsID[i]);
        //   if (index !== -1 && rankIndex === -1 && searchIndex === -1) {
        //     this.searchFundsID.unshift(thisManagerFundsID[i]);
        //     this.searchFundsRank.unshift(index + 1);
        //     this.rankFundsID.unshift(thisManagerFundsID[i]);
        //     this.rankFundsData[thisManagerFundsID[i]] = this.allFundsData[
        //       index
        //     ];
        //     addCnt++;
        //     this.$message.success(
        //       `Fund ${thisManagerFundsID[i]} has been added to current Ranking.`
        //     );
        //   } else if (index !== -1 && (rankIndex !== -1 || searchIndex !== -1)) {
        //     if (searchIndex !== -1) {
        //       this.$message.warn(
        //         `Fund ${thisManagerFundsID[i]} is already in Rank ${this.searchFundsRank[searchIndex]}.`
        //       );
        //     } else if (rankIndex !== -1) {
        //       this.$message.warn(
        //         `Fund ${thisManagerFundsID[i]} is already in Rank ${rankIndex +
        //           1 -
        //           this.searchFundsID.length}.`
        //       );
        //     }
        //     existCnt++;
        //   }
        // }
        // this.$message.success(
        //   `Funds related to Manager ${managerToIndex[val]} has all been added to current Ranking (${addCnt} added, ${existCnt} exist).`
        // );
        let thisManagerFundsID = this.managerToFund[val];
        let curSearchFundsID = [],
          curSearchFundsRank = [];
        for (let i = 0; i < thisManagerFundsID.length; i++) {
          let index = this.allFundsID.indexOf(thisManagerFundsID[i]);
          if (index !== -1) {
            this.rankFundsData[this.allFundsID[index]] = this.allFundsData[
              index
            ];
            curSearchFundsRank.push(index + 1);
          }
        }
        if (curSearchFundsRank.length !== 0) {
          curSearchFundsRank.sort((a, b) => a - b);
          for (let i = 0; i < curSearchFundsRank.length; i++) {
            curSearchFundsID.push(this.allFundsID[curSearchFundsRank[i] - 1]);
            this.searchManagerShowFundsManagerID[this.allFundsID[curSearchFundsRank[i] - 1]] = managerToIndex[val];
          }
          this.searchFundsID.unshift(curSearchFundsID);
          this.searchFundsRank.unshift(curSearchFundsRank);
          this.$message.success(
            `Funds related to Manager ${managerToIndex[val]} has all been added to current Ranking.`
          );
        } else {
          this.$message.warn("Nothing found in current Ranking.");
        }
      }
      setTimeout(() => {
        this.isRequestRanking = false;
      }, 20);
    },
  },
};
</script>

<style>
#app {
  text-align: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
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
#update_button_container {
  width: 535px;
  height: 80px;
  background: #ffffff;
  /* box-shadow: 12px 2px 44px 0 rgba(0, 0, 0, 0.05); */
}
#update_button_container #update_button {
  width: 89%;
  margin: auto;
  margin-top: 30px;
  border-radius: 6px;
}
#update_button_container #update_button text {
  font-size: 16px;
  font-family: "PingFangSC-Semibold";
  letter-spacing: 0;
}
.funds_title {
  position: absolute;
  display: flex;
  left: 20px;
  margin-top: 10px;
}
.funds_title text {
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
#comparison_buttons {
  display: flex;
  margin-left: 775px;
  margin-top: 5px;
}
#comparison_buttons .button {
  width: 140px;
  height: 30px;
  margin: auto;
  margin-left: 20px;
  border-radius: 6px;
}
#comparison_buttons .button text {
  font-size: 13px;
  font-family: "PingFangSC-Semibold";
  letter-spacing: 0;
  color: #ffffff;
  margin: auto;
}
.fund_list {
  background: #011f41;
  box-shadow: 1px -3px 4px 0 rgba(36, 15, 57, 0.1);
  height: 37px;
}

.fund_list text {
  font-family: PingFangSC-Semibold;
  font-size: 24px;
  color: #d0dde7;
  letter-spacing: 0;
  margin-left: 25px;
}

.fund_list .fund_list_icon {
  position: relative;
  font-size: 19px;
  top: 3px;
  left: 22px;
}
#fund_list_extent {
  height: 37px;
  width: 1706.66px;
  background: #011f41;
  box-shadow: 1px -3px 4px 0 rgba(36, 15, 57, 0.1);
}
#fund_list_extent text {
  font-family: PingFangSC-Semibold;
  font-size: 24px;
  color: #d0dde7;
  letter-spacing: 0;
  margin-left: 363px;
}
#fakeOverViewLayout {
  width: 1647px;
  height: 200px;
  margin: 44px 36px 0 30px;
}
</style>
