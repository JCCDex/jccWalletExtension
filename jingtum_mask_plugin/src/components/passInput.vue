<template>
    <div>
        <div class="div_class">
            <input v-model="password.data" @change="setPassData" :style="password.showBorder?'border:1px solid #366BF2;':''" @focus="clicked()" @blur="password.showBorder=false;" :type="isOpen?'':'password'" :placeholder="passwordText" class="input_class" />
            <div class="eye_class">
                <img v-if="isOpen" :src="eyeOpen" @click="checkType" style="width:20px;height:10px;" />
                <img v-else :src="eyeClose" @click="checkType" style="width:20px;height:10px;" />
            </div>
            <div class="error_class">{{errorText}}</div>
        </div>
    </div>
</template>
<script>
import eyeOpen from "../images/eyeOpen.png";
import eyeClose from "../images/eyeClose.png";
import { jtWallet } from "jcc_wallet";
export default {
  data() {
    return {
      passwordText: "",
      password: { data: "", isFocus: false, showBorder: false },
      isOpen: false,
      eyeClose,
      eyeOpen
    }
  },
  props: {
    passData: { type: String, default: "" }, // 对比的密码值，默认为空
    textMsg: { type: String, default: "" }, // input 框 placeholder 内容
    // borderColor: { type: String, default: "#D9DCE5" }, // 输入框边框颜色
    isSecret: { type: Boolean, default: false }, // 是否是秘钥输入框
  },
  created() {
    setTimeout(() => {
      this.init();
    }, 50)
  },
  computed: {
    passwordError() {
      let errorText = "";
      if (this.password.data) {
        // 判断格式是否满足  8-64 位 且包含 大小写字母和数字
        if (!this.passwordRules(this.password.data)) {
          errorText = this.$t("message.home.passwordError");
        }
        // 判断是否是确认密码提示
        if (this.passData) {
          if (this.password.data !== this.passData) {
            errorText = this.$t("message.home.repasswordError");
          }
        }
      } else {
        // 判断是否点击输入框
        if (this.password.isFocus) {
          errorText = this.$t("message.home.passwordNull");
        }
      }
      return errorText;
    },
    secretError() {
      let errorText = "";
      if (this.password.data) {
        if (!jtWallet.isValidSecret(this.password.data)) {
          errorText = this.$t("message.home.secretError");
        }
      } else {
        // 判断是否点击输入框
        if (this.password.isFocus) {
          errorText = this.$t("message.home.secretNull");
        }
      }
      return errorText;
    },
    errorText() {
      if (this.isSecret) {
        return this.secretError;
      } else {
        return this.passwordError;
      }
    }
  },
  methods: {
    clicked() {
      this.password.isFocus = true;
      this.password.showBorder = true;
    },
    init() {
      if (this.textMsg) {
        this.passwordText = this.textMsg;
      } else {
        if (!this.passData) {
          this.passwordText = this.$t("message.home.passwordText2");
        } else {
          this.passwordText = this.$t("message.home.rePasswordText");
        }
      }
    },
    reset() {
      this.password.data = "";
      this.password.isFocus = false;
    },
    setPassData() {
      let password = this.password.data;
      this.$emit("setPassData", password);
    },
    checkType() {
      this.isOpen = !this.isOpen;
    },
    getInputStyle() {
      let str = "border: 1px solid ";
      str = str + this.borderColor + ";";
      return str;
    },
    // 密码格式验证
    passwordRules(pass) {
      return /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*^[^ |^*|^'|^"]+$).{8,64}$/.test(pass);
    },
    isValid() {
      this.password.isFocus = true;
      if (this.errorText) {
        return true;
      } else {
        return false;
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.div_class {
  .input_class {
    width: 84%;
    height: 44px;
    border-radius: 6px;
    padding-left: 4%;
    padding-right: 12%;
    border-inline: none;
    outline: none;
    color: #090909;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    border: 1px solid #d9dce5;
  }
  .eye_class {
    margin-top: -30px;
    text-align: right;
    padding-right: 4px;
  }
  .error_class {
    color: #f74645;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    text-align: left;
    padding-left: 10px;
    margin-top: 15px;
    height: 20px;
    line-height: 20px;
  }
}
</style>