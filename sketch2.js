var scl = 10;
let s;
let food;
var fr = 7;

var pathFinder = [];
var pathFinder2 = [];

var n = 0;

var colorSet = {
    grass: '#5DD39E',
    snakeHead: '#513B56',
    snakeTail: '#525174',
    food: '#348AA7',
}

var dim = {
    windowH: 200,
    windowW: 200,
}

var IAswitch = true;

function setup() {
    
    createCanvas(dim.windowW, dim.windowH);
    frameRate(fr);

    s = new Snake();
    food = new Food();

    pathFinder[n] = {
        d: dist(s.x, s.y, food.x, food.y),
        dir: previousDir(s.speedX, s.speedY),
    }

    /*
    button = createButton('B O T');
    button.position(dim.windowW, dim.windowH);
    button.mousePressed(changeIA);
    */

}

function draw() {
    background(colorSet.grass);

    food.show();
    s.eat();
    //IA(IAswitch);
    //IA2(IAswitch);
    s.update();
    s.showTheLine(false);
    s.show();

}

function keyPressed() {
    if (keyCode == UP_ARROW) {
        s.dir(0, -1);
    } else if (keyCode == DOWN_ARROW) {
        s.dir(0, 1);
    } else if (keyCode == LEFT_ARROW) {
        s.dir(-1, 0);
    } else if (keyCode == RIGHT_ARROW) {
        s.dir(1, 0);
    }
}

function mouseClicked() {
    //food = new Food();
    //s = new Snake();
}

function IA(activate) {
    if (activate) {
        // 1 current time 'n'
        n++;
        // 2 save the state at the current time 'n'
        pathFinder[n] = {
            d: dist(s.x, s.y, food.x, food.y),
            dir: previousDir(s.speedX, s.speedY),
        }
        // 3 check if snake is closer than the previous time step 'n-1'
        if (pathFinder[n].d < pathFinder[n - 1].d) {
            pathFinder[n].dir = pathFinder[n - 1].dir;
        } else {
            var ndir = pathFinder[n - 1].dir + 1;
            pathFinder[n].dir = ndir % 4;
        }

        s.speedX = nextDir(pathFinder[n].dir).x;
        s.speedY = nextDir(pathFinder[n].dir).y;

        // 4 if the snake is away from 1 scl that means snake is stick to the foos
        if (pathFinder[n].d == scl) {
            if ((s.x == food.x) && (s.y < food.y)) {
                s.speedX = 0;
                s.speedY = 1;
            } else if ((s.x == food.x) && (s.y > food.y)) {
                s.speedX = 0;
                s.speedY = -1;
            } else if ((s.x > food.x) && (s.y == food.y)) {
                s.speedX = -1;
                s.speedY = 0;
            } else if ((s.x < food.x) && (s.y == food.y)) {
                s.speedX = 1;
                s.speedY = 0;
            }
        }
    }

}

function IA2(activate) {
    if (activate) {
        var posX = s.x;
        var posY = s.y;
        var d_n = dist(posX, posY, food.x, food.y);

        for (i = 0; i < 4; i++) {
            var dirn1 = nextDir(i);
            var xn1 = dirn1.x + posX;
            var yn1 = dirn1.y + posY;
            var dn1 = dist(xn1, yn1, food.x, food.y);
            //save
            if (dn1 < d_n) {
                s.dir(dirn1.x, dirn1.y);
            } else {
                s.dir(s.speedX, s.speedY);
            }

        }
    }
}

function changeIA() {
    if (IAswitch) {
        IAswitch = false;
    } else {
        IAswitch = true;
    }
}

function computeNplus1() {
    var d1 = [];
    for (i = 0; i < 4; i++) {
        d1[i] = dist()
    }
}

function previousDir(x, y) {
    var res;
    if ((x == 0) && (y == -1)) { // UP
        res = 0;
    } else if ((x == 0) && (y == 1)) { // DOWN
        res = 2;
    } else if ((x == -1) && (y == 0)) { // LEFT
        res = 3;
    } else if ((x == 1) && (y == 0)) { // RIGHT
        res = 1;
    }
    return res;
}

function nextDir(n) {
    var res = createVector();
    if (n == 0) { // UP
        res.x = 0;
        res.y = -1;
    } else if (n == 1) { // RIGHT
        res.x = 1;
        res.y = 0;
    } else if (n == 2) { // DOWN
        res.x = 0;
        res.y = 1;
    } else if (n == 3) { // LEFT
        res.x = -1;
        res.y = 0;
    }
    return res;
}


class Snake {
    constructor() {
        this.x = scl;
        this.y = scl;
        this.bck = 200;
        this.speedX = 1;
        this.speedY = 0;
        this.nTail = 0;
        this.tail = [];
    }

    show() {
        // show the tail
        noStroke();
        fill(colorSet.snakeTail);
        for (var i = 0; i < this.nTail; i++) {
            var xl = this.tail[i].x;
            var yl = this.tail[i].y;
            rect(xl, yl, scl, scl);
        }
        // show the head
        //noStroke();
        strokeWeight(2);
        stroke(255);
        fill(colorSet.snakeHead);
        rect(this.x, this.y, scl, scl);
    }

    update() {

        // update tail
        for (var i = this.nTail - 1; i >= 0; i--) {
            if (i == 0) {
                this.tail[i].x = this.x;
                this.tail[i].y = this.y;
            } else {
                this.tail[i].x = this.tail[i - 1].x;
                this.tail[i].y = this.tail[i - 1].y;
            }
        }

        // update head
        this.x = this.x + this.speedX * scl;
        this.y = this.y + this.speedY * scl;
        this.borderLess();
    }

    dir(xi, yi) {
        this.speedX = xi;
        this.speedY = yi;
    }

    borderLess() {
        // move the snake to the opposite side
        if (this.x >= width) { //left
            this.x = 0;
        } else if (this.x < 0) { //right
            this.x = width;
        } else if (this.y < 0) { //top
            this.y = height;
        } else if (this.y >= height) { //down
            this.y = 0;
        }
    }

    eat() {
        var d = dist(this.x, this.y, food.x, food.y);
        if (d == 0) {
            this.nTail++;
            this.tail[this.nTail - 1] = createVector(this.x, this.y);
            food = new Food();
        }
    }

    showTheLine(oui) {
        if (oui) {
            strokeWeight(1);
            stroke(200);
            var x1 = food.x + scl / 2;
            var y1 = food.y + scl / 2;
            var x2 = this.x + scl / 2;
            var y2 = this.y + scl / 2;
            line(x1, y1, x2, y2);
        }
    }

}

class Food {
    constructor() {
        this.col = floor(width / scl);
        this.a = floor(random(0, this.col))
        this.x = this.a * scl;

        this.row = floor(height / scl);
        this.b = floor(random(0, this.row));
        this.y = this.b * scl;

        this.bck = 80;
    }

    show() {
        noStroke();
        fill(colorSet.food);
        rect(this.x, this.y, scl, scl);
    }
}