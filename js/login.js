function Login (routerOutlet, newHandlebars) {
	this._newHandlebars = newHandlebars;
	this._routerOutlet = routerOutlet;
	this._template;
	this._submitButton;
	this._inputLoginName;
	this._loginErrorDiv;
	this._inputLoginPassword;
	this._promiseTemplate = $.ajax({
							type: "POST",
							url: "/templates/login.html"
						   });
}

Login.prototype.render = function(){
	window.scrollTo(0,0);
	var self = this;
	this._promiseTemplate.then(function (datateplate) {
		self._template = datateplate;
		var dataObject = {};
	    self._routerOutlet.innerHTML = self._newHandlebars(self._template, dataObject);
	    self._loginErrorDiv = document.querySelector('.loginError');
	    self._loginErrorDiv.innerHTML = "";
	    self._addListeners();
	});
};

Login.prototype._addListeners = function(){
	var self = this;
	this._submitButton = document.querySelector('.buttonLogin');
	this._inputLoginName = document.querySelector('#nameLogin');
	this._inputLoginPassword = document.querySelector('#passwordLogin');
	this._submitButton.addEventListener('click', function (event) {
		self._checkPassword(self._inputLoginName.value, self._inputLoginPassword.value);
	});
};

Login.prototype._checkPassword = function(login, password){
	document.cookie = "userName=Vasya";
	function getCookie(name) {
      var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
      ));
      return matches ? decodeURIComponent(matches[1]) : undefined;
    }
	$.ajax({
		 	type: "POST",
		 	url: "/php/controller.php",
		 	data: ({"task": "checkuser", "login": login, "password": password}),
		 	dataType: "json",
		 	success: this._renderAdminPanel.bind(this)
		   });
};

Login.prototype._renderAdminPanel = function(dataFromServer){
	if (dataFromServer === "admin"){
		document.cookie = "userName=" + this._inputLoginName.value;
		document.cookie = "userPassword=" + this._inputLoginPassword.value;
    	document.location = 'http://ecommercewebsite.site11.com/#adminpanel';
	}else{
		this._loginErrorDiv.innerHTML = "Неправильный логин/пароль";
	}
};

window.app = window.app || {};
window.app.Login = window.app.Login || Login;