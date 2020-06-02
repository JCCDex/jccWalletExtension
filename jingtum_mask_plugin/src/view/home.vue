<template>
  <div style="margin-top:84px;">
    <img src="../assets/logo.png" width="100px;" height="100px">
    <div class="homeText">{{this.$t("message.home.home_text")}}</div>
    <div style="font-size:26px;color:#2538D1;margin-bottom:30px;">{{this.$t("message.home.mark_text")}}</div>
    <div v-if="!jcWallet" class="input_div">
      <button class="homeBtn" @click="goTo('build')">{{this.$t("message.home.create_wallet")}}</button>
      <button class="homeBtn" @click="goTo('import')" style="background:#00BD91;">{{this.$t("message.home.import_wallet")}}</button>
    </div>
    <div v-else>
      <div class="input_div">
         <passInput ref="password" :textMsg="$t('message.home.passwordText3')" @setPassData="setPassData" ></passInput>
      </div>
      <div class="input_div">
        <button class="homeBtn" @click="goLogin" >{{$t('message.home.sureText')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import passInput from "../components/passInput";
import { JingchangWallet } from "jcc_wallet";
// import { Toast } from "vant";
export default {
  name: "index",
  data() {
    return {
      password: ""
    };
  },
  computed: {
    jcWallet() {
      let jcWallet = this.$store.getters.jcWallet;
      return jcWallet;
    }
  },
  components: {
    passInput
  },
  methods: {
    setPassData(password) {
      this.password = password;
    },
    goLogin() {
      if (this.$refs.password.isValid()) {
        return;
      }
      let password = this.password;
      let jcWallet = this.jcWallet;
      let inst = new JingchangWallet(jcWallet);
      inst
        .getSecretWithType(password, "swt")
        .then(() => {
          // Toast.success("成功");
          this.$store.dispatch("updateIsLogin", 1);
        })
        .catch(error => {
          // Toast.fail(error);
        });
    },
    goTo(type) {
      if (type === "build") {
        this.$router.push({
          name: "createdWallet"
        });
      } else {
      }
    }
  }
};
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
.input_div {
  padding-left: 5%;
  width: 90%;
}
</style>
