<template>
  <div>
      <commonHead :titleText="$t('message.menu.createdWallet')"></commonHead>
      <div class="body">
        <div class="name">
          <div class="title">{{$t("message.home.addressName")}}:</div>
          <div class="value">
            <editName :memoName="memoName" :titleAlign="'left'"></editName>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
import commonHead from "../components/commonHead";
import editName from "../components/editName";
import { jtWallet, jingchangWallet } from "jcc_wallet";
export default {
  data() {
    return {
      wallet: "",
      memoName: "SWTC"
    };
  },
  components: {
    commonHead,
    editName
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.wallet = jtWallet.createWallet();
      while (
        !jtWallet.isValidAddress(this.wallet.address) ||
        !jtWallet.isValidSecret(this.wallet.secret)
      ) {
        this.wallet = jtWallet.createWallet();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.body {
  padding: 30px 20px;
  .name {
    display: flex;
    height: 50px;
    line-height: 50px;
    .title {
      width: 30%;
      color: #090909;
      font-size: 16px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
    }
    .value {
      width: 60%;
    }
  }
}
</style>