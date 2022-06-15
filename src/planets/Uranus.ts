import { rand } from "../utils/rand";
import { AbstractPlanet } from "./abstract";
import { ObjectInfo } from "../object";

export class Uranus extends AbstractPlanet {
    public info: ObjectInfo = {
        type: 'gas-planet',
        name: "Уран",
        diameter: "51800 км",
        mass: "8,68 * 10^25 кг",
        volume: "6,833 * 10^13 км³",
        density: "1,27 г/см³",
        gravity: "8,87 м/с²",
        temperature: "-220° C",
        pressure: "от 100 до 0,1 бар"
    };

    public radius: number = 1000 * 3.98 / 2;
    public distance: number = 10000 * 19.22;
    public planetTexture: string = './static/images/uranus.png';
    public textureRotateSpeed: number = 0.02;

    public drawOrbit: boolean = true;
    public orbitAngle: number = rand(0, 360);
    public orbitSpeed: number = 0.2;
    public orbitColor: number = 0xffffff;
}