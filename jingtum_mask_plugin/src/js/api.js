// import store from "store"; 
const scanHosts = process.env.scanHosts
// jcc_rpc JcExplorer 调用
export const getExplorerHost = () => {
  let hosts = scanHosts;
  const urls = hosts.map((host) => `https://${host}`);
  return urls
}