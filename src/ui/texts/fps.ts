import { AbstractUIText } from "./abstract";

export class FPSText extends AbstractUIText {
    constructor() {
        super({
            fill: 0xffffff,
            fontSize: 10
        })
    }

    public update(delta: number): void {
        this.text = `FPS: ${this.app.pixi.ticker.FPS.toFixed(1)}`
    }
}