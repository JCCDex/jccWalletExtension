<template>
    <div>
      <div class="body_class">
        <div class="title_class">
          <div class="noteImg"><img :src="passwordImg" style="width:16px;"/></div>
          <div class="noteText">{{$t('message.home.passwordText')}}</div>
        </div>
        <div>
          <passInput ref="password" :textMsg="$t('message.home.passwordText2')" @setPassData="setPassData" ></passInput>
        </div>
        <div>
          <passInput ref="rePassword" :passData="password" :textMsg="$t('message.home.rePasswordText')"></passInput>
        </div>
        <div class="button_div">
          <button class="next_btn" @click="createdSuccess()" >{{$t('message.home.sureText')}}</button>
        </div>
      </div>
    </div>
</template>
<script>
import passwordImg from "../images/passwordImg.png";
import passInput from "./passInput";
export default {
  data() {
    return {
      //   secret: "",
      password: "",
      passwordImg
    }
  },
  components: {
    passInput
  },
  created() {
    // let secret = this.$route.query.secret;
    // this.secret = secret;
  },
  methods: {
    setPassData(password) {
      this.password = password;
    },
    createdSuccess() {
      if (this.$refs.password.isValid()) {
        return;
      }
      if (this.$refs.rePassword.isValid()) {
        return;
      }
      this.$emit("createdSuccess", this.password);
    }
  }
}
</script>
<style lang="scss" scoped>
.body_class {
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