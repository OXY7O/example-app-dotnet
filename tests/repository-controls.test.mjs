import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

test("repository policy declares the governed no-release boundary", () => {
  const policy = JSON.parse(fs.readFileSync("repository-policy.json", "utf8"));
  assert.equal(policy.profileKey, "dotnet-webapi");
  assert.equal(policy.governanceBaseline, "platform-governance@v1.3.0");
  assert.equal(policy.workflowRelease, "platform-workflow@v0.5.2");
  assert.equal(policy.deploymentEnabled, false);
  assert.equal(policy.secretsRequired, false);
});

test("thin caller is immutable, read-only, and uses no privileged context", () => {
  const source = fs.readFileSync(".github/workflows/ci.yml", "utf8");
  assert.match(source, /permissions:\s*\n\s+contents: read/);
  assert.match(source, /ci-profile-dotnet-webapi\.yml@451f980e3f4b9d926b7b340b42f7f611d75db1d2/);
  assert.doesNotMatch(source, /secrets\s*:\s*inherit|id-token\s*:\s*write|\benvironment\s*:|\bdeploy(?:ment)?\b/i);
});

test("preview catalogue remains non-blocking and artifactless", () => {
  const value = JSON.parse(fs.readFileSync("compatibility/dotnet-webapi.json", "utf8"));
  const preview = value.lanes.find((lane) => lane.lifecycle === "preview");
  assert.equal(preview.sdkVersion, "11.0.100-preview.6.26359.118");
  assert.equal(preview.blocking, false); assert.equal(preview.artifact, false);
});

test("README provides the complete developer journey and evidence boundary", () => {
  const readme = fs.readFileSync("README.md", "utf8");
  for (const text of ["Quick start", "Endpoint", "Compatibility", "Required checks", "Artifact", "Adopsi", "Onboarding", "Troubleshooting", "Safe evidence", "Tanpa deployment"]) assert.match(readme, new RegExp(text, "i"));
  assert.ok((readme.split("\n").slice(0, 12).join("\n").match(/!\[/g) ?? []).length <= 5);
});

test("actual pilot evidence is immutable, artifact-qualified, and deployment-free", () => {
  const evidence = JSON.parse(fs.readFileSync("docs/evidence/pilot-evidence.actual.json", "utf8"));
  assert.equal(evidence.runId, 33317740112);
  assert.match(evidence.sourceSha, /^[a-f0-9]{40}$/);
  assert.equal(evidence.workflowSha, "451f980e3f4b9d926b7b340b42f7f611d75db1d2");
  assert.equal(evidence.canonical.readiness, "ci-qualified");
  assert.equal(evidence.canonical.artifactCount, 1);
  assert.match(evidence.canonical.artifactDigest, /^sha256:[a-f0-9]{64}$/);
  assert.equal(evidence.preview.blocking, false);
  assert.equal(evidence.preview.artifactCount, 0);
  assert.equal(evidence.deploymentAuthorized, false);
});
