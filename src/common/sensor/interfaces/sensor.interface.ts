
export interface ISensor extends Document {
    readonly code: string;
    readonly description: string;
    readonly type: string;
    readonly fabricante: string;
    readonly modelo: string;
    readonly version: string;
    readonly active: boolean;

}