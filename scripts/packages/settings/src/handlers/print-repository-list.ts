import { GithubToken, listRepositories } from '../api';

export async function printRepositoryList(token: GithubToken): Promise<void> {
    const repositories = await listRepositories(token);

    console.table(repositories, [
        'name',
        'default_branch',
        'visibility',
        'license',
        'is_template',
        'archived',
        'disabled',
    ]);
}
