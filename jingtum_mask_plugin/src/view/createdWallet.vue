<template>
  <div>
      <commonHead :titleText="$t('message.menu.createdWallet')"></commonHead>
      <div class="body">
        <div class="styleClass">
          <div class="title">{{$t("message.home.addressName")}}:</div>
          <div class="value">
            <editName :memoName="memoName" @setMemoName="setMemoName"  :titleAlign="'left'"></editName>
          </div>
        </div>
        <div class="styleClass">
          <div class="title">{{$t("message.home.addressText")}}:</div>
          <div class="value">{{wallet.address}}</div>
          <div class="image" >
            <img :src="copyImg" v-clipboard:copy="wallet.address" v-clipboard:success="onCopy" v-clipboard:error="onError" style="width:18px;"/>
          </div>
        </div>
        <div class="styleClass">
          <div class="title">{{$t("message.home.secretText")}}:</div>
          <div class="value">{{wallet.secret}}</div>
          <div class="image" >
            <img :src="copyImg" v-clipboard:copy="wallet.secret" v-clipboard:success="onCopy" v-clipboard:error="onError" style="width:18px;"/>
          </div>
        </div>
        <div class="buttonClass">
          <button @click.stop="saveWallet()">{{$t("message.home.sureText")}}</button>
        </div>
      </div>
  </div>
</template>
<script>
import commonHead from "../components/commonHead";
import editName from "../components/editName";
import copyImg from "../images/copyImg.png";
import { jtWallet, JingchangWallet } from "jcc_wallet";
import { decrypt } from "jcc_wallet/lib/util";
import { updateMnemonicData } from "../js/utils";
import { createdWallet } from "../js/user";
import { Toast } from "vant";
import bus from "../js/bus";
import Lockr from "lockr";
export default {
  data() {
    return {
      wallet: "",
      memoName: "Account",
      password: "",
      copyImg,
      mnemonicData: ''
    };
  },
  components: {
    commonHead,
    editName
  },
  created() {
    bus.$on("setPassword", this.createdWallet);
    this.init();
  },
  beforeDestroy() {
    bus.$off("setPassword", this.createdWallet);
  },
  computed: {
    jcWallet() {
      return this.$store.getters.jcWallet;
    }
  },
  methods: {
    init() {
      bus.$emit("obtainPassword");
      let mnemonicData = Lockr.get("mnemonicData") || {};
      let key = mnemonicData.currentCountKey || "1";
      key = parseInt(key) + 1;
      this.memoName = this.memoName + key;
    },
    setMemoName(memoName) {
      this.memoName = memoName;
    },
    onCopy() {
      Toast.success(this.$t("message.home.copySuccess"));
    },
    onError() {
      Toast.fail(this.$t("message.home.copyError"));
    },
    createdWallet(password) {
      this.password = password;
      let mnemonicData = Lockr.get("mnemonicData");
      let mnemonic = decrypt(password, mnemonicData);
      let data = createdWallet(mnemonic);
      this.mnemonicData = data;
      this.wallet = { address: jtWallet.getAddress(data.privateKey), secret: data.privateKey };
    },
    saveWallet() {
      let jcWallet = this.jcWallet;
      let inst = new JingchangWallet(jcWallet, true); // 不是默认钱包
      let secret = this.wallet.secret;
      let password = this.password;
      let getAddress = jtWallet.getAddress;
      inst.importSecret(secret, password, "swt", getAddress).then(jcWallet => {
        jcWallet = this.getJcWallet(jcWallet);
        JingchangWallet.save(jcWallet);
        this.$store.dispatch("updateJCWallet", jcWallet);
        let data = this.mnemonicData;
        updateMnemonicData(data); // 更新 mnemonicData ;
        this.$router.push({ name: "myWallet" });
        Toast.success(this.$t("message.home.createdSuccess"));
      }).catch(error => {
        Toast.fail(error.toString());
      });
    },
    // 更新memoName
    getJcWallet(jcWallet) {
      let wallets = jcWallet.wallets;
      let address = this.wallet.address;
      let list = [];
      for (let wallet of wallets) {
        if (wallet.address === address) {
          wallet.memoName = this.memoName;
        }
        list.push(wallet);
      }
      jcWallet.wallets = list;
      return jcWallet;
    }
    // obtainPassword(password) {
    //   this.password = password;
    // }
  }
};
</script>
<style lang="scss" scoped>
.body {
  padding: 30px 20px;
  .styleClass {
    display: flex;
    min-height: 60px;
    .title {
      width: 30%;
      color: #090909;
      font-size: 16px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      text-align: left;
    }
    .value {
      width: 62%;
      text-align: left;
      color: #3e424c;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      word-break: break-all;
    }
    .image {
      width: 8%;
      margin-top: 3px;
    }
  }
  .buttonClass {
    padding-top: 20px;
    button {
      background-color: #366bf2;
      border: none;
      border-radius: 6px;
      width: 100%;
      height: 48px;
      line-height: 48px;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
    }
  }
}
</style>