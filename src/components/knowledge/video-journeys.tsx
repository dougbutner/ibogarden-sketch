"use client";

import { useState } from "react";
import type { KnowledgeLink, VideoPlaylist } from "@/data/knowledge-iboga";
import heroForest from "@/assets/hero-forest.jpg";
import ceremonySpace from "@/assets/ceremony-space.jpg";
import seedling from "@/assets/seedling.jpg";
import ibogaRoot from "@/assets/iboga-root.jpg";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type EmbedTarget = {
  title: string;
  src: string;
};

export const PLAYLIST_IMAGES: Record<string, string> = {
  "about-iboga": heroForest,
  "iboga-facilitators": ceremonySpace,
  "healing-stories": seedling,
  "video-journeys": ibogaRoot,
};

export function parseYouTubePlaylistEmbed(href: string): string | null {
  try {
    const url = new URL(href);
    if (url.hostname.includes("youtube.com")) {
      const listId = url.searchParams.get("list");
      if (listId) {
        return `https://www.youtube.com/embed/videoseries?list=${listId}&autoplay=1`;
      }
    }
  } catch {
    return null;
  }
  return null;
}

export function PlaylistEmbedDialog({
  embed,
  onClose,
}: {
  embed: EmbedTarget | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={embed !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[min(96vw,72rem)] w-full max-h-[min(96vh,100dvh)] p-0 gap-0 overflow-hidden border-forest/20 bg-forest sm:rounded-2xl">
        <DialogHeader className="px-5 pt-5 pb-3 pr-12 shrink-0">
          <DialogTitle className="font-serif italic text-earth text-xl">{embed?.title}</DialogTitle>
          <DialogDescription className="sr-only">Embedded YouTube playlist</DialogDescription>
        </DialogHeader>
        {embed && (
          <div className="w-full h-[min(75vh,calc(100dvh-6rem))] bg-black">
            <iframe
              title={embed.title}
              src={embed.src}
              className="size-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function VideoRow({ video }: { video: KnowledgeLink }) {
  return (
    <li>
      <a
        href={video.href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col gap-1 rounded-xl px-3 py-2.5 hover:bg-earth/10 transition-colors group"
      >
        <span className="text-sm font-medium text-earth/95 group-hover:text-gold transition-colors">
          {video.title}
        </span>
        <p className="text-xs text-earth/65 leading-relaxed line-clamp-3">{video.description}</p>
        {video.source && (
          <span className="text-[10px] uppercase tracking-widest text-gold/70">{video.source}</span>
        )}
      </a>
    </li>
  );
}

function HorizontalPanel({
  playlist,
  open,
  onSelect,
  onEmbedPlaylist,
}: {
  playlist: VideoPlaylist;
  open: boolean;
  onSelect: () => void;
  onEmbedPlaylist: (target: EmbedTarget) => void;
}) {
  const image = PLAYLIST_IMAGES[playlist.id] ?? heroForest;
  const featuredSrc = playlist.featuredPlaylist
    ? parseYouTubePlaylistEmbed(playlist.featuredPlaylist.href)
    : null;

  return (
    <div
      className={`relative min-w-0 h-full overflow-hidden rounded-2xl ring-1 ring-gold/20 transition-[flex] duration-500 ease-[cubic-bezier(0.55,0,0.1,1)] ${
        open ? "flex-[4]" : "flex-[0.55] cursor-pointer"
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-expanded={open}
        className={`absolute inset-0 z-10 ${open ? "pointer-events-none" : ""}`}
      >
        <span className="sr-only">{open ? playlist.title : `Expand ${playlist.title}`}</span>
      </button>

      {/* Background */}
      <div className="absolute inset-0">
        <img src={image} alt="" className="size-full object-cover" />
        <div
          className={`absolute inset-0 transition-colors duration-500 ${
            open ? "bg-forest/92" : "bg-forest/75"
          }`}
        />
      </div>

      {/* Collapsed strip */}
      <div
        className={`absolute inset-0 z-[1] flex flex-col justify-between p-4 transition-opacity duration-300 ${
          open ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <div className="hidden">Playlist</div>
        <div className="flex flex-1 items-center justify-center">
          <div className="size-12 rounded-full bg-gold/90 text-forest grid place-items-center shadow-lg">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <h3
          className="font-serif italic text-earth text-lg md:text-xl leading-tight [writing-mode:vertical-rl] rotate-180 self-end max-h-[12rem] truncate"
          aria-hidden
        >
          {playlist.title}
        </h3>
      </div>

      {/* Expanded panel */}
      <div
        className={`absolute inset-0 z-[2] flex flex-col transition-opacity duration-300 delay-100 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="shrink-0 border-b border-earth/10 px-5 py-4">
          <div className="hidden">Playlist</div>
          <h3 className="font-serif italic text-2xl text-earth">{playlist.title}</h3>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-3">
          {playlist.featuredPlaylist && featuredSrc && (
            <button
              type="button"
              onClick={() =>
                onEmbedPlaylist({
                  title: playlist.featuredPlaylist!.title,
                  src: featuredSrc,
                })
              }
              className="mb-3 w-full text-left rounded-xl border border-gold/30 bg-gold/10 px-4 py-4 hover:bg-gold/20 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="size-11 shrink-0 rounded-full bg-gold/90 text-forest grid place-items-center group-hover:scale-105 transition-transform">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-widest text-gold/80 mb-0.5">
                    Featured playlist
                  </div>
                  <div className="font-serif italic text-lg text-earth truncate">
                    {playlist.featuredPlaylist.title}
                  </div>
                  <p className="text-xs text-earth/65 mt-1">Watch full playlist</p>
                </div>
              </div>
            </button>
          )}

          <ul className="space-y-0.5">
            {playlist.videos.map((video, i) => (
              <VideoRow key={`${video.href}-${i}`} video={video} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function VideoJourneys({ playlists }: { playlists: VideoPlaylist[] }) {
  const [openId, setOpenId] = useState<string | null>(playlists[0]?.id ?? null);
  const [embed, setEmbed] = useState<EmbedTarget | null>(null);

  function select(id: string) {
    setOpenId((current) => (current === id ? current : id));
  }

  return (
    <>
      <div className="flex gap-2 md:gap-3 h-[min(520px,calc(100dvh-10rem))] overflow-hidden">
        {playlists.map((playlist) => (
          <HorizontalPanel
            key={playlist.id}
            playlist={playlist}
            open={openId === playlist.id}
            onSelect={() => select(playlist.id)}
            onEmbedPlaylist={setEmbed}
          />
        ))}
      </div>

      <PlaylistEmbedDialog embed={embed} onClose={() => setEmbed(null)} />
    </>
  );
}
