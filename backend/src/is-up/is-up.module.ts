import { Module } from '@nestjs/common';
import { IsUpService } from './is-up.service';
import { IsUpController } from './is-up.controller';

@Module({
  controllers: [IsUpController],
  providers: [IsUpService],
})
export class IsUpModule { }
