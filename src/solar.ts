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

        this.app.camera.addChild(this.planets.Sun)
    }

    public start() {
        this.app.pixi.ticker.add((delta) => { 
            this.planets.Sun.update(delta)
        })
    }
}