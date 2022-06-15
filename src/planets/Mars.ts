import { rand } from "../utils/rand";
import { AbstractPlanet } from "./abstract";
import { ObjectInfo } from "../object";

export class Mars extends AbstractPlanet {
    public info: ObjectInfo = {
        type: 'earth-planet',
        name: 'Марс',
        diameter: '6 792,4 км',
        mass: '6,42 * 10^23 кг',
        volume: '1,63 * 10^11 км³',
        density: '3,9 * 10^3 г/см³',
        gravity: '3,711 м/с²',
        temperature: '-63 °C',
        pressure: '0,6 кПа'
    };

    public radius: number = 1000 * 0.53 / 2;
    public distance: number = 10000 * 1.52;
    public planetTexture: string = './static/images/mars.png';
    public textureRotateSpeed: number = -0.02;

    public drawOrbit: boolean = true;
    public orbitAngle: number = rand(0, 360);
    public orbitSpeed: number = 0.2;
    public orbitColor: number = 0xffffff;
}