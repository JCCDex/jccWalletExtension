<template>
    <div>
        <commonHead :titleText="$t('message.home.create_wallet')"></commonHead>
        <div class="body_class">
           <div v-if="step==='one'">
             <div class="title">{{$t("message.home.text1")}}</div>
             <div style="width:100%;display: -webkit-flex;">
                <div v-for="(word, index) in wordList" :key="index"  class="content">
                  <div  >{{word}}</div>
                </div>
             </div>
           </div>
        </div>
    </div>
</template>
<script>
import commonHead from "../components/commonHead";
import { Factory as AddressCodecFactory } from "@swtc/address-codec";
// import { jtWallet, JingchangWallet } from "jcc_wallet";
// const { Wallet } = require("@swtc/wallet");
const bip39 = require("bip39");
export default {
  data() {
    return {
      step: "one",
      wallet: "",
      wordList: []
    }
  },
  components: {
    commonHead
  },
  created() {
    this.generateMnemonic();
  },
  methods: {
    generateMnemonic() {
      let secret;
      //  助记词改为简体中文词库
      bip39.setDefaultWordlist("chinese_simplified");
      //  生成助记词
      try {
        const mnemonic = bip39.generateMnemonic();
        this.wordList = this.getWordList(mnemonic);
        //  通过助记词生成秘钥
        const entropy = bip39.mnemonicToEntropy(mnemonic); // 助记词得到熵
        const addressCodec = AddressCodecFactory(); // param: chain or native token,default jingtum
        secret = addressCodec.encodeSeed(entropy.slice(0, 16));
      } catch (error) {
        this.wordList = [];
        secret = null
      }
    },
    getWordList(list) {
      let wordList = [];
      for (let word of list) {
        if (word !== " ") {
          wordList.push(word);
        }
      }
      return wordList;
    }
  }
}
</script>
<style lang="scss" scoped>
.body_class {
  padding: 20px;
  .title {
    padding: 10px 0;
    text-align: left;
    color: #222325;
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
  }
  .content {
    height: 36px;
    line-height: 36px;
    width: 25%;
    // display: -webkit-flex;
    // -webkit-flex-wrap: row wrap;
  }
}
</style>