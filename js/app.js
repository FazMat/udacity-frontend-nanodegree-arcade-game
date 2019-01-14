const stars = document.getElementById('stars');
const lives = document.getElementById('lives');
const score = document.getElementById('score');
const restartBtn = document.getElementById('restartBtn');

// Enemies our player must avoid
var Enemy = function() {
        // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    //randomized enemy
    this.randomStart();
};

//function to randomize enemies
Enemy.prototype.randomStart = function() {
    this.x = -150;
    this.y = Math.random() * 190 + 40;
    this.speed = Math.floor(Math.ceil(Math.random() * player.level)) * 20;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += dt * this.speed;
    if (this.x > 500) {
        this.randomStart();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';
    //manage game difficulty
    //the higher the level the more enemies
    //gain a level with drowning (y < 64)
    this.level = 0;
    this.lives = 3;
    this.best = 0;
};

//function to reset player character
Player.prototype.fixedStart  = function() {
    this.x = 202;
    this.y = 400;
    this.alive = true;
    this.hasStar = false;
    if (!allItems[0]) allItems.push(new Item('Star'));
    lives.innerText = this.lives;
    stars.innerText = this.level;
}

//function to be called every frame
//contains game logic
Player.prototype.update = function() {
    //stay on screen
    if (this.x < 0) this.x = 0;
    if (this.x > 404) this.x = 404;
    if (this.y > 400) this.y = 400;
    //can't go into water without a star
    if (!this.hasStar && this.y < 64) this.y = 64;
    //level done, start next level
    if (this.alive && this.y < 64) {
        //level up
        stars.innerText = ++this.level;
        allEnemies.push(new Enemy());
        this.alive = false;
        //keep record of best score
        if (this.level > this.best) this.best = this.level;
        //let 'animation' finish first
        setTimeout(this.fixedStart.bind(this), 100);
    }
    if (this.alive) {
        this.pickUpItem();
        this.getEaten();
    }
};

//pick up any item where you stand
//only stars at the moment
Player.prototype.pickUpItem = function() {
    for (let i = 0; i < allItems.length; i++) {
        let item = allItems[i];
        if (item.x == this.x && item.y == this.y) {
            this.hasStar = true;
            allItems.splice(i, 1);
        }
    }
}

//check collisions with enemies
Player.prototype.getEaten = function() {
    //allEnemies.forEach(function(bug) {
    for (let i = 0; i < allEnemies.length; i++) {
        let bug = allEnemies[i];
        if (bug.x + 70 > this.x &&
            bug.x < this.x + 70 &&
            bug.y + 70 > this.y &&
            bug.y < this.y + 70) {
                this.alive = false;
                this.hasStar = false;
                setTimeout(this.fixedStart.bind(this), 100);
                if (--this.lives == 0) {
                    score.firstElementChild.textContent = `Best score: ${this.best}`;
                    score.style.visibility = 'visible';
                }
                return;
            }
    }
}

//function to restart the game with 3 lives
Player.prototype.restart = function() {
    player.lives = 3;
    player.level = 0;
    allItems = [];
    allEnemies = [];
    player.fixedStart();
    score.style.visibility = 'hidden';
}

//function to draw character on screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//function to control player character movement
Player.prototype.handleInput = function(key) {
    if (this.lives) {
        switch (key) {
            case 'left':
                this.x -= 101;
            break;
            case 'right':
                this.x += 101;
            break;
            case 'up':
                this.y -= 84;
            break;
            case 'down':
                this.y += 84;
            break;
        }
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let allItems = [];
let allEnemies = [];
let player = new Player();



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

//item class to display collectibles
var Item = function(type) {
    this.type = type;
    this.sprite = `images/${type}.png`;
    this.x = Math.floor(Math.random() * 5) * 101;
    this.y = Math.floor(Math.random() * 3) * 84 + 64;
};

//function to render items
Item.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

//start the game by placing player on screen
player.fixedStart();
restartBtn.addEventListener('click', player.restart);