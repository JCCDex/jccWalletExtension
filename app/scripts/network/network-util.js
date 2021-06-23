const networkUtls = {
    
    getNetworkByType(walletType){
        if(!window.localStorage.network){
           return null
        }else{
            let network = window.localStorage.network;
            const networks = network[walletType]
            return networks;
        }
    },

    saveNetwork(walletType,networlArray){
        let localStorage = window.localStorage;
        if(!localStorage.network){
            var Obj = new Object;
            Obj[walletType] = networlArray;
            localStorage.network = Obj
        }else if(!localStorage.network[walletType]){
            localStorage.network[walletType] = networlArray;
        }else{
            localStorage.network[walletType] = localStorage.network[walletType].concat(networlArray)
        }
    },

    deleteNetwork(walletType,network){
        let localStorage = window.localStorage;
        if(localStorage.network && localStorage.network[walletType]){
            let arr =  localStorage.network[walletType];
            for(var i = 0; i <  arr.length; i++) {
                if(arr[i] == network) {
                 arr.splice(i, 1);
                 break;
                }
            }
        }
    }

}
module.exports = networkUtls


