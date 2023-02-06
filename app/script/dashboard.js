var appDashboard = {
	isPresentMenuAvatar: true,
	closeAlert: function() {
		document.getElementById("idInfoMessageLogin").style.display = "none";
		document.getElementById("idBlackPage").style.display = "none";
	},
	openMenuListApplicant: function(url) {
		localStorage.setItem('ticketId', null);
		appDashboard.openMenu(url);
	},
	openMenu: function(url) {
		document.getElementById("frameContent").src = url;
		appDashboard.closeMenuAvatar();
	},
	clickIconAvatar: function (avatar){
		document.getElementsByName("avatarImage").forEach(iconAvatar => {
			iconAvatar.style.opacity = 1;
		});
		avatar.style.opacity = 0.3;
		document.getElementById("newAvatar").src = avatar.getElementsByTagName('img')[0].src;
	},
	openMenuAvatar: function() {
		document.getElementById("idMenuAvatar").style.display = "block";
	},
	closeMenuAvatar: function() {
		setTimeout(function(){
			if(appDashboard.isPresentMenuAvatar) {
				document.getElementById("idMenuAvatar").style.display = "none";
			}
		}, 2000);
	},
	presentMenuAvatar: function() {
		appDashboard.isPresentMenuAvatar = false;
	},
	unpresentMenuAvatar: function() {
		appDashboard.isPresentMenuAvatar = true;
		setTimeout(function(){
			document.getElementById("idMenuAvatar").style.display = "none";
		}, 2000);
	},
	selectAvatar: function () {
		var sendRegisterValid = true;

		document.getElementById("idIndexNameAvatar").className = "field-without-error";
		document.getElementById("idIndexImageAvatar").className = "avatar-image field-without-error";

		if(document.getElementById("idIndexNameAvatar").value === "") {
			sendRegisterValid = false;
			document.getElementById("idIndexNameAvatar").className = "field-error";
		}

		if(document.getElementById("newAvatar").src === "") {
			sendRegisterValid = false;
			document.getElementById("idIndexImageAvatar").className = "avatar-image field-error";
		}
		if(sendRegisterValid) {
	  		var userData = {
	  			Authorization : localStorage.getItem('key'),
				nameAvatar: document.getElementById("idIndexNameAvatar").value,
				newAvatar: document.getElementById("newAvatar").src
			}
			document.getElementById("idLoadingPage").style.display = "block";
			document.getElementById("idBackgroundPopup").style.display = "none";
			httpGlobal({
				method: 'PUT',
				url: serverHttp + "user.php/userUpdate/",
				data: userData,
				headers: {
					Authorization : localStorage.getItem('key')
				},
				timeout: 15000
			}).then(function (success) {
				if(success.data.status === "error" || success.data.status === "timeout") {
					document.getElementById("idBackgroundPopup").style.display = "block";
					document.getElementById("idErrorMessageLogin").style.background = "#a22929";
					document.getElementById("idErrorMessageLogin").innerHTML = "ERROR: " + success.data.msg;
					document.getElementById("idErrorMessageLogin").style.display = "block";
					document.getElementById("idLoadingPage").style.display = "none";
					setTimeout(function(){
						document.getElementById("idErrorMessageLogin").style.display = "none";
						if(success.data.status === "timeout") {
							location.href = "../";
						}
					}, 5000);
				} else {
					document.getElementById("idLoadingPage").style.display = "none";
					document.getElementById("idPopupUpdateAvatar").style.display = "none";
					document.getElementById("idBackgroundPopup").style.display = "none";
					document.getElementById("idNameAvatar").innerHTML = document.getElementById("idIndexNameAvatar").value;
					document.getElementById("idImageAvatar").src = document.getElementById("newAvatar").src;
					document.getElementById("idLevelName").innerHTML = success.data.levelName;
				}
			}, function (error) {
				alert(error.data.msg);
			});
		}
	},
	onload: function() {
		httpGlobal({
			method: 'GET',
			url: serverHttp + "user.php/loadAvatar/",
			headers: {
				Authorization : localStorage.getItem('key')
			},
			timeout: 15000
		}).then(function (success) {
			if(success.data.status === "error" || success.data.status === "timeout") {
				document.getElementById("idBackgroundPopup").style.display = "block";
				document.getElementById("idErrorMessageLogin").style.background = "#a22929";
				document.getElementById("idErrorMessageLogin").innerHTML = "ERROR: " + success.data.msg;
				document.getElementById("idErrorMessageLogin").style.display = "block";
				document.getElementById("idLoadingPage").style.display = "none";
				setTimeout(function(){
					document.getElementById("idErrorMessageLogin").style.display = "none";
					if(success.data.status === "timeout") {
						location.href = "../";
					}
				}, 5000);
			} else {
				if(success.data.userNickname !== "") {
					document.getElementById("idLoadingPage").style.display = "none";
					document.getElementById("idPopupUpdateAvatar").style.display = "none";
					document.getElementById("idBackgroundPopup").style.display = "none";
					document.getElementById("idNameAvatar").innerHTML = success.data.userNickname;
					document.getElementById("idImageAvatar").src = success.data.userAvatar;
					document.getElementById("idLevelName").innerHTML = success.data.levelName;
					document.getElementById("idCoinLevel").innerHTML = success.data.pointValue;

					success.data.listPrivilege.forEach( privilegeId => {
						if(parseInt(privilegeId.privilegeId) === 6) {
							document.getElementById("idTicketRequest").style.display = "block";
						}
						if(parseInt(privilegeId.privilegeId) === 7) {
							document.getElementById("idApplicant").style.display = "block";
						}
					});
				} else {
					document.getElementById("idPopupUpdateAvatar").style.display = "block";
				}
			}
		}, function (error) {
			alert(error.data.msg);
		});
	}
}