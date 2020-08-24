<template>
  <div class="container">
    <el-dialog
      :title="dialog.dialogType==='edit'?'修改币种':'创建币种'"
      :visible.sync="dialog.centerDialogVisible"
      width="30%"
      center
      :lock-scroll="true"
      @closed="closed"
    >
      <el-form
        ref="form"
        :rules="rules"
        :model="formData"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="市场名称：" prop="name">
          <el-input v-model="formData.name" placeholder="请输入市场名称" />
        </el-form-item>
        <el-form-item label="市场编码：" prop="code">
          <el-input v-model="formData.code" placeholder="请输市场编码" />
        </el-form-item>
        <el-form-item label="市场状态：" prop="status">
          <el-select v-model="formData.statusMsg" @change="optionVal(formData.statusMsg)" placeholder="请选择状态">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
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
import { addMarket,editMarket } from "@/api/deal/bazaar";
export default {
  props: {
    dialog: Object,
    formData: Object
  },
  data() {
    return {
      rules: {
        name: [{ required: true, message: "填写市场名称", trigger: "blur" }],
        code: [
          { required: true, message: "填写市场编码", trigger: "blur" }
        ],
        status: [{ required: true, message: "选择市场状态", trigger: "blur" }]
      },
      options: [
        {
          value: "1",
          label: "允许交易"
        },
        {
          value: "0",
          label: "禁止交易"
        }
      ],
      value: ""
    };
  },
  methods: {
    //关闭
    hideDialog() {
      this.dialog.centerDialogVisible = false;
    },
    //弹出清除状态
    closed() {
      this.$refs["form"].resetFields();
    },
    optionVal(val){
      this.formData.status =  val;
    },
    //提交
    confirm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let data = {
            name: this.formData.name,
            code: this.formData.code,
            status:this.formData.status
          };
          if (this.dialog.dialogType === "edit") {
            data.id = this.formData.id;
            editMarket(data).then(res => {
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
            addMarket(data).then(res => {
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