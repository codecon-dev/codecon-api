import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) { }

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const userToCreate = {
      ...createUserDto,
      password: hashedPassword,
    };

    return this.usersService.create(userToCreate);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.password && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async loginSocial(userData: any) {
    let user = await this.usersService.findByEmail(userData.email);
    if (!user) {
      const createUserDto: CreateUserDto = {
        email: userData.email,
        name: userData.name,
        provider: userData.provider,
        providerId: userData.providerId,
      };
      user = await this.usersService.create(createUserDto);
    }
    return this.login(user);
  }
}
