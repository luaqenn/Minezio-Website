"use client";

import { useState, useContext } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Loading from "@/components/loading";
import { AuthContext } from "@/lib/context/auth.context";
import { useRedeemService } from "@/lib/services/redeem.service";
import type { RedeemCodeResponse } from "@/lib/services/redeem.service";

export default function RedeemPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | RedeemCodeResponse>(null);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useContext(AuthContext);
  const { redeemCode } = useRedeemService();

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await redeemCode(code);
      setResult(res);
    } catch (err: any) {
      setError(err?.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white/5 dark:bg-gray-800/20 rounded-2xl shadow-lg border border-white/10 dark:border-gray-700/50">
      <h1 className="text-2xl font-bold mb-4 text-center">Redeem Kodu Kullan</h1>
      <form onSubmit={handleRedeem} className="space-y-4">
        <Input
          placeholder="Redeem kodunu giriniz"
          value={code}
          onChange={e => setCode(e.target.value)}
          required
          disabled={loading}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={loading || !isAuthenticated || !code.trim()}
        >
          {loading ? "İşleniyor..." : "Kodu Kullan"}
        </Button>
      </form>
      {loading && <Loading show={true} message="Kod kontrol ediliyor..." />}
      {result && (
        <Alert variant={result.bonus || (result.products && result.products.length) ? "default" : "destructive"} className="mt-6">
          <AlertTitle>{result.bonus || (result.products && result.products.length) ? "Başarılı!" : "Hata!"}</AlertTitle>
          <AlertDescription>
            {result.message && <div className="mb-2">{result.message}</div>}
            {result.bonus && <div>Bakiye Bonusu: <b>{result.bonus}</b></div>}
            {result.products && result.products.length > 0 && (
              <div>
                Ürünler:
                <ul className="list-disc ml-5">
                  {result.products.map((product) => (
                    <li key={product.id}>{product.name} <span className="text-xs text-gray-400">({product.id})</span></li>
                  ))}
                </ul>
              </div>
            )}
            {!result.bonus && (!result.products || result.products.length === 0) && (
              <span>Herhangi bir bonus veya ürün bulunamadı.</span>
            )}
          </AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertTitle>Hata!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
