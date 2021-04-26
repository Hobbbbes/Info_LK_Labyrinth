export default class Player{
    public x : number;
    public y : number;
    private frames: HTMLImageElement[] = [];
    private static ctx : CanvasRenderingContext2D;
    private frameNumber : number;
    private maxFrames : number;
    static setContext(ctx : CanvasRenderingContext2D){
        this.ctx = ctx;
    }
    constructor(path : string, document : Document, x: number,y: number, maxFrames : number){
        this.x = x;
        this.y = y;
        this.frameNumber = 0;
        for (let i = 0; i < maxFrames; i++) {
            const img = document.createElement("img");
            img.src = path+`${i.toString().padStart(2, "0")}.png`;
            this.frames.push(img);
        }
        this.maxFrames = maxFrames;
        setInterval(() => {
            this.frameNumber += 1;
          }, 100);
    }
    draw(){
        Player.ctx.drawImage(this.frames[this.frameNumber % this.maxFrames], this.x, this.y,this.frames[0].width*2,this.frames[0].height*2);
    }
}