"use client"

import { useEffect, useMemo, useState } from "react"

export type SuccessVideo = {
    title?: string
    url: string
    thumbnailUrl?: string
}

function parseVimeoEmbed(url: string): { embedUrl: string } {
    try {
        const u = new URL(url)
        // URL can be like: https://vimeo.com/1061492084/2eebc3760a?...
        const parts = u.pathname.split("/").filter(Boolean)
        const id = parts[0]
        const hash = parts[1]
        const params = new URLSearchParams()
        if (hash) params.set("h", hash)
        params.set("autoplay", "1")
        params.set("title", "0")
        params.set("byline", "0")
        params.set("portrait", "0")
        const embed = `https://player.vimeo.com/video/${id}?${params.toString()}`
        return { embedUrl: embed }
    } catch {
        return { embedUrl: url }
    }
}

export default function SuccessStoriesVideos({ videos }: { videos: SuccessVideo[] }) {
    const [open, setOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState<number>(0)

    const activeEmbedUrl = useMemo(() => {
        const v = videos[activeIndex]
        return v ? parseVimeoEmbed(v.url).embedUrl : ""
    }, [activeIndex, videos])

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false)
            if (open && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
                setActiveIndex((idx) => {
                    if (e.key === "ArrowRight") return (idx + 1) % videos.length
                    return (idx - 1 + videos.length) % videos.length
                })
            }
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [open, videos.length])

    if (!videos || videos.length === 0) return null

    return (
        <div className="mt-12">
            <h2 className="text-3xl font-medium text-[#283277] mb-6">Video Testimonials</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {videos.map((v, i) => (
                    <button
                        key={`${v.url}-${i}`}
                        className="group relative rounded-lg overflow-hidden border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2dc0d9]"
                        onClick={() => { setActiveIndex(i); setOpen(true) }}
                        aria-label={`Play video ${v.title || ''}`}
                    >
                        <div className="relative w-full aspect-[4/5] bg-gray-200">
                            {v.thumbnailUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={v.thumbnailUrl} alt={v.title || "Video thumbnail"} className="absolute inset-0 w-full h-full object-cover object-top" />
                            ) : null}
                        </div>
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-14 w-14 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-105 transition-transform">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="#283277" aria-hidden>
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white text-sm">
                            {v.title}
                        </div>
                    </button>
                ))}
            </div>

            {open ? (
                <div className="fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/80" onClick={() => setOpen(false)} />
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                        <div className="w-full max-w-5xl aspect-video bg-black relative">
                            <iframe
                                key={activeEmbedUrl}
                                src={activeEmbedUrl}
                                allow="autoplay; fullscreen; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                                title={videos[activeIndex]?.title || 'Video'}
                            />
                            <button
                                className="absolute -top-10 right-0 text-white/90 hover:text-white text-xl"
                                onClick={() => setOpen(false)}
                                aria-label="Close video"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    )
}


