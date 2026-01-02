import { plainToInstance } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, validateSync } from 'class-validator';

class EnvironmentVariables {
    @IsString()
    @IsNotEmpty()
    DB_HOST: string;

    @IsInt()
    DB_PORT: number;

    @IsString()
    @IsNotEmpty()
    DB_USER: string;

    @IsString()
    DB_PASSWORD: string;

    @IsString()
    @IsNotEmpty()
    DB_NAME: string;

    @IsString()
    @IsNotEmpty()
    SMTP_HOST: string;

    @IsInt()
    @IsNotEmpty()
    SMTP_PORT: number;

    @IsString()
    SMTP_USER: string;

    @IsString()
    SMTP_PASSWORD: string;

    @IsString()
    @IsNotEmpty()
    SMTP_FROM_NAME: string;

    @IsString()
    @IsNotEmpty()
    SMTP_FROM_MAIL: string;
}

export function validate(config: Record<string, unknown>) {
    const validatedConfig = plainToInstance(
        EnvironmentVariables,
        config,
        { enableImplicitConversion: true },
    );

    const errors = validateSync(validatedConfig, {
        skipMissingProperties: false,
    });

    if (errors.length > 0) {
        throw new Error(errors.toString());
    }

    return validatedConfig;
}
