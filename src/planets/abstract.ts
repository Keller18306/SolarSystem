import * as PIXI from 'pixi.js';
import { App } from '..';
import { Circle } from '../circle';
import { Ring } from '../ring';

export type PlanetInfo = {
    type: 'star' | 'earth-planet' | 'gas-planet' | 'child',
    name: string; // Название
    diameter: string; // Диаметр
    mass: string; // Масса
    volume: string; // Объем
    density: string; // Плотность
    gravity: string; // Сила притяжения
    temperature: string; // Температура
    pressure: string; // Давление

    [key: string]: string
}

export abstract class AbstractPlanet extends PIXI.Container {
    public abstract info: PlanetInfo;

    public abstract radius: number;
    public abstract distance: number;
    public planetColor?: number;
    public planetTexture?: string;
    public textureRotateSpeed: number = 0;

    public isSelected: boolean = false;
    public abstract drawOrbit: boolean;
    private orbit?: Ring;
    private selectedOrbit?: Ring;
    public abstract orbitAngle: number;
    public abstract orbitSpeed: number;
    public abstract orbitColor: number;

    protected childPlanets: AbstractPlanet[];

    private _parent?: AbstractPlanet;
    private _textureSprite?: PIXI.Sprite;

    protected app: App

    constructor(childPlanets: AbstractPlanet[] = []) {
        super();

        this.app = App.getInstance();

        this.childPlanets = childPlanets;
        for (const child of this.childPlanets) {
            child.setParentPlanet(this);
        }

        this.interactive = true;
        this.buttonMode = true;

        this.on('pointerdown', (e, fn) => {
            e.stopPropagation()
            this.selectPlanet();
        })
    }

    get solarX(): number {
        const mainPosition = this.getGlobalPosition(this._parent?.position || this.position);

        return mainPosition.x
    }

    get solarY(): number {
        const mainPosition = this.getGlobalPosition(this._parent?.position || this.position);

        return mainPosition.y
    }

    public init() {
        this.setupOrbit()
        this.setupCircle();

        if (this.planetTexture) {
            this.setupTexture();

            this.addChild(new Circle({
                x: 0,
                y: 0,
                radius: this.radius / 50,
                color: 0x03c400,
            }))
        } else {
            this.addChild(new Circle({
                x: 0,
                y: 0,
                radius: this.radius,
                color: this.planetColor
            }))
        }

        const text = new PIXI.Text(this.info.name, {
            fill: 0x03c400, fontSize: this.radius / 6
        })

        text.x = 10
        text.y = -text.height

        this.addChild(text)

        this.update(0);
    }

    public setParentPlanet(parent: AbstractPlanet) {
        if (this._parent) return;

        parent.addChild(this)
        this._parent = parent;
    }

    private setupCircle() {
        if (this.planetColor == null) return;

        const circle = new Circle({
            x: 0,
            y: 0,
            radius: this.radius,
            color: this.planetColor,
        })

        this.addChild(circle)
    }

    private setupTexture() {
        if (!this.planetTexture) return;

        let img: HTMLImageElement | string = this.app.resources.loaded.image[this.planetTexture]
        if (!img) {
            console.error('Texture not loaded:', this.planetTexture)
            console.log('Start loading via pixi loader:', this.planetTexture)
            img = this.planetTexture
            return;
        }

        const texture = PIXI.Texture.from(img);

        const sprite = new PIXI.Sprite(texture);
        sprite.anchor.set(0.5);
        this._textureSprite = sprite;

        sprite.width = this.radius * 2;
        sprite.height = this.radius * 2;

        this.addChild(sprite);
    }

    private setupOrbit() {
        if (!this._parent) return;

        this.orbit = new Ring({
            x: -this.distance,
            y: -this.distance,
            radius: this.distance,
            color: this.orbitColor,
            alpha: 0.1
        })

        this.selectedOrbit = new Ring({
            x: -this.distance,
            y: -this.distance,
            radius: this.distance,
            color: 0x00ff00,
            alpha: 0.5
        })

        this.orbit.visible = !this.isSelected
        this.selectedOrbit.visible = this.isSelected

        this._parent.addChildAt(this.orbit, 0);
        this._parent.addChildAt(this.selectedOrbit, 0);
    }

    updateOrbit() {
        if (!this.drawOrbit || !this._parent) return;
    }

    private updateSelf(delta: number) {
        if (this._textureSprite) {
            this._textureSprite.rotation += this.textureRotateSpeed * delta;
        }

        if (!this._parent) return;

        const angleInRadians = this.orbitAngle * Math.PI / 180;

        const _x = this.distance * Math.sin(angleInRadians);
        const _y = this.distance * -Math.cos(angleInRadians);

        this.position.set(_x, _y);
        //console.log(this.orbitAngle.toFixed(2), this.position.x, this.position.y);

        this.orbitAngle += this.orbitSpeed * delta;

        if (this.orbitAngle > 360) this.orbitAngle -= 360;
        if (this.orbitAngle < 0) this.orbitAngle += 360;

        if (this.drawOrbit) {
            if (!this.orbit || !this.selectedOrbit) {
                this.setupOrbit();
            }

            this.orbit!.visible = !this.isSelected
            this.orbit!.x = this.distance;
            this.orbit!.y = this.distance;

            this.selectedOrbit!.visible = this.isSelected
            this.selectedOrbit!.x = this.distance;
            this.selectedOrbit!.y = this.distance;
        }
    }

    public update(delta: number) {
        this.updateSelf(delta);

        for (const planet of this.childPlanets) {
            planet.update(delta);
        }
    }

    public getChildPlanets(): AbstractPlanet[] {
        return this.childPlanets;
    }

    public selectPlanet() {
        console.log('select', this.info.name);
        this.app.ui.showPlanetInfo(this);

        this.app.camera.animate({
            position: this,
            width: this.radius * 2 * 8,
            time: this.app.scale < 0.01 ? 1500 : 0,
            callbackOnComplete: () => {
                this.app.camera.follow(this)
            }
        })

        this.app.infoLocked = true;
        this.isSelected = true;
    }

    public deselectPlanet(hidePlanetInfo: boolean = true) {
        this.app.camera.plugins.remove('follow')

        if (hidePlanetInfo) {
            this.app.ui.hidePlanetInfo(false)
        }

        this.app.infoLocked = false;
        this.isSelected = false;
    }
}