"use client";

import { useState } from "react";
import type { VideoPlaylist } from "@/data/knowledge-iboga";
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

const PLAYLIST_TAGLINES: Record<string, string> = {
  "about-iboga": "Origins, science, and the Bwiti tradition.",
  "iboga-facilitators": "Practitioners in their own words.",
  "healing-stories": "Recovery from addiction, depression, PTSD.",
};

export function SacredBroadcastsCarousel({ playlists }: { playlists: VideoPlaylist[] }) {
  const [embed, setEmbed] = useState<EmbedTarget | null>(null);

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
          const tagline = PLAYLIST_TAGLINES[playlist.id] ?? playlist.videos[0]?.description ?? "";
          const canEmbed = Boolean(
            playlist.featuredPlaylist && parseYouTubePlaylistEmbed(playlist.featuredPlaylist.href),
          );

          return (
            <button
              key={playlist.id}
              type="button"
              onClick={() => openPlaylist(playlist)}
              disabled={!canEmbed}
              className="shrink-0 w-[85vw] md:w-[440px] snap-center group cursor-pointer text-left disabled:cursor-default disabled:opacity-60"
            >
              <div className="relative aspect-[3/2] rounded-2xl overflow-hidden ring-1 ring-gold/20 mb-4">
                <img
                  src={image}
                  alt={playlist.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-disabled:group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/30 to-transparent" />
                <div className="absolute top-4 right-4 size-12 rounded-full bg-gold/90 text-forest grid place-items-center group-hover:scale-105 transition-transform">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div className="absolute bottom-5 left-5">
                  <div className="text-[10px] font-semibold tracking-widest uppercase text-gold mb-1">
                    Playlist {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="font-serif text-2xl italic">{playlist.title}</div>
                </div>
              </div>
              <p className="text-sm text-earth/60">{tagline}</p>
            </button>
          );
        })}
      </div>

      <PlaylistEmbedDialog embed={embed} onClose={() => setEmbed(null)} />
    </>
  );
}
