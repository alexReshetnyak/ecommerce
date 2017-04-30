<?php
require_once "databasse_class.php";
require_once "config_class.php";
ini_set('display_errors', 1);
error_reporting(E_ALL);


$db = new DataBase();
$config = new Config();
$answer;
$response;

if (count($_POST) > 0 && $_POST["task"] && $_POST["task"] == "menu") {

	$response = $db->getAll("menuelements");
    
} elseif (count($_POST) > 0 && $_POST["task"] && $_POST["task"] == "menuelement") {
	$type = $_POST["type"];
	$response = $db->getAllOnField("menuelementpage", "type", $type);

}elseif (count($_POST) > 0 && $_POST["task"] && $_POST["task"] == "goods") {

	$type = $_POST["type"];
	if ($_POST["sort"] == "auto") {
		$response = $db->getAllOnField("goods", "goodscategory", $type);
	} elseif ($_POST["sort"] == "views") {
		$response = $db->getAllOnField("goods", "goodscategory", $type, "views", false);
	} elseif ($_POST["sort"] == "priceUp") {
		$response = $db->getAllOnField("goods", "goodscategory", $type, "price", true);
	} elseif ($_POST["sort"] == "priceDown") {
		$response = $db->getAllOnField("goods", "goodscategory", $type, "price", false);
	}
}elseif (count($_POST) > 0 && $_POST["task"] && $_POST["task"] == "product") {
	$productId = $_POST["id"];
	$response = $db->getElementOnId("goods", $productId);
}elseif (count($_POST) > 0 && $_POST["task"] && $_POST["task"] == "changeField") {
	$productId = $_POST["id"];
	$fieldName = $_POST["field"];
	$fieldValue = $_POST["count"];
	$response = $db->setFieldOnId("goods", $productId, array($fieldName => $fieldValue));
}elseif (count($_POST) > 0 && $_POST["task"] && $_POST["task"] == "basket") {
	$idArray = json_decode( $_POST["arrayWithId"]);
	$response = array();
	for ($i=0; $i < count($idArray); $i++) { 
		$response[] = $db->getElementOnId("goods", $idArray[$i]);
	}
}elseif(count($_POST) > 0 && $_POST["task"] && $_POST["task"] == "sendEmail"){
	$arrayContacts = json_decode($_POST["arrayWithContactData"]);
	$arrayGoods = json_decode($_POST["goodsArray"]);
	$phone = $arrayContacts[0];
	$email = $arrayContacts[1];
	$name = $arrayContacts[2];
	$to = $config->admemail;
	$subject = "Заказ с сайта";
	$message = "Телефон клиента: ".$phone.",  почтовый адрес: ".$email.", имя клиента: ".$name.", id товаров: ";

	foreach ($arrayGoods as $key => $value){
		$message .= " ".$value;
	}
	if (mail($to, $subject, $message) && count($arrayGoods) > 0){
		$response = 'success';
	}else{
		$response = 'fail';
	}
}elseif(count($_POST) > 0 && $_POST["task"] && $_POST["task"] == "checkuser"){
	if ($db->isExists("users", "login", $_POST["login"])) {
		$dbPassword = $db->getField("users", "password", "login", $_POST["login"]);
		if (md5($_POST["password"]) == $dbPassword) {
			$response = $db->getField("users", "status", "login", $_POST["login"]);
		}else{
			$response = false;
		}
	}else{
		$response = false;
	}
}elseif(count($_FILES) > 0 && $_FILES["image0"]){
	$error = false;
	$files = array();

	$uploaddir = $config->uploadDirForProductImg;
	if (!is_dir($uploaddir)) {
		mkdir($uploaddir, 0777);
	}

	foreach ($_FILES as $file =>$value) {
		$timeNow = time();
		if (move_uploaded_file($_FILES[$file]["tmp_name"], $uploaddir.$timeNow.basename($_FILES[$file]["name"]))) {
			$files[] = realpath($uploaddir.$timeNow.$_FILES[$file]["name"]);
		}else{
			$error = true;
		}
	}
	$response = $error? array("error" => "Ошибка при загрузке изображения") : array("imagesPath" => $files);

}elseif (count($_POST) > 0 && $_POST["task"] && $_POST["task"] == "addnewproduct") {
	$productArray = array();
	$productArray["menucategory"] = $_POST["menucategory"];
	$productArray["goodscategory"] = $_POST["goodscategory"];
	$productArray["price"] = $_POST["price"];
	$productArray["views"] = $_POST["views"];
	$productArray["images"] = $_POST["images"];
	$productArray["productdescription"] = $_POST["productdescription"];
	$productArray["specifications"] = $_POST["specifications"];
	$productArray["availability"] = $_POST["availability"];
	$productArray["name"] = $_POST["name"];
	$response = $db->insert("goods", $productArray);
}elseif (count($_POST) > 0 && $_POST["task"] && $_POST["task"] == "deleteProduct") {
	$imagesArray = json_decode($_POST["images"]);
	for ($i=0; $i < count($imagesArray); $i++) { 
		unlink('..'.$imagesArray[$i]);
	}
	$response = $db->deleteOnID("goods", $_POST["id"]);

}elseif(count($_POST) > 0 && $_POST["task"] && $_POST["task"] == "search"){
	$fields = array("name", "productdescription");
	$response = $db->search("goods", $_POST["words"], $fields);

}elseif(count($_POST) > 0 && $_POST["task"] && $_POST["task"] == "goodsForSlider") {

	if ($_POST["sort"] == "auto") {
		$response = $db->getAll("goods");
	} elseif ($_POST["sort"] == "views") {
		$response = $db->getAll("goods", "views", false);
	} elseif ($_POST["sort"] == "priceUp") {
		$response = $db->getAll("goods", "price", true);
	} elseif ($_POST["sort"] == "priceDown") {
		$response = $db->getAll("goods", "price", false);
	}
}


$answer = json_encode($response);
echo $answer;

?>