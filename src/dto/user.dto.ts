import {
	IsBoolean,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
} from "class-validator"

export class CreateUserDTO {
	@IsNotEmpty()
	@IsString()
	@MinLength(5)
	@MaxLength(12)
	anon_name: string

	@IsNotEmpty()
	@IsString()
	@MinLength(6)
	@MaxLength(60)
	password: string

	@IsString()
	@MaxLength(15)
	@IsOptional()
	phone_number?: string
}

export class UpdateUserDTO {
	@IsOptional()
	@IsString()
	@MinLength(5)
	@MaxLength(12)
	anon_name: string

	@IsString()
	@MaxLength(255)
	@IsOptional()
	profile_picture: string

	@IsOptional()
	@IsString()
	@MinLength(6)
	@MaxLength(60)
	password_hash: string

	@IsOptional()
	@IsBoolean()
	is_active?: boolean

	@IsOptional()
	@IsString()
	@MaxLength(15)
	phone_number?: string
}
