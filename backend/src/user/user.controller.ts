import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserId } from './entities/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { Admin } from '../auth/decorators/admin.decorator';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
export class UserController {
  public constructor(private readonly userService: UserService) { }

  @Post()
  public async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  public async findAll() {
    return this.userService.findAll();
  }

  @Get(':internalId')
  @UseGuards(JwtAuthGuard)
  public async findOne(@Param('internalId') internalId: UserId) {
    return this.userService.findOne(internalId);
  }

  @Patch(':internalId')
  @UseGuards(JwtAuthGuard)
  public async update(
    @Param('internalId') internalId: UserId,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(internalId, updateUserDto);
  }

  @Delete(':internalId')
  @UseGuards(JwtAuthGuard)
  public async remove(@Param('internalId') internalId: UserId) {
    return this.userService.remove(internalId);
  }
}
