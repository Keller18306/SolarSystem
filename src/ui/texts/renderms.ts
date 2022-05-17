import { AbstractUIText } from "./abstract";

export class RenderMsText extends AbstractUIText {
    constructor() {
        super({
            fill: 0xffffff,
            fontSize: 10
        })
    }

    public update(delta: number): void {
        this.text = `Render: ${this.app.pixi.ticker.deltaMS.toFixed(2)} ms.`
    }
}