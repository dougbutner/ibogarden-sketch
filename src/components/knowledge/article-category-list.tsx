"use client";

import { useState } from "react";
import type { ArticleCategory } from "@/data/knowledge-iboga";

const INITIAL = 3;
const LOAD_STEP = 5;

function ArticleCategoryBox({ category }: { category: ArticleCategory }) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(INITIAL);
  const total = category.articles.length;
  const shown = category.articles.slice(0, visible);
  const canLoadMore = visible < total;
  const atMax = visible >= total;

  function toggle() {
    setOpen((o) => {
      if (o) {
        setVisible(INITIAL);
      }
      return !o;
    });
  }

  function loadMore() {
    setVisible((v) => Math.min(v + LOAD_STEP, total));
  }

  return (
    <div className="rounded-2xl border border-forest/10 bg-white overflow-hidden transition-colors hover:border-gold/30">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="w-full text-left p-5 md:p-6 flex justify-between items-start gap-4"
      >
        <div>
          <h3 className="font-serif text-2xl italic text-forest">{category.title}</h3>
          <p className="text-sm text-forest/60 mt-2 leading-relaxed">{category.header}</p>
        </div>
        <span
          className={`text-gold text-xl shrink-0 transition-transform duration-300 ${open ? "rotate-90" : ""}`}
          aria-hidden
        >
          →
        </span>
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="px-5 md:px-6 pb-5 md:pb-6 border-t border-forest/10">
            <ul className="space-y-3 pt-4">
              {shown.map((article, i) => (
                <li key={`${article.href}-${i}`}>
                  <a
                    href={article.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block rounded-xl border border-forest/8 bg-bone/40 px-4 py-3 hover:border-gold/40 transition-colors"
                  >
                    <span className="font-medium text-forest text-sm group-hover:text-gold-deep transition-colors">
                      {article.title}
                    </span>
                    <p className="text-sm text-forest/65 mt-2 leading-relaxed">{article.description}</p>
                    {article.source && (
                      <span className="block text-[11px] text-forest/45 mt-2 uppercase tracking-wider">
                        {article.source}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex justify-end mt-4 min-h-[1.25rem]">
              {open && canLoadMore && (
                <button
                  type="button"
                  onClick={loadMore}
                  className="text-[11px] text-forest/45 uppercase tracking-widest hover:text-gold transition-colors animate-pulse hover:animate-none"
                >
                  Load more
                </button>
              )}
              {open && atMax && total > INITIAL && (
                <span className="text-[10px] text-forest/35 uppercase tracking-widest">All {total} links</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ArticleCategoryList({ categories }: { categories: ArticleCategory[] }) {
  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <ArticleCategoryBox key={category.id} category={category} />
      ))}
    </div>
  );
}
