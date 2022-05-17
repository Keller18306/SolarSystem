import * as PIXI from 'pixi.js';

type ButtonParams = {
    x: number;
    y: number;

    text: string;
    
    color: number;
    textColor: number;

    onClick: () => void;
}

export class Button extends PIXI.Container {
    constructor(params: ButtonParams) {
        super();

        this.interactive = true;

        this.on('pointerdown', () => {
            params.onClick();
        })

        this.on('pointerup', () => {

        })

        const text = new PIXI.Text(params.text, {
            fill: params.textColor,
        })

        const width = text.width + 10
        const height = text.height + 10

        text.anchor.set(0.5, 0.5);
        text.position.set(width / 2, height / 2);

        const graphics = new PIXI.Graphics();

        graphics.beginFill(params.color, 1);
        graphics.drawRect(0, 0, width, height);
        graphics.endFill();

        this.addChild(graphics);
        this.addChild(text);

        this.position.set(params.x, params.y);
    }
}