<template>
  <div>
    <commonHead :titleText="$t('message.home.transferText')"></commonHead>
    <div class="bodyClass">
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
          <input ref="token" :readonly="true"  :placeholder="$t('message.transfer.coinPlaceholder')" v-model="form.token.name" />
          <div class="checkCoin">
            <img :src="checkCoin" @click.stop="showCoins=!showCoins;" style="width:12px;" />
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
          <input ref="amount" type="number" @focus="form.amount.isFocus=true;"  :placeholder="$t('message.transfer.amountPlaceholder')" v-model="form.amount.value" />
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
          <passInput :textMsg="$t('message.home.passwordText4')" @setPassData="setPassData" style="width:98%;"></passInput>
        </div>
      </div>
      <div class="buttonClass">
        <button>{{$t("message.home.sureText")}}</button>
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
    <div v-if="showContact" class="coverClass"></div>
  </div>
</template>
<script>
import commonHead from "../components/commonHead";
import { jtWallet } from "jcc_wallet";
import passInput from "../components/passInput";
import checkContact from "../images/contactsImg.png";
import closeImg from "../images/closeImg.png";
import checkCoin from "../images/checkCoin.png";
import Lockr from "lockr";
import bus from "../js/bus";
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
      contactList: []
    }
  },
  components: {
    commonHead,
    passInput
  },
  computed: {
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
      return this.$store.getters.coins;
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
    closeDialog() {
      this.showCoins = false;
    },
    init() {
      let contactList = Lockr.get("contactList") || [];
      this.contactList = [...contactList];
    },
    setPassData(password) {
      this.form.password = password;
    },
    checkAddress(address) {
      this.form.address.value = address;
      this.showContact = false;
    },
    getStyle(data, type) {
      let value = this.form[`${type}`].value;
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
  opacity: 0.6;
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