import { AbstractUIText } from "./abstract";

export class ClickableText extends AbstractUIText {
    private _url: string;

    constructor(text: string, url: string) {
        super({
            fill: 0xffffff,
            fontSize: 16,
            fontStyle: 'italic'
        })

        this.text = text;
        this._url = url;

        this.interactive = true;
        this.buttonMode = true;
        this.on('pointerdown', this.onClick);
    }

    private onClick() {
        window.open(this._url);
    }
}