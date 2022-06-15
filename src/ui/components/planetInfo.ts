import * as PIXI from 'pixi.js'
import { AbstractCosmicObject } from '../../object';
import { AbstractPlanet } from '../../planets/abstract';

export class PlanetInfoContainer extends PIXI.Container {
    public planet: AbstractCosmicObject;

    private keys: { [key: string]: string } = {
        type: 'Тип',
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

    constructor(planet: AbstractCosmicObject, ticker: PIXI.Ticker) {
        super();

        this.planet = planet

        const info = Object.assign({}, planet.info);

        for (const key in info) {
            let value: string | undefined = info[key];
            if (value === undefined) continue;

            if (key === 'type') {
                switch (value) {
                    case 'star':
                        value = 'звезда';
                        break;
                    case 'earth-planet':
                        value = 'планета земной группы';
                        break;
                    case 'gas-planet':
                        value = 'планета-гигант';
                        break;
                    case 'child':
                        value = 'спутник';
                        break;
                    case 'comet':
                        value = 'комета';
                        break;
                }
            }

            this.addText(`${this.keys[key] || key}: ${value}`)
        }

        const endT = this.textY + 4
        this.textY += 8

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

        const graphics = new PIXI.Graphics();
        graphics.beginFill(0xffffff, 1);
        graphics.drawRect(-4, -4, this.width + 4 + 4, this.height + 4 + 4);
        graphics.endFill();

        graphics.beginHole();
        graphics.drawRect(-3, -3, this.width + 3 + 3, this.height + 3 + 3);
        graphics.endHole();

        graphics.lineStyle(1, 0xffffff, 1);
        graphics.moveTo(-4, endT);
        graphics.lineTo(this.width + 4, endT);
        
        this.addChild(graphics);
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