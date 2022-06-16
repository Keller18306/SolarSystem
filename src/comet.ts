import * as PIXI from 'pixi.js'
import { App } from '.';
import { Circle } from './circle';
import { AbstractCosmicObject, ObjectInfo } from './object';
import { rand } from './utils/rand';

export class Comet extends AbstractCosmicObject {
    public info: ObjectInfo = {
        type: 'comet',
        name: 'Галлея',
    };

    public radius: number = 1000;

    public ellipseOffset: number = 9000;
    public ellipseWidth: number = 35000;
    public ellipseHeight: number = 170000;

    protected orbit?: PIXI.Graphics;
    protected selectedOrbit?: PIXI.Graphics;
    public orbitAngle: number = rand(0, 360);
    public orbitSpeed: number = 0.03;
    public orbitColor: number = 0xffffff;

    public rotateAngle: number = 162.5;

    constructor(app: App) {
        super();

        this.app = app; 
    }

    public override init() {
        super.init();

        this.addChild(new Circle({
            x: 0,
            y: 0,
            radius: this.radius,
            color: 0xffffff,
        }))

        this.setupText()
    }

    protected setupOrbit() {
        const offset: number = this.ellipseOffset
        const width: number = this.ellipseWidth
        const height: number = this.ellipseHeight

        this.orbit = new PIXI.Graphics();
        this.selectedOrbit = new PIXI.Graphics();

        this.orbit.lineStyle({
            color: this.orbitColor,
            width: 1,  
            alpha: 0.1,
            native: true
        });

        this.selectedOrbit.lineStyle({
            color: 0x00ff00,
            width: 1,
            alpha: 0.5,
            native: true
        })
        

        this.orbit.drawEllipse(0, -height + offset, width, height);
        this.orbit.angle = this.rotateAngle

        this.selectedOrbit.drawEllipse(0, -height + offset, width, height);
        this.selectedOrbit.angle = this.rotateAngle

        this.orbit.visible = !this.isSelected
        this.selectedOrbit.visible = this.isSelected

        this.app.camera.addChildAt(this.orbit, 0);
        this.app.camera.addChildAt(this.selectedOrbit, 0);
    }

    public update(delta: number) {
        const a = this.ellipseWidth;
        const b = this.ellipseHeight;

        const x = 0;
        const y = -b + this.ellipseOffset;

        const orbitAngleInRadians = this.orbitAngle * Math.PI / 180;

        const t = orbitAngleInRadians;

        //координаты на элипсе по углу
        const _x = x + a * Math.cos(t);
        const _y = y + b * Math.sin(t);

        //координаты на элипсе после вращения элипса
        const __x = _x * Math.cos(this.rotateAngle * Math.PI / 180) - _y * Math.sin(this.rotateAngle * Math.PI / 180);
        const __y = _x * Math.sin(this.rotateAngle * Math.PI / 180) + _y * Math.cos(this.rotateAngle * Math.PI / 180);

        this.position.set(__x, __y);

        this.orbitAngle += this.orbitSpeed * delta;

        if (this.orbitAngle > 360) this.orbitAngle -= 360;
        if (this.orbitAngle < 0) this.orbitAngle += 360;

        this.orbit!.visible = !this.isSelected
        this.selectedOrbit!.visible = this.isSelected
    }
}