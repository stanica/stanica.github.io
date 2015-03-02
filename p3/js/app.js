// Enemies our player must avoid
var Enemy = function(row, type) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.width = 101 * scaleFactorHeight;
    this.height = 77 * scaleFactorHeight;
    this.row = row;

    if (type == 1) {
        this.sprite = 'images/enemy-bug.png';

        // 1 = facing right, -1 = facing left
        this.direction = 1;

        // Position enemy off the left side of the screen
        this.x = -spriteWidth * (Math.floor(Math.random() * 3) + 1);
    }
    else if (type == 2){
        this.sprite = 'images/enemy-bug2.png';

        // 1 = facing right, -1 = facing left
        this.direction = -1;

        // Position enemy off the right side of the screen
        this.x = canvasWidth + (spriteWidth * (Math.floor(Math.random() * 3) + 1));
    }
    // Position enemy randomly between the water and grass
    this.y = row * spriteHeight + spriteHeight * 2 + 5;

    // Enemies move faster the closer they are to girlfriend
    this.speed = (numRows - row) * 100 - ((numRows - row) * 100) / 2;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.direction * this.speed * dt;
    if (this.direction == 1 && this.x > canvasWidth){
        //Position enemy off the left side of the screen
        this.x = -spriteWidth * (Math.floor(Math.random() * Math.floor(this.speed/100)) +1);
    }
    else if (this.direction == -1 && this.x < -spriteWidth){
        //Position enemy off the right side of the screen
        this.x = canvasWidth + (spriteWidth * (Math.floor(Math.random() * 3) + 1));
    }
    //Position enemy randomly between the water and grass
    this.y = (this.row) * spriteHeight + spriteHeight*2 + 5;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
};

// Set up initial player variables
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.livesSprite = 'images/Heart.png';
    this.width = 67 * scaleFactorHeight;
    this.height = 88 * scaleFactorHeight;
    this.livesWidth = 67 * scaleFactorHeight;
    this.livesHeight = 60 * scaleFactorHeight;

    //Center player on board
    this.resetPosition();
};

// Handle all collisions between player and all game objects
Player.prototype.update = function(dt) {
    for (var x=0; x<allEnemies.length; x++) {
        if (isCollide(this, allEnemies[x])){
            lives --;
            this.resetPosition();
        }
    }
    // Loop through all game objects and check for collision
    gameObjects.forEach(function(entity){
        if (isCollide(player, entity)){
            if(entity instanceof Girlfriend){
                levelUp(this);
                girlfriend.resetPosition();
            }
            else if (entity instanceof Gem){
                score += entity.value;

                // On collision with gem, remove gem from game objects list
                if (gameObjects[gameObjects.indexOf(entity)].id == entity.id) {
                    gameObjects.splice(gameObjects.indexOf(entity), 1);
                }
            }
        }
    });
};
// Draw player and lives on screen
Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);

    // Draw hearts at the top right
    for(var i = 0; i< lives; i++){
        ctx.drawImage(Resources.get(this.livesSprite), (numCols - i - 1) * spriteWidth + 15, 15 * scaleFactorHeight, this.livesWidth, this.livesHeight);
    }
    //Draw score at the top left
    ctx.font = "bold 16px Arial";
    var fontArgs = ctx.font.split(' ');
    var newSize = Math.floor(76 * scaleFactorHeight)+'px';
    ctx.font = newSize + ' ' + fontArgs[fontArgs.length - 1]; // Resize font depending on resolution
    ctx.fillText(score, 0, 70 * scaleFactorHeight);

    //Draw level at the bottom right
    ctx.fillStyle = "white";
    ctx.fillText("Level: " + level, canvasWidth-(310*scaleFactorHeight), canvasHeight - 5);
};

Player.prototype.handleInput = function(key) {
    if (key === "left" && this.x - this.width >= 0){
        this.x -= spriteWidth;
    }
    else if (key === "right" && this.x + this.width * 2 <= canvasWidth){
        this.x += spriteWidth;
    }
    else if (key === "up" && this.y - this.height * 2 >= 0){
        this.y -= spriteHeight;
    }
    else if (key === "down" && this.y + spriteHeight  < canvasHeight - this.height){
        this.y += spriteHeight;
    }
};

// Reset position of player to center of game board
Player.prototype.resetPosition = function (){
    //Place the player in the bottom grass layer in the center of the middle column
    this.x =  (Math.floor((numCols / 2 * spriteWidth)) - this.width / 2) ;

    //Position player on the lowest row of blocks
    this.y = numRows * spriteHeight - this.height*1.2;
};

// Set up initial girlfriend variables
var Girlfriend = function () {
    this.sprite = 'images/char-pink-girl.png';
    this.width = 76 * scaleFactorHeight;
    this.height = 88 * scaleFactorHeight;

    // Position girlfriend on the top-most row of stone
    this.y = (spriteHeight * 2 - this.height /2.5) ;
    this.resetPosition();
};

// Draw girlfriend on screen
Girlfriend.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
};

// Reset girlfriend to a random column on the top-most row of stone
Girlfriend.prototype.resetPosition = function() {
    this.x = Math.floor((Math.random() * numCols)) * spriteWidth + ((spriteWidth - this.width) / 2);
};

// Set up initial gem variables
var Gem = function (sprite, value, type) {
    this.sprite = sprite;
    this.value = value;
    this.width = 51 * scaleFactorHeight;
    this.height = 56 * scaleFactorHeight;
    this.id = gameObjects.length;
    this.type = type;

    this.resetPosition();
};

// Draw gem on screen
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
}

// Reset gem position
Gem.prototype.resetPosition = function(){
    // Pick a random column and center the gem in that column
    this.x = Math.floor((Math.random() * numCols)) * spriteWidth + ((spriteWidth - this.width) / 2);

    // Pick a row that isn't the row with the girlfriend
    this.y = Math.floor(((Math.random() * (numRows - 5)) + 3)) * spriteHeight + ((spriteHeight - this.height) / 2 );
}

// Handle level up logic
var levelUp = function () {
    var orangeGemExists = false;
    var blueGemExists = false;
    gameObjects.forEach(function(entities) {

        //Avoid adding duplicate instances of the Gem object to the game object list
        if (entities instanceof Gem && entities.type == 'orange'){
            orangeGemExists = true;
            entities.resetPosition();
        }
        if (entities instanceof Gem && entities.type == 'blue'){
            blueGemExists = true;
            entities.resetPosition();
        }
    });

    //Create gem type based on level
    if (!orangeGemExists){
        var orangeGem = new Gem('images/Gem-Orange.png', 100, 'orange');
        gameObjects.push(orangeGem);
    }
    if (level > 3 && !blueGemExists){
        var blueGem = new Gem('images/Gem-Blue.png', 300, 'blue');
        gameObjects.push(blueGem);
    }
    level++;
    if (level > 1 && level < 6){
        expandBoard("rows"); // Can expand columns as well
    }
    allEnemies = [];
    for (var x=0; x<numRows-4; x++) {
        var enemy;

        /* 25% chance to generate an enemy moving the opposite direction
        * if level is greater than 2
        */
        if (level > 2 && Math.floor(Math.random()*4) == 3) {
            enemy = new Enemy(x, 2);
        }
        else {
            enemy = new Enemy(x, 1);
        }
        allEnemies.push(enemy);
    }
    player.resetPosition();
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player();
var girlfriend = new Girlfriend();
var gameObjects = [];
gameObjects.push(girlfriend);
var allEnemies = [];
levelUp();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        87: 'up',
        65: 'left',
        83: 'down',
        68: 'right'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
