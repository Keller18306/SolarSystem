import * as PIXI from 'pixi.js';
import { App } from '../..';

export abstract class AbstractUIText extends PIXI.Text {
    protected app: App;

    constructor(style?: PIXI.TextStyle | Partial<PIXI.ITextStyle>) {
        super('', style);

        this.app = App.getInstance();

        const updater = this.update.bind(this);

        this.app.pixi.ticker.add(updater);

        this.on('destroyed', () => {
            this.app.pixi.ticker.remove(updater);
        })
    }

    public abstract update(delta: number): void;
}