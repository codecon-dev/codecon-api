import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { EmailService } from '../../shared/services/email.service';

import { CreateUserDto } from '../../users/dtos/create-user.dto';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class AuthService {
  private otpTokens: Map<string, { email: string; expires: Date }> = new Map();

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) { }

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

  async requestLoginLink(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // We don't want to reveal if the email exists or not
      return;
    }

    const token = randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 15);

    this.otpTokens.set(token, { email, expires });
    await this.emailService.sendLoginLink(email, token);
  }

  async verifyLoginToken(token: string): Promise<{ access_token: string }> {
    const tokenData = this.otpTokens.get(token);
    if (!tokenData || tokenData.expires < new Date()) {
      this.otpTokens.delete(token);
      throw new UnauthorizedException('Invalid or expired token');
    }

    const user = await this.usersService.findByEmail(tokenData.email);
    this.otpTokens.delete(token);

    return this.login(user);
  }
}
