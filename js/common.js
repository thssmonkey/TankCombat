
Array.prototype.remove = function(arg){
    var i=0,n=0;
    var arrSize = this.length;
    for(i=0;i<arrSize;i++){
        if(this[i] != arg){
            this[n++]=this[i];
        }
    }
    if(n<i){
        this.length = n;
    }
};

Array.prototype.removeByIndex = function(index){
    var i=0,n=0;
    var arrSize = this.length;
    for(i=0;i<arrSize;i++){
        if(this[i] != this[index]){
            this[n++]=this[i];
        }
    }
    if(n<i){
        this.length = n;
    }
};

Array.prototype.contain = function(arg){
    var i=0;
    var arrSize = this.length;
    for(i=0;i<arrSize;i++){
        if(this[i] == arg){
            return true;
        }
    }
    return false;
};

//判断两物体是否相撞
function CheckIntersect(object1, object2, overlap)
{
    A1 = object1.x + overlap;
    B1 = object1.x + object1.size - overlap;
    C1 = object1.y + overlap;
    D1 = object1.y + object1.size - overlap;

    A2 = object2.x + overlap;
    B2 = object2.x + object2.size - overlap;
    C2 = object2.y + overlap;
    D2 = object2.y + object2.size - overlap;

    if(A1 >= A2 && A1 <= B2
       || B1 >= A2 && B1 <= B2)
    {
        if(C1 >= C2 && C1 <= D2 || D1 >= C2 && D1 <= D2)
        {
            return true;
        }
    }
    return false;
}

function tankMapCollision(tank,mapobj){
    var tileNum = 0;
    var rowIndex = 0;
    var colIndex = 0;
    var overlap = 3;

    if(tank.dir == DIRECTION.UP){
        rowIndex = parseInt((tank.tempY + overlap  - mapobj.offset_y)/mapobj.block_size);
        colIndex = parseInt((tank.tempX + overlap- mapobj.offset_x)/mapobj.block_size);
    }
    else if(tank.dir == DIRECTION.DOWN){
        rowIndex = parseInt((tank.tempY - overlap - mapobj.offset_y + tank.size)/mapobj.block_size);
        colIndex = parseInt((tank.tempX + overlap- mapobj.offset_x)/mapobj.block_size);
    }
    else if(tank.dir == DIRECTION.LEFT){
        rowIndex = parseInt((tank.tempY + overlap- mapobj.offset_y)/mapobj.block_size);
        colIndex = parseInt((tank.tempX + overlap - mapobj.offset_x)/mapobj.block_size);
    }
    else if(tank.dir == DIRECTION.RIGHT){
        rowIndex = parseInt((tank.tempY + overlap- mapobj.offset_y)/mapobj.block_size);
        colIndex = parseInt((tank.tempX - overlap - mapobj.offset_x + tank.size)/mapobj.block_size);
    }
    if(rowIndex >= mapobj.height_blocks || rowIndex < 0 || colIndex >= mapobj.width_blocks || colIndex < 0){
        return true;
    }
    if(tank.dir == DIRECTION.UP || tank.dir == DIRECTION.DOWN){
        var tempWidth = parseInt(tank.tempX - TankCombat.m_gameGui.offset_x - (colIndex)*mapobj.block_size + tank.size - overlap);
        if(tempWidth % mapobj.block_size == 0 ){
            tileNum = parseInt(tempWidth/mapobj.block_size);
        }
        else{
            tileNum = parseInt(tempWidth/mapobj.block_size) + 1;
        }
        for(var i=0;i<tileNum && colIndex+i < mapobj.width_blocks ;i++){
            var mapContent = mapobj.level_map[rowIndex][colIndex+i];
            if(mapContent == MAP_BLOCK.WALL || mapContent == MAP_BLOCK.GRID || mapContent == MAP_BLOCK.WATER || mapContent == MAP_BLOCK.HOME || mapContent == MAP_BLOCK.ANOTHERHOME){
                if(tank.dir == DIRECTION.UP){
                    tank.y = mapobj.offset_y + rowIndex * mapobj.block_size + mapobj.block_size - overlap;
                }
                else if(tank.dir == DIRECTION.DOWN){
                    tank.y = mapobj.offset_y + rowIndex * mapobj.block_size - tank.size + overlap;
                }
                return true;
            }
        }
    }
    else{
        var tempHeight = parseInt(tank.tempY - TankCombat.m_gameGui.offset_y - (rowIndex)*mapobj.block_size + tank.size - overlap);
        if(tempHeight % mapobj.block_size == 0 ){
            tileNum = parseInt(tempHeight/mapobj.block_size);
        }
        else{
            tileNum = parseInt(tempHeight/mapobj.block_size) + 1;
        }
        for(var i=0;i<tileNum && rowIndex+i < mapobj.height_blocks;i++){
            var mapContent = mapobj.level_map[rowIndex+i][colIndex];
            if(mapContent == MAP_BLOCK.WALL || mapContent == MAP_BLOCK.GRID || mapContent == MAP_BLOCK.WATER || mapContent == MAP_BLOCK.HOME || mapContent == MAP_BLOCK.ANOTHERHOME){
                if(tank.dir == DIRECTION.LEFT){
                    tank.x = mapobj.offset_x + colIndex * mapobj.block_size + mapobj.block_size - overlap;
                }
                else if(tank.dir == DIRECTION.RIGHT){
                    tank.x = mapobj.offset_x + colIndex * mapobj.block_size - tank.size + overlap;
                }
                return true;
            }
        }
    }
    return false;
}

function bulletMapCollision(bullet, mapobj){
    var tileNum = 0;
    var rowIndex = 0;
    var colIndex = 0;
    var mapChangeIndex = [];
    var result = false;
    //获取子弹对应的地图块的位置
    if(bullet.dir == DIRECTION.UP){
        rowIndex = parseInt((bullet.y - mapobj.offset_y)/mapobj.block_size);
        colIndex = parseInt((bullet.x + bullet.size/2 - mapobj.offset_x)/mapobj.block_size);
    }
    else if(bullet.dir == DIRECTION.DOWN){
        rowIndex = parseInt((bullet.y - mapobj.offset_y + bullet.size)/mapobj.block_size);
        colIndex = parseInt((bullet.x + bullet.size/2 - mapobj.offset_x)/mapobj.block_size);
    }
    else if(bullet.dir == DIRECTION.LEFT){
        rowIndex = parseInt((bullet.y + bullet.size/2 - mapobj.offset_y)/mapobj.block_size);
        colIndex = parseInt((bullet.x - mapobj.offset_x)/mapobj.block_size);
    }
    else if(bullet.dir == DIRECTION.RIGHT){
        rowIndex = parseInt((bullet.y + bullet.size/2 - mapobj.offset_y)/mapobj.block_size);
        colIndex = parseInt((bullet.x - mapobj.offset_x + bullet.size)/mapobj.block_size);
    }
    if(rowIndex >= mapobj.height_blocks || rowIndex < 0 || colIndex >= mapobj.width_blocks || colIndex < 0){
        return true;
    }

    if (bullet.dir == DIRECTION.UP || bullet.dir == DIRECTION.DOWN) {
        //子弹击中墙面后的微小容错距离
        var delta = (bullet.x + bullet.size / 2 - mapobj.offset_x) - parseInt((bullet.x + bullet.size / 2 - mapobj.offset_x) / mapobj.block_size) * mapobj.block_size;
        if (delta <= 6) {
            for (var i = -1; i < 1; i++) {
                var mapContent = mapobj.level_map[rowIndex][colIndex + i];
                if (mapContent == MAP_BLOCK.WALL || mapContent == MAP_BLOCK.GRID || mapContent == MAP_BLOCK.HOME || mapContent == MAP_BLOCK.ANOTHERHOME) {
                    result = true;
                    if (mapContent == MAP_BLOCK.WALL) {
                        mapChangeIndex.push([rowIndex, colIndex + i]);
                    }
                    else if (mapContent == MAP_BLOCK.GRID) {

                    }
                    else {
                        TankCombat.game_over = true;
                        break;
                    }
                }
            }
        }
        else if (delta > 6 && delta < 10) {
            var mapContent = mapobj.level_map[rowIndex][colIndex];
            if (mapContent == MAP_BLOCK.WALL || mapContent == MAP_BLOCK.GRID || mapContent == MAP_BLOCK.HOME || mapContent == MAP_BLOCK.ANOTHERHOME) {
                result = true;
                if (mapContent == MAP_BLOCK.WALL) {
                    mapChangeIndex.push([rowIndex, colIndex]);
                }
                else if (mapContent == MAP_BLOCK.GRID) {

                }
                else {
                    TankCombat.game_over = true;
                }
            }
        }
        else {
            for (var i = 0; i < 2; i++) {
                var mapContent = mapobj.level_map[rowIndex][colIndex + i];
                if (mapContent == MAP_BLOCK.WALL || mapContent == MAP_BLOCK.GRID || mapContent == MAP_BLOCK.HOME || mapContent == MAP_BLOCK.ANOTHERHOME) {
                    result = true;
                    if (mapContent == MAP_BLOCK.WALL) {
                        mapChangeIndex.push([rowIndex, colIndex + i]);
                    }
                    else if (mapContent == MAP_BLOCK.GRID) {

                    }
                    else {
                        TankCombat.game_over = true;
                        break;
                    }
                }
            }
        }
    }
    else {
        var delta = (bullet.y + bullet.size / 2 - mapobj.offset_y) - parseInt((bullet.y + bullet.size / 2 - mapobj.offset_y) / mapobj.block_size) * mapobj.block_size;
        if (delta <= 6) {
            for (var i = -1; i < 1; i++) {
                var mapContent = mapobj.level_map[rowIndex + i][colIndex];
                if (mapContent == MAP_BLOCK.WALL || mapContent == MAP_BLOCK.GRID || mapContent == MAP_BLOCK.HOME || mapContent == MAP_BLOCK.ANOTHERHOME) {
                    result = true;
                    if (mapContent == MAP_BLOCK.WALL) {
                        mapChangeIndex.push([rowIndex + i, colIndex]);
                    }
                    else if (mapContent == MAP_BLOCK.GRID) {

                    }
                    else {
                        TankCombat.game_over = true;
                        break;
                    }
                }
            }
        } else if (delta > 6 && delta < 10) {
            var mapContent = mapobj.level_map[rowIndex][colIndex];
            if (mapContent == MAP_BLOCK.WALL || mapContent == MAP_BLOCK.GRID || mapContent == MAP_BLOCK.HOME || mapContent == MAP_BLOCK.ANOTHERHOME) {
                result = true;
                if (mapContent == MAP_BLOCK.WALL) {
                    mapChangeIndex.push([rowIndex, colIndex]);
                }
                else if (mapContent == MAP_BLOCK.GRID) {

                }
                else {
                    TankCombat.game_over = true;
                }
            }
        }
        else {
            for (var i = 0; i < 2; i++) {
                var mapContent = mapobj.level_map[rowIndex + i][colIndex];
                if (mapContent == MAP_BLOCK.WALL || mapContent == MAP_BLOCK.GRID || mapContent == MAP_BLOCK.HOME || mapContent == MAP_BLOCK.ANOTHERHOME) {
                    result = true;
                    if (mapContent == MAP_BLOCK.WALL) {
                        mapChangeIndex.push([rowIndex + i, colIndex]);
                    }
                    else if (mapContent == MAP_BLOCK.GRID) {

                    }
                    else {
                        TankCombat.game_over = true;
                        break;
                    }
                }
            }
        }
    }
    TankCombat.m_gameGui.update(mapChangeIndex, 0);
    return result;
};

var Keyboard = function(){

    this.UP = 38;
    this.DOWN = 40;
    this.RIGHT = 39;
    this.LEFT = 37;

    this.SPACE = 32;
    this.TAB = 9;
    this.ENTER = 13;
    this.CTRL = 17;
    this.ALT = 18;
    this.ESC = 27;

    this.A = 65;
    this.D = 68;
    this.S = 83;
    this.W = 87;

    this.LEFT_BRACE = 219;
    this.RIGHT_BRACE = 221;
};

var keyboard = new Keyboard();
