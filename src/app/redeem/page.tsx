"use client";

import { useState, useContext } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Loading from "@/components/loading";
import { AuthContext } from "@/lib/context/auth.context";
import { useRedeemService } from "@/lib/services/redeem.service";
import type { RedeemCodeResponse } from "@/lib/services/redeem.service";
import { FaGift, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

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
    <div className="max-w-md mx-auto mt-16 p-0 relative">
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-900 rounded-full shadow-lg p-4 border-4 border-blue-500 dark:border-blue-700 z-20 animate-bounce">
        <FaGift className="text-blue-600 dark:text-blue-400 text-4xl" />
      </div>
      <div className="relative bg-gradient-to-br from-blue-600/80 via-blue-400/80 to-purple-500/80 dark:from-blue-900/80 dark:via-blue-800/80 dark:to-purple-900/80 rounded-3xl shadow-2xl border border-white/10 dark:border-gray-700/50 overflow-hidden animate-fade-in z-10">
        <div className="pt-16 pb-8 px-8 flex flex-col items-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 text-center drop-shadow">Hediye Kodu Kullan</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-center text-base">Kredi veya ürün kazanmak için elinizdeki hediye kodunu girin.</p>
          <form onSubmit={handleRedeem} className="w-full flex flex-col gap-4 animate-fade-in">
            <Input
              placeholder="Hediye kodunu giriniz"
              value={code}
              onChange={e => setCode(e.target.value)}
              required
              disabled={loading}
              className="text-lg px-4 py-3 rounded-xl shadow"
            />
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 text-white font-bold py-3 rounded-xl text-lg shadow-lg transition-all duration-200"
              disabled={loading || !isAuthenticated || !code.trim()}
              size="lg"
            >
              {loading ? "İşleniyor..." : "Kodu Kullan"}
            </Button>
          </form>
          {loading && <Loading show={true} message="Kod kontrol ediliyor..." />}
          {result && (
            <Alert variant={result.bonus || (result.products && result.products.length) ? "default" : "destructive"} className="mt-8 w-full animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                {result.bonus || (result.products && result.products.length) ? (
                  <FaCheckCircle className="text-green-500 text-xl" />
                ) : (
                  <FaTimesCircle className="text-red-500 text-xl" />
                )}
                <AlertTitle className="text-lg font-bold">
                  {result.bonus || (result.products && result.products.length) ? "Başarılı!" : "Hata!"}
                </AlertTitle>
              </div>
              <AlertDescription>
                {result.message && <div className="mb-2">{result.message}</div>}
                {result.bonus && <div className="mb-1">Bakiye Bonusu: <b>{result.bonus}</b></div>}
                {result.products && result.products.length > 0 && (
                  <div className="mb-1">
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
            <Alert variant="destructive" className="mt-8 w-full animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <FaTimesCircle className="text-red-500 text-xl" />
                <AlertTitle className="text-lg font-bold">Hata!</AlertTitle>
              </div>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
