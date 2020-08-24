<template>
  <div class="container">
    <el-dialog
      title="保证金设置"
      :visible.sync="guaranteeDialog.centerDialogVisible"
      width="60%"
      center
      :lock-scroll="true"
      @open="getData"
    >
      <div class="main">
        <div style="margin-bottom: 20px;">
          <el-button size="small" type="primary" icon="el-icon-circle-plus" @click="addMargin">添加保证金</el-button>
        </div>
        <el-tabs closable v-model="editableTabsValue" @tab-click="clickTab" @tab-remove="removeTab">
          <el-tab-pane
            v-for="item in editableTabs"
            :key="item.name"
            :label="item.cash_deposit_name"
            :name="item.name"
          >
            <el-button
              class="add"
              size="small"
              type="primary"
              icon="el-icon-circle-plus"
              @click="addPermission"
            >添加</el-button>
            <el-table border :data="gridData">
              <el-table-column prop="cash_deposit_value" label="保证金" align="center"></el-table-column>
              <el-table-column prop="max_stop_loss_amount" label="最大止损金额" align="center"></el-table-column>
              <el-table-column prop="min_stop_loss_amount" label="最小止损金额" align="center"></el-table-column>
              <el-table-column prop="max_stop_profit_amount" label="最大止盈金额" align="center"></el-table-column>
              <el-table-column prop="min_stop_profit_amount" label="最小止盈金额" align="center"></el-table-column>
              <el-table-column prop="min_stop_profit_loss_base" label="止盈止损基数" align="center"></el-table-column>
              <el-table-column label="一个点价格" align="center">
                <template slot-scope="scope">{{scope.row.one_point_price+scope.row.currency_name}}</template>
              </el-table-column>
              <el-table-column prop="exchange_rate" label="汇率" align="center"></el-table-column>
              <el-table-column label="操作" width="250" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" icon="el-icon-edit" @click="handleEdit(scope)">编辑</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    @click="handleDelete(scope)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
    <!-- 添加保证金 -->
    <el-dialog
      @close="hideDialog"
      title="添加保证金"
      :visible.sync="marginDialog.centerDialogVisible"
      width="30%"
      center
    >
      <el-form :model="addMarginForm" ref="addMarginForm" :rules="rules" label-width="120px">
        <el-form-item label="保证金名字：" prop="name">
          <el-input v-model="addMarginForm.name" placeholder="请输入保证金名字"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hideDialog">取 消</el-button>
        <el-button type="primary" @click="addMarginConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加保证金信息 -->
    <el-dialog
      :title="addPermissionDialog.dialogType==='edit'?'修改保证金信息':'添加保证金信息'"
      :visible.sync="addPermissionDialog.centerDialogVisible"
      width="50%"
      center
      @close="hideDialog"
    >
      <el-form
        :model="addMarginMsgForm"
        ref="addMarginMsgForm"
        :rules="addMarginMsg"
        label-width="120px"
      >
        <el-form-item label="保证金值：" prop="cash_deposit_value">
          <el-input v-model="addMarginMsgForm.cash_deposit_value" placeholder="请输入保证金"></el-input>
        </el-form-item>
        <el-form-item label="最大止盈金额：" prop="max_stop_profit_amount">
          <div class="center">
            <label class="number">{{guaranteeDialog.number.toFixed(2)}}</label>
            <span class="test">*</span>
            <el-input-number
              v-model="profitVal"
              :controls="false"
              @change="profitAmount"
              :precision="2"
              label="请输入最大止盈金额"
            ></el-input-number>
            <span class="test">=</span>
            <label class="number">{{addMarginMsgForm.max_stop_profit_amount}}</label>
          </div>
        </el-form-item>
        <el-form-item label="最大止损金额：" prop="max_stop_loss_amount">
          <div class="center">
            <label class="number">{{guaranteeDialog.number.toFixed(2)}}</label>
            <span class="test">*</span>
            <el-input-number
              v-model="lossVal"
              :controls="false"
              @change="lossAmount"
              :precision="2"
              label="请输入最大止损金额"
            ></el-input-number>
            <span class="test">=</span>
            <label class="number">{{addMarginMsgForm.max_stop_loss_amount}}</label>
          </div>
        </el-form-item>
        <el-form-item label="最小止盈金额：">
          <el-input
            style="width:100px"
            :disabled="true"
            v-model="guaranteeDialog.number.toFixed(2)"
            placeholder="请输入最小止盈金额"
          ></el-input>
        </el-form-item>
        <el-form-item label="最小止损金额：">
          <el-input
            style="width:100px"
            :disabled="true"
            v-model="guaranteeDialog.number.toFixed(2)"
            placeholder="请输入最小止盈金额"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hideDialog">取 消</el-button>
        <el-button type="primary" @click="addMarginMsgConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getGoodsCashDepositList,
  addGoodsCashDeposit,
  delGoodsCashDeposit,
  addCashDepositData,
  getCashDepositDataList,
  getCashDepositDataInfo,
  editCashDepositData,
  delCashDepositData
} from "@/api/deal/variety";
export default {
  props: {
    guaranteeDialog: Object
  },
  data() {
    return {
      rules: {
        name: [{ required: true, message: "填写保证金", trigger: "blur" }]
      },
      addMarginMsg: {
        cash_deposit_value: [
          { required: true, message: "填写保证金值", trigger: "blur" }
        ],
        max_stop_profit_amount: [
          { required: true, message: "填写最大止盈金额", trigger: "blur" }
        ],
        max_stop_loss_amount: [
          { required: true, message: "填写最大止损金额", trigger: "blur" }
        ]
      },
      marginDialog: {
        centerDialogVisible: false
      },
      addPermissionDialog: {
        centerDialogVisible: false,
        dialogType: ""
      },
      addMarginForm: {
        name: ""
      },
      addMarginMsgForm: {
        cash_deposit_value: "",
        max_stop_profit_amount: "",
        max_stop_loss_amount: ""
      },
      editableTabsValue: "",
      tabIndex: 2,
      editableTabs: [],
      gridData: [],
      profitVal: "",
      lossVal: ""
    };
  },
  methods: {
    hideDialog() {
      this.marginDialog.centerDialogVisible = false;
      this.addPermissionDialog.centerDialogVisible = false;
      this.addMarginForm.name = "";
      this.addMarginMsgForm = {
        cash_deposit_value: "",
        max_stop_profit_amount: "",
        max_stop_loss_amount: ""
      };
      this.profitVal = "";
      this.lossVal = "";
    },
    //输入最大止盈金额
    profitAmount() {
      this.addMarginMsgForm.max_stop_profit_amount = (
        this.guaranteeDialog.number * this.profitVal
      ).toFixed(2);
    },
    //输入最大止损金额
    lossAmount() {
      this.addMarginMsgForm.max_stop_loss_amount = (
        this.guaranteeDialog.number * this.lossVal
      ).toFixed(2);
    },
    //点击tab
    clickTab(targetName) {
      this.editableTabsValue = targetName.name;
      this.getMsgList(this.editableTabsValue);
    },
    //获取保证金列表和保证金详情
    getData() {
      this.editableTabs = [];
      let data = {
        goods_id: this.guaranteeDialog.id
      };
      getGoodsCashDepositList(data).then(res => {
        if (res.code == 0) {
          if (res.data.length > 0) {
            this.editableTabsValue = res.data[0].id + "";
            this.getMsgList(this.editableTabsValue);
            res.data.forEach(res => {
              this.editableTabs.push({
                cash_deposit_name: res.cash_deposit_name,
                goods_id: res.goods_id,
                name: res.id + ""
              });
            });
          }

        }
      });
    },
    //保证金详情列表
    getMsgList(id) {
      let data = {
        cash_deposit_id: id
      };
      getCashDepositDataList(data).then(res => {
        res.data.forEach(res => {});
        this.gridData = res.data;
      });
    },
    //添加保证金信息
    addMarginMsgConfirm() {
      this.$refs["addMarginMsgForm"].validate(valid => {
        if (valid) {
          let data = {
            cash_deposit_id: this.editableTabsValue,
            cash_deposit_value: this.addMarginMsgForm.cash_deposit_value,
            max_stop_profit_amount: this.addMarginMsgForm
              .max_stop_profit_amount,
            max_stop_loss_amount: this.addMarginMsgForm.max_stop_loss_amount
          };
          if (this.addPermissionDialog.dialogType == "edit") {
            data.cash_deposit_id = this.addMarginMsgForm.cash_deposit_id;
            data.id = this.addMarginMsgForm.id;
            editCashDepositData(data).then(res => {
              if (res.code == 0) {
                this.$message({
                  message: res.message,
                  type: "success"
                });
                this.hideDialog();
                this.getMsgList(this.editableTabsValue);
              } else {
                this.$message({
                  message: res.message,
                  type: "error"
                });
              }
            });
          } else {
            addCashDepositData(data).then(res => {
              if (res.code == 0) {
                this.$message({
                  message: res.message,
                  type: "success"
                });
                this.hideDialog();
                this.getMsgList(this.editableTabsValue);
              } else {
                this.$message({
                  message: res.message,
                  type: "error"
                });
              }
            });
          }
        }
      });
    },
    //点击添加保证金
    addMargin() {
      this.marginDialog.centerDialogVisible = true;
    },
    //添加保证金
    addMarginConfirm() {
      this.$refs["addMarginForm"].validate(valid => {
        if (valid) {
          let data = {
            goods_id: this.guaranteeDialog.id,
            cash_deposit_name: this.addMarginForm.name
          };

          addGoodsCashDeposit(data).then(res => {
            if (res.code == 0) {
              this.$message({
                message: res.message,
                type: "success"
              });
              this.hideDialog();
              this.getData();
            } else {
              this.$message({
                message: res.message,
                type: "error"
              });
            }
          });
        }
      });
    },
    //删除保证金
    removeTab(targetName) {
      let data = {
        id: targetName
      };
      this.$confirm("是否删除该条信息?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delGoodsCashDeposit(data).then(res => {
            if (res.code == 0) {
              this.$message({
                message: res.message,
                type: "success"
              });
              this.getData();
            } else {
              this.$message({
                message: res.message,
                type: "error"
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
    //添加保证金信息
    addPermission() {
      this.addPermissionDialog.centerDialogVisible = true;
      this.addPermissionDialog.dialogType = "";
      this.addMarginMsgForm = {
        cash_deposit_value: "",
        max_stop_profit_amount: "",
        max_stop_loss_amount: ""
      };
    },
    //编辑保证金信息
    handleEdit(scope) {
      let id = scope.row.id;
      let data = {
        id: id
      };
      getCashDepositDataInfo(data).then(res => {
        if (res.code == 0) {
          this.addMarginMsgForm = {
            cash_deposit_value: res.data.cash_deposit_value,
            max_stop_profit_amount: res.data.max_stop_profit_amount,
            max_stop_loss_amount: res.data.max_stop_loss_amount,
            cash_deposit_id: res.data.cash_deposit_id,
            id: res.data.id
          };
          (this.profitVal =
            res.data.max_stop_profit_amount / this.guaranteeDialog.number),
            (this.lossVal =
              res.data.max_stop_loss_amount / this.guaranteeDialog.number);
          this.addPermissionDialog.dialogType = "edit";
          this.addPermissionDialog.centerDialogVisible = true;
        }
      });
    },
    //删除保证金信息
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
          delCashDepositData(data).then(res => {
            if (res.code == 0) {
              this.getMsgList(this.editableTabsValue);
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
    //提交
    confirm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let data = {
            role_name: this.formData.name,
            role_desc: this.formData.describe
          };

          addRole(data).then(res => {
            if (res.code == 0) {
              this.$message({
                message: res.message,
                type: "success"
              });
              this.hideDialog();
              this.$emit("upData");
            } else {
              this.$message({
                message: res.message,
                type: "error"
              });
            }
          });
        }
      });
    },
    //取消
    cancel() {
      this.hideDialog();
    }
  }
};
</script>
<style scoped>
.main {
  width: 100%;
}
.add {
  margin-left: auto;
  margin-bottom: 5px;
  display: block;
}
.center {
  display: flex;
}
.number {
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 40px;
  line-height: 40px;
  outline: 0;
  padding: 0 15px;
  -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100px;
}
.test {
  padding: 0 10px;
}
</style>