import { MikroInjectRepository } from '@gauzy/common';
import { EntityRepository } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TenantAwareCrudService } from '@gauzy/core';
import { isNotEmpty } from '@gauzy/common';
import { HelpCenterArticle } from './help-center-article.entity';
import { IHelpCenterArticleUpdate } from '@gauzy/contracts';

@Injectable()
export class HelpCenterArticleService extends TenantAwareCrudService<HelpCenterArticle> {
	constructor(
		@InjectRepository(HelpCenterArticle)
		helpCenterArticle: Repository<HelpCenterArticle>,
		@MikroInjectRepository(HelpCenterArticle)
		mikroHelpCenterArticle: EntityRepository<HelpCenterArticle>
	) {
		super(helpCenterArticle, mikroHelpCenterArticle);
	}

	async getArticlesByCategoryId(categoryId: string): Promise<HelpCenterArticle[]> {
		return await this.repository
			.createQueryBuilder('knowledge_base_article')
			.where('knowledge_base_article.categoryId = :categoryId', {
				categoryId
			})
			.getMany();
	}

	async deleteBulkByCategoryId(ids: string[]) {
		if (isNotEmpty(ids)) {
			return await this.repository.delete(ids);
		}
	}

	public async updateArticleById(id: string, input: IHelpCenterArticleUpdate): Promise<void> {
		await this.repository.update(id, input);
	}
}
