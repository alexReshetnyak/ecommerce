
function GoodsList(routerOutlet, newHandlebars){
	this._newHandlebars = newHandlebars;
	this._routerOutlet = routerOutlet;
	this._routerOutletGoods;
	this._dataFromServer;
	this.activePage = 1; 
	this._productsOnPage = 15;
	this._lastPage = false;
	this._loader = document.querySelector('#loaderImage');
    this._template;
    this._templateGoods;
    this._typeOfGoods;
    this._productsArray = [];
    this._realTimeArray = [];
    this._constProductsArray;
    this._minCost = 0;
	this._maxCost = 0;
	this._sortBlock;
	this._buyListener;
	this._arrowUp = $('#arrowUp');
    this._arrowStatus = false;
    this._promiseTemplate = $.ajax({
							type: "POST",
							url: "/templates/goodslist.html"
						   });
    this._promiseTemplateGoods = $.ajax({
							type: "POST",
							url: "/templates/productslist.html"
						   });
}

GoodsList.prototype.render = function(type){
	window.scrollTo(0,0);
	this._routerOutlet.innerHTML = '<div class="loadingDataFromServer"></div>';
	this._typeOfGoods = type;
    this._renderObject();
}

GoodsList.prototype._renderObject = function(){

	var self = this;
	this._promiseTemplate.then(function (datateplate) {

		self._template = datateplate;

		var header;
		switch (self._typeOfGoods) {
			case 'cushionedfurniture':
				header = "Мягкая мебель";
				break;
			case 'mattresses':
				header = "Матрасы";
				break;
			case 'cabinets':
				header = "Шкафы-купе";
				break;
			case 'dishes':
				header = "Посуда и кухонные принадлежности";
				break;
			case 'householdGoods':
				header = "Хозяйственные товары";
				break;
			case 'bathroom':
				header = "Товары для ванной";
				break;
			case 'phones':
				header = "Телефоны";
				break;
			case 'computers':
				header = "Ноутбуки и компьютеры";
				break;
			case 'photo':
				header = "Фото и видео";
				break;
			case 'woomens':
				header = "Женская одежда";
				break;
			case 'mens':
				header = "Мужская одежда";
				break;
			case 'forchild':
				header = "Детская одежда";
				break;
			case 'small':
				header = "Мелкая бытовая техника";
				break;
			case 'fridges':
				header = "Холодильники";
				break;
			case 'microwaves':
				header = "Микроволновые печи";
				break;
			case 'tyres':
				header = "Шины";
				break;
			case 'electronics':
				header = "Автомобильная электроника";
				break;
			case 'tools':
				header = "Автомобильные инструменты";
				break;
			case 'bicycles':
				header = "Велосипеды";
				break;
			case 'scooters':
				header = "Самокаты";
				break;
			case 'rollers':
				header = "Ролики";
				break;
			case 'prams':
				header = "Коляски и автокресла";
				break;	
			case 'construction':
				header = "Конструкторы";
				break;	
			case 'formom':
				header = "Для мам и беременных";
				break;	
			case 'gardenEquipment':
				header = "Садовая техника";
				break;	
			case 'gardenTools':
				header = "Садовый инвентарь";
				break;	
			case 'plants':
				header = "Уход за растениями";
				break;	
			default:
				break;
		}
		var dataObject = {
 		    header: header
	    }
	    self._routerOutlet.innerHTML = self._newHandlebars(self._template, dataObject);
	    self._routerOutletGoods = document.querySelector('#productsList');
	    self._routerOutletGoods.innerHTML = '<div class="loadingDataFromServer"></div>';
	    self._sortBlock = new SortBlock();
	    self._getElementsFromServer(self._typeOfGoods, self._sortBlock._buttonActive);
	});
}

GoodsList.prototype._getElementsFromServer = function(type, sortInfo){
	$.ajax({
		 	type: "POST",
		 	url: "/php/controller.php",
		 	data: ({"task": "goods", "type": type, "sort": sortInfo}),
		 	dataType: "json",
		 	success: this._renderProducts.bind(this)
		   });
}

GoodsList.prototype._renderProducts = function(dataFromServer){
	var self = this;
    this.activePage = 1;
    this._lastPage = false;
	this._dataFromServer = dataFromServer || [];

	this._promiseTemplateGoods.then(function(datatemplateGoods){
			self._templateGoods = datatemplateGoods;
			self._productsArray.length = 0;
	        for (var i = 0; i < self._dataFromServer.length; i++) {

	        	var product = new ProductFromList(self._dataFromServer[i]);
	        	if (i === 0) {
	        		self._minCost = +product.price;
	        		self._maxCost = +product.price;
	        	}
	        	if (self._minCost > +product.price) {
	        		self._minCost = +product.price;
	        	}
	        	if (self._maxCost < +product.price) {
	        		self._maxCost = +product.price;
	        	}
	        	self._productsArray.push(product);
	        }

	        self._startSlider();
            self._constProductsArray = self._productsArray;
	        self._realTimeArray = self._getProductsOnThisPage(self.activePage, self._productsArray);

	        var dataObject = {
 		        products:  self._realTimeArray
	        }
	        
	        self._routerOutletGoods.innerHTML = "";
	        var divForGoods = document.createElement('div');
	        divForGoods.innerHTML = self._newHandlebars(self._templateGoods, dataObject);
	        self._routerOutletGoods.appendChild(divForGoods);
	        self._addListenerToList();
		});
}

GoodsList.prototype._getProductsOnThisPage = function(activePage, productsArray){
	var productsOnThisPage = [];
	var counter = 0;
	if (productsArray.length > ((activePage - 1)*this._productsOnPage)) {
		for(var i = ((activePage - 1)*this._productsOnPage); i < productsArray.length; i++){
			if(productsOnThisPage.length < this._productsOnPage) {
			 	productsOnThisPage[counter] = productsArray[i];
	            counter++;
			}else{
				break;
			}
	    }
	}else{
		console.log('No more pages');
		this._lastPage = true;
	}
	return productsOnThisPage;
}

GoodsList.prototype._addListenerToList = function(){
	var self = this;

    this._routerOutletGoods.onclick = function (event) {
		if (event.target.classList.contains('buy')){
			event.preventDefault();
			var id = event.target.getAttribute('data');
			window.app.basket.addElementToBasket(id);
		}
	}

	window.onscroll = function() {
        var scrolled = window.pageYOffset || document.documentElement.scrollTop;
        var realHeight = scrolled + document.documentElement.clientHeight;
        var heightToLastProduct = 470 + (self.activePage*self._productsOnPage/3)*370;
        var productsOnThisPage;
        if (realHeight > heightToLastProduct) {
        	if (!self._lastPage) {
        		self._loader.style.display = 'block';
        		self.activePage++;
                productsOnThisPage =  self._getProductsOnThisPage(self.activePage, self._productsArray);
                var divForGoods = document.createElement('div');
                var dataObject = {
 		            products:  productsOnThisPage
	            }
	            divForGoods.innerHTML = self._newHandlebars(self._templateGoods, dataObject);
	            setTimeout(function () {
	            	self._loader.style.display = 'none';
	            	self._routerOutletGoods.appendChild(divForGoods);
	            }, 500);    
        	}
        }
        if (scrolled > 500 && !self._arrowStatus) {
        	self._arrowStatus = true;
        	self._arrowUp.fadeIn(500, function() {
        	});
        }else if (scrolled < 500 && self._arrowStatus){
        	self._arrowStatus = false;
        	self._arrowUp.fadeOut(500, function() {
        	});
        }
    }
    this._arrowUp.click( function() {
	    $("html, body").animate({scrollTop:$('body').position().top}, 800);
    });
}


GoodsList.prototype._startSlider = function(){
	
	var sliderInputMax = document.querySelector("#maxCost");
	var sliderInputMin = document.querySelector("#minCost");
	sliderInputMax.value = this._maxCost;
	sliderInputMin.value = this._minCost;
	var self = this;
	//--------RangeSLIDER----------------------------------------------------------------------------
        $("#rangeslider").slider({
            min: 0,
            max: this._maxCost,
            values: [this._minCost, this._maxCost],
            range: true,
            stop: function(event, ui) {
            	var value1 = $("#rangeslider").slider("values",0);
            	var value2 = $("#rangeslider").slider("values",1);
                $("input#minCost").val(value1);
                $("input#maxCost").val(value2);
                self._renderWithNewOptions("rangePrice", value1, value2);
            },
            slide: function(event, ui){
                $("input#minCost").val($("#rangeslider").slider("values",0));
                $("input#maxCost").val($("#rangeslider").slider("values",1));
            }
        });
    
        $("input#minCost").change(function(){
            var value1=$("input#minCost").val();
            var value2=$("input#maxCost").val();

            if(isNaN((+value1) + (+value2))) {
            	value1 = self._minCost;
            	$("input#minCost").val(self._minCost);
            }
        
            if(parseInt(value1) > parseInt(value2)){
                value1 = value2;
                $("input#minCost").val(value1);
            }
            self._renderWithNewOptions("rangePrice", value1, value2);
            $("#rangeslider").slider("values",0,value1);    
        });
              
        $("input#maxCost").change(function(){
            var value1=$("input#minCost").val();
            var value2=$("input#maxCost").val();

            if(isNaN((+value1) + (+value2))) {
            	value2 = this._maxCost;
            	$("input#maxCost").val(this._maxCost);
            }
            
            if (value2 > this._maxCost) { value2 = this._maxCost; $("input#maxCost").val(this._maxCost)}
        
            if(parseInt(value1) > parseInt(value2)){
                value2 = value1;
                $("input#maxCost").val(value2);
            }
            self._renderWithNewOptions("rangePrice", value1, value2);
            $("#rangeslider").slider("values",1,value2);
        });

        var sliderWrap = document.querySelector("#rangeSliderWrap");
	    sliderWrap.style.visibility = "visible";
        //-----------------------------------------------------------------------------------------------
}

GoodsList.prototype._renderWithNewOptions = function(){
	
	var productsSortArray = [];
	
	if (arguments[0] === 'rangePrice') {
		var minValue = arguments[1];
		var maxValue = arguments[2];
		this._productsArray = this._constProductsArray;

		for (var i = 0; i < this._productsArray.length; i++) {
			if (this._productsArray[i].price >= +minValue && this._productsArray[i].price <= +maxValue ) {
				productsSortArray.push(this._productsArray[i]);
			}
		}

		this.activePage = 1;
		this._lastPage = false;
		this._productsArray = productsSortArray;
		this._realTimeArray = this._getProductsOnThisPage(this.activePage, this._productsArray);
		var dataObject = {
 		    products: this._realTimeArray
	    }
	    this._routerOutletGoods.innerHTML = this._newHandlebars(this._templateGoods, dataObject);	
	}
}

function ProductFromList(dataFromServer){
	this.id = dataFromServer.id || '';
	this.price = dataFromServer.price || '';
	this.name = dataFromServer.name || '';
	this.image = JSON.parse(dataFromServer.images)[0] ? JSON.parse(dataFromServer.images)[0]["small"] : '';
	this.menucategory = dataFromServer.menucategory || "";
	this.goodscategory = dataFromServer.goodscategory || "";
	this.availability = (function(dataFromServer){
		if (dataFromServer.availability == 1) {
			return true;
		}else{
			return false;
		}
	})(dataFromServer);
}

function SortBlock() {
	this._sortBlock = document.querySelector('#sortBlock');
	this._buttonAuto = document.querySelector('#sortAuto');
	this._buttonAuto.classList.add('chekedSortButton');
	this._buttonActive = "auto";
	this._addListener();
}

SortBlock.prototype._addListener = function(){
	var self = this;
    this._sortBlock.addEventListener('click', function(eventO){

		if (eventO.target.id === 'sortBlock'){
			return;
		}

		var activeButtons = document.querySelectorAll(".chekedSortButton");
		for (var i = 0; i < activeButtons.length; i++) {
		    activeButtons[i].classList.remove('chekedSortButton');
	    }

	    eventO.target.classList.add('chekedSortButton');

		if(eventO.target.id === 'sortAuto'){
			self._buttonActive = 'auto';
		}else if (eventO.target.id === 'sortViews') {
			self._buttonActive = 'views';
		}else if (eventO.target.id === 'sortPriceUp') {
			self._buttonActive = 'priceUp';
		}else if (eventO.target.id === 'sortPriceDown') {
			self._buttonActive = 'priceDown';
		}
		window.app.goodsList.activePage = 1;
		window.app.goodsList._productsArray.length = 0;
		window.app.goodsList._getElementsFromServer(window.app.goodsList._typeOfGoods, self._buttonActive);
	});
}

 window.app = window.app || {};
 window.app.GoodsList = window.app.GoodsList || GoodsList;