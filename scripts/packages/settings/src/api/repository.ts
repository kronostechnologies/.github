import { GetResponseDataTypeFromEndpointMethod } from '@octokit/types';
import { isRepositoryVisibility, Repository } from '../models/repository';
import { createOctokit, GithubToken, Octokit } from './octokit';

type GetRepositoryData = GetResponseDataTypeFromEndpointMethod<Octokit['repos']['get']>;
type ListRepositoryItemData = GetResponseDataTypeFromEndpointMethod<Octokit['repos']['listForOrg']>[number];

function mapRepositoryData(data: GetRepositoryData | ListRepositoryItemData): Repository {
    return {
        archived: !!data?.archived,
        defaultBranch: data.default_branch || 'main',
        disabled: !!data?.disabled,
        htmlUrl: data.html_url,
        isTemplate: !!data.is_template,
        license: data.license?.name,
        name: data.name,
        visibility: isRepositoryVisibility(data.visibility) ? data.visibility : 'public',
    };
}

export async function listRepositories(token: GithubToken): Promise<Repository[]> {
    const octokit: Octokit = createOctokit(token);
    const data = await octokit.paginate(octokit.repos.listForOrg, {
        org: 'kronostechnologies',
        type: 'sources',
        sort: 'full_name',
    });

    return data.map(mapRepositoryData);
}

export async function getRepository(token: GithubToken, repository: string): Promise<Repository> {
    const octokit: Octokit = createOctokit(token);
    const { data } = await octokit.repos.get({
        owner: 'kronostechnologies',
        repo: repository,
    });

    return mapRepositoryData(data);
}

