<template>
    <div>
      <commonHead :showLeft="true" :titleText="$t('message.setting.nodeSetting')" ></commonHead>
      <div class="bodyClass">
          <div class="title">{{$t("message.setting.addNodeText")}}</div>
          <div class="inputClass">
              <input v-model="addNewNode" :placeholder="$t('message.setting.inputText')" />
          </div>
          <div class="buttonClass">
              <button @click.stop="addNodes()">{{$t("message.home.sureText")}}</button>
          </div>
      </div>
    </div>
</template>
<script>
import commonHead from "../components/commonHead";
import Lockr from "lockr";
const jcNodes = process.env.jcNodes;
export default {
  data() {
    return {
      addNewNode: ""
    }
  },
  components: {
    commonHead
  },
  computed: {
    currentNode() {

    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      let nodeList = Lockr.get("nodeList") || [];
      let array = [];
      let flag = false;
      if (Array.isArray(nodeList) && nodeList.length > 0) {
        // 删除所有默认节点
        for (let node of nodeList) {
          if (!node.default) {
            array.push(node);
          }
          if (node.default && node.isCurrentNode) {
            flag = true; // 标识默认节点是否为当前节点
          }
        }
      }
      let list = [];
      if (Array.isArray(jcNodes) && jcNodes.length > 0) {
        // 添加全局变量默认节点数据
        for (let node of jcNodes) {
          let data = { value: node, default: true };
          if (flag) {
            data.isCurrentNode = true; // 设置首个默认节点为当前节点
            flag = false;
            this.$store.dispatch("updateCurrentNode", data.currentNode);
          } else {
            data.isCurrentNode = false;
          }
          list.push(data);
        }
      }
      array = [...list, ...array];
      Lockr.set("nodeList", array);
    },
    addNodes() {

    }
  }
}
</script>
<style lang="scss" scoped>
.bodyClass {
  padding: 20px;
  text-align: left;
  color: #090909;
  .title {
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
  }
  .inputClass {
    padding-top: 20px;
    input {
      border-radius: 6px;
      border: 1px solid #d9dce5;
      outline: none;
      width: 96%;
      height: 48px;
      padding-left: 10px;
    }
  }
  .buttonClass {
    padding-top: 20px;
    button {
      background-color: #366bf2;
      border-radius: 6px;
      opacity: 0.7;
      text-align: center;
      outline: none;
      border: none;
      height: 48px;
      line-height: 48px;
      width: 100%;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
    }
  }
}
</style>