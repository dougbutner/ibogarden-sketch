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

import { useLocale } from "@/contexts/locale-context";

const GITHUB_REPO = "https://github.com/dougbutner/ibogarden";

const MESSAGE_IDS = ["learn", "story", "gabon"] as const;

function buildInviteUrl(origin: string, messageId: string) {
  const url = new URL("/learn", origin);
  url.searchParams.set("ref", "share");
  url.searchParams.set("m", messageId);
  return url.toString();
}

export function IbogaShareTool() {
  const { t } = useLocale();
  const [activeMessage, setActiveMessage] = useState<(typeof MESSAGE_IDS)[number]>("learn");
  const [copied, setCopied] = useState(false);
  const [note, setNote] = useState("");

  const messages = useMemo(() => {
    const labels: Record<(typeof MESSAGE_IDS)[number], string> = {
      learn: t("shareTool.msgLabelLearn"),
      story: t("shareTool.msgLabelStory"),
      gabon: t("shareTool.msgLabelGabon"),
    };
    const texts: Record<(typeof MESSAGE_IDS)[number], string> = {
      learn: t("shareTool.msg1"),
      story: t("shareTool.msg2"),
      gabon: t("shareTool.msg3"),
    };
    return MESSAGE_IDS.map((id) => ({ id, label: labels[id], text: texts[id] }));
  }, [t]);

  const origin = typeof window !== "undefined" ? window.location.origin : "https://ibo.garden";
  const message = messages.find((item) => item.id === activeMessage) ?? messages[0];
  const inviteUrl = useMemo(() => buildInviteUrl(origin, activeMessage), [origin, activeMessage]);
  const shareText = note.trim() ? `${message.text}\n\n${note.trim()}` : message.text;
  const shareTitle = t("shareTool.nativeShareTitle");

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
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-deep">
          {t("shareTool.chooseMessage")}
        </span>
        <div className="mt-5 flex flex-wrap gap-2">
          {messages.map((item) => (
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
            {t("shareTool.personalNote")}
          </span>
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t("shareTool.notePlaceholder")}
            className="mt-3 w-full bg-bone border border-forest/10 rounded-xl px-4 py-3 text-sm text-forest placeholder:text-forest/40 focus:outline-none focus:border-gold"
          />
        </label>

        <div className="mt-8 p-4 bg-earth rounded-xl border border-forest/10">
          <p className="text-[10px] uppercase tracking-widest text-forest/45 mb-2">{t("shareTool.inviteLink")}</p>
          <p className="font-mono text-sm text-forest break-all">{inviteUrl}</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={handleCopyLink} className={buttonClass}>
            {copied ? t("common.copied") : t("shareTool.copyInvite")}
          </button>
          {typeof navigator !== "undefined" && "share" in navigator && (
            <button type="button" onClick={handleNativeShare} className={buttonClass}>
              {t("shareTool.shareEllipsis")}
            </button>
          )}
          <Link to="/learn" className={buttonClass}>
            {t("shareTool.openLibrary")} →
          </Link>
        </div>
      </div>

      <div className="bg-white border border-forest/10 rounded-3xl p-8 md:p-10">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-deep">
          {t("shareTool.shareVia")}
        </span>
        <p className="mt-3 text-sm text-forest/65 mb-6">{t("shareTool.poweredBy")}</p>
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
          <WhatsappShareButton url={inviteUrl} title={shareText} separator=" | " className={buttonClass}>
            WhatsApp
          </WhatsappShareButton>
          <TelegramShareButton url={inviteUrl} title={shareText} className={buttonClass}>
            Telegram
          </TelegramShareButton>
          <RedditShareButton url={inviteUrl} title={shareTitle} className={buttonClass}>
            Reddit
          </RedditShareButton>
          <EmailShareButton url={inviteUrl} subject={t("shareTool.emailSubject")} body={shareText} className={buttonClass}>
            Email
          </EmailShareButton>
        </div>
      </div>

      <div className="bg-forest text-earth rounded-3xl p-8 md:p-10 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
            {t("shareTool.openSourceEyebrow")}
          </span>
          <h2 className="font-serif text-3xl italic mt-3 mb-4">{t("shareTool.openSourceTitle")}</h2>
          <p className="text-earth/75 text-sm leading-relaxed">{t("shareTool.openSourceBody")}</p>
        </div>
        <div className="md:text-right">
          <a
            href={GITHUB_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gold text-forest px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gold/90 transition-colors"
          >
            {t("shareTool.contributeGithub")} →
          </a>
        </div>
      </div>
    </div>
  );
}
