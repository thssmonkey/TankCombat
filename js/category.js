//开始界面
var startGui = function (ctx) {
    this.ctx = ctx;
    this.start_x = 0;
    this.start_y = screen.height;
    this.timeLag = 0;
    this.complete = false;
    this.tanker_num = 1;
    this.m_optionsTank = new optionsTank();

    this.draw = function() {
        this.timeLag++;
        var step = (parseInt(this.timeLag / 6) % 2 == 0) ? 0 : this.m_optionsTank.size;
        this.start_y = (this.start_y <= 0) ? 0 : (this.start_y - 10);
        this.ctx.clearRect(0, 0, screen.width, screen.height);
        this.ctx.save();
        this.ctx.drawImage(START_IMAGE, this.start_x, this.start_y);
        this.ctx.drawImage(GAME_IMAGE, coord["optionsTank"][0], coord["optionsTank"][1] + step, this.m_optionsTank.size, this.m_optionsTank.size, this.m_optionsTank.x, this.start_y + this.m_optionsTank.topLen[this.tanker_num - 1], this.m_optionsTank.size, this.m_optionsTank.size);
        this.ctx.restore();
        if (this.start_y <= 0) {
            this.complete = true;
        }
    };
    //选择单双人
    this.selectLevel = function(num) {
        this.tanker_num += num;
        if (this.tanker_num > 2)
            this.tanker_num = 1;
        else if (this.tanker_num < 1)
            this.tanker_num = 2;
    };
};
//关卡界面
var levelGui = function(ctx, level) {
    this.ctx = ctx;
    this.num_x = 308;
    this.num_y = 208;
    this.pic_x = 194;
    this.pic_y = 208;
    this.pic_width = 78;
    this.pic_height = 14;

    this.ctx.fillStyle = screen.bg_color;
    this.step = 30;
    this.level = level;
    this.total_step = 0;
    this.dir = 1;
    this.complete = false;
    this.level_num = new Num(ctx);

    this.init = function(level) {
        this.level = level;
        this.complete = false;
        this.dir = 1;
        this.total_step = 0;
    };

    this.draw = function() {
        if(this.dir == 1){
            if(this.total_step == 300){
                this.ctx.drawImage(GAME_IMAGE, coord["level"][0], coord["level"][1], this.pic_width, this.pic_height, this.pic_x, this.pic_y, this.pic_width, this.pic_height);
                this.level_num.draw(this.level, this.num_x, this.num_y);
                TankCombat.init_map();
            }
            else if(this.total_step == 300 + 300){
                this.total_step = 225;
                this.dir = -1;
                START_AUDIO.play();
            }
            else{
                this.ctx.fillRect(0, this.total_step, 512, this.step);
                this.ctx.fillRect(0, 448 - this.total_step - this.step , 512, this.step);
            }
        }
        else {
            if(this.total_step >= 0){
                this.ctx.clearRect(0, this.total_step , 512, this.step);
                this.ctx.clearRect(0, 448 - this.total_step - this.step, 512, this.step);
            }
            else{
                this.complete = true;
            }
        }
        this.total_step += this.step * this.dir;
    };
};
//游戏界面
var gameGui = function(map_ctx, lawn_ctx) {
    this.level = 1;
    this.level_map = '';
    this.map_ctx = map_ctx;
    this.lawn_ctx = lawn_ctx;

    this.offset_x = 32;
    this.offset_y = 16;

    this.width_blocks = 26;
    this.height_blocks = 26;
    this.block_size = 16;
    this.home_size = 32;
    this.num = new Num(this.map_ctx);
    this.map_width = 416;
    this.map_height = 416;
    //设置当前关卡的地图
    this.setLevel = function(level) {
        this.level = level;
        var which_map = eval('map' + this.level);
        this.level_map = new Array();
        for (var i = 0; i < which_map.length; i++) {
            this.level_map[i] = new Array();
            for (var j = 0; j < which_map[i].length; j++) {
                this.level_map[i][j] = which_map[i][j];
            }
        }
    };

    this.draw = function() {
        this.map_ctx.fillStyle = screen.bg_color;
        this.map_ctx.fillRect(0, 0, screen.width, screen.height);
        this.map_ctx.fillStyle = '#000';
        this.map_ctx.fillRect(this.offset_x, this.offset_y, this.map_width, this.map_height);
        this.lawn_ctx.clearRect(0, 0, screen.width, screen.height);

        for (var i = 0; i < this.height_blocks; i++) {
            for (var j = 0; j < this.width_blocks; j++) {
                if (this.level_map[i][j] == MAP_BLOCK.WALL || this.level_map[i][j] == MAP_BLOCK.GRID || this.level_map[i][j] == MAP_BLOCK.WATER || this.level_map[i][j] == MAP_BLOCK.ICE) {
                    this.map_ctx.drawImage(GAME_IMAGE, this.block_size * (this.level_map[i][j] - 1) + coord["map"][0], coord["map"][1], this.block_size, this.block_size, j * this.block_size + this.offset_x, i * this.block_size + this.offset_y, this.block_size, this.block_size);
                }
                else if (this.level_map[i][j] == MAP_BLOCK.GRASS) {
                    this.lawn_ctx.drawImage(GAME_IMAGE, this.block_size * (this.level_map[i][j] - 1) + coord["map"][0], coord["map"][1], this.block_size, this.block_size, j * this.block_size + this.offset_x, i * this.block_size + this.offset_y, this.block_size, this.block_size);
                }
                else if (this.level_map[i][j] == MAP_BLOCK.HOME) {
                    this.map_ctx.drawImage(GAME_IMAGE, coord["home"][0], coord["home"][1], this.home_size, this.home_size, j * this.block_size + this.offset_x, i * this.block_size + this.offset_y, this.home_size, this.home_size);
                }
            }
        }

        this.draw_scores();
        this.draw_AINum(TankCombat.max_AI);
        this.draw_level();
        this.draw_Tanker(0, TANKER_TYPE.LEFT);
        this.draw_Tanker(0, TANKER_TYPE.RIGHT);
    };
    //右侧数据显示
    this.draw_scores = function() {
        this.map_ctx.fillStyle = 'black';
        this.map_ctx.font = 'bold 40px Verdana';
        this.map_ctx.fillText("坦", coord['mark'][0] + 8, coord['mark'][1] - 40 * 5);
        this.map_ctx.fillText("克", coord['mark'][0] + 8, coord['mark'][1] - 40 * 4);
        this.map_ctx.fillText("大", coord['mark'][0] + 8, coord['mark'][1] - 40 * 3);
        this.map_ctx.fillText("战", coord['mark'][0] + 8, coord['mark'][1] - 40 * 2);

        this.map_ctx.font = 'bold 10px Verdana';
        this.map_ctx.fillText("ENEMY", coord['mark'][0] + 4, coord['mark'][1] - 48);
        this.map_ctx.fillText("PLAYER1", coord['mark'][0], coord['mark'][1]);
        this.map_ctx.fillText("PLAYER2", coord['mark'][0], coord['mark'][1] + 48);
        this.map_ctx.fillText("LEVEL", coord['mark'][0] + 8, coord['mark'][1] + 96);
    };

    this.draw_level = function() {
        var x = 0;
        var y = 0;
        if (this.level > 9) {
            x = coord['mark'][0] + 18;
            y = 372;
        }
        else {
            x = 475;
            y = 372;
        }
        this.map_ctx.fillStyle = screen.bg_color;
        this.map_ctx.fillRect(x - 8, y - 2, 40, 20);
        this.map_ctx.fillStyle = 'black';
        this.map_ctx.font = 'bold 20px Verdana';
        this.map_ctx.fillText(this.level, x, y);
    };

    this.draw_AINum = function(AI_num) {
        var x = 0;
        var y = 0;
        if (AI_num > 9) {
            x = coord['mark'][0] + 18;
            y = coord['mark'][1] - 26;
        }
        else {
            x = 475;
            y = coord['mark'][1] - 26;
        }
        this.map_ctx.fillStyle = screen.bg_color;
        this.map_ctx.fillRect(x - 8, y - 17, 40, 20);
        this.map_ctx.fillStyle = 'black';
        this.map_ctx.font = 'bold 20px Verdana';
        this.map_ctx.fillText(AI_num, x, y);
    };

    this.draw_Tanker = function(lives, type) {
        var y = (type == TANKER_TYPE.LEFT) ? coord['mark'][1] + 22 : coord['mark'][1] + 70;
        this.map_ctx.fillStyle = screen.bg_color;
        this.map_ctx.fillRect(coord['mark'][0] + 20, y - 20, 40, 20);
        this.map_ctx.fillStyle = 'black';
        this.map_ctx.font = 'bold 20px Verdana';
        this.map_ctx.fillText(lives, coord['mark'][0] + 25, y);
    };

    this.update = function(arr, target) {
        if(arr != null && arr.length > 0){
            for(var i = 0; i < arr.length; i++){
                var index = arr[i];
                this.level_map[index[0]][index[1]] = target;
                if(target > 0){
                    this.map_ctx.drawImage(GAME_IMAGE,this.block_size * (target - 1)  + coord["map"][0], coord["map"][1], this.block_size, this.block_size, index[1] * this.block_size + this.offset_x, index[0] * this.block_size + this.offset_y,this.block_size, this.block_size);
                }
                else {
                    this.map_ctx.fillStyle = "#000";
                    this.map_ctx.fillRect(index[1] * this.block_size + this.offset_x, index[0] * this.block_size +  this.offset_y, this.block_size, this.block_size);
                }
            }
        }
    };

    this.destroy_home = function() {
        this.map_ctx.drawImage(GAME_IMAGE, coord["home"][0] + this.home_size, coord["home"][1], this.home_size, this.home_size, 12 * this.block_size + this.offset_x, 24 * this.block_size + this.offset_y, this.home_size, this.home_size);
        TankCombat.m_gameGui.draw_Tanker(TankCombat.m_Tanker.lives, TANKER_TYPE.LEFT);
        TankCombat.m_gameGui.draw_Tanker(TankCombat.y_Tanker.lives, TANKER_TYPE.RIGHT);
    };
};
//选关界面
var selectGui = function (ctx) {
    this.ctx = ctx;
    this.start_x = 40;
    this.start_y = 30;
    this.Tank = new optionsTank();
    this.num = 1;
    this.offset_pic = 15;
    this.offset_x = 5;
    this.offset_y = 9;
    this.fontsize = 14;
    this.dis_x = 80;
    this.dis_y = 60;
    this.tank_initX = this.start_x - this.Tank.size - this.offset_x;
    this.tank_initY = this.start_y - this.offset_y;
    this.tank_x = this.tank_initX;
    this.tank_y = this.tank_initY;
    this.right_flag = false;
    this.selectPic = {
        'x': this.start_x + this.fontsize + this.offset_pic,
        'y': this.start_y + this.fontsize + this.offset_pic,
        'size_x': 5 * this.dis_x - this.fontsize - 2 * this.offset_pic,
        'size_y': 6 * this.dis_y - this.fontsize - 2 * this.offset_pic,
    };
    //画关卡
    this.draw = function () {
        this.ctx.clearRect(0, 0, screen.width, screen.height);
        this.ctx.rect(0, 0, screen.width, screen.height);
        this.ctx.fillStyle = screen.bg_color;
        this.ctx.fill();
        var tmp = (this.right_flag == true) ? 2 * this.fontsize + 2 * this.offset_x + this.Tank.size : 0;
        this.ctx.drawImage(GAME_IMAGE, coord["select"][0], coord["select"][1], this.Tank.size, this.Tank.size, this.tank_x + tmp, this.tank_y, this.Tank.size, this.Tank.size);

        var array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        for (var i = 0; i < 7; i++) {
            this.ctx.drawImage(GAME_IMAGE, coord["num"][0] + (i + 1) * 14, coord["num"][1], this.fontsize, this.fontsize, this.start_x, this.start_y + i * this.dis_y, this.fontsize, this.fontsize);
        }
        for (var i = 0; i < 2; i++) {
            this.ctx.drawImage(GAME_IMAGE, coord["num"][0] + (i + 8) * 14, coord["num"][1], this.fontsize, this.fontsize, this.start_x + (i + 1) * this.dis_x, this.start_y + 6 * this.dis_y, this.fontsize, this.fontsize);
        }
        for (var i = 0; i < 3; i++) {
            this.ctx.drawImage(GAME_IMAGE, coord["num"][0] + 14, coord["num"][1], this.fontsize, this.fontsize, this.start_x + (i + 1 + 2) * this.dis_x, this.start_y + 6 * this.dis_y, this.fontsize, this.fontsize);
            this.ctx.drawImage(GAME_IMAGE, coord["num"][0] + i * 14, coord["num"][1], this.fontsize, this.fontsize, this.start_x + (i + 1 + 2) * this.dis_x + this.fontsize, this.start_y + 6 * this.dis_y, this.fontsize, this.fontsize);
        }
        for (var i = 0; i < 6; i++) {
            this.ctx.drawImage(GAME_IMAGE, coord["num"][0] + 14, coord["num"][1], this.fontsize, this.fontsize, this.start_x + 5 * this.dis_x, this.start_y + (5 - i) * this.dis_y, this.fontsize, this.fontsize);
            this.ctx.drawImage(GAME_IMAGE, coord["num"][0] + ( i + 3 ) * 14, coord["num"][1], this.fontsize, this.fontsize, this.start_x + 5 * this.dis_x + this.fontsize, this.start_y + (5 - i) * this.dis_y, this.fontsize, this.fontsize);
        }
        this.ctx.drawImage(GAME_IMAGE, coord["num"][0] + 14, coord["num"][1], this.fontsize, this.fontsize, this.start_x + 4 * this.dis_x, this.start_y, this.fontsize, this.fontsize);
        this.ctx.drawImage(GAME_IMAGE, coord["num"][0] + 9 * 14, coord["num"][1], this.fontsize, this.fontsize, this.start_x + 4 * this.dis_x + this.fontsize, this.start_y, this.fontsize, this.fontsize);
        for (var i = 0; i < 3; i++) {
            this.ctx.drawImage(GAME_IMAGE, coord["num"][0] + 2 * 14, coord["num"][1], this.fontsize, this.fontsize, this.start_x + (3 - i) * this.dis_x, this.start_y, this.fontsize, this.fontsize);
            this.ctx.drawImage(GAME_IMAGE, coord["num"][0] + i * 14, coord["num"][1], this.fontsize, this.fontsize, this.start_x + (3 - i) * this.dis_x + this.fontsize, this.start_y, this.fontsize, this.fontsize);
        }
        var tmp_level = this.getLevel();
        this.ctx.drawImage(SELECT_IMAGE[tmp_level - 1], 0, 0, this.selectPic.size_x, this.selectPic.size_y, this.selectPic.x, this.selectPic.y, this.selectPic.size_x, this.selectPic.size_y);
    };
    //关卡选择
    this.chooseLevel = function (dir) {
        this.right_flag = false;
        if (this.tank_x == this.tank_initX) {
            if (this.tank_y == this.tank_initY) {
                if (dir == DIRECTION.DOWN)
                    this.tank_y += this.dis_y;
                else if (dir == DIRECTION.RIGHT)
                    this.tank_x += this.dis_x;
            }
            else if (this.tank_y == this.tank_initY + 6 * this.dis_y) {
                if (dir == DIRECTION.UP)
                    this.tank_y -= this.dis_y;
                else if (dir == DIRECTION.RIGHT)
                    this.tank_x += this.dis_x;
            }
            else {
                if (dir == DIRECTION.UP)
                    this.tank_y -= this.dis_y;
                else if (dir == DIRECTION.DOWN)
                    this.tank_y += this.dis_y;
            }
        }
        else if (this.tank_x == this.tank_initX + 5 * this.dis_x) {
            if (this.tank_y == this.tank_initY) {
                if (dir == DIRECTION.DOWN) {
                    this.right_flag = true;
                    this.tank_y += this.dis_y;
                }
                else if (dir == DIRECTION.LEFT)
                    this.tank_x -= this.dis_x;
            }
            else if (this.tank_y == this.tank_initY + 6 * this.dis_y) {
                if (dir == DIRECTION.UP) {
                    this.right_flag = true;
                    this.tank_y -= this.dis_y;
                }
                else if (dir == DIRECTION.LEFT)
                    this.tank_x -= this.dis_x;
            }
            else {
                this.right_flag = true;
                if ((this.tank_y == this.tank_initY + this.dis_y && dir == DIRECTION.UP) || (this.tank_y == this.tank_initY + 5 * this.dis_y && dir == DIRECTION.DOWN))
                    this.right_flag = false;
                if (dir == DIRECTION.UP) {
                    this.tank_y -= this.dis_y;
                }
                else if (dir == DIRECTION.DOWN) {
                    this.tank_y += this.dis_y;
                }
            }
        }
        else {
            if (this.tank_y == this.tank_initY) {
                if (dir == DIRECTION.LEFT)
                    this.tank_x -= this.dis_x;
                else if (dir == DIRECTION.RIGHT)
                    this.tank_x += this.dis_x;
            }
            else if (this.tank_y == this.tank_initY + 6 * this.dis_y) {
                if (dir == DIRECTION.LEFT)
                    this.tank_x -= this.dis_x;
                else if (dir == DIRECTION.RIGHT)
                    this.tank_x += this.dis_x;
            }
        }
    };
    //获取关卡
    this.getLevel = function () {
        var tmp_level = 0;
        var col = (this.tank_x - this.tank_initX) / this.dis_x + 1;
        var row = (this.tank_y - this.tank_initY) / this.dis_y + 1;
        if (this.tank_x == this.tank_initX) {
            tmp_level = row;
        }
        else if (this.tank_x == this.tank_initX + 5 * this.dis_x) {
            tmp_level = 19 - row;
        }
        else {
            if (this.tank_y == this.tank_initY) {
                tmp_level = 24 - col;
            }
            else if (this.tank_y == this.tank_initY + 6 * this.dis_y) {
                tmp_level = 6 + col;
            }
        }
        return tmp_level;
    }
};
//关卡数字显示
var Num = function(context){
    this.ctx = context;
    this.size = 14;

    this.draw = function(num,x,y){
        var tempX = x;
        var tempY = y;
        var tempNumArray = [];
        if(num == 0){
            tempNumArray.push(0);
        }
        else{
            while(num > 0){
                tempNumArray.push(num % 10);
                num = parseInt(num/10);
            }
        }
        for(var i = tempNumArray.length-1;i>=0;i--){
            tempX = x+(tempNumArray.length-i-1) * this.size;
            this.ctx.drawImage(GAME_IMAGE,coord["num"][0]+tempNumArray[i]*14,coord["num"][1],this.size, this.size,tempX, tempY,this.size, this.size);
        }
    };
};
//道具
var Prop = function(ctx){
    this.ctx = ctx;
    this.x = 0;
    this.y = 0;
    this.duration = 600;
    this.type = 0;
    this.hit = false;
    this.width = 30;
    this.height = 28;
    this.isDestroyed = false;
    this.size = 28;

    this.init = function(){
        this.ctx.clearRect(this.x,this.y,this.width,this.height);
        this.duration = 600;
        this.type = parseInt(Math.random() * 5);
        this.x = parseInt(Math.random() * 384)+TankCombat.m_gameGui.offset_x;
        this.y = parseInt(Math.random() * 384)+TankCombat.m_gameGui.offset_y;
        this.isDestroyed = false;
    };

    this.draw = function(){
        if(this.duration > 0 && !this.isDestroyed){
            this.ctx.drawImage(GAME_IMAGE,coord["prop"][0]+this.type*this.width,coord["prop"][1],this.width,this.height,this.x,this.y,this.width,this.height);
            this.duration--;
            this.isHit();
        }
        else{
            this.ctx.clearRect(this.x,this.y,this.width,this.height);
            this.isDestroyed = true;
        }
    };
    //如果被玩家碰到
    this.isHit = function(){
        var tanker = null;
        if(TankCombat.m_Tanker.lives > 0 && CheckIntersect(this, TankCombat.m_Tanker, 0)){
            this.hit = true;
            tanker = TankCombat.m_Tanker;
        }
        else if (TankCombat.y_Tanker.lives > 0 && CheckIntersect(this, TankCombat.y_Tanker, 0)) {
            this.hit = true;
            tanker = TankCombat.y_Tanker;
        }

        if(this.hit){
            PROP_AUDIO.play();
            this.isDestroyed = true;
            this.ctx.clearRect(this.x,this.y,this.width,this.height);
            switch(this.type){
            case 0:
                tanker.lives ++;
                break;
            case 1:
                TankCombat.AI_stopTime = 500;
                break;
            case 2:
                var mapChangeIndex = [
                    [23, 11],
                    [23, 12],
                    [23, 13],
                    [23, 14],
                    [24, 11],
                    [24, 14],
                    [25, 11],
                    [25, 14]
                ];
                TankCombat.m_gameGui.update(mapChangeIndex, MAP_BLOCK.GRID);
                TankCombat.home_protTime = 1000;
                break;
            case 3:
                if(TankCombat.AIList != null || TankCombat.AIList.length > 0){
                    for(var i=0;i<TankCombat.AIList.length;i++){
                        var enemyObj = TankCombat.AIList[i];
                        enemyObj.destroy();
                    }
                }
                break;
            case 4:
                tanker.rank++;
                break;
            }
        }
    };
};

var Bullet = function(ctx, owner, type, dir){
    this.ctx = ctx;
    this.x = 0;
    this.y = 0;
    this.owner = owner;  //子弹所有者
    this.type = type;    //子弹类型（玩家子弹，AI子弹）
    this.dir = dir;      //子弹方向
    this.speed = (this.owner.rank != 2) ? (3 + this.owner.rank * 2) : 7;     //子弹速度的设置（玩家子弹速度随玩家等级变化）
    this.size = 6;
    this.hit = false;
    this.isDestroyed = false;

    this.draw = function(){
        this.ctx.drawImage(GAME_IMAGE, coord["bullet"][0] + this.dir * this.size, coord["bullet"][1], this.size, this.size, this.x, this.y, this.size, this.size);
        this.move();
    };

    this.move = function(){
        if(this.dir == DIRECTION.UP){
            this.y -= this.speed;
        }
        else if(this.dir == DIRECTION.DOWN){
            this.y += this.speed;
        }
        else if(this.dir == DIRECTION.RIGHT){
            this.x += this.speed;
        }
        else if(this.dir == DIRECTION.LEFT){
            this.x -= this.speed;
        }

        this.isHit();
    };

    this.isHit = function(){
        if(this.isDestroyed){
            return;
        }
        //子弹到达边界
        if(this.x < TankCombat.m_gameGui.offset_x) {
            this.x = TankCombat.m_gameGui.offset_x;
            this.hit = true;
        }
        else if(this.x > TankCombat.m_gameGui.offset_x + TankCombat.m_gameGui.map_width - this.size){
            this.x = TankCombat.m_gameGui.offset_x + TankCombat.m_gameGui.map_width - this.size;
            this.hit = true;
        }
        if(this.y < TankCombat.m_gameGui.offset_y){
            this.y = TankCombat.m_gameGui.offset_y;
            this.hit = true;
        }
        else if(this.y > TankCombat.m_gameGui.offset_y + TankCombat.m_gameGui.map_height - this.size){
            this.y = TankCombat.m_gameGui.offset_y + TankCombat.m_gameGui.map_height - this.size;
            this.hit = true;
        }
        //子弹碰撞到其他子弹
        if(!this.hit){
            if(TankCombat.bulletList != null && TankCombat.bulletList.length > 0){
                for (var i = 0; i < TankCombat.bulletList.length; i++) {
                    if (TankCombat.bulletList[i] != this && this.owner.isAI != TankCombat.bulletList[i].owner.isAI && TankCombat.bulletList[i].hit == false && CheckIntersect(TankCombat.bulletList[i], this, 0)) {
                        this.hit = true;
                        TankCombat.bulletList[i].hit = true;
                        break;
                    }
                }
            }
        }

        if(!this.hit){
            //子弹与地图内物体相撞
            if(bulletMapCollision(this, TankCombat.m_gameGui)){
                this.hit = true;
            }
            //子弹击中坦克
            if(this.type == BULLET_TYPE.TANKER){
                if(TankCombat.AIList != null || TankCombat.AIList.length > 0){
                    for(var i=0;i<TankCombat.AIList.length;i++){
                        var enemyObj = TankCombat.AIList[i];
                        if(!enemyObj.isDestroyed && CheckIntersect(this, enemyObj, 0)){
                            CheckIntersect(this, enemyObj, 0);
                            if(enemyObj.lives > 1){
                                enemyObj.lives--;
                            }
                            else{
                                enemyObj.destroy();
                            }
                            this.hit = true;
                            break;
                        }
                    }
                }
            }
            else if(this.type == BULLET_TYPE.AI){
                if(TankCombat.m_Tanker.lives > 0 && CheckIntersect(this, TankCombat.m_Tanker, 0)){
                    if (TankCombat.m_Tanker.rank == 2) {
                        TankCombat.m_Tanker.rank--;
                    }
                    else if(!TankCombat.m_Tanker.prot && !TankCombat.m_Tanker.isDestroyed){
                        TankCombat.m_Tanker.destroy();
                    }
                    this.hit = true;
                }
                else if(TankCombat.y_Tanker.lives > 0 && CheckIntersect(this, TankCombat.y_Tanker, 0)){
                    if (TankCombat.y_Tanker.rank == 2) {
                        TankCombat.y_Tanker.rank--;
                    }
                    else if(!TankCombat.y_Tanker.prot && !TankCombat.y_Tanker.isDestroyed){
                        TankCombat.y_Tanker.destroy();
                    }
                    this.hit = true;
                }
            }
        }
        if(this.hit){
            this.destroy();
        }
    };

    this.destroy = function(){
        this.isDestroyed = true;
        TankCombat.boomList.push(new Boom(BOOM_TYPE.BULLET,this.ctx,this));
        if(!this.owner.isAI) {
            BULLET_DESTROY_AUDIO.play();
        }
    };
};
//爆炸
var Boom = function(type, ctx, boomObj){
    this.times = 0;
    this.ctx = ctx;
    this.frame = 0;
    this.x = 0;
    this.y = 0;
    this.posName = '';
    this.size = 0;
    this.isOver = false;
    this.tempDir = 1;
    this.owner = boomObj;

    if(type == BOOM_TYPE.TANKER){
        this.posName = "tankBomb";
        this.size = 66;
        this.frame = 4;
    }
    else{
        this.posName = "bulletBomb";
        this.size = 32;
        this.frame = 3;
    }
    this.x = boomObj.x + (parseInt(boomObj.size - this.size)/2);
    this.y = boomObj.y + (parseInt(boomObj.size - this.size)/2);

    this.draw = function(){
        var gaptime = 3;
        var temp = parseInt(this.times/gaptime);
        this.ctx.drawImage(GAME_IMAGE,coord[this.posName][0]+temp*this.size,coord[this.posName][1],this.size,this.size,this.x,this.y,this.size,this.size);
        this.times += this.tempDir;
        if(this.times > this.frame * gaptime - parseInt(gaptime/2)){
            this.tempDir = -1;
        }
        if(this.times <= 0){
            this.isOver = true;
        }
    };
};
//坦克
var Tank = function(){
    this.x = 0;
    this.y = 0;
    this.size = 32;//坦克的大小
    this.dir = DIRECTION.UP;//方向0：上 1：下 2：左3：右
    this.speed = 1;//坦克的速度
    this.frame = 0;//控制敌方坦克切换方向的时间
    this.hit = false; //是否碰到墙或者坦克
    this.isAI = false; //是否自动
    this.isShooting = false;//子弹是否在运行中
    this.bullet = null;//子弹
    this.shootRate = 0.6;//射击的概率
    this.isDestroyed = false;
    this.tempX = 0;
    this.tempY = 0;

    this.move = function(){
        if(this.isAI && TankCombat.AI_stopTime > 0 ){
            return;
        }

        this.tempX = this.x;
        this.tempY = this.y;

        if (this.isAI) {
            //AI尝试躲避玩家1子弹
            if (TankCombat.m_Tanker.isShooting == true) {
                var by = TankCombat.m_Tanker.bullet.y;
                var bx = TankCombat.m_Tanker.bullet.x;
                var bdir = TankCombat.m_Tanker.bullet.dir;
                if (bdir == DIRECTION.UP || bdir == DIRECTION.DOWN) {
                    if (Math.abs(bx - (this.x + this.size / 2)) <= 50) {
                        if (this.dir == DIRECTION.LEFT && this.x + this.size / 2 > bx)
                            this.dir = DIRECTION.RIGHT;
                        else if (this.dir == DIRECTION.RIGHT && this.x + this.size / 2 < bx)
                            this.dir = DIRECTION.LEFT;
                        else if (this.dir == DIRECTION.UP || this.dir == DIRECTION.DOWN && Math.abs(bx - (this.x + this.size / 2)) <= 10) {
                                this.dir = DIRECTION.LEFT;
                        }
                    }
                }
                else if (bdir == DIRECTION.RIGHT || bdir == DIRECTION.LEFT) {
                    if (Math.abs(by - (this.y + this.size / 2)) <= 50) {
                        if (this.dir == DIRECTION.UP && this.y + this.size / 2 > by)
                            this.dir = DIRECTION.DOWN;
                        else if (this.dir == DIRECTION.DOWN && this.y + this.size / 2 < by)
                            this.dir = DIRECTION.UP;
                        else if (this.dir == DIRECTION.RIGHT || this.dir == DIRECTION.LEFT && Math.abs(by - (this.y + this.size / 2)) <= 10) {
                                this.dir = DIRECTION.DOWN;
                        }
                    }
                }
            }
            //AI尝试躲避玩家2子弹
            if (TankCombat.y_Tanker.isShooting == true) {
                var by = TankCombat.y_Tanker.bullet.y;
                var bx = TankCombat.y_Tanker.bullet.x;
                var bdir = TankCombat.y_Tanker.bullet.dir;
                if (bdir == DIRECTION.UP || bdir == DIRECTION.DOWN) {
                    if (Math.abs(bx - (this.x + this.size / 2)) <= 50) {
                        if (this.dir == DIRECTION.LEFT && this.x + this.size / 2 > bx)
                            this.dir = DIRECTION.RIGHT;
                        else if (this.dir == DIRECTION.RIGHT && this.x + this.size / 2 < bx)
                            this.dir = DIRECTION.LEFT;
                        else if (this.dir == DIRECTION.UP || this.dir == DIRECTION.DOWN && Math.abs(bx - (this.x + this.size / 2)) <= 10) {
                                this.dir = DIRECTION.LEFT;
                        }
                    }
                }
                else if (bdir == DIRECTION.RIGHT || bdir == DIRECTION.LEFT) {
                    if (Math.abs(by - (this.y + this.size / 2)) <= 50) {
                        if (this.dir == DIRECTION.UP && this.y + this.size / 2 > by)
                            this.dir = DIRECTION.DOWN;
                        else if (this.dir == DIRECTION.DOWN && this.y + this.size / 2 < by)
                            this.dir = DIRECTION.UP;
                        else if (this.dir == DIRECTION.RIGHT || this.dir == DIRECTION.LEFT && Math.abs(by - (this.y + this.size / 2)) <= 10) {
                                this.dir = DIRECTION.DOWN;
                        }
                    }
                }
            }
            //每隔相同时间AI会寻找玩家位置并向该位置靠近
            this.frame++;
            if (this.frame == 50) {
                if (TankCombat.m_Tanker.lives > 0) {
                    if (Math.abs(this.x - TankCombat.m_Tanker.x) <= 3 && this.y > TankCombat.m_Tanker.y)
                        this.dir = DIRECTION.UP;
                    else if (Math.abs(this.x - TankCombat.m_Tanker.x) <= 3 && this.y < TankCombat.m_Tanker.y)
                        this.dir = DIRECTION.DOWN;
                    else if (this.x > TankCombat.m_Tanker.x && Math.abs(this.y - TankCombat.m_Tanker.y) <= 3)
                        this.dir = DIRECTION.RIGHT;
                    else if (this.x < TankCombat.m_Tanker.x && Math.abs(this.y - TankCombat.m_Tanker.y) <= 3)
                        this.dir = DIRECTION.LEFT;
                    else if (this.x > TankCombat.m_Tanker.x && this.y > TankCombat.m_Tanker.y)
                        this.dir = (parseInt(Math.random() * 2) == 0) ? DIRECTION.LEFT : DIRECTION.UP;
                    else if (this.x > TankCombat.m_Tanker.x && this.y < TankCombat.m_Tanker.y)
                        this.dir = (parseInt(Math.random() * 2) == 0) ? DIRECTION.LEFT : DIRECTION.DOWN;
                    else if (this.x < TankCombat.m_Tanker.x && this.y > TankCombat.m_Tanker.y)
                        this.dir = (parseInt(Math.random() * 2) == 0) ? DIRECTION.RIGHT : DIRECTION.UP;
                    else if (this.x < TankCombat.m_Tanker.x && this.y < TankCombat.m_Tanker.y)
                        this.dir = (parseInt(Math.random() * 2) == 0) ? DIRECTION.RIGHT : DIRECTION.DOWN;
                }
                else if (TankCombat.y_Tanker.lives > 0) {
                    if (Math.abs(this.x - TankCombat.y_Tanker.x) <= 3 && this.y > TankCombat.y_Tanker.y)
                        this.dir = DIRECTION.UP;
                    else if (Math.abs(this.x - TankCombat.y_Tanker.x) <= 3 && this.y < TankCombat.y_Tanker.y)
                        this.dir = DIRECTION.DOWN;
                    else if (this.x > TankCombat.y_Tanker.x && Math.abs(this.y - TankCombat.y_Tanker.y) <= 3)
                        this.dir = DIRECTION.RIGHT;
                    else if (this.x < TankCombat.y_Tanker.x && Math.abs(this.y - TankCombat.y_Tanker.y) <= 3)
                        this.dir = DIRECTION.LEFT;
                    else if (this.x > TankCombat.y_Tanker.x && this.y > TankCombat.y_Tanker.y)
                        this.dir = (parseInt(Math.random() * 2) == 0) ? DIRECTION.LEFT : DIRECTION.UP;
                    else if (this.x > TankCombat.y_Tanker.x && this.y < TankCombat.y_Tanker.y)
                        this.dir = (parseInt(Math.random() * 2) == 0) ? DIRECTION.LEFT : DIRECTION.DOWN;
                    else if (this.x < TankCombat.y_Tanker.x && this.y > TankCombat.y_Tanker.y)
                        this.dir = (parseInt(Math.random() * 2) == 0) ? DIRECTION.RIGHT : DIRECTION.UP;
                    else if (this.x < TankCombat.y_Tanker.x && this.y < TankCombat.y_Tanker.y)
                        this.dir = (parseInt(Math.random() * 2) == 0) ? DIRECTION.RIGHT : DIRECTION.DOWN;
                }
                this.hit = false;
                this.frame = 0;
            }
            //AI遇到障碍转向
            else if (this.hit == true) {
                var ran = Math.random();
                //坦克AI碰到障碍物会有很小几率尝试开炮清除障碍
                if (ran <= 0.05)
                    this.shoot(BULLET_TYPE.AI);
                this.dir = parseInt(Math.random() * 4);
                this.hit = false;
                this.frame = 0;
            }
        }
        if(this.dir == DIRECTION.UP){
            this.tempY -= this.speed;
        }
        else if(this.dir == DIRECTION.DOWN){
            this.tempY += this.speed;
        }
        else if(this.dir == DIRECTION.RIGHT){
            this.tempX += this.speed;
        }
        else if(this.dir == DIRECTION.LEFT){
            this.tempX -= this.speed;
        }
        this.isHit();
        if(!this.hit){
            this.x = this.tempX;
            this.y = this.tempY;
        }
    };
    //坦克碰撞检测
    this.isHit = function(){
        if(this.dir == DIRECTION.LEFT){
            if(this.x <= TankCombat.m_gameGui.offset_x){
                this.x = TankCombat.m_gameGui.offset_x;
                this.hit = true;
            }
        }
        else if(this.dir == DIRECTION.RIGHT){
            if(this.x >= TankCombat.m_gameGui.offset_x + TankCombat.m_gameGui.map_width - this.size){
                this.x = TankCombat.m_gameGui.offset_x + TankCombat.m_gameGui.map_width - this.size;
                this.hit = true;
            }
        }
        else if(this.dir == DIRECTION.UP ){
            if(this.y <= TankCombat.m_gameGui.offset_y){
                this.y = TankCombat.m_gameGui.offset_y;
                this.hit = true;
            }
        }
        else if(this.dir == DIRECTION.DOWN){
            if(this.y >= TankCombat.m_gameGui.offset_y + TankCombat.m_gameGui.map_height - this.size){
                this.y = TankCombat.m_gameGui.offset_y + TankCombat.m_gameGui.map_height - this.size;
                this.hit = true;
            }
        }
        if(!this.hit){
            if(tankMapCollision(this, TankCombat.m_gameGui)){
                this.hit = true;
            }
        }
    };
    //坦克射击
    this.shoot = function(type){
        if(!(this.isAI && TankCombat.AI_stopTime > 0) && !this.isShooting){
            var tempX = this.x;
            var tempY = this.y;
            this.bullet = new Bullet(this.ctx, this, type, this.dir);
            if(this.dir == DIRECTION.UP) {
                tempX = this.x + parseInt(this.size/2) - parseInt(this.bullet.size/2);
                tempY = this.y + this.size / 2 - this.bullet.size;
            }
            else if(this.dir == DIRECTION.DOWN){
                tempX = this.x + parseInt(this.size/2) - parseInt(this.bullet.size/2);
                tempY = this.y + this.size / 2;
            }
            else if(this.dir == DIRECTION.LEFT){
                tempX = this.x + this.size / 2 - this.bullet.size;
                tempY = this.y + parseInt(this.size / 2) - parseInt(this.bullet.size/2);
            }
            else if(this.dir == DIRECTION.RIGHT){
                tempX = this.x + this.size / 2;
                tempY = this.y + parseInt(this.size/2) - parseInt(this.bullet.size/2);
            }
            this.bullet.x = tempX;
            this.bullet.y = tempY;
            if(!this.isAI){
                ATTACK_AUDIO.play();
            }
            this.bullet.draw();
            TankCombat.bulletList.push(this.bullet);
            this.isShooting = true;
        }
    };
    this.destroy = function(){
        this.isDestroyed = true;
        TankCombat.boomList.push(new Boom(BOOM_TYPE.TANKER,this.ctx,this));
        TANK_DESTROY_AUDIO.play();
    };
};
//开始界面中的坦克
var optionsTank = function(){
    this.topLen = [250, 308];
    this.x = 150;
    this.size = 27;
};
optionsTank.prototype = new Tank();

var Tanker = function(ctx, x, y){
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.lives = 3;//生命值
    this.prot = true;
    this.prot_time = 500;
    this.offset_x = 0;//坦克2与坦克1的距离
    this.speed = 2;//坦克的速度
    this.rank = 0;

    this.draw = function(){
        this.hit = false;
        this.prot = false;
        this.prot_time = 0;
        this.ctx.drawImage(GAME_IMAGE, coord["tanker"][0] + this.offset_x + this.dir * this.size, coord["tanker"][1], this.size, this.size, this.x, this.y, this.size, this.size);
        if(this.prot){
            var temp = parseInt((500 - this.prot_time) / 5) % 2;
            this.ctx.drawImage(GAME_IMAGE, coord["prot"][0], coord["prot"][1] + 32 * temp, 32, 32, this.x, this.y,  32, 32);
            this.prot_time--;
            if(this.prot_time == 0){
                this.prot = false;
            }
        }
    };
    this.destroy = function(){
        this.isDestroyed = true;
        TankCombat.boomList.push(new Boom(BOOM_TYPE.TANKER,this.ctx,this));
        PLAYER_DESTROY_AUDIO.play();
    };
    //玩家坦克重生
    this.renascenc = function(type){
        this.lives--;
        this.dir = DIRECTION.UP;
        this.prot = false;
        this.prot_time = 0;
        this.isDestroyed = false;
        var tmp = 0;
        this.rank = 0;
        if (type == TANKER_TYPE.LEFT) {
            TankCombat.m_rank = 0;
            tmp = 129;
        }
        else {
            TankCombat.y_rank = 0;
            tmp = 256;
        }
        this.x = tmp + TankCombat.m_gameGui.offset_x;
        this.y = 385 + TankCombat.m_gameGui.offset_y;
    };

};
Tanker.prototype = new Tank();
//普通坦克
var AI_N1 = function(ctx){
    this.ctx = ctx;
    this.isAppear = false;
    this.times = 0;
    this.lives = 1;
    this.isAI = true;
    this.speed = 1.5;
    this.rank = 0;

    this.draw = function(){
        this.times ++;
        if(!this.isAppear){
            var temp = parseInt(this.times/5)%7;
            this.ctx.drawImage(GAME_IMAGE,coord["AIBefore"][0]+temp*32,coord["AIBefore"][1],32,32,this.x,this.y,32,32);
            if(this.times == 34){
                this.isAppear = true;
                this.times = 0;
                this.shoot(BULLET_TYPE.AI);
            }
        }
        else{
            this.ctx.drawImage(GAME_IMAGE,coord["AI1"][0]+this.dir*this.size,coord["AI1"][1],32,32,this.x,this.y,32,32);
            if(this.times %50 ==0){
                var ra = Math.random();
                if(ra < this.shootRate){
                    this.shoot(BULLET_TYPE.AI);
                }
                this.times = 0;
            }
            this.move();
        }
    };
};
AI_N1.prototype = new Tank();
//越野坦克
var AI_N2 = function(ctx){
    this.ctx = ctx;
    this.isAppear = false;
    this.times = 0;
    this.lives = 1;
    this.isAI = true;
    this.speed = 2;
    this.rank = 0;

    this.draw = function(){
        this.times ++;
        if(!this.isAppear){
            var temp = parseInt(this.times/5)%7;
            this.ctx.drawImage(GAME_IMAGE,coord["AIBefore"][0]+temp*32,coord["AIBefore"][1],32,32,this.x,this.y,32,32);
            if(this.times == 35){
                this.isAppear = true;
                this.times = 0;
                this.shoot(BULLET_TYPE.AI);
            }
        }
        else{
            this.ctx.drawImage(GAME_IMAGE,coord["AI2"][0]+this.dir*this.size,coord["AI2"][1],32,32,this.x,this.y,32,32);
            if(this.times %50 ==0){
                var ra = Math.random();
                if(ra < this.shootRate){
                    this.shoot(BULLET_TYPE.AI);
                }
                this.times = 0;
            }
            this.move();
        }
    };
};
AI_N2.prototype = new Tank();
//轻型坦克
var AI_N3 = function(ctx){
    this.ctx = ctx;
    this.isAppear = false;
    this.times = 0;
    this.lives = 1;
    this.isAI = true;
    this.speed = 1.8;
    this.rank = 0;
    this.shootRate = 0.5;

    this.draw = function(){
        this.times ++;
        if(!this.isAppear){
            var temp = parseInt(this.times/5)%7;
            this.ctx.drawImage(GAME_IMAGE,coord["AIBefore"][0]+temp*32,coord["AIBefore"][1],32,32,this.x,this.y,32,32);
            if(this.times == 35) {
                this.isAppear = true;
                this.times = 0;
                this.shoot(BULLET_TYPE.AI);
            }
        }
        else{
            this.ctx.drawImage(GAME_IMAGE,coord["AI3"][0]+this.dir*this.size,coord["AI3"][1],32,31,this.x,this.y,32,31);
            if(this.times %50 ==0){
                var ra = Math.random();
                if(ra < this.shootRate){
                    this.shoot(BULLET_TYPE.AI);
                }
                this.times = 0;
            }
            this.move();
        }
    };
};
AI_N3.prototype = new Tank();
//双管坦克
var AI_N4 = function (ctx) {
    this.ctx = ctx;
    this.isAppear = false;
    this.times = 0;
    this.lives = 2;
    this.isAI = true;
    this.speed = 1.5;
    this.rank = 0;
    this.shootRate = 0.6;
    this.draw = function () {
        this.times++;
        if (!this.isAppear) {
            var temp = parseInt(this.times / 5) % 7;
            this.ctx.drawImage(GAME_IMAGE, coord["AIBefore"][0] + temp * 32, coord["AIBefore"][1], 32, 32, this.x, this.y, 32, 32);
            if (this.times == 35) {
                this.isAppear = true;
                this.times = 0;
                this.shoot(BULLET_TYPE.AI);
            }
        }
        else {
            this.ctx.drawImage(GAME_IMAGE, coord["AI4"][0] + this.dir * this.size, coord["AI4"][1], 32, 32, this.x, this.y, 32, 32);
            if (this.times % 50 == 0) {
                var ra = Math.random();
                if (ra < this.shootRate) {
                    this.shoot(BULLET_TYPE.AI);
                }
                this.times = 0;
            }
            this.move();
        }
    };
};
AI_N4.prototype = new Tank();
//重甲坦克
var AI_N5 = function (ctx) {
    this.ctx = ctx;
    this.isAppear = false;
    this.times = 0;
    this.lives = 3;
    this.isAI = true;
    this.speed = 0.6;
    this.rank = 0;
    this.shootRate = 0.8;

    this.draw = function () {
        this.times++;
        if (!this.isAppear) {
            var temp = parseInt(this.times / 5) % 7;
            this.ctx.drawImage(GAME_IMAGE, coord["AIBefore"][0] + temp * 32, coord["AIBefore"][1], 32, 32, this.x, this.y, 32, 32);
            if (this.times == 35) {
                this.isAppear = true;
                this.times = 0;
                this.shoot(BULLET_TYPE.AI);
            }
        }
        else {
            this.ctx.drawImage(GAME_IMAGE, coord["AI5"][0] + this.dir * this.size, coord["AI5"][1], 32, 32, this.x, this.y, 32, 32);
            if (this.times % 50 == 0) {
                var ra = Math.random();
                if (ra < this.shootRate) {
                    this.shoot(BULLET_TYPE.AI);
                }
                this.times = 0;
            }
            this.move();
        }
    };
};
AI_N5.prototype = new Tank();
