import { Body, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from '../../users/dtos/create-user.dto';
import { User } from '../../users/entities/user.entity';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from '../services/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ 
    status: 201, 
    description: 'User successfully created',
    type: User 
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input' })
  @ApiResponse({ status: 409, description: 'Conflict - User already exists' })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful',
    schema: {
      properties: {
        access_token: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid credentials' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  @ApiResponse({ status: 302, description: 'Redirect to Google login' })
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() { }

  @ApiOperation({ summary: 'Google OAuth callback' })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful',
    schema: {
      properties: {
        access_token: { type: 'string' }
      }
    }
  })
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Request() req) {
    return this.authService.loginSocial(req.user);
  }

  @ApiOperation({ summary: 'Initiate GitHub OAuth login' })
  @ApiResponse({ status: 302, description: 'Redirect to GitHub login' })
  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() { }

  @ApiOperation({ summary: 'GitHub OAuth callback' })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful',
    schema: {
      properties: {
        access_token: { type: 'string' }
      }
    }
  })
  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Request() req) {
    return this.authService.loginSocial(req.user);
  }

  @ApiOperation({ summary: 'Request a login link via email' })
  @ApiBody({
    schema: {
      properties: {
        email: { type: 'string', format: 'email' }
      },
      required: ['email']
    }
  })
  @ApiResponse({ status: 200, description: 'Login link sent if account exists' })
  @Post('login/email')
  async requestLoginLink(@Body() body: { email: string }) {
    await this.authService.requestLoginLink(body.email);
    return { message: 'If an account exists, a login link has been sent to your email' };
  }

  @ApiOperation({ summary: 'Verify email login token' })
  @ApiResponse({ 
    status: 200, 
    description: 'Token verified successfully',
    schema: {
      properties: {
        access_token: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  @Get('verify')
  async verifyLoginToken(@Query('token') token: string) {
    return this.authService.verifyLoginToken(token);
  }

  @ApiOperation({ summary: 'Register with email only' })
  @ApiResponse({ status: 200, description: 'Registration link sent if email is not registered' })
  @Post('register/email')
  async registerWithEmail(@Body() body: { email: string }) {
    await this.authService.registerWithEmail(body.email);
    return { message: 'If the email is not registered, a registration link has been sent' };
  }

  @ApiOperation({ summary: 'Complete registration with email token' })
  @ApiResponse({ 
    status: 200, 
    description: 'Registration completed successfully',
    schema: {
      properties: {
        access_token: { type: 'string' }
      }
    }
  })
  @Post('register/verify')
  async completeRegistration(
    @Body() body: { token: string; name: string }
  ) {
    return this.authService.completeRegistration(body.token, body.name);
  }
}
