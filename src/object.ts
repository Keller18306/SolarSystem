import * as PIXI from 'pixi.js';
import { App } from '.';
import { Circle } from './circle';

export type ObjectInfo = {
    type: 'star' | 'earth-planet' | 'gas-planet' | 'child' | 'comet',
    name: string; // Название

    diameter?: string; // Диаметр
    mass?: string; // Масса
    volume?: string; // Объем
    density?: string; // Плотность
    gravity?: string; // Сила притяжения
    temperature?: string; // Температура
    pressure?: string; // Давление

    [key: string]: string | undefined
}

export abstract class AbstractCosmicObject extends PIXI.Container {
    public abstract info: ObjectInfo;

    public abstract radius: number;

    public isSelected: boolean = false;
    protected abstract orbit?: PIXI.Graphics;
    protected abstract selectedOrbit?: PIXI.Graphics;
    public abstract orbitAngle: number;
    public abstract orbitSpeed: number;
    public abstract orbitColor: number;

    protected app: App;

    constructor() {
        super();

        this.app = App.getInstance();

        this.interactive = true;
        this.buttonMode = true;

        this.on('pointerdown', (e, fn) => {
            e.stopPropagation()
            this.selectObject();
        })
    }

    protected abstract setupOrbit(): void;

    public init() {
        this.setupOrbit()

        this.update(0);
    }

    protected setupText() {
        const text = new PIXI.Text(this.info.name, {
            fill: 0x03c400, fontSize: this.radius / 6
        })

        text.x = 10
        text.y = -text.height
        
        this.addChild(new Circle({
            x: 0,
            y: 0,
            radius: this.radius / 50,
            color: 0x03c400,
        }))

        this.addChild(text)
    }

    public abstract update(delta: number): void;

    public selectObject() {
        this.app.ui.showPlanetInfo(this);

        this.app.camera.animate({
            position: this.position,
            width: this.radius * 2 * 8,
            time: this.app.scale < 0.01 ? 1500 : 0,
            callbackOnComplete: () => {
                this.app.camera.follow(this)
            }
        })
        this.app.camera.wheel({
            center: this.position
        })

        this.app.infoLocked = true;
        this.isSelected = true;
    }

    public unselectObject(hidePlanetInfo: boolean = true) {
        this.app.camera.plugins.remove('follow')
        this.app.camera.wheel()

        if (hidePlanetInfo) {
            this.app.ui.hidePlanetInfo(false)
        }

        this.app.infoLocked = false;
        this.isSelected = false;
    }
}