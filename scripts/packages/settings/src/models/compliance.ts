export interface BranchProtection {
    name: string;
    allowDeletion: boolean;
    allowForcePush: boolean;
    enforceAdmins: boolean;
    requireCodeReviewCount: number;
    requireCodeOwnersReview: boolean;
    requireStatusChecksCount: number;
}

export interface CodeOwnerRule {
    owner: string;
    path: string;
}

const COMPLIANT_CODEOWNER_RULES: readonly CodeOwnerRule[] = [
    { owner: '@kronostechnologies/secret-keepers', path: '.github/workflows' } as const,
    { owner: '@kronostechnologies/secret-keepers', path: '.circleci' } as const,
    { owner: '@kronostechnologies/secret-keepers', path: 'CODEOWNERS' } as const,
] as const;

export function isCompliant(protections: BranchProtection[], codeOwners: CodeOwnerRule[]): boolean {
    return isBranchProtectionCompliant(protections) && isCodeOwnersCompliant(codeOwners);
}

function isBranchProtectionCompliant(protections: BranchProtection[]): boolean {
    return protections.every((settings) => {
        return !settings.allowDeletion
            && !settings.allowForcePush
            && settings.enforceAdmins
            && settings.requireCodeReviewCount > 0
            && settings.requireCodeOwnersReview
            && settings.requireStatusChecksCount > 0;
    });
}

function isCodeOwnersCompliant(codeOwners: CodeOwnerRule[]): boolean {
    return COMPLIANT_CODEOWNER_RULES.every((compliantRule) => {
        return codeOwners.some((rule) => isCodeOwnerRuleEqual(rule, compliantRule));
    });
}

function isCodeOwnerRuleEqual(rule1: CodeOwnerRule, rule2: CodeOwnerRule): boolean {
    return rule1.owner === rule2.owner && rule1.path === rule2.path;
}
