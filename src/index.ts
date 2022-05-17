import * as PIXI from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import { Button } from './ui/components/button';
import { Solar } from './solar';
import { Storage } from './storage';
import { PlanetInfoContainer } from './ui/components/planetInfo';
import { AbstractPlanet } from './planets/abstract';
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
            resolution: window.devicePixelRatio
        })

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
        await this.resources.startLoding()

        this.solar.start()
        this.ui.initTexts()
        this.setupTexts()
        this.controllButtons()
        
        this.scale = this.storage.getNumber('scale') || 0.002

        this.camera.x = this.storage.getNumber('posX') || this.pixi.screen.width / 2
        this.camera.y = this.storage.getNumber('posY') || this.pixi.screen.height / 2
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
                this.camera.plugins.remove('follow')
                this.camera.moveCenter(0, 0)

                this.storage.setNumber('posX', this.camera.x)
                this.storage.setNumber('posY', this.camera.y)
            }
        }))

        this.pixi.stage.addChild(buttons)
    }

    private setupTexts() {
        const texts = new PIXI.Container()

        let planetListY: number = 0
        for (const planetId in this.solar.planets) {
            const planet = this.solar.planets[planetId]

            const text = new PIXI.Text(planet.info.name, {
                fill: 0xffffff, fontSize: 12
            })
            text.x = 2
            text.y = planetListY

            planetListY += text.height + 2

            text.on('pointerdown', () => {
                this.ui.showPlanetInfo(planet);
                this.camera.follow(planet)
                this.infoLocked = true
            })

            /*planet.on('pointerdown', () => {
                console.log('b', planet.info.name)
                this.createPlanetInfo(planet)
                this.infoLocked = true
            })

            planet.on('pointerenter', () => {
                console.log('c')
                this.createPlanetInfo(planet)
            })

            planet.on('pointerleave', () => {
                console.log('d')
                if (this.planetInfo && !this.infoLocked) {
                    this.planetInfo.destroy()
                }
            })*/

            text.interactive = true
            text.buttonMode = true

            texts.addChild(text)
        }

        this.pixi.stage.addChild(texts)
    }
}

window.onload = () => {
    App.create()
}
