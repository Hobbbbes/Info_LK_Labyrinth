

export default class Room_Draw{
    private hasSword : boolean;
    private hasMonster : boolean;
    public fight : boolean = false;
    private MonsterFrameNumber : number;
    private x : number;
    private y : number;
    private isOpen : number; //Closed, Left,Down,Right,Up
    private static wallSprite : HTMLImageElement;
    private static swordSprite : HTMLImageElement;
    private static monsterSprites : HTMLImageElement[] = [];
    private static ctx : CanvasRenderingContext2D;
    static setSprites(document : Document,wallPath : string, swordPath : string, monsterPath : string, monsterNumberSprites){
        this.wallSprite = document.createElement("img");
        this.wallSprite.src = wallPath;
        this.swordSprite = document.createElement("img");
        this.swordSprite.src = swordPath;
        for (let i = 0; i < monsterNumberSprites; i++) {
            const img = document.createElement("img");
            img.src = monsterPath+`${i.toString()}.png`;
            this.monsterSprites.push(img);
        }

    }
    static setContext(ctx : CanvasRenderingContext2D){
        this.ctx = ctx;
    }
    constructor(hasSword : boolean, hasMonster : boolean, x : number, y : number, isOpen : number = 0){
        this.hasMonster = hasMonster;
        this.hasSword = hasSword;
        this.x = x;
        this.y = y;
        this.MonsterFrameNumber = 0;
        this.isOpen = isOpen;
        setInterval(() => {
            this.MonsterFrameNumber += 1;
          }, 100);
    }
    draw(){
        for(var x = this.x - 50; x <= this.x + 50; x+=25){
            Room_Draw.ctx.drawImage(Room_Draw.wallSprite, x, this.y + 50,25,25);
            Room_Draw.ctx.drawImage(Room_Draw.wallSprite, x, this.y - 50,25,25);
            if(this.isOpen == 2){
                Room_Draw.ctx.fillRect( x, this.y + 50,25,25);
            } else if(this.isOpen == 4){
                Room_Draw.ctx.fillRect( x, this.y - 50,25,25);
            }
        }
        for(var y = this.y - 50; y <= this.y + 50; y+=25){
            Room_Draw.ctx.drawImage(Room_Draw.wallSprite, this.x + 50, y,25,25);
            Room_Draw.ctx.drawImage(Room_Draw.wallSprite, this.x - 50, y,25,25);
            if(this.isOpen == 1){
                Room_Draw.ctx.fillRect( this.x + 50, y,25,25);
            } else if(this.isOpen == 3){
                Room_Draw.ctx.fillRect( this.x + 50, y,25,25);
            }
        }
        if (this.hasMonster && !this.fight){
            Room_Draw.ctx.drawImage(Room_Draw.monsterSprites[0], this.x-50, this.y-50);
        } else if(this.fight && this.hasMonster){
            Room_Draw.ctx.drawImage(Room_Draw.monsterSprites[this.MonsterFrameNumber % (Room_Draw.monsterSprites.length -1)], this.x-50, this.y-50);
        }
        if(this.hasSword){
            Room_Draw.ctx.drawImage(Room_Draw.swordSprite,this.x-20,this.y-20);
        }
    }
}