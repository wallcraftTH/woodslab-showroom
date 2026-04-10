'use client'

import dynamic from 'next/dynamic'
import Navbar from '@/src/components/Navbar'

// ✅ โหลด EbookViewer แบบ dynamic (ปิด SSR) เพราะ pdf.js ทำงานได้เฉพาะฝั่ง browser
const EbookViewer = dynamic(() => import('@/src/components/EbookViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-20">
      <div className="text-zinc-400 text-sm uppercase tracking-widest animate-pulse">
        Loading Catalogue...
      </div>
    </div>
  ),
})

// ✅ เปลี่ยน URL นี้เป็น path PDF จริงของคุณ
const PDF_URL = '/catalogue.pdf'

export default function CatalogPage() {
  return (
    <div className="bg-[#FAF9F6] min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <div className="text-center pt-12 pb-6 px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-[#1C1917] mb-3 uppercase tracking-tight">
            Catalogue
          </h1>
          <p className="text-zinc-400 uppercase tracking-widest text-xs font-light">
            Woodslabs Collection
          </p>
          <div className="w-16 h-[1px] bg-[#d4a373] mx-auto mt-6"></div>
        </div>

        <EbookViewer pdfUrl={PDF_URL} />
      </main>

      <footer className="py-10 bg-[#0a0a0a] text-white border-t border-white/5 text-center mt-auto">
        <div className="text-[10px] text-zinc-600 uppercase tracking-widest">
          &copy; 2026 Woodslabs Industry Co., Ltd.
        </div>
      </footer>
    </div>
  )
}
