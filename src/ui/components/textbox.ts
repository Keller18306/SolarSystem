import * as PIXI from 'pixi.js'
import { App } from '../..';

type Align = 'vertical' | 'horizontal';
type AlignX = 'left' | 'center' | 'right'
type AlignY = 'top' | 'middle' | 'bottom'

type TextBoxParams = {
    x: number,
    y: number,
    align?: Align,
    alignX?: AlignX,
    alignY?: AlignY,
    offset: number
}

export class TextBox extends PIXI.Container {
    protected app: App;

    private _x: number;
    private _y: number;
    private textOffset: number;
    private align: Align;
    private alignX: AlignX;
    private alignY: AlignY;
    private texts: PIXI.Text[] = [];

    constructor(params: TextBoxParams, texts: PIXI.Text[]) {
        super()

        this._x = params.x;
        this._y = params.y;
        this.textOffset = params.offset;
        this.align = params.align || 'horizontal';
        this.alignX = params.alignX || 'left';
        this.alignY = params.alignY || 'top';
        this.texts = texts

        this.app = App.getInstance();

        const updater = this.update.bind(this);

        this.app.pixi.ticker.add(updater);

        this.on('destroyed', () => {
            this.app.pixi.ticker.remove(updater);
        })

        this.update(0);

        for(const text of this.texts) {
            this.addChild(text);
        }
    }

    private getTextsSize(): { width: number, height: number } {
        let width: number = 0;
        let height: number = 0;

        let maxWidth: number = 0;
        let maxHeight: number = 0;

        for (const text of this.texts) {
            if (text.width > maxWidth) {
                maxWidth = text.width;
            }

            if (text.height > maxHeight) {
                maxHeight = text.height;
            }

            if (this.align === 'horizontal') {
                width += text.width;
            }
            if (this.align === 'vertical') {
                height += text.height;
            }
        }

        if (this.align === 'horizontal') {
            width += this.textOffset * (this.texts.length - 1);
            height = maxHeight;
        }

        if (this.align === 'vertical') {
            width = maxWidth;
            height += this.textOffset * (this.texts.length - 1);
        }

        return {
            width: width,
            height: height
        }
    }

    public update(delta: number): void {
        const { width, height } = this.app.pixi.screen;
        const { width: maxWidth, height: maxHeight } = this.getTextsSize()

        let x: number = 0;
        switch (this.alignX) {
            case 'left':
                x = this._x;
                break;
            case 'center':
                x = width / 2 - maxWidth / 2 + this._x;
                break;
            case 'right':
                x = width - maxWidth - this._x;
                break;
        }

        let y: number = 0;
        switch (this.alignY) {
            case 'top':
                y = this._y;
                break;
            case 'middle':
                y = height / 2 - maxHeight / 2 + this._y;
                break;
            case 'bottom':
                y = height - maxHeight - this._y;
                break;
        }

        let _x: number = 0;
        let _y: number = 0;
        for (const text of this.texts) {
            text.x = _x;
            text.y = _y;

            switch (this.align) {
                case 'horizontal':
                    _x += text.width + this.textOffset;
                    break;
                case 'vertical':
                    _y += text.height + this.textOffset;
                    break;
            }
        }

        this.x = Math.round(x);
        this.y = Math.round(y);
    }
}