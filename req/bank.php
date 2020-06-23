<script>
    let bank = new Bank();
    // TODO: allow access to this page only to athorised frup members
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
                echo   '<div class="row text-center">
                            <div class="col p-0">' . $data['log'][$i]['ip'] . '</div>
                            <div class="col p-0">' . $data['log'][$i]['date'] . '</div>
                            <div class="col p-0">' . $data['log'][$i]['time'] . '</div>
                            <div class="col p-0" style="color:' . $color . '">' . number_format($data['log'][$i]['change']) . '</div>
                        </div>';
            }
        }
        ?>
    </div>
</div>
