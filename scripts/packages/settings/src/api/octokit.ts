import { retry } from '@octokit/plugin-retry';
import { throttling } from '@octokit/plugin-throttling';
import { Octokit as RestOctokit } from '@octokit/rest';

export type GithubToken = string;
export type Octokit = RestOctokit;

export function createOctokit(token: GithubToken): Octokit {
    const AugmentedOctokit = RestOctokit.plugin(retry).plugin(throttling);
    const octokit = new AugmentedOctokit({
        auth: token,
        previews: [
            'baptiste', // is_template and template_repository
            'luke-cage', // required_pull_request_reviews.required_approving_review_count
            'nebula', // visibility
        ],
        throttle: {
            onRateLimit: (retryAfter: number, options: any): boolean => {
                octokit.log.info(`Request quota exhausted for request ${options.method} ${options.url}`);

                if (options.request.retryCount <= 2) {
                    octokit.log.info(`Retrying after ${retryAfter} seconds!`);
                    return true;
                }

                octokit.log.warn(`Retry limit reached for request ${options.method} ${options.url}`);
                return false;
            },
            onAbuseLimit: (_retryAfter: number, options: any): boolean => {
                octokit.log.warn(`Abuse detected for request ${options.method} ${options.url}`);
                return false;
            },
        },
    });
    return octokit;
}
