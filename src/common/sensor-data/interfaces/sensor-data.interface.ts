import { ISensor } from "src/common/sensor/interfaces/sensor.interface";

export interface ISensorData extends Document {
    readonly sensor_code: string;
    readonly value: number;
    sensor: ISensor
}