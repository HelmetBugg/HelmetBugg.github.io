function updateEnemies(){
    for (i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];

        if (enemy.index == enemy.pattern.length){
            enemy.index = 0;
        } else {
            enemy.index++;
        }

        switch(enemy.pattern[enemy.index]) {
            case '|':
                enemy.vx = 0;
                enemy.vy = enemy.speed;
                break;
            case '<':
                enemy.vx = -1 * enemy.speed;
                enemy.vy = 0;
                break;
            case '>':
                enemy.vx = 1 * enemy.speed;
                enemy.vy = 0;
                break;
            default:
                enemy.vx = 0;
                enemy.vy = 0;
        }
    }
}


function spawnEnemies() {
    if (once){
        once = false;
        // Set enemy spawner.
        spawner.interval = setInterval(function(){
            if(isPlaying){
                isPlaying = false;
                g.shoot(spawner, 4.71, Math.random() * (512 - 1), 12.5, g.stage, -10, enemies, 
                function () {
                    let froggy = crab(g);
                    return froggy;
                }); 
            }
        }, 300);

        // Start update of enemies movement patterns.
        spawner.interval = setInterval(function(){
            updateEnemies();
        }, 300);
    }
}

function crab(g){
    let crab = g.sprite("res/images/pissy_frog.png");
    crab.scale.x = crab.scale.y = 0.4;
    crab.speed = 6;
    crab.index = 0;
    crab.pattern = [
       '|',  '<', '<', '|', ">", ">", "|"
    ];
    return crab;
}