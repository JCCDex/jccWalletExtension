<template>
    <div>
        <div class="memoName" v-if="!isEdit" :style="'text-align:'+titleAlign+';'">
            <span>{{memoName}}</span>
            <span style="padding-left:5px;">
                <img :src="editImg" @click="editName()" :style="'width:'+widthData+'px'" />
            </span>
        </div>
        <div v-if="isEdit">
          <input v-model="walletName" class="input_class" :style="getStyle()" ref="walletName" @blur="setMemoName()" />
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
    widthData: { type: String, default: "12" }, // 编辑图标宽度
    memoName: { type: String, require: true }, // 钱包地址
    titleAlign: { type: String, default: "center" } // 标题位置
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
    setMemoName() {
      this.isEdit = false
      let memoName = this.walletName;
      this.$emit("setMemoName", memoName);
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
  border: 1px solid #366bf2;
  border-radius: 4px;
}
.memoName {
  font-size: 16px;
  color: #3e424c;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
}
</style>