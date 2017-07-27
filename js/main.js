var TankCombat = {
    base_ctx: '',
    map_ctx: '',
    lawn_ctx: '',
    tank_ctx: '',
    end_ctx: '',

    m_startGui: null,      //开始界面
    m_levelGui: null,      //关卡界面
    m_gameGui: null,       //游戏界面
    m_selectGui: null,     //选关界面
    m_Tanker: null,        //玩家1
    y_Tanker: null,        //玩家2
    m_Prop: null,          //道具

    AIList: [],            //AI
    bulletList: [],        //子弹
    keysList: [],          //键盘
    boomList: [],          //爆炸

    init_level: 1,         //初始关卡
    m_rank: 0,             //玩家1等级
    y_rank: 0,             //玩家2等级

    game_status: GAME_STATUS.START,
    game_over: false,
    max_AI: 20,            //最多AI数
    displayAI: 0,          //已出现AI数
    max_displayAI: 5,      //最多可同时出现AI数
    end_pos: {'x': 90, 'y':384},
    single_mode: false,     //单人模式

    game_time: 0,
    AI_stopTime: 0,
    home_protTime: -1,      //保护家时刻
    propTime: 300,          //道具刷新时间

    startGame: function() {
        this.initGame();
        var timer = setInterval("TankCombat.gameLoop()", 20);
    },

    initGame: function() {
        var base_cav = $('#base_scene');
        this.base_ctx = base_cav[0].getContext('2d');
        base_cav.attr({
            "width": screen.width
        });
        base_cav.attr({
            "height": screen.height
        });

        var map_cav = $('#map_scene');
        this.map_ctx = map_cav[0].getContext('2d');
        map_cav.attr({
            "width": screen.width
        });
        map_cav.attr({
            "height": screen.height
        });

        var lawn_cav = $('#lawn_scene');
        this.lawn_ctx = lawn_cav[0].getContext('2d');
        lawn_cav.attr({
            "width": screen.width
        });
        lawn_cav.attr({
            "height": screen.height
        });

        var tank_cav = $('#tank_scene');
        this.tank_ctx = tank_cav[0].getContext('2d');
        tank_cav.attr({
            "width": screen.width
        });
        tank_cav.attr({
            "height": screen.height
        });

        var end_cav = $('#end_scene');
        this.end_ctx = end_cav[0].getContext('2d');
        end_cav.attr({
            "width": screen.width
        });
        end_cav.attr({
            "height": screen.height
        });

        var containerDiv = $('#container');
        containerDiv.css({
            "width": screen.width
        });
        containerDiv.css({
            "height": screen.height
        });
        containerDiv.css({
            "background-color": "#000000"
        });
        this.initParam();
    },

    initParam: function() {
        this.m_startGui = new startGui(this.base_ctx);
        this.m_selectGui = new selectGui(this.base_ctx);
        this.m_levelGui = new levelGui(this.base_ctx, this.init_level);
        this.m_gameGui = new gameGui(this.map_ctx, this.lawn_ctx);
        this.m_Tanker = new Tanker(this.tank_ctx, 129 + this.m_gameGui.offset_x, 385 + this.m_gameGui.offset_y);
        this.y_Tanker = new Tanker(this.tank_ctx, 256 + this.m_gameGui.offset_x, 385 + this.m_gameGui.offset_y);
        this.y_Tanker.offset_x = 128;

        this.m_Tanker.rank = this.m_rank;
        this.y_Tanker.rank = this.y_rank;

        this.AIList = [];
        this.bulletList = [];
        this.keysList = [];
        this.boomList = [];
        this.game_over = false;

        this.displayAI = 0;
        this.end_pos = {'x': 90, 'y':384};
        this.end_ctx.clearRect(0, 0, screen.width, screen.height);

        this.AI_stopTime = 0;
        this.home_protTime = -1;
        this.propTime = 1000;
    },

    gameLoop: function() {
        switch(this.game_status) {
            case GAME_STATUS.START:
                this.m_startGui.draw();
                break;
            case GAME_STATUS.SELECT:
                this.m_selectGui.draw();
                break;
            case GAME_STATUS.LEVEL:
                this.m_levelGui.draw();
                if (this.m_levelGui.complete == true) {
                    this.game_status = GAME_STATUS.GAME;
                }
                break;
            case GAME_STATUS.GAME:
                this.drawGame();
                if(this.game_over || (this.m_Tanker.lives <= 0 && this.y_Tanker.lives <= 0)){
                    this.game_status = GAME_STATUS.END;
                    this.m_gameGui.destroy_home();
                    PLAYER_DESTROY_AUDIO.play();
                }
                if(this.displayAI == this.max_AI && this.AIList.length == 0){
                    this.game_status  = GAME_STATUS.WIN;
                }
                break;
            case GAME_STATUS.WIN:
                this.m_rank = this.m_Tanker.rank;
                this.y_rank = this.y_Tanker.rank;
                this.next_level();
                break;
            case GAME_STATUS.END:
                this.gameOver();
                break;
        }
    },

    gameOver: function() {
        this.end_ctx.clearRect(0, 0, screen.width, screen.height);
        this.end_ctx.fillStyle = '#9AFF9A';
        this.end_ctx.font = 'bold 40px Verdana';
        this.end_ctx.fillText("GAME OVER", this.end_pos.x + this.m_gameGui.offset_x, this.end_pos.y + this.m_gameGui.offset_y);
        this.end_pos.y -= 5;
        this.single_mode = false;
        if (this.end_pos.y <= parseInt(this.m_gameGui.height_blocks / 2)) {
            this.initParam();
            if (this.single_mode == true)
                this.y_Tanker.lives = 0;
            this.game_status = GAME_STATUS.START;
        }
    },

    drawGame: function() {
        this.tank_ctx.clearRect(0, 0, screen.width, screen.height);
        if (this.m_Tanker.lives > 0) {
            this.m_Tanker.draw();
        }
        if (this.y_Tanker.lives > 0) {
            this.y_Tanker.draw();
        }
        this.m_gameGui.draw_Tanker(this.m_Tanker.lives, TANKER_TYPE.LEFT);
        this.m_gameGui.draw_Tanker(this.y_Tanker.lives, TANKER_TYPE.RIGHT);
        if (this.displayAI < this.max_AI) {
            if (this.game_time % 100 == 0) {
                this.addAI();
                this.game_time = 0;
            }
            this.game_time++;
        }

        this.draw_AI();
        this.draw_bullet();
        this.draw_bomb();
        keyEvent();
        if (this.propTime <= 0) {
            this.draw_prop();
        }
        else {
            this.propTime--;
        }
        if (this.home_protTime > 0) {
            this.home_protTime--;
        }
        else if (this.home_protTime == 0) {
            this.home_protTime = -1;
            this.home_NotProt();
        }
    },

    home_NotProt: function() {
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
        this.m_gameGui.update(mapChangeIndex, MAP_BLOCK.WALL);
    },

    draw_prop: function() {
        var rand = Math.random();
        if (rand < 0.4 && this.m_Prop == null) {
            this.m_Prop = new Prop(this.end_ctx);
            this.m_Prop.init();
        }
        if (this.m_Prop != null) {
            this.m_Prop.draw();
            if (this.m_Prop.isDestroyed) {
                this.m_Prop = null;
                this.propTime = 1000;
            }
        }
    },

    draw_bomb: function() {
        if (this.boomList != null && this.boomList.length > 0) {
            for (var i = 0; i < this.boomList.length; i++) {
                var boomObj = this.boomList[i];
                if (boomObj.isOver) {
                    this.boomList.removeByIndex(i);
                    i--;
                    if (boomObj.owner == this.m_Tanker) {
                        this.m_Tanker.renascenc(TANKER_TYPE.LEFT);
                    }
                    else if (boomObj.owner == this.y_Tanker) {
                        this.y_Tanker.renascenc(TANKER_TYPE.RIGHT);
                    }
                }
                else {
                    boomObj.draw();
                }
            }
        }
    },

    draw_bullet: function() {
        if (this.bulletList != null && this.bulletList.length > 0) {
            for (var i = 0; i < this.bulletList.length; i++) {
                var bulletObj = this.bulletList[i];
                if (bulletObj.isDestroyed) {
                    bulletObj.owner.isShooting = false;
                    this.bulletList.removeByIndex(i);
                    i--;
                }
                else {
                    bulletObj.draw();
                }
            }
        }
    },

    init_map: function() {
        this.m_gameGui.setLevel(this.init_level);
        this.m_gameGui.draw();
        this.m_gameGui.draw_Tanker(this.m_Tanker.lives, TANKER_TYPE.LEFT);
        this.m_gameGui.draw_Tanker(this.y_Tanker.lives, TANKER_TYPE.RIGHT);
    },

    pre_level: function() {
        this.init_level--;

        this.init_level = (this.init_level <= 0) ? screen.total_level : this.init_level;
        this.initParam();
        if (this.single_mode == true) {
            this.y_Tanker.lives = 0;
        }
        this.m_levelGui.init(this.init_level);
        this.game_status = GAME_STATUS.LEVEL;
    },

    next_level: function() {
        this.init_level++;
        this.init_level = (this.init_level > screen.total_level) ? 1 : this.init_level;
        this.initParam();
        if (this.single_mode == true) {
            this.y_Tanker.lives = 0;
        }
        this.m_levelGui.init(this.init_level);
        this.game_status = GAME_STATUS.LEVEL;
    },

    addAI: function() {
        if (this.AIList != null && this.AIList.length < this.max_displayAI && this.max_AI != 0) {
            this.displayAI++;
            var rand = 0;
            if (this.init_level == 1) {
                rand = 0;
            }
            else if (this.init_level <= 4 && this.init_level > 1) {
                rand = parseInt(Math.random() * 2);
            }
            else if (this.init_level <= 6 && this.init_level > 4) {
                rand = parseInt(Math.random() * 3);
            }
            else if (this.init_level <= 10 && this.init_level > 6) {
                rand = parseInt(Math.random() * 4);
            }
            else if (this.init_level <= 15 && this.init_level > 10) {
                rand = parseInt(Math.random() * 5);
            }
            else {
                rand = parseInt(Math.random() * 5);
                while(rand <=1)
                   rand = parseInt(Math.random() * 5);
            }
            var obj = null;
            if (rand == 0) {
                obj = new AI_N1(this.tank_ctx);
            }
            else if (rand == 1) {
                obj = new AI_N2(this.tank_ctx);
            }
            else if (rand == 2) {
                obj = new AI_N3(this.tank_ctx);
            }
            else if (rand == 3) {
                obj = new AI_N4(this.tank_ctx);
            }
            else if (rand == 4) {
                obj = new AI_N5(this.tank_ctx);
            }
            obj.x = AI_LOCATION[parseInt(Math.random() * 3)] + this.m_gameGui.offset_x;
            obj.y = this.m_gameGui.offset_y;
            obj.dir = DIRECTION.DOWN;
            this.AIList[this.AIList.length] = obj;
            this.m_gameGui.draw_AINum(this.max_AI - this.displayAI);
        }
    },

    draw_AI: function() {
        if (this.AIList != null || this.AIList.length > 0) {
            for (var i = 0; i < this.AIList.length; i++) {
                var AIObj = this.AIList[i];
                if (AIObj.isDestroyed) {
                    this.AIList.removeByIndex(i);
                    i--;
                }
                else {
                    AIObj.draw();
                }
            }
        }
        if (this.AI_stopTime > 0) {
            this.AI_stopTime--;
        }
    }
};

$(document).keydown(function(event) {
    var key = event.keyCode;
    if (key == keyboard.ESC && TankCombat.game_status != GAME_STATUS.START) {
        TankCombat.initParam();
        TankCombat.single_mode = false;
        if (TankCombat.single_mode == true)
            TankCombat.y_Tanker.lives = 0;
        TankCombat.game_status = GAME_STATUS.START;
    }
    switch (TankCombat.game_status) {
        case GAME_STATUS.START:
            if (key == keyboard.ENTER) {
                if (TankCombat.m_startGui.complete == true) {
                    TankCombat.game_status = GAME_STATUS.SELECT;
                    if (TankCombat.m_startGui.tanker_num == 1) {
                        TankCombat.single_mode = true;
                        TankCombat.y_Tanker.lives = 0;
                    }
                }
            }
            else {
                if (key == keyboard.DOWN) {
                    TankCombat.m_startGui.selectLevel(1);
                }
                else if (key == keyboard.UP) {
                    TankCombat.m_startGui.selectLevel(-1);
                }

            }
            break;
        case GAME_STATUS.SELECT:
            if (key == keyboard.ENTER) {
                TankCombat.init_level = TankCombat.m_selectGui.getLevel();
                TankCombat.m_levelGui.init(TankCombat.init_level);
                TankCombat.game_status =  GAME_STATUS.LEVEL;
            }
            else {
                if (key == keyboard.UP || key == keyboard.W) {
                    TankCombat.m_selectGui.chooseLevel(DIRECTION.UP);
                }
                else if (key == keyboard.DOWN || key == keyboard.S) {
                    TankCombat.m_selectGui.chooseLevel(DIRECTION.DOWN);
                }
                else if (key == keyboard.LEFT || key == keyboard.A) {
                    TankCombat.m_selectGui.chooseLevel(DIRECTION.LEFT);
                }
                else if (key == keyboard.RIGHT || key == keyboard.D) {
                    TankCombat.m_selectGui.chooseLevel(DIRECTION.RIGHT);
                }
            }
            break;
        case GAME_STATUS.GAME:
            if (!TankCombat.keysList.contain(key)) {
                TankCombat.keysList.push(key);
            }
            if (key == keyboard.SPACE && TankCombat.m_Tanker.lives > 0) {
                TankCombat.m_Tanker.shoot(BULLET_TYPE.TANKER);
            }
            else if (key == keyboard.ENTER && TankCombat.y_Tanker.lives > 0) {
                TankCombat.y_Tanker.shoot(BULLET_TYPE.TANKER);
            }
            else if (key == keyboard.LEFT_BRACE) {
                TankCombat.pre_level();
            }
            else if (key == keyboard.RIGHT_BRACE) {
                TankCombat.next_level();
            }
            break;
    }
});

$(document).keyup(function(event){
    TankCombat.keysList.remove(event.keyCode);
});

keyEvent = function(){
    if(TankCombat.keysList.contain(keyboard.W)){
        TankCombat.m_Tanker.dir = DIRECTION.UP;
        TankCombat.m_Tanker.hit = false;
        TankCombat.m_Tanker.move();
        MOVE_AUDIO.play();
    }
    else if(TankCombat.keysList.contain(keyboard.S)){
        TankCombat.m_Tanker.dir = DIRECTION.DOWN;
        TankCombat.m_Tanker.hit = false;
        TankCombat.m_Tanker.move();
        MOVE_AUDIO.play();
    }
    else if(TankCombat.keysList.contain(keyboard.A)){
        TankCombat.m_Tanker.dir = DIRECTION.LEFT;
        TankCombat.m_Tanker.hit = false;
        TankCombat.m_Tanker.move();
        MOVE_AUDIO.play();
    }
    else if(TankCombat.keysList.contain(keyboard.D)){
        TankCombat.m_Tanker.dir = DIRECTION.RIGHT;
        TankCombat.m_Tanker.hit = false;
        TankCombat.m_Tanker.move();
        MOVE_AUDIO.play();
    }

    if(TankCombat.keysList.contain(keyboard.UP)){
        TankCombat.y_Tanker.dir = DIRECTION.UP;
        TankCombat.y_Tanker.hit = false;
        TankCombat.y_Tanker.move();
        MOVE_AUDIO.play();
    }
    else if(TankCombat.keysList.contain(keyboard.DOWN)){
        TankCombat.y_Tanker.dir = DIRECTION.DOWN;
        TankCombat.y_Tanker.hit = false;
        TankCombat.y_Tanker.move();
        MOVE_AUDIO.play();
    }
    else if(TankCombat.keysList.contain(keyboard.LEFT)){
        TankCombat.y_Tanker.dir = DIRECTION.LEFT;
        TankCombat.y_Tanker.hit = false;
        TankCombat.y_Tanker.move();
        MOVE_AUDIO.play();
    }
    else if(TankCombat.keysList.contain(keyboard.RIGHT)){
        TankCombat.y_Tanker.dir = DIRECTION.RIGHT;
        TankCombat.y_Tanker.hit = false;
        TankCombat.y_Tanker.move();
        MOVE_AUDIO.play();
    }
};
