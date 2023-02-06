var appLogin = {
	code: null,
	userId: null,
	invite: null,
	loadInvite: function() {
		appLogin.createCaptcha();
		
		httpGlobal({
			method: 'POST',
			url: serverHttp + "profile.php/loadInvite/",
			headers: {
				Authorization : window.location.href.split(window.location.pathname + "?")[1]
			},
			timeout: 15000
		}).then(function (success) {
			if(success.data.status === "error") {
				parent.document.getElementById("idErrorMessageLogin").style.background = "#a22929";
				parent.document.getElementById("idErrorMessageLogin").innerHTML = "ERROR: " + success.data.msg
				parent.document.getElementById("idErrorMessageLogin").style.display = "block";
				parent.document.getElementById("idLoadingPage").style.display = "none";
				setTimeout(function(){
					parent.document.getElementById("idErrorMessageLogin").style.display = "none";
				}, 5000);
			} else {
				appLogin.invite = success.data;
				document.getElementById("idIndexEmail").value = appLogin.invite.userEmail;
				document.getElementById("idIndexEmail").readOnly = true;
			}
		}, function (error) {
			alert(error.data.msg);
		});
	},
	singUp: function() {
		document.getElementById("idLeftLogin").style.display = "none";
		document.getElementById("idRightLogin").style.display = "none";
		document.getElementById("idLeftCreate").style.display = "block";
		document.getElementById("idRightCreate").style.display = "block";
		document.getElementById("idLeftRecovery").style.display = "none";
		document.getElementById("idRightRecobery").style.display = "none";
		appLogin.createCaptcha();
	},
	singIn: function() {
		document.getElementById("idLeftLogin").style.display = "block";
		document.getElementById("idRightLogin").style.display = "block";
		document.getElementById("idLeftCreate").style.display = "none";
		document.getElementById("idRightCreate").style.display = "none";
		document.getElementById("idLeftRecovery").style.display = "none";
		document.getElementById("idRightRecobery").style.display = "none";
	},
	recovery: function() {
		document.getElementById("idLeftLogin").style.display = "none";
		document.getElementById("idRightLogin").style.display = "none";
		document.getElementById("idLeftCreate").style.display = "none";
		document.getElementById("idRightCreate").style.display = "none";
		document.getElementById("idLeftRecovery").style.display = "block";
		document.getElementById("idRightRecobery").style.display = "block";
	},
	createAccountInvite: function() {
		const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		let sendRegisterValid = true;
		document.getElementById("idIndexErrorEmail").className = "text-without-error";
		document.getElementById("idIndexErrorPassword").className = "text-without-error";
		document.getElementById("idIndexEmail").className = "field-without-error";
		document.getElementById("idIndexName").className = "field-without-error";
		document.getElementById("idIndexPassword").className = "field-without-error";
		document.getElementById("cpatchaTextBox").className = "field-without-error";
		if (!re.test(document.getElementById("idIndexEmail").value)){
			sendRegisterValid = false;
			document.getElementById("idIndexEmail").className = "field-error";
			document.getElementById("idIndexErrorEmail").innerHTML = "Confirma que tu correo electronico este bien escrito";
			document.getElementById("idIndexErrorEmail").className = "text-error";
		}
		if (document.getElementById("idIndexEmail").value === ""){
			sendRegisterValid = false;
			document.getElementById("idIndexEmail").className = "field-error";
		}
		if (document.getElementById("idIndexPassword").value === ""){
			sendRegisterValid = false;
			document.getElementById("idIndexPassword").className = "field-error";
		}
		if (document.getElementById("idIndexName").value === ""){
			sendRegisterValid = false;
			document.getElementById("idIndexName").className = "field-error";
		}
  		if (document.getElementById("cpatchaTextBox").value !== appLogin.code) {
  			sendRegisterValid = false;
    		appLogin.createCaptcha();
    		document.getElementById("cpatchaTextBox").className = "field-error";
  		}
		if(document.getElementById("idIndexLevelPassword").style.background !== "rgb(59, 255, 61)") {
			sendRegisterValid = false;
			if (!document.getElementById("idIndexPassword").value.match(/[A-z]/) ) {
				document.getElementById("idIndexErrorPassword").innerHTML = "La clave debe tener por lo menos una letra";
				document.getElementById("idIndexErrorPassword").className = "text-error";
				document.getElementById("idIndexPassword").className = "field-error";
			} else if (!document.getElementById("idIndexPassword").value.match(/[A-Z]/) ) {
				document.getElementById("idIndexErrorPassword").innerHTML = "La clave debe tener por lo menos una letra mayuscula";
				document.getElementById("idIndexErrorPassword").className = "text-error";
				document.getElementById("idIndexPassword").className = "field-error";
			} else if (!document.getElementById("idIndexPassword").value.match(/\d/)) {
				document.getElementById("idIndexErrorPassword").innerHTML = "La clave debe tener por lo menos un numero";
				document.getElementById("idIndexErrorPassword").className = "text-error";
				document.getElementById("idIndexPassword").className = "field-error";
			} else if (document.getElementById("idIndexPassword").value.length < 8 ) {
	    		document.getElementById("idIndexErrorPassword").innerHTML = "La clave debe tener por lo menos 8 caracteres";
	    		document.getElementById("idIndexErrorPassword").className = "text-error";
	    		document.getElementById("idIndexPassword").className = "field-error";
			}
		}
		if(sendRegisterValid) {
			document.getElementById("idLoadingPage").style.display = "block";
			var userData = {
				userEmail: document.getElementById("idIndexEmail").value,
				userPassword: md5(document.getElementById("idIndexPassword").value),
				userName: document.getElementById("idIndexName").value,
				companyId: appLogin.invite.companyId,
				userProfile: appLogin.invite.userProfile
			}
			httpGlobal({
				method: 'PUT',
				url: serverHttp + "user.php/createAccountInvite/",
				data: userData,
				timeout: 15000
			}).then(function (success) {
				if(success.data.status === "error") {
					document.getElementById("idErrorMessageLogin").style.background = "#a22929";
					document.getElementById("idErrorMessageLogin").innerHTML = "ERROR: " + success.data.msg
					document.getElementById("idErrorMessageLogin").style.display = "block";
					document.getElementById("idLoadingPage").style.display = "none";
					setTimeout(function(){
						document.getElementById("idErrorMessageLogin").style.display = "none";
					}, 5000);
				} else {
					location.href = "../";
				}
			}, function (error) {
				alert(error.data.msg);
			});
		}
	},
	createAccount: function() {
		const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		let sendRegisterValid = true;
		document.getElementById("idIndexErrorEmail").className = "text-without-error";
		document.getElementById("idIndexErrorPassword").className = "text-without-error";
		document.getElementById("idIndexEmail").className = "field-without-error";
		document.getElementById("idIndexName").className = "field-without-error";
		document.getElementById("idIndexPassword").className = "field-without-error";
		document.getElementById("cpatchaTextBox").className = "field-without-error";
		if (!re.test(document.getElementById("idIndexEmail").value)){
			sendRegisterValid = false;
			document.getElementById("idIndexEmail").className = "field-error";
			document.getElementById("idIndexErrorEmail").innerHTML = "Confirma que tu correo electronico este bien escrito";
			document.getElementById("idIndexErrorEmail").className = "text-error";
		}
		if (document.getElementById("idIndexEmail").value === ""){
			sendRegisterValid = false;
			document.getElementById("idIndexEmail").className = "field-error";
		}
		if (document.getElementById("idIndexPassword").value === ""){
			sendRegisterValid = false;
			document.getElementById("idIndexPassword").className = "field-error";
		}
		if (document.getElementById("idIndexName").value === ""){
			sendRegisterValid = false;
			document.getElementById("idIndexName").className = "field-error";
		}
  		if (document.getElementById("cpatchaTextBox").value !== appLogin.code) {
  			sendRegisterValid = false;
    		appLogin.createCaptcha();
    		document.getElementById("cpatchaTextBox").className = "field-error";
  		}
		if(document.getElementById("idIndexLevelPassword").style.background !== "rgb(59, 255, 61)") {
			sendRegisterValid = false;
			if (!document.getElementById("idIndexPassword").value.match(/[A-z]/) ) {
				document.getElementById("idIndexErrorPassword").innerHTML = "La clave debe tener por lo menos una letra";
				document.getElementById("idIndexErrorPassword").className = "text-error";
				document.getElementById("idIndexPassword").className = "field-error";
			} else if (!document.getElementById("idIndexPassword").value.match(/[A-Z]/) ) {
				document.getElementById("idIndexErrorPassword").innerHTML = "La clave debe tener por lo menos una letra mayuscula";
				document.getElementById("idIndexErrorPassword").className = "text-error";
				document.getElementById("idIndexPassword").className = "field-error";
			} else if (!document.getElementById("idIndexPassword").value.match(/\d/)) {
				document.getElementById("idIndexErrorPassword").innerHTML = "La clave debe tener por lo menos un numero";
				document.getElementById("idIndexErrorPassword").className = "text-error";
				document.getElementById("idIndexPassword").className = "field-error";
			} else if (document.getElementById("idIndexPassword").value.length < 8 ) {
	    		document.getElementById("idIndexErrorPassword").innerHTML = "La clave debe tener por lo menos 8 caracteres";
	    		document.getElementById("idIndexErrorPassword").className = "text-error";
	    		document.getElementById("idIndexPassword").className = "field-error";
			}
		}
		if(sendRegisterValid) {
			document.getElementById("idLoadingPage").style.display = "block";
			var userData = {
				userEmail: document.getElementById("idIndexEmail").value,
				userPassword: md5(document.getElementById("idIndexPassword").value),
				userName: document.getElementById("idIndexName").value
			}
			httpGlobal({
				method: 'PUT',
				url: serverHttp + "user.php/createAccount/",
				data: userData,
				timeout: 15000
			}).then(function (success) {
				if(success.data.status === "error") {
					document.getElementById("idErrorMessageLogin").style.background = "#a22929";
					document.getElementById("idErrorMessageLogin").innerHTML = "ERROR: " + success.data.msg
					document.getElementById("idErrorMessageLogin").style.display = "block";
					document.getElementById("idLoadingPage").style.display = "none";
					setTimeout(function(){
						document.getElementById("idErrorMessageLogin").style.display = "none";
					}, 5000);
				} else {
					appLogin.singIn();
					document.getElementById("idLoadingPage").style.display = "none";
				}
			}, function (error) {
				alert(error.data.msg);
			});
		}
	},
	validPassword: function(password, idIndexLevelPassword) {
		document.getElementById(idIndexLevelPassword).style.display = "block";
		let securityPassword = 0;
		let colorPassword = "#ff0000";
		if (password.length > 7 ) {
    		securityPassword ++;
		}		
		if (password.match(/[A-z]/) ) {
			securityPassword ++;
		}
		if (password.match(/[A-Z]/) ) {
			securityPassword ++;
		}
		if (password.match(/\d/)) {
			securityPassword ++;
		}
		if(password.length === 0) {
			document.getElementById(idIndexLevelPassword).style.display = "none";
		}
		if(securityPassword === 2) {
			colorPassword = "#ff8500";
		}
		if(securityPassword === 3) {
			colorPassword = "#ffeb3b";
		}
		if(securityPassword === 4) {
			colorPassword = "#3bff3d";
		}
		document.getElementById(idIndexLevelPassword).style.width = (290 * (securityPassword  * 25) / 100) + "px";
		document.getElementById(idIndexLevelPassword).style.background = colorPassword;
	},
	createCaptcha :  function() {
		document.getElementById('captcha').innerHTML = "";
		var charsArray = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@!#$%^&*";
		var lengthOtp = 6;
		var captcha = [];
		for (var i = 0; i < lengthOtp; i++) {
			var index = Math.floor(Math.random() * charsArray.length + 1); //get the next character from the array
			if (captcha.indexOf(charsArray[index]) == -1)
				captcha.push(charsArray[index]);
			else i--;
		}
		var canv = document.createElement("canvas");
		canv.id = "captcha";
		canv.width = 100;
		canv.height = 50;
		var ctx = canv.getContext("2d");
		ctx.font = "25px Georgia";
		ctx.strokeText(captcha.join(""), 0, 30);
		appLogin.code = captcha.join("");
		document.getElementById("captcha").appendChild(canv);
  	},
  	sentMailOTP: function() {
  		var sendRegisterValid = true;
  		document.getElementById("idIndexEmailOTP").className = "field-without-error";
  		const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (!re.test(document.getElementById("idIndexEmailOTP").value)){
			sendRegisterValid = false;
			document.getElementById("idIndexEmailOTP").className = "field-error";
			document.getElementById("idIndexErrorEmailOTP").innerHTML = "Confirma que tu correo electronico este bien escrito";
			document.getElementById("idIndexErrorEmailOTP").className = "text-error";
		}
		if (document.getElementById("idIndexEmailOTP").value === ""){
			sendRegisterValid = false;
			document.getElementById("idIndexEmailOTP").className = "field-error";
		}

		if(sendRegisterValid) {
			document.getElementById("idLoadingPage").style.display = "block";
	  		var userData = {
				userEmail: document.getElementById("idIndexEmailOTP").value
			}
			httpGlobal({
				method: 'POST',
				url: serverHttp + "user.php/generateOTP/",
				data: userData,
				timeout: 15000
			}).then(function (success) {
				if(success.data.status === "error") {
					document.getElementById("idErrorMessageLogin").style.background = "#a22929";
					document.getElementById("idErrorMessageLogin").innerHTML = "ERROR: " + success.data.msg;
					document.getElementById("idErrorMessageLogin").style.display = "block";
					document.getElementById("idLoadingPage").style.display = "none";
					setTimeout(function(){
						document.getElementById("idErrorMessageLogin").style.display = "none";
					}, 5000);
				} else {
					document.getElementById("idLoadingPage").style.display = "none";
					document.getElementById("idErrorMessageLogin").innerHTML = "Te enviamos un mensaje de correo con la OTP para restaurar tu clave, verifica tu carpeta de Spam";
					document.getElementById("idErrorMessageLogin").style.display = "block";
					setTimeout(function(){
						document.getElementById("idErrorMessageLogin").style.display = "none";
					}, 10000);
					document.getElementById("idErrorMessageLogin").style.background = "#35a696";					
				}
			}, function (error) {
				alert(error.data.msg);
			});
		}
  	},
  	changePassword: function() {
  		var sendRegisterValid = true;
  		document.getElementById("idIndexEmailOTP").className = "field-without-error";
  		document.getElementById("idIndexPasswordOTP").className = "field-without-error";
  		document.getElementById("idIndexOTP").className = "field-without-error";

  		const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (!re.test(document.getElementById("idIndexEmailOTP").value)){
			sendRegisterValid = false;
			document.getElementById("idIndexEmailOTP").className = "field-error";
			document.getElementById("idIndexErrorEmailOTP").innerHTML = "Confirma que tu correo electronico este bien escrito";
			document.getElementById("idIndexErrorEmailOTP").className = "text-error";
		}
		if (document.getElementById("idIndexEmailOTP").value === ""){
			sendRegisterValid = false;
			document.getElementById("idIndexEmailOTP").className = "field-error";
		}
		if (document.getElementById("idIndexPasswordOTP").value === ""){
			sendRegisterValid = false;
			document.getElementById("idIndexPasswordOTP").className = "field-error";
		}
		if(document.getElementById("idIndexLevelPasswordRecovery").style.background !== "rgb(59, 255, 61)") {
			sendRegisterValid = false;
			if (!document.getElementById("idIndexPasswordOTP").value.match(/[A-z]/) ) {
				document.getElementById("idIndexErrorPasswordOTP").innerHTML = "La clave debe tener por lo menos una letra";
				document.getElementById("idIndexErrorPasswordOTP").className = "text-error";
				document.getElementById("idIndexPasswordOTP").className = "field-error";
			} else if (!document.getElementById("idIndexPasswordOTP").value.match(/[A-Z]/) ) {
				document.getElementById("idIndexErrorPasswordOTP").innerHTML = "La clave debe tener por lo menos una letra mayuscula";
				document.getElementById("idIndexErrorPasswordOTP").className = "text-error";
				document.getElementById("idIndexPasswordOTP").className = "field-error";
			} else if (!document.getElementById("idIndexPasswordOTP").value.match(/\d/)) {
				document.getElementById("idIndexErrorPasswordOTP").innerHTML = "La clave debe tener por lo menos un numero";
				document.getElementById("idIndexErrorPasswordOTP").className = "text-error";
				document.getElementById("idIndexPasswordOTP").className = "field-error";
			} else if (document.getElementById("idIndexPasswordOTP").value.length < 8 ) {
	    		document.getElementById("idIndexErrorPasswordOTP").innerHTML = "La clave debe tener por lo menos 8 caracteres";
	    		document.getElementById("idIndexErrorPasswordOTP").className = "text-error";
	    		document.getElementById("idIndexPasswordOTP").className = "field-error";
			}
		}
		if (document.getElementById("idIndexOTP").value === ""){
			sendRegisterValid = false;
			document.getElementById("idIndexOTP").className = "field-error";
		}

		if(sendRegisterValid) {
	  		var userData = {
				userEmail: document.getElementById("idIndexEmailOTP").value,
				userPassword: md5(document.getElementById("idIndexPasswordOTP").value),
				userOTP: document.getElementById("idIndexOTP").value
			}
			document.getElementById("idLoadingPage").style.display = "block";
			httpGlobal({
				method: 'PUT',
				url: serverHttp + "user.php/changePasswordAccount/",
				data: userData,
				timeout: 15000
			}).then(function (success) {
				if(success.data.status === "error") {
					document.getElementById("idErrorMessageLogin").style.background = "#a22929";
					document.getElementById("idErrorMessageLogin").innerHTML = "ERROR: " + success.data.msg;
					document.getElementById("idErrorMessageLogin").style.display = "block";
					document.getElementById("idLoadingPage").style.display = "none";
					setTimeout(function(){
						document.getElementById("idErrorMessageLogin").style.display = "none";
					}, 5000);
				} else {
					document.getElementById("idLoadingPage").style.display = "none";
					appLogin.singIn();
				}
			}, function (error) {
				alert(error.data.msg);
			});
		}
  	},
	googleLogin: function() {
    	gapi.load('auth2', function() {
    		auth2 = gapi.auth2.init({
    			client_id: '155469159413-il1kt3ctmdj7joja6q7f0pjhd1bugoe9.apps.googleusercontent.com',
    			scope: 'profile email'
    		});
			auth2.grantOfflineAccess().then(function(authResult) {
				var userData = {
					key: localStorage.getItem("key"),
					controller: localStorage.getItem("controller"),
					code: authResult['code']
				}
				document.getElementById("idLoadingPage").style.display = "block";
				if (authResult['code']) {
					httpGlobal({
						method: 'POST',
						url: serverHttp + "user.php/authUser/",
						data: userData,
						timeout: 15000
					}).then(function (success) {
						if(success.data.status === "error") {
							document.getElementById("idErrorMessageLogin").style.background = "#a22929";
							document.getElementById("idErrorMessageLogin").innerHTML = "ERROR: " + success.data.msg
							document.getElementById("idErrorMessageLogin").style.display = "block";
							document.getElementById("idLoadingPage").style.display = "none";
							setTimeout(function(){
								document.getElementById("idErrorMessageLogin").style.display = "none";
							}, 5000);
						} else {
							localStorage.setItem('key', success.data.key);
							location.href = "image/";
							document.getElementById("idLoadingPage").style.display = "none";
						}
					}, function (error) {
						alert(error);
					});
				}
			});
    	});
	},
	loginUser: function() {
		let sendRegisterValid = true;
		document.getElementById("idIndexEmailLogin").className = "field-without-error";
		document.getElementById("idIndexPasswordLogin").className = "field-without-error";
		const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (!re.test(document.getElementById("idIndexEmailLogin").value)){
			sendRegisterValid = false;
			document.getElementById("idIndexEmailLogin").className = "field-error";
			document.getElementById("idIndexErrorEmailLogin").innerHTML = "Confirma que tu correo electronico este bien escrito";
			document.getElementById("idIndexErrorEmailLogin").className = "text-error";
		}
		if (document.getElementById("idIndexEmailLogin").value === ""){
			sendRegisterValid = false;
			document.getElementById("idIndexEmailLogin").className = "field-error";
		}
		if (document.getElementById("idIndexPasswordLogin").value === ""){
			sendRegisterValid = false;
			document.getElementById("idIndexPasswordLogin").className = "field-error";
		}
		if(sendRegisterValid) {
			document.getElementById("idLoadingPage").style.display = "block";
			var userData = {
				userEmail: document.getElementById("idIndexEmailLogin").value,
				userPassword: md5(document.getElementById("idIndexPasswordLogin").value)
			}
			httpGlobal({
				method: 'POST',
				url: serverHttp + "user.php/loginUser/",
				data: userData,
				timeout: 15000
			}).then(function (success) {
				if(success.data.status === "error") {
					document.getElementById("idErrorMessageLogin").style.background = "#a22929";
					document.getElementById("idErrorMessageLogin").innerHTML = "ERROR: " + success.data.msg
					document.getElementById("idErrorMessageLogin").style.display = "block";
					document.getElementById("idLoadingPage").style.display = "none";
					setTimeout(function(){
						document.getElementById("idErrorMessageLogin").style.display = "none";
					}, 5000);
				} else {
					document.getElementById("idLoadingPage").style.display = "none";
					if(success.data.status === "company") {
						appLogin.userId = success.data.userId;
						document.getElementById("idLeftCompany").style.display = "block";
						document.getElementById("idRightCompany").style.display = "block";
						document.getElementById("idLeftLogin").style.display = "none";
						document.getElementById("idRightLogin").style.display = "none";
					} else {
						localStorage.setItem('key', success.data.key);
						location.href = "image/";
					}
				}
			}, function (error) {
				alert(error.data.msg);
			});
		}
	},
	createCompany: function() {
		let sendRegisterValid = true;
		document.getElementById("idIndexNameCompany").className = "field-without-error";
		document.getElementById("idIndexAddressCompany").className = "field-without-error";
		document.getElementById("idIndexPhoneCompany").className = "field-without-error";

		if (document.getElementById("idIndexNameCompany").value === ""){
			sendRegisterValid = false;
			document.getElementById("idIndexNameCompany").className = "field-error";
		}
		if (document.getElementById("idIndexPhoneCompany").value === ""){
			sendRegisterValid = false;
			document.getElementById("idIndexPhoneCompany").className = "field-error";
		}
		if(sendRegisterValid) {
			document.getElementById("idLoadingPage").style.display = "block";
			var userData = {
				companyName: document.getElementById("idIndexNameCompany").value,
				companyAddress: document.getElementById("idIndexAddressCompany").value,
				companyPhone: document.getElementById("idIndexPhoneCompany").value,
				userId: appLogin.userId
			}
			httpGlobal({
				method: 'PUT',
				url: serverHttp + "user.php/createCompany/",
				data: userData,
				timeout: 15000
			}).then(function (success) {
				if(success.data.status === "error") {
					document.getElementById("idErrorMessageLogin").style.background = "#a22929";
					document.getElementById("idErrorMessageLogin").innerHTML = "ERROR: " + success.data.msg
					document.getElementById("idErrorMessageLogin").style.display = "block";
					document.getElementById("idLoadingPage").style.display = "none";
					setTimeout(function(){
						document.getElementById("idErrorMessageLogin").style.display = "none";
					}, 5000);
				} else {
					document.getElementById("idLoadingPage").style.display = "none";
					localStorage.setItem('key', success.data.key);
					location.href = "image/";
				}
			}, function (error) {
				alert(error.data.msg);
			});
		}
	}
}