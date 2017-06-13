import NewProduct from './newproduct.js';

export default function AdminPanel (routerOutlet, newHandlebars) {
	this._newHandlebars = newHandlebars;
	this._routerOutlet = routerOutlet;
	this._template;
	this._templateSelectCategory;
	this._templateGoods;

	this._selectCategoryDiv;
	this._goodsListDiv;
	
	this._selectButtonSection;
	this._selectButtonCategory;
	this._adminAddNewProductBtn;

	this._activeSection;
	this._activeCategory;

	this._promiseTemplate;
	this._promiseTemplateCategory;
	this._promiseTemplateGoodsList;
}



AdminPanel.prototype.render = function(){

	window.scrollTo(0,0);
	this._promiseTemplate = $.ajax({
							type: "POST",
							url: "/templates/adminpanel.html"
						   });

	this._promiseTemplateCategory = $.ajax({
							type: "POST",
							url: "/templates/selectcategory.html"
						   });
	this._promiseTemplateGoodsList = $.ajax({
							type: "POST",
							url: "/templates/adminpanelgoods.html"
						   });

	function getCookie(name) {
        var matches = document.cookie.match(new RegExp(
          "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }
    var login = getCookie('userName');
    var password = getCookie('userPassword');
    if (login && password) {
    	$.ajax({
		 	type: "POST",
		 	url: "/php/controller.php",
		 	data: ({"task": "checkuser", "login": login, "password": password}),
		 	dataType: "json",
		 	success: this._renderAdminPanel.bind(this)
		   });
    }else{
    	document.location = "http://ecommerce.ho.ua//#login";
    }
}

AdminPanel.prototype._renderAdminPanel = function(data){

	var self = this;

	if(data === 'admin'){

		this._promiseTemplate.then(function (datatemplate){
			self._template = datatemplate;

			self._promiseTemplateCategory.then(function (datatemplate) {
				self._templateSelectCategory = datatemplate;

				self._promiseTemplateGoodsList.then(function (datatemplate) {
				    self._templateGoods = datatemplate;
			        self._getSections();
			    });
			});	
		});
	}else{
		document.location = "http://ecommerce.ho.ua//#login";
	}

}



AdminPanel.prototype._getSections = function(){

	$.ajax({
		 	type: "POST",
		 	url: "/php/controller.php",
		 	data: ({"task": "menu"}),
		 	dataType: "json",
		 	success: this._getCategory.bind(this)
		   });
};



AdminPanel.prototype._getCategory = function(dataFromServer){

	this._selectSections = dataFromServer;
	var self = this;

	var dataObject = {
		sections: this._selectSections
	};

	this._routerOutlet.innerHTML = this._newHandlebars(this._template, dataObject);
	this._selectCategoryDiv = this._routerOutlet.querySelector('.selectCategory');
	this._goodsListDiv = this._routerOutlet.querySelector('.adminPanelGoods');
	this._selectButtonSection = this._routerOutlet.querySelector('#selectSectionButton');
	this._selectSection = this._routerOutlet.querySelector('#selectSection');

	this._selectButtonSection.addEventListener('click', function (event) {
		self._activeSection = document.forms.selectSection.elements.selectSection.value;

		$.ajax({
		 	type: "POST",
		 	url: "/php/controller.php",
		 	data: ({"task": "menuelement", "type": self._activeSection}),
		 	dataType: "json",
		 	success: self._getGoods.bind(self)
		});
	});	
}


AdminPanel.prototype._getGoods = function(dataFromServer){

	this._selectCategories = dataFromServer;
	var self = this;

	var dataObject = {
		categories: this._selectCategories
	};

	this._selectCategoryDiv.innerHTML = this._newHandlebars(this._templateSelectCategory, dataObject);
	this._selectButtonCategory = this._routerOutlet.querySelector('#selectCategoryButton');
	this._selectCategory = this._routerOutlet.querySelector('#selectCategory');

	this._selectButtonCategory.addEventListener('click', function (event) {
		self._activeCategory = document.forms.selectCategory.elements.selectCategory.value;
		$.ajax({
		 	type: "POST",
		 	url: "/php/controller.php",
		 	data: ({"task": "goods", "type": self._activeCategory, "sort": "auto"}),
		 	dataType: "json",
		 	success: self._renderGoodsList.bind(self)
		});
	});	
}



AdminPanel.prototype._renderGoodsList = function(dataFromServer){

	this._goodsFromServer = dataFromServer || [];
	this._selectCategories = dataFromServer;
	var self = this;

	for (var i = 0; i < this._goodsFromServer.length; i++) {
		var image = JSON.parse(this._goodsFromServer[i]["images"])[0];
		if (image) {
			this._goodsFromServer[i]['image'] = image['small'];
		}else{
			console.log('no image id:', this._goodsFromServer[i]["id"]);
		}
	}

	var dataObject = {
		goods: this._goodsFromServer
	};

	this._goodsListDiv.innerHTML = this._newHandlebars(this._templateGoods, dataObject);
	this._addListeners();
}



AdminPanel.prototype._addListeners = function(){
	var self = this;
	this._adminAddNewProductBtn = this._goodsListDiv.querySelector('.adminAddNewProduct');

	this._adminAddNewProductBtn.onclick = function(event){
		var newProduct = new NewProduct(self._routerOutlet, self._newHandlebars);
		newProduct.render(self._activeSection, self._activeCategory);
	}

	this._goodsListDiv.onclick = function (event){
		if (event.target.classList.contains('adminDeleteProduct')){
			if (confirm('Вы действительно хотите удалить товар?')) {
				var id = event.target.getAttribute('data');
			    self._deleteProduct(id);
			}
		}
	}
}



AdminPanel.prototype._deleteProduct = function(id){

	var imagesArray = [];
	for (var i = 0; i < this._goodsFromServer.length; i++) {
		if (this._goodsFromServer[i]['id'] === id){
			var images = JSON.parse(this._goodsFromServer[i].images);
			for (var j = 0; j < images.length; j++) {
			    imagesArray.push(images[j]['small']);
				imagesArray.push(images[j]['big']);
			}
		}
	}

	var images = JSON.stringify(imagesArray);
	$.ajax({
		 	type: "POST",
		 	url: "/php/controller.php",
		 	data: ({"task": "deleteProduct", "id": id, "images": images}),
		 	dataType: "json",
		 	success: this._showMessage.bind(this, id)
		});
}



AdminPanel.prototype._showMessage = function(id, response){

	if (response) {
		$('.adminPanelProduct[data='+ id + ']').fadeOut(500);
	}else{
		console.log('Ошибка при удалении продукта', 'server response: ' + response);
	}	
}