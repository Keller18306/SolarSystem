import * as PIXI from 'pixi.js'
import { App } from "..";
import { AbstractPlanet } from "../planets/abstract";
import { PlanetInfoContainer } from './components/planetInfo';
import { TextBox } from './components/textbox';
import { CamXText } from './texts/camX';
import { CamYText } from './texts/camY';
import { FPSText } from './texts/fps';
import { TickersText } from './texts/tickers';
import { RenderMsText } from './texts/renderms';
import { ScaleText } from './texts/scale';
import { PlanetList } from './components/planetList';

export class AppUI {
    private app: App;

    private loadingMessage?: PIXI.Text;

    constructor(app: App) {
        this.app = app;
    }

    public initTexts(): void {
        const container = this.app.pixi.stage

        //this.app.camera.
        container.addChild(new TextBox({
            x: 1, y: 1, offset: 8,
            align: 'horizontal',
            alignX: 'left',
            alignY: 'bottom'
        }, [
            new ScaleText(),
            new CamXText(),
            new CamYText()
        ]))

        container.addChild(new TextBox({
            x: 1, y: 1, offset: 0,
            align: 'vertical',
            alignX: 'right',
            alignY: 'top'
        }, [
            new FPSText(),
            new RenderMsText(),
            new TickersText()
        ]))

        container.addChild(new PlanetList(this.app.solar.planets['Sun']))
    }

    public showPlanetInfo(planet: AbstractPlanet): void {
        if (this.app.planetInfo) this.hidePlanetInfo()

        const container = new PlanetInfoContainer(planet, this.app.pixi.ticker)

        container.x = this.app.pixi.screen.width - container.width - 2
        container.y = this.app.pixi.screen.height - container.height - 2

        this.app.planetInfo = container

        this.app.pixi.stage.addChild(container);
    }

    public hidePlanetInfo(deselect: boolean = true): void {
        if (!this.app.planetInfo) return;

        if (deselect) {
            this.app.planetInfo.planet.deselectPlanet(false)
        }
        this.app.planetInfo.destroy()
        this.app.planetInfo = undefined
    }

    public showLoadingMessage(): void {
        if (this.loadingMessage) return;

        this.loadingMessage = new PIXI.Text('Loading Resources...', {
            fontFamily: 'Arial',
            fontSize: 64,
            fill: 0xffffff,
            align: 'center'
        })

        this.loadingMessage.x = this.app.pixi.screen.width / 2 - this.loadingMessage.width / 2
        this.loadingMessage.y = this.app.pixi.screen.height / 2 - this.loadingMessage.height / 2

        this.app.pixi.stage.addChild(this.loadingMessage)
    }

    public hideLoadingMessage(): void {
        if (!this.loadingMessage) return;

        this.app.pixi.stage.removeChild(this.loadingMessage)
        this.loadingMessage = undefined
    }
}