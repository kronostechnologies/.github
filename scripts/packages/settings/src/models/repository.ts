const REPOSITORY_VISIBILITIES = ['public', 'private', 'internal'] as const;
export type RepositoryVisibility = typeof REPOSITORY_VISIBILITIES[number];

export function isRepositoryVisibility(key?: string): key is RepositoryVisibility {
    return REPOSITORY_VISIBILITIES.includes(key as RepositoryVisibility);
}

export interface Repository {
    archived: boolean;
    defaultBranch: string;
    disabled: boolean;
    htmlUrl: string;
    isTemplate: boolean;
    license: string | undefined;
    name: string;
    visibility: RepositoryVisibility;
}
