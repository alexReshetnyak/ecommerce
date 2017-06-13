import {basket} from './index.js';
import {thankYou} from './index.js';

export default function FormBuy(routerOutlet, newHandlebars){
	this._newHandlebars = newHandlebars;
	this._routerOutlet = routerOutlet;
	this._formDiv;
	this._inputPhone;
	this._inputMail;
	this._buttonSubmit;
	this._promiseTemplate;
}

FormBuy.prototype.render = function(){
	window.scrollTo(0,0);
	this._promiseTemplate = $.ajax({
							type: "POST",
							url: "/templates/formbuy.html"
						   });

	var self = this;
	this._promiseTemplate.then(function (datateplate) {

		self._template = datateplate;

	    self._dataObject = {};
	    self._routerOutlet.innerHTML = self._newHandlebars(self._template, self._dataObject);
	    self._addFormListeners();
	});
}

FormBuy.prototype._addFormListeners = function(){

	var self = this;
	this._formDiv = document.querySelector('#formUser');
	this._inputPhone = this._formDiv.querySelector('#phoneForm');
	this._inputMail = this._formDiv.querySelector('#emailForm');
	this._inputName = this._formDiv.querySelector('#nameForm');
	this._buttonSubmit = this._formDiv.querySelector('.buttonOrder');

	$(function($){
		$("#phoneForm").mask("+38 (999) 999-9999", {'autoclear': false});
	});

//----------------------------------Phone-----------------------------------------------------------

	this._inputPhone.addEventListener('focus', function (event) {
		if (self._inputPhone.classList.contains('blur')){
			event.target.blur();
			self._inputPhone.classList.remove('blur');
			setTimeout(function () {  
				self._inputPhone.focus();
			}, 500);
			self._formDiv.querySelector('#labelPhone').style.transform = 'translateY(0)';
		}
	});

	this._inputPhone.addEventListener('blur', function(event){
		if (self._inputPhone.value === "+38 (___) ___-____" && !self._inputPhone.classList.contains('blur')) {
			self._inputPhone.classList.add('blur');
			self._formDiv.querySelector('#labelPhone').style.transform = 'translateY(32px)';
		}else if (!self._inputPhone.classList.contains('blur')) {

			var regV = /\+38\s\((\d){3}\)\s(\d){3}-(\d){4}/i;
			var result = self._inputPhone.value.match(regV);
			if (!result){
				self._inputPhone.style.border = "1px solid red";
				if (self._inputPhone.classList.contains('checked')) {
					self._inputPhone.classList.remove('checked');
				}
			}else{
				self._inputPhone.style.border = "1px solid green";
				self._inputPhone.classList.add('checked');
			}
		}
	});

//---------------------------------Mail---------------------------------------------

	this._inputMail.addEventListener('focus', function (event) {
		if (self._inputMail.classList.contains('blur')){
			event.target.blur();
			self._inputMail.classList.remove('blur');
			setTimeout(function () {  
				self._inputMail.focus();
			}, 500);
			self._formDiv.querySelector('#labelEmail').style.transform = 'translateY(0)';
		}
	});

	this._inputMail.addEventListener('blur', function(event){
		if (self._inputMail.value === "" && !self._inputMail.classList.contains('blur')) {
			self._inputMail.classList.add('blur');
			self._formDiv.querySelector('#labelEmail').style.transform = 'translateY(32px)';
		}else if (!self._inputMail.classList.contains('blur')){

			var regV = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
			var result = self._inputMail.value.match(regV);
			if (!result){
				self._inputMail.style.border = "1px solid red";
				if (self._inputMail.classList.contains('checked')) {
					self._inputMail.classList.remove('checked');
				}
			}else{
				self._inputMail.style.border = "1px solid green";
				self._inputMail.classList.add('checked');
			}
		}
	});

//------------------------------------Name------------------------------------------

	this._inputName.addEventListener('focus', function (event) {
		if (self._inputName.classList.contains('blur')){
			event.target.blur();
			self._inputName.classList.remove('blur');
			setTimeout(function () {  
				self._inputName.focus();
			}, 500);
			self._formDiv.querySelector('#labelName').style.transform = 'translateY(0)';
		}
	});

	this._inputName.addEventListener('blur', function(event){
		if (self._inputName.value === "" && !self._inputName.classList.contains('blur')) {
			self._inputName.classList.add('blur');
			self._formDiv.querySelector('#labelName').style.transform = 'translateY(32px)';
		}
	});

//-----------------------------------------------------------------------------------------------------

	this._buttonSubmit.addEventListener('click', function (event) {
		if (self._inputPhone.classList.contains('checked') && self._inputMail.classList.contains('checked')) {

			self._sendInfoToPhp(self._inputPhone.value, self._inputMail.value, self._inputName.value);
		}
	});
}

FormBuy.prototype._sendInfoToPhp = function(phone, email, name){
	var goodsArray = basket.getElementsFromStorage();
	var contacts = [phone, email, name];
	$.ajax({
		 	type: "POST",
		 	url: "/php/controller.php",
		 	data: ({"task": "sendEmail",
		 	        "arrayWithContactData": JSON.stringify(contacts),
		 	        "goodsArray": JSON.stringify(goodsArray)}),
		 	dataType: "json",
		 	success: this._showMessege.bind(this)
		    });
};



FormBuy.prototype._showMessege = function(data){
	if (data === 'success'){
		basket.setElementsInStorage([]);
		basket.goodsInBasketArray = [];
		thankYou.render('success');
	}else{
		thankYou.render('fail');
	}
}