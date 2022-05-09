export class Resources {
    private list: {
        [key: string]: {
            type: 'audio' | 'image',
            src: string
        }
    } = {
            'ambient': {
                type: 'audio',
                src: './static/ambient.wav'
            },
        };

    private loaded: {
        [key: string]: {
            type: 'audio',
            src: string,
            object: HTMLAudioElement
        } | {
            type: 'image',
            src: string,
            object: HTMLImageElement
        }
    } = {};

    private static instance: Resources;

    public static getInstance(): Resources {
        if (!Resources.instance) {
            Resources.instance = new Resources();
        }

        return Resources.instance;
    }

    private constructor() {

    }

    public static getAudio(key: string): HTMLAudioElement {
        const that = Resources.getInstance();

        const resource = that.loaded[key];

        if (!resource) {
            throw new Error(`Resource ${key} is not loaded`);
        }

        if (resource.type !== 'audio') {
            throw new Error(`Resource ${key} is not audio`);
        }

        return resource.object;
    }

    public static getImage(key: string): HTMLImageElement {
        const that = Resources.getInstance();

        const resource = that.loaded[key];

        if (!resource) {
            throw new Error(`Resource ${key} is not loaded`);
        }

        if (resource.type !== 'image') {
            throw new Error(`Resource ${key} is not image`);
        }

        return resource.object;
    }

    public static async init(): Promise<void> {
        const that = Resources.getInstance();

        const promises: Promise<void>[] = [];

        for (const key in that.list) {
            const promise = that.load(key);

            promises.push(promise);
        }

        return Promise.all(promises).then(() => { });
    }

    private load(key: string): Promise<void> {
        if (this.loaded[key]) {
            return Promise.resolve();
        }

        const resource = this.list[key];

        if (resource.type === 'audio') {
            return new Promise((resolve, reject) => {
                const audio = new Audio();
                audio.onloadeddata = () => {
                    this.loaded[key] = {
                        type: 'audio',
                        src: resource.src,
                        object: audio
                    };

                    resolve();
                }

                audio.onerror = (e) => {
                    reject(e);
                }

                audio.src = resource.src;
            });
        }


        if (resource.type === 'image') {
            return new Promise((resolve, reject) => {
                const image = new Image();

                image.onload = () => {
                    this.loaded[key] = {
                        type: 'image',
                        src: resource.src,
                        object: image
                    };

                    resolve();

                }

                image.onerror = (e) => {
                    reject(e);
                }

                image.src = resource.src;
            })
        }

        throw new Error(`Resource ${key} has unknown type`);
    }

    public static get(key: string): HTMLAudioElement | HTMLImageElement {
        const that = Resources.getInstance();

        if (!that.loaded[key]) {
            throw new Error(`Resource ${key} is not loaded`);
        }

        return that.loaded[key].object;
    }
}

(window as any).Resources = Resources;