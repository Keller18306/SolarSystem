import { AbstractUIText } from "./abstract";

export class TickersText extends AbstractUIText {
    constructor() {
        super({
            fill: 0xffffff,
            fontSize: 10
        })
    }

    public update(delta: number): void {
        this.text = `Tickers: ${this.app.pixi.ticker.count}`
    }
}