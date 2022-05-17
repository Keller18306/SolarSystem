import { AbstractUIText } from "./abstract";

export class CamYText extends AbstractUIText {
    constructor() {
        super({
            fill: 0xffffff,
            fontSize: 10
        })
    }

    public update(delta: number): void {
        this.text = `camY: ${this.app.camera.y.toFixed(2)}`
    }
}