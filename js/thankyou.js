function ThankYou (routerOutlet, newHandlebars){
	this._newHandlebars = newHandlebars;
	this._routerOutlet = routerOutlet;
	this._template;
	this._promiseTemplate = $.ajax({
							type: "POST",
							url: "/templates/thankyou.html"
						   });
}

ThankYou.prototype.render = function(result){
	var self = this;
	window.scrollTo(0,0);
	this._promiseTemplate.then(function(dataTemplate){
		self._template = dataTemplate;
		if (result === "success") {
			result = true;
		}else{
			result = false;
		}

	    self._dataObject = {
	    	result : result
	    };
	    self._routerOutlet.innerHTML = self._newHandlebars(self._template, self._dataObject);
	});
};

window.app = window.app || {};
window.app.ThankYou = window.app.ThankYou || ThankYou;