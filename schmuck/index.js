let thingsToLoad = [
    "res/sounds/music.wav",
    "res/sounds/shoot.wav",
    "res/sounds/explosion.wav",
    "res/images/goblin.png",
    "res/images/dart.png",
    "res/images/goose.png",
    "res/images/starship_duck.png",
    "res/images/goose_boss.png",
	"res/sounds/bounce.wav"
];

let g = hexi(512, 512, setup, thingsToLoad, load);
g.fps = 30;
let once = false;
let score = 0;
g.scaleToWindow();
g.start();
let cats, enemies, title, ship, final_frontier, bullet, spawner, healthbarFg, isPlaying, spawnedBoss, creditsButton;

function load() {
    //Display the file currently being loaded
    console.log(`loading: ${g.loadingFile}`);
    //Display the percentage of files currently loaded
    console.log(`progress: ${g.loadingProgress}`);
    g.loadingBar();
}

function setup() {
    isPlaying = false;
    spawnedBoss = false;

    // Configure Sound files.
    music = g.sound("res/sounds/music.wav");
    shootSound = g.sound("res/sounds/shoot.wav");
    enemyDeathSound = g.sound("res/sounds/explosion.wav");
	enemyHitSound = g.sound("res/sounds/bounce.wav");
	//enemyDeathSound.playbackRate = 0.5;
    shootSound.volume = enemyDeathSound.volume = 0.5;

    title = g.text("Schmuck ", "38px puzzler", "red");
    g.stage.putCenter(title);
    title.pivotX = title.pivotY = 0.5;
    playButton = g.text("Play", "38px puzzler", "red");
    playButton.x = 400;
    playButton.y = 350;

    creditsButton = g.text("Credits", "38px puzzler", "red");
    creditsButton.x = 400;
    creditsButton.y = 400;

    scoreText = g.text("Score: " + score, "14px puzzler", "yellow");

    finalFrontier = g.rectangle(512, 512, "black");
    healthbarFg = g.rectangle(100, 20, "red");
    healthbarBg = g.rectangle(100, 20, "white");
    healthbarBg.y = healthbarFg.y = 491;
    healthbarBg.x = healthbarFg.x = 513;
    scoreText.y = 491;
    scoreText.x = 620;

    ship = g.sprite("res/images/starship_duck.png");
    ship.x = 238;
    ship.y = 400;
    ship.scale.x = ship.scale.y = 0.7;
    shipSpeedLeft = -5;
    shipSpeedRight = 5;

    creditsText = g.text("Created By:\n  Warren Squires\n  Benjamin Keane\n  Brandon Wood", "32px Futura", "white", -258, 256);
    creditsReturnButton = g.text("Return", "38px puzzler", "red");
    creditsReturnButton.x = -114;
    creditsReturnButton.y = 400;

    bullets = [];
    enemies = [];
    spawner = g.rectangle(512, 5, "white", "white", 0, 0, -5);
    titleScene = g.group(title, playButton, creditsButton);
    gameScene = g.group(healthbarBg, healthbarFg, scoreText);
    creditsScene = g.group(creditsText, creditsReturnButton);

    g.makeInteractive(playButton);
    playButton.press = function () {
        g.slide(titleScene, -514, 0, 30, "decelerationCubed");
        g.slide(gameScene, -514, 0, 30, "decelerationCubed");
        music.loop = true;
        music.play();
        once = true;
    }

    g.makeInteractive(creditsButton);
    creditsButton.press = function () {
        g.slide(titleScene, 514, 0, 30, "decelerationCubed");
        g.slide(creditsScene, 514, 0, 30, "decelerationCubed");
    }

    g.makeInteractive(creditsReturnButton);
    creditsReturnButton.press = function () {
        g.slide(titleScene, 0, 0, 30, "decelerationCubed");
        g.slide(creditsScene, 0, 0, 30, "decelerationCubed");
    }

    // Initialize Player Controls
    let leftArrow = g.keyboard(37),
    upArrow = g.keyboard(38),
    rightArrow = g.keyboard(39),
    downArrow = g.keyboard(40),
    space = g.keyboard(32);
    leftArrow.press = () => {
        ship.vx = shipSpeedLeft;

    };
    leftArrow.release = () => {
        if (!rightArrow.isDown) {
            ship.vx = 0;
        } else {
            ship.vx = shipSpeedRight;
        }
    };
    rightArrow.press = () => {
        ship.vx = shipSpeedRight;

    };
    rightArrow.release = () => {
        if (!leftArrow.isDown) {
            ship.vx = 0;
        } else {
            ship.vx = shipSpeedLeft;
        }
    };
    space.press = () => {
        shootSound.play();
        g.shoot(ship, 4.71, 12.5, 12.5, g.stage, 10, bullets,
            function () {
            return g.circle(8, "yellow");
        });
    };

    // Start the main game loop.
    g.state = play;
}

function play() {
    isPlaying = true;
    spawnEnemies();

    if (ship.x <= 0) {
        ship.x += 5;
    } else if (ship.x >= 490) {
        ship.x -= 5;
    }
    g.move(ship);

    // Waiting for the right time to spawn the boss, just one boss sprite.
    if (score > 3750 && spawnedBoss == false) {
        spawnedBoss = true;
        g.shoot(spawner, 4.71, 256, 12.5, g.stage, -10, enemies, function () {
            return gooseBoss(g);
        });
    }

    g.move(bullets);
    // Removing Bullets out of bounds or that collide with enemies.
    bullets = bullets.filter(function (bullet) {
        var boundsCollision = g.outsideBounds(bullet, g.stage);
        var enemyCollision = false;
        enemies = enemies.filter(function (enemy) {
            if (g.hit(bullet, enemy)) {
                enemy.health = enemy.health - 1;
                if (enemy.health <= 0) {
                    enemyDeathSound.play();
                    g.remove(enemy);
                    enemyCollision = true;
                    score += 50;
                    scoreText.text = "Score: " + score;
					if (enemy.isBoss){
						winrar = g.text("You Are WinRAR ", "38px puzzler", "yellow")
						winrar.x = 256;
						winrar.y = 256;
						winrar.anchor.set(0.5, 0.5);
						clearInterval(enemy.interval);

					}
                    return false;
                }
                enemyCollision = true;
                g.shake(enemy, 0.05, true);
				enemyHitSound.play();
            }
            return true;
        });

        if (boundsCollision || enemyCollision) {
            g.remove(bullet);
            return false;
        }
        return true;
    });

    g.move(enemies);
    enemies = enemies.filter(function (enemy) {
        if (g.hit(ship, enemy)) {
            enemyDeathSound.play();
            healthbarFg.x -= 40;
            if (healthbarFg.x <= 413) {
                gameOver = g.text("Game Over", "42px puzzler", "red");
                gameOver.x = g.canvas.height / 2;
                gameOver.setPivot(0.5, 0.5);
                clearInterval(spawner.interval);
				clearInterval(enemy.interval);
                g.pause();
            }
            g.remove(enemy);
            return false;
        }
        return true;
    });
}
