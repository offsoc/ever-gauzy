import { MikroInjectRepository } from '@gauzy/common';
import { EntityRepository } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TenantAwareCrudService } from './../core/crud';
import { Warehouse } from './warehouse.entity';

@Injectable()
export class WarehouseService extends TenantAwareCrudService<Warehouse> {
	constructor(
		@InjectRepository(Warehouse)
		warehouseRepository: Repository<Warehouse>,
		@MikroInjectRepository(Warehouse)
		mikroWarehouseRepository: EntityRepository<Warehouse>
	) {
		super(warehouseRepository, mikroWarehouseRepository);
	}
}
