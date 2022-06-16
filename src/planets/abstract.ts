import * as PIXI from 'pixi.js';
import { App } from '..';
import { Circle } from '../circle';
import { AbstractCosmicObject } from '../object';
import { Ring } from '../ring';

export abstract class AbstractPlanet extends AbstractCosmicObject {
    public abstract distance: number;
    public planetColor?: number;
    public planetTexture?: string;
    public textureRotateSpeed: number = 0;

    public isSelected: boolean = false;
    public abstract drawOrbit: boolean;
    protected orbit?: Ring;
    protected selectedOrbit?: Ring;
    public abstract orbitAngle: number;
    public abstract orbitSpeed: number;
    public abstract orbitColor: number;

    protected childPlanets: AbstractPlanet[];

    private _parent?: AbstractPlanet;
    private _textureSprite?: PIXI.Sprite;

    constructor(childPlanets: AbstractPlanet[] = []) {
        super();

        this.app = App.getInstance();

        this.childPlanets = childPlanets;
        for (const child of this.childPlanets) {
            child.setParentPlanet(this);
        }
    }

    get solarX(): number {
        const mainPosition = this.getGlobalPosition(this._parent?.position || this.position);

        return mainPosition.x
    }

    get solarY(): number {
        const mainPosition = this.getGlobalPosition(this._parent?.position || this.position);

        return mainPosition.y
    }

    public override init() {
        super.init();

        if (this.planetTexture) {
            this.setupTexture();
        } else {
            this.setupCircle()
        }

        this.setupText()

        if (this._parent) {
            this.getMainParent().addChild(this);
        }

        for(const planet of this.childPlanets) {
            planet.init();
        }
    }

    public getMainParent(): AbstractPlanet {
        if (!this._parent) return this;

        return this._parent.getMainParent();
    }

    public setParentPlanet(parent: AbstractPlanet) {
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

    protected setupOrbit() {
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

    private updateSelf(delta: number) {
        if (this._textureSprite) {
            this._textureSprite.rotation += this.textureRotateSpeed * delta;
        }

        if (!this._parent) return;

        const angleInRadians = this.orbitAngle * Math.PI / 180;

        const _x = this._parent.x + this.distance * Math.sin(angleInRadians);
        const _y = this._parent.y + this.distance * -Math.cos(angleInRadians);

        this.position.set(_x, _y);

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
}