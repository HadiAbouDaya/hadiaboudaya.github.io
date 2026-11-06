#!/bin/sh
# Reproduce this repository's pinned, native Codex installation.
set -eu
project_dir=$(CDPATH='' cd -- "$(dirname -- "$0")/.." && pwd)
cd "$project_dir"
version=$(cat .aidlc-version)
case "$version" in ''|*[!0-9.]*) echo 'Invalid .aidlc-version' >&2; exit 1 ;; esac
if ! command -v aidlc >/dev/null 2>&1 || ! aidlc version | grep -Fq "aidlc $version ("; then
  setup_dir=$(mktemp -d)
  trap 'rm -rf "$setup_dir"' EXIT HUP INT TERM
  release="https://github.com/awslabs/aidlc-workflows/releases/download/v$version"
  curl -fsSL "$release/install.sh" -o "$setup_dir/install.sh"
  curl -fsSL "$release/checksums.txt" -o "$setup_dir/checksums.txt"
  expected=$(awk '$2 == "install.sh" {print $1}' "$setup_dir/checksums.txt")
  test -n "$expected"
  if command -v sha256sum >/dev/null 2>&1; then
    actual=$(sha256sum "$setup_dir/install.sh" | awk '{print $1}')
  else
    actual=$(shasum -a 256 "$setup_dir/install.sh" | awk '{print $1}')
  fi
  test "$actual" = "$expected" || { echo 'Installer checksum mismatch' >&2; exit 1; }
  sh "$setup_dir/install.sh" --version "$version" --yes
  export PATH="$HOME/.local/bin:$PATH"
fi
aidlc config --pin "$version" --yes
aidlc config --harness codex --yes
python3 scripts/trust-aidlc-hooks.py
aidlc doctor
