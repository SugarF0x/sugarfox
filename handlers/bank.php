<?php
if (isset($_POST['change']) && (is_numeric($_POST['change']) || $_POST['change']=='CLEAR') && $_POST['change'] && isset($_POST['time']) && $_POST['time'] && isset($_POST['state']) && $_POST['state']) {
    if ($_POST['change']=='CLEAR') {
		file_put_contents('../data/bank.json', '{
			"amount":0,
			"log":[
				{"time":null,"change":null,"state":null},
				{"time":null,"change":null,"state":null},
				{"time":null,"change":null,"state":null},
				{"time":null,"change":null,"state":null},
				{"time":null,"change":null,"state":null},
				{"time":null,"change":null,"state":null},
				{"time":null,"change":null,"state":null},
				{"time":null,"change":null,"state":null}
			]}');		
	} else {		
		$change = $_POST['change'];
		$time = $_POST['time'];
		$state = $_POST['state'];

		$data = json_decode(file_get_contents('../data/bank.json'), true);
		if ($state == '+') {
			$data['amount'] += $change;
		} else {
			$data['amount'] -= $change;
		}
		array_shift($data['log']);
		array_push($data['log'], ["time" => $time, "change" => $change, "state" => $state]);

		$json = JSON_encode($data);
		file_put_contents('../data/bank.json', $json);
	}
}