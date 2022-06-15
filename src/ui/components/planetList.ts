import * as PIXI from 'pixi.js'
import { AbstractPlanet } from '../../planets/abstract'

export class PlanetList extends PIXI.Container {
    private _offsetX: number = 10;
    private _offsetY: number = 2;

    private _y: number = 0;

    constructor(mainPlanet: AbstractPlanet) {
        super()

        this.planetAction(mainPlanet, 0);
    }

    private planetAction(planet: AbstractPlanet, xLevel: number) {
        this.setPlanetText(planet, xLevel);
        
        const planets = planet.getChildPlanets();
        for (const child of planets) {
            this.planetAction(child, xLevel+1);
        }
    }

    private setPlanetText(planet: AbstractPlanet, xLevel: number) {
        const text = new PIXI.Text('• '+planet.info.name, {
            fontSize: 12,
            fill: 0xffffff,
        })

        text.interactive = true
        text.buttonMode = true

        text.x = this._offsetX * xLevel;

        text.y = this._y;
        this._y += this._offsetY + text.height;

        text.on('pointerdown', () => {
            planet.selectObject()
        })

        this.addChild(text);
    }
}