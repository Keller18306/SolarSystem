import { rand } from "../utils/rand";
import { AbstractPlanet } from "./abstract";
import { ObjectInfo } from "../object";

export class Earth extends AbstractPlanet {
    public info: ObjectInfo = {
        type: 'earth-planet',
        name: "Земля",
        diameter: "12 742 км",
        mass: "5,972 * 10^24 кг",
        volume: "1,08 * 10^12 км³",
        density: "5,51 г/см³",
        gravity: "9,8 м/с²",
        temperature: "15,6 °C",
        pressure: "985 ГПа"
    };

    public radius: number = 1000 * 1 / 2;
    public distance: number = 10000 * 1;
    public planetTexture: string = './static/images/earth.png';
    public textureRotateSpeed: number = -0.02;

    public drawOrbit: boolean = true;
    public orbitAngle: number = rand(0, 360);
    public orbitSpeed: number = 0.2;
    public orbitColor: number = 0xffffff;
}