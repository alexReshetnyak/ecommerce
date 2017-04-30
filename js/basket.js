function Basket(routerOutlet, newHandlebars){
	this._newHandlebars = newHandlebars;
	this._routerOutlet = routerOutlet;
	this._dataFromServer;
	this._template;
	this._productsDiv;
	this._basketCountOfProductsDiv = document.querySelector('#basketCountOfProducts');
	this.goodsInBasketArray = this.getElementsFromStorage();
	this._promiseTemplate = $.ajax({
							type: "POST",
							url: "/templates/basket.html"
						   });
	if (this.goodsInBasketArray.length > 0) {
		this._basketCountOfProductsDiv.innerHTML = this.goodsInBasketArray.length;
	    this._basketCountOfProductsDiv.style.display = "block";
	}
}

Basket.prototype.render = function(){
	window.scrollTo(0,0);
	this._getGoodsFromServer();
};

Basket.prototype._getGoodsFromServer = function(){
	this.goodsInBasketArray = this.getElementsFromStorage();
	if (this.goodsInBasketArray) {
		$.ajax({
		 	type: "POST",
		 	url: "/php/controller.php",
		 	data: ({"task": "basket", "arrayWithId": JSON.stringify(this.goodsInBasketArray)}),
		 	dataType: "json",
		 	success: this._renderBasket.bind(this)
		    });
	}else{
		this._renderBasket(false);
	}
};

Basket.prototype.getElementsFromStorage = function(){

	if(window['localStorage']){
		
		var response = JSON.parse(localStorage.getItem('goodsInBasket'));
		if (response === null || response.length === 0 ) {
			return [];
		}else{
			return response;
		}
		
	}else{
		console.log('LocalStorage is absent');
	}
};

Basket.prototype.setElementsInStorage = function(elementsArray){
	if(window['localStorage']){
		localStorage.setItem('goodsInBasket', JSON.stringify(elementsArray));
		if (elementsArray.length > 0){
			this._basketCountOfProductsDiv.innerHTML = elementsArray.length;
	        this._basketCountOfProductsDiv.style.display = "block";
		}else {
			this._basketCountOfProductsDiv.innerHTML = elementsArray.length;
	        this._basketCountOfProductsDiv.style.display = "none";
		}
	}else{
		console.log('LocalStorage is absent');
	}
}

Basket.prototype._renderBasket = function(dataFromServer){

	this._dataFromServer = dataFromServer;
	var products = [];
	var self = this;

	this._promiseTemplate.then(function (datateplate) {

		self._template = datateplate;

		if(!self._dataFromServer){
		    console.log('на сервере нет таких товаров');
		    self._dataObject = {};
	    }else{
	    	for (var i = 0; i < self._dataFromServer.length; i++) {
	    		var product = {
	    			id: self._dataFromServer[i]['id'],
	    			menucategory: self._dataFromServer[i]['menucategory'],
	    			goodscategory: self._dataFromServer[i]['goodscategory'],
	    			name: self._dataFromServer[i]['name'],
	    			image: JSON.parse(self._dataFromServer[i]['images'])[0]['small'],
	    			price: self._dataFromServer[i]['price']
	    		}
	    		if (self._dataFromServer[i]['availability'] == 1) {
	    			product['availability'] = true;
	    		}else{
	    			product['availability'] = false;
	    		}
	    		products[i] = product;
	    	}

	    	self._dataObject = {
			    products: products
		    };
	    }
	    self._routerOutlet.innerHTML = self._newHandlebars(self._template, self._dataObject);
	    self._addLogicToBasket();
	});
}

Basket.prototype._addLogicToBasket = function(){
	if(this.goodsInBasketArray.length && this.goodsInBasketArray.length > 0){
		this._productsDiv = document.querySelector('.products');
		this._productsDiv.style.display = "block";
		this._basketCountOfProductsDiv.innerHTML = this.goodsInBasketArray.length;
		this._basketCountOfProductsDiv.style.display = 'block';

		var totalPriceDiv = this._productsDiv.querySelector('.price');
		var totalPrice = 0;
		for (var i = 0; i < this._dataFromServer.length; i++) {
			totalPrice += +this._dataFromServer[i]['price'];
		}
		totalPriceDiv.innerHTML = totalPrice;

		var self = this;
		this._productsDiv.onclick = function (event) {
			if (event.target.classList.contains('productDelete')) {
				var data = event.target.getAttribute('data');
				self._deleteProductFromBasket(data);
			}
		}

	}else{
		this._basketCountOfProductsDiv.style.display = 'none';
		this._emptyBusketDiv =  document.querySelector('.emptyBusket');
		this._emptyBusketDiv.style.display = "block";
	}
}

Basket.prototype._deleteProductFromBasket = function(id){
	for (var i = 0; i < this._dataFromServer.length; i++) {
		if(+this._dataFromServer[i].id === +id){
			this._dataFromServer.splice(i, 1);
			break;
		}
	}
	for (var i = 0; i < this.goodsInBasketArray.length; i++) {
		if (+this.goodsInBasketArray[i] === +id) {
			this.goodsInBasketArray.splice(i, 1);
			break;
		}
	}

	this.setElementsInStorage(this.goodsInBasketArray);
	this._renderBasket(this._dataFromServer);	
};

Basket.prototype.addElementToBasket = function(id){
	$('.productInBasketWrap').fadeIn(500, function() {
		setTimeout(function () {
			$('.productInBasketWrap').fadeOut(500);
		}, 1500);
	});
	this.goodsInBasketArray.push(id);
	this.setElementsInStorage(this.goodsInBasketArray);
	this._basketCountOfProductsDiv.innerHTML = this.goodsInBasketArray.length;
	this._basketCountOfProductsDiv.style.display = "block";
};

 window.app = window.app || {};
 window.app.Basket = window.app.Basket || Basket;