import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GithubService {
    private octokit: any;

    constructor(
        private configService: ConfigService,
        private prisma: PrismaService
    ) {
        this.initOctokit();
    }

    private async initOctokit() {
        const token = this.configService.get<string>('GITHUB_TOKEN');
        console.log('GitHub Service: Initializing with token:', token ? '***' + token.slice(-4) : 'MISSING');
        if (token) {
            try {
                // Use dynamic import to support ESM-only octokit in CommonJS NestJS
                const { Octokit } = await (eval(`import('octokit')`) as Promise<any>);
                this.octokit = new Octokit({ auth: token });
                console.log('GitHub Service: Octokit initialized successfully');
            } catch (error: any) {
                console.error('GitHub Service: Failed to import/initialize Octokit:', error.message);
            }
        }
    }

    private async ensureOctokit() {
        if (!this.octokit) {
            await this.initOctokit();
        }
        if (!this.octokit) {
            throw new InternalServerErrorException('GitHub token not configured or initialization failed');
        }
    }

    async createRepo(name: string, description: string) {
        await this.ensureOctokit();
        const org = this.configService.get<string>('GITHUB_ORG');

        try {
            if (org) {
                try {
                    console.log(`GitHub Service: Attempting to create repo "${name}" in organization "${org}"`);
                    const response = await this.octokit.rest.repos.createInOrg({
                        org,
                        name,
                        description,
                        private: true,
                    });
                    return {
                        url: response.data.html_url,
                        name: response.data.name,
                        owner: response.data.owner.login,
                    };
                } catch (orgError: any) {
                    console.warn(`GitHub Service: Failed to create in org "${org}", falling back to user account:`, orgError.message);
                }
            }

            console.log(`GitHub Service: Creating repo "${name}" on authenticated user account`);
            let finalName = name;
            try {
                const response = await this.octokit.rest.repos.createForAuthenticatedUser({
                    name: finalName,
                    description,
                    private: true,
                });

                return {
                    url: response.data.html_url,
                    name: response.data.name,
                    owner: response.data.owner.login,
                };
            } catch (error: any) {
                if (error.message.includes('name already exists') || error.status === 422) {
                    finalName = `${name}-${Math.random().toString(36).substring(7)}`;
                    console.log(`GitHub Service: Name taken, trying "${finalName}"`);
                    const response = await this.octokit.rest.repos.createForAuthenticatedUser({
                        name: finalName,
                        description,
                        private: true,
                    });
                    return {
                        url: response.data.html_url,
                        name: response.data.name,
                        owner: response.data.owner.login,
                    };
                }
                throw error;
            }
        } catch (error: any) {
            console.error('GitHub Repo Creation Error:', error.message);
            throw new InternalServerErrorException(`Failed to create GitHub repository: ${error.message}`);
        }
    }

    private slugify(text: string) {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }

    async createRepoForProject(projectId: string) {
        await this.ensureOctokit();

        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            include: {
                client: {
                    include: { clientProfile: true }
                }
            }
        });

        if (!project) throw new InternalServerErrorException('Project not found');

        const companyName = project.client?.clientProfile?.companyName || 'techbridge';
        const repoName = this.slugify(`${project.title}-${companyName}`);

        const repoData = await this.createRepo(repoName, project.description);

        return this.prisma.project.update({
            where: { id: projectId },
            data: {
                githubRepoUrl: repoData.url,
                githubRepoName: `${repoData.owner}/${repoData.name}`
            } as any
        });
    }

    async addCollaborator(owner: string, repo: string, username: string) {
        await this.ensureOctokit();

        try {
            await this.octokit.rest.repos.addCollaborator({
                owner,
                repo,
                username,
                permission: 'push',
            });
        } catch (error: any) {
            console.error('GitHub Add Collaborator Error:', error);
            throw new InternalServerErrorException(`Failed to add GitHub collaborator "${username}": ${error.message}`);
        }
    }
}
