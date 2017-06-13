import {goodsList} from './index.js';

export default function SortBlock() {
	this._sortBlock = document.querySelector('#sortBlock');
	this._buttonAuto = document.querySelector('#sortAuto');
	this._buttonAuto.classList.add('chekedSortButton');
	this._buttonActive = "auto";
	this._addListener();
    
    
}

SortBlock.prototype._addListener = function(){
    
    console.log(goodsList);

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

		goodsList.activePage = 1;
		goodsList._productsArray.length = 0;
		goodsList._getElementsFromServer(goodsList._typeOfGoods, self._buttonActive);
	});
}