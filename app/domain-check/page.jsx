"use client";
import { useState } from "react";

export default function DomainChecker() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkDomain = async () => {
    setLoading(true);
    setResult(null);

    const res = await fetch("/api/check-domain", {
      method: "POST",
      body: JSON.stringify({ domain }),
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-3">Check .ke Domain Availability</h2>

      <input
        type="text"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        placeholder="Enter a .ke domain (e.g. johndoe.ke)"
        className="w-full border rounded p-2 mb-3"
      />

      <button
        onClick={checkDomain}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Checking..." : "Check"}
      </button>

      {result && (
        <div className="mt-4 p-3 border rounded">
          {result.available ? (
            <div>
              <p className="text-green-600 font-semibold">
                ✅ {result.domain} is available!
              </p>
              <p className="mt-2">You can buy it from:</p>
              <ul className="list-disc ml-5 mt-1">
                <li>
                  <a
                    href="https://truehost.co.ke/domain-registration/"
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    Truehost Kenya
                  </a>
                </li>
                <li>
                  <a
                    href="https://domains.safaricom.co.ke/"
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    Safaricom Domains
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.kenyawebexperts.co.ke/domain-registration"
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    Kenya Web Experts
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.sasahost.co.ke/domain-registration/"
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    Sasahost
                  </a>
                </li>
              </ul>
            </div>
          ) : (
            <p className="text-red-600 font-semibold">
              ❌ {result.domain} is already taken.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
