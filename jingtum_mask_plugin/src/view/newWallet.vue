<template>
    <div>
        <commonHead :titleText="$t('message.home.create_wallet')"></commonHead>
        <div class="body_class">
           <div v-if="step==='one'">
             <div class="title">{{$t("message.home.text1")}}</div>
             <div  class="parsent">
                <div v-for="(word, index) in wordList" :key="index"  class="content">
                  <div class="text">{{word}}</div>
                </div>
             </div>
             <div class="buttom_div">
               <button class="buttom" @click="goNext()">{{$t("message.home.buttomText")}}</button>
             </div>
           </div>
           <div v-if="step==='two'">
              <div class="title">{{$t("message.home.text2")}}</div>
              <div class="area_div">
                  <div :class="getClass(data)" class="content" v-for="(data,index) in currentList" :key="index">
                    <div v-if="data.word" :class="'text'">{{data.word}}</div>
                    <div v-else></div>
                  </div>
              </div>
              <div class="list_div">
                  <div class="content" v-for="(data,index) in arrList" :key="index">
                    <div :class="data.isClick?'click':'text'" @click="checkWord(data,index)" >{{data.word}}</div>
                  </div>
              </div>
              <div class="buttom_div">
               <button class="buttom" @click="setPassword()">{{$t("message.home.nextText")}}</button>
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
      secret: "",
      wordList: [],
      arrList: [],
      currentList: [],
      currentIndex: 0,
      lastIndex: -1
      //   forCurrentList: [],
      //   forArrList: []
    }
  },
  components: {
    commonHead
  },
  created() {
    this.generateMnemonic();
    this.setCurrentList();
  },
  watch: {
    // currentList() {
    //   this.forCurrentList = this.currentList;
    // },
    // arrList() {
    //   this.forArrList = this.arrList;
    // }
  },
  methods: {
    getClass(data) {
      if (data.word) {
        if (data.success) {
          return "common"
        } else {
          return "error"
        }
      } else {
        return "nothing";
      }
    },
    setCurrentList() {
      for (let i = 0; i < 12; i++) {
        let data = { success: false, word: "" };
        this.currentList.push(data);
      }
    },
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
      this.secret = secret;
    },
    getWordList(list) {
      let wordList = [];
      for (let word of list) {
        if (word !== " ") {
          wordList.push(word);
        }
      }
      return wordList;
    },
    checkWord(data, index) {
      if (data.isClick) {
        return;
      }
      let lastIndex = this.lastIndex;
      let currentIndex = this.currentIndex;
      let dataClass = {};
      // 选择正确
      if (data.word === this.wordList[currentIndex]) {
        dataClass = { success: true, word: data.word };
        this.currentIndex++;
        this.lastIndex = -1;
      } else {
        dataClass = { success: false, word: data.word };
        this.lastIndex = index;
      }
      // 显示选择的数据
      this.currentList[currentIndex] = dataClass;
      data = { isClick: true, word: data.word }; // isClick :是否已点击
      this.arrList[index] = data; // 改变点击状态
      if (lastIndex >= 0) {
        let temporary = this.arrList[lastIndex];
        temporary = { isClick: false, word: temporary.word };
        this.arrList[lastIndex] = temporary;
        // this.arrList.push(temporary);
      }
      this.arrList = [...this.arrList]; // 刷新页面的数据
    },
    // 打乱数组 
    randomList() {
      let list = this.wordList.slice();
      let arr = [];
      let length = list.length;
      for (let i = 0; i < length; i++) {
        let index = parseInt(Math.random() * list.length); // 生成 1~lenght 之间的随机数
        let word = list[index];
        let data = { isClick: false, word: word };
        arr.push(data);
        list.splice(index, 1); // 删除已使用数据
      }
      this.arrList = [...arr];
    },
    setPassword() {
      if (this.currentIndex < 12) {
        return;
      }
      this.$router.push({
        name: "setPassword",
        query: {
          secret: this.secret
        }
      })
    },
    goNext() {
      this.randomList();
      this.step = "two";
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
  .parsent {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .content {
      height: 36px;
      line-height: 36px;
      width: 23%;
      margin-right: 2%;
      margin-bottom: 10px;
      background-color: #f1f3f9;
      border-radius: 4px;
      // display: -webkit-flex;
      // -webkit-flex-wrap: row wrap;
      .text {
        color: #090909;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
      }
    }
  }
  .buttom_div {
    margin-top: 10px;
    .buttom {
      height: 48px;
      width: 100%;
      border-radius: 6px;
      background-color: #366bf2;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      border: none;
      outline: none;
    }
  }
  .area_div {
    width: 96%;
    display: flex;
    flex-wrap: wrap;
    background-color: #f7f8fb;
    padding-top: 10px;
    padding-left: 4%;
    height: 154px;
    border-radius: 6px;
    .content {
      width: 21%;
      margin-right: 3%;
      height: 36px;
      line-height: 36px;
      margin-bottom: 10px;
      border-radius: 4px;
      background-color: #f7f8fb;
      .text {
        color: #090909;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
      }
    }
    .error {
      border: 1px solid #ff573d;
    }
    .common {
      border: 1px solid #7297f6;
    }
    .nothing {
      border: none;
    }
  }
  .list_div {
    width: 96%;
    display: flex;
    flex-wrap: wrap;
    padding-top: 30px;
    padding-left: 4%;
    .content {
      width: 21%;
      margin-right: 3%;
      height: 36px;
      line-height: 36px;
      margin-bottom: 10px;
      border-radius: 4px;
      background-color: #f7f8fb;
      border: 1px solid #7297f6;
      .text {
        color: #090909;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
      }
      .click {
        background-color: #366bf2;
        color: #ffffff;
        border-radius: 4px;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
      }
    }
  }
}
</style>