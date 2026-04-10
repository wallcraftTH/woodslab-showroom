'use client'

import dynamic from 'next/dynamic'
import Navbar from '@/src/components/Navbar'

// ✅ ต้อง ssr: false เพราะ pdf.js ทำงานได้เฉพาะ browser เท่านั้น
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
    </div>
  )
}
