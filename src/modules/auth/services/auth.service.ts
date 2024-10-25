import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EmailService } from '../../shared/services/email.service';
import { CreateUserDto } from '../../users/dtos/create-user.dto';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/services/users.service';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) { }

  async register(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersService.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const userToCreate: CreateUserDto = {
      email: createUserDto.email,
      name: createUserDto.name,
      authMethods: ['password'],
    };

    if (createUserDto.password) {
      userToCreate.password = await bcrypt.hash(createUserDto.password, 10);
    }

    return this.usersService.create(userToCreate);
  }

  async registerWithEmail(email: string): Promise<void> {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      return; // Don't reveal if user exists
    }

    const token = await this.jwtService.signAsync(
      { email, type: 'registration' },
      { expiresIn: '15m' }
    );
    await this.emailService.sendRegistrationLink(email, token);
  }

  async completeRegistration(token: string, name: string): Promise<AuthResponse> {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      if (payload.type !== 'registration') {
        throw new UnauthorizedException('Invalid token type');
      }

      const existingUser = await this.usersService.findByEmail(payload.email);
      if (existingUser) {
        throw new ConflictException('User already exists');
      }

      const user = await this.usersService.create({
        email: payload.email,
        name,
        authMethods: ['magic-link'],
      });

      return this.generateAuthResponse(user);
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.password || !user.authMethods.includes('password')) {
      return null;
    }

    if (await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User): Promise<AuthResponse> {
    return this.generateAuthResponse(user);
  }

  async loginSocial(userData: any): Promise<AuthResponse> {
    let user = await this.usersService.findByEmail(userData.email);

    if (user) {
      // Update existing user with new auth method if not present
      if (!user.authMethods.includes(userData.provider)) {
        user.authMethods.push(userData.provider);
        user = await this.usersService.update(user.id, {
          authMethods: user.authMethods,
          provider: userData.provider,
          providerId: userData.providerId,
        });
      }
    } else {
      // Create new user with social auth method
      const createUserDto: CreateUserDto = {
        email: userData.email,
        name: userData.name,
        provider: userData.provider,
        providerId: userData.providerId,
        authMethods: [userData.provider],
      };
      user = await this.usersService.create(createUserDto);
    }

    return this.generateAuthResponse(user);
  }

  async requestLoginLink(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return; // Don't reveal if user exists
    }

    const token = await this.jwtService.signAsync(
      { email, type: 'magic-link' },
      { expiresIn: '15m' }
    );
    await this.emailService.sendLoginLink(email, token);
  }

  async verifyLoginToken(token: string): Promise<AuthResponse> {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      if (!['magic-link', 'login'].includes(payload.type)) {
        throw new UnauthorizedException('Invalid token type');
      }

      const user = await this.usersService.findByEmail(payload.email);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Add magic-link as auth method if not present
      if (!user.authMethods.includes('magic-link')) {
        user.authMethods.push('magic-link');
        await this.usersService.update(user.id, {
          authMethods: user.authMethods,
        });
      }

      return this.generateAuthResponse(user);
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private async generateAuthResponse(user: User): Promise<AuthResponse> {
    const accessToken = await this.jwtService.signAsync(
      { sub: user.id },
      { expiresIn: '1h' }
    );
    const refreshToken = await this.jwtService.signAsync(
      { sub: user.id, type: 'refresh' },
      { expiresIn: '7d' }
    );
    return {
      accessToken,
      refreshToken,
      expiresIn: 3600 // 1 hour in seconds
    };
  }
}
