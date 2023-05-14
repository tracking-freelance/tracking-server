import { Session } from '@prisma/client';

export type CreateSessionDto = Pick<Session, 'userId'> &
  Partial<
    Pick<Session, 'startDate' | 'startTime' | 'endDate' | 'endTime' | 'userId'>
  >;
