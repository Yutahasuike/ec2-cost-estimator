import { useEffect, useState } from "react";

type Outputs = {
  custom?: { ec2CostApiUrl?: string };
};

export default function App() {
  const [apiBase, setApiBase] = useState<string>("");
  const [instanceType, setInstanceType] = useState("t2.micro");
  const [region, setRegion] = useState("ap-northeast-1");
  const [hours, setHours] = useState(5);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Try to load amplify_outputs.json produced by Amplify CI/CD.
    fetch("/amplify_outputs.json")
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((o: Outputs) => {
        const url = o?.custom?.ec2CostApiUrl;
        if (url) setApiBase(url);
        else setError("amplify_outputs.json に API エンドポイントが見つかりませんでした");
      })
      .catch(() => {
        setError("amplify_outputs.json を読み込めませんでした（ホスティング後に解消します）");
      });
  }, []);

  const calc = async () => {
    setError(null);
    setResult(null);
    try {
      if (!apiBase) throw new Error("APIエンドポイント未設定（デプロイ後に自動設定されます）");
      const url = `${apiBase}/ec2cost?instanceType=${encodeURIComponent(instanceType)}&region=${encodeURIComponent(region)}&hours=${hours}`;
      const res = await fetch(url);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "API Error");
      setResult(json);
    } catch (e: any) {
      setError(e?.message || "失敗しました");
    }
  };

  return (
    <div style={{ margin: "2rem", fontSize: "1.1rem", maxWidth: 720 }}>
      <h1>EC2コスト見積もりツール</h1>

      <div>
        <label>インスタンスタイプ：
          <input value={instanceType} onChange={e=>setInstanceType(e.target.value)} placeholder="例: t2.micro" />
        </label>
      </div>
      <div>
        <label>リージョン：
          <input value={region} onChange={e=>setRegion(e.target.value)} placeholder="例: ap-northeast-1" />
        </label>
      </div>
      <div>
        <label>利用時間（時間）：
          <input type="number" min={1} value={hours} onChange={e=>setHours(Number(e.target.value))} />
        </label>
      </div>

      <button onClick={calc} style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>
        コストを計算
      </button>

      {!apiBase && (
        <p style={{ marginTop: "1rem", color: "#555" }}>
          ※ 初回は <code>amplify_outputs.json</code> が無いためローカルで実行しても API は呼べません。Amplify Hosting へデプロイ後に自動設定されます。
        </p>
      )}

      {error && <p style={{ color: "red" }}>エラー：{error}</p>}
      {result && (
        <div style={{ marginTop: "2rem", padding: "1rem", border: "1px solid #ccc" }}>
          <h2>結果</h2>
          <p>選択したインスタンスタイプ：{result.instanceType}</p>
          <p>リージョン：{result.region}</p>
          <p>利用時間：{result.hours} 時間</p>
          <p><b>推定コスト：{Number(result.costJPY).toLocaleString("ja-JP")} 円</b>（USD {Number(result.costUSD).toFixed(2)}）</p>
        </div>
      )}
    </div>
  );
}
