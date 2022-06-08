export class AppResources {
    private list: {
        image: string[],
        audio: string[]
    } = {
            image: [],
            audio: []
        };

    public loaded: {
        image: {
            [key: string]: HTMLImageElement
        },
        audio: {
            [key: string]: HTMLAudioElement
        }
    } = {
            image: {},
            audio: {}
        };

    private isJsonLoaded: boolean = false;

    public async startLoding() {
        await this.initList();
        await Promise.all([
            this.loadImages(),
            this.loadAudios()
        ]);
    }

    private async initList() {
        console.debug('Load resources list');

        const json = await this.loadJson();
        this.isJsonLoaded = true;

        Object.assign(this.list, json);
    }

    private loadJson() {
        const request = new XMLHttpRequest();

        const promise = new Promise<any>((resolve) => {
            request.onload = () => {
                resolve(JSON.parse(request.responseText));
            }
        })

        request.open('GET', './resources.json', true);
        request.send();

        return promise;
    }

    private async loadImage(src: string): Promise<HTMLImageElement> {
        console.debug(`load image: ${src}`);

        const image = new Image();

        return new Promise<HTMLImageElement>((resolve, reject) => {
            image.onload = () => {
                this.loaded.image[src] = image

                resolve(image);
            }

            image.onerror = (e) => {
                reject(e);
            }

            image.src = src;
        })
    }

    private async loadImages() {
        const promises: Promise<HTMLImageElement>[] = [];

        for (const src of this.list.image) {
            promises.push(this.loadImage(src));
        }

        await Promise.all(promises);
    }

    private async loadAudio(src: string): Promise<HTMLAudioElement> {
        console.debug(`load audio: ${src}`);

        const audio = new Audio();

        return new Promise<HTMLAudioElement>((resolve, reject) => {

            audio.onloadeddata = () => {
                this.loaded.audio[src] = audio;

                resolve(audio);
            }

            audio.onerror = (e) => {
                reject(e);
            }

            audio.src = src;
        });
    }

    private async loadAudios() {
        const promises: Promise<HTMLAudioElement>[] = [];

        for (const src of this.list.audio) {
            promises.push(this.loadAudio(src));
        }

        await Promise.all(promises);
    }

    public getLoadingProgress() {
        const loaded = Object.keys(this.loaded.image).length + Object.keys(this.loaded.audio).length + 1;
        const total = Number(this.isJsonLoaded) + this.list.image.length + this.list.audio.length;

        if (total === 0) {
            return 0;
        }

        return loaded / total * 100;
    }
}
