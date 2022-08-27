import * as PIXI from 'pixi.js'
import { App } from "../app";
import { AbstractPlanet } from "../planets/abstract";
import { PlanetInfoContainer } from './components/planetInfo';
import { TextBox } from './components/textbox';
import { FieldText } from './texts/field';
import { PlanetList } from './components/planetList';
import { Loading } from './components/loading';
import { AbstractCosmicObject } from '../object';
import { Button } from './components/button';
import { ClickableText } from './texts/clickable';

export class AppUI {
    private app: App;

    private loadingMessage?: Loading;
    private buttons: PIXI.Container;

    constructor(app: App) {
        this.app = app;

        this.buttons = new PIXI.Container();
        this.app.pixi.stage.addChild(this.buttons);
    }

    public init() {
        this.initTexts();
        this.initButtons();
    }

    public redrawButtons() {
        this.buttons.removeChild(...this.buttons.children);

        this.initButtons();
    }

    private initTexts(): void {
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
            alignY: 'top',
            autoMaxWidth: true
        }, [
            new FieldText('FPS', () => this.app.pixi.ticker.FPS.toFixed(1)),
            new FieldText('Render', () => this.app.pixi.ticker.deltaMS.toFixed(2)),
            new FieldText('Tickers', () => this.app.pixi.ticker.count.toString())
        ]))

        container.addChild(new PlanetList([
            this.app.solar.planets['Sun'],
            this.app.solar.comet!
        ]))

        container.addChild(new TextBox({
            x: 0,
            y: 10,
            offset: 0,
            alignX: 'center'
        }, [
            new ClickableText('Made by Keller (GitHub)', 'https://github.com/Keller18306')
        ]))
    }

    private initButtons() {
        this.buttons.addChild(new Button({
            x: 30,
            y: this.app.pixi.screen.height - 50 - 10,

            text: 'Центрировать',

            color: 0xffffff,

            textColor: 0x000000,

            onClick: () => {
                this.app.ui.hidePlanetInfo()
                this.app.camera.moveCenter(0, 0)

                this.app.storage.setNumber('posX', this.app.camera.x)
                this.app.storage.setNumber('posY', this.app.camera.y)
            }
        }))

        this.buttons.addChild(new Button({
            x: 220,
            y: this.app.pixi.screen.height - 50 - 10,

            text: 'Музыка (выкл)',

            color: 0xffffff,

            textColor: 0x000000,

            onClick: (button) => {
                const src = './static/audio/ambient.wav'

                const audio = this.app.resources.loaded.audio[src]
                audio.onended = () => {
                    console.log(`Music (${src}) ended, restarting...`)
                    audio.play()
                }

                let state: string;
                if (audio.paused) {
                    audio.play()
                    state = '(вкл)'
                } else {
                    audio.pause()
                    state = '(выкл)'
                }

                button.text = `Музыка ${state}`
            }
        }))
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