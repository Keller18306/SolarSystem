import { App } from "../..";
import { AbstractUIText } from "./abstract";

export class ScaleText extends AbstractUIText {
    constructor() {
        super({
            fill: 0xffffff,
            fontSize: 10
        })
    }

    public update(delta: number): void {
        this.text = `Scale: ${this.app.scale.toFixed(5)}X`
    }
}