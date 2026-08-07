import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
    ForbiddenException,
    BadRequestException,
    Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Octokit } from '@octokit/rest';

@Injectable()
export class GithubService {
    private readonly octokit: Octokit;
    private readonly logger = new Logger(GithubService.name);

    constructor(private readonly configService: ConfigService) {
        const token = this.configService.get<string>('GITHUB_TOKEN');
        console.log(
            'GitHub token loaded:',
            process.env.GITHUB_TOKEN ? 'YES' : 'NO',
        );

        if (!token) {
            this.logger.warn('GITHUB_TOKEN is missing in environment variables.');
        }

        this.octokit = new Octokit({
            auth: token,
        });
    }

    /**
     * Helper to wrap Octokit API calls with unified error handling
     */
    private async handleGithubError<T>(fn: () => Promise<T>): Promise<T> {
        try {
            return await fn();
        } catch (error: any) {
            this.logger.error(`GitHub API Error: ${error.message}`, error.stack);

            if (error.status === 401) {
                throw new UnauthorizedException('Invalid or expired GitHub Token.');
            }
            if (error.status === 403 && error.message?.includes('rate limit')) {
                throw new ForbiddenException('GitHub API rate limit exceeded. Please try again later.');
            }
            if (error.status === 404) {
                throw new NotFoundException('Requested GitHub resource or repository was not found.');
            }
            if (error.status === 400) {
                throw new BadRequestException('Bad request sent to GitHub API.');
            }

            throw new InternalServerErrorException(
                error.message || 'An error occurred while communicating with GitHub API.',
            );
        }
    }

    async getAuthenticatedUser() {
        return this.handleGithubError(async () => {
            const { data } = await this.octokit.rest.users.getAuthenticated();
            return data;
        });
    }

    async getRepositories() {
        return this.handleGithubError(async () => {
            const { data } = await this.octokit.rest.repos.listForAuthenticatedUser({
                sort: 'updated',
                per_page: 30,
            });
            return data;
        });
    }

    async getRepository(owner: string, repo: string) {
        return this.handleGithubError(async () => {
            const { data } = await this.octokit.rest.repos.get({
                owner,
                repo,
            });
            return data;
        });
    }

    async getRepositoryIssues(owner: string, repo: string) {
        return this.handleGithubError(async () => {
            const { data } = await this.octokit.rest.issues.listForRepo({
                owner,
                repo,
                state: 'all',
                per_page: 50,
            });
            return data;
        });
    }

    async getRepositoryPullRequests(owner: string, repo: string) {
        return this.handleGithubError(async () => {
            const { data } = await this.octokit.rest.pulls.list({
                owner,
                repo,
                state: 'all',
                per_page: 50,
            });
            return data;
        });
    }

    async getRepositoryCommits(owner: string, repo: string) {
        return this.handleGithubError(async () => {
            const { data } = await this.octokit.rest.repos.listCommits({
                owner,
                repo,
                per_page: 30,
            });
            return data;
        });
    }
}