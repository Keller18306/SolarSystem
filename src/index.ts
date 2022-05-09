import * as PIXI from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import { Button } from './button';
import { Solar } from './solar';
import { Storage } from './storage';
import { PlanetInfoContainer } from './planetInfo';
import { AbstractPlanet } from './planets/abstract';

export class Main {
    private static instance?: Main;

    public static getInstance(): Main {
        if (!Main.instance) {
            Main.instance = new Main()
        }

        return Main.instance
    }

    private images: string[] = [
        './static/images/mars.png',
        './static/images/neptune.png',
        './static/images/venus.png',
    ]

    public app: PIXI.Application;
    public camera: Viewport;

    private width: number = window.innerWidth
    private height: number = window.innerHeight

    private texts: { [key: string]: PIXI.Text } = {}

    private storage: Storage;

    private solar: Solar

    private planetInfo?: PlanetInfoContainer
    private infoLocked: boolean = false;

    constructor() {
        PIXI.utils.skipHello();
        this.app = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            resolution: window.devicePixelRatio
        })

        document.body.appendChild(this.app.view)

        this.camera = new Viewport({
            screenWidth: this.width,
            screenHeight: this.height,
        });
        this.camera.drag().wheel()

        this.app.stage.sortableChildren = true

        this.app.stage.interactive = true
        this.app.stage.addChild(this.camera)

        this.storage = Storage.getInstance()

        this.solar = new Solar(this.app.ticker, this.camera)

        this.run()
    }

    public get scale(): number {
        return Math.min(this.camera.scale.x, this.camera.scale.y)
    }

    public set scale(value: number) {
        this.camera.scale.set(value, value)

        this.storage.setNumber('scale', value)

        this.texts.scale.text = `Масштаб: ${value.toFixed(5)}X`
    }

    public async run() {
        //await Resources.init()

        const promiseImages = new Promise<void>((resolve) => {
            this.app.loader.load(() => {
                resolve()
            })
        })

        for (const image of this.images) {
            this.app.loader.add(image, image)
        }

        await Promise.all([
            promiseImages
        ])

        this.setupTexts()
        this.setupEvents()
        this.controllButtons()
        
        this.scale = this.storage.getNumber('scale') || 0.002

        this.camera.x = this.storage.getNumber('posX') || this.width / 2
        this.camera.y = this.storage.getNumber('posY') || this.height / 2
    }

    private controllButtons() {
        const buttons = new PIXI.Container()

        buttons.addChild(new Button({
            x: 30,
            y: this.height - 50 - 10,

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

        this.app.stage.addChild(buttons)
    }

    private createPlanetInfo(planet: AbstractPlanet) {
        if (this.planetInfo) {
            this.planetInfo.destroy()
        }

        const container = new PlanetInfoContainer(planet)

        container.x = this.width - container.width - 2
        container.y = this.height - container.height - 2

        this.planetInfo = container

        this.app.stage.addChild(container);
    }

    private setupTexts() {
        const texts = new PIXI.Container()

        this.texts.scale = new PIXI.Text('', { fill: 0xffffff, fontSize: 10 })
        this.texts.scale.x = 0
        this.texts.scale.y = this.height - this.texts.scale.height

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
                this.createPlanetInfo(planet)
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

        texts.addChild(this.texts.scale)

        this.app.stage.addChild(texts)
    }

    private setupEvents() {
        window.onresize = () => {
            const offsetX = window.innerWidth - this.width
            const offsetY = window.innerHeight - this.height

            this.width = window.innerWidth
            this.height = window.innerHeight

            this.app.renderer.resize(this.width, this.height)
            this.camera.resize(this.width, this.height)

            this.camera.x += offsetX / 2
            this.camera.y += offsetY / 2
        }

        this.camera.on('pointerdown', () => {
            this.infoLocked = false
            this.camera.plugins.remove('follow')
            if (this.planetInfo) {
                this.planetInfo.destroy()
            }
        })

        this.camera.on('pointerup', () => {
            this.storage.setNumber('posX', this.camera.position.x)
            this.storage.setNumber('posY', this.camera.position.y)
        })

        this.camera.on('wheel', () => {
            this.storage.setNumber('scale', this.scale)
            this.storage.setNumber('posX', this.camera.position.x)
            this.storage.setNumber('posY', this.camera.position.y)

            this.texts.scale.text = `Масштаб: ${this.scale.toFixed(5)}X`
        })
    }
}

window.onload = () => {
    new Main()
}
