function Boss(){
    this.x = 250;
    this.y = 0;
    this.hp = 200;
    this.size = 100;
    this.attackPattern = 1;
    this.ATTACKONEINTERVAL = 0;
    this.ATTACKTWOINTERVAL = 0;
    this.ATTACKFOURINTERVAL = 0;
    this.ATTACKFIVEINTERVAL = 0;
    this.ATTACKSIXINTERVAL = 0;
    this.attackPattern = 1;
    this.life = true;
    this.speed = [0, 10, 10, 0, 10, 2, 8, 15, 6];
}



function SubBoss(){
    this.x = 0;
    this.y = 0;
    this.hp = 0;
    this.size = 0;
    this.ATTACKTWOINTERVAL = 0;
    this.ATTACKTHREEINTERVAL = 0;
    this.life = false;
}

SubBoss.prototype.set = function(x, y, hp, size){
    this.x = x;
    this.y = y;
    this.hp = hp;
    this.size = size;
    this.life = true;

};  