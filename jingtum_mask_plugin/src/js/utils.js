// import { isEmptyObject } from "jcc_common";
const createKeccakHash = require("keccak");
const randombytes = require("randombytes");
const scrypt = require("scryptsy");
const crypto = require("crypto");
import { jtWallet } from "jcc_wallet";
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
  let mapMsg = new Map([
    ["Error: password is wrong", "message.home.passwordWrong"]
  ]);
  let errorMsg = mapMsg.get(msg);
  return errorMsg
}

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


/**
 * encrypt data with password
 *
 * @param {string} password
 * @param {string} data
 * @param {IEncryptModel} [opts={}]
 * @returns {IKeystoreModel}
 */
export const encrypt = (password, data, opts = {}) => {
  const iv = opts.iv || randombytes(16).toString("hex");
  const kdfparams = {
    dklen: opts.dklen || 32,
    n: opts.n || 4096,
    p: opts.p || 1,
    r: opts.r || 8,
    salt: opts.salt || randombytes(32).toString("hex")
  };
  const derivedKey = scrypt(Buffer.from(password), Buffer.from(kdfparams.salt, "hex"), kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen);
  const cipher = crypto.createCipheriv(opts.cipher || "aes-128-ctr", derivedKey.slice(0, 16), Buffer.from(iv, "hex"));
  const ciphertext = Buffer.concat([cipher.update(Buffer.from(data)), cipher.final()]);
  const mac = createKeccakHash("keccak256")
    .update(Buffer.concat([derivedKey.slice(16, 32), ciphertext]))
    .digest();
  return {
    ciphertext: ciphertext.toString("hex"),
    crypto: {
      cipher: opts.cipher || "aes-128-ctr",
      iv,
      kdf: "scrypt",
      kdfparams
    },
    mac: mac.toString("hex")
  };
}

// 解密
export const decrypt = (password, encryptData) => {
  if (isEmptyObject(encryptData) || isEmptyObject(encryptData.crypto) || isEmptyObject(encryptData.crypto.kdfparams)) {
    throw new Error(KEYSTORE_IS_INVALID);
  }
  const iv = Buffer.from(encryptData.crypto.iv, "hex");
  const kdfparams = encryptData.crypto.kdfparams;
  const derivedKey = scrypt(Buffer.from(password), Buffer.from(kdfparams.salt, "hex"), kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen);
  const ciphertext = Buffer.from(encryptData.ciphertext, "hex");
  const mac = createKeccakHash("keccak256")
    .update(Buffer.concat([derivedKey.slice(16, 32), ciphertext]))
    .digest();
  if (mac.toString("hex") !== encryptData.mac) {
    throw new Error(PASSWORD_IS_WRONG);
  }
  const decipher = crypto.createDecipheriv("aes-128-ctr", derivedKey.slice(0, 16), iv);
  const seed = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return seed.toString();
}

// 存储助记词信息
export const saveMnemonicData = (data, password) => {
  let mnemonic = data.mnemonic; // 助记词
  let mnemonicData = encrypt(password, mnemonic); // 加密
  let address = jtWallet.getAddress(data.privateKey);
  let pathList = {};
  pathList[`${address}`] = data.pathUrl; // 记录派生路径
  mnemonicData.pathList = pathList;
  mnemonicData.currentCountKey = data.countKey;
  Lockr.set("mnemonicData", mnemonicData); // 存储助记词相关信息
}

// 删除地址对应的派生路径
export const delPathByAddress = (address) => {
  let mnemonicData = Lockr.get("mnemonicData") || {};
  if (!isEmptyObject(mnemonicData)) {
    let pathList = mnemonicData.pathList;
    let list = {};
    for (let key in pathList) {
      if (key !== address) {
        list[`${key}`] = pathList[`${key}`];
      }
    }
    mnemonicData.pathList = list;
    Lockr.set("mnemonicData", mnemonicData);
  }
}