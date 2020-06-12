<template>
  <div>
   <commonHead :showLeft="true" :titleText="$t('message.setting.showWords')"></commonHead>
   <div class="bodyClass">
     <div class="titleClass">
      <span>
        <img :src="bellImg" style="width:12px;" />
      </span>
      <span>{{$t("message.setting.wordText")}}</span>
     </div>
     <div v-if="!showWords" class="content">
       <div class="inputClass">
         <passInput ref="password" :borderColor="'#D9DCE5'" @setPassData="setPassData" :textMsg="$t('message.setting.passText')" ></passInput>
       </div>
       <div class="buttonClass">
         <button @click.stop="showMnemonic()">{{$t('message.setting.showWords')}}</button>
       </div>
     </div>
     <div v-else class="mnenonicClass">
        <div class="title">{{$t("message.setting.showMnenonicText")}}</div>
        <div class="wordClass">
          <div v-for="(word,index) in wordList" class="songClass" :key="index">{{word}}</div>
        </div>
        <div class="buttonClass">
          <div class="copyClass">
             <button v-clipboard:copy="wordsStr" v-clipboard:success="onCopy" v-clipboard:error="onError" >
                 <img :src="copyButton" style="width:14px;" />
                 <span>{{$t("message.setting.copyMnenonic")}}</span>
             </button>
          </div>
          <div class="exportClass">
             <button @click.stop="exportFile()" >
                 <img :src="exportImg" style="width:14px;" />
                 <span>{{$t("message.setting.exportMnenonic")}}</span>
             </button>
          </div>
        </div>
     </div>
   </div>
  </div>
</template>
<script>
import commonHead from "../../components/commonHead";
import bellImg from "../../images/bellImg.png";
import copyButton from "../../images/copyButton.png";
import exportImg from "../../images/exportImg.png";
import passInput from "../../components/passInput";
import { JingchangWallet } from "jcc_wallet";
import { decrypt } from "jcc_wallet/lib/util";
import { getError } from "../../js/utils";
import { Toast } from "vant";
import Lockr from "lockr";
import { exportToText } from "jcc_file";
export default {
  data() {
    return {
      bellImg,
      copyButton,
      exportImg,
      showWords: false,
      password: "",
      wordList: []
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
    wordsStr() {
      let wordList = this.wordList;
      let str = "";
      if (Array.isArray(wordList) && wordList.length > 0) {
        for (let word of wordList) {
          str = str + word;
        }
      }
      return str;
    }
  },
  methods: {
    onCopy() {
      Toast.success(this.$t("message.home.copySuccess"));
    },
    onError() {
      Toast.fail(this.$t("message.home.copyError"));
    },
    setPassData(password) {
      this.password = password;
    },
    showMnemonic() {
      if (this.$refs.password.isValid()) {
        return;
      }
      let password = this.password;
      let jcWallet = this.jcWallet;
      let inst = new JingchangWallet(jcWallet);
      inst.getSecretWithType(password, "swt").then(() => {
        let mnemonicData = Lockr.get("mnemonicData");
        let mnemonic = decrypt(password, mnemonicData);
        this.wordList = mnemonic.split(" ");
        this.showWords = true;
      }).catch((error) => {
        Toast.fail(this.$t(getError(error)));
      })
    },
    exportFile() {
      if (!this.wordsStr) {
        return;
      }
      let text = this.wordsStr;
      exportToText(text, "CSV").then(() => {
        Toast.success(this.$t("message.setting.exportSuccess"));
      }).catch((error) => {
        Toast.fail(this.$t(getError(error)));
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.bodyClass {
  padding: 20px;
  .titleClass {
    padding-top: 10px;
    text-align: left;
    color: #f36723;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
  }
  .content {
    padding-top: 20px;
    .inputClass {
      padding-top: 20px;
    }
    .buttonClass {
      padding-top: 20px;
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
  }
  .mnenonicClass {
    padding-top: 30px;
    color: #090909;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    .title {
      text-align: left;
      font-size: 14px;
    }
    .wordClass {
      background-color: #f7f8fb;
      border-radius: 6px;
      display: flex;
      flex-wrap: wrap;
      margin-top: 20px;
      .songClass {
        width: 25%;
        text-align: center;
        font-size: 16px;
        height: 50px;
        line-height: 50px;
      }
    }
  }
  .buttonClass {
    display: flex;
    padding-top: 20px;
    .copyClass {
      width: 50%;
      text-align: left;
      button {
        background-color: #05c2c2;
        border-radius: 6px;
        border: none;
        height: 48px;
        line-height: 48px;
        width: 95%;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
      }
    }
    .exportClass {
      width: 50%;
      text-align: right;
      button {
        background-color: #4484fe;
        border-radius: 6px;
        border: none;
        height: 48px;
        line-height: 48px;
        width: 95%;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
      }
    }
  }
}
</style>