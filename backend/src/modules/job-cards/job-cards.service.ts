import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobCard } from '../../database/entities';
import { JobCardStatus } from '../../database/enums';
import { UserContext } from '../../common/interfaces/jwt-payload.interface';
import { CreateJobCardDto, UpdateJobCardStatusDto } from './dto/create-job-card.dto';

@Injectable()
export class JobCardsService {
  constructor(
    @InjectRepository(JobCard)
    private readonly jobCardRepository: Repository<JobCard>,
  ) {}

  async create(dto: CreateJobCardDto, userCtx: UserContext): Promise<JobCard> {
    if (!userCtx.shopId) {
      throw new BadRequestException('Retail shop profile required to create lab job cards');
    }

    const jobCard = this.jobCardRepository.create({
      ...dto,
      shopId: userCtx.shopId,
      status: JobCardStatus.RECEIVED,
    });

    return await this.jobCardRepository.save(jobCard);
  }

  async findAll(userCtx: UserContext): Promise<JobCard[]> {
    const qb = this.jobCardRepository
      .createQueryBuilder('jobCard')
      .leftJoinAndSelect('jobCard.prescription', 'prescription')
      .leftJoinAndSelect('jobCard.order', 'order')
      .leftJoinAndSelect('jobCard.shop', 'shop')
      .orderBy('jobCard.createdAt', 'DESC');

    if (userCtx.shopId) {
      qb.where('jobCard.shopId = :shopId', { shopId: userCtx.shopId });
    }

    return await qb.getMany();
  }

  async findOne(id: string): Promise<JobCard> {
    const jobCard = await this.jobCardRepository.findOne({
      where: { id },
      relations: ['prescription', 'order', 'shop'],
    });
    if (!jobCard) {
      throw new NotFoundException(`Job card ${id} not found`);
    }
    return jobCard;
  }

  async updateStatus(id: string, dto: UpdateJobCardStatusDto, userCtx: UserContext): Promise<JobCard> {
    const jobCard = await this.findOne(id);
    if (userCtx.shopId && jobCard.shopId !== userCtx.shopId) {
      throw new ForbiddenException('You can only update job cards for your own shop');
    }

    jobCard.status = dto.status;
    return await this.jobCardRepository.save(jobCard);
  }
}
