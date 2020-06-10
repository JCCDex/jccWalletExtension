<template>
  <div>
    <commonHead :titleText="$t('message.menu.setting')"></commonHead>
    <div>
      <div v-for="(data,index) in settingList" :key="index" @click="goTo(data.url)" class="menuList">
        <div class="name">{{data.name}}</div>
        <div class="image">
            <img :src="rightArrowIcon" style="width:10px;" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import commonHead from "../../components/commonHead";
import rightArrowIcon from "@/images/rightArrow.png";
export default {
  data() {
    return {
      settingList: [],
      rightArrowIcon
    }
  },
  created() {
    this.init();
  },
  components: {
    commonHead
  },
  methods: {
    init() {
      this.settingList = [
        {
          name: this.$t("message.setting.changePassword"),
          url: ""
        }, {
          name: this.$t("message.setting.contacts"),
          url: "contacts"
        },
        {
          name: this.$t("message.setting.authorization"),
          url: "authorization"
        }, {
          name: this.$t("message.setting.nodeSetting"),
          url: "nodeSetting"
        },
        {
          name: this.$t("message.setting.showWords"),
          url: ""
        }, {
          name: this.$t("message.setting.aboutUs"),
          url: "aboutUs"
        }
      ]
    },
    goTo(name) {
      this.$router.push({ name })
    }
  }
}
</script>
<style lang="scss" scoped>
.menuList {
  padding: 0 20px;
  height: 50px;
  line-height: 50px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #dce1eb;
  .name {
    text-align: left;
    color: #090909;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
  }
  .image {
    text-align: right;
  }
}
</style>