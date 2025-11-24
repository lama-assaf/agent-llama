#!/bin/bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "==> Checking working tree cleanliness"
if ! git -C "$REPO_ROOT" diff --quiet || ! git -C "$REPO_ROOT" diff --cached --quiet; then
  echo "Error: working tree not clean. Commit or stash changes first." >&2
  exit 1
fi

echo "==> Fetching remotes"
git -C "$REPO_ROOT" fetch upstream --prune
git -C "$REPO_ROOT" fetch origin --prune

echo "==> Ensuring on master"
current_branch=$(git -C "$REPO_ROOT" rev-parse --abbrev-ref HEAD)
if [[ "$current_branch" != "master" ]]; then
  git -C "$REPO_ROOT" checkout master
fi

echo "==> Fast-forwarding origin/master (if possible)"
set +e
git -C "$REPO_ROOT" pull --ff-only origin master
set -e

echo "==> Merging upstream/master"
set +e
git -C "$REPO_ROOT" merge --no-ff --no-edit upstream/master
merge_status=$?
set -e

if [[ $merge_status -eq 0 ]]; then
  echo "==> Merge completed without conflicts. Pushing..."
  git -C "$REPO_ROOT" push origin master
  echo "Done."
  exit 0
fi

echo "==> Conflicts detected. Attempting AI-assisted resolution..."

if ! command -v bun >/dev/null 2>&1; then
  echo "Error: Bun is required to run the AI resolver (bun not found)." >&2
  exit 2
fi

pushd "$REPO_ROOT" >/dev/null
set +e
bun run scripts/ai-merge-resolver.ts
resolver_status=$?
set -e
popd >/dev/null

if [[ $resolver_status -ne 0 ]]; then
  echo "AI resolver could not resolve all conflicts. Please resolve manually and commit." >&2
  exit 3
fi

echo "==> Finalizing merge commit"
git -C "$REPO_ROOT" commit --no-edit

echo "==> Pushing to origin/master"
git -C "$REPO_ROOT" push origin master

echo "All done."


