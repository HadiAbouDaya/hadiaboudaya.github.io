#!/usr/bin/env python3
"""Trust this project's generated hook identities without rewriting other settings."""
import argparse
import datetime
import json
import os
from pathlib import Path
import re
import tempfile
import tomllib


def trust_hooks(project, config):
    project = project.resolve()
    seed = (project / '.codex/trust-seed.toml').read_text()
    seed = seed.replace('<PROJECT_DIR>', json.dumps(str(project), ensure_ascii=False)[1:-1])
    seed = seed[seed.index('[hooks.state.'): ]
    expected = tomllib.loads(seed)['hooks']['state']
    hook_prefix = str(project / '.codex/hooks.json') + ':'
    original = config.read_text() if config.exists() else ''
    before = tomllib.loads(original)
    # Remove only complete trust-entry tables that the generated seed replaces.
    # Verify the parsed result below before writing any user configuration.
    blocks = re.split(r'(?=^\s*\[(?!\[))', original, flags=re.MULTILINE)
    retained = []
    for block in blocks:
        header = re.match(r'^\s*(\[[^\n]+\])', block)
        if header:
            parsed = tomllib.loads(header[1] + '\n')
            identities = parsed.get('hooks', {}).get('state', {})
            if len(identities) == 1 and next(iter(identities)).startswith(hook_prefix):
                continue
        retained.append(block)
    updated = ''.join(retained).rstrip() + '\n\n' + seed
    after = tomllib.loads(updated)
    wanted = tomllib.loads(original)
    wanted_state = wanted.setdefault('hooks', {}).setdefault('state', {})
    for identity in list(wanted_state):
        if identity.startswith(hook_prefix):
            del wanted_state[identity]
    wanted_state.update(expected)
    if after != wanted:
        raise ValueError('Hook trust update would change unrelated settings; no file was written')
    if before == after:
        print('AI-DLC hook trust already matches this project')
        return
    config.parent.mkdir(parents=True, exist_ok=True)
    if config.exists():
        stamp = datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%S%fZ')
        backup = config.with_name(config.name + '.aidlc-backup-' + stamp)
        with open(backup, 'x', opener=lambda path, flags: os.open(path, flags, 0o600)) as output:
            output.write(original)
    fd, temporary = tempfile.mkstemp(prefix='.aidlc-config-', dir=config.parent)
    try:
        with os.fdopen(fd, 'w') as output:
            output.write(updated)
        os.replace(temporary, config)
    finally:
        Path(temporary).unlink(missing_ok=True)
    print(f'Trusted {len(expected)} AI-DLC hook identities for this project; other settings preserved')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--project', type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument('--config', type=Path, default=Path(os.environ.get('CODEX_HOME', str(Path.home() / '.codex'))) / 'config.toml')
    args = parser.parse_args()
    trust_hooks(args.project, args.config)
