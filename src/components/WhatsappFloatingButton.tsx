"use client"

import Link from "next/link"

function WhatsappIcon(props: { className?: string }) {
    return (
        <svg className={props.className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12.04 2C6.57 2 2.13 6.44 2.13 11.91c0 2.09.66 4.03 1.78 5.61L2 22l4.61-1.84a9.86 9.86 0 0 0 5.43 1.59h.01c5.47 0 9.91-4.44 9.91-9.91C22 6.44 17.51 2 12.04 2zm0 17.93h-.01a8 8 0 0 1-4.29-1.26l-.31-.19-2.73 1.09.52-2.83-.2-.29a8 8 0 1 1 7.02 3.48zM16.6 14.3c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.93-1.18-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.02-.38.1-.5.1-.1.24-.26.36-.4.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.79-.2-.48-.4-.42-.54-.42-.14 0-.3-.02-.46-.02-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.68 2.56 4.06 3.59.57.25 1.02.4 1.37.51.58.18 1.1.16 1.52.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z"/>
        </svg>
    )
}

export default function WhatsappFloatingButton({ href }: { href?: string }) {
    if (!href) return null
    return (
        <Link href={href} target="_blank" aria-label="Chat on WhatsApp"
            className="fixed z-50 bottom-5 right-5 h-14 w-14 rounded-full bg-[#25D366] shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity">
            <WhatsappIcon className="w-7 h-7 text-white" />
        </Link>
    )
}


