import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { StudentsController } from './students.controller';

import { ClientsController } from './clients.controller';
import { AdminController } from './admin.controller';
import { PublicController } from './public.controller';

@Module({
    controllers: [UsersController, StudentsController, ClientsController, AdminController, PublicController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule { }
