<template>
  <div>
    <commonHead :showLeft="true" :titleText="$t('message.setting.addContact')"></commonHead>
    <div class="nameClass">
      <input ref="nameInput" v-model="memoName.name" @focus="clicked('name')" @blur="memoName.showBorder=false;" :style="getStyle('name')" :placeholder="$t('message.setting.contactName')"/>
      <div class="errorText">{{nameErrorText}}</div>
    </div>
    <div class="addressClass">
      <input ref="addressInput" v-model="address.value" @focus="clicked('address')" @blur="address.showBorder=false;" :style="getStyle('address')" :placeholder="$t('message.setting.contactAddress')"/>
      <div class="errorText">{{addressErrorText}}</div>
    </div>
    <div class="buttonClass">
      <div class="cancel">
          <button @click.stop="reset()">{{$t("message.home.cancelText")}}</button>
      </div>
       <div class="sure">
          <button @click.stop="addNewContact()">{{$t("message.home.sureText")}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import commonHead from "../../components/commonHead";
import Lockr from "lockr";
import { jtWallet } from "jcc_wallet";
import { Toast } from "vant";
export default {
  data() {
    return {
      memoName: { name: "", isFocus: false, showBorder: false },
      address: { value: "", isFocus: false, showBorder: false }
    }
  },
  components: {
    commonHead
  },
  computed: {
    nameErrorText() {
      let errorText = "";
      if (!this.memoName.name && this.memoName.isFocus) {
        errorText = this.$t("message.setting.contactNull");
      }
      return errorText;
    },
    addressErrorText() {
      let errorText = "";
      if (this.address.value) {
        if (!this.isValidAddress(this.address.value)) {
          errorText = this.$t("message.setting.addressError");
        }
      } else {
        if (this.address.isFocus) {
          errorText = this.$t("message.setting.addressNull")
        }
      }
      return errorText;
    }
  },
  methods: {
    clicked(type) {
      if (type === "name") {
        this.memoName.isFocus = true;
        this.memoName.showBorder = true;
      } else {
        this.address.isFocus = true;
        this.address.showBorder = true;
      }
    },
    getStyle(type) {
      let str = "";
      if (type === "name") {
        if (this.memoName.showBorder) {
          str = "border:1px solid #366BF2;"
        }
      } else {
        if (this.address.showBorder) {
          str = "border:1px solid #366BF2;"
        }
      }
      return str;
    },
    isValidAddress(address) {
      return jtWallet.isValidAddress(address)
    },
    addNewContact() {
      this.$refs.nameInput.focus();
      if (this.nameErrorText) {
        return;
      }
      this.$refs.addressInput.focus();
      if (this.addressErrorText) {
        return;
      }
      let data = { name: this.memoName.name, address: this.address.value };
      let list = Lockr.get("contactList") || [];
      if (Array.isArray(list) && list.length > 0) {
        for (let value of list) {
          if (value.address === data.address) {
            Toast.fail(this.$t("message.setting.contactExist"));
            return;
          }
        }
      }
      list.push(data);
      Lockr.set("contactList", list);
      Toast.success(this.$t("message.setting.addSuccess"))
      this.$router.go(-1);
    },
    reset() {
      this.memoName = { name: "", isFocus: false };
      this.address = { value: "", isFocus: false }
    }
  }
}
</script>
<style lang="scss" scoped>
.nameClass {
  padding: 30px 30px 0 20px;
  input {
    border: 1px solid #d9dce5;
    height: 48px;
    line-height: 48px;
    width: 100%;
    border-radius: 8px;
    padding-left: 10px;
    outline: none;
    color: #090909;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
  }
}
.addressClass {
  padding: 0 30px 30px 20px;
  input {
    border: 1px solid #d9dce5;
    height: 48px;
    line-height: 48px;
    width: 100%;
    border-radius: 8px;
    padding-left: 10px;
    outline: none;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #090909;
  }
}
.errorText {
  text-align: left;
  padding-left: 10px;
  color: #f74645;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  height: 30px;
  line-height: 30px;
}
.buttonClass {
  display: flex;
  .cancel {
    width: 50%;
    padding-left: 20px;
    text-align: left;
    button {
      width: 80%;
      height: 48px;
      line-height: 48px;
      background-color: #bdc3d0;
      border-radius: 6px;
      border: none;
      outline: none;
      color: #ffffff;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
    }
  }
  .sure {
    width: 50%;
    padding-right: 20px;
    text-align: right;
    button {
      width: 80%;
      height: 48px;
      line-height: 48px;
      background-color: #366bf2;
      border-radius: 6px;
      border: none;
      outline: none;
      color: #ffffff;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
    }
  }
}
</style>