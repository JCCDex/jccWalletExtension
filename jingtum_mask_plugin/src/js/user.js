import { getExplorerHost } from "./api"
import { getUUID } from "./utils"
import store from "store";
import { ExplorerFactory } from "jcc_rpc";
import { BigNumber } from 'bignumber.js';
import Lockr from "lockr";
const bip39 = require("bip39");
const bip32 = require("bip32");
export const getUserBalances = async (address = "") => {
  let balance = {};
  let coins = [];
  let currentAddress = store.getters.defAddress;
  if (address) {
    currentAddress = address;
  }
  //   address = "jpid2UCZuTQbWPzGy67wzFet6p5hkFuXb6";
  const instExplorer = ExplorerFactory.init(getExplorerHost());
  const res = await instExplorer.getBalances(getUUID(), currentAddress);
  if (res.result) {
    const { data } = res;
    for (const key in data) {
      const { value, frozen } = data[key];
      if (key === "_id" || key === "feeflag") {
        continue;
      }
      let coin = key.split("_")[0];
      let coinData = { value: coin };
      if (coin === "SWTC") {
        coinData.value = "SWT";
      }
      if (coin.indexOf('J') === 0) {
        coin = coin.substring(1, coin.length);
      }
      if (coin.toUpperCase() === "CNY") {
        coin = 'CNT'
      }
      const total = value;
      const available = new BigNumber(value).minus(frozen).toString(10);
      if (new BigNumber(value).gt(0)) {
        balance[`${coin}`] = { available, frozen, total }; // total:总资产  available:可用资产  frozen:冻结资产
        coinData.name = coin;
        coins.push(coinData); // 保存币种
      }
    }
  }
  if (address && address !== store.getters.defAddress) {
    store.dispatch("updateCurrentCoins", coins);
    store.dispatch("updateCurrentBalance", balance);
  } else {
    store.dispatch("updateCoins", coins);
    store.dispatch("updateBalance", balance);
  }
}

export const createdWallet = (mnemonic = "") => {
  bip39.setDefaultWordlist("chinese_simplified");
  try {
    if (!mnemonic) {
      //  生成助记词
      mnemonic = bip39.generateMnemonic();
      console.log(mnemonic);
    }
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    //  通过助记词生成私钥
    const b32 = bip32.fromSeed(seed)
    let mnemonicData = Lockr.get("mnemonicData") || "";
    let countKey = mnemonicData.currentCountKey || "";
    if (!countKey) {
      countKey = "0";
    } else {
      countKey = parseInt(countKey) + 1 + "";
    }
    let pathUrl = "m/44'/315'/0'/0/" + countKey;
    const privateKey = b32.derivePath(pathUrl).privateKey.toString("hex");
    let data = {
      mnemonic,
      privateKey,
      countKey,
      pathUrl
    }
    return data
  } catch (error) {
    return {}
  }
}