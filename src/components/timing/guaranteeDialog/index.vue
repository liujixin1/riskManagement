<template>
  <div class="container">
    <el-dialog
      title="定时强平分组"
      :visible.sync="guaranteeDialogs.centerDialogVisible"
      width="60%"
      center
      :lock-scroll="true"
      @close="hideDialog"
      @open="getData"
    >
      <div class="top">
        <el-input
          style="width:150px;margin-bottom:5px"
          v-model="seach.bazaarName"
          clearable
          placeholder="请输入市场名称"
        ></el-input>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          class="handleSearch"
          @click="bazaarSearch()"
        >查询</el-button>
      </div>
      <el-tabs v-model="editableTabsValue" @tab-click="clickTab">
        <el-tab-pane
          :key="item.name"
          v-for="item in editableTabs"
          :label="item.title"
          :name="item.name"
        >
          <div class="top">
            <el-input
              style="width:200px;margin-bottom:5px"
              v-model="seach.name"
              clearable
              placeholder="请输入品种名称"
            ></el-input>
            <el-button
              size="small"
              type="primary"
              icon="el-icon-search"
              class="handleSearch"
              @click="handleSearch()"
            >查询</el-button>
          </div>
          <el-table border :data="gridData">
            <el-table-column prop="name" label="交易品种" align="center"></el-table-column>
            <el-table-column prop="goods_code" label="商品Code" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="handleEdit(scope)"
                >编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <el-dialog width="60%" title="定时强平分组设置" :visible.sync="innerVisible" center append-to-body>
        <el-button
          class="add"
          size="small"
          type="primary"
          icon="el-icon-circle-plus"
          @click="addPermission"
        >添加定时强平</el-button>
        <el-table border :data="formData">
          <el-table-column prop="time" label="时间" align="center" width="250px">
            <template slot-scope="scope">
              <el-time-picker
                format="HH:mm "
                value-format="HH:mm"
                @change="switchMain(scope)"
                v-model="scope.row.time"
              ></el-time-picker>
            </template>
          </el-table-column>
          <el-table-column label="是否开启" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.openStatus"
                :disabled="scope.row.bool"
                @change="switchMain(scope)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="是否d冻结" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.forbidStatus"
                :disabled="scope.row.bool"
                @change="switchMain(scope)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="handleDelete(scope)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>
import { getMarketList } from "@/api/deal/bazaar";
import {
  getGoodsGroupServiceFee,
  setGoodsGroupServiceFee,
  getGoodsGroupCompulsorySellData,
  check,
  setValue,
  delData
} from "@/api/timing/timingList";
import { parseTime } from "@/utils/index";

export default {
  props: {
    guaranteeDialogs: Object
  },
  data() {
    return {
      rules: {
        time: [{ required: true, message: "选择时间", trigger: "blur" }]
      },
      editableTabsValue: "",
      editableTabs: [],
      gridData: [],
      seach: {
        name: "",
        bazaarName: ""
      },
      redact: {
        innerVisible: false,
        id: ""
      },
      formData: [],
      innerVisible: false,
      goodsId: ""
    };
  },
  methods: {
    //获取数据
    getData() {
      this.editableTabs = [];
      let data = {
        limit: 100,
        page: 1,
        name: this.seach.bazaarName
      };
      getMarketList(data).then(res => {
        if (res.code == 0) {
          this.editableTabsValue = res.data.data[0].id + "";
          this.getMsgList(this.editableTabsValue);
          res.data.data.forEach(res => {
            this.editableTabs.push({
              title: res.name + "",
              name: res.id + ""
            });
          });
        }
      });
    },
    //修改
    switchMain(scope) {
      console.log(scope);
      let data = {
        id: scope.row.id,
        goods_id: scope.row.goods_id,
        group_id: this.guaranteeDialogs.id,
        time: scope.row.time == 0 ? "" : scope.row.time,
        forbid: scope.row.forbidStatus ? 1 : 0,
        open: scope.row.openStatus ? 1 : 0
      };
      setValue(data)
        .then(res => {
          if (res.code == 0) {
            this.$message({
              type: "success",
              message: res.message
            });
            this.handleEdits();
          } else {
            this.$message({
              type: "error",
              message: res.message
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //设置手续费
    handleChange(scope) {
      let data = {
        goods_id: scope.row.id,
        group_id: this.editableTabsValue,
        service_fee: scope.row.service_fee
      };
      setGoodsGroupServiceFee(data).then(res => {
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: res.message
          });
          this.getMsgList(this.editableTabsValue);
        }
      });
    },
    // 添加定时强平分组
    addPermission() {
      let data = {
        goods_id: this.goodsId,
        group_id: this.guaranteeDialogs.id,
        time: "00:00:00",
        forbid: 0,
        open: 0,
        id: 0
      };
      setValue(data)
        .then(res => {
          if (res.code == 0) {
            this.$message({
              type: "success",
              message: res.message
            });
            this.handleEdits();
          } else {
            this.$message({
              type: "error",
              message: res.message
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //点击tab
    clickTab(targetName) {
      this.editableTabsValue = targetName.name;
      this.getMsgList(this.editableTabsValue);
    },
    //市场搜索
    bazaarSearch() {
      this.getData();
    },
    //定时强平详情列表
    getMsgList(id) {
      let data = {
        market_id: id,
        name: this.seach.name
      };
      getGoodsGroupServiceFee(data).then(res => {
        this.gridData = res.data;
      });
    },
    //品种查询
    handleSearch() {
      this.getMsgList(this.editableTabsValue);
    },
    // 关闭
    hideDialog() {
      this.guaranteeDialogs.centerDialogVisible = false;
      this.seach = {
        name: "",
        bazaarName: ""
      };
    },
    //编辑
    handleEdit(scope) {
      console.log(scope);
      this.innerVisible = true;
      this.goodsId = scope.row.id;
      let data = {
        goods_id: this.goodsId,
        group_id: this.guaranteeDialogs.id
      };
      getGoodsGroupCompulsorySellData(data).then(res => {
        if (res.code == 0) {
          res.data.forEach(res => {
            if (res.time == 0 || res.time == null || res.time == "") {
              res.bool = true;
            } else {
              res.bool = false;
            }
            switch (res.open) {
              case 0:
                res.openStatus = false;
                break;
              case 1:
                res.openStatus = true;
                break;
            }
            switch (res.forbid) {
              case 0:
                res.forbidStatus = false;
                break;
              case 1:
                res.forbidStatus = true;
                break;
            }
          });
          this.formData = res.data;
        }
      });
    },
    //获取定时强平设置列表
    handleEdits() {
      let data = {
        goods_id: this.goodsId,
        group_id: this.guaranteeDialogs.id
      };
      getGoodsGroupCompulsorySellData(data).then(res => {
        if (res.code == 0) {
          res.data.forEach(res => {
            if (res.time == 0 || res.time == null || res.time == "") {
              res.bool = true;
            } else {
              res.bool = false;
            }
            switch (res.open) {
              case 0:
                res.openStatus = false;
                break;
              case 1:
                res.openStatus = true;
                break;
            }
            switch (res.forbid) {
              case 0:
                res.forbidStatus = false;
                break;
              case 1:
                res.forbidStatus = true;
                break;
            }
          });
          this.formData = res.data;
        }
      });
    },
    //删除
    handleDelete(scope) {
      console.log(scope);
      let data = {
        id: scope.row.id
      };
      delData(data).then(res => {
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: res.message
          });
          this.handleEdits();
        } else {
          this.$message({
            type: "error",
            message: res.message
          });
        }
      });
    },
    //取消
    cancel() {
      this.redact.innerVisible = false;
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
  display: block;
  margin-left: auto;
  margin-bottom: 10px;
}
</style>