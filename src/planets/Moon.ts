import { rand } from "../utils/rand";
import { AbstractPlanet } from "./abstract";
import { ObjectInfo } from "../object";

export class Moon extends AbstractPlanet {
    public info: ObjectInfo = {
        type: 'child',
        name: "Луна",
        diameter: "3 846 км",
        mass: "7,348 * 10^22 кг",
        volume: "2,19 * 10^10 км³",
        density: "3,34 г/см³",
        gravity: "1,62 м/с²",
        temperature: "-23,1 °C",
        pressure: "1 бар"
    };

    public radius: number = 200;
    public distance: number = 1000;
    public planetTexture: string = './static/images/moon.png';
    public textureRotateSpeed: number = 0.01;

    public drawOrbit: boolean = true;
    public orbitAngle: number = rand(0, 360);
    public orbitSpeed: number = 0.8;
    public orbitColor: number = 0xffffff;
}