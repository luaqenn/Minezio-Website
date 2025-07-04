"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useWebsiteHelpCenterService, HelpCenterCategory, HelpCenterFAQ } from "@/lib/services/helpcenter.service";
import CubeIcon from "@/assets/icons/minecraft/CubeIcon";
import DiscordIcon from "@/assets/icons/social/DiscordIcon";
import LexicalViewer from "@/components/LexicalViewer";
import * as LucideIcons from "lucide-react";
import { HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";

// Kategori kartı için stil
const cardClass = "bg-white/5 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl shadow-lg border border-white/10 dark:border-gray-700/50 overflow-hidden flex flex-col items-center justify-between h-full transition-shadow hover:shadow-xl cursor-pointer";
const cardHeaderClass = "flex flex-col items-center gap-2 pt-6 pb-2 border-none bg-transparent w-full";
const cardBodyClass = "flex justify-center pb-4 w-full";

// FAQ kartı için stil
const faqCardClass = "bg-white/5 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl shadow-lg border border-white/10 dark:border-gray-700/50 overflow-hidden transition-shadow hover:shadow-xl cursor-pointer";
const faqHeaderClass = "flex flex-row items-center justify-between px-6 py-4 select-none cursor-pointer w-full";
const faqBodyClass = "px-6 pb-6 pt-0 animate-fade-in w-full";

function FAQAccordion({ faqs }: { faqs: HelpCenterFAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div className="flex flex-col gap-4 w-full">
      {faqs.map((faq, i) => (
        <div key={faq.id} className={faqCardClass}>
          <div onClick={() => setOpenIndex(openIndex === i ? null : i)} className={faqHeaderClass}>
            <div className="flex items-center gap-2 w-full">
              <Badge variant="secondary">SSS</Badge>
              <span className="truncate max-w-xs md:max-w-md">
                <LexicalViewer content={faq.question} className="inline !mb-0 !text-base !font-medium !text-foreground" />
              </span>
            </div>
            <Button variant="ghost" size="icon" tabIndex={-1} aria-label="Toggle" className="ml-2">
              <span className={`transition-transform ${openIndex === i ? 'rotate-180' : ''}`}>▼</span>
            </Button>
          </div>
          {openIndex === i && (
            <div className={faqBodyClass}>
              <LexicalViewer content={faq.answer} className="!text-muted-foreground !text-base" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const renderIcon = (iconName: string) => {
  if (!iconName) {
    return <HelpCircle className="w-8 h-8 text-slate-400" />;
  }
  const IconComponent = (LucideIcons as any)[iconName];
  if (IconComponent) {
    return React.createElement(IconComponent, { className: "w-8 h-8 text-cyan-400" });
  }
  return <HelpCircle className="w-8 h-8 text-slate-400" />;
};

export default function HelpCenterPage() {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<HelpCenterCategory[]>([]);
  const [faqs, setFaqs] = useState<HelpCenterFAQ[]>([]);
  const { getHelpCenter } = useWebsiteHelpCenterService();
  const router = useRouter();

  useEffect(() => {
    // Demo: API'den kategori ve SSS çek
    getHelpCenter({ websiteId: "default", query: { activeOnly: true, faqOnly: true } })
      .then(data => {
        setCategories(data.categories || []);
        setFaqs(data.faqs || []);
      });
  }, []);

  // Kategori ikonları örnek
  const icons = [<CubeIcon key="cube" />, <DiscordIcon key="discord" />, <span key="cart" className="text-2xl">🛒</span>];

  return (
    <section className="max-w-3xl mx-auto py-10 px-2 md:px-0">
      {/* Başlık ve arama */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Yardım Merkezi</h1>
          <p className="text-muted-foreground max-w-lg">Sorunun mu var? SSS'ye göz at veya kategorilerden birini seç. Aradığını bulamazsan destek talebi oluşturabilirsin.</p>
        </div>
        <Input
          className="w-full md:w-80"
          placeholder="Sorunu ara..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {/* Kategoriler */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={cardClass + " group hover:scale-[1.03] transition-transform"}
            onClick={() => router.push(`/help/${cat.id}`)}
            tabIndex={0}
            role="button"
            onKeyDown={e => { if (e.key === "Enter" || e.key === " ") router.push(`/help/${cat.id}`); }}
            style={{ cursor: "pointer" }}
          >
            <div className={cardHeaderClass}>
              <span className="mb-2">{renderIcon(cat.icon)}</span>
              <span className="text-lg text-center font-semibold">{cat.name}</span>
              <span className="text-center text-muted-foreground text-sm">{cat.description}</span>
            </div>
            <div className={cardBodyClass}>
              <span className="text-primary font-medium group-hover:underline">Kategoriyi Gör</span>
            </div>
          </div>
        ))}
      </div>
      <Separator className="mb-8" />
      {/* SSS */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-4">Sıkça Sorulan Sorular</h2>
        <FAQAccordion faqs={faqs.filter(faq => (faq.question.root?.children?.[0]?.text || "").toLowerCase().includes(search.toLowerCase()))} />
      </div>
    </section>
  );
}
