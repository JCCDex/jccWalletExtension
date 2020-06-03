<template>
   <div>
     <div class="head">
        <div class="left">{{$t("message.home.lookWallet")}}</div>
        <div class="middle">
          <editName></editName>
        </div>
        <div class="right">
          <img :src="closeImg" @click="goBack" style="width:16px;" />
        </div>
     </div>
     <div class="address_div">
         <div class="name">{{$t("message.home.addressText")}}</div>
         <div class="image">
            <VueQRCodeComponent class="qrcode" :size="120" :text="address" ></VueQRCodeComponent>
         </div>
         <div class="text_div">
            <div class="text">{{address}}</div>
            <div class="copy">
             <img :src="copyImg" v-clipboard:copy="address" v-clipboard:success="onCopy" v-clipboard:error="onError" style="width:18px;" />
            </div>
         </div>
     </div>
     <div v-if="!isShowSecret">
         <div class="input_div">
          <passInput @setPassData="setPassData" ref="password" :textMsg="$t('message.home.passwordText4')"></passInput>
         </div>
         <div class="button_div">
          <button class="button" @click="showSecret()">{{$t("message.home.sureText")}}</button>
         </div>
     </div>
     <div v-if="isShowSecret" class="address_div">
       <div class="name">{{$t("message.home.secretText")}}</div>
         <div class="image">
            <VueQRCodeComponent class="qrcode" :size="120" :text="address" ></VueQRCodeComponent>
         </div>
         <div class="text_div">
            <div class="text">{{secret}}</div>
            <div class="copy">
             <img :src="copyImg" v-clipboard:copy="secret" v-clipboard:success="onCopy" v-clipboard:error="onError" style="width:18px;" />
            </div>
         </div>
     </div>
   </div>
</template>
<script>
import closeImg from "../images/closeImg.png";
import copyImg from "../images/copyImg.png";
import editName from "../components/editName";
import passInput from "../components/passInput";
import VueQRCodeComponent from "vue-qrcode-component";
import { JingchangWallet } from "jcc_wallet";
export default {
  data() {
    return {
      closeImg,
      copyImg,
      isShowSecret: false,
      password: "",
      secret: ""
    }
  },
  components: {
    editName,
    VueQRCodeComponent,
    passInput
  },
  computed: {
    address() {
      return this.$store.getters.swtAddress;
    },
    jcWallet() {
      return this.$store.getters.jcWallet;
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    setPassData(password) {
      this.password = password;
    },
    onCopy() {

    },
    onError() {

    },
    showSecret() {
      if (this.$refs.password.isValid()) {
        return;
      }
      let password = this.password;
      let jcWallet = this.jcWallet;
      let inst = new JingchangWallet(jcWallet);
      inst.getSecretWithType(password, "swt").then((secret) => {
        this.secret = secret;
        this.isShowSecret = true;
      }).catch(error => {
        // Toast.fail(error);
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.head {
  padding: 0 10px;
  background-color: #eaf0fd;
  border-radius: 8px 8px 0px 0px;
  height: 64px;
  display: flex;
  line-height: 64px;
  color: #343436;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  .left {
    width: 25%;
    text-align: left;
  }
  .middle {
    width: 50%;
    text-align: center;
  }
  .right {
    width: 25%;
    text-align: right;
  }
}
.address_div {
  text-align: center;
  .name {
    padding: 20px 0;
    color: #0e0e0e;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
  }
  .image {
    margin-left: 32%;
  }
  .text_div {
    color: #232323;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    margin-top: 10px;
    display: flex;
    text-align: left;
    word-break: break-all;
    padding-left: 10px;
    .text {
      width: 92%;
    }
    .copy {
      width: 8%;
      margin-top: 5px;
      text-align: left;
    }
  }
}
.input_div {
  width: 94%;
  padding-left: 3%;
  text-align: center;
  margin-top: 20px;
}
.button_div {
  text-align: center;
  .button {
    width: 94%;
    background-color: #366bf2;
    height: 48px;
    line-height: 48px;
    border-radius: 6px;
    opacity: 0.7;
    border: none;
    outline: none;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
  }
}
</style>