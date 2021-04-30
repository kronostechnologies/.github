import { GetResponseDataTypeFromEndpointMethod } from '@octokit/types';
import { CodeOwnerRule } from '../models/compliance';
import { createOctokit, GithubToken, Octokit } from './octokit';

type GetContentData = GetResponseDataTypeFromEndpointMethod<Octokit['repos']['getContent']>;
type GetContentFileData = Extract<GetContentData, Array<unknown>> extends (infer T)[] ? T : GetContentData;

// @ts-ignore
function isFile(data: GetContentData): data is GetContentFileData {
    return typeof data === 'object' && (<any>data).type === 'file';
}

export async function getCodeOwners(
    token: GithubToken,
    repository: string,
): Promise<CodeOwnerRule[]> {
    const octokit: Octokit = createOctokit(token);

    try {
        const { data }: { data: GetContentData } = await octokit.repos.getContent({
            owner: 'kronostechnologies',
            repo: repository,
            path: 'CODEOWNERS',
        });

        if (!isFile(data)) {
            octokit.log.warn(`Invalid code owners. Expected a single file.`);
            return [];
        }

        return Buffer.from(data.content, <any>data.encoding).toString()
            .trim()
            .split('\n')
            .map((row) => row.split(' '))
            .map(([path, owner]) => ({ path, owner }));
    } catch (e) {
        if (e.status === 404) {
            return [];
        }
        throw e;
    }
}
