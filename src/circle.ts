import * as PIXI from 'pixi.js';

type CircleParams = {
    x: number;
    y: number;
    radius: number;

    color?: number;
}

export class Circle extends PIXI.Graphics {
    constructor({ x, y, radius, color }: CircleParams) {
        super()

        //this.lineStyle(10, 255); // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
        this.beginFill(color || 0xffffff, 1);
        this.drawCircle(x, y, radius);
        this.endFill();
    }
}