import HomePage from './homepage.js';
import Basket from './basket.js';
import FormBuy from './formbuy.js';
import Menu from './menu.js';
import MenuElementPage from './menuelement.js';
import GoodsList from './goodslist.js';
import Product from './product.js';
import ThankYou from './thankyou.js';
import Login from './login.js';
import AdminPanel from './adminpanel.js';
import Search from './search.js';

var routerOutlet = document.querySelector('#routerOutlet');

function newHandlebars(template, data){
    var compileTemplate = Handlebars.compile(template);
    var html = compileTemplate(data);
    return html;
}

        var homePage = new HomePage(routerOutlet, newHandlebars);
export  var basket = new Basket(routerOutlet, newHandlebars);
        var formBuy = new FormBuy(routerOutlet, newHandlebars);
        var menu = new Menu(newHandlebars);

        var furniture = new MenuElementPage(routerOutlet, newHandlebars, 'furniture');
        var houseAppliances = new MenuElementPage(routerOutlet, newHandlebars, 'houseAppliances');
        var electronics = new MenuElementPage(routerOutlet, newHandlebars, 'electronics');
        var clothes = new MenuElementPage(routerOutlet, newHandlebars, 'clothes');
        var householdProducts = new MenuElementPage(routerOutlet, newHandlebars, 'householdProducts');
        var autoProducts = new MenuElementPage(routerOutlet, newHandlebars, 'autoProducts');
        var sport = new MenuElementPage(routerOutlet, newHandlebars, 'sport');
        var toys = new MenuElementPage(routerOutlet, newHandlebars, 'toys');
        var gardenProducts = new MenuElementPage(routerOutlet, newHandlebars, 'gardenProducts');

export  var goodsList = new GoodsList(routerOutlet, newHandlebars);
        var product = new Product(routerOutlet, newHandlebars);

export  var thankYou = new ThankYou(routerOutlet, newHandlebars);
        var login = new Login(routerOutlet, newHandlebars);
        var adminPanel = new AdminPanel(routerOutlet, newHandlebars);
        var search = new Search(routerOutlet, newHandlebars);

var routes = {
    '/' : homePage.render.bind(homePage),
    '/basket' : basket.render.bind(basket),
    '/formbuy' : formBuy.render.bind(formBuy),

    '/furniture' : furniture.render.bind(furniture),
    '/houseAppliances' : houseAppliances.render.bind(houseAppliances),
    '/electronics' : electronics.render.bind(electronics),
    '/clothes' : clothes.render.bind(clothes),
    '/householdProducts' : householdProducts.render.bind(householdProducts),
    '/autoProducts' : autoProducts.render.bind(autoProducts),
    '/sport' : sport.render.bind(sport),
    '/toys' : toys.render.bind(toys),
    '/gardenProducts' : gardenProducts.render.bind(gardenProducts),

    '/furniture/cushionedfurniture' : goodsList.render.bind(goodsList, "cushionedfurniture"),
    '/furniture/cushionedfurniture/:productId' : product.render.bind(product, "cushionedfurniture"),
    '/furniture/mattresses' : goodsList.render.bind(goodsList, "mattresses"),
    '/furniture/mattresses/:productId' : product.render.bind(product, "mattresses"),
    '/furniture/cabinets' : goodsList.render.bind(goodsList, "cabinets"),
    '/furniture/cabinets/:productId' : product.render.bind(product, "cabinets"),
    '/houseAppliances/dishes' : goodsList.render.bind(goodsList, "dishes"),
    '/houseAppliances/dishes/:productId' : product.render.bind(product, "dishes"),
    '/houseAppliances/householdGoods' : goodsList.render.bind(goodsList, "householdGoods"),
    '/houseAppliances/householdGoods/:productId' : product.render.bind(product, "householdGoods"),
    '/houseAppliances/bathroom' : goodsList.render.bind(goodsList, "bathroom"),
    '/houseAppliances/bathroom/:productId' : product.render.bind(product, "bathroom"),
    '/electronics/phones' : goodsList.render.bind(goodsList, "phones"),
    '/electronics/phones/:productId' : product.render.bind(product, "phones"),
    '/electronics/computers' : goodsList.render.bind(goodsList, "computers"),
    '/electronics/computers/:productId' : product.render.bind(product, "computers"),
    '/electronics/photo' : goodsList.render.bind(goodsList, "photo"),
    '/electronics/photo/:productId' : product.render.bind(product, "photo"),
    '/clothes/woomens' : goodsList.render.bind(goodsList, "woomens"),
    '/clothes/woomens/:productId' : product.render.bind(product, "woomens"),
    '/clothes/mens' : goodsList.render.bind(goodsList, "mens"),
    '/clothes/mens/:productId' : product.render.bind(product, "mens"),
    '/clothes/forchild' : goodsList.render.bind(goodsList, "forchild"),
    '/clothes/forchild/:productId' : product.render.bind(product, "forchild"),
    '/householdProducts/small' : goodsList.render.bind(goodsList, "small"),
    '/householdProducts/small/:productId' : product.render.bind(product, "small"),
    '/householdProducts/fridges' : goodsList.render.bind(goodsList, "fridges"),
    '/householdProducts/fridges/:productId' : product.render.bind(product, "fridges"),
    '/householdProducts/microwaves' : goodsList.render.bind(goodsList, "microwaves"),
    '/householdProducts/microwaves/:productId' : product.render.bind(product, "microwaves"),        
    '/autoProducts/tyres' : goodsList.render.bind(goodsList, "tyres"),
    '/autoProducts/tyres/:productId' : product.render.bind(product, "tyres"),  
    '/autoProducts/electronics' : goodsList.render.bind(goodsList, "electronics"),
    '/autoProducts/electronics/:productId' : product.render.bind(product, "electronics"),
    '/autoProducts/tools' : goodsList.render.bind(goodsList, "tools"),
    '/autoProducts/tools/:productId' : product.render.bind(product, "tools"),
    '/sport/bicycles' : goodsList.render.bind(goodsList, "bicycles"),
    '/sport/bicycles/:productId' : product.render.bind(product, "bicycles"),
    '/sport/scooters' : goodsList.render.bind(goodsList, "scooters"),    
    '/sport/scooters/:productId' : product.render.bind(product, "scooters"),
    '/sport/rollers' : goodsList.render.bind(goodsList, "rollers"),
    '/sport/rollers/:productId' : product.render.bind(product, "rollers"),
    '/toys/prams' : goodsList.render.bind(goodsList, "prams"),
    '/toys/prams/:productId' : product.render.bind(product, "prams"),
    '/toys/construction' : goodsList.render.bind(goodsList, "construction"),
    '/toys/construction/:productId' : product.render.bind(product, "construction"),
    '/toys/formom' : goodsList.render.bind(goodsList, "formom"),
    '/toys/formom/:productId' : product.render.bind(product, "formom"),
    '/gardenProducts/gardenEquipment' : goodsList.render.bind(goodsList, "gardenEquipment"),
    '/gardenProducts/gardenEquipment/:productId' : product.render.bind(product, "gardenEquipment"),
    '/gardenProducts/gardenTools' : goodsList.render.bind(goodsList, "gardenTools"),
    '/gardenProducts/gardenTools/:productId' : product.render.bind(product, "gardenTools"),
    '/gardenProducts/plants' : goodsList.render.bind(goodsList, "plants"),
    '/gardenProducts/plants/:productId' : product.render.bind(product, "plants"),

    '/thankyou' : thankYou.render.bind(thankYou, "fail"),
    '/login' : login.render.bind(login),
    '/adminpanel' : adminPanel.render.bind(adminPanel),
    };

var router = Router(routes);
router.init('/');

