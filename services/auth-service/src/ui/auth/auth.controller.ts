import {
  Controller,
  Post,
  Body,
  Get,
  UnauthorizedException,
  UseInterceptors,
  UploadedFile,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthenticationService } from '@application/authentication.service';
import {
  InvalidTokenException,
  UserAlreadyExistsException,
  InvalidCredentialsException,
} from '@shared/exceptions/auth.exceptions';
import { HttpCode, HttpStatus, BadRequestException, Headers } from '@nestjs/common';
import type { RegisterRequest, LoginRequest } from '@jobmatch/shared';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthenticationService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('companyLogo'))
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async register(
    @Body() dto: RegisterRequest,
    @UploadedFile() file?: { buffer: Buffer; mimetype: string }
  ) {
    try {
      return await this.authService.register(dto, file);
    } catch (error) {
      if (error instanceof UserAlreadyExistsException) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof Error && error.message.includes('Logo is required')) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginRequest) {
    try {
      return await this.authService.login(dto);
    } catch (error) {
      if (error instanceof InvalidCredentialsException) {
        throw new UnauthorizedException(error.message);
      }
      throw error;
    }
  }

  @Get('me')
  async getCurrentUser(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Invalid authorization format');
    }

    try {
      return await this.authService.getCurrentUser(token);
    } catch (error) {
      if (error instanceof InvalidTokenException) {
        throw new UnauthorizedException(error.message);
      }
      throw error;
    }
  }

  @Post('validate-token')
  async validateToken(@Body() dto: { token: string }) {
    try {
      return await this.authService.validateToken(dto.token);
    } catch (error) {
      if (error instanceof InvalidTokenException) {
        throw new UnauthorizedException(error.message);
      }
      throw error;
    }
  }
}
