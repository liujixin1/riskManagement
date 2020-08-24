<template>
  <div class="main">
    <!-- <div class="demo-image">
        <el-image style="width: 100%; height: 100%" :src="require('@/assets/index.jpg')" fit="fill"></el-image>
    </div> -->
    <div class="center">
      <img class="textImg" src="@/assets/indexText.png" alt="">
    <div class="indexText">风控后台管理系统 </div>
    </div>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      
    };
  }
};
</script>

<style scoped>
.app-main,.main {
  width: 100%;
   height: calc(100vh - 50px);
  overflow: hidden;
  position: relative;
  background:url(../../assets/index.jpg) no-repeat;
  background-size: cover
}
.center{
  position: absolute;
  left: 50px;
  top: 100px;
  z-index: 100;

}
.textImg{
  display: block;
  width: 400px;
  height: auto;
}
.indexText{
  font-size: 40px;
  color: #fff;
  padding: 15px 0;
}
</style>
