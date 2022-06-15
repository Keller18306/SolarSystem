import { rand } from "../utils/rand";
import { AbstractPlanet } from "./abstract";
import { ObjectInfo } from "../object";

export class Neptune extends AbstractPlanet {
    public info: ObjectInfo = {
        type: 'gas-planet',
        name: 'Нептун',
        diameter: '49 528 км',
        mass: '1,024 * 10^26 кг',
        volume: '6,25 * 10^13 км³',
        density: '1,64 г/см³',
        gravity: '11,15 м/с²',
        temperature: '-201 °C',
        pressure: '100 кПа'
    };

    public radius: number = 1000 * 3.81 / 2;
    public distance: number = 10000 * 30.06;
    public planetTexture: string = './static/images/neptune.png';
    public textureRotateSpeed: number = -0.02;

    public drawOrbit: boolean = true;
    public orbitAngle: number = rand(0, 360);
    public orbitSpeed: number = 0.05;
    public orbitColor: number = 0xffffff;
}