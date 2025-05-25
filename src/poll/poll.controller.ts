import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { PollService } from './poll.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../user/user.entity';
import { Request } from 'express';
import { UpdatePollDto } from './dto/update-poll.dto';

@Controller('polls')
export class PollController {
  constructor(private readonly pollService: PollService) {}

  // Создать опрос (только для админа)
  @UseGuards(JwtAuthGuard) // пример защиты
  @Post()
  async createPoll(@Body() dto: CreatePollDto, @Req() req) {
    const admin = req.user; // из JWT
    return await this.pollService.createPoll(dto, admin);
  }

  // Получить все активные опросы
  @Get('active')
  async getActivePolls() {
    return this.pollService.getActivePolls();
  }

  // Получить результаты опроса по id
  @Get(':id/results')
  async getResults(@Param('id') id: string) {
    return this.pollService.getResults(id);
  }

  // Голосовать в опросе
  @UseGuards(JwtAuthGuard)
  @Post(':id/vote')
  async vote(
    @Param('id') pollId: string,
    @Body('option') option: string,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    return this.pollService.vote(pollId, option, user);
  }

  // Деактивировать опрос (только админ)
  @UseGuards(JwtAuthGuard)
  @Patch(':id/deactivate')
  async deactivatePoll(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as User;

    return this.pollService.deactivatePoll(id);
  }

  // Обновить опрос (только админ)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updatePoll(
    @Param('id') id: string,
    @Body() dto: UpdatePollDto,
    @Req() req: Request,
  ) {
    const user = req.user as User;

    return this.pollService.updatePoll(id, dto);
  }

  // Удалить опрос (только админ)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deletePoll(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as User;
    await this.pollService.deletePoll(id);
    return { message: 'Poll deleted successfully' };
  }
}
