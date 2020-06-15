<template>
  <div>
    <commonHead :titleText="titleText" ></commonHead>
    <div v-if="step==='one'" class="bodyClass">
      <div class="titleClass">{{$t('message.importText.titleText')}}</div>
      <div class="content">
         <div v-for="(word,index) in wordList" :key="index" class="inputClass" >
            <input :id="`input${index}`" @focus="currentIndex=index;" @input="inputValue()"  type="text"   v-model="word.value" />
         </div>
      </div>
      <div class="buttonClass">
        <button @click.stop="goNext()">{{$t('message.home.nextText')}}</button>
      </div>
    </div>
    <div v-if="step==='two'" class="setPassword">
      <setPassword @createdSuccess="createdSuccess"></setPassword>
    </div>
    <!-- <van-loading v-show="showLoading" type="spinner" color="#1989fa" /> -->
  </div>
</template>
<script>
import commonHead from "../components/commonHead";
import setPassword from "../components/setPassword";
import { Toast } from 'vant';
import { mnemonicToEntropy } from "bip39";
import { createdWallet } from "../js/user";
import { saveMnemonicData, getError } from "../js/utils";
import { JingchangWallet } from "jcc_wallet";
import bus from "../js/bus";
const bip39 = require("bip39");
export default {
  data() {
    return {
      wordList: [],
      currentIndex: 0,
      mnemonicData: "",
      step: "one",
      //   showLoading: false
    }
  },
  components: {
    commonHead,
    setPassword
  },
  created() {
    this.init();
    console.log("萨 速 触 断 末 汤 晚 巨 炒 棚 涌 山");
  },
  computed: {
    titleText() {
      if (this.step === "one") {
        return this.$t('message.menu.importWallet');
      } else {
        return this.$t("message.home.setPassword");
      }
    }
  },
  methods: {
    init() {
      let wordList = [];
      for (let i = 0; i < 12; i++) {
        let data = { value: "", sucess: false };
        wordList.push(data);
      }
      this.wordList = [...wordList];
      bip39.setDefaultWordlist("chinese_simplified"); // 设置助记词默认类型
    },
    createdSuccess(password) {
      let secret = this.mnemonicData.privateKey;
      JingchangWallet.generate(password, secret).then((jcWallet) => {
        JingchangWallet.save(jcWallet);
        this.$store.dispatch("updateJCWallet", jcWallet);
        let address = jcWallet.wallets[0].address;
        this.$store.dispatch("updateDefAddress", address);
        saveMnemonicData(this.mnemonicData, password); // 存储助记词相关信息
        bus.$emit("savePassword", password);
        Toast.success(this.$t("message.home.importSuccess"));
        this.$router.push({
          name: "myWallet"
        })
      }).catch((error) => {
        Toast.fail(this.$t(getError(error)));
      })
    },
    inputValue() {
      let index = this.currentIndex;
      let value = this.wordList[index].value;
      value = value.replace(/[^\u4e00-\u9fa5]/g, ''); // 内容过滤，只允许输入中文
      if (value.length > 1) {
        value = value.substring(0, 1);
      }
      this.wordList[index].value = value;
      let str = /^[\u4e00-\u9fa5]+$/; // 汉字正则
      if (value.length === 1 && str.test(value)) {
        // 输入成功，下一个输入框获取焦点
        if (index < 11) {
          document.getElementById(`input${index + 1}`).focus();
        }
        this.wordList[index].sucess = true;
      } else {
        this.wordList[index].sucess = false;
      }
    },
    goNext() {
      //   this.showLoading = true;
      let mnemonic = "";
      let flag = true;
      for (let word of this.wordList) {
        if (!word.sucess) {
          Toast.fail(this.$t("message.importText.errorText"));
          flag = false;
          break;
        } else {
          mnemonic = mnemonic + word.value + " ";
        }
      }
      mnemonic = mnemonic.trim();
      if (flag) {
        let isValid = bip39.validateMnemonic(mnemonic.toString());
        if (isValid) {
          let data = createdWallet(mnemonic);
          this.mnemonicData = data;
          //   this.showLoading = false;
          this.step = "two";
        } else {
          //   this.showLoading = false;
          Toast.fail(this.$t("message.importText.errorText2"));
        }
      } else {
        // this.showLoading = false;
        Toast.fail(this.$t("message.importText.errorText"));
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.bodyClass {
  padding: 20px;
  .titleClass {
    text-align: left;
    color: #222325;
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    padding-bottom: 20px;
  }
  .content {
    background-color: #f7f8fb;
    border-radius: 6px;
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 20px;
    .inputClass {
      width: 19%;
      margin: 0 3%;
      height: 42px;
      border-bottom: 1px solid #7297f6;
      input {
        width: 100%;
        height: 40px;
        border: none;
        background-color: #f7f8fb;
        text-align: center;
      }
    }
  }
  .buttonClass {
    padding-top: 30px;
    button {
      border: none;
      width: 100%;
      height: 48px;
      line-height: 48px;
      color: #ffffff;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      border-radius: 6px;
      background-color: #366bf2;
    }
  }
}
.setPassword {
  padding: 20px;
}
</style>