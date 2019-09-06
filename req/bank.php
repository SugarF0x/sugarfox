<script>
    let bank = new Bank();
</script>

<div class="row">
    <h1 class="col-12 d-flex justify-content-center" id="amount">
        <?php
        $data = json_decode((file_get_contents('data/bank.json')), true);
        echo number_format($data['amount']);
        ?>
    </h1>
    <div class="col-12 d-flex justify-content-center">
        <button onclick="bank.update('-')">-</button>
        <input type="text" id="input">
        <button onclick="bank.update('+')">+</button>
    </div>
    <div class="col-12 mt-3">
        <?php
        for ($i = count($data['log']); $i>=0; $i--) {
            if ($data['log'][$i]['time'] != null) {
                if ($data['log'][$i]['state'] == '+') {
                    $color = 'green';
                } else {
                    $color = 'red';
                }
                echo   '<div class="row">
                            <div class="col-5 text-right"><span style="color: darkgray">' . $data['log'][$i]['ip'] . '</span> - ' . $data['log'][$i]['time'] . '</div>
                            <div class="col-2 text-center">-</div>
                            <div class="col-5 text-left" style="color:' . $color . '">' . number_format($data['log'][$i]['change']) . '</div>
                        </div>';
            }
        }
        ?>
    </div>
</div>
