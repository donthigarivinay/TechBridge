import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TeamsModule } from '../teams/teams.module';
import { ApplicationsModule } from '../applications/applications.module';
import { GithubModule } from '../github/github.module';

@Module({
    imports: [TeamsModule, ApplicationsModule, GithubModule],
    controllers: [ProjectsController],
    providers: [ProjectsService],
    exports: [ProjectsService],
})
export class ProjectsModule { }
