<template>
    <div>
        <commonHead :titleText="titleText"></commonHead>
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
           <div v-if ="step ==='three'">
             <setPassword @createdSuccess="createdSuccess"></setPassword>
           </div>
        </div>
    </div>
</template>
<script>
import commonHead from "../components/commonHead";
import setPassword from "../components/setPassword";
import { JingchangWallet } from "jcc_wallet";
import { Toast } from 'vant';
import { createdWallet } from "../js/user";
import { saveMnemonicData } from "../js/utils";
import bus from "../js/bus";
// import Lockr from "lockr";
export default {
  data() {
    return {
      step: "one",
      secret: "",
      wordList: [],
      arrList: [],
      titleText: "",
      currentList: [],
      currentIndex: 0,
      lastIndex: -1,
      mnemonicData: ""
    }
  },
  components: {
    commonHead,
    setPassword
  },
  created() {
    this.init();
    this.setCurrentList();
  },
  watch: {
  },
  methods: {
    init() {
      this.titleText = this.$t('message.home.create_wallet');
      let data = createdWallet();
      this.mnemonicData = data;
      this.wordList = this.getWordList(data.mnemonic);
      this.secret = data.privateKey;
    },
    createdSuccess(password) {
      JingchangWallet.generate(password, this.secret).then((jcWallet) => {
        JingchangWallet.save(jcWallet);
        this.$store.dispatch("updateJCWallet", jcWallet);
        let address = jcwallet.wallets[0].address;
        this.$store.dispatch("updateDefAddress", address);
        this.password = password;
        saveMnemonicData(this.mnemonicData, password); // 存储助记词相关信息
        bus.$emit("savePassword", password);
        Toast.success(this.$t("message.home.createSuccess"))
        this.$router.push({
          name: "myWallet"
        })
      }).catch((error) => {
        Toast.fail(error);
      })
    },
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
      this.titleText = this.$t("message.home.setPassword");
      this.step = "three";
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
    text-align: justify;
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