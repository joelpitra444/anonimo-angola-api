import { IsNotEmpty, IsString, MinLength, MaxLength } from "class-validator";

export class AuthLoginDTO {
  @IsNotEmpty({ message: "O nome anônimo não pode ser vazio" })
  @IsString()
  @MinLength(5)
  @MaxLength(12)
  anon_name: string;

  @IsNotEmpty({ message: "A palavra-passe não pode estar vazia" })
  @IsString()
  @MinLength(6)
  @MaxLength(60)
  password: string;
}
