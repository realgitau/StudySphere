import whois from "whois-json";

export async function POST(req) {
  try {
    const { domain } = await req.json();

    // Enforce .ke domains only
    if (!domain.endsWith(".ke")) {
      return new Response(
        JSON.stringify({ error: "Only .ke domains are allowed" }),
        { status: 400 }
      );
    }

    // Run WHOIS lookup
    const data = await whois(domain);

    let available = false;

    // Heuristic: if no registrar info / status shows not registered → assume available
    if (!data.registrar || data.status?.toLowerCase().includes("not registered")) {
      available = true;
    }

    // Some .ke WHOIS servers return "No Object Found" when free
    if (JSON.stringify(data).toLowerCase().includes("no object found")) {
      available = true;
    }

    return new Response(
      JSON.stringify({ domain, available, whois: data }),
      { status: 200 }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to lookup domain", details: err.message }),
      { status: 500 }
    );
  }
}
