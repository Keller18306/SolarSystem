import * as PIXI from 'pixi.js'
import { AbstractPlanet } from './planets/abstract';

export class PlanetInfoContainer extends PIXI.Container {
    public planet: AbstractPlanet;

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

    private textY: number = 0

    constructor(planet: AbstractPlanet, ticker: PIXI.Ticker) {
        super();

        this.planet = planet

        const info = Object.assign({}, planet.info);

        for (const key in info) {
            this.addText(`${this.keys[key] || key}: ${info[key]}`)
        }

        this.textY += 20

        const textX = this.addText('X: ' + planet.x.toFixed(3))
        const textY = this.addText('Y: ' + planet.y.toFixed(3))
        const textAngle = this.addText('Угол: ' + planet.orbitAngle.toFixed(1))

        function update() {
            textX.text = 'X: ' + planet.x.toFixed(3)
            textY.text = 'Y: ' + planet.y.toFixed(3)
            textAngle.text = 'Угол: ' + planet.orbitAngle.toFixed(1)
        }
        ticker.add(update)

        this.on('destroyed', () => {
            ticker.remove(update)
        })
    }

    protected addText(_text: string) {
        const text = new PIXI.Text(_text, {
            fill: 0xffffff, fontSize: 12
        });

        text.x = 0
        text.y = this.textY

        this.textY += text.height + 2

        this.addChild(text)

        return text
    }
}