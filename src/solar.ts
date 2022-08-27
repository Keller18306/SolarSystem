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
import { App } from './app';
import { Comet } from './comet';

export class Solar {
    private app: App;

    public stars: PIXI.Graphics;
    public planets: { [key: string]: AbstractPlanet } = {}
    public comet?: Comet;

    constructor(app: App) {
        this.stars = new PIXI.Graphics();

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
        this.app.camera.addChild(this.planets.Sun)
        this.createComet()
        this.planets.Sun.init();
    }

    public generateStars() {
        this.stars.clear();

        for (let i = 0; i < 1000; i++) {
            this.stars.beginFill(0xffffff, 0.3);
            this.stars.drawCircle(Math.random() * this.app.pixi.screen.width, Math.random() * this.app.pixi.screen.height, Math.random() * 1.5);
        };

        this.app.pixi.stage.addChildAt(this.stars, 0);
    }
    
    public createComet() {
        const comet = new Comet(this.app);
        this.comet = comet;

        comet.init()

        this.app.pixi.ticker.add((delta) => {
            comet.update(delta)
        })
            
        this.app.camera.addChild(comet)
    }
}