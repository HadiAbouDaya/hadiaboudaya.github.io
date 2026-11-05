import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { CONTENT_SECURITY_POLICY, LUNA_CONTENT_SECURITY_POLICY } from "../../src/lib/security.ts";

const directives = policy => new Map(policy.split(";").map(part => {
  const [name, ...values] = part.trim().split(/\s+/);
  return [name, values];
}));

test("the optional CDN policy permits resources required by both root layouts", () => {
  const headers = readFileSync(new URL("../../public/_headers", import.meta.url), "utf8");
  const shared = directives(headers.match(/^\s+Content-Security-Policy:\s*(.+)$/m)[1]);
  for (const policy of [CONTENT_SECURITY_POLICY, LUNA_CONTENT_SECURITY_POLICY]) {
    for (const [name, values] of directives(policy)) {
      if (!name.endsWith("-src") && !["script-src-attr", "form-action", "base-uri"].includes(name)) continue;
      for (const value of values.filter(value => value !== "'none'")) {
        assert.ok(shared.get(name)?.includes(value), `Shared header blocks ${name} ${value}`);
      }
    }
  }
  assert.deepEqual(directives(CONTENT_SECURITY_POLICY).get("media-src"), ["'self'"]);
  assert.deepEqual(directives(LUNA_CONTENT_SECURITY_POLICY).get("connect-src"), ["'self'"]);
  assert.deepEqual(shared.get("frame-ancestors"), ["'none'"]);
  for (const policy of [CONTENT_SECURITY_POLICY, LUNA_CONTENT_SECURITY_POLICY]) {
    assert.deepEqual(directives(policy).get("script-src-attr"), ["'none'"]);
    assert.ok(!policy.includes("'unsafe-eval'"));
  }
});

test("untrusted build steps never receive deployment credentials or a persisted checkout token", () => {
  const workflow = parse(readFileSync(new URL("../../.github/workflows/deploy.yml", import.meta.url), "utf8"));
  assert.deepEqual(workflow.permissions, { contents: "read" });
  assert.equal(workflow.jobs.build.permissions, undefined);
  assert.deepEqual(workflow.jobs.deploy.permissions, { pages: "write", "id-token": "write" });
  assert.match(workflow.jobs.deploy.if, /github\.ref == 'refs\/heads\/main'/);
  assert.match(workflow.jobs.deploy.if, /github\.event_name != 'pull_request'/);
  assert.equal(workflow.jobs.build.steps.find(step => step.name === "Checkout").with["persist-credentials"], false);
  for (const job of Object.values(workflow.jobs)) {
    for (const step of job.steps.filter(step => step.uses)) {
      assert.match(step.uses, /^[\w-]+\/[\w-]+@[a-f0-9]{40}$/, step.name);
    }
  }
});
