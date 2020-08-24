<template>
  <div class="container">
    <div class="top">
      <el-input
        style="width:200px;margin-bottom:5px"
        v-model="search.name"
        clearable
        placeholder="请输入名称"
      ></el-input>
      <el-button
        size="small"
        type="primary"
        icon="el-icon-search"
        class="handleSearch"
        @click="handleSearch()"
      >查询</el-button>
      <el-button
        class="add"
        size="small"
        type="primary"
        icon="el-icon-circle-plus"
        @click="addPermission"
      >添加手续费</el-button>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      empty-text="暂无数据"
      @selection-change="handleSelectionChange"
      @sort-change="arraySpanMethod"
    >
      <el-table-column prop="name" label="分组名称" align="center"></el-table-column>
      <el-table-column label="缺省开关" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" @change="seitchVal(scope)" on-text off-text></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" sortable label="添加时间" align="center"></el-table-column>
      <el-table-column label="操作" width="300" align="center">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" @click="handleEdit(scope)">编辑</el-button>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit-outline"
            @click="guarantee(scope)"
          >设置</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination @page="handleSizeChange" @pagesize="handleCurrentChange" :pageData="pageData"></pagination>
    <!-- dialog -->
    <addServiceDialog :dialog="dialog" @upData="getData"></addServiceDialog>
    <!-- 设置dialog -->
    <guaranteeDialog :guaranteeDialogs="guaranteeDialogs"></guaranteeDialog>
  </div>
</template>
<script>
import AddServiceDialog from "@/components/serviceDialog/addServiceDialog";
import GuaranteeDialog from "@/components/serviceDialog/guaranteeDialog";
import Pagination from "@/components/pagination";
import {
  getServerList,
  changeStatus,
  deltGroup
} from "@/api/service/serviceList";
export default {
  components: {
    pagination: Pagination,
    addServiceDialog: AddServiceDialog,
    guaranteeDialog: GuaranteeDialog
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
      //设置dialog信息
      guaranteeDialogs: {
        centerDialogVisible: false,
        id: ""
      },
      formData: {},
      search: {
        name: "",
        sort: "",
        order_field: ""
      },
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
        sort: this.search.sort,
        order_field: this.search.order_field
      };

      getServerList(data)
        .then(res => {
          if (res.code == 0) {
            res.data.data.forEach(res => {
              res.status = res.default == 0 ? false : true;
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
    //设置缺省
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
    //添加手续费
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
    //设置手续费分组
    guarantee(scope) {
      this.guaranteeDialogs.centerDialogVisible = true;
      this.guaranteeDialogs.id = scope.row.id;
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
          deltGroup(data).then(res => {
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
  height: 45px;
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
</style>