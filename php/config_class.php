<?php 

class Config{
	public $sitename = "Ecommerce"; // NAZVANIE SAIyTA
	public $address = "http://ecommercewebsite.site11.com/"; // ADRESS SAIYTA
	public $secret = "explorer"; //SECRETNOE SLOVO dobavlyaetsya  k parolu usera
	public $host = "localhost"; //ADRESS HOSTA
	public $db = "id1406259_ecommerce"; //NAZVANIE BAZU DANNUH
	public $db_prefix = "explorer_"; //Префикс который использовался при создании таблиц
	public $user = "id1406259_alexey"; //Имя в профиле БД
	public $password = "explorer"; // Пароль профиля в БД
	public $admname = "Admin"; //Логин админа
	public $admemail = "alexlanos1.6@gmail.com"; // Почта админа
	public $imgStore = "../img/mysql/img"; //Папка с картинк
	public $uploadDirForProductImg =  "../img/mysql/goods/";
	public $min_login = 3; //мин количество букв в логине
	public $max_login = 255; //макс кол во букв в логине
}

?>