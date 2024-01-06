import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class RegisterDto {
  @IsEmail()
  @IsNotEmpty({ message: '올바른 이메일 주소를 입력해주세요' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호 확인을 입력해주세요' })
  passwordCheck: string;

  @IsString()
  @IsNotEmpty({ message: '닉네임을 입력해주세요' })
  nickName: string;
}
