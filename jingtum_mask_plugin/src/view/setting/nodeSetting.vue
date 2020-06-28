<template>
    <div>
      <commonHead :showLeft="true" :titleText="$t('message.setting.nodeSetting')" ></commonHead>
      <div class="bodyClass">
          <div class="title">{{$t("message.setting.addNodeText")}}</div>
          <div class="inputClass">
              <input v-model="addNewNode" @focus="showBorder=true;" @blur="showBorder=false;" :style="showBorder?'border:1px solid #366BF2;':''" :placeholder="$t('message.setting.inputText')" />
          </div>
          <div class="buttonClass">
              <button @click.stop="addNodes()">{{$t("message.home.sureText")}}</button>
          </div>
          <div class="defaultClass">
             <div class="title">{{$t("message.setting.defaultNode")}}</div>
             <div class="content" style="background-color: #eff3fc;">
               <div v-for="(node,index) in defaultList" :key="index" @click.stop="setCurrentNode(node.value)" class="listClass" :style="getStyle(index)" >
                   <div style="width:6%;">
                       <img v-if="currentNode===node.value" :src="currentNodeImg" style="width:14px;" />
                   </div>
                   <div class="value">{{node.value}}</div>
               </div>
             </div>
          </div>
          <div class="defaultClass" >
              <div class="title">{{$t("message.setting.customNode")}}</div>
              <div  class="content" style="background-color:#EEF7F5;" >
                  <div v-for="(node,index) in customList" @click.stop="setCurrentNode(node.value)" class="listClass" :key="index" :style="getStyle(index,true)">
                    <div style="width:6%;">
                        <img v-if="currentNode===node.value" :src="currentNodeImg" style="width:14px;" />
                    </div>
                    <div class="value">{{node.value}}</div>
                    <div class="image">
                        <img :src="deleteImg" @click.stop="deleteCheckedNode(node.value)" style="width:16px;" />
                    </div>
                 </div>
              </div>
          </div>
      </div>
    </div>
</template>
<script>
import commonHead from "../../components/commonHead";
import currentNodeImg from "../../images/currentNode.png";
import deleteImg from "../../images/deleteImg.png";
import Lockr from "lockr";
import { Toast, Dialog } from "vant";
import { findCurrentNode } from "../../js/utils";
const jcNodes = process.env.jcNodes;
export default {
  data() {
    return {
      addNewNode: "",
      defaultList: [],
      customList: [],
      currentNodeImg,
      deleteImg,
      showBorder: false
    }
  },
  components: {
    commonHead
  },
  computed: {
    currentNode() {
      return this.$store.getters.currentNode;
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      let nodeData = Lockr.get("nodeDataList") || {};
      let defaultList = nodeData.defaultList || []
      let flag = false;
      if (Array.isArray(defaultList) && defaultList.length > 0) {
        for (let node of defaultList) {
          if (node.isCurrentNode) {
            flag = true; // 标识当前节点是否为默认节点
            break;
          }
        }
      }
      let list = [];
      if (Array.isArray(jcNodes) && jcNodes.length > 0) {
        // 添加全局变量默认节点数据
        for (let node of jcNodes) {
          let data = { value: node };
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
      this.customList = nodeData.customList;
      nodeData.defaultList = [...list];
      let currentNode = findCurrentNode(nodeData);
      if (!currentNode) {
        currentNode = list[0].value;
        list[0].isCurrentNode = true;
      }
      this.defaultList = [...list];
      nodeData.defaultList = [...list];
      this.$store.dispatch("updateCurrentNode", currentNode); // 更新当前节点
      Lockr.set("nodeDataList", nodeData);
    },
    addNodes() {
      if (!this.addNewNode) {
        return;
      }
      let nodeData = Lockr.get("nodeDataList");
      let newNode = this.addNewNode.trim();
      let customList = nodeData.customList || [];
      let flag = false;
      if (Array.isArray(customList) && customList.length > 0) {
        for (let custom of customList) {
          if (custom.value === newNode) { // 节点已存在
            flag = true;
            break;
          }
        }
      }
      if (!flag) { // 节点不存在，可直接添加该节点
        let data = { value: newNode, isCurrentNode: false }
        customList.push(data);
        nodeData.customList = [...customList];
        this.customList = [...customList];
        Lockr.set("nodeDataList", nodeData);
        Toast.success(this.$t("message.setting.addNodeSuccess"));
      } else {
        Toast.fail(this.$t("message.setting.nodeExist"));
      }
      this.addNewNode = "";
    },
    getStyle(index, flag = false) {
      let str = "";
      if (!flag) {
        if (index !== this.defaultList.length - 1) {
          str = "border-bottom:1px solid #C8D6F3";
        }
      } else {
        if (index !== this.customList.length - 1) {
          str = "border-bottom:1px solid #AEDCD2";
        }
      }
      return str;
    },
    setCurrentNode(node) {
      let currentNode = this.currentNode;
      let nodeData = {};
      let customList = this.customList;
      let defaultList = this.defaultList;
      nodeData.customList = this.editCurrentNode(node, customList);
      nodeData.defaultList = this.editCurrentNode(node, defaultList);
      Lockr.set("nodeDataList", nodeData);
      this.$store.dispatch("updateCurrentNode", node);
    },
    editCurrentNode(node, dataList) { // 修改当前节点
      let list = [];
      if (Array.isArray(dataList) && dataList.length > 0) {
        for (let data of dataList) {
          if (data.isCurrentNode) {
            data.isCurrentNode = false;
          }
          if (data.value === node) {
            data.isCurrentNode = true;
          }
          list.push(data);
        }
      }
      return list;
    },
    deleteCheckedNode(node) {
      let msg = this.$t("message.setting.deleteNodeText", { url: node })
      Dialog.confirm({
        title: '',
        message: msg,
      }).then(() => {
        let customList = this.customList;
        let defaultList = this.defaultList;
        let nodeData = Lockr.get("nodeDataList") || [];
        if (node === this.currentNode) { // 如果删除的节点是当前节点，设置默认节点的一个节点为当前节点
          defaultList[0].isCurrentNode = true;
          this.$store.dispatch("updateCurrentNode", defaultList[0].value); // 更新当前节点
        }
        let list = [];
        if (Array.isArray(customList) && customList.length > 0) {
          for (let custom of customList) {
            if (custom.value !== node) {
              list.push(custom);
            }
          }
        }
        nodeData.defaultList = [...defaultList];
        nodeData.customList = [...list];
        this.customList = [...list];  // 更新自定义节点
        this.defaultList = [...defaultList]; // 更新默认节点
        Lockr.set("nodeDataList", nodeData); // 更新本地节点数据
      }).catch(() => {
      });
    },
    // 删除选中的节点
    deleteCurrentNode(node, dataList) {
      let list = [];
      for (let data of dataList) {
        if (data.value !== node) {
          list.push(data);
        }
      }
      return list;
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
  .defaultClass {
    padding-top: 20px;
    .title {
      color: #303337;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      padding-bottom: 10px;
    }
    .content {
      border-radius: 6px;
      padding: 0 5px;
      .listClass {
        display: flex;
        height: 42px;
        line-height: 42px;
        .value {
          width: 84%;
          color: #3e4045;
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
        }
        .image {
          width: 8%;
          margin-top: 5px;
          text-align: right;
          padding-right: 10px;
        }
      }
    }
  }
}
</style>