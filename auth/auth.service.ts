import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import _ from 'lodash';

import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.findByEmail(registerDto.email);

    if (existingUser) {
      throw new ConflictException('Email already exists');
    } else if (registerDto.password !== registerDto.passwordCheck) {
      throw new ConflictException('비밀번호가 일치하지 않습니다.');
    }

    const hashedPassword = await hash(registerDto.password, 10);

    await this.userRepository.save({
      ...registerDto,
      password: hashedPassword,
    });

    return {
      message: 'Register success',
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      select: ['userSeq', 'email', 'password'],
      where: { email: loginDto.email },
    });
    if (!user || !(await compare(loginDto.password, user.password))) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    }

    const payload = { email: user.email, sub: user.userSeq };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async refreshAccessToken(email: string) {
    return await this.userRepository.findOneBy({ email });
  }
}
