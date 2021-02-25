let thingsToLoad = [
    "res/sounds/music.wav",
    "res/sounds/shoot.wav",
    "res/sounds/explosion.wav",
    "res/images/pissy_frog.png",
    "res/images/starship_duck.png"
];

let g = hexi(512, 512, setup, thingsToLoad, load);
g.fps = 30;
let version = 0.3;
let once = false;
let score = 0;

//Optionally scale and align the canvas inside the browser window
g.scaleToWindow();
g.start();
let cats, enemies, title, ship, final_frontier, bullet, spawner, healthbarFg, isPlaying;

function load() {
    //Display the file currently being loaded
    console.log(`loading: ${g.loadingFile}`);
    //Display the percentage of files currently loaded
    console.log(`progress: ${g.loadingProgress}`);
    g.loadingBar();
}

function setup() {
    isPlaying = false;

    music = g.sound("res/sounds/music.wav");
    shootSound = g.sound("res/sounds/shoot.wav");
    enemyDeathSound = g.sound("res/sounds/explosion.wav");

    shootSound.volume = enemyDeathSound.volume = 0.5;

    title = g.text("Schmuck " + version, "38px puzzler", "red");
    g.stage.putCenter(title);
    title.pivotX = 0.5;
    title.pivotY = 0.5;
    playButton = g.text("Play", "38px puzzler", "red");
    playButton.x = 400;
    playButton.y = 350;

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

    bullets = [];
    enemies = [];
    spawner = g.rectangle(512, 5, "white", "white", 0, 0, -5);
    titleScene = g.group(title, playButton);
    gameScene = g.group(healthbarBg, healthbarFg, scoreText);

    g.makeInteractive(playButton);
    playButton.press = function () {
        g.slide(titleScene, -514, 0, 30, "decelerationCubed");
        g.slide(gameScene, -514, 0, 30, "decelerationCubed");
        music.loop = true;
        music.play();
        once = true;
    }

    // controls
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

    g.state = play;
}


function play() {
    isPlaying = true;
    spawnEnemies();

	if (ship.x <= 0){
		ship.x += 5;
	}
	
	if (ship.x >= 490) {
		ship.x -= 5;
	}
	

    g.move(ship);
    g.move(bullets);
    // Removing Bullets out of bounds.
    bullets = bullets.filter(function (bullet) {
        var boundsCollision = g.outsideBounds(bullet, g.stage);
        var enemyCollision = false;
        enemies = enemies.filter(function (enemy) {
            if (g.hit(bullet, enemy)) {
                enemyDeathSound.play();
                g.remove(enemy);
                enemyCollision = true;
                score += 50;
                scoreText.text = "Score: " + score;
                return false;
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
                g.pause();
            }
            g.remove(enemy);
            return false;
        }
        return true;
    });
}
