// Node.js 18+ has global fetch
type Event = {
  queryStringParameters?: { [k: string]: string | undefined };
};

export const handler = async (event: Event) => {
  const q = event.queryStringParameters || {};
  const instanceType = (q.instanceType || "").trim();
  const region = (q.region || "").trim();
  const hours = Number(q.hours || "0");

  if (!instanceType || !region || !Number.isFinite(hours) || hours <= 0) {
    return resp(400, { error: "パラメータが不正です（instanceType, region, hours を指定）" });
  }

  // Simple price table (USD/hour). Extend as needed.
  const pricesUSD: Record<string, number> = {
    "t2.micro": 0.0116,
    "t3.small": 0.0208,
  };
  const pricePerHourUSD = pricesUSD[instanceType];
  if (!pricePerHourUSD) return resp(400, { error: "未対応のインスタンスタイプです" });

  const costUSD = pricePerHourUSD * hours;

  // Get USD->JPY rate
  let rate = 1;
  try {
    const r = await fetch("https://api.exchangerate.host/convert?from=USD&to=JPY");
    const j = await r.json();
    rate = j?.info?.rate ? Number(j.info.rate) : 1;
  } catch {
    // fallback rate=1 on error
  }
  const costJPY = Math.round(costUSD * rate);

  return resp(200, {
    instanceType, region, hours,
    costUSD: Number(costUSD.toFixed(4)),
    costJPY
  });
};

function resp(statusCode: number, body: unknown) {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*"
    },
    body: JSON.stringify(body),
  };
}
