export class Storage {
    private static instance: Storage;

    public static getInstance(): Storage {
        if (!Storage.instance) {
            Storage.instance = new Storage();
        }

        return Storage.instance;
    }

    private constructor() { }

    public getNumber(key: string): number | null {
        key = `number_${key}`

        const value = localStorage.getItem(key)

        return value !== null ? Number(value) : null;
    }

    public setNumber(key: string, value: number): void {
        key = `number_${key}`

        localStorage.setItem(key, value.toString());
    }
}