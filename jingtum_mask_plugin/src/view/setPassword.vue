<template>
    <div>
      <commonHead :titleText="$t('message.home.setPassword')"></commonHead>
      <div class="body_class">
        <div class="title_class">
          <div class="noteImg"><img :src="passwordImg" style="width:16px;"/></div>
          <div class="noteText">{{$t('message.home.passwordText')}}</div>
        </div>
        <div>
          <passInput ref="password" @setPassData="setPassData" ></passInput>
        </div>
        <div>
          <passInput ref="rePassword" :passData="password" :textMsg="$t('message.home.rePasswordText')"></passInput>
        </div>
        <div class="button_div">
          <button class="next_btn" @click="goNext()" >{{$t('message.home.sureText')}}</button>
        </div>
      </div>
    </div>
</template>
<script>
import commonHead from "../components/commonHead";
import passwordImg from "../images/passwordImg.png";
import passInput from "../components/passInput";
import { JingchangWallet } from "jcc_wallet";
import { Toast } from 'vant';
export default {
  data() {
    return {
      secret: "",
      password: "",
      passwordImg
    }
  },
  components: {
    commonHead,
    passInput
  },
  created() {
    let secret = this.$route.query.secret;
    this.secret = secret;
  },
  methods: {
    setPassData(password) {
      this.password = password;
    },
    goNext() {
      if (this.$refs.password.isValid()) {
        return;
      }
      if (this.$refs.rePassword.isValid()) {
        return;
      }
      JingchangWallet.generate(this.password, this.secret).then((jcWallet) => {
        JingchangWallet.save(jcWallet);
        this.$store.dispatch("updateJCWallet", jcWallet);
        Toast.success(this.$t("message.home.createSuccess"))
      }).catch((error) => {
        Toast.fail(error);
      })
      this.$router.push({
        name: "myWallet"
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.body_class {
  padding: 20px;
  .title_class {
    display: flex;
    .noteImg {
      width: 5%;
      text-align: left;
      margin-top: 2px;
      padding-bottom: 20px;
    }
    .noteText {
      width: 95%;
      padding-left: 5px;
      text-align: left;
      color: #f36723;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
    }
  }
  .button_div {
    .next_btn {
      background-color: #366bf2;
      width: 100%;
      height: 48px;
      line-height: 48px;
      border-radius: 6px;
      text-align: center;
      outline: none;
      border: none;
      color: #ffffff;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
    }
  }
}
</style>