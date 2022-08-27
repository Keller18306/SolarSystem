import * as PIXI from 'pixi.js';
import { App } from '../../app';

export abstract class AbstractUIText extends PIXI.Text {
    protected app: App;

    constructor(style?: PIXI.TextStyle | Partial<PIXI.ITextStyle>) {
        super('', style);

        this.app = App.getInstance();

        if (this.update) {
            const updater = this.update.bind(this);

            this.app.pixi.ticker.add(updater);

            this.on('destroyed', () => {
                this.app.pixi.ticker.remove(updater);
            })
        }
    }

    public update?(delta: number): void;
}