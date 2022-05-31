import * as PIXI from 'pixi.js';

type ButtonParams = {
    x: number;
    y: number;

    text: string;

    color: number;
    textColor: number;

    width?: number;
    height?: number;

    onClick: (button: Button) => void;
}

export class Button extends PIXI.Container {
    private _buttonWidth?: number;
    private _buttonHeight?: number;
    private color: number;

    private _text: PIXI.Text;
    private _graphics: PIXI.Graphics;

    constructor(params: ButtonParams) {
        super();

        this.color = params.color;

        this._buttonWidth = params.width;
        this._buttonHeight = params.height;

        this.interactive = true;
        this.buttonMode = true;

        this.on('pointerdown', (e) => {
            e.stopPropagation()
            params.onClick(this);
        })

        this._text = new PIXI.Text('', {
            fill: params.textColor,
        })

        this._text.anchor.set(0.5, 0.5);

        this._graphics = new PIXI.Graphics();

        this.addChild(this._graphics);
        this.addChild(this._text);

        this.text = params.text;

        this.position.set(params.x, params.y);
    }

    public set text(value: string) {
        this._text.text = value

        const width = Math.max(this._buttonWidth || 0, this._text.width + 10)
        const height = Math.max(this._buttonHeight || 0, this._text.height + 4)

        this._text.position.set(width / 2, height / 2);

        this._graphics.clear()
        this._graphics.beginFill(this.color, 1);
        this._graphics.drawRect(0, 0, width, height);
        this._graphics.endFill();
    }
}