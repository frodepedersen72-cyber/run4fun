const APP_URL = "https://frodepedersen72-cyber.github.io/run4fun/";
const ALLOWED_ORIGIN = "https://frodepedersen72-cyber.github.io";

function cors(origin) {
  return {
    "Access-Control-Allow-Origin": origin === ALLOWED_ORIGIN ? origin : ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Vary": "Origin",
  };
}

function json(data, status = 200, origin = ALLOWED_ORIGIN) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...cors(origin) },
  });
}

async function exchangeToken(env, params) {
  const body = new URLSearchParams({
    client_id: String(env.Stravaclientid),
    client_secret: env.Stravaclientsecret,
    ...params,
  });

  const response = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Token exchange failed");
  return result;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || ALLOWED_ORIGIN;

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors(origin) });
    }

    try {
      if (url.pathname === "/") {
        return new Response("Run4Fun Strava bridge is running", {
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      }

      if (url.pathname === "/login") {
        const state = url.searchParams.get("state") || crypto.randomUUID();
        const callback = `${url.origin}/callback`;
        const authorize = new URL("https://www.strava.com/oauth/authorize");
        authorize.searchParams.set("client_id", String(env.Stravaclientid));
        authorize.searchParams.set("redirect_uri", callback);
        authorize.searchParams.set("response_type", "code");
        authorize.searchParams.set("approval_prompt", "auto");
        authorize.searchParams.set("scope", "read,activity:read_all");
        authorize.searchParams.set("state", state);
        return Response.redirect(authorize.toString(), 302);
      }

      if (url.pathname === "/callback") {
        const error = url.searchParams.get("error");
        const state = url.searchParams.get("state") || "";
        if (error) {
          return Response.redirect(`${APP_URL}#strava_error=${encodeURIComponent(error)}&state=${encodeURIComponent(state)}`, 302);
        }
        const code = url.searchParams.get("code");
        if (!code) return new Response("Missing authorization code", { status: 400 });

        const tokens = await exchangeToken(env, {
          code,
          grant_type: "authorization_code",
        });

        const payload = btoa(JSON.stringify({
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_at: tokens.expires_at,
          athlete: tokens.athlete ? { id: tokens.athlete.id, firstname: tokens.athlete.firstname } : null,
        }));

        return Response.redirect(`${APP_URL}#strava=${encodeURIComponent(payload)}&state=${encodeURIComponent(state)}`, 302);
      }

      if (url.pathname === "/refresh" && request.method === "POST") {
        const input = await request.json();
        if (!input.refresh_token) return json({ error: "Missing refresh token" }, 400, origin);
        const tokens = await exchangeToken(env, {
          refresh_token: input.refresh_token,
          grant_type: "refresh_token",
        });
        return json({
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_at: tokens.expires_at,
        }, 200, origin);
      }

      if (url.pathname === "/activities") {
        const auth = request.headers.get("Authorization");
        if (!auth?.startsWith("Bearer ")) return json({ error: "Missing access token" }, 401, origin);
        const page = url.searchParams.get("page") || "1";
        const perPage = url.searchParams.get("per_page") || "30";
        const response = await fetch(`https://www.strava.com/api/v3/athlete/activities?page=${page}&per_page=${perPage}`, {
          headers: { Authorization: auth },
        });
        const result = await response.json();
        return json(result, response.status, origin);
      }

      return json({ error: "Not found" }, 404, origin);
    } catch (error) {
      return json({ error: error.message || "Unexpected error" }, 500, origin);
    }
  },
};
