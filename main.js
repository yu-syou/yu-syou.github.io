var screenCanvas, info, score;
var SCORE = 0;  //キャンバスに使う
var BossHP;
var subBoss1HP;
var subBoss2HP;
var gameRun = true;  //ゲーム全体の進行フラグ
var fps = 1000 / 50;  //1秒間に50回ロード
var ctx;  //キャンバスに描画
var counter = 0;  //開始からのフレーム
var leftPress = false;  //左移動
var rightPress = false; //右
var upPress = false;  //上
var downPress = false; //下
var player;  //プレイヤー格納
var enemyInfo;  //敵情報を格納
var enemyBulletInfo; //敵が撃った弾の情報を格納
var codeDown, codeUp;  //どのキーが押されたか/離されたか
var typeRandom;  //敵のタイプ決定
var xRandom, yRandom;  //敵の初期座標
var playerBulletInfo;  //プレイヤーの弾情報
var PlayerShot = 0;  //プレイヤーショット
var PlayerBomb = true; //bボタンが押せる
var GameClear = false;

var PLAYER_COLOR = "rgba(255, 255, 255, 0.8)";
var ENEMY_COLOR = "rgba(255, 0, 0, 0.9)";
var BULLET_COLOR = "rgba(220, 220, 0, 0.8)";
var NORMAL_ENEMY_MAX = 10;
var TYPEA_ENEMY_COUNT = false;
var TYPEA_SPAWN_INTERVAL = 0;
var ENEMY_SPAWN_INTERVAL = 100;
var PLAYER_BULLET_MAX = 6;
var ENEMY_BULLET_MAX = 50;
var PLAYER_ATTACK_INTERVAL = 25;

var ENEMY_SPAWN_PATTERN = 1; //エネミーの出現パターンの管理

var boss; //ボスの情報管理
var subBoss; //サブボスの情報管理
var SUBONE = false; //サブボス1の出現フラグ
var SUBTWO = false; //サブボス2の出現フラグ


window.onload = function () {
    var i, j, k;

    ENEMY_SPAWN_INTERVAL = 100;
    screenCanvas = document.getElementById("screen");
    screenCanvas.width = 500;
    screenCanvas.height = 500;

    ctx = screenCanvas.getContext("2d");

    var BossHP = document.getElementById("bossHP");
    var subBoss1HP = document.getElementById("subBoss1HP");
    var subBoss2HP = document.getElementById("subBoss2HP");

    window.addEventListener("keydown", keyDown, true);
    window.addEventListener("keyup", keyUp, true);

    info = document.getElementById("info");
    info.innerHTML = "　　　　　　　　　　　　　　　　　　　　　　十字キーで移動  スペースキーで弾発射  bボタンで一回限りの特別な弾が打てます  死んだらSボタン"

    score = document.getElementById("score");
    score.innerHTML = "　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　score:" + SCORE;

    GameClear = false;
    //プレイヤー作成
    player = new Character();
    player.init(10, 5);
    player.x = screenCanvas.width / 2;
    player.y = screenCanvas.height / 2;

    //すべての敵情報を初期化
    enemyInfo = new Array(NORMAL_ENEMY_MAX);
    for (i = 0; i < NORMAL_ENEMY_MAX; i++) {
        enemyInfo[i] = new Enemy();
    }
    //すべてのプレイヤーの弾情報を初期化
    playerBulletInfo = new Array(PLAYER_BULLET_MAX);
    for (i = 0; i < PLAYER_BULLET_MAX; i++) {
        playerBulletInfo[i] = new PlayerBullet();
    }
    //すべての敵の弾情報を初期化
    enemyBulletInfo = new Array(ENEMY_BULLET_MAX);
    for (i = 0; i < ENEMY_BULLET_MAX; i++) {
        enemyBulletInfo[i] = new EnemyBullet();
    }

    boss = new Boss();

    subBoss = new Array(2);
    for (i = 0; i < 2; i++) {
        subBoss[i] = new SubBoss();
    }

    (function () {
        if (counter % 1000 == 0 && ENEMY_SPAWN_INTERVAL >= 80) { //20秒ごとに敵出現間隔が短くなる
            ENEMY_SPAWN_INTERVAL -= 10;
        }
        if (!TYPEA_ENEMY_COUNT) {
            TYPEA_SPAWN_INTERVAL++;
        }
        if (counter % PLAYER_ATTACK_INTERVAL == 0) {
            for (i = 0; i < PLAYER_BULLET_MAX; i++) {
                if (!playerBulletInfo[i].life) {
                    playerBulletInfo[i].set(player.x, player.y, 6, 8, 0);  //座標・サイズ・スピード・タイプ
                    break;
                }

            }
        }
        if (ENEMY_SPAWN_PATTERN == 3) {
            if (!subBoss[0].life && !SUBONE) {
                subBoss[0].set(75, 0, 100, 50);
                SUBONE = true;
            }
            if (!subBoss[1].life && !SUBTWO) {
                subBoss[1].set(425, 0, 100, 50);
                SUBTWO = true;
            }
            switch (counter) {
                case 0: case 4850:
                    boss.attackPattern = 1;
                    if (counter == 4850) counter = 0;
                    BulletDelete();
                    boss.ATTACKONEINTERVAL = 0;
                    break;
                case 500:
                    if (subBoss[0].life || subBoss[1].life) boss.attackPattern = 2;
                    else counter += 1000;
                    BulletDelete();
                    boss.ATTACKTWOINTERVAL = 0;
                    subBoss[0].ATTACKTWOINTERVAL = 0;
                    subBoss[1].ATTACKTWOINTERVAL = 0;
                    break;
                case 1500:
                    if (subBoss[0].life || subBoss[1].life) boss.attackPattern = 3;
                    else counter += 740;
                    BulletDelete();
                    subBoss[0].ATTACKTHREEINTERVAL = 0;
                    subBoss[1].ATTACKTHREEINTERVAL = 0;
                    break;
                case 2250:
                    boss.attackPattern = 4;
                    BulletDelete();
                    boss.ATTACKFOURINTERVAL = 0;
                    break;
                case 2950:
                    boss.attackPattern = 5;
                    BulletDelete();
                    boss.ATTACKFIVEINTERVAL = 0;
                    break;
                case 4050:
                    boss.attackPattern = 6;
                    BulletDelete();
                    boss.ATTACKSIXINTERVAL = 0;
                    break;
            }
            console.log(boss.attackPattern + " time:" + counter);
        }

        counter++;
        score.innerHTML = "　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　score:" + SCORE;


        
        //座標の調整
        if (leftPress == true) {
            player.x -= player.speed;
        } if (rightPress == true) {
            player.x += player.speed;
        } if (upPress == true) {
            player.y -= player.speed;
        } if (downPress == true) {
            player.y += player.speed;
        }

        if (player.y >= screenCanvas.height) {
            player.y = screenCanvas.height
        } else if (player.y <= 0) {
            player.y = 0;
        }
        if (player.x >= screenCanvas.width) {
            player.x = screenCanvas.width;
        } else if (player.x <= 0) {
            player.x = 0;
        }
        if (ENEMY_SPAWN_PATTERN != 3 && counter % ENEMY_SPAWN_INTERVAL == 0) {  //敵出現
            for (i = 0; i < NORMAL_ENEMY_MAX; i++) {
                if (!enemyInfo[i].life) {
                    switch (ENEMY_SPAWN_PATTERN) {
                        case 1:
                            //ノーマルエネミーの設定
                            ENEMY_SPAWNPATTERN_ONE(i);
                            break;
                        case 2:
                            //TYPEAとノーマルエネミーの設定
                            ENEMY_SPAWN_PATTERN_TWO(i);
                            break;
                    }
                    break;
                }
            }
        }



        if (ENEMY_SPAWN_PATTERN == 3) {
            BossHP.innerHTML = "　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　bossHP:" + boss.hp;
            subBoss1HP.innerHTML = "　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　subBoss1HP:" + subBoss[0].hp;
            subBoss2HP.innerHTML = "　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　subBoss2HP:" + subBoss[1].hp;
        } else {
            BossHP.innerHTML = "";
            subBoss1HP.innerHTML = "";
            subBoss2HP.innerHTML = "";
        }


        //プレイヤーのショットの設定
        switch (PlayerShot) {
            case 1:
                for (i = 0; i < PLAYER_BULLET_MAX; i++) {
                    if (!playerBulletInfo[i].life) {
                        playerBulletInfo[i].set(player.x, player.y, 6, 8, 0);  //座標・サイズ・スピード・タイプ
                        break;
                    }
                    PlayerShot = 0;

                }
                break;
            case 2:
                EnemyDeltete();
                BulletDelete();
                PlayerShot = 0;

                break;
        }




        //自機の描画
        ctx.clearRect(0, 0, screenCanvas.width, screenCanvas.height);
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2, false);
        ctx.fillStyle = PLAYER_COLOR;
        ctx.fill();


        //エネミーの描画
        if (ENEMY_SPAWN_PATTERN == 1 || ENEMY_SPAWN_PATTERN == 2) {

            ctx.beginPath();
            for (i = 0; i < NORMAL_ENEMY_MAX; i++) {
                if (enemyInfo[i].life) {

                    enemyInfo[i].move();
                    ctx.arc(enemyInfo[i].x, enemyInfo[i].y, enemyInfo[i].size, 0, Math.PI * 2, false);
                    ctx.closePath();
                    switch (enemyInfo[i].type) {
                        case 1: case 2:
                            if (enemyInfo[i].attack % 50 == 0) {  //敵が攻撃してくる
                                for (j = 0; j < ENEMY_BULLET_MAX; j++) {
                                    if (!enemyBulletInfo[j].life) {
                                        enemyBulletInfo[j].set(enemyInfo[i].x, enemyInfo[i].y, 6, 4, 1, player.x, player.y);
                                        break;
                                    }
                                }
                            }
                            break;
                        case 3:
                            if (enemyInfo[i].attack % 40 == 0) {  //敵が攻撃してくる
                                for (k = 3; k < 8; k++) {
                                    for (j = 0; j < ENEMY_BULLET_MAX; j++) {
                                        if (!enemyBulletInfo[j].life) {
                                            enemyBulletInfo[j].set(enemyInfo[i].x, enemyInfo[i].y, 12, 5, k, 0, 0);
                                            break;
                                        }
                                    }
                                }
                            }
                            break;
                    }

                }
            }
            ctx.fillStyle = ENEMY_COLOR;
            ctx.fill();
        } else if (boss.life) { //ボス
            ctx.beginPath();
            ctx.arc(boss.x, boss.y, boss.size, 0, Math.PI, false);
            ctx.closePath();

            switch (boss.attackPattern) {
                case 1:
                    boss.ATTACKONEINTERVAL++;
                    if (subBoss[0].life || subBoss[1].life) {
                        if (boss.ATTACKONEINTERVAL % 70 == 0) {
                            for (i = 0; i < ENEMY_BULLET_MAX; i++) {
                                if (!enemyBulletInfo[i].life) {
                                    enemyBulletInfo[i].set(boss.x, boss.y, 20, boss.speed[boss.attackPattern], 1, player.x, player.y);
                                    break;
                                }
                            }
                        }
                        if (boss.ATTACKONEINTERVAL % 50 == 0) {
                            for (i = 0; i < 2; i++) {
                                if (subBoss[i].life) {
                                    for (j = 0; j < ENEMY_BULLET_MAX; j++) {
                                        if (!enemyBulletInfo[j].life) {
                                            enemyBulletInfo[j].set(subBoss[i].x, subBoss[i].y, 20, 6, 1, player.x, player.y);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        if (boss.ATTACKONEINTERVAL % 10 == 0) {
                            for (i = 0; i < ENEMY_BULLET_MAX; i++) {
                                if (!enemyBulletInfo[i].life) {
                                    typeRandom = Math.floor(Math.random() * 2) + 4;
                                    enemyBulletInfo[i].set(boss.x, boss.y, 20, typeRandom, 1, player.x, player.y);
                                    break;
                                }
                            }
                        }
                    }


                    break;
                case 2:


                    if (boss.ATTACKTWOINTERVAL % 70 == 0) {
                        for (i = 3; i < 8; i++) {
                            for (j = 0; j < ENEMY_BULLET_MAX; j++) {
                                if (!enemyBulletInfo[j].life) {
                                    enemyBulletInfo[j].set(boss.x, boss.y, 20, boss.speed[boss.attackPattern], i, 0, 0);
                                    break;
                                }
                            }
                        }
                    }
                    for (i = 0; i < 2; i++) {
                        if (subBoss[i].ATTACKTWOINTERVAL % 50 == 0 && subBoss[i].life) {
                            for (j = 3; j < 8; j++) {
                                for (k = 0; k < ENEMY_BULLET_MAX; k++) {
                                    if (!enemyBulletInfo[k].life) {
                                        switch (i) {
                                            case 0:
                                                enemyBulletInfo[k].set(subBoss[i].x, subBoss[i].y, 20, 10, j, 0, 0);
                                                break;
                                            case 1:
                                                enemyBulletInfo[k].set(subBoss[i].x, subBoss[i].y, 20, 10, j, 0, 0);
                                                break;
                                        }
                                        break;

                                    }
                                }
                            }
                        }
                        subBoss[i].ATTACKTWOINTERVAL++;
                    }
                    boss.ATTACKTWOINTERVAL++;
                    break;
                case 3:
                    for (i = 0; i < 2; i++) {
                        if (subBoss[i].ATTACKTHREEINTERVAL == 0 && subBoss[i].life) {
                            for (j = 0; j < ENEMY_BULLET_MAX; j++) {
                                if (!enemyBulletInfo[j].life) {
                                    enemyBulletInfo[j].set(subBoss[i].x, subBoss[i].y, 20, 10, 9, player.x, player.y);
                                    break;
                                }
                            }
                        }
                        subBoss[i].ATTACKTHREEINTERVAL++;
                    }


                    break;
                case 4:

                    if (boss.ATTACKFOURINTERVAL == 0) {
                        for (i = 0; i < ENEMY_BULLET_MAX; i++) {
                            if (!enemyBulletInfo[i].life) {
                                enemyBulletInfo[i].set(boss.x, boss.y, 20, 8, 9, player.x, player.y);
                                break;
                            }
                        }
                    }
                    boss.ATTACKFOURINTERVAL++;
                    if (boss.ATTACKFOURINTERVAL % 40 == 0) {
                        for (i = 0; i < ENEMY_BULLET_MAX; i++) {
                            if (!enemyBulletInfo[i].life) {
                                if (subBoss[0].life || subBoss[1].life) enemyBulletInfo[i].set(boss.x, boss.y, 20, boss.speed[boss.attackPattern], 1, player.x, player.y);
                                else enemyBulletInfo[i].set(boss.x, boss.y, 20, boss.speed[boss.attackPattern] * 1.5, 1, player.x, player.y);
                                break;
                            }
                        }
                    }
                    break;
                case 5:
                    if (boss.ATTACKFIVEINTERVAL == 0) {
                        for (i = 0; i < ENEMY_BULLET_MAX; i++) {
                            if (!enemyBulletInfo[i].life) {
                                enemyBulletInfo[i].set(boss.x, boss.y, 20, 3, 9, player.x, player.y);
                                break;
                            }
                        }
                    }
                    if (subBoss[0].life || subBoss[1].life) {
                        if (boss.ATTACKFIVEINTERVAL % 100 == 0) {
                            for (i = 3; i < 8; i++) {
                                for (j = 0; j < ENEMY_BULLET_MAX; j++) {
                                    if (!enemyBulletInfo[j].life) {
                                        enemyBulletInfo[j].set(boss.x, boss.y, 20, boss.speed[boss.attackPattern], i, 0, 0);
                                        break;
                                    }
                                }
                            }
                        }
                    } else {
                        if (boss.ATTACKFIVEINTERVAL % 80 == 0) {
                            for (i = 3; i < 8; i++) {
                                for (j = 0; j < ENEMY_BULLET_MAX; j++) {
                                    if (!enemyBulletInfo[j].life) {
                                        enemyBulletInfo[j].set(boss.x, boss.y, 20, boss.speed[boss.attackPattern], i, 0, 0);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    boss.ATTACKFIVEINTERVAL++;
                    break;
                case 6:
                    boss.ATTACKSIXINTERVAL++;
                    if (boss.ATTACKSIXINTERVAL % 5 == 0) {
                        for (i = 0; i < ENEMY_BULLET_MAX; i++) {
                            if (!enemyBulletInfo[i].life) {
                                enemyBulletInfo[i].set(boss.x, 100, 20, boss.speed[boss.attackPattern], 8, 0, 0);
                                break;
                            }
                        }
                    }
                    break;

            }


            for (i = 0; i < 2; i++) {
                if (subBoss[i].life) {
                    ctx.arc(subBoss[i].x, subBoss[i].y, subBoss[i].size, 0, Math.PI, false);
                }
            }
            ctx.fillStyle = ENEMY_COLOR;
            ctx.fill();
        }

        //自機ショットの描画
        ctx.beginPath();
        for (i = 0; i < PLAYER_BULLET_MAX; i++) {
            if (playerBulletInfo[i].life) {
                playerBulletInfo[i].move(player.x, player.y);
                ctx.arc(playerBulletInfo[i].x, playerBulletInfo[i].y, playerBulletInfo[i].size, 0, Math.PI * 2, false);
                ctx.closePath();
            }
        }
        ctx.fillStyle = PLAYER_COLOR;
        ctx.fill();

        //エネミーショットの描画
        ctx.beginPath();
        for (i = 0; i < ENEMY_BULLET_MAX; i++) {
            if (enemyBulletInfo[i].life) {
                enemyBulletInfo[i].move(player.x, player.y);
                ctx.arc(enemyBulletInfo[i].x, enemyBulletInfo[i].y, enemyBulletInfo[i].size, 0, Math.PI * 2, false);
                ctx.closePath();
            }
        }
        ctx.fillStyle = BULLET_COLOR;
        ctx.fill();


        //プレイヤーショットとエネミーの衝突判定
        for (i = 0; i < PLAYER_BULLET_MAX; i++) {
            switch (ENEMY_SPAWN_PATTERN) {
                case 1: case 2:
                    if (playerBulletInfo[i].life) {
                        for (j = 0; j < NORMAL_ENEMY_MAX; j++) {
                            if (enemyInfo[j].life) {
                                if (Clash(playerBulletInfo[i].x, playerBulletInfo[i].y, enemyInfo[j].x, enemyInfo[j].y, player.size, enemyInfo[j].size)) {
                                    playerBulletInfo[i].life = false;
                                    enemyInfo[j].life = false;
                                    SCORE += 100;
                                    if (SCORE == 1000) {  //TYPEAとノーマルの混合
                                        ENEMY_SPAWN_PATTERN = 2;
                                    } else if (SCORE == 2000) {  //ボス出現
                                        ENEMY_SPAWN_PATTERN = 3;
                                        counter = 0;
                                        for (i = 0; i < NORMAL_ENEMY_MAX; i++) {
                                            if (enemyInfo[i].life) {
                                                enemyInfo[i].life = false;
                                                SCORE += 100;
                                            }
                                        }
                                        for (i = 0; i < ENEMY_BULLET_MAX; i++) {
                                            if (enemyBulletInfo[i].life) {
                                                enemyBulletInfo[i].life = false;
                                            }
                                        }
                                        alert("ボス登場! 先に左右の敵を倒してボスにダメージを与えよう!");
                                        leftPress = false;
                                        rightPress = false;
                                        upPress = false;
                                        downPress = false;
                                        PLAYER_ATTACK_INTERVAL = 10; 
                                    }
                                    TYPEA_ENEMY_COUNT = false;
                                    break;
                                }
                            }
                        }
                    }
                    break;

                case 3:  //ボスとサブボスの衝突判定
                    if (playerBulletInfo[i].life) {
                        if (boss.life && Clash(playerBulletInfo[i].x, playerBulletInfo[i].y, boss.x, boss.y, player.size, boss.size) && !(subBoss[0].life || subBoss[1].life)) {
                            boss.hp--;
                            if (boss.hp == 0) {
                                boss.life = false;
                                for (j = 1; j <= 10000; j++) {
                                    SCORE++;
                                }
                                score.innerHTML = "　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　score:" + SCORE;;
                                BossHP.innerHTML = "　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　GAME CLEAR!(Sボタンでやり直しできます)";
                                subBoss1HP.innerHTML = "";
                                subBoss2HP.innerHTML = "";
                                gameRun = false;
                                GameClear = true;
                            }
                            playerBulletInfo[i].life = false;
                        }
                        for (j = 0; j < 2; j++) {
                            if (subBoss[j].life && Clash(playerBulletInfo[i].x, playerBulletInfo[i].y, subBoss[j].x, subBoss[j].y, player.size, subBoss[j].size)) {
                                subBoss[j].hp--;
                                if (subBoss[j].hp == 0) {
                                    subBoss[j].life = false;
                                    boss.attackPattern = Math.floor(Math.random() * 4) + 3;
                                    switch (boss.attackPattern) {
                                        case 3:
                                            counter = 1500;
                                            break;
                                        case 4:
                                            counter = 2250;
                                            break;
                                        case 5:
                                            counter = 2950;
                                            break;
                                        case 6:
                                            counter = 4050;
                                            break;
                                    }
                                }
                                playerBulletInfo[i].life = false;
                                break;
                            }
                        }
                    }
                    break;
            }
        }

        //エネミーショットとプレイヤーの衝突判定
        for (i = 0; i < ENEMY_BULLET_MAX; i++) {
            if (enemyBulletInfo[i].life && Clash(enemyBulletInfo[i].x, enemyBulletInfo[i].y, player.x, player.y, player.size, enemyBulletInfo[i].size)) {
                gameRun = false;
                break;
            }
        }

        if (gameRun) { setTimeout(arguments.callee, fps) }
    })();
};



function keyDown(event) {
    codeDown = event.keyCode;

    switch (codeDown) {
        case 32:
            PlayerShot = 1;
            break;
        case 37:  //←
            leftPress = true;
            break;
        case 38:  //↑
            upPress = true;
            break;
        case 39:  //→
            rightPress = true;
            break;
        case 40:  //↓
            downPress = true;
            break;
        case 66:
            if (PlayerBomb == true) {
                PlayerShot = 2;
                PlayerBomb = false;
            }
            break;
        case 83:
            if (!gameRun) {
                gameRun = true;
                TYPEA_ENEMY_COUNT = false;
                PlayerBomb = true;
                if (subBoss[0].life) SUBONE = false;
                if (subBoss[1].life) SUBTWO = false;
                if (ENEMY_SPAWN_PATTERN == 3) {
                    boss.attackPattern = Math.floor(Math.random() * 5) + 1;
                    switch (boss.attackPattern) {
                        case 1:
                            counter = 0;
                            break;
                        case 2:
                            counter = 500;
                            break;
                        case 3:
                            counter = 1500;
                            break;
                        case 4:
                            counter = 2250;
                            break;
                        case 5:
                            counter = 2950;
                            break;
                        case 6:
                            counter = 4050;
                            break;
                    }
                    if(!boss.life) SCORE = 0;
                    if(GameClear) {
                        SUBONE = false;
                        SUBTWO = false;
                        ENEMY_SPAWN_PATTERN = 1;
                        PLAYER_ATTACK_INTERVAL = 25;
                    }
                } 
                window.onload();
            }
            break;
    }
}


function keyUp(event) {
    codeUp = event.keyCode;

    switch (codeUp) {
        case 37:  //←
            leftPress = false;
            break;
        case 38:  //↑
            upPress = false;
            break;
        case 39:  //→
            rightPress = false;
            break;
        case 40:  //↓
            downPress = false;
            break;
    }
}

function Clash(px, py, ex, ey, psize, esize) {
    if ((px - ex) ** 2 + (py - ey) ** 2 < psize ** 2 + esize ** 2) {
        return true;
    } else {
        return false;
    }
}

function ENEMY_SPAWNPATTERN_ONE(i) {  //敵の出現パターン1
    typeRandom = Math.floor(Math.random() * 2) + 1;  //1か2
    switch (typeRandom) {
        case 1:
            xRandom = (Math.floor(Math.random() * 4) + 1) * 100;  //100~400か
            enemyInfo[i].x = xRandom;
            enemyInfo[i].y = 0;
            break;
        case 2:
            yRandom = (Math.floor(Math.random() * 2) + 1) * 100;  //100~200か
            enemyInfo[i].x = 0;
            enemyInfo[i].y = yRandom;
            break;
    }
    enemyInfo[i].set(enemyInfo[i].x, enemyInfo[i].y, 10, 2, typeRandom);
}

function ENEMY_SPAWN_PATTERN_TWO(i) { //敵の出現パターン2
    for (j = 0; j < 1; j++) {  //TYPEAは一体ずつ
        typeRandom = Math.floor(Math.random() * 3) + 1;  //1か2か3
        if ((typeRandom == 3 && TYPEA_SPAWN_INTERVAL < 350)) {
            j--;
        }
    }

    switch (typeRandom) {
        case 1:
            xRandom = (Math.floor(Math.random() * 4) + 1) * 100;  //100~400
            enemyInfo[i].x = xRandom;
            enemyInfo[i].y = 0;
            break;
        case 2:
            yRandom = (Math.floor(Math.random() * 2) + 1) * 100;  //100~200
            enemyInfo[i].x = 0;
            enemyInfo[i].y = yRandom;
            break;
        case 3:  //ぐるぐる回る
            enemyInfo[i].x = 250;
            enemyInfo[i].y = 0;
            TYPEA_ENEMY_COUNT = true;
            TYPEA_SPAWN_INTERVAL = 1;
            break;
    }

    enemyInfo[i].set(enemyInfo[i].x, enemyInfo[i].y, 10, 2, typeRandom);
}

function BulletDelete() {
    for (i = 0; i < ENEMY_BULLET_MAX; i++) {
        if (enemyBulletInfo[i].life) {
            enemyBulletInfo[i].life = false;
        }
    }

}
function EnemyDeltete() {
    for (i = 0; i < NORMAL_ENEMY_MAX; i++) {
        if (enemyInfo[i].life) {
            enemyInfo[i].life = false;
            SCORE += 100;
        }
    }

}

