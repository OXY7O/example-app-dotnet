# OXY7O Example App .NET Web API

[![Profile](https://img.shields.io/badge/profile-dotnet--webapi-512bd4)](https://github.com/OXY7O/platform-workflow/tree/451f980e3f4b9d926b7b340b42f7f611d75db1d2/docs/profiles/dotnet-webapi)
[![SDK](https://img.shields.io/badge/.NET%20SDK-10.0.110-512bd4)](global.json)
[![Lifecycle](https://img.shields.io/badge/lifecycle-pilot-f59e0b)](repository-policy.json)
[![Tanpa deployment](https://img.shields.io/badge/deployment-tidak%20tersedia-6b7280)](repository-policy.json)

Contoh consumer canonical untuk reusable profile `.NET Web API`. Repository ini menunjukkan hubungan nyata dari governance, implementasi workflow, thin caller, source/test, application package, sampai Safe evidence—tanpa menyisipkan logika CI pusat ke repository aplikasi.

## Peran dalam provisioning

Repository ini adalah permanent compatibility dan certification fixture untuk
profile `.NET Web API`. Ia menguji workflow SHA, SDK canonical/preview lane,
application-package boundary, dan Safe evidence. Source-nya tidak disalin ke
repository developer dan bukan template aplikasi.

Platform Provisioning hanya dapat memakai hasil pilot untuk exact approved bundle
yang masih valid. Kombinasi baru atau perubahan behavior membutuhkan sandbox
validation. Deployment dan security end-to-end belum tersedia, sehingga repository
ini belum menerbitkan certification reusable untuk deployment atau security
profile penuh.

## Hubungan repository

```text
platform-governance v1.3.0
  -> platform-workflow v0.5.2 / commit 451f980...
    -> example-app-dotnet (repository ini)
      -> pola adopsi untuk repository aplikasi
```

## Quick start

Prasyarat: .NET SDK tepat `10.0.110`.

```bash
dotnet --version
dotnet restore Example.App.Dotnet.slnx --locked-mode
dotnet build Example.App.Dotnet.slnx --configuration Release --no-restore
dotnet test tests/Example.Api.Tests/Example.Api.Tests.csproj --configuration Release --no-build --no-restore
dotnet run --project src/Example.Api/Example.Api.csproj
```

## Endpoint

| Method | Path | Hasil |
|---|---|---|
| GET | `/health` | Status deterministik `healthy` |
| GET | `/api/examples/42` | Resource contoh dengan numeric ID |
| GET | `/api/examples/404` | `404 resource-not-found` |
| GET | `/api/examples/abc` | `400 invalid-identifier` |

API sengaja tidak memiliki database, authentication, cloud dependency, atau side effect agar fokus pada kontrak workflow.

## Compatibility

| Lane | SDK | Blocking | Artifact |
|---|---|---|---|
| Canonical | `10.0.110` / `net10.0` / `linux-x64` | Ya | Satu package |
| Preview opt-in | `11.0.100-preview.6.26359.118` | Tidak | Tidak |

Preview membantu melihat risiko runtime berikutnya. Hasilnya belum menjadi klaim compatibility `verified`.

## Required checks

- typed caller contract dan exact SDK;
- locked restore dan format verification;
- Release build, unit/integration test, dan coverage minimal 80%;
- package vulnerable/deprecated check;
- Web SDK/target validation dan framework-dependent publish;
- deterministic package/manifest/digest;
- normalized result dan Safe evidence metadata.

## Artifact

Canonical lane menghasilkan tepat satu `example-api_0.1.0_net10.0_linux-x64.tar.gz`. Paket berisi output publish framework-dependent dan manifest, berstatus `ci-qualified`. Source, test, coverage, secret, `.env`, private key, dan runtime self-contained ditolak.

`ci-qualified` bukan izin promotion, release production, atau deployment.

## Safe evidence

Struktur evidence berada di [schema evidence](docs/evidence/pilot-evidence.schema.json) dan [contoh sanitized](docs/evidence/pilot-evidence.example.json). Evidence aktual ditambahkan setelah pilot GitHub Actions berhasil. Evidence tidak boleh berisi token, secret, private key, atau environment value.

## Cara mempelajari pola

1. Cocokkan workload dengan controller-based ASP.NET Core Web API.
2. Salin struktur `global.json`, solution, project, test, dan lock file.
3. Pelajari thin caller; governed provisioning akan memasangnya dari template
   ketika layanan tersedia.
4. Pin workflow ke full commit SHA yang disetujui.
5. Sesuaikan path, nama artifact, version, coverage, dan retention dalam schema.
6. Verifikasi satu canonical artifact dan nol preview artifact.

## Onboarding checklist

- [ ] SDK aktual tepat `10.0.110`.
- [ ] Semua `packages.lock.json` committed dan locked restore lulus.
- [ ] Format, build, test, coverage, vulnerable, dan deprecated checks lulus.
- [ ] Caller hanya `contents: read`, tanpa secret dan privileged context.
- [ ] Workflow dipin ke `451f980e3f4b9d926b7b340b42f7f611d75db1d2`.
- [ ] Artifact dan manifest cocok dengan source/workflow SHA.
- [ ] Status `ci-qualified` tidak dipakai sebagai izin deployment.

## Troubleshooting

- `unexpected .NET SDK`: cocokkan `global.json` dan `dotnet --version`.
- `packages.lock.json missing`: restore untuk memperbarui lock lalu review diff sebelum commit.
- `format verification failed`: jalankan `dotnet format` dan review perubahan.
- coverage/security/dependency failure: perbaiki source atau package; jangan turunkan required check.
- platform failure: lampirkan run URL dan Safe evidence tanpa secret.

## Batas: Tanpa deployment

Repository ini hanya membuktikan CI dan artifact. Tidak ada environment credential, OIDC, deployment job, container image, release production, database, atau infrastructure integration.
