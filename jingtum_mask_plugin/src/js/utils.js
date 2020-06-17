import { encrypt } from "jcc_wallet/lib/util";
import { jtWallet } from "jcc_wallet";
import { JcExplorer } from 'jcc_rpc';
import { getExplorerHost } from "./api";
import Lockr from "lockr";

export const browser = {
  versions: (function() {
    let u = navigator.userAgent;
    return {
      trident: u.indexOf('Trident') > -1, // IE内核
      presto: u.indexOf('Presto') > -1, // opera内核
      webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, // 火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, // android终端
      iPhone: u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
      iPad: u.indexOf('iPad') > -1, // 是否iPad
      webApp: u.indexOf('Safari') === -1, // 是否web应该程序，没有头部与底部
      weixin: u.indexOf('MicroMessenger') > -1, // 是否微信 （2015-01-22新增）
      qq: u.match(/\sQQ/i) === " qq" // 是否QQ
    };
  })(),
  language: (navigator.browserLanguage || navigator.language).toLowerCase()
};
export const getUUID = function() {
  var canvas = document.createElement('canvas')
  var ctx = canvas.getContext('2d')
  var txt = 'http://security.tencent.com/'
  ctx.textBaseline = 'top'
  ctx.font = '14px Arial'
  ctx.textBaseline = 'tencent'
  ctx.fillStyle = '#f60'
  ctx.fillRect(125, 1, 62, 20)
  ctx.fillStyle = '#069'
  ctx.fillText(txt, 2, 15)
  ctx.fillStyle = 'rgba(102, 204, 0, 0.7)'
  ctx.fillText(txt, 4, 17)
  var b64 = canvas.toDataURL().replace('data:image/png;base64,', '')
  var bin = atob(b64)
  return bin2hex(bin.slice(-16, -12))
};
export const bin2hex = function(b) {
  var i = 0
  var l = 0
  var o = ''
  var s = b + ''
  var n
  for (i = 0, l = s.length; i < l; i++) {
    n = s.charCodeAt(i).toString(16)
    o += n.length < 2 ? '0' + n : n
  }
  return o
}
export const isEmptyObject = (obj) => {
  if (JSON.stringify(obj) === "{}") {
    return true
  }
  return false
}

export const isEmptyString = (str) => {
  if (typeof str === "undefined" || str === null || str === "") {
    return true;
  }
  return false;
}

export const getError = function(msg) {
  if (typeof msg !== String) {
    msg = msg.toString();
  }
  let mapMsg = new Map([
    ["Error: password is wrong", "message.home.passwordWrong"]
  ]);
  let errorMsg = mapMsg.get(msg) || msg;
  return errorMsg
}

// 查询当前节点
export const findCurrentNode = (nodeList) => {
  let currentNode = "";
  let defaultList = nodeList.defaultList || [];
  if (Array.isArray(defaultList) && defaultList.length > 0) {
    currentNode = defaultList[0].value; // 默认当前节点
    for (let custom of defaultList) {
      if (custom.isCurrentNode) {
        currentNode = custom.value;
      }
    }
  }
  let customList = nodeList.customList || [];
  if (Array.isArray(customList) && customList.length > 0) {
    for (let custom of customList) {
      if (custom.isCurrentNode) {
        currentNode = custom.value;
      }
    }
  }
  return currentNode;
}

// 存储助记词信息
export const saveMnemonicData = (data, password) => {
  let mnemonic = data.mnemonic; // 助记词
  let mnemonicData = encrypt(password, mnemonic, {}); // 加密
  let address = jtWallet.getAddress(data.privateKey);
  let pathList = {};
  pathList[`${address}`] = data.pathUrl; // 记录派生路径
  mnemonicData.pathList = pathList;
  mnemonicData.currentCountKey = data.countKey;
  Lockr.set("mnemonicData", mnemonicData); // 存储助记词相关信息
}

// 更新助记词存储数据
export const updateMnemonicData = (data) => {
  let mnemonicData = Lockr.get("mnemonicData");
  if (data.privateKey && data.pathUrl) {
    let address = jtWallet.getAddress(data.privateKey);
    let pathList = mnemonicData.pathList;
    pathList[`${address}`] = data.pathUrl; // 记录派生路径
    mnemonicData.pathList = pathList;
  }
  if (data.countKey) {
    mnemonicData.currentCountKey = data.countKey;
  }
  Lockr.set("mnemonicData", mnemonicData); // 存储助记词相关信息
}

// 删除地址对应的派生路径
export const delPathByAddress = (address = "") => {
  let mnemonicData = Lockr.get("mnemonicData") || {};
  if (!isEmptyObject(mnemonicData)) {
    let pathList = mnemonicData.pathList;
    let list = {};
    if (address) { // 传入 address 为空时，删除所有路径
      for (let key in pathList) {
        if (key !== address) {
          list[`${key}`] = pathList[`${key}`];
        }
      }
    }
    mnemonicData.pathList = list;
    Lockr.set("mnemonicData", mnemonicData);
  }
}

// 查询钱包是否冻结
export const walletFrozen = async (wallet) => {
  const inst = new JcExplorer(getExplorerHost());
  // 查询最近100条记录，用于判断钱包是否冻结
  let res = await inst.getHistory(getUUID(), wallet, 0, 100);
  // 默认钱包未冻结
  res.frozen = true;
  if (res.result) {
    let list = res.data.list;
    // let type = 1;
    for (let item of list) {
      // 判断是否被动成交
      if (item.type !== "OfferAffect") {
        // 判断是否冻结
        if (item.type === "SetBlackListP") {
          res.frozen = false;
        }
        break;
      }
    }
  }
  return res;
}