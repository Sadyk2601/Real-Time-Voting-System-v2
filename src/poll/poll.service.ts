import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Poll } from './poll.entity';
import { Vote } from '../vote/vote.entity';
import { User } from '../user/user.entity';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { Option } from './option.entity';
import { log } from 'console';

@Injectable()
export class PollService {
  constructor(
    @InjectRepository(Poll)
    private pollRepo: Repository<Poll>,

    @InjectRepository(Vote)
    private voteRepo: Repository<Vote>,
  ) {}

  // Создать опрос
  async createPoll(dto: CreatePollDto, user: User): Promise<Poll> {
    const poll = this.pollRepo.create({
      question: dto.question,
      options: dto.options,
      isActive: true,
      createdBy: { id: user.id }, // передаем только id, чтобы не пытаться обновлять User
    });

    console.log('Poll to save:', poll);

    return await this.pollRepo.save(poll);
  }

  // Получить результаты опроса (с опциями и голосами)
  async getResults(id: string): Promise<Poll> {
    const poll = await this.pollRepo.findOne({
      where: { id },
      relations: ['votes'], // если связь с голосами есть
    });
    if (!poll) throw new NotFoundException('Poll not found');
    return poll;
  }

  // Деактивировать опрос (сделать неактивным)
  async deactivatePoll(id: string): Promise<Poll> {
    const poll = await this.pollRepo.findOne({ where: { id } });
    if (!poll) throw new NotFoundException('Poll not found');

    poll.isActive = false;
    return await this.pollRepo.save(poll);
  }

  // Удалить опрос
  async deletePoll(id: string): Promise<void> {
    const poll = await this.pollRepo.findOne({ where: { id } });
    if (!poll) throw new NotFoundException('Poll not found');
    await this.pollRepo.remove(poll);
  }

  // Получить все активные опросы
  async getActivePolls(): Promise<Poll[]> {
    const polls = await this.pollRepo.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
    console.log('Active polls found:', polls.length);
    return polls;
  }

  // Голосование в опросе
  async vote(pollId: string, option: string, user: User): Promise<Poll> {
    const poll = await this.pollRepo.findOne({
      where: { id: pollId },
      relations: ['votes'],
    });
    if (!poll) throw new NotFoundException('Poll not found');
    if (!poll.isActive) throw new ForbiddenException('Poll is inactive');

    // Проверяем, не голосовал ли уже пользователь
    const existingVote = await this.voteRepo.findOne({
      where: {
        poll: { id: pollId },
        user: { id: user.id },
      },
    });

    if (existingVote) throw new ConflictException('You have already voted');

    // Создаем и сохраняем голос
    const vote = this.voteRepo.create({
      poll,
      user,
      selectedOption: option,
    });
    await this.voteRepo.save(vote);

    return poll;
  }

  // Обновление опроса — пример, чтобы не было ошибок
  async updatePoll(id: string, dto: UpdatePollDto): Promise<Poll> {
    if (!dto || Object.keys(dto).length === 0) {
      throw new BadRequestException('No update values provided');
    }

    const poll = await this.pollRepo.findOne({ where: { id } });
    if (!poll) {
      throw new NotFoundException('Poll not found');
    }

    // Обновляем все поля из dto, включая options (если есть)
    Object.entries(dto).forEach(([key, value]) => {
      if (value !== undefined) {
        (poll as any)[key] = value;
      }
    });

    return await this.pollRepo.save(poll);
  }
}
