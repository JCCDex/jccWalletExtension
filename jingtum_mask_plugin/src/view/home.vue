<template>
  <div style="margin-top:20px;">
    <div class="languageClass" @click.stop="showLanguage=!showLanguage;" >
      <input v-model="language" />
      <div class="leftImage">
        <img :src="languageImg"  />
      </div>
      <div class="rightImage">
        <img :src="arrowDown" v-if="!showLanguage" />
        <img :src="arrowUp" v-if="showLanguage" />
      </div>
      <div class="choose" v-if="showLanguage">
        <div v-for="item in languages" :key="item.name" @click="chooseLanguage(item)" :class="langType===item.name?'checked':'common'">{{item.value}}</div>
      </div>
    </div>
    <img src="../assets/logo.png" width="110px;" height="110px">
    <div class="homeText">{{this.$t("message.home.home_text")}}</div>
    <div style="font-size:26px;color:#2538D1;margin-bottom:30px;">{{this.$t("message.home.mark_text")}}</div>
    <div v-if="noJcWallet" class="input_div">
      <button class="homeBtn" @click="goTo('newWallet')">{{this.$t("message.home.create_wallet")}}</button>
      <button class="homeBtn" @click="goTo('importByMnenonic')" style="background:#00BD91;">{{this.$t("message.home.import_wallet")}}</button>
    </div>
    <div v-else>
      <div class="input_div">
         <passInput ref="password" :textMsg="this.$t('message.home.passwordText3')" @setPassData="setPassData" ></passInput>
      </div>
      <div class="input_div">
        <button class="homeBtn" @click="goLogin" >{{this.$t('message.home.sureText')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import passInput from "../components/passInput";
import { JingchangWallet } from "jcc_wallet";
import { Toast } from "vant";
import { getError } from "js/utils"
import languageImg from "@/images/language.png";
import arrowDown from "@/images/arrowDown.png";
import arrowUp from "@/images/arrowUp.png";
import bus from "../js/bus";
export default {
  name: "index",
  data() {
    return {
      password: "",
      languageImg,
      arrowDown,
      arrowUp,
      showLanguage: false,
      languages: [{ name: "zh", value: "中文" }, { name: "en", value: "English" }],
    };
  },
  computed: {
    jcWallet() {
      let jcWallet = this.$store.getters.jcWallet;
      return jcWallet;
    },
    noJcWallet() {
      return !JingchangWallet.isValid(this.jcWallet)
    },
    langType() {
      let lang = this.$i18n.locale;
      return lang;
    },
    language() {
      let lang = this.$i18n.locale;
      if (lang === "zh") {
        return "中文";
      } else {
        return "English";
      }
    }
  },
  components: {
    passInput
  },
  methods: {
    chooseLanguage(item) {
      this.$i18n.locale = item.name;
      localStorage.setItem("languageType", this.$i18n.locale);
    },
    setPassData(password) {
      this.password = password;
    },
    goLogin() {
      if (this.$refs.password.isValid()) {
        return;
      }
      let password = this.password;
      let jcWallet = this.jcWallet;
      let inst = new JingchangWallet(jcWallet);
      inst.getSecretWithType(password, "swt").then(() => {
        Toast.success(this.$t("message.home.loginSuccess"));
        this.$store.dispatch("updateIsLogin", 1);
        bus.$emit("savePassword", password);
        this.$router.push({
          name: "myWallet"
        });
      }).catch(error => {
        Toast.fail(this.$t(getError(error.toString())));
      });
    },
    goTo(name) {
      this.$router.push({ name });
    }
  }
};
</script>

<style lang="scss" scoped >
.homeText {
  font-size: 32px;
  font-weight: 600;
  color: rgba(52, 52, 54, 1);
  line-height: 45px;
  margin: 20px auto 8px;
}
.homeBtn {
  width: 100%;
  height: 54px;
  background: rgba(54, 107, 242, 1);
  color: #ffffff;
  font-size: 16px;
  border-radius: 6px;
  display: inline-block;
  box-sizing: border-box;
  margin: 0 0 30px;
  padding: 0 20px;
  line-height: 54px;
  text-align: center;
  border: none;
  outline: none;
  -webkit-appearance: none;
  -webkit-text-size-adjust: 100%;
}
.input_div {
  padding-left: 5%;
  width: 90%;
}
.languageClass {
  cursor: pointer;
  text-align: right;
  padding-right: 20px;
  margin-bottom: 30px;
  input {
    padding-left: 30px;
    width: 70px;
    height: 30px;
    border-radius: 15px;
    border-inline: none;
    border: 1px solid #366bf2;
  }
  .leftImage {
    position: relative;
    text-align: right;
    margin-right: 80px;
    margin-top: -25px;
    img {
      width: 16px;
    }
  }
  .rightImage {
    position: relative;
    text-align: right;
    margin-right: 6px;
    margin-top: -25px;
    img {
      width: 12px;
    }
  }
  .choose {
    position: absolute;
    width: 100px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
    left: 66%;
    // float: right;
    margin-top: 16px;
    border-radius: 8px;
    padding: 4px 0;
    text-align: center;
    .checked {
      background-color: #d7e1fc;
      height: 30px;
      line-height: 30px;
    }
    .common {
      height: 30px;
      line-height: 30px;
    }
    // border: 1px solid #000000;
  }
}
</style>
