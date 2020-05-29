<template>
    <div>
        <commonHead :titleText="$t('message.home.create_wallet')"></commonHead>
        <div class="body_class">
           <div v-if="step==='one'">
             <div class="title">{{$t("message.home.text1")}}</div>
             <div style="display:flex;flex-wrap:warp;width:100%;">
                <div v-for="(word, index) in wordList" :key="index" >
                  <div class="content" >{{word}}</div>
                </div>
             </div>
           </div>
        </div>
    </div>
</template>
<script>
import commonHead from "../components/commonHead";
// import { jtWallet } from "jcc_wallet";
const { Wallet } = require("@swtc/wallet");
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
    this.init();
  },
  methods: {
    init() {
      //  助力词改为简体中文词库
      bip39.setDefaultWordlist("chinese_simplified");
      //   生成助记词
      const memoic = bip39.generateMnemonic();
      this.wordList = memoic;
      //   通过助记词生成秘钥
      const entry = bip39.mnemonicToEntropy(memoic);
      const secret = Wallet.KeyPair.addressCodec.encodeSeed(entry.slice(0, 16));
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
  }
}
</style>