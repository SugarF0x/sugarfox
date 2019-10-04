<?php
    // TODO: allow change to authorised frup members only
if (isset($_POST['change']) && (is_numeric($_POST['change']) || $_POST['change']=='CLEAR') && $_POST['change'] && isset($_POST['time']) && $_POST['time'] && isset($_POST['date']) && $_POST['date'] && isset($_POST['state']) && $_POST['state']) {
    if ($_POST['change']=='CLEAR') {
		file_put_contents('../data/bank.json', '{
			"amount":0,
			"log":[
				{"ip":null,"time":null,"date":null,"change":null,"state":null},
				{"ip":null,"time":null,"date":null,"change":null,"state":null},
				{"ip":null,"time":null,"date":null,"change":null,"state":null},
				{"ip":null,"time":null,"date":null,"change":null,"state":null},
				{"ip":null,"time":null,"date":null,"change":null,"state":null},
				{"ip":null,"time":null,"date":null,"change":null,"state":null},
				{"ip":null,"time":null,"date":null,"change":null,"state":null},
				{"ip":null,"time":null,"date":null,"change":null,"state":null}
			]}');		
	} else {		
		$change = $_POST['change'];
		$time = $_POST['time'];
		$date = $_POST['date'];
		$state = $_POST['state'];
		$ip = $_SERVER['REMOTE_ADDR'];

		$data = json_decode(file_get_contents('../data/bank.json'), true);
		if ($state == '+') {
			$data['amount'] += $change;
		} else {
			$data['amount'] -= $change;
		}
		array_shift($data['log']);
		array_push($data['log'], ["ip" => $ip, "time" => $time, "date" => $date, "change" => $change, "state" => $state]);

		$json = JSON_encode($data);
		file_put_contents('../data/bank.json', $json);
	}

    echo 'SUCCESS';
} else {
    echo 'Отправляемые данные должны быть числом';
}