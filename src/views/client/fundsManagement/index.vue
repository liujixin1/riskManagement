<template>
  <div class="container">
    <div class="btnList">
      <el-button
        size="small"
        type="success"
        icon="el-icon-s-claim"
        class="handleSearch"
        @click="status(2)"
      >审核通过</el-button>
      <el-button
        size="small"
        type="info"
        icon="el-icon-takeaway-box"
        class="handleSearch"
        @click="status(3)"
      >审核失败</el-button>
      <el-button
        size="small"
        type="warning"
        icon="el-icon-circle-plus"
        class="handleSearch"
        @click="status(1)"
      >提交</el-button>
      <el-button
        size="small"
        type="danger"
        icon="el-icon-warning"
        class="handleSearch"
        @click="status(0)"
      >退回</el-button>
      <el-button
        class="add"
        size="small"
        type="primary"
        icon="el-icon-circle-plus"
        @click="addPermission"
      >添加资金</el-button>
    </div>
    <div class="top">
      <el-input
        style="width:200px;margin-bottom:5px"
        v-model="search.name"
        clearable
        placeholder="请输入名称"
      ></el-input>
      <!-- <el-input
        style="width:200px;margin-bottom:5px"
        v-model="search.trader_acount"
        clearable
        placeholder="请输入操盘账号"
      ></el-input>-->
      <el-input
        style="width:200px;margin-bottom:5px"
        v-model="search.mobile"
        clearable
        placeholder="请输入手机号"
      ></el-input>
      <el-select v-model="search.status" placeholder="请选择状态">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select v-model="search.type" placeholder="请选择操作类型">
        <el-option v-for="item in type" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
        icon="el-icon-delete"
        class="handleSearch"
        @click="eliminate()"
      >清空</el-button>
      <el-button type="info" size="small" icon="el-icon-tickets" @click="derive()">导出</el-button>
    </div>

    <el-table
      :data="tableData"
      border
      style="width: 100%"
      empty-text="暂无数据"
      @selection-change="handleSelectionChange"
      @sort-change="arraySpanMethod"
    >
      <el-table-column type="selection" width="50" align="center"></el-table-column>
      <el-table-column prop="trader_acount" label="操盘账号" align="center"></el-table-column>
      <el-table-column prop="mobile" label="手机号" align="center"></el-table-column>
      <el-table-column prop="username" label="姓名" align="center"></el-table-column>
      <el-table-column prop="typeMsg" label="操作类型" align="center"></el-table-column>
      <el-table-column prop="statusMsg" label="状态" align="center"></el-table-column>
      <el-table-column prop="amount" label="金额" align="center"></el-table-column>
      <el-table-column prop="audit_persion" label="审核人" align="center"></el-table-column>
      <el-table-column prop="remarks" label="备注" align="center"></el-table-column>
      <el-table-column prop="create_time" width="90" sortable label="添加时间" align="center"></el-table-column>
      <el-table-column prop="update_time" width="90" sortable label="审核时间" align="center"></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            v-if="scope.row.status == 0"
            icon="el-icon-edit"
            @click="handleEdit(scope)"
          >编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination @page="handleSizeChange" @pagesize="handleCurrentChange" :pageData="pageData"></pagination>
    <!-- dialog -->
    <addFundsManagementDialog :dialog="dialog" @upData="getData"></addFundsManagementDialog>
  </div>
</template>
<script>
import { getToken } from "@/utils/auth";
import AddFundsManagementDialog from "@/components/client/addFundsManagementDialog";
import Pagination from "@/components/pagination";
import {
  getCapitalList,
  delCapital,
  changeStatus
} from "@/api/client/fundsManagement";
export default {
  components: {
    pagination: Pagination,
    addFundsManagementDialog: AddFundsManagementDialog
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
      //dialog信息
      dialog: {
        centerDialogVisible: false,
        dialogType: "",
        id: ""
      },
      formData: {},
      search: {
        name: "",
        type: "",
        trader_acount: "",
        mobile: "",
        status: "",
        sort: "",
        order_field: ""
      },
      type: [
        {
          value: "0",
          label: " 全部"
        },
        {
          value: "1",
          label: "入金"
        },
        {
          value: "2",
          label: "出金"
        },
        {
          value: "3",
          label: "冻结"
        },
        {
          value: "4",
          label: "解冻"
        }
      ],
      options: [
        {
          value: "-1",
          label: "全部"
        },
        {
          value: "0",
          label: " 未提交"
        },
        {
          value: "1",
          label: "待审核"
        },
        {
          value: "2",
          label: "审核通过"
        },
        {
          value: "3",
          label: " 审核失败"
        }
      ],
      multipleSelection: []
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
        name: this.search.name,
        // trader_acount:this.search.trader_acount,
        mobile: this.search.mobile,
        status: this.search.status,
        type: this.search.type,
        sort: this.search.sort,
        order_field: this.search.order_field
      };

      getCapitalList(data)
        .then(res => {
          if (res.code == 0) {
            res.data.data.forEach(result => {
              switch (result.type) {
                case 1:
                  result.typeMsg = "入金";
                  break;
                case 2:
                  result.typeMsg = "出金";
                  break;
                case 3:
                  result.typeMsg = "冻结";
                  break;
                case 4:
                  result.typeMsg = "解冻";
                  break;
              }
              switch (result.status) {
                case 0:
                  result.statusMsg = "未提交";
                  break;
                case 1:
                  result.statusMsg = "待审核";
                  break;
                case 2:
                  result.statusMsg = "审核通过";
                  break;
                case 3:
                  result.statusMsg = "审核失败";
                  break;
              }
            });
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
    //排序
    arraySpanMethod(prop) {
      this.search.order_field = prop.prop;
      switch (prop.order) {
        case "ascending":
          this.search.sort = "asc";
          break;
        case "descending":
          this.search.sort = "desc";
          break;
        case null:
          this.search.sort = "";
          this.search.order_field = "";
          break;
      }
      this.getData();
    },
    //添加资金
    addPermission() {
      this.dialog.dialogType = "";
      this.dialog.centerDialogVisible = true;
    },
    //修改资金
    handleEdit(scope) {
      console.log(scope);
      this.dialog.centerDialogVisible = true;
      this.dialog.dialogType = "edit";
      this.dialog.id = scope.row.id;
    },
    // 删除
    handleDelete(scope) {
      let data = {
        id: scope.row.id
      };
      this.$confirm("是否删除该条信息?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delCapital(data).then(res => {
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
            message: "已取消删除"
          });
        });
    },
    //设置状态
    status(sum) {
      if (this.multipleSelection.length == 0) {
        this.$message({
          type: "info",
          message: "请选择客户"
        });
        return false;
      } else {
        let data = {
          status: sum,
          id: this.multipleSelection
        };
        changeStatus(data).then(res => {
          if (res.code == 0) {
            this.getData();
            this.$message({
              type: "success",
              message: res.message
            });
          }
          this.multipleSelection = [];
        });
      }
    },
    //清除搜索状态
    eliminate() {
      this.search = {
        name: "",
        trader_acount: "",
        mobile: "",
        status: "",
        sort: "",
        order_field: ""
      };
    },
    //导出
    derive() {
      this.$confirm("是否导出?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let link = document.createElement("a");
          link.href = `${
            this.$axios.defaults.baseURL
          }api/capital/exportCapitalList?token=${getToken()}&name=${
            this.search.name
          }&mobile=${this.search.mobile}&status=${this.search.status}&type=${
            this.search.type
          }&sort=${this.search.sort}&order_field=${this.search.order_field}`;
          link.click();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消导出"
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
  /* height: 45px; */
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
</style>