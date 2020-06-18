<template>
  <div>
    <commonHead :titleText="$t('message.home.transferText')"></commonHead>
    <div class="bodyClass">
        <div class="content" style="padding-bottom:25px;">
            <div class="name">{{$t("message.home.walletName")}}:</div>
            <div class="value">
              <input ref="address" @click.stop="toShowWalletList" :readonly="true" v-model="myAddress.name" />
              <div class="checkCoin">
               <img :src="checkCoin" @click.stop="toShowWalletList" style="width:12px;" />
              </div>
              <div class="walletList" v-if="showWalletList">
                <div v-for="wallet in wallets" :key="wallet.address" @click.stop="checkMyAddress(wallet)" class="walletClass" :style="getStyle(wallet.address,'myWallet')">
                    {{getAddressStr(wallet.address,wallet.memoName)}}
                </div>
              </div>
            </div>
      </div>
      <div class="content">
        <div class="name">{{$t("message.home.addressText")}}:</div>
        <div class="value">
          <input ref="address" @focus="form.address.isFocus=true;" :placeholder="$t('message.transfer.addressPlaceholder')" v-model="form.address.value" />
        </div>
        <div class="checkClass">
          <img :src="checkContact" @click.stop="showContact=true;" style="width:16px;" />
        </div>
      </div>
      <div class="error">{{addressError}}</div>
      <div class="content">
        <div class="name">{{$t("message.transfer.coinText")}}:</div>
        <div class="value">
          <input ref="token" :readonly="true" @click.stop="toShowCoins"  :placeholder="$t('message.transfer.coinPlaceholder')" v-model="form.token.name" />
          <div class="checkCoin">
            <img :src="checkCoin" @click.stop="toShowCoins" style="width:12px;" />
          </div>
          <div v-if="showCoins" class="coinClass">
            <div class="body" :style="getStyle(coin.value,'token')" @click.stop="checkCoins(coin)" v-for="coin in coins" :key="coin.value">{{coin.name}}</div>
          </div>
        </div>
      </div>
      <div class="error">{{tokenError}}</div>
      <div class="content">
        <div class="name">{{$t("message.transfer.amountText")}}:</div>
        <div class="valueCommon">
          <input ref="amount" type="number" @focus="form.amount.isFocus=true;"  :placeholder="placeholderAmount" v-model="form.amount.value" />
        </div>
      </div>
      <div class="error">{{amountError}}</div>
      <div class="content">
        <div class="name">{{$t("message.transfer.memoText")}}:</div>
        <div class="valueCommon">
          <input ref="memo" :placeholder="$t('message.transfer.memoPlaceholder')" v-model="form.memo.value" />
        </div>
      </div>
      <div class="error"></div>
      <div class="content">
        <div class="name">{{$t("message.transfer.passwordText")}}:</div>
        <div class="valueCommon" >
          <passInput ref="password" :textMsg="$t('message.home.passwordText4')" @setPassData="setPassData" style="width:98%;"></passInput>
        </div>
      </div>
      <div class="buttonClass">
        <button @click="submitOrder()">{{$t("message.home.sureText")}}</button>
      </div>
    </div>
    <div v-if="showContact" class="contactClass">
      <div class="title">
        <div class="text">{{$t("message.setting.contactText")}}</div>
        <div class="close">
           <img :src="closeImg" @click.stop="showContact=false;" style="width:14px;" />
        </div>
      </div>
      <div class="content">
        <div class="body" :style="getStyle(contact.address,'address')" @click.stop="checkAddress(contact.address)" v-for="(contact,index) in contactList" :key="index">
            <div class="name">{{contact.name}}</div>
            <div class="value">{{contact.address}}</div>
        </div>
      </div>
    </div>
    <div v-if="showContact || loading" class="coverClass">
        <div v-if="loading" style="margin-top:75%">
          <van-loading   type="spinner" color="#6EFEFF" :size="50"></van-loading>
        </div>
    </div>
  </div>
</template>
<script>
import commonHead from "../components/commonHead";
import { jtWallet, JingchangWallet } from "jcc_wallet";
import JCCExchange from "jcc_exchange";
import { ExplorerFactory, JcExplorer } from "jcc_rpc";
import passInput from "../components/passInput";
import checkContact from "../images/contactsImg.png";
import closeImg from "../images/closeImg.png";
import checkCoin from "../images/checkCoin.png";
import Lockr from "lockr";
import bus from "../js/bus";
import { getError, getUUID, walletFrozen } from "../js/utils";
import { getUserBalances } from "../js/user";
import { getExplorerHost } from "../js/api";
import { Loading, Toast } from "vant";
import Vue from 'vue'
Vue.use(Loading);
export default {
  data() {
    return {
      form: {
        address: { value: "", isFocus: false },
        token: { name: "", value: "", isFocus: false },
        amount: { value: "", isFocus: false },
        memo: { value: "", isFocus: false },
        password: ""
      },
      checkContact,
      closeImg,
      checkCoin,
      showContact: false,
      showCoins: false,
      loading: false,
      showWalletList: false,
      contactList: [],
      myAddress: { name: "", value: "" },
      tranferCount: 1
    }
  },
  components: {
    commonHead,
    passInput
  },
  computed: {
    placeholderAmount() {
      let coin = this.form.token.name;
      let str = this.$t('message.transfer.amountPlaceholder');
      if (coin) {
        let available = this.available;
        let amount = available + " " + coin;
        str = this.$t('message.transfer.ableAmount', { amount });
      }
      return str;
    },
    address() {
      let address = this.$store.getters.defAddress;
      let data = { value: address };
      let wallets = this.wallets || [];
      let memoName = "";
      for (let wallet of wallets) {
        if (wallet.address === address) {
          memoName = wallet.memoName;
        }
      }
      let name = this.getAddressStr(address, memoName);
      data.name = name;
      return data;
    },
    wallets() {
      return this.jcWallet.wallets || [];
    },
    addressError() {
      let errorText = "";
      let address = this.form.address.value;
      if (address) {
        if (!jtWallet.isValidAddress(address)) {
          errorText = this.$t("message.setting.addressError");
        }
      } else {
        if (this.form.address.isFocus) {
          errorText = this.$t("message.setting.addressNull");
        }
      }
      return errorText;
    },
    tokenError() {
      let token = this.form.token.value;
      let isFocus = this.form.token.isFocus;
      let errorText = "";
      if (!token && isFocus) {
        errorText = this.$t("message.transfer.coinNull");
      }
      return errorText;
    },
    amountError() {
      let amount = this.form.amount.value;
      let isFocus = this.form.amount.isFocus;
      let errorText = "";
      amount = parseFloat(amount);
      if ((amount <= 0 || !amount) && isFocus) {
        errorText = this.$t("message.transfer.amountError");
      }
      return errorText;
    },
    coins() {
      if (this.isDefAddress) {
        return this.$store.getters.coins;
      } else {
        return this.$store.getters.currentCoins;
      }
    },
    jcWallet() {
      return this.$store.getters.jcWallet;
    },
    isDefAddress() {
      let myAddress = this.myAddress.value;
      let address = this.address.value;
      if (myAddress === address) {
        return true;
      } else {
        return false;
      }
    },
    available() {
      let amount = 0;
      let coin = this.form.token.name;
      let balance = {};
      if (this.isDefAddress) {
        balance = this.$store.getters.balance || {}; // 默认钱包资产
      } else {
        balance = this.$store.getters.currentBalance || {}; // 所选钱包资产
      }
      if (coin) {
        let coinAble = balance[`${coin}`] || {};
        amount = coinAble.available || 0;
      }
      return amount;
    }
  },
  created() {
    this.init();
    bus.$on("closeDialog", this.closeDialog);
  },
  beforDestroy() {
    bus.$off("closeDialog", this.closeDialog);
  },
  methods: {
    toShowWalletList() {
      this.showWalletList = !this.showWalletList;
      bus.$emit("goClose", "myWallet");
    },
    toShowCoins() {
      this.showCoins = !this.showCoins;
      bus.$emit("goClose", "coins")
    },
    closeDialog(name) {
      if (name !== "coins") {
        this.showCoins = false;
      }
      if (name !== "myWallet") {
        this.showWalletList = false;
      }
    },
    checkMyAddress(wallet) {
      let address = wallet.address;
      getUserBalances(address); // 更新资产和币种
      let memoName = wallet.memoName;
      let name = this.getAddressStr(address, memoName);
      this.myAddress = { name, value: address };
      this.showWalletList = false;
      bus.$emit("goClose", "myWallet");
    },
    init() {
      let contactList = Lockr.get("contactList") || [];
      this.contactList = [...contactList];
      this.myAddress = this.address;
      setTimeout(() => {
        getUserBalances(); // 获取资产和币种
      }, 50)
    },
    setPassData(password) {
      this.form.password = password;
    },
    getAddressStr(address, memoName = "") {
      let str = "";
      if (address) {
        str = address.substring(0, 4) + "******" + address.substring(address.length - 4, address.length);
      }
      if (memoName) {
        str = memoName + ": " + str;
      }
      return str;
    },
    checkAddress(address) {
      this.form.address.value = address;
      this.showContact = false;
      bus.$emit("goClose", "coins");
    },
    getStyle(data, type) {
      let value = "";
      if (type === "myWallet") {
        value = this.myAddress.value;
      } else {
        value = this.form[`${type}`].value;
      }
      let background = "";
      if (value === data) {
        background = "background-color:#EFF3FC;"
      }
      return background;
    },
    checkCoins(coin) {
      this.form.token.value = coin.value;
      this.form.token.name = coin.name;
      this.showCoins = false;
    },
    isValidFrozen(address) {
      return new Promise(async (resolve, reject) => {
        let res = await walletFrozen(address);
        let flag = true;
        if (res.result) {
          if (!res.frozen) {
            flag = false;
          }
        } else {
          flag = false;
        }
        return resolve(flag);
      });
    },
    async  submitOrder() {
      this.loading = true;
      let valid = this.formValidate();
      if (valid) {
        this.loading = false;
        return;
      }
      let password = this.form.password;
      let address = this.myAddress.value;
      let to = this.form.address.value;
      let currency = this.form.token.value;
      let amount = this.form.amount.value;
      let memo = this.form.memo.value;
      let jcWallet = this.jcWallet;
      let urls = process.env.jcNodes;;
      let inst = new JingchangWallet(jcWallet);
      let isFrozen = false;
      let isActive = false;
      inst.getSecretWithAddress(password, address).then((secret) => {
        // 判断双方钱包是否激活
        this.addressActive(address, to).then(() => {
          // 判断钱包是否冻结
          this.isValidAddress(address, to).then(() => {
            JCCExchange.init(urls);
            JCCExchange.transfer(address, secret, amount, memo, to, currency).then((hash) => {
              setTimeout(() => {
                this.searchHash(hash);
              }, 1000 * 10);
            }).catch(error => {
              this.loading = false;
              this.form.password = "";
              Toast.fail(error.message);
            })
          }).catch((error) => {
            this.loading = false;
            this.form.password = "";
            Toast.fail(error);
          })
        }).catch((error) => {
          this.loading = false;
          this.form.password = "";
          Toast.fail(error);
        });
      }).catch((error) => {
        this.loading = false;
        this.form.password = "";
        Toast.fail(this.$t(getError(error)));
      })

    },
    async searchHash(hash) {
      const inst = new JcExplorer(getExplorerHost());
      let res = await inst.orderDetail(getUUID(), hash);
      if (res.result && res.data && res.data.succ === "tesSUCCESS") {
        Toast.success(this.$t("message.transfer.transferSuccess"));
        this.form.password = "";
        this.tranferCount = 1;
        this.loading = false;
      } else {
        // 查询失败重复查询3次
        if (this.tranferCount < 3) {
          setTimeout(() => {
            this.searchHash(hash);
          }, 1500);
          this.tranferCount++;
        } else {
          this.tranferCount = 1;
          this.loading = false;
          Toast.fail(this.$t("message.transfer.searchFail"));
        }
      }
    },
    // 判断钱包是否冻结
    isValidAddress(wallet, address) {
      return new Promise(async (resolve, reject) => {
        let isFrozen = await this.isValidFrozen(wallet);
        if (!isFrozen) {
          reject(this.$t("message.transfer.walletFrozen"))
        } else {
          let isFrozen2 = await this.isValidFrozen(address);
          if (!isFrozen2) {
            reject(this.$t("message.transfer.addressFrozen"));
          } else {
            resolve(true);
          }
        }
      })
    },
    addressActive(wallet, address) {
      return new Promise(async (resolve, reject) => {
        let code = await this.getActive(wallet);
        if (code === "2004") {
          //   Toast.fail(this.$t("message.transfer.walletActive"));
          return reject(this.$t("message.transfer.walletActive"));
        } else {
          //   判断转入币种是否是  swt
          let token = this.form.token.value;
          let amount = this.form.amount.value;
          if (token === "SWTC" && amount >= 35) {
            return resolve(true);
          } else {
            // 判断转入钱包是否激活
            let code2 = await this.getActive(address);
            if (code2 === "2004") {
              //   Toast.fail(this.$t("message.transfer.addressActive"));
              return reject(this.$t("message.transfer.addressActive"));
            } else {
              return resolve(true);
            }
          }
        }
      });
    },
    // 判断钱包是否激活
    getActive(address) {
      return new Promise(async (resolve, reject) => {
        const instExplorer = ExplorerFactory.init(getExplorerHost());
        const res = await instExplorer.getBalances(getUUID(), address);
        if (res.code >= 0) {
          return resolve(res.code);
        }
      });
    },
    // 验证必填输入框信息
    formValidate() {
      if (this.$refs.address.focus()) {
        return true
      } else if (!this.form.token.value) {
        this.form.token.isFocus = true;
        return true;
      } else if (this.$refs.amount.focus()) {
        return true;
      } else if (this.$refs.password.isValid()) {
        return true;
      } else {
        return false;
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.bodyClass {
  padding: 30px 20px;
  .content {
    display: flex;
    color: #3e424c;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    .name {
      width: 27%;
      height: 40px;
      line-height: 40px;
      text-align: left;
    }
    .value {
      width: 73%;
      input {
        height: 40px;
        width: 86%;
        border: 1px solid #d9dce5;
        outline: none;
        border-radius: 6px;
        padding-left: 4%;
        padding-right: 10%;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
      }
      .coinClass {
        position: absolute;
        background-color: #ffffff;
        max-height: 240px;
        width: 65%;
        margin-top: 5px;
        border: 1px solid #366bf2;
        border-radius: 6px;
        overflow-y: scroll;
        .body {
          text-align: left;
          padding-left: 10px;
          color: #090909;
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          height: 40px;
          line-height: 40px;
        }
      }
      .walletList {
        position: absolute;
        width: 65%;
        margin-top: 5px;
        max-height: 200px;
        background-color: #ffffff;
        z-index: 5000;
        border-radius: 6px;
        border: 1px solid #366bf2;
        overflow-y: scroll;
        .walletClass {
          padding-left: 10px;
          text-align: left;
          height: 40px;
          line-height: 40px;
        }
      }
    }
    .valueCommon {
      width: 73%;
      input {
        height: 40px;
        padding-left: 4%;
        width: 94%;
        border: 1px solid #d9dce5;
        outline: none;
        border-radius: 6px;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
      }
    }
    .checkClass {
      position: absolute;
      left: 89%;
      margin-top: 14px;
    }
    .checkCoin {
      position: absolute;
      left: 90%;
      margin-top: -30px;
    }
  }
  .error {
    padding-left: 30%;
    text-align: left;
    white-space: nowrap;
    color: #f74645;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    height: 25px;
    line-height: 25px;
  }
  .buttonClass {
    padding-top: 30px;
    button {
      background-color: #366bf2;
      border-radius: 6px;
      opacity: 0.7;
      width: 100%;
      height: 48px;
      line-height: 48px;
      color: #ffffff;
      border: none;
    }
  }
}
.contactClass {
  position: fixed;
  z-index: 5000;
  width: 90%;
  left: 5%;
  top: 15%;
  height: 70%;
  border-radius: 10px;
  background-color: #ffffff;
  .title {
    display: flex;
    justify-content: space-between;
    height: 48px;
    line-height: 48px;
    border-bottom: 1px solid #d9dce5;
    .text {
      padding-left: 20px;
      color: #3e424c;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
    }
    .close {
      padding-right: 20px;
      margin-top: 3px;
    }
  }
  .content {
    height: 88%;
    overflow-y: scroll;
    .body {
      padding-left: 20px;
      border-bottom: 1px solid #d9dce5;
      text-align: left;
      height: 60px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      .name {
        color: #090909;
        padding-top: 10px;
        font-size: 16px;
      }
      .value {
        font-size: 14px;
        color: #515358;
      }
    }
  }
}
.coverClass {
  width: 100%;
  height: 100%;
  opacity: 0.7;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #242528;
}
</style>
<style>
.content::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
</style>