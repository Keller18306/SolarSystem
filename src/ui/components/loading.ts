import * as PIXI from 'pixi.js'
import { App } from '../..';
import { AppResources } from '../../resources';

export class Loading extends PIXI.Container {
    private app: App;
    private loader: AppResources;

    private loadingMessage: PIXI.Text;
    private textProgress: PIXI.Text;
    private barProgress: PIXI.Graphics;
    private ticker: PIXI.Ticker;

    constructor(app: App) {
        super()
        this.app = app;
        this.ticker = this.app.pixi.ticker;
        this.loader = this.app.resources;

        this.loadingMessage = new PIXI.Text('Loading Resources...', {
            align: 'center',
            fontFamily: 'Arial',
            fontSize: 64,
            fill: 0xffffff,
        })

        this.loadingMessage.x = this.app.pixi.screen.width / 2 - this.loadingMessage.width / 2
        this.loadingMessage.y = this.app.pixi.screen.height / 2 - this.loadingMessage.height / 2

        this.textProgress = new PIXI.Text('0%', {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xffffff,
        })
        this.textProgress.x = this.loadingMessage.x + this.loadingMessage.width - this.textProgress.width
        this.textProgress.y = this.loadingMessage.y + this.loadingMessage.height + 10

        this.barProgress = new PIXI.Graphics()

        this.addChild(this.loadingMessage)
        this.addChild(this.textProgress)
        this.addChild(this.barProgress)

        this.ticker.add(this.update.bind(this))
        this.on('destroyed', () => {
            this.ticker.remove(this.update)
        })
        this.update()
    }

    private drawProgressBar() {
        const progress = this.loader.getLoadingProgress()

        this.barProgress.clear()

        this.barProgress.beginFill(0x2b2b2b, 1)
        this.barProgress.drawRect(this.loadingMessage.x, this.loadingMessage.y + this.loadingMessage.height + 4, this.loadingMessage.width, 2)

        this.barProgress.beginFill(0xffffff, 1)
        this.barProgress.drawRect(this.loadingMessage.x, this.loadingMessage.y + this.loadingMessage.height + 4, this.loadingMessage.width * progress / 100, 2)
        
        this.barProgress.endFill()
    }

    public update() {
        this.textProgress.text = this.loader.getLoadingProgress().toFixed(2) + '%';
        this.textProgress.x = this.loadingMessage.x + this.loadingMessage.width - this.textProgress.width;
        this.drawProgressBar()
    }
}