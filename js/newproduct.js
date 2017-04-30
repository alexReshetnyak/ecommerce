function NewProduct (routerOutlet, newHandlebars) {
	this._newHandlebars = newHandlebars;
	this._routerOutlet = routerOutlet;
	this._template;
	this._section;
	this._category;
	this._inputAddNameProduct;
	this._inputNumberOfImages;
	this._inputAddPriceProduct;
	this._inputAddAvailabilityProduct;
	this._inputNumberOfTitleSpecification;
	this._textareaAddDescription;
	this._formImages;
	this._divWrapForSpecification;
	this._productName;
	this._imagesPath;
	this._productPrice;
	this.__productImage;
	this.__productDescription;
	this.__productSpecification;
	this.__productAvailability;
	this._promiseTemplate = $.ajax({
							type: "POST",
							url: "/templates/newproduct.html"
						   });
}

NewProduct.prototype.render = function(section, category){
	window.scrollTo(0,0);
	var self = this;
	this._section = section;
	this._category = category;
	this._promiseTemplate.then(function (datatemplate) {
		self._template = datatemplate;
		var dataObject = {};
		self._routerOutlet.innerHTML = self._newHandlebars(self._template, dataObject);
		self._addListeners();
	});
};

NewProduct.prototype._addListeners = function (){
	this._inputAddNameProduct = this._routerOutlet.querySelector('.inputName');
	this._inputNumberOfImages = this._routerOutlet.querySelector('.inputCountImages');
	this._inputAddPriceProduct = this._routerOutlet.querySelector('.inputPrice');
	this._inputAddAvailabilityProduct = this._routerOutlet.querySelector('.inputAvailability');
	this._inputNumberOfTitleSpecification = this._routerOutlet.querySelector('.inputCountOfTitleSpecification');
	this._textareaAddDescription = this._routerOutlet.querySelector('.textareaDescription');

	this._countImagesButton = this._routerOutlet.querySelector('.inputButtonImages');
	this._countTitleSpecificationButton = this._routerOutlet.querySelector('.inputButtonCountOfTitleSpecification');
	this._addNewProductButton = this._routerOutlet.querySelector('.addNewProductButton');
	this._formImages = this._routerOutlet.querySelector('.formImagesWrap');
	this._divWrapForSpecification = this._routerOutlet.querySelector('.formsSoecificationWrap');

	this._countImagesButton.addEventListener('click', this._addImages.bind(this));
	this._countTitleSpecificationButton.addEventListener('click', this._addSpecification.bind(this));
	this._addNewProductButton.addEventListener('click', this._addNewProduct.bind(this));
}

NewProduct.prototype._addImages = function(event){
	var countImages = this._inputNumberOfImages.value;
	var templateInputImages = "";
	for (var i = 0; i < +countImages; i++) {
		templateInputImages += '<input type="file" class="inputImage" accept="image/*"><span>Маленькое изображение' + (1 + i) + '</span><input type="file" class="inputImage" accept="image/*"><span>Большое изображение ' + (1 + i) + '</span>';
	}
	this._formImages.innerHTML = templateInputImages;
}

NewProduct.prototype._addSpecification = function(event){
	var self = this;
	var countTitleSpecification = +this._inputNumberOfTitleSpecification.value;
	var templateTitleSpecification = "";
	for (var i = 0; i < countTitleSpecification; i++) {
		templateTitleSpecification += '<input type="text" class="inputCountTitle" placeholder="количество свойств вкатегории ' + (1 + i) + '">';
	}
	templateTitleSpecification += '<div class = "btn btn-success countOptionsButton">Выбрать</div>';
	this._divWrapForSpecification.innerHTML = templateTitleSpecification;

	this._divWrapForSpecification.onclick =  function(event){
		if (event.target.classList.contains('countOptionsButton')) {
			var templateSpecification = '';
		    var allInput = self._divWrapForSpecification.querySelectorAll('.inputCountTitle');
		    for(var i = 0; i < allInput.length; i++){
		    	var count = +allInput[i].value;
		    	templateSpecification += '<div class="specificationBlock"><input type="text" class="inputTitleSpecification" placeholder="Название категории ' + (1 + i) + '"><div></div>';
		    	for (var j = 0; j < count; j++) {
		    		templateSpecification += '<input type="text" class="inputSpecificationName" placeholder="Название свойства ' + (1 + i) + '"><input type="text" class="inputSpecificationCount" placeholder="Значение свойства ' + (1 + i) + '">';
		    	}
		    	templateSpecification += '</div>';
		    }
		    self._divWrapForSpecification.innerHTML = templateSpecification;
		}
	}
}

NewProduct.prototype._addNewProduct = function(event){
	this._productName = this._inputAddNameProduct.value;
	this._productPrice = this._inputAddPriceProduct.value;
	this._productAvailability = this._inputAddAvailabilityProduct.value;
	this._productDescription =  this._textareaAddDescription.value;
	this._productSpecification = [];

	var specificationDivs = this._divWrapForSpecification.querySelectorAll('.specificationBlock');
	if (specificationDivs) {
		for (var i = 0; i < specificationDivs.length; i++) {
	    	var obj = {};
	    	var titleInput = specificationDivs[i].querySelector('.inputTitleSpecification');
	    	var specificationNameInputs = specificationDivs[i].querySelectorAll('.inputSpecificationName');
	    	var specificationCountInputs = specificationDivs[i].querySelectorAll('.inputSpecificationCount');
	    	
	    	var description = [];
	    	if (specificationNameInputs.length === specificationCountInputs.length) {
	    		for (var j= 0; j < specificationNameInputs.length; j++) {
	    			var specificationObj = {};
	    			specificationObj.name = specificationNameInputs[j].value;
	    			specificationObj.value = specificationCountInputs[j].value;
	    			description.push(specificationObj);
	    		}
	    	}else {
	    		console.log('input specification error');
	    	}
	    	obj.name = titleInput.value;
	    	obj.description = description;
	    	this._productSpecification.push(obj);
	    }
	}else{
		this._productSpecification = "";
	}	
	this._saveImagesOnServer();
}

NewProduct.prototype._saveImagesOnServer = function(){

    var imageArray = this._formImages.querySelectorAll('.inputImage');
	var data = new FormData();
	for (var i = 0; i < imageArray.length; i++) {
		var image = imageArray[i].files[0];
		data.append('image' + i, image);
	}
	
	$.ajax({
        url: "/php/controller.php",
        type: 'POST',
        data: data,
        cache: false,
        dataType: 'json',
        processData: false, // Не обрабатываем файлы 
        contentType: false, //jQuery скажет серверу что это строковой запрос
        success: this._saveNewProduct.bind(this)
    });
}

NewProduct.prototype._saveNewProduct = function(imagesPath){
	this._productImage = [];
	if (imagesPath){
		this._imagesPath = imagesPath.imagesPath;
		for (var i = 0; i < this._imagesPath.length; i = i + 2) {
	    	var obj = {};
	    	var re = /^.*\/goods\//gi;
	    	if (this._imagesPath[i]) {
	    		var linkSmall = this._imagesPath[i].replace(re, "/img/mysql/goods/");
	    		obj.small = linkSmall;
	    	}
	    	if (this._imagesPath[i+1]){
	    		var linkBig = this._imagesPath[i+1].replace(re, "/img/mysql/goods/");
	    		obj.big = linkBig;
	    	}
	    	this._productImage.push(obj);
	    }
	}else{
		this._imagesPath = null;
		this._productImage = "";
	}

    this._productImage = JSON.stringify(this._productImage) || "";
    this._productSpecification = JSON.stringify(this._productSpecification) || "";

	$.ajax({
		 	type: "POST",
		 	url: "/php/controller.php",
		 	data: ({"task": "addnewproduct",
		 	        "menucategory": this._section,
		 	        "goodscategory": this._category,
		 	        "price": this._productPrice,
		 	        "views": 0,
		 	        "images": this._productImage,
		 	        "productdescription": this._productDescription,
		 	        "specifications": this._productSpecification,
		 	        "availability": this._productAvailability,
		 	        "name": this._productName
		 	    }),
		 	dataType: "json",
		 	success: this._showMessage.bind(this)
		   });
}

NewProduct.prototype._showMessage = function(dataFromServer){
	if (dataFromServer){
		var messageDivWrap = $('.productInBasketWrap');
		var messageDiv = $('.productInBasket');
		messageDiv.html('Товар успешно добавлен');
		messageDivWrap.fadeIn(500, function(){
			setTimeout(function() {
				messageDivWrap.fadeOut(500, function () {
					messageDiv.html('Товар добавлен в корзину!');
					window.location = 'http://ecommercewebsite.site11.com/#adminpanel/1';
					window.location = 'http://ecommercewebsite.site11.com/#adminpanel';
				});
			}, 1000);
		});
	}else{
		console.log('ошибка при добавлении товара');
	}
}

window.app = window.app || {};
window.app.NewProduct = window.app.NewProduct || NewProduct;