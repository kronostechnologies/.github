import { getBranchProtection, getCodeOwners, getRepository, GithubToken, listRepositories } from '../api';
import { isCompliant } from '../models/compliance';
import { Repository } from '../models/repository';

interface ComplianceSummary {
    name: string;
    compliant: boolean;
}

export async function printRepositoryCompliance(token: GithubToken, name?: string): Promise<void> {
    const repositories = await loadRepositories(token, name);
    const compliance = await Promise.all(
        repositories
            .filter((repository) => !repository.archived && !repository.disabled)
            .map(repository => validateRepository(token, repository)),
    );

    console.table(compliance, [
        'name',
        'compliant',
    ]);
}

async function loadRepositories(token: string, name?: string): Promise<Repository[]> {
    if (!name) {
        return await listRepositories(token);
    } else {
        return [await getRepository(token, name)];
    }
}

async function validateRepository(token: string, repo: Repository): Promise<ComplianceSummary> {
    const [protection, codeOwners] = await Promise.all([
        getBranchProtection(token, repo.name, repo.defaultBranch),
        getCodeOwners(token, repo.name),
    ]);
    const compliant = isCompliant([protection], codeOwners);

    return { name: repo.name, compliant };
}
