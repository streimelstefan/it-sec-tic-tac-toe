import { IsString, IsUrl } from "class-validator";

export class CheckIfIsUpDto {

  @IsString()
  public urlToCheck: string;

}
