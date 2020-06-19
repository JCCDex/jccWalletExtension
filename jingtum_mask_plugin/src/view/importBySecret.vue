<template>
    <div>
    <commonHead :titleText="$t('message.menu.importWallet')"></commonHead>
    <div class="body">
      <div class="title">
        <div class="name">{{$t('message.home.addressName')}}:</div>
        <div class="value">
          <editName :memoName="memoName" :titleAlign="'left'" :widthData="'14'" @setMemoName="setMemoName"></editName>
        </div>
      </div>
      <div class="inputClass">
        <passInput ref="secret" :isSecret="true" :textMsg="$t('message.home.setSecretText')" @setPassData="setSecretData" ></passInput>
      </div>
      <div class="inputClass">
        <passInput ref="password" :textMsg="$t('message.home.passwordText4')" @setPassData="setPassData"></passInput>
      </div>
      <div class="buttonClass">
        <button @click="importWallet()" >{{$t('message.home.sureText')}}</button>
      </div>
    </div>
    </div>
</template>
<script>
import commonHead from "../components/commonHead";
import passInput from "../components/passInput";
import editName from "../components/editName";
import { jtWallet, JingchangWallet } from "jcc_wallet";
import { Toast } from "vant";
export default {
  data() {
    return {
      memoName: "SWTC",
      password: "",
      secret: ""
    };
  },
  components: {
    commonHead,
    passInput,
    editName
  },
  computed: {
    jcWallet() {
      return this.$store.getters.jcWallet;
    },
    address() {
      let address = "";
      if (this.secret) {
        address = jtWallet.getAddress(this.secret);
      }
      return address;
    }
  },
  methods: {
    setMemoName(memoName) {
      this.memoName = memoName;
    },
    setPassData(password) {
      this.password = password;
    },
    setSecretData(secret) {
      this.secret = secret;
    },
    importWallet() {
      if (this.$refs.secret.isValid()) {
        return;
      }
      if (this.$refs.password.isValid()) {
        return;
      }
      let jcWallet = this.jcWallet;
      let inst = new JingchangWallet(jcWallet, true);
      let secret = this.secret;
      let password = this.password;
      let getAddress = jtWallet.getAddress;
      inst.importSecret(secret, password, "swt", getAddress).then(jcWallet => {
        jcWallet = this.getJcWallet(jcWallet);
        let address = this.address;
        JingchangWallet.save(jcWallet);
        this.$store.dispatch("updateJCWallet", jcWallet);
        this.$store.dispatch("updateDefAddress", address); // 更新默认钱包
        Toast.success(this.$t("message.home.importSuccess"));
        this.$router.push({ name: "myWallet" });
      }).catch(error => {
        Toast.fail(error.toString());
      });
    },
    getJcWallet(jcWallet) {
      let wallets = jcWallet.wallets;
      let address = this.address;
      let list = [];
      for (let wallet of wallets) {
        if (wallet.address === address) {
          wallet.memoName = this.memoName;
          wallet.default = true;
        } else {
          wallet.default = false;
        }
        list.push(wallet);
      }
      jcWallet.wallets = list;
      return jcWallet;
    }
  }
};
</script>
<style lang="scss" scoped>
.body {
  padding: 30px 20px;
  .title {
    display: flex;
    height: 50px;
    line-height: 50px;
    color: #090909;
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    .name {
      width: 30%;
      text-align: left;
    }
    .value {
      width: 70%;
      text-align: left;
    }
  }
  .inputClass {
    padding: 5px 0;
  }
  .buttonClass {
    button {
      background-color: #366bf2;
      height: 48px;
      line-height: 48px;
      width: 100%;
      border: none;
      outline: none;
      border-radius: 6px;
      opacity: 0.7;
      color: #ffffff;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
    }
  }
}
</style>