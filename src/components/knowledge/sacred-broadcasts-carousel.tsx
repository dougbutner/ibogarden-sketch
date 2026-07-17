"use client";

import { useState } from "react";
import type { VideoPlaylist } from "@/data/knowledge-iboga";
import { useLocale } from "@/contexts/locale-context";
import heroForest from "@/assets/hero-forest.jpg";
import {
  PLAYLIST_IMAGES,
  PlaylistEmbedDialog,
  parseYouTubePlaylistEmbed,
} from "@/components/knowledge/video-journeys";

type EmbedTarget = {
  title: string;
  src: string;
};

export function SacredBroadcastsCarousel({ playlists }: { playlists: VideoPlaylist[] }) {
  const { t } = useLocale();
  const [embed, setEmbed] = useState<EmbedTarget | null>(null);

  const taglines: Record<string, string> = {
    "about-iboga": t("knowledgeUi.taglineAbout"),
    "iboga-facilitators": t("knowledgeUi.taglineFacilitators"),
    "healing-stories": t("knowledgeUi.taglineHealing"),
  };

  function openPlaylist(playlist: VideoPlaylist) {
    if (!playlist.featuredPlaylist) return;
    const src = parseYouTubePlaylistEmbed(playlist.featuredPlaylist.href);
    if (!src) return;
    setEmbed({
      title: playlist.featuredPlaylist.title,
      src,
    });
  }

  return (
    <>
      <div className="flex gap-6 overflow-x-auto px-6 pb-6 snap-x no-scrollbar">
        {playlists.map((playlist, index) => {
          const image = PLAYLIST_IMAGES[playlist.id] ?? heroForest;
          const tagline = taglines[playlist.id] ?? "";
          return (
            <button
              key={playlist.id}
              type="button"
              onClick={() => openPlaylist(playlist)}
              className="snap-start shrink-0 w-[min(85vw,22rem)] text-left group"
            >
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-4">
                <img
                  src={image}
                  alt=""
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-earth">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-gold mb-1">
                    {t("knowledgeUi.playlist")} {index + 1}
                  </div>
                  <div className="font-serif text-2xl italic">{playlist.title}</div>
                </div>
              </div>
              <p className="text-sm text-earth/60">{tagline}</p>
            </button>
          );
        })}
      </div>

      <PlaylistEmbedDialog
        embed={embed}
        onClose={() => setEmbed(null)}
        embeddedLabel={t("knowledgeUi.embeddedPlaylist")}
      />
    </>
  );
}
