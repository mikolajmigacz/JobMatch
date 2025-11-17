import {
  Controller,
  Post,
  Body,
  Get,
  UnauthorizedException,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthenticationService } from '@application/authentication.service';
import {
  UserAlreadyExistsException,
  InvalidCredentialsException,
} from '@shared/exceptions/auth.exceptions';
import { HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import type { RegisterRequest, LoginRequest } from '@jobmatch/shared';
import { RegisterDtoSchema, LoginDtoSchema } from '@jobmatch/shared';
import { ZodValidationPipe } from '@shared/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '@shared/decorators/current-user.decorator';
import { TokenPayload } from '@domain/services/token.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthenticationService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('companyLogo'))
  async register(
    @Body(new ZodValidationPipe(RegisterDtoSchema)) dto: RegisterRequest,
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
  async login(@Body(new ZodValidationPipe(LoginDtoSchema)) dto: LoginRequest) {
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
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@CurrentUser() user: TokenPayload) {
    return user;
  }

  @Post('validate-token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async validateToken(@CurrentUser() user: TokenPayload) {
    return { valid: true, user };
  }
}
