function updateEnemies() {
    // Iterate over all enemies, update their movement based on pattern subscripting.
    for (i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];
        if (enemy.index == enemy.pattern.length - 1) {
            enemy.index = 0;
        } else {
            enemy.index++;
        }

        // Update enemy velocities based on next movement pattern.
        switch (enemy.pattern[enemy.index]) {
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
    if (once) {
        once = false;
        // Set enemy spawner.
        spawner.interval = setInterval(function () {
            if (isPlaying && !spawnedBoss) {
                isPlaying = false;
                g.shoot(spawner, 4.71, Math.random() * (512 - 1), 12.5, g.stage, -10, enemies,
                    function () {
                    let enemy;
                    console.log(score);
                    if (score >= 1000 && score <= 2500) {
                        enemy = goblin(g);
                    } else if (score >= 2500 && score <= 3500) {
                        enemy = goose(g);
                    } else if (score < 1000) {
                        enemy = dart(g);
                    }
                    return enemy;
                });
            }
        }, 400);

        // Start update of enemies movement patterns.
        spawner.interval = setInterval(function () {
            updateEnemies();
        }, 300);
    }
}

function dart(g) {
    let sprite = g.sprite("res/images/dart.png");
    sprite.scale.x = sprite.scale.y = 0.8;
    sprite.speed = 8;
    sprite.index = 0;
    sprite.pattern = [
        '|', "|"
    ];
    sprite.health = 1;
    return sprite;
}

function goblin(g) {
    let sprite = g.sprite("res/images/goblin.png");
    sprite.scale.x = sprite.scale.y = 0.8;
    sprite.speed = 7;
    sprite.index = 0;
    sprite.pattern = [
        '|', '<', '<', '<', '>', '<', '<', '|', ">", ">", ">", "<", ">", ">", "|"
    ];
    sprite.health = 1;
    return sprite;
}

function goose(g) {
    let sprite = g.sprite("res/images/goose.png");
    sprite.scale.x = sprite.scale.y = 0.8;
    sprite.speed = 9;
    sprite.index = 0;
    sprite.pattern = [
        '|', '|', '<', '>', '<', '>', '|', '|', "<", ">", "<", ">", "|", "|"
    ];
    sprite.health = 1;
    return sprite;
}

function gooseBoss(g) {
    let sprite = g.sprite("res/images/goose_boss.png");
    sprite.isBoss = true;
    sprite.scale.x = sprite.scale.y = 0.8;
    sprite.anchor.set(0.5, 0.5);
    sprite.speed = 5;
    sprite.index = 0;
    sprite.pattern = [
        '<', '<', '<', '<', '>', '>', '>', '>'
    ];
    sprite.health = 45;
    sprite.interval = setInterval(function () {

        g.shoot(sprite, 4.71, sprite.x-200, 12.5, g.stage, -10, enemies,
            function () {
            enemy = dart(g);
			return enemy;
			});
    }, 300);
    return sprite;
}
