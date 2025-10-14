import { fetchSuccessStories } from "@/lib/wp-rest"
import { Send } from "lucide-react"
import SuccessStoriesCarousel from "@/components/SuccessStoriesCarousel"
import SuccessStoriesVideos from "@/components/SuccessStoriesVideos"
import { normalizeWpLink } from "@/lib/wp-rest"

export const dynamic = "force-dynamic"

export default async function SuccessStoriesPage() {
    const data = await fetchSuccessStories()
    const mainStory = data?.[0]
    const allTestimonials = (mainStory?.acf?.stories as any[]) || []
    const rawVideoList = Array.isArray((mainStory as any)?.acf?.video_list)
        ? ((mainStory as any).acf.video_list as any[])
              .filter(Boolean)
              .map((v) => ({
                  title: v?.title || v?.video_link?.title || '',
                  url: normalizeWpLink(v?.video_link?.url) || '',
              }))
              .filter((v) => v.url)
        : []

    // Fetch Vimeo oEmbed to get thumbnails on the server
    const videoList = await Promise.all(
        rawVideoList.map(async (v) => {
            try {
                const oembedUrl = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(v.url)}`
                const res = await fetch(oembedUrl, { cache: 'no-store' })
                if (!res.ok) return v
                const json = await res.json() as any
                const thumb: string | undefined = json?.thumbnail_url
                return { ...v, thumbnailUrl: thumb }
            } catch {
                return v
            }
        })
    )

    return (
        <main className="min-h-screen bg-white">
            <div className="py-20">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Send className="w-5 h-5 text-[#2dc0d9]" />
                            <span className="text-[#2dc0d9] font-semibold tracking-wide text-sm uppercase">SUCCESS STORIES</span>
                        </div>
                        <h1 className="text-[60px] font-medium text-[#283277] mb-8 leading-tight">
                            {mainStory?.acf?.heading || "How we do our visa & Immigration processing"}
                        </h1>
                        {mainStory?.acf?.description ? (
                            <div className="text-[16px] text-gray-700 leading-relaxed max-w-4xl mx-auto space-y-4" dangerouslySetInnerHTML={{ __html: mainStory.acf.description as string }} />
                        ) : null}
                    </div>
                </div>
            </div>
            <div className="py-20 bg-gray-50">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                    {allTestimonials.length > 0 ? (
                        <SuccessStoriesCarousel stories={allTestimonials as any[]} />
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No success stories found.</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="py-16">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                    <SuccessStoriesVideos videos={videoList as any} />
                </div>
            </div>
        </main>
    )
}
