<template>
  <div class="container">
    <el-dialog
      :title="dialog.dialogType==='edit'?'修改币种':'创建币种'"
      :visible.sync="dialog.centerDialogVisible"
      width="30%"
      center
      :lock-scroll="true"
      @closed = 'closed'
    >
      <el-form
        ref="form"
        :rules="rules"
        :model="formData"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="币种名称：" prop="name">
          <el-input v-model="formData.name" placeholder="请输入币种名称" />
        </el-form-item>
        <el-form-item label="币种汇率：" prop="describe">
          <el-input-number v-model="formData.describe" :controls="false" label="请输入汇率"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { addCurrency,editCurrency } from "@/api/currency/settingCurrency";
export default {
  props: {
    dialog: Object,
    formData: Object
  },
  data() {
    return {
      rules: {
        name: [{ required: true, message: "填写币种名称", trigger: "blur" }],
        describe: [{ required: true, message: "填写汇率", trigger: "blur" }]
      }
    };
  },
  methods: {
      //关闭
    hideDialog() {
      this.dialog.centerDialogVisible = false;
      
    },
    //弹出清除状态
    closed(){
        this.$refs['form'].resetFields();
    },
    //提交
    confirm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let data = {
            name: this.formData.name,
            exchange_rate: this.formData.describe
          };
          if (this.dialog.dialogType === "edit") {
            data.id = this.formData.id;
            editCurrency(data).then(res => {
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
          } else {
            addCurrency(data).then(res => {
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