import { AbstractPlanet } from "./abstract";
import { ObjectInfo } from "../object";

export class Sun extends AbstractPlanet {
    public info: ObjectInfo = {
        type: 'star',
        name: "Солнце",
        diameter: "1,392 * 10^9 м",
        mass: "1,989 * 10^30 кг",
        volume: "1,41 * 10^27 м³",
        density: "1409 кг/м³",
        gravity: "274 м/с²",
        temperature: "5778 K",
        pressure: "3,4 * 10^11 атм"
    }

    public radius: number = 1000;
    public distance: number = 0;
    public planetTexture: string = './static/images/sun.png';
    public textureRotateSpeed: number = 0.002;

    public drawOrbit: boolean = false;
    public orbitAngle: number = 0;
    public orbitSpeed: number = 0;
    public orbitColor: number = 0;
}