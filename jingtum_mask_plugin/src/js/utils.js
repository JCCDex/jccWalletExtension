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
export const getError = function(msg) {
  let mapMsg = new Map([
    ["Error: password is wrong", "message.home.passwordWrong"]
  ]);
  let errorMsg = mapMsg.get(msg);
  return errorMsg
}