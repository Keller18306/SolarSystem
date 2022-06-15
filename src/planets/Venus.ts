import { rand } from "../utils/rand";
import { AbstractPlanet } from "./abstract";
import { ObjectInfo } from "../object";

export class Venus extends AbstractPlanet {
    public info: ObjectInfo = {
        type: 'earth-planet',
        name: "Венера",
        diameter: "12 103,6 км",
        mass: "4,87 * 10^24 кг",
        volume: "9,38 * 10^11 км³",
        density: "5.24 кг/м³",
        gravity: "8,87 м/с²",
        temperature: "735 К (462 °C)",
        pressure: "93 бар"
    };

    public radius: number = 1000 * 0.949 / 2;
    public distance: number = 10000 * 0.72;
    public planetTexture: string = './static/images/venus.png';
    public textureRotateSpeed: number = 0.02;

    public drawOrbit: boolean = true;
    public orbitAngle: number = rand(0, 360);
    public orbitSpeed: number = 0.2;
    public orbitColor: number = 0xffffff;
}