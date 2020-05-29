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
        this.wordList = mnemonic;
        //  通过助记词生成秘钥
        const entropy = bip39.mnemonicToEntropy(mnemonic); // 助记词得到熵
        const addressCodec = AddressCodecFactory(); // param: chain or native token,default jingtum
        secret = addressCodec.encodeSeed(entropy.slice(0, 16));
        // if (jtWallet.isValidSecret(secret)) {
        //   const wallet = await JingchangWallet.generate(password, secret);
        //   console.log("新生成的钱包",wallet);
        // }
        // console.log("助记词列表", this.wordList);
        // console.log("钱包密钥", secret);
      } catch (error) {
        this.wordList = [];
        secret = null
      }
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