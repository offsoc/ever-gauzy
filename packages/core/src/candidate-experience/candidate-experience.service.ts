import { MikroInjectRepository } from '@gauzy/common';
import { EntityRepository } from '@mikro-orm/core';
import { IPagination } from '@gauzy/contracts';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { TenantAwareCrudService } from './../core/crud';
import { CandidateExperience } from './candidate-experience.entity';

@Injectable()
export class CandidateExperienceService extends TenantAwareCrudService<CandidateExperience> {
	constructor(
		@InjectRepository(CandidateExperience)
		candidateExperienceRepository: Repository<CandidateExperience>,
		@MikroInjectRepository(CandidateExperience)
		mikroCandidateExperienceRepository: EntityRepository<CandidateExperience>
	) {
		super(candidateExperienceRepository, mikroCandidateExperienceRepository);
	}

	/**
	 *
	 * @param filter
	 * @returns
	 */
	public async findAll(filter?: FindManyOptions<CandidateExperience>): Promise<IPagination<CandidateExperience>> {
		return await super.findAll({
			select: {
				organization: {
					id: true,
					name: true,
					officialName: true
				}
			},
			...filter
		});
	}
}
