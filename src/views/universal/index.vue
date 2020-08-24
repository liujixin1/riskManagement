<template>
  <div class="container">
    <div class="title">参数设置</div>
    <el-form :model="formData" class="main">
      <el-form-item label="缺省手续费：" label-width="100px">
        <el-input v-model="formData.serviceFee" @change="save"></el-input>
      </el-form-item>
      <el-form-item label="高风险率：" label-width="100px">
        <el-input v-model="formData.highRisk" @change="save"></el-input>
      </el-form-item>
      <el-form-item label="低风险率：" label-width="100px">
        <el-input v-model="formData.lowRisk" @change="save"></el-input>
      </el-form-item>
      <!-- <el-button type="primary" size="small" @click="save" class="save">保存</el-button> -->
    </el-form>
  </div>
</template>
<script>
import { getSettingInfo, saveSettingInfo } from "@/api/universal";
export default {
  data() {
    return {
      //页面数据
      formData: {
        serviceFee: "",
        highRisk: "",
        lowRisk: ""
      }
    };
  },

  created() {
    this.getData();
  },
  methods: {
    getData() {
      let data = {
        keyword: "service_fee"
      };
      getSettingInfo(data).then(res => {
        res.data.forEach(res => {
          switch (res.keyword) {
            case "service_fee":
              this.formData.serviceFee = res.value;
              break;
              case "high_risk":
              this.formData.highRisk = res.value;
              break;
              case "low_risk":
              this.formData.lowRisk = res.value;
              break;
          }
        });
      });
    },
    save() {
      let data = {
        service_fee: this.formData.serviceFee,
        high_risk: this.formData.highRisk,
        low_risk: this.formData.lowRisk
      };
      saveSettingInfo(data).then(res => {
        if (res.code == 0) {
          this.getData();
          this.$message({
            type: "success",
            message: res.message
          });
        }
      });
    }
  }
};
</script>
<style scoped>
.container {
  width: 300px;
}
.main {
  margin-top: 20px;
}
.save {
  margin-top: 20px;
}
</style>