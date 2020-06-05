<template>
  <div>
    <commonHead :showLeft="true" :titleText="$t('message.setting.contacts')"></commonHead>
    <div class="buttonClass">
      <button @click.stop="addContact()" >{{$t("message.setting.newContact")}}</button>
    </div>
    <div class="titleClass">
      <div class="image">
        <img :src="contactsImg" style="width:16px;" />
      </div>
      <div class="text">{{$t("message.setting.contactText")}}</div>
    </div>
  </div>
</template>
<script>
import commonHead from "../components/commonHead";
import contactsImg from "../images/contactsImg.png";
export default {
  data() {
    return {
      contactsImg
    }
  },
  components: {
    commonHead
  },
  methods: {
    addContact() {
      let name = "addContact";
      this.$router.push({ name });
    }
  }
}
</script>
<style lang="scss" scoped>
.buttonClass {
  padding: 30px 20px;
  button {
    width: 100%;
    height: 48px;
    line-height: 48px;
    background-color: #366bf2;
    border-radius: 6px;
    border: none;
    outline: none;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
  }
}
.titleClass {
  display: flex;
  padding-left: 20px;
  .image {
    margin-top: 3px;
  }
  .text {
    color: #3e424c;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    padding-left: 8px;
  }
}
</style>