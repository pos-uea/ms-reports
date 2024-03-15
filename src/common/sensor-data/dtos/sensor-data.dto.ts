import { IsNotEmpty } from "class-validator";

export class SensorDataDto {

    @IsNotEmpty()
    readonly sensor_code: string;

    @IsNotEmpty()
    readonly value: Number;

}