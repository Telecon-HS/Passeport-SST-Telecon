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
| **Employé** | Accueil, Tableau de bord personnel, Passeport numérique, Centre de formation |
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
│   ├── trainingCatalog.ts   # 26 modules — catalogue SSE-800
│   ├── matrixRules.ts       # 28 règles Poste → BU → TQT → Formations → PSFCE → Autorisations
│   ├── organization.ts      # Référentiel BU / Région / Poste
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

## Accès et comptes

L'application s'ouvre sur un écran de connexion. Chaque compte détermine le rôle, la navigation
disponible et le **périmètre de données visible** :

| Identifiant | Rôle | Périmètre |
|---|---|---|
| `alex.tremblay` | Employé | Son dossier uniquement |
| `jordan.lee` | Superviseur | Son équipe (Infra Québec) |
| `marc.simard` | Superviseur | Son équipe (I&R) |
| `marie.fontaine` | Gestionnaire | Toute l'organisation |
| `renee.dube` | PASS SST | Toute l'organisation |
| `isabelle.moreau` | RH | Toute l'organisation |

Mot de passe commun : `Telecon2026`.

> ⚠️ **Sécurité — à lire avant tout usage réel.**
> L'authentification est réalisée **côté client uniquement**. Les comptes et mots de passe sont
> présents dans le code livré au navigateur : n'importe qui peut les lire et contourner l'écran de
> connexion. Ce mécanisme sert à démontrer l'expérience par rôle, **pas à protéger des données**.
> Le prototype ne doit contenir que des données fictives.
>
> Pour un déploiement réel, il faut une authentification serveur (Netlify Identity, Auth0, ou
> Microsoft Entra ID pour rester aligné avec l'écosystème Telecon) et un filtrage des données
> côté serveur, pas seulement dans l'interface.

## Référentiel organisationnel

Hiérarchie à trois niveaux (`src/data/organization.ts`), issue des programmes d'orientation SST
Telecon (HSE-00, HSE-800) :

**Niveau 1 — Business Unit**

| BU | Portée |
|---|---|
| Infrastructure | Excavation, daylighting, électricité télécom, TCP, travaux civils, FTTH, aérien/souterrain |
| I&R | Installation, réparation, travaux terrain télécommunications |
| Structured Cabling | Fibre, cuivre, Wi-Fi, DAS, AV, sécurité, centres de données |
| Design | Conception, dessin technique, ingénierie réseaux, arpentage |
| Locate | Localisation d'infrastructures, utility locating (Promark) |
| Warehouse | Entrepôt, réception, inventaire, matériel |

**Niveau 2 — Région** : QC · ON · West · Atlantique · USA (dérivée de la province).

**Niveau 3 — Poste** : Monteur, Technicien, Localisateur, Arpenteur, Dessinateur CAD,
Contremaître, Superviseur, Gestionnaire, Magasinier.

Chaîne complète visée : `BU → Région → Poste → Client → Projet → Formation → TQT → PSFCE → Autorisations`.

Les feuilles Excel utilisent des libellés abrégés hérités (`Infra`, `IR`, `Câblage structuré`,
`Opérations régionales`…). `normalizeBusinessUnit()` et `matchesBusinessUnit()` les rattachent aux
BU canoniques pour garder les croisements cohérents entre la matrice et les dossiers employés.

### Points à confirmer

- Les BU corporatives (`Home Connectivity`, `Turnkey`, `Design USA`) ne sont pas modélisées :
  elles relèvent de la gouvernance, pas des parcours de formation SST.
- `Wireless` figure au référentiel Excel mais pas dans la liste opérationnelle consolidée :
  les dossiers concernés sont rattachés à `I&R` — à valider.
- Les codes internes (TDU, TDI, AGIR, Questzone, SC360, Marcomm) ne sont pas modélisés :
  ils relèvent des feuilles de temps, pas des parcours de formation SST.

## Moteur de matrice

`src/lib/matrix-engine.ts` transforme un dossier employé en exigences concrètes, ce qui correspond
à l'étape **BPMN-03 « Consulter la matrice »** :

```
BU + Poste + Région
   → règles applicables (matrixRules)
   → modules de formation requis  (+ tronc commun ORI-001, SRI-001)
   → exigence PSFCE
   → autorisations visées et responsable de validation
   → compétences terrain à évaluer
```

Le Passeport numérique affiche ce profil requis, et l'état de formation de chaque employé est
dérivé de ses modules requis plutôt que du catalogue complet.

### Profil de visiteur de base (repli)

Lorsqu'un couple **BU + Poste** n'est pas encore couvert par une règle, la règle **R-000
« Visiteur / profil de base »** s'applique automatiquement :

- modules minimaux : `ORI-001`, `SRI-001`, `WHMIS-001`, `EMERG-001` ;
- aucun PSFCE ;
- autorisation limitée à un **accès site accompagné, sans tâche critique**, validée par le
  superviseur d'accueil.

Le passeport signale visiblement que ce repli est appliqué, pour que le PASS SST sache qu'une
règle de poste reste à créer. Aucun dossier ne se retrouve donc sans exigence SST définie.

### Statut des règles

| Plage | Statut | Provenance |
|---|---|---|
| `R-000` | Profil de base | Repli visiteur, appliqué aux postes non couverts |
| `R-001` → `R-028` | À valider | **Sourcées** : SSE-800, SSE-801, SSE-203, docs Enterprise / Locate |
| `R-029` → `R-048` | Proposé — à valider | **Non sourcées** : postes cités dans les documents Telecon mais sans règle documentée, dérivés par analogie avec les postes voisins de la même BU |

Les règles `R-029` à `R-048` sont une proposition de structure, pas une exigence validée.
Elles doivent être revues par le PASS SST avant toute utilisation opérationnelle.

Sources de la matrice : SSE-800 (orientation et formation), SSE-801 (jeunes et nouveaux
travailleurs), SSE-203 (supervision compétente), documents Enterprise Structured Cabling et
Livre du localisateur. Toutes les règles sont au statut **« À valider »** — la liste officielle
des postes RH par BU n'a pas été retrouvée dans les sources.

## Persistance des données

Les modifications faites dans l'application sont conservées dans le **stockage local du
navigateur** :

- progression des étapes PSFCE, création de PSFCE, observations de mentor ;
- autorisations de travail accordées ;
- formations marquées complétées ;
- préférences par utilisateur (dernier écran consulté) ;
- journal d'activité (écran *Journal d'activité*, accessible aux rôles encadrants).

Limites actuelles : les données restent **sur l'appareil et le navigateur utilisés**. Elles ne sont
ni synchronisées entre postes, ni partagées entre utilisateurs, ni sauvegardées. Le bouton
*Réinitialiser les données* (écran Journal d'activité) restaure le jeu de données initial.

Pour une persistance réelle et partagée, il faudra une base de données côté serveur (Netlify
Database/Blobs, SharePoint Lists, Dataverse ou équivalent) — voir la cible d'architecture.

## Statut

Prototype fonctionnel — données fictives, pas d'intégration live avec SharePoint, Microsoft Forms, QuickBase, eCompliance ou Power BI. Ces connecteurs sont documentés comme cibles d'architecture mais ne sont pas implémentés dans ce dépôt.
