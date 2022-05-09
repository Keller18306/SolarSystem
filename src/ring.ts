import * as PIXI from 'pixi.js';

type RingParams = {
    x: number;
    y: number;

    width?: number;
    radius: number;

    color?: number;
    alpha?: number;
}

export class Ring extends PIXI.Graphics {
    constructor({ width, color, alpha, x, y, radius }: RingParams) {
        super();

        this.lineStyle({
            width: width || 1,
            color: color || 0xffffff,
            native: true,
            alpha: alpha
        });
        this.arc(x, y, radius, 0, Math.PI * 2);
        this.endFill();
    }
}