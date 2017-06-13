<?php 
//Класс для проверки данных которые возращает база даных 
require_once "config_class.php";

class CheckValid {

	private $config;

	public function __construct() {
		$this->config = new Config();
	} 

	public function validId ($id) { // Проверка ID (должно быть целое число и больше нуля)
		if (!$this->isIntNumber($id)) {
			return false;
		}
		if ($id <= 0) {
			return false;
		}else {
			return true;
		}
	}

	public function validLogin($login){ // Метод для проверки логина
		if ($this->isContainQuotes($login)) {
			return false;
		}
		if (preg_match("/^\d*$/", $login)) { //если в строке одни только цифры
			return false;
		}
		return $this->validString($login, $this->config->min_login, $this->config->max_login);
	}

	public function validVotes ($votes) { //проверяем негативное ли это число или положительное
		return $this->isNoNegativeInteger($votes);
	}

	public function validHash($hash){ //метод для проверки хеша (зашифрованного пароля md5)
		if (!$this->validString($hash, 32, 32)) {
			return false;
		}
		if (!$this->isOnlyLettersAndDigits($hash)) {
			return false;
		}
		return true;
	}

	public function validTimeStamp($time){ // Проверить коректность даты
		return $this->isNoNegativeInteger($time);
	}

	private function isIntNumber ($number) { //Проверяет целое ли это число или дробное и не строка
		if (!is_int($number) && !is_string($number)) {
			return false;
		}
		if (!preg_match("/^-?([1-9][0-9]*|0)$/", $number)) {
			return false;
		}
		return true;
	}

	private function isNoNegativeInteger($number){ // Проверка числа на то что бы оно небыло отрицательным (со знаком -)
		if (!$this->isIntNumber($number)) {
			return false;
		}
		if ($number < 0) {
			return false;
		}
		return true;
	}

	private function isOnlyLettersAndDigits($string) { //Проверка на наличие в строке только букв и цифр
		if (!is_int($string) && (!is_string($string))) {
			return false;
		}
		if (!preg_match("/[a-zа-я0-9]*/i", $string)) {
			return false;
		}
		return true;
	}

	public function inputText ($string) { //Проверка текста статьи
		if (!preg_match("/^[\<\>a-zа-я0-9\;\,\.\'\"\(\)\[\]\{\}\:_-\/\s\*\%\$\@\?]*$/i", $string)) {
			return false;
		}
		return true;
	}

	public function imgStore ($string) { //Проверка адресса картинки
		if (!preg_match("/^\/img\//i", $string)) {
			return false;
		}
		return true;
	}

	private function validString ($string, $min_lenght, $max_lenght){// Проверяет на валидность строку
		if (!is_string($string)) {
			return false;
		}
		if (strlen($string) < $min_lenght){
			return false;
		}
		if (strlen($string) > $max_lenght){
			return false;
		}
		return true;
	}

	private function isContainQuotes ($string) { // Метод проверят наличие в строке ковычек
		$array = array( "\"", "'", "`", "&quot;", "&apos;");
		foreach ($array as $key => $value) {
			if (strpos($string, $value) !== false) {
				return true;
			}
		}
		return false;
	}
}

 ?>