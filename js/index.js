$(function (){

    var routerOutlet = document.querySelector('#routerOutlet');
 
    function newHandlebars(template, data){
    	var compileTemplate = Handlebars.compile(template);
        html = compileTemplate(data);
    	return html;
    }
    
    window.app.homePage = new window.app.HomePage(routerOutlet, newHandlebars);
    window.app.basket = new window.app.Basket(routerOutlet, newHandlebars);
    window.app.formBuy = new window.app.FormBuy(routerOutlet, newHandlebars);
    window.app.menu = new window.app.Menu(newHandlebars);
    window.app.furniture = new window.app.MenuElementPage(routerOutlet, newHandlebars, 'furniture'); 
    window.app.houseAppliances = new window.app.MenuElementPage(routerOutlet, newHandlebars, 'houseAppliances');
    window.app.electronics = new window.app.MenuElementPage(routerOutlet, newHandlebars, 'electronics');
    window.app.clothes = new window.app.MenuElementPage(routerOutlet, newHandlebars, 'clothes');
    window.app.householdProducts = new window.app.MenuElementPage(routerOutlet, newHandlebars, 'householdProducts');
    window.app.autoProducts = new window.app.MenuElementPage(routerOutlet, newHandlebars, 'autoProducts');
    window.app.sport = new window.app.MenuElementPage(routerOutlet, newHandlebars, 'sport');
    window.app.toys = new window.app.MenuElementPage(routerOutlet, newHandlebars, 'toys');
    window.app.gardenProducts = new window.app.MenuElementPage(routerOutlet, newHandlebars, 'gardenProducts');
    window.app.goodsList = new window.app.GoodsList(routerOutlet, newHandlebars);
    window.app.product = new window.app.Product(routerOutlet, newHandlebars);
    window.app.thankYou = new window.app.ThankYou(routerOutlet, newHandlebars);
    window.app.login = new window.app.Login(routerOutlet, newHandlebars);
    window.app.adminPanel = new window.app.AdminPanel(routerOutlet, newHandlebars);
    window.app.search = new window.app.Search(routerOutlet, newHandlebars);

    var routes = {
    	'/' : app.homePage.render.bind(app.homePage),
    	'/basket' : app.basket.render.bind(app.basket),
    	'/formbuy' : app.formBuy.render.bind(app.formBuy),
        '/furniture' : app.furniture.render.bind(app.furniture),
        '/houseAppliances' : app.houseAppliances.render.bind(app.houseAppliances),
        '/electronics' : app.electronics.render.bind(app.electronics),
        '/clothes' : app.clothes.render.bind(app.clothes),
        '/householdProducts' : app.householdProducts.render.bind(app.householdProducts),
        '/autoProducts' : app.autoProducts.render.bind(app.autoProducts),
        '/sport' : app.sport.render.bind(app.sport),
        '/toys' : app.toys.render.bind(app.toys),
        '/gardenProducts' : app.gardenProducts.render.bind(app.gardenProducts),
        '/furniture/cushionedfurniture' : app.goodsList.render.bind(app.goodsList, "cushionedfurniture"),
        '/furniture/cushionedfurniture/:productId' : app.product.render.bind(app.product, "cushionedfurniture"),
        '/furniture/mattresses' : app.goodsList.render.bind(app.goodsList, "mattresses"),
        '/furniture/mattresses/:productId' : app.product.render.bind(app.product, "mattresses"),
        '/furniture/cabinets' : app.goodsList.render.bind(app.goodsList, "cabinets"),
        '/furniture/cabinets/:productId' : app.product.render.bind(app.product, "cabinets"),
        '/houseAppliances/dishes' : app.goodsList.render.bind(app.goodsList, "dishes"),
        '/houseAppliances/dishes/:productId' : app.product.render.bind(app.product, "dishes"),
        '/houseAppliances/householdGoods' : app.goodsList.render.bind(app.goodsList, "householdGoods"),
        '/houseAppliances/householdGoods/:productId' : app.product.render.bind(app.product, "householdGoods"),
        '/houseAppliances/bathroom' : app.goodsList.render.bind(app.goodsList, "bathroom"),
        '/houseAppliances/bathroom/:productId' : app.product.render.bind(app.product, "bathroom"),
        '/electronics/phones' : app.goodsList.render.bind(app.goodsList, "phones"),
        '/electronics/phones/:productId' : app.product.render.bind(app.product, "phones"),
        '/electronics/computers' : app.goodsList.render.bind(app.goodsList, "computers"),
        '/electronics/computers/:productId' : app.product.render.bind(app.product, "computers"),
        '/electronics/photo' : app.goodsList.render.bind(app.goodsList, "photo"),
        '/electronics/photo/:productId' : app.product.render.bind(app.product, "photo"),
        '/clothes/woomens' : app.goodsList.render.bind(app.goodsList, "woomens"),
        '/clothes/woomens/:productId' : app.product.render.bind(app.product, "woomens"),
        '/clothes/mens' : app.goodsList.render.bind(app.goodsList, "mens"),
        '/clothes/mens/:productId' : app.product.render.bind(app.product, "mens"),
        '/clothes/forchild' : app.goodsList.render.bind(app.goodsList, "forchild"),
        '/clothes/forchild/:productId' : app.product.render.bind(app.product, "forchild"),
        '/householdProducts/small' : app.goodsList.render.bind(app.goodsList, "small"),
        '/householdProducts/small/:productId' : app.product.render.bind(app.product, "small"),
        '/householdProducts/fridges' : app.goodsList.render.bind(app.goodsList, "fridges"),
        '/householdProducts/fridges/:productId' : app.product.render.bind(app.product, "fridges"),
        '/householdProducts/microwaves' : app.goodsList.render.bind(app.goodsList, "microwaves"),
        '/householdProducts/microwaves/:productId' : app.product.render.bind(app.product, "microwaves"),        
        '/autoProducts/tyres' : app.goodsList.render.bind(app.goodsList, "tyres"),
        '/autoProducts/tyres/:productId' : app.product.render.bind(app.product, "tyres"),  
        '/autoProducts/electronics' : app.goodsList.render.bind(app.goodsList, "electronics"),
        '/autoProducts/electronics/:productId' : app.product.render.bind(app.product, "electronics"),    
        '/autoProducts/tools' : app.goodsList.render.bind(app.goodsList, "tools"),
        '/autoProducts/tools/:productId' : app.product.render.bind(app.product, "tools"),
        '/sport/bicycles' : app.goodsList.render.bind(app.goodsList, "bicycles"),
        '/sport/bicycles/:productId' : app.product.render.bind(app.product, "bicycles"),
        '/sport/scooters' : app.goodsList.render.bind(app.goodsList, "scooters"),    
        '/sport/scooters/:productId' : app.product.render.bind(app.product, "scooters"),
        '/sport/rollers' : app.goodsList.render.bind(app.goodsList, "rollers"),
        '/sport/rollers/:productId' : app.product.render.bind(app.product, "rollers"),
        '/toys/prams' : app.goodsList.render.bind(app.goodsList, "prams"),
        '/toys/prams/:productId' : app.product.render.bind(app.product, "prams"),
        '/toys/construction' : app.goodsList.render.bind(app.goodsList, "construction"),
        '/toys/construction/:productId' : app.product.render.bind(app.product, "construction"),
        '/toys/formom' : app.goodsList.render.bind(app.goodsList, "formom"),
        '/toys/formom/:productId' : app.product.render.bind(app.product, "formom"),
        '/gardenProducts/gardenEquipment' : app.goodsList.render.bind(app.goodsList, "gardenEquipment"),
        '/gardenProducts/gardenEquipment/:productId' : app.product.render.bind(app.product, "gardenEquipment"),
        '/gardenProducts/gardenTools' : app.goodsList.render.bind(app.goodsList, "gardenTools"),
        '/gardenProducts/gardenTools/:productId' : app.product.render.bind(app.product, "gardenTools"),
        '/gardenProducts/plants' : app.goodsList.render.bind(app.goodsList, "plants"),
        '/gardenProducts/plants/:productId' : app.product.render.bind(app.product, "plants"),
        '/thankyou' : app.thankYou.render.bind(app.thankYou, "fail"),
        '/login' : app.login.render.bind(app.login),
        '/adminpanel' : app.adminPanel.render.bind(app.adminPanel),
      };

    var router = Router(routes);
    router.init('/');
});
