import {basket} from './index.js';

export default function Product (routerOutlet, newHandlebars) {

	this._newHandlebars = newHandlebars;
	this._routerOutlet = routerOutlet;	
	this._dataFromServer;
	this._productArray = [];    
    this._template;
    self._dataObject;
    this._activeImage = 0;
    this._imageSmallWrap;
    this._imageMiddleDiv;
    this._imageSmallWrapInBig;
	this._imagesSmallInBig;
	this._imageBigDiv;
	this._bigImageBlock;
	this._productPageWrapDiv;
    this._promiseTemplate;
}

Product.prototype.render = function(type, id){

	window.scrollTo(0,0);
	this._promiseTemplate = $.ajax({
							type: "POST",
							url: "/templates/product.html"
						   });
	this._getElementFromServer(id);
}

Product.prototype._getElementFromServer = function(id){
	$.ajax({
		 	type: "POST",
		 	url: "/php/controller.php",
		 	data: ({"task": "product", "id": id}),
		 	dataType: "json",
		 	success: this._renderProduct.bind(this)
		   });
}

Product.prototype._renderProduct = function(dataFromServer){

	this._dataFromServer = dataFromServer;
	var self = this;
	this._promiseTemplate.then(function (datateplate) {

		self._template = datateplate;
		self._dataObject = {
			id: self._dataFromServer.id || '',
			name: self._dataFromServer.name || '',
			price: self._dataFromServer.price || '',
			description: self._dataFromServer.productdescription || '',
			images: JSON.parse(self._dataFromServer.images),
			imagesMiddleFirst: JSON.parse(self._dataFromServer.images)[0]? JSON.parse(self._dataFromServer.images)[0]['small'] : '',
			imagesBigFirst: JSON.parse(self._dataFromServer.images)[0] ? JSON.parse(self._dataFromServer.images)[0]['big'] : '',
			specifications: JSON.parse(self._dataFromServer.specifications) || ''
	    }
	    self._dataObject.availability = (function(){
	    	if (self._dataFromServer.availability == 1) {
	    		return true;
	    	}else{
	    		return false;
	    	}
	    })();
	    self._routerOutlet.innerHTML = self._newHandlebars(self._template, self._dataObject);
	    self._addListenerToProduct();
	    self._changeImageMiddle();
	    self._addViews();
	});
}

Product.prototype._addListenerToProduct = function(){

	this._productPageWrapDiv = this._routerOutlet.querySelector('#productPageWrap');
    this._productPageWrapDiv.onclick = function (event) {
		if (event.target.classList.contains('productBuy') || event.target.classList.contains('productBigImageBuy')){
			var id = event.target.getAttribute('data');
			basket.addElementToBasket(id);
		}
	}
}

Product.prototype._changeImageMiddle = function(){
	 this._imageSmallWrap = document.querySelector('.imageSmallWrap');
	 this._imagesSmall = document.querySelectorAll('.imageSmallWrap div');
	 this._imageMiddleDiv = document.querySelector('.imageMiddle');
	 this._activeImage = 0;
	 if (this._imagesSmall[this._activeImage]) this._imagesSmall[this._activeImage].classList.add('imageSmallActive');

	 var self = this;
	 this._imageSmallWrap.addEventListener('click', function(eventO){
	 	if (eventO.target.classList.contains('imageSmall')) {
	 	    for (var i = 0; i < self._imagesSmall.length; i++) {
	 	    	self._imagesSmall[i].classList.remove('imageSmallActive');
	 	    	if(self._imagesSmall[i] === eventO.target){
	 	    		self._activeImage = i;
	 	    		self._imageMiddleDiv.setAttribute('data', i);
	 	    	}
	 	    }
	 	    eventO.target.classList.add('imageSmallActive');
	 	    self._imageMiddleDiv.style.backgroundImage = "url(" + self._dataObject.images[self._activeImage]["small"] + ")";
	 	}
	 });

	 this._imageMiddleDiv.addEventListener('click', function(eventO){
	 	self._activeImage = self._imageMiddleDiv.getAttribute('data');
	 	self._renderBigImage();
	 });
}


Product.prototype._renderBigImage = function(){
	this._imageSmallWrapInBig = document.querySelector('.bigImageSmallWrap');
	this._imagesSmallInBig = document.querySelectorAll('.bigImageSmallWrap div');
	this._imageBigDiv = document.querySelector('.productBigImage');
	this._bigImageBlock = document.querySelector('.productBigImageBlock');
	this._imagesSmallInBig[this._activeImage].classList.add('bigImageSmallActive');

	var self = this;
	 this._imageSmallWrapInBig.addEventListener('click', function(eventO){
	 	if (eventO.target.classList.contains('bigImageSmall')) {
	 	    for (var i = 0; i < self._imagesSmallInBig.length; i++) {
	 	    	self._imagesSmallInBig[i].classList.remove('bigImageSmallActive');
	 	    	if(self._imagesSmallInBig[i] === eventO.target){
	 	    		self._activeImage = i;
	 	    		eventO.target.classList.add('bigImageSmallActive');
	 	    	}
	 	    }	 	    
	 	    self._imageBigDiv.style.backgroundImage = "url(" + self._dataObject.images[self._activeImage]["big"] + ")";
	 	}
	 });

	 this._imageBigDiv.style.backgroundImage = "url(" + self._dataObject.images[self._activeImage]["big"] + ")";

	 $('.productBigImageBlock').fadeIn(300, function(){

	 	self._bigImageBlock.addEventListener('click', function(eventO){

	 		if (eventO.target.classList.contains('productBigImageBlock') || eventO.target.classList.contains('productBigImageExit')) {

	 			$('.productBigImageBlock').fadeOut(300);
	            self._imagesSmallInBig[self._activeImage].classList.remove('bigImageSmallActive');

	 		}
	 	});
	});
}

Product.prototype._addViews = function(){

	var id = this._dataFromServer.id;
	var views = +this._dataFromServer.views + 1;
	$.ajax({
		 	type: "POST",
		 	url: "/php/controller.php",
		 	data: ({"task": "changeField", "id": id, "field": "views", "count": views}),
		 	dataType: "json",
		 	success: function(data){if (!data) console.log(data, 'ошибка при добалении просмотров')}
		   });
}