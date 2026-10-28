# .github

Organization-wide GitHub defaults for Equisoft AWT. Keep existing community
guidance and `.github/CODEOWNERS` intact when updating agent tooling.

## Agent packages

Use APM CLI **0.35.0** (pinned in `.apm-version`) and run `apm install` to
regenerate the shared Copilot instructions, prompts, agents, skills, and MCP
configuration. `apm.yml` pins the common `org-standards`, `apm-usage`,
`code-review`, and `jira` packages to toolkit v1.3.0.

Do not hand-edit generated files marked in `.gitattributes`. Commit
`apm.lock.yaml` and deployed files together; `apm_modules/` stays untracked.
Run `apm audit --ci --no-cache` before opening a PR.
For updates, change all toolkit pins together in `apm.yml`, then run
`apm install` and the audit again.

The APM workflow uses `equisoft-actions/setup-apm@v1` with organization variable
`APM_APP_ID` and secret `APM_APP_PRIVATE_KEY`. Its GitHub App needs read access to
`agent-toolkit` and `.github-private`; local installs and audits need equivalent
private-repository access. Audits discover the existing organization policy from
`.github-private/apm-policy.yml`; this repository does not replace that policy or
change its enforcement.
Jira MCP authentication is separate from the GitHub App used by CI and hosted
code-review authentication.
