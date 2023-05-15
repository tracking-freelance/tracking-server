import { Exclude } from 'class-transformer';

export class CreateTrackingDto {
  events: [];

  @Exclude()
  sessionId: number;
}
