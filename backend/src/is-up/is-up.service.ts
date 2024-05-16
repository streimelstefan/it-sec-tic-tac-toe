import { Injectable, Logger } from '@nestjs/common';
import { CheckIfIsUpDto } from './dto/check-if-is-up.dto';
import { CheckIfIsUpResponseDto } from './dto/check-if-is-up-response.dto';
import axios from 'axios';
import { curly } from 'node-libcurl';

@Injectable()
export class IsUpService {

  private readonly _logger = new Logger(IsUpService.name);

  public async checkIfIsUp(createIsUpDto: CheckIfIsUpDto): Promise<CheckIfIsUpResponseDto> {
    var end: number;
    var statusCode: number;
    var response: any;
    const start = Date.now();

    try {
      const res = await curly.get(createIsUpDto.urlToCheck);
      end = Date.now();
      response = res.data.toString();
      statusCode = res.statusCode;
    } catch (e) {
      end = Date.now();
      response = e.response.data;
      statusCode = e.response.status;
    } finally {
      const isUp = statusCode % 100 < 4;
      this._logger.log(`URL ${createIsUpDto.urlToCheck} is ${isUp ? "up" : "down"}, with status code ${statusCode} and response time ${end - start}ms`);
      return {
        isUp: isUp,
        statusCode: statusCode,
        response: response,
        responseTime: end - start
      }
    }
  }
}
