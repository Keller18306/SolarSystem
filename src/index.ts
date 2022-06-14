import * as PIXI from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import { Button } from './ui/components/button';
import { Solar } from './solar';
import { Storage } from './storage';
import { PlanetInfoContainer } from './ui/components/planetInfo';
import { AppEvents } from './events';
import { AppUI } from './ui';
import { AppResources } from './resources';

export class App {
    private static _instance?: App

    public static getInstance(): App {
        if (!this._instance) {
            throw new Error('App not created')
        }

        return this._instance
    }

    public static create(): App {
        if (this._instance) throw new Error('App already created')

        this._instance = new App()

        return this._instance
    }

    public pixi: PIXI.Application;
    public camera: Viewport;
    public events: AppEvents
    public ui: AppUI
    public resources: AppResources;

    public texts: { [key: string]: PIXI.Text } = {}

    public storage: Storage;

    public solar: Solar

    public planetInfo?: PlanetInfoContainer
    public infoLocked: boolean = false;

    private constructor() {
        PIXI.utils.skipHello();

        this.pixi = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            resolution: window.devicePixelRatio,
            forceCanvas: new URLSearchParams(window.location.search).get('forceCanvas') === 'true'
        })

        this.pixi.view.style.width = '100%'
        this.pixi.view.style.height = '100%'
        document.body.appendChild(this.pixi.view)

        this.camera = new Viewport({
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
        });

        this.camera.drag().wheel()

        this.pixi.stage.sortableChildren = true

        this.pixi.stage.interactive = true
        this.pixi.stage.addChild(this.camera)

        this.storage = Storage.getInstance()

        this.solar = new Solar(this)

        this.events = new AppEvents(this)
        this.ui = new AppUI(this)
        this.resources = new AppResources()

        this.run()
    }

    public get scale(): number {
        return Math.min(this.camera.scale.x, this.camera.scale.y)
    }

    public set scale(value: number) {
        this.camera.scale.set(value, value)

        this.storage.setNumber('scale', value)
    }

    public async run() {
        this.ui.showLoadingMessage()
        await this.resources.startLoding()

        this.solar.start()
        this.ui.initTexts()
        this.controllButtons()

        this.scale = this.storage.getNumber('scale') || 0.002

        this.camera.x = this.storage.getNumber('posX') || this.pixi.screen.width / 2
        this.camera.y = this.storage.getNumber('posY') || this.pixi.screen.height / 2

        this.ui.hideLoadingMessage()
    }

    private controllButtons() {
        const buttons = new PIXI.Container()

        buttons.addChild(new Button({
            x: 30,
            y: this.pixi.screen.height - 50 - 10,

            text: 'Центрировать',

            color: 0xffffff,

            textColor: 0x000000,

            onClick: () => {
                this.ui.hidePlanetInfo()
                this.camera.moveCenter(0, 0)

                this.storage.setNumber('posX', this.camera.x)
                this.storage.setNumber('posY', this.camera.y)
            }
        }))

        buttons.addChild(new Button({
            x: 220,
            y: this.pixi.screen.height - 50 - 10,

            text: 'Музыка (выкл)',

            color: 0xffffff,

            textColor: 0x000000,

            onClick: (button) => {
                const src = './static/audio/ambient.wav'

                const audio = this.resources.loaded.audio[src]
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

        this.pixi.stage.addChild(buttons)
    }
}

window.onload = () => {
    (window as any).app = App.create()
}
