<template>
  <div class="container">
    <div class="btnList">
      <el-button
        size="small"
        type="success"
        icon="el-icon-s-claim"
        class="handleSearch"
        @click="status(1)"
      >正常</el-button>
      <el-button
        size="small"
        type="info"
        icon="el-icon-takeaway-box"
        class="handleSearch"
        @click="status(2)"
      >冻结</el-button>
      <el-button
        size="small"
        type="warning"
        icon="el-icon-circle-plus"
        class="handleSearch"
        @click="status(3)"
      >结算</el-button>
      <!-- <el-button
        size="small"
        type="danger"
        icon="el-icon-warning"
        class="handleSearch"
        @click="status(4)"
      >禁止登陆</el-button>-->
      <el-button
        class="add"
        size="small"
        type="primary"
        icon="el-icon-circle-plus"
        @click="addPermission"
      >添加用户</el-button>
    </div>
    <div class="top">
      <el-input
        style="width:200px;margin-bottom:5px"
        v-model="search.name"
        clearable
        placeholder="请输入名称"
      ></el-input>
      <el-input
        style="width:200px;margin-bottom:5px"
        v-model="search.trader_acount"
        clearable
        placeholder="请输入操盘账号"
      ></el-input>
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
      <el-button
        size="small"
        type="primary"
        icon="el-icon-search"
        class="handleSearch"
        @click="handleSearch()"
      >查询</el-button>
      <el-button type="info" size="small" icon="el-icon-tickets" @click="derive()">导出</el-button>
    </div>

    <el-table
      :data="tableData"
      border
      style="width: 100%"
      empty-text="暂无数据"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" :selectable="selectable" width="50" align="center"></el-table-column>
      <el-table-column prop="mobile" label="手机号" align="center"></el-table-column>
      <el-table-column prop="username" label="姓名" align="center"></el-table-column>
      <el-table-column prop="trader_acount" label="操盘账号" align="center"></el-table-column>
      <el-table-column prop="statusMsg" label="客户状态" align="center"></el-table-column>
      <el-table-column prop="create_time" sortable label="开户日期" align="center"></el-table-column>
      <el-table-column prop="update_time" sortable label="修改日期" align="center"></el-table-column>
      <el-table-column prop="edit_account" label="操作人" align="center"></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope)">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination @page="handleSizeChange" @pagesize="handleCurrentChange" :pageData="pageData"></pagination>
    <!-- dialog -->
    <addClientDialog :dialog="dialog" @upData="getData"></addClientDialog>
  </div>
</template>
<script>
import { getToken } from "@/utils/auth";
import { parseTime } from "@/utils/index";
import AddClientDialog from "@/components/client/addClientDialog";
import Pagination from "@/components/pagination";
import {
  getCustomerList,
  delCustomer,
  changeStatus
} from "@/api/client/clientList";
export default {
  components: {
    pagination: Pagination,
    addClientDialog: AddClientDialog
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
        trader_acount: "",
        mobile: "",
        status: "",
        sort: "",
        order_field: ""
      },
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "1",
          label: "正常"
        },
        {
          value: "2",
          label: "冻结"
        },
        {
          value: "3",
          label: "结算"
        }
        // {
        //   value: "4",
        //   label: "禁止登陆"
        // }
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
        trader_acount: this.search.trader_acount,
        mobile: this.search.mobile,
        status: this.search.status,
        sort: this.search.sort,
        order_field: this.search.order_field
      };

      getCustomerList(data)
        .then(res => {
          if (res.code == 0) {
            res.data.data.forEach(result => {
              if (result.create_time) {
                result.create_time = parseTime(result.create_time);
              }
              if (result.update_time) {
                result.update_time = parseTime(result.update_time);
              }
              if (result.reset_password_time) {
                result.reset_password_time = parseTime(
                  result.reset_password_time
                );
              }
              switch (result.status) {
                case 1:
                  result.statusMsg = "正常";
                  break;
                case 2:
                  result.statusMsg = "冻结";
                  break;
                case 3:
                  result.statusMsg = "结算";
                  break;
                case 4:
                  result.statusMsg = "禁止登陆";
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
    //设置保证金
    seitchVal(scope) {
      console.log(scope);
      let data = {
        status: scope.row.status ? 1 : 0,
        id: scope.row.id
      };
      changeStatus(data).then(res => {
        if (res.code == 0) {
          this.getData();
          this.$message({
            type: "success",
            message: res.message
          });
        }
      });
    },
    //添加保证金
    addPermission() {
      this.dialog.dialogType = "";
      this.dialog.centerDialogVisible = true;
    },
    //修改手续费
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
          delCustomer(data).then(res => {
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
    //设置状态
    status(sum) {
      this.$confirm("是否操作该信息?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
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
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    selectable(row, index) {
      if (row.status === 3) {
        return false;
      } else {
        return true;
      }
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
          }api/customer/exportCustomerList?token=${getToken()}&name=${
            this.search.name
          }&trader_acount=${this.search.trader_acount}&mobile=${
            this.search.mobile
          }&status=${this.search.status}&sort=${this.search.sort}&order_field=${
            this.search.order_field
          }`;
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