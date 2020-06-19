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
    <div v-if="contactList.length>0" class="contactClass">
      <div v-for ="(contact ,index) in contactList" :key="index" class="content" > 
       <div class="name">{{contact.name}}</div>
       <div class="address">
          <div class="value">{{contact.address}}</div>
          <div class="image">
            <img :src="deleteImg" style="width:16px;" @click.stop="deleteContact(contact)" />
          </div>
       </div>
      </div>
    </div>
    <div v-else class="noDataClass">
        <img :src="noContact" />
        <div>{{$t("message.history.noContact")}}</div>
    </div>
  </div>
</template>
<script>
import commonHead from "../../components/commonHead";
import contactsImg from "../../images/contactsImg.png";
import deleteImg from "../../images/deleteImg.png";
import noContact from "../../images/noContact.png";
import Lockr from "lockr";
import { Toast, dialog } from 'vant';
export default {
  data() {
    return {
      contactsImg,
      noContact,
      contactList: [],
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
      let list = Lockr.get("contactList") || [];
      this.contactList = list;
    },
    addContact() {
      let name = "addContact";
      this.$router.push({ name });
    },
    deleteContact(contact) {
      let msg = this.$t("message.setting.deleteText", { name: contact.name })
      dialog.confirm({
        title: '',
        message: msg,
      }).then(() => {
        let list = [];
        let array = [...this.contactList];
        for (let data of array) {
          if (data.address !== contact.address) {
            list.push(data);
          }
        }
        this.contactList = [...list];
        Lockr.set("contactList", list);
      }).catch(() => {
        // on cancel
      });
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
  padding-bottom: 10px;
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
.contactClass {
  padding: 0 20px;
  .content {
    color: #3e424c;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    background-color: #eff3fc;
    margin-bottom: 10px;
    border-radius: 6px;
    .name {
      padding: 10px 10px 0;
      text-align: left;
    }
    .address {
      display: flex;
      padding-bottom: 10px;
      .value {
        word-break: break-all;
        text-align: left;
        padding-left: 10px;
        width: 90%;
      }
      .image {
        width: 10%;
        text-align: right;
        padding-right: 10px;
        margin-top: 3px;
      }
    }
  }
}
.noDataClass {
  text-align: center;
  color: #8a98b6;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  padding-top: 40%;
  position: absolute;
  background-color: #eff3fc;
  width: 96%;
  height: 44%;
  margin: 2%;
  img {
    width: 160px;
  }
}
</style>