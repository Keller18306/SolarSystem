import { rand } from "../utils/rand";
import { AbstractPlanet } from "./abstract";
import { ObjectInfo } from "../object";

export class Mercury extends AbstractPlanet {
    public info: ObjectInfo = {
        type: 'earth-planet',
        name: 'Меркурий',
        diameter: '4 879.4 км',
        mass: '3,3 * 10^23 кг',
        volume: '6,083 * 10^10 км³',
        density: '5,43 г/см³',
        gravity: '3,7 м/с²',
        temperature: '-173 °C',
        pressure: '600 Па'
    };

    public radius: number = 1000 * 0.382 / 2;
    public distance: number = 10000 * 0.38;
    public planetTexture: string = './static/images/mercury.png';
    public textureRotateSpeed: number = -0.02;

    public drawOrbit: boolean = true;
    public orbitAngle: number = rand(0, 360);
    public orbitSpeed: number = 0.2;
    public orbitColor: number = 0xffffff;
}