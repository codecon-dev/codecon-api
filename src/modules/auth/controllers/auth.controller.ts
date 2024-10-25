import { Body, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from '../../users/dtos/create-user.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() { }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Request() req) {
    return this.authService.loginSocial(req.user);
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() { }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Request() req) {
    return this.authService.loginSocial(req.user);
  }

  @Post('login/email')
  async requestLoginLink(@Body() body: { email: string }) {
    await this.authService.requestLoginLink(body.email);
    return { message: 'If an account exists, a login link has been sent to your email' };
  }

  @Get('verify')
  async verifyLoginToken(@Query('token') token: string) {
    return this.authService.verifyLoginToken(token);
  }
}
