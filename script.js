//canvasの設定
const board = document.getElementById("board");
const canvas = board.getContext("2d");


//フィールドサイズ
const Fieldcol = 10;
const Fieldrow = 22;

//ブロック一つのサイズ
const BlockSize = 35;
//テトロミノのサイズ
const TetroSize = 4;
let position = Fieldcol/2 - TetroSize/2;
let TetroX = position;
let TetroY = 0;

//フィールド初期化
let field = [];
function init(){
    for(let i=0;i<Fieldrow;i++){
        field[i] = [];
        for(let j=0;j<Fieldcol;j++){
            field[i][j] = 0;
        }
    }
}

//キャンバスサイズ
const ScreenW = BlockSize * Fieldcol;
const ScreenH = BlockSize * Fieldrow;

board.width = ScreenW;
board.height = ScreenH;
board.style.border = "4px solid white";

//落ちるスピード
let GameSpeed = 800;


//テトロミノ
const TetroType = [
    [],
    [   //1,I
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0]
    ],
    [   //2,L
        [0,1,0,0],
        [0,1,0,0],
        [0,1,1,0],
        [0,0,0,0]
    ],
    [   //3,J
        [0,0,1,0],
        [0,0,1,0],
        [0,1,1,0],
        [0,0,0,0]
    ],
    [   //4T
        [0,1,0,0],
        [1,1,1,0],
        [0,0,0,0],
        [0,0,0,0]
    ],
    [   //5O
        [0,0,0,0],
        [0,1,1,0],
        [0,1,1,0],
        [0,0,0,0]
    ],
    [   //6Z
        [0,0,0,0],
        [1,1,0,0],
        [0,1,1,0],
        [0,0,0,0]
    ],
    [   //7S
        [0,0,0,0],
        [0,1,1,0],
        [1,1,0,0],
        [0,0,0,0]
    ]
];
const Color = ["#000","#6CF","#F92","#66F","#C5C","#FD2","#F44","#5B5"];

let random = Math.floor(Math.random()*(TetroType.length-1))+1;
let Tetro = TetroType[random];
let game = false;

init();
drawTetris();

//テトロミノを落とす
setInterval(DropTetro,GameSpeed);
function DropTetro(){
    if(game)return;
    if(Checkmove(0,1,Tetro))TetroY++;
    else{
        FixTetro();
        CheckLine();
        random = Math.floor(Math.random()*(TetroType.length-1))+1;
        Tetro = TetroType[random];
        TetroX = position;
        TetroY = 0;
        if(!Checkmove(0,0)){
            game = true;
        }
    }
    drawTetris();
}

function drawTetris(){
    canvas.clearRect(0,0,ScreenW,ScreenH);
    //フィールド表示
    for(let i=0;i<Fieldrow;i++){
        for(let j=0;j<Fieldcol;j++){
            if(field[i][j]){
                drawBlock(i,j,field[i][j]);
            }
        }
    }

     //着地点を計算
     let plus = 0;
     while(Checkmove(0,plus+1))plus++;

     //テトロミノ表示
     for(let i=0;i<TetroSize;i++){
         for(let j=0;j<TetroSize;j++){
             if(Tetro[i][j]){
                 drawBlock(TetroY+i+plus,TetroX+j,0);
                 drawBlock(TetroY+i,TetroX+j,random);
             }
         }
     }

    if(game){
        let title = "GAME OVER";
        canvas.font = "48px 'MS ゴシック'";
        let w = canvas.measureText(title).width;
        let x = ScreenW/2 - w/2;
        let y = ScreenH/2;
        canvas.lineWidth = 4;
        canvas.strokeText(title,x,y);
        canvas.fillStyle="white";
        canvas.fillText(title,x,y);
    }
}

//ブロックを表示する
function drawBlock(i,j,c){
    let px = j * BlockSize;
    let py = i * BlockSize;
    canvas.fillStyle = Color[c];
    canvas.fillRect(px,py,BlockSize,BlockSize);
    canvas.strokeStyle="gray";
    canvas.strokeRect(px,py,BlockSize,BlockSize);
}

//キー入力
document.onkeydown = function(e){
    if(game)return;
    switch( e.keyCode){
        case 37:    //左
            if(Checkmove(-1,0,Tetro))TetroX--;
            break;
        case 38:    //上
            let newTetro = Rotate();
            if(Checkmove(0,0,newTetro))Tetro = newTetro;
            break;
        case 39:    //右
            if(Checkmove(1,0,Tetro))TetroX++;
            break;
        case 40:    //下
            if(Checkmove(0,1,Tetro))TetroY++;
            break;
    }
    drawTetris();
}

//回転させる
function Rotate(){
    let newTetro = [];
    for(let i=0;i<TetroSize;i++){
        newTetro[i] = [];
        for(let j=0;j<TetroSize;j++){
            newTetro[i][j] = Tetro[TetroSize-j-1][i];
        }
    }
    return newTetro;
}

//移動できるか確認する
function Checkmove(x,y,newTetro){
    if(newTetro == undefined) newTetro = Tetro;
    for(let i=0;i<TetroSize;i++){
        for(let j=0;j<TetroSize;j++){
            let newX = TetroX + x + j;
            let newY = TetroY + y + i;
            if(newTetro[i][j]){
                if(newY < 0 || newX < 0 || Fieldrow <= newY || Fieldcol <= newX || field[newY][newX]){
                    return false;
                }
            }
        }
    }
    return true;
}

//テトロを固定する
function FixTetro(){
    for(let i=0;i<TetroSize;i++){
        for(let j=0;j<TetroSize;j++){
            if(Tetro[i][j]){
                field[TetroY + i][TetroX + j] = random;
            }
        }
    }
}

//消す処理
function CheckLine(){
    let linecnt = 0;
    for(let i=0;i<Fieldrow;i++){
        let flag = true;
        for(let j=0;j<Fieldcol;j++){
            if(!field[i][j]){
                flag = false;
                break;
            }
        }
        
        if(flag){
            linecnt++;
            for(let newY=i;0<newY;newY--){
                for(let newX=0;newX<Fieldcol;newX++){
                    field[newY][newX] = field[newY-1][newX];
                }
            }
        }
    }
    for(let i=linecnt;0<i;i++){
        GameSpeed -= 10;
    }
}