<template>
  <div class="container">
    <div class="top">
      <el-input
        style="width:200px;margin-bottom:5px"
        v-model="search.trader_acount"
        clearable
        placeholder="请输入操盘账号"
      ></el-input>
      <el-input
        style="width:200px;margin-bottom:5px"
        v-model="search.real_name"
        clearable
        placeholder="客户名称"
      ></el-input>
      <el-button
        size="small"
        type="primary"
        icon="el-icon-search"
        class="handleSearch"
        @click="handleSearch()"
      >查询</el-button>
      <el-button
        size="small"
        type="success"
        icon="el-icon-edit"
        class="handleSearch"
        @click="close()"
      >删除自有区</el-button>
       <el-switch
        style="margin-left:10px"
        v-model="switchType"
        active-color="#ff4949"
        inactive-color="#13ce66"
        @change="switchBtn(switchType)"
        active-text="开启刷新"
        inactive-text="关闭刷新"
      ></el-switch>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      max-height="400"
      @selection-change="handleSelectionChange"
      @row-click="btnList"
    >
      <el-table-column type="selection" width="50" align="center"></el-table-column>
      <el-table-column prop="trader_acount" label="操盘账号" align="center"></el-table-column>
      <el-table-column prop="realname" label="客户名称" align="center"></el-table-column>
      <el-table-column prop="all_amount" label="账户余额" align="center"></el-table-column>
      <el-table-column prop="amount" label="可用资金" align="center"></el-table-column>
      <el-table-column prop="cash_deposit_value" label="持仓保证金" align="center"></el-table-column>
      <el-table-column prop="freeze_amount" label="冻结资金" align="center"></el-table-column>
      <el-table-column prop="freeze_cash_deposit_value" label="冻结保证金" align="center"></el-table-column>
      <el-table-column label="持仓盈亏" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.profit_loss == 0" style="color:#222222">{{scope.row.profit_loss}}</div>
          <div v-if="scope.row.profit_loss > 0" style="color:#F56C6C">{{scope.row.profit_loss}}</div>
          <div v-if="scope.row.profit_loss < 0" style="color:#67C23A">{{scope.row.profit_loss}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="day_end_profit_loss_amount" label="平仓盈亏" align="center"></el-table-column>
      <el-table-column prop="day_service_fee" label="手续费" align="center"></el-table-column>
      <el-table-column prop="day_inp_amount" label="入金" align="center"></el-table-column>
      <el-table-column prop="day_out_amount" label="出金" align="center"></el-table-column>
      <el-table-column prop="compulsory_sell_amount" label="强制平仓线" align="center"></el-table-column>
      <el-table-column prop="current_compulsory_sell_rate" label="风险率" align="center"></el-table-column>
      <el-table-column prop="all_end_profit_loss_amount" label="总盈亏" align="center"></el-table-column>
      <el-table-column prop="all_service_fee" label="总手续费" align="center"></el-table-column>
      <el-table-column prop="all_inp_amount" label="总入金" align="center"></el-table-column>
      <el-table-column prop="all_out_amount" label="总出金" align="center"></el-table-column>
      <p
        slot="append"
        v-if="loginType"
        style="text-align:center; line-height:40px;cursor:pointer;color:#409EFF"
        @click="pushData"
      >点击加载更多数据</p>
    </el-table>

    <!-- 分页 -->
    <!-- <pagination @page="handleSizeChange" @pagesize="handleCurrentChange" :pageData="pageData"></pagination> -->
    <div class="top" style="margin-top:20px">
      <el-input
        style="width:200px;margin-bottom:5px"
        v-model="search1.market_id"
        clearable
        placeholder="交易所"
      ></el-input>
      <el-input
        style="width:200px;margin-bottom:5px"
        v-model="search1.goods_name"
        clearable
        placeholder="合约名称"
      ></el-input>
      <el-input
        style="width:200px;margin-bottom:5px"
        v-model="search1.goods_code"
        clearable
        placeholder="合约代码"
      ></el-input>
      <el-select v-model="search1.type" placeholder="请选择方向">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button
        size="small"
        type="primary"
        icon="el-icon-search"
        class="handleSearch"
        @click="handleSearch1()"
      >查询</el-button>
      <el-button
        size="small"
        type="danger"
        icon="el-icon-edit"
        class="handleSearch"
        @click="close1()"
      >平仓</el-button>
    </div>
    <el-table
      :data="tableDatas"
      border
      style="width: 100%"
      max-height="400"
      @selection-change="handleSelectionChange1"
    >
      <el-table-column type="selection" width="50" align="center"></el-table-column>
      <el-table-column prop="trader_acount" label="操盘账号" align="center"></el-table-column>
      <el-table-column prop="real_name" label="客户名称" align="center"></el-table-column>
      <el-table-column prop="market_code" label="交易所" align="center"></el-table-column>
      <el-table-column prop="goods_name" label="合约名称" align="center"></el-table-column>
      <el-table-column prop="goods_code" label="合约代码" align="center"></el-table-column>
      <el-table-column label="方向" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.type == 1" style="color:#F56C6C">买涨</div>
          <div v-else style="color:#67C23A">买跌</div>
        </template>
      </el-table-column>
      <el-table-column prop="buy_price" label="成交价" align="center"></el-table-column>
      <el-table-column prop="buy_count" label="持仓量" align="center"></el-table-column>
      <el-table-column label="持仓盈亏" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.profit_loss == 0" style="color:#222222">{{scope.row.profit_loss}}</div>
          <div v-if="scope.row.profit_loss > 0" style="color:#F56C6C">{{scope.row.profit_loss}}</div>
          <div v-if="scope.row.profit_loss < 0" style="color:#67C23A">{{scope.row.profit_loss}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="cash_deposit_value" label="持仓保证金" align="center"></el-table-column>
      <el-table-column prop="stop_loss_amount" label="止损金额" align="center"></el-table-column>
      <el-table-column prop="stop_profit_amount" label="止盈金额" align="center"></el-table-column>
      <el-table-column prop="service_fee" label="手续费" align="center"></el-table-column>
      <el-table-column prop="buy_time" width="90" label="成交时间" align="center"></el-table-column>
      <el-table-column prop="stop_profit_rate" label="止盈率" align="center"></el-table-column>
      <el-table-column prop="stop_loss_rate" label="止损率" align="center"></el-table-column>
      <p
        slot="append"
        v-if="loginTypes"
        style="text-align:center; line-height:40px;cursor:pointer;color:#409EFF"
        @click="pushDatas"
      >点击加载更多数据</p>
    </el-table>
  </div>
</template>
<script>
import Pagination from "@/components/pagination";
import { getToken } from "@/utils/auth";

import {
  highPlaceCustomer,
  middlePlaceCustomer,
  lowPlaceCustomer,
  selfPlaceCustomer,
  customerBuyDetail,
  deleteSelfPlace,
  sell,
  addSelfPlace
} from "@/api/riskMonitoring/fundAccount";
export default {
  components: {
    pagination: Pagination
  },
  data() {
    return {
      //页面数据
      tableData: [],
      tableDatas: [],
      loginType: false,
      loginTypes: false,
      //分页
      pageData: {
        pageSizes: [10, 20],
        pageSize: 10,
        page: 1,
        last_page: 0,
        total: null,
        layout: "total, sizes, prev, pager, next, jumper"
      },
      pageDatas: {
        pageSizes: [10, 20],
        pageSize: 10,
        page: 1,
        last_page: 0,
        total: null,
        layout: "total, sizes, prev, pager, next, jumper"
      },
      load() {},
      //dialog信息
      dialog: {
        centerDialogVisible: false,
        dialogType: "",
        id: ""
      },
      //设置dialog信息
      guaranteeDialogs: {
        centerDialogVisible: false,
        id: ""
      },
      formData: {},
      search: {
        trader_acount: "",
        real_name: ""
      },
      search1: {
        customer_id: "",
        market_id: "",
        goods_name: "",
        goods_code: "",
        type: ""
      },
      options: [
        {
          value: "1",
          label: "买涨"
        },
        {
          value: "2",
          label: "买跌"
        }
      ],
      multipleSelection: [],
      multipleSelection1: [],
      switchType: false
    };
  },

  created() {
    this.getData();
  },
  methods: {
    //获取页面数据
    getData() {
      let data = {
        limit: this.pageData.pageSize,
        page: this.pageData.page,
        trader_acount: this.search.trader_acount,
        real_name: this.search.real_name
      };
      selfPlaceCustomer(data)
        .then(res => {
          if (res.code == 0) {
            this.tableData = res.data.data;
            this.pageData.page = res.data.current_page;
            this.pageData.pagesize = res.data.per_page;
            this.pageData.last_page = res.data.last_page;
            this.pageData.total = res.data.total;
            if (res.data.total == 0 || res.data.last_page == 1) {
              this.loginType = false;
            } else {
              this.loginType = true;
            }
          }
        })
        .then(() => {
          if (this.tableData.length > 0) {
            this.search1.customer_id = this.tableData[0].id;
            this.getChildrenData();
          } else {
            this.tableDatas = [];
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //开关
    switchBtn(e) {
      if (e) {
        this.time();
      } else {
        clearInterval(this.clearTime);
      }
    },
    time() {
      const that = this;
      var timer_num = 60;
      that.pageData.page = 1;
      that.clearTime = setInterval(function() {
        let data = {
          token: getToken(),
          limit: that.pageData.pageSize,
          page: that.pageData.page,
          trader_acount: that.search.trader_acount,
          real_name: that.search.real_name
        };
        timer_num--;
        if (timer_num == 0) {
          timer_num = 60;
          that.$axios
            .post("/api/risk/selfPlaceCustomer", data)
            .then(res => {
              if (res.data.code == 0) {
                that.tableData = [];
                that.tableData = res.data.data.data;
                that.pageData.page = res.data.data.current_page;
                that.pageData.pagesize = res.data.data.per_page;
                that.pageData.last_page = res.data.data.last_page;
                that.pageData.total = res.data.data.total;
                if (that.pageData.page == that.pageData.last_page) {
                  that.loginType = false;
                } else {
                  that.loginType = true;
                }
              }
            })
            .then(() => {
              if (that.tableData.length > 0) {
                that.search1.customer_id = that.tableData[0].id;
                that.getChildrenDatas();
              } else {
                that.tableDatas = [];
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      }, 1000);
    },
    //刷新获取详情
    getChildrenDatas() {
      let that = this;
      that.pageDatas.page = 1;
      let data = {
        token: getToken(),
        limit: that.pageDatas.pageSize,
        page: that.pageDatas.page,
        customer_id: that.search1.customer_id,
        market_code: that.search1.market_id,
        goods_name: that.search1.goods_name,
        goods_code: that.search1.goods_code,
        type: that.search1.type
      };
      that.$axios.post("/api/risk/customerBuyDetail", data).then(res => {
        if (res.data.code == 0) {
          if (res.data.data.total == 0 || res.data.data.last_page == 1) {
            that.loginTypes = false;
          } else {
            that.loginTypes = true;
          }
          that.tableDatas = [];
          that.tableDatas = res.data.data.data;
          that.pageDatas.page = res.data.data.current_page;
          that.pageDatas.pagesize = res.data.data.per_page;
          that.pageDatas.last_page = res.data.data.last_page;
          that.pageDatas.total = res.data.data.total;
        }
      });
    },
    //点击列表
    btnList(scope) {
      this.search1.customer_id = scope.id;
      this.search1.market_id = "";
      this.search1.goods_name = "";
      this.search1.goods_code = "";
      this.search1.type = "";
      (this.pageDatas = {
        pageSizes: [10, 20],
        pageSize: 10,
        page: 1,
        last_page: 0,
        total: null,
        layout: "total, sizes, prev, pager, next, jumper"
      }),
        this.getChildrenData();
    },
    //获取详情
    getChildrenData() {
      let data = {
        limit: this.pageDatas.pageSize,
        page: this.pageDatas.page,
        customer_id: this.search1.customer_id,
        market_code: this.search1.market_id,
        goods_name: this.search1.goods_name,
        goods_code: this.search1.goods_code,
        type: this.search1.type
      };
      customerBuyDetail(data).then(res => {
        if (res.code == 0) {
          if (res.data.total == 0 || res.data.last_page == 1) {
            this.loginTypes = false;
          } else {
            this.loginTypes = true;
          }
          this.tableDatas = res.data.data;
          this.pageDatas.page = res.data.current_page;
          this.pageDatas.pagesize = res.data.per_page;
          this.pageDatas.last_page = res.data.last_page;
          this.pageDatas.total = res.data.total;
        }
      });
    },
    //点击加载
    pushData() {
      this.pageData.page += 1;
      let data = {
        limit: this.pageData.pageSize,
        page: this.pageData.page,
        trader_acount: this.search.trader_acount,
        real_name: this.search.real_name
      };
      selfPlaceCustomer(data).then(res => {
        if (res.code == 0) {
          if (this.pageData.page == this.pageData.last_page) {
            this.loginType = false;
          } else {
            this.loginType = true;
          }
          res.data.data.forEach(result => {
            this.tableData.push(result);
          });
          this.pageData.page = res.data.current_page;
          this.pageData.pagesize = res.data.per_page;
          this.pageData.total = res.data.total;
        }
      });
    },
    //点击详情加载
    pushDatas() {
      this.pageDatas.page += 1;
      let data = {
        limit: this.pageDatas.pageSize,
        page: this.pageDatas.page,
        customer_id: this.search1.customer_id,
        market_code: this.search1.market_id,
        goods_name: this.search1.goods_name,
        goods_code: this.search1.goods_code,
        type: this.search1.type
      };
      customerBuyDetail(data).then(res => {
        if (res.code == 0) {
          if (this.pageDatas.page == this.pageDatas.last_page) {
            this.loginTypes = false;
          } else {
            this.loginTypes = false;
          }
          res.data.data.forEach(result => {
            this.tableDatas.push(result);
          });
          this.pageDatas.page = res.data.current_page;
          this.pageDatas.pagesize = res.data.per_page;
          this.pageDatas.total = res.data.total;
        }
      });
    },
    //删除自选区
    close() {
      if (this.multipleSelection == "") {
        this.$message({
          type: "info",
          message: "请选择客户"
        });
      } else {
        this.$confirm("是否删除自选区?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let str = this.multipleSelection.join(",");
            console.log(str);
            let data = {
              customer_id_str: str
            };
            deleteSelfPlace(data)
              .then(res => {
                if (res.code == 0) {
                  this.$message({
                    type: "success",
                    message: res.message || res.msg
                  });
                  this.multipleSelection.forEach(res => {
                    this.tableData.forEach((result, index) => {
                      if (res == result.id) {
                        this.tableData.splice(index, 1);
                      }
                    });
                  });
                  // this.getData();
                } else {
                  this.$message({
                    type: "info",
                    message: res.message || res.msg
                  });
                }
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
      }
    },
    //平仓1
    close1() {
      if (this.multipleSelection1 == "") {
        this.$message({
          type: "info",
          message: "请选择持仓明细"
        });
      } else {
        this.$confirm("是否平仓?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let str = this.multipleSelection1.join(",");
            console.log(str);
            let data = {
              buy_id_str: str
            };
            sell(data)
              .then(res => {
                if (res.code == 0) {
                  this.$message({
                    type: "success",
                    message: res.message || res.msg
                  });
                  this.getChildrenData();
                } else {
                  this.$message({
                    type: "info",
                    message: res.message || res.msg
                  });
                }
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
      }
    },
    //多选
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    },
    // 搜索
    handleSearch() {
       this.pageData.page = 1;
       this.pageData.total = null;
      this.getData();
    },
    //详情搜索
    handleSearch1() {
      this.getChildrenData();
    },
    //每页多少条
    handleCurrentChange(val) {
      this.pageData.page = 1;
      this.pageData.pageSize = val;
      this.getData();
    },
    //选取页数
    handleSizeChange(page) {
      this.search1.market_id = "";
      this.search1.goods_name = "";
      this.search1.goods_code = "";
      this.search1.type = "";
      this.pageData.page = page;
      this.getData();
    },
    //选取
    handleSelectionChange(val) {
      this.multipleSelection = [];
      val.forEach(res => {
        this.multipleSelection.push(res.id);
      });
    },
    //选取1
    handleSelectionChange1(val) {
      this.multipleSelection1 = [];
      val.forEach(res => {
        this.multipleSelection1.push(res.id);
      });
    }
  }
};
</script>
<style scoped>
.top {
  position: relative;
  /* height: 45px; */
}

.add {
  position: absolute;
  right: 0;
  top: 4px;
}
.pagination {
  text-align: right;
  padding: 10px;
}
.refresh {
  margin: 5px auto;
  display: block;
}
</style>