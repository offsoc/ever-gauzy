import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import { IsEnum, IsOptional } from "class-validator";

/**
 * Get public employee request DTO validation
 */
export enum EmployeeRelationEnum {
    'user' = 'user',
    'organizationEmploymentTypes' = 'organizationEmploymentTypes',
    'organizationPosition' = 'organizationPosition',
	'skills' = 'skills'
}

export class PublicEmployeeQueryDTO {

    @ApiPropertyOptional({ type: () => String, enum: EmployeeRelationEnum })
    @IsOptional()
    @Transform(({ value }: TransformFnParams) => (value) ? value.map((element: string) => element.trim()) : {})
    @IsEnum(EmployeeRelationEnum, { each: true })
    readonly relations: string[];
}