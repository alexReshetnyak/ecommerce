function MenuElement(newHandlebars, menuDivs, indicator, dataForLi) {
	this._ulContainer = menuDivs[indicator].querySelector("ul");
	this._dataForLi = JSON.parse(dataForLi.elements);
	//console.log(this._dataForLi);
	this._render(newHandlebars, menuDivs, this._ulContainer, indicator);
}

MenuElement.prototype._render = function(newHandlebars, menuDivs, ul, indicator){
	window.scrollTo(0,0);
	menuDivs[indicator].addEventListener("mouseover", function () {
		ul.style.display = "block";
	});
	menuDivs[indicator].addEventListener("mouseout", function () {
		ul.style.display = "none";
	});

	
	for (var key in this._dataForLi) {
	    ul.innerHTML += '<a href="' + this._dataForLi[key][1] + '"><li>' + this._dataForLi[key][0] + '</li></a>';
	}
	
};


function Menu (newHandlebars) {
	this._menuDivs = document.querySelectorAll("#menu>div");
	this._promise = $.ajax({
							type: "POST",
							url: "/php/controller.php", 
							data: ({"task": "menu"}),
							dataType: "json"
						   });
	this._menuElementsLi;

	var self = this;
	this._promise.then(function (data) {
		//self._menuElementsLi = JSON.parse(data.elements);
		self._makeMenuElements(data);
	});

	this._makeMenuElements = function(dataForUl){
		for (var i = 0; i < this._menuDivs.length; i++) {
			var dataForLi = dataForUl[i];
		    var element =  new MenuElement(newHandlebars, this._menuDivs, i, dataForLi);
	    }
	};	
}

 window.app = window.app || {};
 window.app.Menu = window.app.Menu || Menu;