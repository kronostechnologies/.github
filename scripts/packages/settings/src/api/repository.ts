import { isRepositoryVisibility, Repository } from '../models/repository';
import { createOctokit, GithubToken, Octokit } from './octokit';

export async function listRepositories(token: GithubToken): Promise<Repository[]> {
    const octokit: Octokit = createOctokit(token);
    const repositoriesData = await octokit.paginate(octokit.repos.listForOrg, {
        org: 'kronostechnologies',
        type: 'sources',
        sort: 'full_name',
    });

    return repositoriesData.map((data): Repository => ({
        archived: !!data.archived,
        default_branch: data.default_branch || 'main',
        disabled: !!data.disabled,
        html_url: data.html_url,
        is_template: !!data.is_template,
        license: data.license?.name,
        name: data.name,
        visibility: isRepositoryVisibility(data.visibility) ? data.visibility : 'public',
    }));
}

