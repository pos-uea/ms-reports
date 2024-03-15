import { IsNotEmpty } from "class-validator";

export class GatewayDto {
    @IsNotEmpty()
    code: string;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    active: boolean;
}

