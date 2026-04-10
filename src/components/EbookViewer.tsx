'use client'

import { useState, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

interface EbookViewerProps {
  pdfUrl: string
}

export default function EbookViewer({ pdfUrl }: EbookViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [pageWidth, setPageWidth] = useState<number>(700)

  // ✅ ตั้ง workerSrc ใน useEffect — รันเฉพาะ client side เท่านั้น
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
  }, [])

  useEffect(() => {
    const updateWidth = () => {
      setPageWidth(Math.min(window.innerWidth - 32, 700))
    }
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setPageNumber(1)
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#FAF9F6] py-8 px-4">
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={
          <div className="flex items-center justify-center py-20">
            <div className="text-zinc-500 text-sm uppercase tracking-widest animate-pulse">
              Loading Catalogue...
            </div>
          </div>
        }
        error={
          <div className="flex items-center justify-center py-20">
            <div className="text-red-400 text-sm uppercase tracking-widest">
              Failed to load PDF
            </div>
          </div>
        }
      >
        <Page
          pageNumber={pageNumber}
          width={pageWidth}
          loading={
            <div
              className="flex items-center justify-center"
              style={{ width: pageWidth, height: pageWidth * 1.414, background: '#f0ede8' }}
            >
              <div className="text-zinc-400 text-xs animate-pulse">Loading page...</div>
            </div>
          }
        />
      </Document>

      {numPages > 0 && (
        <div className="flex items-center gap-6 mt-6 bg-white border border-zinc-100 shadow-sm px-6 py-3 rounded-full">
          <button
            onClick={() => setPageNumber(p => Math.max(1, p - 1))}
            disabled={pageNumber <= 1}
            className="text-zinc-400 hover:text-zinc-800 disabled:opacity-30 transition-colors text-lg font-light"
          >
            ←
          </button>
          <span className="text-xs uppercase tracking-widest text-zinc-500 font-medium min-w-[80px] text-center">
            {pageNumber} / {numPages}
          </span>
          <button
            onClick={() => setPageNumber(p => Math.min(numPages, p + 1))}
            disabled={pageNumber >= numPages}
            className="text-zinc-400 hover:text-zinc-800 disabled:opacity-30 transition-colors text-lg font-light"
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}
