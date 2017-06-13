<?php 

require_once "config_class.php";
require_once "checkvalid.php";

class DataBase {

	private $config;
	private $mysqli;  // Индификатор соединения
	private $valid; 

	public function __construct() {
		$this->config = new Config();
		$this->valid = new CheckValid();
		$this->mysqli = new mysqli($this->config->host, $this->config->user, $this->config->password, $this->config->db);
		$this->mysqli->query("SET NAMES 'utf8'");
	}

	private function query ($query){// Метод для отправки запросов к БД
		return $this->mysqli->query($query);
	}                      

                            //имя таблицы/ Поля /доп условия /сортировка по/ в обратном / ограничение на кол во 
	private function select ($table_name, $fields, $where = "", $order = "", $up = true, $limit = "" ){ 
    //Метод который будет возращать 
	//выборку из БД

		for ($i=0; $i < count($fields); $i++) { //Экранируем названия полей в такие ковычки ``
			if ((strpos($fields[$i], "(") === false) && ($fields[$i] != "*")) {
				$fields[$i] = "`".$fields[$i]."`";
			}
		}

		$fields = implode(",", $fields); // Массив в строку
		$table_name = $this->config->db_prefix.$table_name;
        $table_name = "`$table_name`";

		if (!$order) {//Сортировка
			$order = "ORDER BY `id`";
		}else{
			if ($order != "RAND()") {
				$order = "ORDER BY `$order`";
				if (!$up) {
					$order .= " DESC"; 
				}
			}else {
				$order = "ORDER BY $order";
			}
		}
		if ($limit) {//ограничение на кол во возрата результатов
			$limit = "LIMIT $limit";
		}
		if ($where) {
			$query = "SELECT $fields FROM $table_name WHERE $where $order $limit"; 
		}else{
			$query = "SELECT $fields FROM $table_name $order $limit";
		}

		$result_set = $this->query($query); // Сделать выборку
        $data = array();
        
		if (!$result_set) {
			$data = false;
		}else{
            $i = 0;
            while ($row = $result_set->fetch_assoc()){ //Перебрать полученную выборку и создать двухмерный массив
                $data[$i] = $row;
                $i++;
            }
            $result_set->close();
        }

		
		return $data;
	}

	
	public function insert($table_name, $new_values){ // Добавление записей

		$table_name = $this->config->db_prefix.$table_name;
		$query = "INSERT INTO $table_name ("; 
		foreach ($new_values as $field => $value) {//Перебрать массив $new_values и забрать все ключи
			$query .= "`".$field."`,";
		}
		$query = substr($query, 0, -1); // Убираем запятую 
		$query .= ") VALUES (";
		foreach ($new_values as $value) { // Перебрать массив и вернуть все значения
			$query .= "'".addslashes($value)."',";
		}
		$query = substr($query, 0, -1);
		$query .= ")";
		return $this->query($query);
	}

	private function update($table_name, $upd_fields, $where) { // Обновление записей      
		$table_name = $this->config->db_prefix.$table_name;	
		$query = "UPDATE $table_name SET ";
		foreach ($upd_fields as $field => $value) {
			$query .= "`$field` = '".addslashes($value)."',";
		}
		$query = substr($query, 0, -1);
		if ($where) {
			$query = $query." WHERE $where";
			return $this->query($query);
		}else{
			return false;
		}

	}

	public function delete ($table_name, $where = "") {    //Удаление записей
		$table_name = $this->config->db_prefix.$table_name;	
		if ($where) {
			$query = "DELETE FROM $table_name WHERE $where";
			return $this->query($query);
		}else{
			return false;
		}
	}

	public function deleteAll ($table_name) { //Удаление всех записей
		$table_name = $this->config->db_prefix.$table_name;	
		$query = "TRUNCATE TABLE `$table_name`";
		return $this->query($query);
	}



//-----------Вспомогательные методы--------------------------------------------------------------------------------------------------

//                  название таблицы, какое поле ищем, какое поле знаем, значение поля которое знаем
	public function getField($table_name, $field_out, $field_in, $value_in){
     //Поиск одного поля по значению другого (например найти 
	// пароль по логину)
		                                      //fields          //WHERE  
		$data = $this->select($table_name, array($field_out), "`$field_in` = '".addslashes($value_in)."'");
		if (count($data) != 1) {
			return count($data)/*false*/;
		}
		return $data[0][$field_out];

	}

	public function getFieldOnID ($table_name, $id, $field_out){ //получение поля если мы знаем ID
        
        if (!$this->existsID($table_name, $id)) { //Проверить есть ли вообще данный ID в данной таблице
        	return FALSE;
        }
        return $this->getField($table_name, $field_out, "id", $id);
    }

    public function getAll($table_name, $order = "", $up = true){//Получение всех записей из таблицы
        return $this->select($table_name, array("*"), "", $order, $up);
    }

    public function getAllOnField ($table_name, $field, $value, $order = "", $up = true){ //Получить все записи по опрелеленному полю 

    	return $this->select($table_name, array("*"), "`$field` = '".addslashes($value)."'", $order, $up);
    }

    public function getLastAddId ($table_name){ // Получить последний вставленный Id
    	$data = $this->select($table_name, array("MAX(`id`)"));
    	return $data[0]["MAX(`id`)"];
    }

    public function deleteOnID($table_name, $id) {//удалить запись по ID
    	if (!$this->existsID($table_name, $id)) { //Проверить есть ли вообще данный ID в данной таблице
        	return FALSE;
        }
        return $this->delete($table_name, "`id` = '$id'");
    }

    public function setField ($table_name, $upd_fields, $field_in, $value_in){ //метод который изменяет значение определенного поля 

        return $this->update($table_name, $upd_fields, "`$field_in` = '".addslashes($value_in)."'");
    }

    public function setFieldOnId ($table_name, $id, $upd_fields){ //Поменять поле по значению ID

    	if (!$this->existsID($table_name, $id)) { //Проверить есть ли вообще данный ID в данной таблице
        	return FALSE;
        }
        return $this->setField($table_name, $upd_fields, "id", $id);
    }

    public function getElementOnId ($table_name, $id){//получить всю запись целиком если мы знаем ID

    	if (!$this->existsID($table_name, $id)) { //Проверить есть ли вообще данный ID в данной таблице
        	 return FALSE;
        }
        $arr = $this->select($table_name, array("*"), "`id`= '$id'");
        return $arr[0];
    }

    public function getRandomElements ($table_name, $count){ //функция которая будет возращать случайные записи
    	return $this->select($table_name, array("*"), "", "RAND()", true, $count);
    }

    public function getCount($table_name) { //Узнаем количество записей в таблице

    	$data = $this->select($table_name, array("COUNT(`id`)"));
    	return $data[0]["COUNT(`id`)"];
    }

    public function isExists($table_name, $field, $value){ //проверка на существование определенной записи в данной таблице

    	$data = $this->select($table_name, array("id"), "`$field` = '".addslashes($value)."'");
    	if (count($data) === 0 ) {
    		return false;
    	}
    	return true;
    }

    public function existsID($table_name, $id){//Проверить есть ли вообще данный ID в данной таблице
    	if (!$this->valid->validID($id)) {
    		return FALSE;
    	}
    	$data = $this->select($table_name, array("$id"), "`id` = '".addslashes($id)."'");
    	if (count($data) === 0 ) {
    		return FALSE;
    	}
    	return TRUE;
    }

    public function  getLastId ($table_name){ //Узнать последний номер ID в таблице

    	$dataId = $this->select($table_name, array("$id"), "", "", false, 1);
    	if (count($dataId) === 0) {
    		return FALSE;
    	}
    	return $dataId[0];
    }

    public function getMaxValue ($table_name, $field){// Узнать максимальное значение в выбранном столбце

    	$data = $this->select($table_name, array("$field"), "", $field, false, 1);
    	if (count($data) === 0) {
    		return FALSE;
    	}
    	return $data[0];
    }

    public function getMinValue ($table_name, $field){// Узнать минимальное значение в выбранном столбце

    	$data = $this->select($table_name, array("$field"), "", $field, true, 1);
    	if (count($data) === 0) {
    		return FALSE;
    	}
    	return $data[0];
    }

    public function getCountRow ($table_name, $field, $countMin, $countMax){// Вернуть указаный деапозон значений определенного поля

    	$data = $this->select($table_name, array("$field"), "`$field` = (`$field` > $countMin AND `$field` < $countMax)");
    	if (count($data) === 0) {
    		return FALSE;
    	}
    	return $data;
    }
                 //имя таблицы   слова (в виде строки)  в каких полях искать
    public function search ($table_name, $words, $fields) { // Метод для поиска в таблице по словам из поиска 
    	$words = mb_strtolower($words); // строку в нижний регистр
    	$words = trim($words); // Обрезать пробелы
    	$words = quotemeta($words); // Взять в ковычки все спец символы "!" ";" ":" and so
    	if ($words == "") {
    		return false;
    	}
    	$where = "";
    	$arraywords = explode(" ", $words); // поисковый запросс в виде строки разбитт и вернуть массив
    	$logic = "OR"; // Искать совпадение по любому из слов из поискового запроса

    	foreach ($arraywords as $key => $value) { 
    		if (isset($arraywords[$key - 1])) {
    			$where .= $logic;
    		}
    		for ($i=0; $i < count($fields); $i++) { 
    			$where .= "`".$fields[$i]."` LIKE '%".addslashes($value)."%'"; // % - означают что - либо, т.е. что то может быть впереди 
    		    if (($i + 1) != count($fields)) {                             // поискового слова и сзади
    		    	$where .= " OR";   // если это не последние поле то к $where мы добавляем OR
    		    }
    		}                                                                  
    	}
    	$results = $this->select($table_name, array("*"), $where);
    	if (!$results) {
    		return false;
    	}

    	$k = 0; //делаем что бы поиск с самым большим сопадением появлялся первый
    	$data = array();
    	for ($i=0; $i < count($results); $i++) { //перебираем все результаты
        	for ($j=0; $j < count($fields); $j++) { //перебираем и совершаем действия по названию поля-колонки (например login)
        		$results[$i]["$fields[$j]"] = mb_strtolower(strip_tags($results[$i][$fields[$j]])); //поле где есть совпадение
        	}
        	$data[$k] = $results[$i];
        	$data[$k]["relevant"] = $this->getRelevantForSearch($results[$i], $fields, $words);// кол - во совпадений по всем полям добавляем в ячейку массива
        	$k++;
    	}
    	$data  = $this->orderResultSearch($data, "relevant"); // Сделать сортировку по полю "relevant"
    	return $data; 
    }
                                  // массив строка
    private function searchMiniText($words, $text){ // метод перебирает текст и возращает его кусок где больше всего поисковых слов
    	for ($i1=0; $i1 < count($words); $i1++) { 
    		$words[$i1] = mb_strtolower(strip_tags($words[$i1]));
    	}                                                   // текст и статью переводим в нижний регистр и убираем лишние пробелы
    	$text = mb_strtolower(strip_tags($text));
    	
    	$arrayText = explode(" ", $text);    // Разбиваем текст на части по 20 слов
    	$arrayText2 = array();
    	$x = 0;
    	$y = 30;
    	for ($g=0; $g < count($arrayText) ; $g++) {    		
    		if ($g > $y) {
    			$x++;
    			$y+=30; 
    		}
    		$arrayText2[$x] = $arrayText2[$x]." ".$arrayText[$g];
    	}


    	for ($i=0; $i < count($arrayText2); $i++) {
    		for ($j=0; $j < count($words); $j++) {
    			$chimeCount[$i][$j] = substr_count($arrayText2[$i], $words[$j]); //ищем кол - во совпадений и помещаем результаты в массив
    		}	
    	}
    	for ($s=0; $s < count($chimeCount); $s++) {   // складываем результаты для каждого куска текста по всем посковым словам
    		for ($l=0; $l < count($chimeCount[$s]); $l++) {
    			$chineN[$s] += $chimeCount[$s][$l];
    		}
    	}

    	for ($t=0; $t < count($chineN); $t++) {//Определяем в каком куске текста больше всего совпадений
    		if ($t == 0) {
    			$number = $chineN[0];
    			$text = $arrayText2[0];
    		}
    		if ($number < $chineN[$t]) {
    			$number = $chineN[$t];
    			$text = $arrayText2[$t];
    		}
    	}
    	for ($q=0; $q < count($words); $q++) { 
    		$text = str_replace($words[$q], "<b><i>".$words[$q]."</i></b>", $text);
    	}
    	return $text /*count($arrayText2)*/;
    }


    private function getRelevantForSearch ($result, $fields, $words){//методо должен возращать кол - во совпадений по всем полям $fields
    	$relevant = 0;
    	$arraywords = explode(" ", $words);
    	for ($i=0; $i < count($fields); $i++) { 
    		for ($j=0; $j < count($arraywords); $j++){
    			$relevant += substr_count($result[$fields[$i]], $arraywords[$j]);
    		}
    	}
    	return $relevant; 
    }

    private function orderResultSearch ($data, $order) { //метод для сортировки двухмерного массива поиска  по revelant
    	for ($i=0; $i < count($data) - 1; $i++) { 
    		$k = $i;
    		for ($j = $i + 1; $j < count($data); $j++) { 
    			if ($data[$j][$order] > $data[$k][$order]) {
    				$k = $j;
    			}
    		}
    		$temp = $data[$k];
    		$data[$k] = $data[$i];
    		$data[$i] = $temp;
    	}
    	return $data;
    }

    public function __destruct (){ //Метод удаления  обьекта и закрытия соединения с БД

    	if ($this->mysqli) {
    		$this->mysqli->close();
    	}
    }
} 
 ?>