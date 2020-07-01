<template>
  <div>
    <commonHead :showLeft="true" :titleText="$t('message.home.language')"></commonHead>
    <div v-for="item in languages" :key="item.name" class="divClass" @click="chooseLang(item.name)">
      <div class="image">
        <img :src="currentLangImg" v-if="currentLang===item.name" />
        <img :src="commonLangImg" v-if="currentLang!==item.name" />
      </div>
      <div>{{item.value}}</div>
    </div>
  </div>
</template>
<script>
import commonHead from "@/components/commonHead";
import currentLangImg from "@/images/currentLangImg.png";
import commonLangImg from "@/images/commonLangImg.png";
export default {
  data() {
    return {
      languages: [{ name: "zh", value: "中文" }, { name: "en", value: "English" }],
      commonLangImg,
      currentLangImg
    }
  },
  components: {
    commonHead
  },
  computed: {
    currentLang() {
      let lang = this.$i18n.locale;
      return lang;
    }
  },
  methods: {
    chooseLang(type) {
      this.$i18n.locale = type;
      localStorage.setItem("languageType", this.$i18n.locale);
    }
  }
}
</script>
<style lang="scss" scoped>
.divClass {
  display: flex;
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #dce1eb;
  color: #090909;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  .image {
    padding-left: 20px;
    padding-right: 10px;
    img {
      width: 16px;
    }
  }
}
</style>