import * as PIXI from 'pixi.js';
import { Sun } from './planets/Sun';
import { Earth } from './planets/Earth';
import { Jupiter } from './planets/Jupiter';
import { Mars } from './planets/Mars';
import { Mercury } from './planets/Mercury';
import { Moon } from './planets/Moon';
import { Neptune } from './planets/Neptune';
import { Saturn } from './planets/Saturn';
import { Uranus } from './planets/Uranus';
import { Venus } from './planets/Venus';
import { AbstractPlanet } from './planets/abstract';
import { App } from '.';

export class Solar {
    private app: App;

    public planets: { [key: string]: AbstractPlanet } = {}

    constructor(app: App) {
        this.app = app;
    }

    public start() {
        this.planets.Sun = new Sun([
            this.planets.Mercury = new Mercury(),
            this.planets.Venus = new Venus(),
            this.planets.Earth = new Earth([
                this.planets.Moon = new Moon()
            ]),
            this.planets.Mars = new Mars(),
            this.planets.Jupiter = new Jupiter(),
            this.planets.Saturn = new Saturn(),
            this.planets.Uranus = new Uranus(),
            this.planets.Neptune = new Neptune()
        ])

        this.app.pixi.ticker.add((delta) => { 
            this.planets.Sun.update(delta)
        })

        this.generateStars()
        this.createComet()
        this.app.camera.addChild(this.planets.Sun)
        this.planets.Sun.init();
    }

    public generateStars() {
        const graphics = new PIXI.Graphics();

        for (let i = 0; i < 1000; i++) {
            graphics.beginFill(0xffffff, 0.3);
            graphics.drawCircle(Math.random() * this.app.pixi.screen.width, Math.random() * this.app.pixi.screen.height, Math.random() * 1.5);
        }

        this.app.pixi.stage.addChildAt(graphics, 0);
    }

    public createComet() {
        const graphics = new PIXI.Graphics();

        graphics.lineStyle({
            color: 0xffffff,
            width: 1,  
            alpha: 0.2,
            native: true
        });

        const offset: number = 9000
        const width: number = 35000
        const height: number = 170000

        graphics.drawEllipse(0, -height + offset, width, height);
        graphics.rotation = 162.5

        this.app.camera.addChildAt(graphics, 0);
    }
}