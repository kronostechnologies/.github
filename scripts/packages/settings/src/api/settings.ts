import { BranchProtection } from '../models/compliance';
import { createOctokit, GithubToken, Octokit } from './octokit';

export async function getBranchProtection(
    token: GithubToken,
    repository: string,
    branch: string,
): Promise<BranchProtection> {
    const octokit: Octokit = createOctokit(token);

    try {
        const { data } = await octokit.repos.getBranchProtection({
            owner: 'kronostechnologies',
            repo: repository,
            branch: branch,
        });

        return {
            name: branch,
            allowDeletion: !!data.allow_deletions?.enabled,
            allowForcePush: !!data.allow_force_pushes?.enabled,
            enforceAdmins: !!data.enforce_admins?.enabled,
            requireCodeReviewCount: +(data.required_pull_request_reviews?.required_approving_review_count || 0),
            requireCodeOwnersReview: !!data.required_pull_request_reviews?.require_code_owner_reviews,
            requireStatusChecksCount: data.required_status_checks?.contexts?.length || 0,
        };
    } catch (e) {
        if (e.message === 'Branch not protected') {
            return {
                name: branch,
                allowDeletion: true,
                allowForcePush: true,
                enforceAdmins: false,
                requireCodeReviewCount: 0,
                requireCodeOwnersReview: false,
                requireStatusChecksCount: 0,
            };
        }
        throw e;
    }
}
