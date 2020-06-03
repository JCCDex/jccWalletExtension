<template>
    <div>
        <div v-if="!isEdit">
            <span>{{memoName}}</span>
            <span style="padding-left:5px;">
                <img :src="editImg" @click="editName()" :style="'width:'+widthData+'px'" />
            </span>
        </div>
        <div v-if="isEdit">
          <input v-model="walletName" class="input_class" :style="getStyle()" ref="walletName" @blur="saveName" />
        </div>
    </div>
</template>
<script>
import editImg from "../images/editImg.png";
import { JingchangWallet } from "jcc_wallet";
export default {
  data() {
    return {
      editImg,
      isEdit: false,
      walletName: ""
    }
  },
  props: {
    heightData: { type: String, default: "32" }, // 编辑框高度
    widthData: { type: String, default: "12" } // 编辑图标宽度
  },
  computed: {
    memoName() {
      let name = this.wallet.memoName || "SWTC";
      return name;
    },
    wallet() {
      let currentWallet = ""
      let jcWallet = this.$store.getters.jcWallet;
      let wallets = jcWallet.wallets;
      for (let wallet of wallets) {
        if (wallet.type === "swt" && wallet.default) {
          currentWallet = wallet;
          break;
        }
      }
      return currentWallet;
    },
    jcWallet() {
      return this.$store.getters.jcWallet;
    },
    address() {
      return this.wallet.address;
    }
  },
  methods: {
    editName() {
      this.isEdit = true;
      setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.walletName.focus();
        })
      }, 50)
      this.walletName = this.memoName;
    },
    getStyle() {
      let height = this.heightData;
      let str = "height:" + height + "px;";
      return str;
    },
    saveName() {
      this.isEdit = false
      let memoName = this.walletName;
      let jcWallet = this.jcWallet;
      let wallets = jcWallet.wallets;
      let list = [];
      for (let wallet of wallets) {
        if (wallet.address === this.address) {
          wallet.memoName = memoName;
        }
        list.push(wallet);
      }
      jcWallet.wallets = list;
      JingchangWallet.save(jcWallet);
      this.$store.dispatch("updateJCWallet", jcWallet);
    }
  }
}
</script>
<style lang="scss" scoped>
.input_class {
  width: 100%;
  border: none;
  border-inline: none;
  outline: none;
  padding-left: 10px;
  color: #3e424c;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
}
</style>