import {basket} from './index.js';

export default function HomePage (routerOutlet, newHandlebars) {

	this._newHandlebars = newHandlebars;
	this._routerOutlet = routerOutlet;
	this._dataFromServer = [];
    this._promiseTemplate;   
}

HomePage.prototype.render = function(){

	window.scrollTo(0,0);
	this._promiseTemplate = $.ajax({
							type: "POST",
							url: "/templates/homepage.html"
						   }); 
	this._getElementFromServer('views');
	this._getElementFromServer('auto');

}

HomePage.prototype._getElementFromServer = function(sort){

	var self = this;
	self._dataFromServer.length  = 0;

	$.ajax({
		 	type: "POST",
		 	url: "/php/controller.php",
		 	data: ({"task": "goodsForSlider", "sort": sort}),
		 	dataType: "json",

		 	success: function (dataFromServer) {

		 		self._dataFromServer.push({
		 			'sort': sort,
		 			data: dataFromServer
		 		});

		 		if (self._dataFromServer.length === 2) {
		 			self._renderProduct();
		 		}
		 	}
		});
};

HomePage.prototype._renderProduct = function(){

	var self = this;
	var dataSlider1;
	var dataSlider2;

	for(var i = 0; i < this._dataFromServer.length; i++){
		if (this._dataFromServer[i]['sort'] &&  this._dataFromServer[i]['sort'] === 'views') {
			dataSlider1 = this._createDataTemplateSlider(this._dataFromServer[i]);
		}else if (this._dataFromServer[i]['sort'] &&  this._dataFromServer[i]['sort'] === 'auto') {
			dataSlider2 = this._createDataTemplateSlider(this._dataFromServer[i]);
		}
	}

	this._promiseTemplate.then(function (datateplate) {

		self._template = datateplate;

		self._dataObject = {

			slider1: dataSlider1,
			slider2: dataSlider2

	    }

	    self._routerOutlet.innerHTML = self._newHandlebars(self._template, self._dataObject);
	    var slider1 = new HomePageSlider(4, document.querySelector('.homePageSlider1'));
	    var slider2 = new HomePageSlider(4, document.querySelector('.homePageSlider2'));
	    var sliders = document.querySelectorAll(".sliderSlide");

	});
}

HomePage.prototype._createDataTemplateSlider = function(data){

	var countSlids;
	var countProductOnSlide = 4;

	if(data['sort'] === 'views') countSlids = 4;
	if(data['sort'] === 'auto') countSlids = 4;

	var slidesArray = [];
	var counter = 0;

	for(var i = 0; i < countSlids; i++){

		var slide = [];

		for(var k = 0; k < countProductOnSlide; k++){

			if (data['data'][counter]['availability'] == 1) {

				data['data'][counter]['image'] = JSON.parse(data['data'][counter]['images'])[0]['small'];
				slide.push(data['data'][counter]); 

			}else{
				k--;
			}
			counter++;
		}
		slidesArray.push(slide);
	}
	return slidesArray;
}

function HomePageSlider(pages, sliderWrap){

	this._numberPages = pages;
	this._sliderWrap = sliderWrap;
	this._buttonLeft = this._sliderWrap.querySelector('.buttonLeftWrap>img');
	this._buttonRight = this._sliderWrap.querySelector('.buttonRightWrap>img');
	this._sliderDotsWrap = this._sliderWrap.querySelector('ul');
	this._sliderDots = this._sliderWrap.querySelectorAll('ul>li');
	this._slidsWrap = this._sliderWrap.querySelector('.slidsWrap');
	this._activeSlide = 1;
	this._activeSlider();

}

HomePageSlider.prototype._activeSlider = function(){

	var self = this;
	this._buttonLeft.addEventListener('click', function(event) {

		self._sliderDots[self._activeSlide - 1].classList.remove('active');
		for (var i = 1; i <= self._numberPages; i++) {

			if (self._activeSlide === i) {

				if (i === 1) {

					self._slidsWrap.style.transform = "translateX(-" + (self._numberPages-1)*487.3 + "px)";
			        self._activeSlide = self._numberPages;
			        break;

				}else{
					self._slidsWrap.style.transform = "translateX(-" + (i-2)*487.3 + "px)";
			        self._activeSlide = (i -  1);
			        break;
				}
		    }
		}
		self._sliderDots[self._activeSlide - 1].classList.add('active');
	});

	this._buttonRight.addEventListener('click', function(event) {

		self._sliderDots[self._activeSlide - 1].classList.remove('active');

		for (var i = 1; i <= self._numberPages; i++) {

			if (self._activeSlide === i) {

				if (i === self._numberPages) {

					self._slidsWrap.style.transform = "translateX(0px)";
			        self._activeSlide = 1;
			        break;

				}else{

					self._slidsWrap.style.transform = "translateX(-" + (self._activeSlide)*487.3 + "px)";
			        self._activeSlide = (1 + i);
			        break;

				}
		    }
		}
		self._sliderDots[self._activeSlide - 1].classList.add('active');
	});

	this._sliderDotsWrap.addEventListener('click', function(event) {

		if (event.target.tagName === 'LI') {

			self._sliderDots[self._activeSlide - 1].classList.remove('active');
			self._activeSlide = +event.target.getAttribute('data');
			self._slidsWrap.style.transform = "translateX(-" + (self._activeSlide - 1)*487.3 + "px)";
			self._sliderDots[self._activeSlide - 1].classList.add('active');
		}
	});

	this._sliderWrap.onclick = function (event){

		if (event.target.classList.contains('buttonBuy')) {

			event.preventDefault();
			var id = event.target.getAttribute('data');
			basket.addElementToBasket(id);
		}
	}
}