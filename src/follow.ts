import PIXI from 'pixi.js'
import { AbstractPlanet } from './planets/abstract';

export class Follow {
    private planet: AbstractPlanet;
    private ticker: PIXI.Ticker;

    constructor(planet: AbstractPlanet, ticker: PIXI.Ticker) {
        this.planet = planet;
        this.ticker = ticker;
    }

    private updater() {
        
    }

    start() {
        this.ticker.add(this.updater)
    }

    stop() {
        this.ticker.remove(this.updater)
    }
}