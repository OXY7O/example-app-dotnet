import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

test("repository policy declares the governed no-release boundary", () => {
  const policy = JSON.parse(fs.readFileSync("repository-policy.json", "utf8"));
  assert.equal(policy.profileKey, "dotnet-webapi");
  assert.equal(policy.governanceBaseline, "platform-governance@v1.3.0");
  assert.equal(policy.workflowRelease, "platform-workflow@v0.5.1");
  assert.equal(policy.deploymentEnabled, false);
  assert.equal(policy.secretsRequired, false);
});

test("thin caller is immutable, read-only, and uses no privileged context", () => {
  const source = fs.readFileSync(".github/workflows/ci.yml", "utf8");
  assert.match(source, /permissions:\s*\n\s+contents: read/);
  assert.match(source, /ci-profile-dotnet-webapi\.yml@d0f9bb9394796a22409ec9029182bec542615adc/);
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
