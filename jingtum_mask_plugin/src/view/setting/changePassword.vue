<template>
  <div>
    <commonHead :showLeft="true" :titleText="$t('message.setting.changePassword')"></commonHead>
    <div class="inputClass" style="padding-top:20px;">
     <passInput ref="oldPass" :textMsg="$t('message.setting.oldPassword')" :borderColor="'#D9DCE5'" @setPassData="setPassData"></passInput>
    </div>
    <div class="inputClass">
     <passInput ref="newPass" :textMsg="$t('message.setting.newPassword')" :borderColor="'#D9DCE5'" @setPassData="setNewPass"></passInput>
    </div>
    <div class="inputClass">
     <passInput ref="rePass" :textMsg="$t('message.setting.newPassword')" :borderColor="'#D9DCE5'" :passData="newPassword"></passInput>
    </div>
    <div class="buttonClass">
      <button @click="changePassword()">{{$t('message.home.sureText')}}</button>
    </div>
  </div>
</template>
<script>
import commonHead from "../../components/commonHead";
import passInput from "../../components/passInput";
import { JingchangWallet } from "jcc_wallet";
import { Toast } from 'vant';
import { getError } from "../../js/utils";
export default {
  data() {
    return {
      oldPassword: "",
      newPassword: ""
    }
  },
  components: {
    commonHead,
    passInput
  },
  computed: {
    jcWallet() {
      return this.$store.getters.jcWallet;
    },
    address() {
      return this.$store.getters.swtAddress;
    }
  },
  methods: {
    setPassData(password) {
      this.oldPassword = password;
    },
    setNewPass(data) {
      this.newPassword = data;
    },
    changePassword() {
      if (this.$refs.oldPass.isValid()) {
        return;
      }
      if (this.$refs.newPass.isValid()) {
        return;
      }
      if (this.$refs.rePass.isValid()) {
        return;
      }
      let jcWallet = this.jcWallet;
      let oldPassword = this.oldPassword;
      let newPassword = this.newPassword;
      let inst = new JingchangWallet(jcWallet);
      inst.changeWholePassword(oldPassword, newPassword).then((jcWallet) => {
        let newJCWallet = this.getJCWallet(jcWallet);
        JingchangWallet.save(newJCWallet);
        this.$store.dispatch("updateJCWallet", newJCWallet);
        Toast.success(this.$t("message.setting.changeSuccess"));
        this.$router.go(-1);
      }).catch((error) => {
        Toast.fail(this.$t(getError(error)));
      })
    },
    // 更新备注名称
    getJCWallet(jcWallet) {
      let oldWallets = [...this.jcWallet.wallets];
      let newWallets = [...jcWallet.wallets];
      let list = [];
      for (let newWallet of newWallets) {
        for (let oldWallet of oldWallets) {
          if (oldWallet.address === newWallet.address) {
            newWallet.memoName = oldWallet.memoName;
            list.push(newWallet);
            break;
          }
        }
      }
      jcWallet.wallets = list;
      return jcWallet;
    }
  }
}
</script>
<style lang="scss" scoped>
.inputClass {
  padding: 0 20px;
}
.buttonClass {
  padding: 20px;
  button {
    background-color: #366bf2;
    opacity: 0.7;
    color: #ffffff;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    height: 48px;
    line-height: 48px;
    border: none;
    border-radius: 6px;
    width: 100%;
    text-align: center;
  }
}
</style>