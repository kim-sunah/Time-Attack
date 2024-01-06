import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { UserService } from './user.service';
import { register } from 'module';
import { LoginDto } from '../auth/dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('')
  getEmail(@UserInfo() user: User) {
    return user;
  }
}
