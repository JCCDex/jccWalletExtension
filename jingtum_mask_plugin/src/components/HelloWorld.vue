<template>
  <div>
    <div class="homeText">{{this.$t("message.home.home_text")}}</div>
    <div style="font-size:26px;color:#2538D1;margin-bottom:30px;">{{this.$t("message.home.mark_text")}}</div>
    <button class="homeBtn">{{this.$t("message.home.create_wallet")}}</button>
    <button class="homeBtn" style="background:#00BD91;">{{this.$t("message.home.import_wallet")}}</button>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {}
  },
  methods: {}
}
</script>

<style scoped >
.homeText {
  font-size: 32px;
  font-weight: 600;
  color: rgba(52, 52, 54, 1);
  line-height: 45px;
  margin: 20px auto 8px;
}
.homeBtn {
  width: 100%;
  height: 54px;
  background: rgba(54, 107, 242, 1);
  color: #ffffff;
  font-size: 16px;
  border-radius: 6px;
  display: inline-block;
  box-sizing: border-box;
  margin: 0 0 20px;
  padding: 0 20px;
  line-height: 54px;
  text-align: center;
  border: none;
  outline: none;
  -webkit-appearance: none;
  -webkit-text-size-adjust: 100%;
}
</style>
