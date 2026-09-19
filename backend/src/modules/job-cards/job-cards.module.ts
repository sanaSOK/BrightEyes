import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobCard } from '../../database/entities';
import { JobCardsService } from './job-cards.service';
import { JobCardsController } from './job-cards.controller';

@Module({
  imports: [TypeOrmModule.forFeature([JobCard])],
  controllers: [JobCardsController],
  providers: [JobCardsService],
  exports: [JobCardsService],
})
export class JobCardsModule {}
