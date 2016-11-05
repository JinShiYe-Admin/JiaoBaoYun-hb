var sortUrls=(function(mod){
	mod.config=function(name,url){
		require.config({
				baseUrl:"",
				waitSeconds:5,
				paths:{
					'crypto-js':"../../js/libs/crypto-js/crypto-js"
				}
			})
	}
	mod.sign=function(name,message,value){
		

			var encrypted=''
			require([name], function (CryptoJS) {
				encrypted=CryptoJS.HmacSHA1(message,value).toString(CryptoJS.enc.Base64)
				console.log(encrypted);
				
			});
			return encrypted;
	}
		
	return mod;
})(sortUrls||{})
