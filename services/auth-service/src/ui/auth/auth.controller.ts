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
import type { JobSeekerRegister, EmployerRegister, LoginRequest } from '@jobmatch/shared';
import { JobSeekerRegisterSchema, EmployerRegisterSchema, LoginDtoSchema } from '@jobmatch/shared';
import { ZodValidationPipe } from '@shared/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '@shared/decorators/current-user.decorator';
import { TokenPayload } from '@domain/services/token.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthenticationService) {}

  @Post('register/job-seeker')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('unusedField'))
  async registerJobSeeker(
    @Body(new ZodValidationPipe(JobSeekerRegisterSchema)) dto: JobSeekerRegister
  ) {
    try {
      return await this.authService.registerJobSeeker(dto);
    } catch (error) {
      if (error instanceof UserAlreadyExistsException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Post('register/employer')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('companyLogo'))
  async registerEmployer(
    @Body(new ZodValidationPipe(EmployerRegisterSchema)) dto: EmployerRegister,
    @UploadedFile() file?: { buffer: Buffer; mimetype: string }
  ) {
    try {
      if (!file) {
        throw new BadRequestException('Company logo is required for employer registration');
      }
      return await this.authService.registerEmployer(dto, file);
    } catch (error) {
      if (error instanceof UserAlreadyExistsException) {
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
