import * as dotenv from 'dotenv';
import * as yargs from 'yargs';
import { GithubToken } from './api';
import { printRepositoryList } from './handlers/print-repository-list';

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
    .help()
    .argv;
