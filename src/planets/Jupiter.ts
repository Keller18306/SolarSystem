import { rand } from "../utils/rand";
import { AbstractPlanet } from "./abstract";
import { ObjectInfo } from "../object";

export class Jupiter extends AbstractPlanet {
    public info: ObjectInfo = {
        type: 'gas-planet',
        name: 'Юпитер',
        diameter: '139 822 км',
        mass: '1,898 * 10^27 кг',
        volume: '1,43 * 10^13 км³',
        density: '1,3 г/см³',
        gravity: '24,79 м/с²',
        temperature: '-108 °C',
        pressure: '10 бар'
    };

    public radius: number = 1000 * 11.2 / 2;
    public distance: number = 10000 * 5.20;
    public planetTexture: string = './static/images/jupiter.png';
    public textureRotateSpeed: number = -0.02;

    public drawOrbit: boolean = true;
    public orbitAngle: number = rand(0, 360);
    public orbitSpeed: number = 0.2;
    public orbitColor: number = 0xffffff;
}