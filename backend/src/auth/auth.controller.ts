import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './services/auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthTokensDto } from './dto/authTokens.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(@Body() body: LoginDto, @Request() request) {
    return this.authService.login(request.user);
  }

  @Post('refresh')
  public async refresh(@Body() body: AuthTokensDto) {
    return this.authService.refreshTokens(body);
  }
}
