import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { IsUpService } from './is-up.service';
import { CheckIfIsUpDto } from './dto/check-if-is-up.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('is-up')
@ApiTags('Is Up')
@ApiBearerAuth()
export class IsUpController {
  constructor(private readonly isUpService: IsUpService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  checkIfIsUp(@Body() createIsUpDto: CheckIfIsUpDto) {
    return this.isUpService.checkIfIsUp(createIsUpDto);
  }
}
