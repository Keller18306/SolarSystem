import { rand } from "../utils/rand";
import { AbstractPlanet } from "./abstract";
import { ObjectInfo } from "../object";

export class Saturn extends AbstractPlanet {
    public info: ObjectInfo = {
        type: 'gas-planet',
        name: "Сатурн",
        diameter: "120 536 км",
        mass: "5,68 * 10^26 кг",
        volume: "8,27 * 10^14 км³",
        density: "0,687 г/см³",
        gravity: "10,44 м/с²",
        temperature: "-139 °C",
        pressure: "140 кПа"
    };

    public radius: number = 1000 * 9.41 / 2;
    public distance: number = 10000 * 9.54;
    public planetTexture: string = './static/images/saturn.png';
    public textureRotateSpeed: number = 0;

    public drawOrbit: boolean = true;
    public orbitAngle: number = rand(0, 360);
    public orbitSpeed: number = 0.2;
    public orbitColor: number = 0xffffff;
}