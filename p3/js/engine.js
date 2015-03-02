/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

        // Default width of a block tile
        this.spriteWidth = 101;

        // Default height of a block tile
        this.spriteHeight = 82;

        // Global game variables
        this.level = 0;
        this.lives = 3;
        this.score = 0;

        /* This array holds the relative URL to the image used
         * for that particular row of the game level. It will
         * increase in length as the game level increases.
         */
        var rowImages = [
            'images/blank-block.png',   // Blank row to display score and lives
            'images/water-block.png',   // Top row is water
            'images/stone-block.png',   // Row 1 of 3 of stone
            'images/stone-block.png',   // Row 2 of 3 of stone
            'images/stone-block.png',   // Row 3 of 3 of stone
            'images/grass-block.png',   // Row 1 of 2 of grass
            'images/grass-block.png'    // Row 2 of 2 of grass
        ];


        /* numCols and numRows are used to calculate positioning. Canvas width
         * will be the number of columns x the width of a block sprite
         */
        this.numCols = 5;
        this.numRows = rowImages.length;
        this.maxRows = 11;
        canvas.height = numRows * spriteHeight * 0.58;
        this.canvasHeight = canvas.height;
        this.canvasWidth = canvas.width;

        // Used to scale game sprites to fit up to maxRows rows on screen at once
        this.scaleFactorHeight = calculateScaling(this.numRows);

        // Update width and height based on scale factor
        this.spriteWidth = 101 * this.scaleFactorHeight;
        this.spriteHeight = 82 * this.scaleFactorHeight;

        doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
        if (this.lives == 0){
            reset();
        }
    };

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        // checkCollisions();
    }

    /* This is called by the update function  and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to  the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update(dt);
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* Update the number of rows and columns each frame before rendering
         * in case board size has changed.
         */
        var numRows = numRows = rowImages.length,
            numCols = this.numCols,
            row, col;
        /* To get a pixel-perfect canvas size, set the canvas width and height
         * to multiples of the rows and columns of blocks. The height of a
         * block is 121 pixels so 38 needs to be added to the canvas height
         * to display the bottom of the last block.
         */
        canvas.width = numCols * spriteWidth;
        canvas.height = (numRows * spriteHeight + 38 * this.scaleFactorHeight);
        this.canvasWidth = canvas.width;
        this.canvasHeight = canvas.height;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* Since the provided images for the ground blocks occupy the bottom
                * 121 pixels of the 171 pixel image height, offset the blocks by
                * displaying them 50 pixels higher.
                */
                ctx.drawImage(Resources.get(rowImages[row]), col * spriteWidth, (row * spriteHeight-50*this.scaleFactorHeight), spriteWidth, 171*this.scaleFactorHeight);
            }
        }
        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through the list of non-enemy game objects and render them. Game
         * objects include the girlfriend and gems
         */
        gameObjects.forEach(function(entities) {
            entities.render();
        });
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        if (this.lives == 0){
            alert("Game Over");
            lives = 3;
        }
    }

    // Calculate factor by which to scale all sprites such that maxRows fit on screen
    // at once.
    function calculateScaling(rows){
        var factor = Math.floor(window.innerHeight / (spriteHeight + 10)) / maxRows;
        if (factor >= 1) {
            return 1;
        }
        else {
            return factor;
        }
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/blank-block.png',
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/char-pink-girl.png',
        'images/enemy-bug.png',
        'images/enemy-bug2.png',
        'images/char-boy.png',
        'images/Heart.png',
        'images/Gem-Orange.png',
        'images/Gem-Blue.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;

    // Helper method to expand game board by row or column
    global.expandBoard = function (direction) {
        //Add a row to the board by splicing in an image to the array of
        if (direction === "rows"){
            rowImages.splice(2,0,"images/stone-block.png");
            numRows = rowImages.length;
        }
        else {
            numCols+=2;
        }
    };

    /* Helper method to calculate collision between two rectangles.
     * http://stackoverflow.com/questions/2440377/javascript-collision-detection
     * Dimensions are tweaked to allow some overlap
     */
    global.isCollide = function (a, b) {
        return !(
        ((a.y + a.height) < (b.y)) ||
        (a.y > (b.y + b.height/2)) ||
        ((a.x + a.width) < b.x) ||
        (a.x > (b.x + b.width))
        );
    }
})(this);