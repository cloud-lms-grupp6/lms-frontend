# lms-frontend

Frontend för gruppens **Learning Management System** (kursen *Molntjänster och distribuerade system*, EC Utbildning). Gemensamt repo — hela gruppen jobbar här. Backend-tjänsterna ligger i egna repos i samma org.

## Stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS** + **shadcn/ui** (komponenter kopieras in i `components/ui/`)
- **lucide-react** (ikoner)
- **TanStack Query** (datahämtning mot backend-API:erna)
- **React Hook Form + Zod** (formulär & validering)
- Deploy: **Vercel** (auto-deploy vid push till `main`)

## Kör lokalt

Kräver Node 20 LTS eller senare.

```bash
npm install
npm run dev
```

Öppna http://localhost:3000.

## Bygg

```bash
npm run build   # produktionsbygge
npm run start   # kör produktionsbygget lokalt
npm run lint    # ESLint
```

## Mappstruktur

```
app/            # sidor och layouts (App Router)
  (auth)/       # ej-inloggade flöden (login, register, verify)
  (app)/        # inloggade flöden (dashboard, courses, …)
components/
  ui/           # shadcn-primitiver
  features/     # egna sammansatta komponenter
lib/            # api-klient, hjälpfunktioner
hooks/          # custom React-hooks
types/          # delade TypeScript-typer
middleware.ts   # route-skydd (inloggning + roller)
```

## Miljövariabler

Backend-URL:er sätts som miljövariabler (lokalt i `.env.local`, i produktion i Vercel-dashboarden). `.env.local` är gitignorerad — committa aldrig riktiga värden.

```
NEXT_PUBLIC_API_URL=https://<din-backend>.azurewebsites.net
```

## Deploy

Kopplat till Vercel. Push till `main` → produktionsdeploy. Push till andra brancher / PR:ar → preview-deploy med egen URL.

## Bidra

Jobba aldrig direkt på `main` — den är skyddad. Skapa en branch, öppna en pull request. Se `_Git-flöde.md` i uppgiftsmappen för det fullständiga flödet och namngivningskonventioner.
