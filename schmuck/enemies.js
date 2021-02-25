function updateEnemies(){
    for (i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];

        if (enemy.index == enemy.pattern.length-1){
            enemy.index = 0;
        } else {
            enemy.index++;
        }

        switch(enemy.pattern[enemy.index]) {
            // Straight
            case '|':
                enemy.vx = 0;
                enemy.vy = enemy.speed;
                break;
            // Left
            case '<':
                enemy.vx = -1 * enemy.speed;
                enemy.vy = 0;
                break;
            // Right
            case '>':
                enemy.vx = 1 * enemy.speed;
                enemy.vy = 0;
                break;
            // Freeze
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
        }, 400);

        // Start update of enemies movement patterns.
        spawner.interval = setInterval(function(){
            updateEnemies();
        }, 300);
    }
}

function crab(g){
    let sprite = g.sprite("res/images/pissy_frog.png");
    sprite.scale.x = crab.scale.y = 0.4;
    sprite.speed = 6;
    sprite.index = 0;
    sprite.pattern = [
       '|',  '<', '<', '|', ">", ">", "|"
    ];
    return sprite;
}