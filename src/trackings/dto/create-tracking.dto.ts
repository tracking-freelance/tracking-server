import { Exclude } from 'class-transformer';

export class CreateTrackingDto {
  type: number;

  data: object;

  timestamp: number;

  delay: number;

  page: string;

  @Exclude()
  sessionId: number;
}
