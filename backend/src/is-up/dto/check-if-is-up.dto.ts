import { IsString, IsUrl } from "class-validator";

export class CheckIfIsUpDto {

  @IsString()
  // @IsUrl({
  //   require_protocol: true,
  //   require_host: true,
  //   protocols: ['http', 'https'],
  //   require_tld: true,
  // })
  public urlToCheck: string;

}
