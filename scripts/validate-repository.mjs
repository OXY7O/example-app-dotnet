import fs from "node:fs";
const required=["global.json","Directory.Build.props","Example.App.Dotnet.slnx","src/Example.Api/Example.Api.csproj","tests/Example.Api.Tests/Example.Api.Tests.csproj",".github/workflows/ci.yml","compatibility/dotnet-webapi.json","repository-policy.json","docs/evidence/pilot-evidence.actual.json"];
const errors=required.filter((file)=>!fs.existsSync(file));
for(const file of ["global.json","compatibility/dotnet-webapi.json","repository-policy.json","docs/evidence/pilot-evidence.schema.json","docs/evidence/pilot-evidence.example.json","docs/evidence/pilot-evidence.actual.json"]) JSON.parse(fs.readFileSync(file,"utf8"));
const workflow=fs.readFileSync(".github/workflows/ci.yml","utf8");
if(!/@[a-f0-9]{40}/.test(workflow)) errors.push("immutable workflow pin missing");
if(/secrets\s*:\s*inherit|id-token\s*:\s*write|\benvironment\s*:|\bdeploy(?:ment)?\b/i.test(workflow)) errors.push("privileged workflow context found");
if(errors.length){console.error(errors.join("\n"));process.exit(1);}
console.log("Validated governed .NET Web API example repository.");
