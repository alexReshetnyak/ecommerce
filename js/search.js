import {basket} from './index.js';

export default function Search (routerOutlet, newHandlebars) {

	this._newHandlebars = newHandlebars;
	this._routerOutlet = routerOutlet;
	this._template;
	this._searchWords = "";
	this._inputField = document.querySelector('#searchInput');
	this._inputButton = document.querySelector('#searchButton');
	this._addListeners();
	this._promiseTemplate = $.ajax({
							type: "POST",
							url: "/templates/search.html"
						   });
}


Search.prototype._addListeners = function(){
	var self = this;
	this._inputButton.addEventListener('click', function (event){
		self._searchWords = self._inputField.value;

		$.ajax({
		 	type: "POST",
		 	url: "/php/controller.php",
		 	data: ({"task": "search", "words": self._searchWords}),
		 	dataType: "json",
		 	success: self._showResults.bind(self)
		   });
	});

	this._inputField.addEventListener('keyup', function (event){
		if (event.key === "Enter") {
			self._searchWords = self._inputField.value;

		    $.ajax({
		     	type: "POST",
		     	url: "/php/controller.php",
		     	data: ({"task": "search", "words": self._searchWords}),
		     	dataType: "json",
		     	success: self._showResults.bind(self)

		    });
		}
	});
}

Search.prototype._showResults = function(dataFromServer){
	var self = this;
	this._productsArray = dataFromServer;
	this._promiseTemplate.then(function (datatemplate){
		self._template = datatemplate;
		var dataObject = {};
		if (self._productsArray) {
			for(var i = 0; i < self._productsArray.length; i++){
			   self._productsArray[i]['image'] = JSON.parse(self._productsArray[i]['images'])[0] ? JSON.parse(self._productsArray[i]['images'])[0]["small"] : '';
			   if (self._productsArray[i]['availability'] && +self._productsArray[i]['availability'] === 1) {
			       self._productsArray[i]['availability'] = true;
			   }else {
			       self._productsArray[i]['availability'] = false;
			   }
			}
		    dataObject['products'] = self._productsArray;
		}else {
			dataObject['products'] = false;
		}
		self._routerOutlet.innerHTML = self._newHandlebars(self._template, dataObject);
		self._addListenerToProduct();
	});
}


Search.prototype._addListenerToProduct = function(){
	var self = this;
	this._searchPageDiv = document.querySelector('#searchPageWrap');
	this._searchPageDiv.onclick = function (event) {		
		if (event.target.classList.contains('buttonBuy')) {
			var id = event.target.getAttribute('data');
			basket.addElementToBasket(id);
		}
	}
}