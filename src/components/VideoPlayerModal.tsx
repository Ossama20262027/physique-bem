import React from 'react';
import { X, Youtube, Star, ExternalLink, ShieldCheck, Search, Play } from 'lucide-react';
import { VideoItem } from '../types';
import { YOUTUBE_CONFIG } from '../data/youtubeConfig';

interface VideoPlayerModalProps {
  video: VideoItem | null;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ video, onClose }) => {
  if (!video) return null;

  const directWatchUrl = `https://www.youtube.com/watch?v=${video.videoId}`;
  const directSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${video.title} ${video.channelTitle}`
  )}`;
  const embedUrl = `https://www.youtube.com/embed/${video.videoId}?autoplay=1&playsinline=1&rel=0`;

  return (
    <div
      id="video-player-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="video-player-modal-container"
        className="w-full max-w-3xl bg-slate-950 rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-800 shadow-2xl animate-in fade-in zoom-in-95 duration-150 flex flex-col my-auto"
      >
        {/* Top Header bar */}
        <div className="p-3 sm:p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Youtube className="w-5 h-5 text-red-500 shrink-0" />
            <span className="font-bold text-xs sm:text-sm truncate">{video.title}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white shrink-0 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 16:9 Responsive Video Frame */}
        <div className="relative w-full aspect-video bg-black">
          <iframe
            src={embedUrl}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 w-full h-full border-0"
          />
        </div>

        {/* Action Buttons & Fallback Bar */}
        <div className="p-3.5 sm:p-5 bg-slate-900/95 text-white space-y-3">
          {/* Prominent Direct Launch Action on Mobile & Desktop */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            <a
              href={directWatchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all text-center"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>مشاهدة مباشرة على تطبيق YouTube ↗</span>
            </a>

            <a
              href={directSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors text-center"
            >
              <Search className="w-3.5 h-3.5" />
              <span>البحث عن الدرس في يوتيوب</span>
            </a>
          </div>

          {/* Teacher Badge & Video Duration */}
          <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              {video.isTeacherChannel ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>قناة: دروسي على النت</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  <ShieldCheck className="w-3 h-3 text-blue-400" />
                  <span>{video.channelTitle}</span>
                </span>
              )}
              {video.duration && <span>⏱️ {video.duration}</span>}
              {video.views && <span>👁️ {video.views}</span>}
            </div>

            <span className="text-slate-500 text-[10px]">
              معرف الفيديو: <span className="font-mono">{video.videoId}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
