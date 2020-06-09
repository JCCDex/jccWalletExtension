<template>
    <div>
        <commonHead :showLeft="true" :titleText="$t('message.setting.authorization')"></commonHead>
        <div class="bodyClass">
          <div class="titleClass">{{$t("message.setting.addAuthorization")}}</div>
          <div class="inputClass">
            <input v-model="authorization" :placeholder='$t("message.setting.authorizationText")' />
          </div>
          <div class="buttonClass">
             <button @click.stop="addAuthorization()" >{{$t("message.home.sureText")}}</button>
          </div>
          <div class="content">
            <div class="title">{{$t("message.setting.authorizaList")}}</div>
            <div class="bodyList">
              <div class="listClass" v-for="(data,index) in authorizaList" :key="index" :style="getStyle(index)">
                <div class="value">{{data}}</div>
                <div class="image">
                    <img :src="deleteImg" @click.stop="deleteAuthoriza(data)" style="width:16px;" />
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
</template>
<script>
import commonHead from "../components/commonHead";
import deleteImg from "../images/deleteImg.png";
import { Toast, Dialog } from "vant";
import Lockr from "lockr";
export default {
  data() {
    return {
      authorization: "",
      authorizaList: "",
      deleteImg
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
      let dataList = Lockr.get("authorizationList") || [];
      this.authorizaList = dataList;
    },
    addAuthorization() {
      let url = this.authorization;
      if (!url) {
        return;
      }
      let list = Lockr.get("authorizationList") || [];
      let flag = false;
      if (Array.isArray(list) && list.length > 0) {
        for (let data of list) {
          if (data === url) {
            flag = true;
          }
        }
      }
      if (flag) {
        Toast.fail(this.$t("message.setting.authorizaExist"));
      } else {
        list.push(url);
        Lockr.set("authorizationList", list);
        this.authorizaList = [...list];
        Toast.success(this.$t("message.setting.authorizaSuccess"));
        this.authorization = "";
      }
    },
    deleteAuthoriza(url) {
      let msg = this.$t("message.setting.deleteAuthioriza", { url });
      Dialog.confirm({
        title: '',
        message: msg,
      }).then(() => {
        let list = [];
        let dataList = [...this.authorizaList];
        for (let data of dataList) {
          if (data !== url) {
            list.push(data);
          }
        }
        this.authorizaList = [...list];
        Lockr.set("authorizationList", list);
      }).catch(() => {
      });
    },
    getStyle(index) {
      let str = "";
      if (index % 2 === 0) {
        str = "background-color:#EEF7F5";
      }
      return str;
    }
  }
}
</script>
<style lang="scss" scoped>
.bodyClass {
  padding: 20px;
  text-align: left;
  color: #090909;
  .titleClass {
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
  }
  .inputClass {
    padding: 20px 0;
    input {
      width: 96%;
      padding-left: 10px;
      text-align: left;
      height: 48px;
      line-height: 48px;
      outline: none;
      border-radius: 6px;
      border: 1px solid #d9dce5;
    }
  }
  .buttonClass {
    padding-bottom: 20px;
    button {
      width: 100%;
      height: 48px;
      line-height: 48px;
      text-align: center;
      outline: none;
      background-color: #366bf2;
      border: none;
      border-radius: 6px;
      opacity: 0.7;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
    }
  }
  .content {
    border-radius: 4px;
    border: 1px solid #00c194;
    .title {
      background-color: #00c194;
      padding-left: 10px;
      height: 38px;
      line-height: 38px;
      color: #ffffff;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
    }
    .bodyList {
      .listClass {
        padding-left: 10px;
        height: 44px;
        display: flex;
        line-height: 44px;
        .value {
          width: 92%;
        }
        .image {
          text-align: right;
          padding-right: 10px;
          margin-top: 3px;
        }
      }
    }
  }
}
</style>