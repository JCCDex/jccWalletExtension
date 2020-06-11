import { getUserBalances } from "js/user";
import { JingchangWallet } from "jcc_wallet";
import { findCurrentNode } from "./utils";
import store from "../store";
import Lockr from "lockr";
const jcNodes = process.env.jcNodes;
export const getConfigs = () => {
  if (JingchangWallet.isValid(store.getters.jcWallet)) {
    setTimeout(() => {
      getUserBalances(); // 初始化资产
      let nodeData = Lockr.get("nodeDataList");
      let currentNode = "";
      if (!nodeData) {
        let list = [];
        if (Array.isArray(jcNodes) && jcNodes.length > 0) {
          for (let node of jcNodes) {
            let data = { value: node, isCurrentNode: false };
            list.push(data);
          }
        }
        list[0].isCurrentNode = true;
        if (Array.isArray(list) && list.length > 0) {
          let nodeData = { defaultList: list };
          Lockr.set("nodeDataList", nodeData);
        }
      } else {
        currentNode = findCurrentNode(nodeData);
      }
      if (!currentNode) {
        store.dispatch("updateCurrentNode", currentNode); // 更新当前节点
      }
      let jcWallet = JingchangWallet.get() || "";
      let wallets = jcWallet.wallets;
      let address = "";
      if (Array.isArray(wallets) && wallets.length > 0) {
        for (let wallet of wallets) {
          if (wallet.default) {
            address = wallet.address;
            break;
          }
        }
      }
      if (!address) {
        store.dispatch("updateDefAddress", address); // 更新默认钱包
      }
    }, 50);
  }
}