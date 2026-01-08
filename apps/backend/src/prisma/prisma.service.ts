import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor(config: ConfigService) {
        const url = config.get('DATABASE_URL')?.trim();
        super({
            datasources: {
                db: {
                    url,
                },
            },
        });
    }

    async onModuleInit() {
        await this.$connect();
    }
}
