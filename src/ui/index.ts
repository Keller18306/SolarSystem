import * as PIXI from 'pixi.js'
import { App } from "..";
import { AbstractPlanet } from "../planets/abstract";
import { PlanetInfoContainer } from './components/planetInfo';
import { TextBox } from './components/textbox';
import { FieldText } from './texts/field';
import { PlanetList } from './components/planetList';
import { Loading } from './components/loading';
import { AbstractCosmicObject } from '../object';

export class AppUI {
    private app: App;

    private loadingMessage?: Loading;

    constructor(app: App) {
        this.app = app;
    }

    public initTexts(): void {
        const container = this.app.pixi.stage

        container.addChild(new TextBox({
            x: 1, y: 1, offset: 8,
            align: 'horizontal',
            alignX: 'left',
            alignY: 'bottom'
        }, [
            new FieldText('scale', () => this.app.scale.toFixed(5)),
            new FieldText('camX', () => this.app.camera.x.toFixed(2)),
            new FieldText('camY', () => this.app.camera.y.toFixed(2))
        ]))

        container.addChild(new TextBox({
            x: 1, y: 1, offset: 0,
            align: 'vertical',
            alignX: 'right',
            alignY: 'top'
        }, [
            new FieldText('FPS', () => this.app.pixi.ticker.FPS.toFixed(1)),
            new FieldText('Render', () => this.app.pixi.ticker.deltaMS.toFixed(2)),
            new FieldText('Tickers', () => this.app.pixi.ticker.count.toString())
        ]))

        container.addChild(new PlanetList([
            this.app.solar.planets['Sun'],
            this.app.solar.comet!
        ]))
    }

    public showPlanetInfo(planet: AbstractCosmicObject): void {
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
            this.app.planetInfo.planet.unselectObject(false)
        }
        this.app.planetInfo.destroy()
        this.app.planetInfo = undefined
    }

    public showLoadingMessage(): void {
        if (this.loadingMessage) return;

        this.loadingMessage = new Loading(this.app)

        this.app.pixi.stage.addChild(this.loadingMessage)
    }

    public hideLoadingMessage(): void {
        if (!this.loadingMessage) return;

        this.app.pixi.stage.removeChild(this.loadingMessage)
        this.loadingMessage = undefined
    }
}