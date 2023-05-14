import { IsNumberString } from 'class-validator';

export class ListDto {
  @IsNumberString()
  offset: string;

  @IsNumberString()
  limit: string;
}
