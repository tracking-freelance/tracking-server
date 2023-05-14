import { Controller, Get, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { ListDto } from 'src/shared/dto/list.dto';
import { SessionsService } from 'src/sessions/sessions.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly sessionsService: SessionsService,
  ) {}

  @Get(':id/sessions')
  listSessions(@Param('id') id: string, @Query() query: ListDto) {
    return this.sessionsService.listByUserId(id, query);
  }

  @Get()
  list(@Query() query: ListDto) {
    if (parseInt(query.limit) < 0) {
      throw new Error('Limit must be greater than 0');
    }

    if (parseInt(query.offset) < 0) {
      throw new Error('Offset must be greater than 0');
    }

    return this.usersService.list(query);
  }
}
