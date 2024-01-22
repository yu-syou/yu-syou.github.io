function Character() {
    this.x = 0;
    this.y = 0;
    this.size = 0;
    this.speed = 0;
}

Character.prototype.init = function (size, speed) {
    this.size = size;
    this.speed = speed;
}

function PlayerBullet() {
    this.x = 0;
    this.y = 0;
    this.size = 0;
    this.speed = 0;
    this.type = 0;
    this.life = false;
}
PlayerBullet.prototype.set = function (x, y, size, speed, type) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.type = type;
    this.life = true;
}
PlayerBullet.prototype.move = function () {
    this.y -= this.speed;


    if (this.y <= 0) {
        this.life = false;
    }
}

function Enemy() {
    this.x = 0;
    this.y = 0;
    this.size = 0;
    this.speed = 0;
    this.type = 0;
    this.life = false;
    this.attack = 0;
    this.theta = 0;
}
Enemy.prototype.set = function (x, y, size, speed, type) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.type = type;
    this.life = true;
    this.attack = 0;
    this.theta = 1;
}
Enemy.prototype.move = function () {
    switch (this.type) {
        case 1:
            this.y += this.speed * Math.sin(this.theta);
            if (this.attack % 60 == 0) {
                this.theta++;
            }
            this.attack++;
            break;
        case 2:
            this.x += this.speed * Math.sin(this.theta);
            if (this.attack % 60 == 0) {
                this.theta++;
            }
            this.attack++;
            break;
        case 3: 
            this.y += this.speed * Math.sin(this.theta);
            if (this.attack % 25 == 0) {
                this.theta++;
            }
            this.attack++;
            break;
    }
    if (this.x >= screenCanvas.width || this.y >= screenCanvas.height || this.x <= 0 || this.y <= 0) {
        this.life = false;
        if(3 == this.type ){
            TYPEA_ENEMY_COUNT = false;
            
        }
    }


}

function EnemyBullet() {
    this.x = 0;
    this.y = 0;
    this.size = 0;
    this.speed = 0;
    this.type = 0;
    this.life = false;
    this.theta = 0;
    this.gravity = 9.8;
    this.ATTACKSIXCOUNT = 0;
}
EnemyBullet.prototype.set = function (x, y, size, speed, type, px, py) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.type = type;
    this.life = true;
    this.px = px;
    this.py = py;
    this.ATTACKSIXCOUNT = 0;
    switch (this.type) {
        case 1: 
        case 2:
        case 10:
            this.theta = Math.atan((this.py - this.y) / (this.px - this.x));
            if (this.px < this.x) {
                this.theta += Math.PI;
            } 
            if (this.px == this.x) {
                this.theta = Math.PI / 2;
                if (this.py < this.y) {
                    this.theta *= -1;
                }
            } else if (this.py == this.y) {
                this.theta = Math.PI;
                if (this.px > this.x) {
                    this.theta *= 2;
                }
            }
            break;
        case 3: 
            this.theta = Math.PI / 6;
            break;
        case 4: 
            this.theta = Math.PI / 3;
            break;
        case 5: 
            this.theta = Math.PI / 2;
            break;
        case 6: 
            this.theta = 2 * Math.PI / 3;
            break;
        case 7: 
            this.theta = 5 * Math.PI / 6;
            break;
        case 8: 
            this.theta = (Math.floor(Math.random() * 17)+ 19) * 10 * Math.PI / 180;  //190 ~ 350
            break;
    }
}
EnemyBullet.prototype.move = function (px, py) {
    switch(this.type){
        case 8:
            this.ATTACKSIXCOUNT++;
            this.x += (this.speed / 3)  * Math.cos(this.theta);
            this.y +=  ((this.speed / 5) * Math.sin(this.theta) * this.ATTACKSIXCOUNT / 50) + (this.gravity / 4) * (this.ATTACKSIXCOUNT / 50) **2;
            break;
        case 9:
            this.theta = Math.atan((py - this.y) / (px - this.x));
            if (px < this.x) {
                this.theta += Math.PI;
            } 
            if (px == this.x) {
                this.theta = Math.PI / 2;
                if (py < this.y) {
                    this.theta *= -1;
                }
            } else if (py == this.y) {
                this.theta = Math.PI;
                if (px > this.x) {
                    this.theta *= 2;
                }
            }
            this.x += (this.speed / 2)  * Math.cos(this.theta);
            this.y += (this.speed / 2) * Math.sin(this.theta);
            break;
        case 10:
            this.x += (this.speed / 2)  * Math.cos(this.theta);
            this.y += (this.speed / 2) * Math.sin(this.theta);
            if(leftPress) this.x -= 2;
            if(rightPress) this.x += 2;
            break;
        default:
            this.x += (this.speed / 2)  * Math.cos(this.theta);
            this.y += (this.speed / 2) * Math.sin(this.theta);
            break;
    }

    if (this.x >= screenCanvas.width || this.x <= 0 || this.y >= screenCanvas.height || this.y <= 0) {
        this.life = false;
    }
}




