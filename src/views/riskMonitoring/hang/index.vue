<template>
  <div class="container">
    <div class="top">
      <el-input
        style="width:200px;margin-bottom:5px"
        v-model="search.trader_acount"
        clearable
        placeholder="操盘账号"
      ></el-input>
      <el-input
        style="width:200px;margin-bottom:5px"
        v-model="search.real_name"
        clearable
        placeholder="用户名字"
      ></el-input>
      <el-input
        style="width:200px;margin-bottom:5px"
        v-model="search.market_code"
        clearable
        placeholder="交易所"
      ></el-input>
      <el-input
        style="width:200px;margin-bottom:5px"
        v-model="search.goods_name"
        clearable
        placeholder="合约名称"
      ></el-input>
      <el-input
        style="width:200px;margin-bottom:5px"
        v-model="search.goods_code"
        clearable
        placeholder="合约代码"
      ></el-input>
      <el-select v-model="search.type" placeholder="请选择方向">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select v-model="search.status" placeholder="请选择状态">
        <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-button
        size="small"
        type="primary"
        icon="el-icon-search"
        class="handleSearch"
        @click="handleSearch()"
      >查询</el-button>
      <el-button
        size="small"
        type="danger"
        class="handleSearch"
        icon="el-icon-delete"
        @click="empty()"
      >清空</el-button>
      <el-button
        size="small"
        type="warning"
        icon="el-icon-edit"
        class="handleSearch"
        @click="close()"
      >撤单</el-button>
    </div>
    <el-table
      :data="tableData"
      border
      style="100%"
      :row-class-name="tableRowClassName"
      @selection-change="handleSelectionChange"
      empty-text="暂无数据"
      max-height="700"
    >
   
      <el-table-column type="selection" :selectable="selectable" width="50" align="center"></el-table-column>
      <el-table-column prop="goods_name" label="合约名称" align="center"></el-table-column>
      <el-table-column prop="goods_code" label="合约代码" align="center"></el-table-column>
      <el-table-column prop="trader_account" label="操盘账号" align="center"></el-table-column>
      <el-table-column prop="realname" label="客户名称" align="center"></el-table-column>
      <el-table-column prop="market_code" label="交易所" align="center"></el-table-column>
      <el-table-column prop="goods_name" label="合约名称" align="center"></el-table-column>
      <el-table-column prop="goods_code" label="合约代码" align="center"></el-table-column>
      <el-table-column prop="type_name" label="方向名称" align="center"></el-table-column>
      <el-table-column prop="buy_price" label="挂单价格" align="center"></el-table-column>
      <el-table-column prop="buy_count" label="挂单数量" align="center"></el-table-column>
      <el-table-column prop="stop_loss_amount" label="止损金额" align="center"></el-table-column>
 <el-table-column prop="stop_profit_amount" label="止盈金额" align="center"></el-table-column>
      <el-table-column prop="create_at" width="90"  label="下单时间" align="center"></el-table-column>
      <el-table-column prop="cancel_hang_buy_time" width="90" label="撤单时间" align="center"></el-table-column>
      <!-- <el-table-column prop="update_hang_buy_time" label="改单时间" align="center"></el-table-column> -->
      <el-table-column prop="status_name" label="状态" align="center"></el-table-column>
        <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="warning" size="mini" icon="el-icon-edit" @click="handleEdit(scope)">撤单</el-button>
         
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination @page="handleSizeChange" @pagesize="handleCurrentChange" :pageData="pageData"></pagination>
  </div>
</template>
<script>
import { getToken } from "@/utils/auth";
import { parseTime } from "@/utils/index";
import Pagination from "@/components/pagination";
import { sells, hangBuyList,cancelHangBuy } from "@/api/hang/hangList";
export default {
  components: {
    pagination: Pagination
  },
  data() {
    return {
      //页面数据
      tableData: [],
      //分页
      pageData: {
        pageSizes: [10, 20],
        pageSize: 10,
        page: 1,
        total: null,
        layout: "total, sizes, prev, pager, next, jumper"
      },
      search: {
        trader_acount: "",
        real_name: "",
        market_code: "",
        goods_name: "",
        goods_code: "",
        type: "",
        status: ""
      },
      multipleSelection: [],
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
      status: [
        {
          value: "0",
          label: "全部"
        },
        {
          value: "3",
          label: "挂起"
        },
        {
          value: "4",
          label: "撤销挂起"
        }
      ],
      date: null
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
        real_name: this.search.real_name,
        market_code: this.search.market_code,
        goods_name: this.search.goods_name,
        goods_code: this.search.goods_code,
        type: this.search.type,
        status: this.search.status == 1 ? "" : this.search.status
      };
      hangBuyList(data)
        .then(res => {
          if (res.code == 0) {
            this.tableData = res.data.data;
            this.pageData.page = res.data.current_page;
            this.pageData.pagesize = res.data.per_page;
            this.pageData.total = res.data.total;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //导出
    derive() {
      if (this.date) {
        this.search.starttime = this.date[0];
        this.search.endtime = this.date[1];
      }
      this.$confirm("是否导出?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let link = document.createElement("a");
          link.href = `${
            this.$axios.defaults.baseURL
          }api/risk/exportBuyedListDetail?token=${getToken()}&trader_acount=${
            this.search.trader_acount
          }&start_time=${this.search.start_time}&end_time=${
            this.search.end_time
          }&real_name=${this.search.real_name}&sell_type=${
            this.search.sell_type
          }&sell_people=${this.search.sell_people}`;
          link.click();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消导出"
          });
        });
    },
     //不勾选
    selectable(row, index) {
      if (row.status == 4) {
        return false;
      }else{
        return true
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.trader_account == "总计：") {
        return "success-row";
      }
      // return "";
    },

    //清空
    empty() {
      this.date = null;
      this.search = {
        trader_acount: "",
        real_name: "",
        market_code: "",
        goods_name: "",
        goods_code: "",
        type: ""
      };
    },
      //批量撤单
    close() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          type: "info",
          message: "请勾选挂单列表"
        });
      } else {
        this.$confirm("是否撤单?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let ids = this.multipleSelection.join(",");
            console.log(ids);
            let data = {
              buy_id_str: ids
            };
            cancelHangBuy(data)
              .then(res => {
                if (res.code == 0) {
                  this.$message({
                    type: "success",
                    message: res.message || res.msg
                  });
                  this.getData();
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
   
    //撤单
    handleEdit(scope) {
      let data = {
        buy_id_str: scope.row.id
      };
      this.$confirm("是否撤单?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          cancelHangBuy(data).then(res => {
            if (res.code == 0) {
              this.getData();
              this.$message({
                type: "success",
                message: res.message
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    // 搜索
    handleSearch() {
       this.pageData.page = 1;
       this.pageData.total = null;
      this.getData();
    },
    //每页多少条
    handleCurrentChange(val) {
      this.pageData.page = 1;
      this.pageData.pageSize = val;
      this.getData();
    },
    //选取页数
    handleSizeChange(page) {
      this.pageData.page = page;
      this.getData();
    },
    //选取
    handleSelectionChange(val) {
      this.multipleSelection = [];
      val.forEach(res => {
        this.multipleSelection.push(res.id);
      });
    }
  }
};
</script>
<style scoped>
.top {
  position: relative;
  margin-bottom: 5px;
}
.btnList {
  height: 40px;
  position: relative;
}
.add {
  position: absolute;
  right: 0;
  top: 0;
}
.pagination {
  text-align: right;
  padding: 10px;
}
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>