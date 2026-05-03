# flower-website

Next.js tabanli cicekci e-ticaret projesi.

## Local

```bash
npm install
npm run dev
```

Tarayicida `http://localhost:3000` adresini ac.

## Deploy

Bu repo `BeachGo` projesindeki GCP operasyon modeline uyarlanmistir.

Eklenen deploy dosyalari:

- `Dockerfile`
- `.dockerignore`
- `cloudbuild.frontend.yaml`
- `docs/GCP_RUNBOOK.md`

Cloud Run yolu:

```bash
gcloud builds submit --config cloudbuild.frontend.yaml .
gcloud run deploy cicekci-web --image europe-west1-docker.pkg.dev/PROJECT_ID/cicekci-platform/cicekci-web:latest --region europe-west1
```

Detayli GCP kurulum ve secret yonetimi icin:

- [docs/GCP_RUNBOOK.md](./docs/GCP_RUNBOOK.md)
