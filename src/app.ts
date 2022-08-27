import * as PIXI from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import { Solar } from './solar';
import { Storage } from './storage';
import { PlanetInfoContainer } from './ui/components/planetInfo';
import { AppEvents } from './events';
import { AppUI } from './ui';
import { AppResources } from './resources';
import './styles.css';

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
        this.ui.init()

        this.scale = this.storage.getNumber('scale') || 0.002

        this.camera.x = this.storage.getNumber('posX') || this.pixi.screen.width / 2
        this.camera.y = this.storage.getNumber('posY') || this.pixi.screen.height / 2

        this.ui.hideLoadingMessage()
    }
}

window.onload = () => {
    (window as any).app = App.create()
}
