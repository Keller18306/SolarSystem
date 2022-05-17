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

export class AppUI {
    private app: App;

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
    }

    public showPlanetInfo(planet: AbstractPlanet): void {
        if (this.app.planetInfo) {
            this.app.planetInfo.planet.isSelected = false
            this.app.planetInfo.destroy()
        }

        planet.isSelected = true
        const container = new PlanetInfoContainer(planet, this.app.pixi.ticker)

        container.x = this.app.pixi.screen.width - container.width - 2
        container.y = this.app.pixi.screen.height - container.height - 2

        this.app.planetInfo = container

        this.app.pixi.stage.addChild(container);
    }

    public hidePlanetInfo(): void {
        if (this.app.planetInfo) {
            this.app.planetInfo.planet.isSelected = false
            this.app.planetInfo.destroy()
            this.app.planetInfo = undefined
        }

        this.app.infoLocked = false
    }
}