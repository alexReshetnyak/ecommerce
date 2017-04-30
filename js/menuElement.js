
function MenuElementPage(routerOutlet, newHandlebars, typeOfElement){
	this._newHandlebars = newHandlebars;
	this._routerOutlet = routerOutlet;
	this._name = typeOfElement;
	this._dataFromServer;    
    this._template;
    this._promiseTemplate = $.ajax({
							type: "POST",
							url: "/templates/menuelement.html"
						   });

}

MenuElementPage.prototype.render = function(){
    window.scrollTo(0,0);
	this._getElementsFromServer();
};

MenuElementPage.prototype._getElementsFromServer = function(){
	$.ajax({
		 	type: "POST",
		 	url: "/php/controller.php",
		 	data: ({"task": "menuelement", "type": this._name}),
		 	dataType: "json",
		 	success: this._renderObject.bind(this)
		   });
};

MenuElementPage.prototype._renderObject = function(data){
	this._dataFromServer = data;
	
	var self = this;
	this._promiseTemplate.then(function (datateplate) {
    	self._template = datateplate;
    	var header = self._dataFromServer[0]["type"];

    	if (header === "furniture") {
    		header = "Мебель";
    	} else if (header === "houseAppliances") {
    		header = "Товары для дома";
    	} else if (header === "electronics") {
    		header = "Электроника";
    	} else if (header === "clothes") {
    		header = "Одежда";
    	} else if (header === "householdProducts") {
    		header = "Бытовая техника";
    	} else if (header === "autoProducts") {
    		header = "Товары для авто";
    	} else if (header === "sport") {
    		header = "Спорт и отдых";
    	} else if (header === "toys") {
    		header = "Детские товары";
    	} else if (header === "gardenProducts") {
    		header = "Товары для дачи";
    	}

    	//console.log(header);
    	var dataObject = {
 		    templates : self._dataFromServer,
 		    header: header
 	    }
    	self._routerOutlet.innerHTML = self._newHandlebars(self._template, dataObject);
	});
};

 window.app = window.app || {};
 window.app.MenuElementPage = window.app.MenuElementPage || MenuElementPage;