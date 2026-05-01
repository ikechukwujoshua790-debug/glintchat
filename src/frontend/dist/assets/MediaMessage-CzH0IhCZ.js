import { c as createLucideIcon } from "./button-CQxG3T_J.js";
import { r as reactExports, j as jsxRuntimeExports } from "./index-DFLYPydE.js";
import { o as useGetMediaDownloadUrl, M as MediaType } from "./Layout-81mP_Nwv.js";
import { L as LoaderCircle } from "./loader-circle-EI3rWnIU.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z", key: "131961" }],
  ["path", { d: "M19 10v2a7 7 0 0 1-14 0v-2", key: "1vc78b" }],
  ["line", { x1: "12", x2: "12", y1: "19", y2: "22", key: "x3vr5v" }]
];
const Mic = createLucideIcon("mic", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M13.234 20.252 21 12.3", key: "1cbrk9" }],
  [
    "path",
    {
      d: "m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486",
      key: "1pkts6"
    }
  ]
];
const Paperclip = createLucideIcon("paperclip", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["rect", { x: "14", y: "4", width: "4", height: "16", rx: "1", key: "zuxfzm" }],
  ["rect", { x: "6", y: "4", width: "4", height: "16", rx: "1", key: "1okwgv" }]
];
const Pause = createLucideIcon("pause", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [["polygon", { points: "6 3 20 12 6 21 6 3", key: "1oa8hb" }]];
const Play = createLucideIcon("play", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",
      key: "ftymec"
    }
  ],
  ["rect", { x: "2", y: "6", width: "14", height: "12", rx: "2", key: "158x01" }]
];
const Video = createLucideIcon("video", __iconNode);
function formatDuration(secs) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
function AudioPlayer({ src, isMine = false }) {
  const audioRef = reactExports.useRef(null);
  const [playing, setPlaying] = reactExports.useState(false);
  const [progress, setProgress] = reactExports.useState(0);
  const [duration, setDuration] = reactExports.useState(0);
  const [currentTime, setCurrentTime] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onLoadedMeta = () => setDuration(audio.duration || 0);
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress(
        audio.duration ? audio.currentTime / audio.duration * 100 : 0
      );
    };
    const onEnded = () => {
      setPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };
    audio.addEventListener("loadedmetadata", onLoadedMeta);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMeta);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };
  const seekToRatio = (clientX, rect) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const ratio = (clientX - rect.left) / rect.width;
    audio.currentTime = Math.max(0, Math.min(1, ratio)) * audio.duration;
  };
  const handleSeekClick = (e) => {
    seekToRatio(e.clientX, e.currentTarget.getBoundingClientRect());
  };
  const handleSeekKey = (e) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (e.key === "ArrowRight")
      audio.currentTime = Math.min(audio.currentTime + 2, audio.duration);
    if (e.key === "ArrowLeft")
      audio.currentTime = Math.max(audio.currentTime - 2, 0);
  };
  const barCount = 28;
  const bars = Array.from({ length: barCount }, (_, i) => {
    const h = 25 + (i * 7 + src.charCodeAt(i % src.length)) % 10 / 10 * 55;
    return { id: `wbar-${i}`, h };
  });
  const trackColor = isMine ? "bg-primary-foreground/30" : "bg-border";
  const fillColor = isMine ? "bg-primary-foreground/80" : "bg-primary";
  const playBtnClass = isMine ? "bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground" : "bg-primary/20 hover:bg-primary/30 text-primary";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 min-w-[180px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("audio", { ref: audioRef, src, preload: "metadata", children: /* @__PURE__ */ jsxRuntimeExports.jsx("track", { kind: "captions" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: togglePlay,
        className: `w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-smooth ${playBtnClass}`,
        "aria-label": playing ? "Pause" : "Play",
        children: playing ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { size: 14, className: "ml-0.5" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          className: "flex items-center gap-[2px] h-7 cursor-pointer w-full",
          onClick: handleSeekClick,
          onKeyDown: handleSeekKey,
          "aria-label": "Seek audio position",
          children: bars.map(({ id, h }, i) => {
            const pct = i / barCount * 100;
            const active = pct <= progress;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `rounded-full w-[3px] shrink-0 transition-colors duration-100 ${active ? fillColor : trackColor}`,
                style: { height: `${h}%` }
              },
              id
            );
          })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          className: `h-0.5 w-full rounded-full ${trackColor} cursor-pointer relative overflow-hidden`,
          onClick: handleSeekClick,
          onKeyDown: handleSeekKey,
          "aria-label": "Seek audio",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `h-full rounded-full transition-all duration-100 ${fillColor}`,
              style: { width: `${progress}%` }
            }
          )
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: `text-[10px] font-mono shrink-0 tabular-nums ${isMine ? "text-primary-foreground/65" : "text-muted-foreground"}`,
        children: playing || currentTime > 0 ? formatDuration(currentTime) : formatDuration(duration)
      }
    )
  ] });
}
function MediaMessage({
  mediaUrl,
  mediaType,
  isMine,
  onImageClick
}) {
  const getUrl = useGetMediaDownloadUrl();
  const getUrlRef = reactExports.useRef(getUrl.mutateAsync);
  getUrlRef.current = getUrl.mutateAsync;
  const [resolvedUrl, setResolvedUrl] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(false);
  reactExports.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    getUrlRef.current(mediaUrl).then((url) => {
      if (!cancelled) {
        setResolvedUrl(url);
        setLoading(false);
      }
    }).catch(() => {
      if (!cancelled) {
        setError(true);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [mediaUrl]);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center w-36 h-20 rounded-xl bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 18, className: "animate-spin text-muted-foreground" }) });
  }
  if (error || !resolvedUrl) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center w-36 h-12 rounded-xl bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground", children: "Media unavailable" }) });
  }
  if (mediaType === MediaType.audio) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AudioPlayer, { src: resolvedUrl, isMine });
  }
  if (mediaType === MediaType.image) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        className: "block rounded-xl overflow-hidden max-w-[220px] focus:outline-none focus:ring-2 focus:ring-primary",
        onClick: () => onImageClick == null ? void 0 : onImageClick(resolvedUrl),
        "aria-label": "View full-size media",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: resolvedUrl,
            alt: "Shared media",
            className: "w-full h-auto object-cover",
            style: { maxHeight: "240px" }
          }
        )
      }
    );
  }
  if (mediaType === MediaType.video) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative rounded-xl overflow-hidden max-w-[220px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "video",
      {
        src: resolvedUrl,
        controls: true,
        className: "w-full rounded-xl",
        style: { maxHeight: "200px" },
        "aria-label": "Shared video",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("track", { kind: "captions" })
      }
    ) });
  }
  return null;
}
export {
  MediaMessage as M,
  Paperclip as P,
  Video as V,
  Mic as a
};
