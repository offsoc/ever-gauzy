import { MikroInjectRepository } from '@gauzy/common';
import { EntityRepository } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TenantAwareCrudService } from './../core/crud';
import { OrganizationRecurringExpense } from './organization-recurring-expense.entity';

@Injectable()
export class OrganizationRecurringExpenseService extends TenantAwareCrudService<OrganizationRecurringExpense> {
	constructor(
		@InjectRepository(OrganizationRecurringExpense)
		organizationRecurringExpenseRepository: Repository<OrganizationRecurringExpense>,
		@MikroInjectRepository(OrganizationRecurringExpense)
		mikroOrganizationRecurringExpenseRepository: EntityRepository<OrganizationRecurringExpense>
	) {
		super(organizationRecurringExpenseRepository, mikroOrganizationRecurringExpenseRepository);
	}
}
