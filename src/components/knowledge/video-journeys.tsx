"use client";

import { useState } from "react";
import type { VideoPlaylist } from "@/data/knowledge-iboga";

function PlaylistCard({ playlist }: { playlist: VideoPlaylist }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl bg-forest text-earth overflow-hidden ring-1 ring-gold/20">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full aspect-video relative group text-left"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-moss/80 via-forest to-forest" />
        <div className="absolute inset-0 grid place-items-center">
          <div className="size-16 rounded-full bg-gold/90 text-forest grid place-items-center group-hover:scale-110 transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end gap-2">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-gold mb-1">Playlist</div>
            <div className="font-serif italic text-xl">{playlist.title}</div>
          </div>
          <span className={`text-gold text-lg transition-transform ${open ? "rotate-90" : ""}`} aria-hidden>
            →
          </span>
        </div>
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <ul className="px-4 pb-4 space-y-2 border-t border-earth/10">
            {playlist.videos.map((video, i) => (
              <li key={`${video.href}-${i}`}>
                <a
                  href={video.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col gap-1.5 rounded-xl px-3 py-3 hover:bg-earth/10 transition-colors"
                >
                  <span className="text-sm font-medium text-earth/95">{video.title}</span>
                  <p className="text-xs text-earth/65 leading-relaxed">{video.description}</p>
                  {video.source && (
                    <span className="text-[10px] uppercase tracking-widest text-gold/70">{video.source}</span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function VideoJourneys({ playlists }: { playlists: VideoPlaylist[] }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {playlists.map((playlist) => (
        <PlaylistCard key={playlist.id} playlist={playlist} />
      ))}
    </div>
  );
}
