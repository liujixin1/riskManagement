<template>
  <div class="container">
    <el-dialog
      :title="dialog.dialogType == 'edit'?'修改定时强平分组':'创建定时强平分组'"
      :visible.sync="dialog.centerDialogVisible"
      width="30%"
      center
      :lock-scroll="true"
      @close="hideDialog"
      @open="getData"
    >
      <el-form
        ref="form"
        :rules="rules"
        :model="formData"
        label-width="150px"
        label-position="left"
      >
        <el-form-item label="定时强平分组名称：" prop="name">
          <el-input v-model="formData.name" placeholder="请输入定时强平分组名称" />
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
import { addGroup, getGroupInfo,editGroup } from "@/api/timing/timingList";
export default {
  props: {
    dialog: Object
  },
  data() {
    return {
      formData: {
        name: ""
      },
      rules: {
        name: [{ required: true, message: "填写定时强平名称", trigger: "blur" }]
      }
    };
  },
  methods: {
    //获取数据
    getData() {
      if (this.dialog.dialogType == "edit") {
        let data = {
          id: this.dialog.id
        };
        getGroupInfo(data).then(res => {
          if (res.code == 0) {
            (this.formData.name = res.data.name),
              (this.formData.id = res.data.id);
          }
        });
      }
    },
    // 关闭
    hideDialog() {
      this.dialog.centerDialogVisible = false;
      this.$refs["form"].resetFields();
    },
    //提交
    confirm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let data = {
            name: this.formData.name
          };
          if (this.dialog.dialogType == "edit") {
            data.id = this.formData.id;
            editGroup(data).then(res => {
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
            addGroup(data).then(res => {
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