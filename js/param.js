// 游戏屏幕大小
var screen = {
    width: 512,
    height: 448,
    bg_color: '#8FBC8F',
    total_level: 22,
};

// 游戏状态
var GAME_STATUS = {
        'START': 0,
        'LEVEL': 1,
        'GAME': 2,
        'END': 3,
        'WIN': 4,
        'SELECT': 5,
};

// 图片
var START_IMAGE = new Image();
START_IMAGE.src = "images/begin.jpg";
var GAME_IMAGE = new Image();
GAME_IMAGE.src = "images/map.gif";
var SELECT_IMAGE = [];
SELECT_IMAGE[0] = new Image();
SELECT_IMAGE[0].src = "images/level_1.png";
for (var i = 1; i < screen.total_level; i++) {
    SELECT_IMAGE[i] = new Image();
    SELECT_IMAGE[i].src = "images/level_" + (i + 1) + ".jpg";
}

// 声音
var START_AUDIO = new Audio("audios/start.mp3");
var BULLET_DESTROY_AUDIO = new Audio("audios/bulletCrack.mp3");
var TANK_DESTROY_AUDIO = new Audio("audios/tankCrack.mp3");
var PLAYER_DESTROY_AUDIO = new Audio("audios/playerCrack.mp3");
var MOVE_AUDIO = new Audio("audios/move.mp3");
var ATTACK_AUDIO = new Audio("audios/attack.mp3");
var PROP_AUDIO = new Audio("audios/prop.mp3");

// 地图块的位置
var coord = new Array();
coord["optionsTank"] = [128, 96];
coord["level"] = [396,96];
coord["num"] = [256,96];
coord["map"] = [0,96];
coord["home"] = [256,0];
coord["scores"] = [0,112];
coord["tanker"] = [0,0];
coord["prot"] = [160,96];
coord["AIBefore"] = [256,32];
coord["AI1"] = [0,32];
coord["AI2"] = [128,32];
coord["AI3"] = [0, 64];
coord["AI4"] = [128, 64];
coord["AI5"] = [256, 64];
coord["bullet"] = [80,96];
coord["tankBomb"] = [0,160];
coord["bulletBomb"] = [320,0];
coord["end"] = [384,64];
coord["prop"] = [256,110];
coord["select"] = [96, 0];
coord['mark'] = [450, 256];


// 地图块种类
var MAP_BLOCK = {
    'WALL': 1,
    'GRID': 2,
    'GRASS': 3,
    'WATER': 4,
    'ICE': 5,
    'HOME': 9,
    'ANOTHERHOME': 8
};

var AI_LOCATION = [192,0,384];

// 方向键
var DIRECTION = {
    'UP': 0,
    'DOWN': 1,
    'LEFT': 2,
    'RIGHT': 3
};
//坦克类型
var TANKER_TYPE = {
    'LEFT': 1,
    'RIGHT': 2
};

// 子弹类型
var BULLET_TYPE = {
    'TANKER': 1,
    'AI': 2
};
//爆炸类型
var BOOM_TYPE = {
    'TANKER': 1,
    'BULLET': 2
};
