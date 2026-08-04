# Passeport SST Telecon

Prototype fonctionnel de l'application **Passeport SST Telecon** — la synthèse numérique individuelle qui répond, pour chaque travailleur, aux questions : est-il formé, ses quiz sont-ils réussis, sa compétence terrain est-elle démontrée, est-il autorisé pour la tâche critique, et quelles preuves sont disponibles pour un audit COR ?

Ce dépôt contient un **prototype interactif** (données fictives), pensé pour valider l'expérience utilisateur, la navigation par rôle et les règles d'affaires avant tout développement en environnement Power Platform / SharePoint.

## Stack technique

- **React 18** + **TypeScript**
- **Vite** (build)
- **Tailwind CSS** + **shadcn/ui** (composants)
- **recharts** (graphiques de type Power BI)
- **lucide-react** (icônes)

## Démarrer en local

```bash
pnpm install
pnpm dev
```

L'application est servie sur `http://localhost:5173`.

## Build de production

```bash
pnpm run build
```

Le résultat est généré dans `dist/` (fichiers statiques prêts à déployer — Netlify, Azure Static Web Apps, IIS, etc.).

## Déploiement Netlify

- **Build command** : `pnpm run build`
- **Publish directory** : `dist`
- **Branch** : `main`

Aucune variable d'environnement n'est requise — toutes les données sont fictives et embarquées dans le code (`src/data/`).

## Rôles et écrans

L'application simule 5 rôles, chacun avec son propre point d'entrée et sa navigation :

| Rôle | Écrans principaux |
|---|---|
| **Employé** | Tableau de bord personnel, Passeport numérique, Centre de formation |
| **Superviseur** | Tableau de bord équipe, PSFCE, Passeport numérique, Matrice, Centre de formation |
| **Gestionnaire** | Tableau de bord gestion, Matrice, Vue Power BI, Bibliothèque de preuves |
| **PASS SST** | Tableau de bord PASS SST, Matrice de formation, Centre de formation, Bibliothèque de preuves, Vue Power BI |
| **RH** | Tableau de bord RH (onboarding), Passeport numérique, Bibliothèque de preuves |

Le sélecteur de rôle est accessible en tout temps dans l'en-tête de l'application.

## Structure du projet

```
src/
├── types.ts                # Modèle de données (Employee, TrainingModule, PSFCE, Authorization, ...)
├── data/                    # Données fictives (dérivées du catalogue et de la matrice réels)
│   ├── employees.ts
│   ├── trainingCatalog.ts   # 25 modules — issus de 05_CATALOGUE_FORMATIONS.csv
│   ├── matrixRules.ts       # 45 règles — issues de la matrice avancée (xlsx)
│   ├── jobProfiles.ts       # 9 profils de postes
│   ├── psfce.ts
│   ├── authorizations.ts
│   └── evidence.ts          # Preuves + dossiers d'onboarding
├── lib/
│   ├── app-context.tsx      # État global (rôle actif, écran, employé consulté)
│   ├── nav-config.ts        # Navigation par rôle
│   └── status.ts            # Couleurs/statuts du design system
├── components/
│   ├── layout/               # Sidebar, Header, RoleSwitcher, AppShell
│   └── shared/                # StatusBadge, PassportCard, MatrixRuleTable, PowerBIWidget, ...
└── pages/                     # Les 12 écrans de l'application
```

## Règles d'affaires modélisées

1. Une tâche critique ne peut être autorisée sans validation du TQT associé.
2. Une formation avec quiz n'est complétée que si le quiz est réussi.
3. Une compétence terrain requiert un PSFCE, une observation ou une validation superviseur.
4. Les exigences client ont priorité sur les exigences génériques.
5. Les exigences provinciales s'ajoutent aux exigences de la BU.
6. Les preuves doivent être exportables pour un audit COR.
7. Les formations expirées déclenchent une alerte.

## Design system

Palette Telecon (voir `tailwind.config.js`, tokens `tc-*`) :

- Bleu foncé `#082A52` · Bleu secondaire `#123E6D` · Turquoise `#008C82`
- Vert conformité `#16A34A` · Orange alerte `#F59E0B` · Rouge sécurité `#DC2626`

## Statut

Prototype fonctionnel — données fictives, pas d'intégration live avec SharePoint, Microsoft Forms, QuickBase, eCompliance ou Power BI. Ces connecteurs sont documentés comme cibles d'architecture mais ne sont pas implémentés dans ce dépôt.
