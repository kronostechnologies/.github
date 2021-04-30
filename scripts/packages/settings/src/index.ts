import * as dotenv from 'dotenv';
import * as yargs from 'yargs';
import { GithubToken } from './api';
import { printRepositoryCompliance, printRepositoryList } from './handlers';

dotenv.config();

const githubPat: GithubToken | undefined = process.env.GITHUB_PAT;
if (!githubPat) {
    console.error('GITHUB_PAT is required.');
    process.exit(1);
}

yargs
    .command({
        command: ['list', '$0'],
        describe: 'List repositories',
        handler: async () => printRepositoryList(githubPat),
    })
    .command<{ repo?: string }>({
        command: 'compliance [repo]',
        describe: 'Validate the compliance state of repositories',
        builder: {
            repo: {
                describe: 'Limit the validation to this repository',
            },
        },
        handler: async (argv) => printRepositoryCompliance(githubPat, argv.repo),
    })
    .help()
    .argv;
