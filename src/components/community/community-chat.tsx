"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { RefreshCw } from "lucide-react";

import { useWallet } from "@/contexts/wallet-context";
import { getCommunityMessages, sendCommunityMessage } from "@/lib/api/community.functions";
import { GAINE_TOKEN_IMAGE } from "@/data/gaine";
import { jupiterPortfolioUrl } from "@/lib/solana-wallet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ChatMessage = Awaited<ReturnType<typeof getCommunityMessages>>[number];

const POLL_MS = 12_000;

export function CommunityChat() {
  const { address, truncatedAddress, gaineBalance, balanceLoading } = useWallet();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const addressRef = useRef(address);
  addressRef.current = address;

  const canChat = Boolean(address) && (gaineBalance ?? 0) > 0;

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  const loadMessages = useCallback(async (showLoading = false) => {
    const walletAddress = addressRef.current;
    if (!walletAddress) {
      setLoading(false);
      return;
    }

    if (showLoading) setLoading(true);
    try {
      const rows = await getCommunityMessages({ data: { address: walletAddress } });
      setMessages(rows);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load messages.");
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!address) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    void (async () => {
      if (!cancelled) await loadMessages(true);
    })();

    const timer = window.setInterval(() => {
      void loadMessages(false);
    }, POLL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [address, loadMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  async function handleSend(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || sending || !canChat || !address) return;

    setSending(true);
    setError(null);
    try {
      await sendCommunityMessage({ data: { address, body: text } });
      setDraft("");
      await loadMessages(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send message.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-deep">
            Holder chat
          </span>
          <h2 className="font-serif text-3xl italic text-forest mt-2">The inner garden</h2>
        </div>
        <div className="text-right text-xs text-forest/55">
          <button
            type="button"
            aria-label="Refresh chat"
            onClick={() => void loadMessages(false)}
            className="inline-flex items-center gap-1 mb-1 text-forest/45 hover:text-forest"
          >
            <RefreshCw className="size-3" />
            Refresh
          </button>
          {address ? (
            <a
              href={jupiterPortfolioUrl(address)}
              target="_blank"
              rel="noopener noreferrer"
              className="block font-mono hover:text-gold underline-offset-2 hover:underline"
            >
              {truncatedAddress}
            </a>
          ) : (
            <p className="font-mono">{truncatedAddress}</p>
          )}
          <p>
            {(gaineBalance ?? 0).toLocaleString()} <span className="gaine-word gaine-word-sm">GAINE</span>
          </p>
        </div>
      </div>

      <div className="bg-white border border-forest/10 rounded-3xl overflow-hidden min-h-[420px] flex flex-col">
        <div ref={scrollRef} className="flex-1 px-4 py-5 md:px-6 overflow-y-auto max-h-[480px] space-y-4">
          {loading ? (
            <p className="text-sm text-forest/55 text-center py-16">Loading conversation…</p>
          ) : messages.length === 0 ? (
            <div className="text-center py-16 px-4">
              <img
                src={GAINE_TOKEN_IMAGE}
                alt=""
                className="size-12 rounded-full mx-auto mb-4 opacity-80"
                width={48}
                height={48}
              />
              <p className="font-serif text-xl italic text-forest mb-2">You&apos;re in</p>
              <p className="text-sm text-forest/60 leading-relaxed">
                Be the first to say hello to fellow GAINE holders.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <article
                key={message.id}
                className={`flex flex-col max-w-[85%] ${message.isMine ? "ml-auto items-end" : "items-start"}`}
              >
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-forest/45">
                    {message.isMine ? "You" : message.author}
                  </span>
                  <time className="text-[10px] text-forest/35">
                    {new Date(message.createdAt).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </time>
                </div>
                <p
                  className={`text-sm leading-relaxed px-4 py-3 rounded-2xl whitespace-pre-wrap break-words ${
                    message.isMine
                      ? "bg-forest text-earth rounded-br-md"
                      : "bg-bone/70 text-forest border border-forest/10 rounded-bl-md"
                  }`}
                >
                  {message.body}
                </p>
              </article>
            ))
          )}
        </div>

        <form onSubmit={(e) => void handleSend(e)} className="border-t border-forest/10 px-4 py-4 bg-bone/30">
          {error ? <p className="text-sm text-red-700 mb-3">{error}</p> : null}
          <div className="flex gap-2">
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={canChat ? "Message the community…" : "Connect a GAINE wallet to send…"}
              disabled={!canChat || sending || balanceLoading}
              maxLength={2000}
              className="border-forest/10 bg-white"
            />
            <Button
              type="submit"
              disabled={!canChat || sending || balanceLoading || !draft.trim()}
              className="bg-forest text-earth shrink-0"
            >
              {sending ? "…" : "Send"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
