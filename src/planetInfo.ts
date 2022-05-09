import * as PIXI from 'pixi.js'
import { AbstractPlanet } from './planets/abstract';

export class PlanetInfoContainer extends PIXI.Container {
    private keys: { [key: string]: string } = {
        name: 'Название',
        diameter: 'Диаметр',
        mass: 'Масса',
        volume: 'Объем',
        density: 'Плотность',
        gravity: 'Сила притяжения',
        temperature: 'Температура',
        pressure: 'Давление',
    }

    constructor(planet: AbstractPlanet) {
        super();

        const info = planet.info;

        let textY = 0;
        for (const key in info) {
            const text = new PIXI.Text(`${this.keys[key] || key}: ${info[key]}`, {
                fill: 0xffffff, fontSize: 12
            });

            text.x = 0
            text.y = textY

            textY += text.height + 2

            this.addChild(text)
        }
    }
}