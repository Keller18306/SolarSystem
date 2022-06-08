import { AbstractUIText } from "./abstract";

export class FieldText extends AbstractUIText {
    private fieldName: string;

    constructor(name: string, value: () => string) {
        super({
            fill: 0xffffff,
            fontSize: 10
        })

        this.fieldName = name;
        this.fieldValue = value;
    }

    public fieldValue(): string {
        return '';
    };

    public update(delta: number): void {
        this.text = `${this.fieldName}: ${this.fieldValue()}`
    }
}