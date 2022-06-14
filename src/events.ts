import { Viewport } from 'pixi-viewport';
import * as PIXI from 'pixi.js'
import { App } from '.';
import { Storage } from './storage';

export class AppEvents {
    private app: App
    private pixi: PIXI.Application;
    private camera: Viewport;
    private storage: Storage

    private lastWidth: number;
    private lastHeight: number;

    constructor(app: App) {
        this.app = app
        this.pixi = app.pixi;
        this.camera = app.camera;
        this.storage = app.storage;

        this.lastWidth = window.innerWidth;
        this.lastHeight = window.innerHeight;

        this.setupEvents();
    }

    private setupEvents() {
        window.addEventListener('resize', () => {
            this.onResize()
        })

        this.camera.on('pointerdown', () => {
            this.onPointerDown()
        })

        this.camera.on('pointerup', () => {
            this.onPointerUp()
        })

        this.camera.on('wheel', () => {
            this.onWheel()
        })
    }

    public onResize(): void {
        const offsetX = window.innerWidth - this.lastWidth;
        const offsetY = window.innerHeight - this.lastHeight;

        this.lastWidth = window.innerWidth
        this.lastHeight = window.innerHeight

        this.pixi.renderer.resize(window.innerWidth, window.innerHeight);
        this.camera.resize(window.innerWidth, window.innerHeight);

        this.camera.x += offsetX / 2
        this.camera.y += offsetY / 2
    }

    public onPointerDown(): void {
        this.app.ui.hidePlanetInfo()
    }

    public onPointerUp(): void {
        this.storage.setNumber('posX', this.camera.position.x)
        this.storage.setNumber('posY', this.camera.position.y)
    }

    public onWheel(): void {
        if (this.app.scale < 0.0001) {
            this.app.scale = 0.0001
        }

        if (this.app.scale > 5) {
            this.app.scale = 5
        }

        this.storage.setNumber('scale', this.app.scale)
        this.storage.setNumber('posX', this.camera.position.x)
        this.storage.setNumber('posY', this.camera.position.y)
    }
}