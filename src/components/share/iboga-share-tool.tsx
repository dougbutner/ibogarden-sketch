"use client";

import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";

const GITHUB_REPO = "https://github.com/dougbutner/ibogarden";

const SHARE_MESSAGES = [
  {
    id: "learn",
    label: "Invite to learn",
    text: "Iboga is a sacred root from Gabon with deep healing potential. Start with the curated knowledge library at ibo.garden — traditions, science, and ethical sourcing.",
  },
  {
    id: "story",
    label: "Share a story hook",
    text: "There's a fast layer of receptor binding and a slow layer of structural change. Iboga meets people at the root of suffering. Explore responsibly at ibo.garden.",
  },
  {
    id: "gabon",
    label: "Gabon-first framing",
    text: "Ethical Iboga respects Gabonese soil and Bwiti lineages. ibo.garden maps knowledge, sourcing, and reciprocity — Nagoya-aligned and decree-aware.",
  },
] as const;

function buildInviteUrl(origin: string, messageId: string) {
  const url = new URL("/learn", origin);
  url.searchParams.set("ref", "share");
  url.searchParams.set("m", messageId);
  return url.toString();
}

export function IbogaShareTool() {
  const [activeMessage, setActiveMessage] = useState<(typeof SHARE_MESSAGES)[number]["id"]>("learn");
  const [copied, setCopied] = useState(false);
  const [note, setNote] = useState("");

  const origin = typeof window !== "undefined" ? window.location.origin : "https://ibo.garden";
  const message = SHARE_MESSAGES.find((item) => item.id === activeMessage) ?? SHARE_MESSAGES[0];
  const inviteUrl = useMemo(() => buildInviteUrl(origin, activeMessage), [origin, activeMessage]);
  const shareText = note.trim() ? `${message.text}\n\n${note.trim()}` : message.text;
  const shareTitle = "Learn about Iboga — ibo.garden";

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${inviteUrl}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  }

  async function handleNativeShare() {
    if (!navigator.share) return;
    try {
      await navigator.share({ title: shareTitle, text: shareText, url: inviteUrl });
    } catch {
      /* user dismissed or API unavailable */
    }
  }

  const buttonClass =
    "inline-flex items-center justify-center min-w-[7.5rem] px-4 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest border border-forest/15 bg-white text-forest hover:border-gold hover:text-gold transition-colors";

  return (
    <div className="space-y-10">
      <div className="bg-white border border-forest/10 rounded-3xl p-8 md:p-10">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-deep">Choose a message</span>
        <div className="mt-5 flex flex-wrap gap-2">
          {SHARE_MESSAGES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveMessage(item.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeMessage === item.id
                  ? "bg-forest text-earth"
                  : "bg-bone text-forest/70 hover:text-forest border border-forest/10"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <p className="mt-8 text-sm text-forest/75 leading-relaxed">{shareText}</p>

        <label className="block mt-8">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-deep">
            Personal note (optional)
          </span>
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a line about why you're sharing this…"
            className="mt-3 w-full bg-bone border border-forest/10 rounded-xl px-4 py-3 text-sm text-forest placeholder:text-forest/40 focus:outline-none focus:border-gold"
          />
        </label>

        <div className="mt-8 p-4 bg-earth rounded-xl border border-forest/10">
          <p className="text-[10px] uppercase tracking-widest text-forest/45 mb-2">Invite link</p>
          <p className="font-mono text-sm text-forest break-all">{inviteUrl}</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={handleCopyLink} className={buttonClass}>
            {copied ? "Copied!" : "Copy invite"}
          </button>
          {typeof navigator !== "undefined" && "share" in navigator && (
            <button type="button" onClick={handleNativeShare} className={buttonClass}>
              Share…
            </button>
          )}
          <Link to="/learn" className={buttonClass}>
            Open library →
          </Link>
        </div>
      </div>

      <div className="bg-white border border-forest/10 rounded-3xl p-8 md:p-10">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-deep">
          Share via
        </span>
        <p className="mt-3 text-sm text-forest/65 mb-6">
          Powered by{" "}
          <a
            href="https://github.com/nyan-left/react-share"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold underline underline-offset-2 hover:text-gold-deep"
          >
            react-share
          </a>
          . Each button opens your platform with the invite link to the knowledge library.
        </p>
        <div className="flex flex-wrap gap-3">
          <TwitterShareButton url={inviteUrl} title={shareText} className={buttonClass}>
            X / Twitter
          </TwitterShareButton>
          <FacebookShareButton url={inviteUrl} hashtag="#Iboga" className={buttonClass}>
            Facebook
          </FacebookShareButton>
          <LinkedinShareButton url={inviteUrl} title={shareTitle} summary={shareText} className={buttonClass}>
            LinkedIn
          </LinkedinShareButton>
          <WhatsappShareButton url={inviteUrl} title={shareText} separator=" — " className={buttonClass}>
            WhatsApp
          </WhatsappShareButton>
          <TelegramShareButton url={inviteUrl} title={shareText} className={buttonClass}>
            Telegram
          </TelegramShareButton>
          <RedditShareButton url={inviteUrl} title={shareTitle} className={buttonClass}>
            Reddit
          </RedditShareButton>
          <EmailShareButton url={inviteUrl} subject={shareTitle} body={shareText} className={buttonClass}>
            Email
          </EmailShareButton>
        </div>
      </div>

      <div className="bg-forest text-earth rounded-3xl p-8 md:p-10 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">Open source</span>
          <h2 className="font-serif text-3xl italic mt-3 mb-4">Help grow the knowledge garden</h2>
          <p className="text-earth/75 text-sm leading-relaxed">
            Suggest articles, fix links, or propose new learning paths on GitHub. Community contributions keep the
            library accurate and respectful of Gabonese traditions.
          </p>
        </div>
        <div className="md:text-right">
          <a
            href={GITHUB_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gold text-forest px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gold/90 transition-colors"
          >
            Contribute on GitHub →
          </a>
        </div>
      </div>
    </div>
  );
}
