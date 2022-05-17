import { AbstractUIText } from "./abstract";

export class CamXText extends AbstractUIText {
    constructor() {
        super({
            fill: 0xffffff,
            fontSize: 10
        })
    }

    public update(delta: number): void {
        this.text = `camX: ${this.app.camera.x.toFixed(2)}`
    }
}