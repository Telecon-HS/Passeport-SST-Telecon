import { getStore } from "@netlify/blobs";

/**
 * État partagé du prototype Passeport SST.
 *
 * GET  /api/state  → renvoie l'état courant (ou {} si aucun)
 * PUT  /api/state  → remplace l'état courant
 *
 * ⚠️ Aucune authentification côté serveur : toute personne pouvant atteindre
 * cette fonction peut lire et écrire l'état. Acceptable uniquement parce que
 * le prototype ne contient que des données fictives. Un déploiement réel doit
 * vérifier l'identité (Entra ID / Auth0) et filtrer par périmètre AVANT de
 * répondre.
 */

const STORE = "passeport-sst";
const KEY = "shared-state";

export default async (request: Request): Promise<Response> => {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  };

  try {
    const store = getStore(STORE);

    if (request.method === "GET") {
      const data = await store.get(KEY, { type: "json" });
      return new Response(JSON.stringify({ ok: true, state: data ?? null }), { headers });
    }

    if (request.method === "PUT") {
      const body = await request.json();
      await store.setJSON(KEY, body);
      return new Response(JSON.stringify({ ok: true }), { headers });
    }

    if (request.method === "DELETE") {
      await store.delete(KEY);
      return new Response(JSON.stringify({ ok: true }), { headers });
    }

    return new Response(JSON.stringify({ ok: false, error: "Méthode non supportée" }), {
      status: 405,
      headers,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ ok: false, error: (error as Error).message }),
      { status: 500, headers }
    );
  }
};

export const config = { path: "/api/state" };
