<template>
  <div class="dialogClass">
    <div class="content">
     <div class="title">{{titleText}}</div>
     <div>
        <passInput ref="password" @setPassData="setPassData" :borderColor="'#D9DCE5'" :textMsg="$t('message.home.passwordText3')"></passInput>
     </div>
     <div class="buttonClass">
        <div class="cancel">
         <button @click="cancel" >{{$t('message.home.cancelText')}}</button>
        </div>
        <div class="sure">
         <button @click="deleteWallet" >{{$t('message.home.sureText')}}</button>
        </div>
     </div>
    </div>
  </div>
</template>
<script>
import passInput from "./passInput";
import { getError } from "../js/utils";
import { JingchangWallet } from "jcc_wallet";
import { Toast } from "vant";
export default {
  data() {
    return {
      //   titleText: "确认删除钱包Account 1"
    }
  },
  props: {
    titleText: { type: String, require: true } // 标题文字
  },
  components: {
    passInput
  },
  computed: {
    jcWallet() {
      return this.$store.getters.jcWallet;
    }
  },
  methods: {
    cancel() {
      this.$emit("closeDialog");
    },
    setPassData(password) {
      this.password = password;
    },
    deleteWallet() {
      if (this.$refs.password.isValid()) {
        return;
      }
      let jcWallet = this.jcWallet;
      let inst = new JingchangWallet(jcWallet);
      let password = this.password;
      inst.getSecretWithType(password, "swt").then(() => {
        this.$emit("deleteWallet");
      }).catch(error => {
        Toast.fail(this.$t(getError(error.toString())));
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.dialogClass {
  position: fixed;
  top: 30%;
  left: 7%;
  width: 86%;
  background-color: #ffffff;
  border-radius: 8px;
  .content {
    padding: 30px 20px;
    .title {
      text-align: center;
      color: #3e424c;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      padding-bottom: 20px;
    }
    .buttonClass {
      display: flex;
      .cancel {
        width: 50%;
        text-align: left;
        button {
          text-align: center;
          height: 48px;
          line-height: 48px;
          background-color: #bdc3d0;
          color: #ffffff;
          border-radius: 6px;
          width: 80%;
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          border: none;
          outline: none;
        }
      }
      .sure {
        width: 50%;
        text-align: right;
        button {
          text-align: center;
          height: 48px;
          line-height: 48px;
          background-color: #4484fe;
          color: #ffffff;
          border-radius: 6px;
          width: 80%;
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          border: none;
          outline: none;
        }
      }
    }
  }
}
</style>