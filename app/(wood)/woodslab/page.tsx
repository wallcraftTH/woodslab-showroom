'use client'
export const dynamic = 'force-dynamic'
import { Suspense } from 'react'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getProducts, getActiveDiscounts, getMinMax, getRangeValues, getDistinctOptions, type FilterState } from '../../actions/product'
import './woodslab.css'

import { LIMIT, RANGE_COLS } from './config'
import { calculateProductDiscount, buildPresetsFromValues } from './utils'
import WoodSlabCard from './components/WoodSlabCard'
import FilterBar from './components/FilterBar'

function WoodSlabContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = (searchParams.get('cat') as 'slabs' | 'rough') || 'slabs'

  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  const [products, setProducts] = useState<any[]>([])
  const [activeDiscounts, setActiveDiscounts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [pageInfo, setPageInfo] = useState("—")
  const [statusText, setStatusText] = useState("")

  const [openKey, setOpenKey] = useState("")
  const [options, setOptions] = useState({ type: [] as string[], material: [] as string[], panel: [] as string[] })

  const [rangeStats, setRangeStats] = useState<any>({ length: null, width: null, thickness: null })
  const [rangePresets, setRangePresets] = useState<any>({ length: null, width: null, thickness: null })

  const [filters, setFilters] = useState<FilterState>({
    type: "",
    material: "",
    panel: "",
    status: "all",
    lengthMin: "",
    lengthMax: "",
    widthMin: "",
    widthMax: "",
    thickMin: "",
    thickMax: "",
    priceMin: "",
    priceMax: "",
    q: "",
    discount: "all",
  })

  const searchTimeout = useRef<NodeJS.Timeout | null>(null)

  // --- Wrapper for Discount Logic to maintain useCallback structure if needed by downstream ---
  const getProductDiscount = useCallback((product: any) => {
    return calculateProductDiscount(product, activeDiscounts)
  }, [activeDiscounts])

  const handleCategoryChange = (cat: 'slabs' | 'rough') => {
    router.push(`/woodslab?cat=${cat}`)
    setPage(0)
    setFilters(prev => ({ ...prev, type: "", material: "", panel: "" }))
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => {
      setFilters(prev => ({ ...prev, q: val }))
      setPage(0)
    }, 300)
  }

  const handleFilterChange = (key: keyof FilterState, val: string) => {
    setFilters(prev => ({ ...prev, [key]: val }))
    setPage(0)
  }

  const handleRangeApply = (minKey: string, maxKey: string, minVal: string, maxVal: string) => {
    setFilters(prev => ({ ...prev, [minKey]: minVal, [maxKey]: maxVal }))
    setPage(0)
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const init = async () => {
      const discs = await getActiveDiscounts()
      setActiveDiscounts(discs)
      const opts = await getDistinctOptions(currentCategory)
      setOptions(opts)

      setRangeStats({ length: null, width: null, thickness: null })
      setRangePresets({ length: null, width: null, thickness: null })
    }
    init()
  }, [currentCategory])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        let rows = await getProducts(page, LIMIT, filters, currentCategory)

        if (filters.discount === 'yes') {
          rows = rows.filter((r: any) => calculateProductDiscount(r, activeDiscounts) !== null)
        }

        setProducts(rows)

        const from = rows?.length ? (page * LIMIT) + 1 : 0
        const to = (page * LIMIT) + (rows?.length || 0)
        const countLabel = filters.discount === 'yes' ? `${rows.length} (On Sale)` : rows.length

        setPageInfo(`${from} — ${to}`)
        setStatusText(`Displaying ${countLabel} items`)

      } catch (err) {
        console.error(err)
        setStatusText("Error fetching data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [page, filters, activeDiscounts, currentCategory])

  useEffect(() => {
    const key = openKey as keyof typeof RANGE_COLS
    if (!key || !RANGE_COLS[key]) return

    if (!rangeStats[key]) {
      setRangeStats((prev: any) => ({ ...prev, [key]: { loading: true } }))
      getMinMax(RANGE_COLS[key], currentCategory).then(res => {
        setRangeStats((prev: any) => ({ ...prev, [key]: res }))
      })
    }

    if (!rangePresets[key]) {
      setRangePresets((prev: any) => ({ ...prev, [key]: { loading: true } }))
      getRangeValues(RANGE_COLS[key], currentCategory).then(vals => {
        const presets = buildPresetsFromValues(key, vals)
        setRangePresets((prev: any) => ({ ...prev, [key]: presets.length ? presets : false }))
      })
    }
  }, [openKey, currentCategory, rangeStats, rangePresets])

  return (
    <div
      data-theme={isDark ? "dark" : "light"}
      className="min-h-screen transition-colors duration-300"
      suppressHydrationWarning={true}
    >
      <style jsx global>{`
        .badge-on_request { background: linear-gradient(135deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c) !important; color: #1a1a1a !important; font-weight: 700 !important; text-shadow: 0 0.5px 1px rgba(255,255,255,0.5); border: 1px solid #96701c !important; padding: 3px 10px !important; border-radius: 4px !important; display: inline-block; font-size: 11px !important; }
        .badge-discount { background: linear-gradient(135deg, #ff416c, #ff4b2b); color: white; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; margin-left: 6px; box-shadow: 0 2px 5px rgba(255, 65, 108, 0.4); display: inline-block; vertical-align: middle; }
        .price-old { text-decoration: line-through; color: #9ca3af; font-size: 0.9em; margin-right: 6px; font-weight: 400; }
        .price-new { color: #e11d48; font-weight: 700; font-size: 1.1em; }
        [data-theme="dark"] .price-new { color: #fb7185; }
        
        .cat-switcher { display: flex; justify-content: center; margin-bottom: 20px; gap: 10px; }
        .cat-btn { background: transparent; border: 2px solid #ddd; padding: 8px 20px; border-radius: 30px; font-weight: 600; color: #666; cursor: pointer; transition: all 0.2s; }
        .cat-btn:hover { border-color: #999; color: #333; }
        .cat-btn.active { background: #1a1a1a; color: white; border-color: #1a1a1a; }
        [data-theme="dark"] .cat-btn { border-color: #444; color: #aaa; }
        [data-theme="dark"] .cat-btn.active { background: #fff; color: #000; border-color: #fff; }
      `}</style>

      <div className="wrap">
        <header>
          <h1>The Best <span>Wood</span></h1>
          <div className="subtitle">
            {currentCategory === 'slabs' ? 'Premium Live Edge Slabs' : 'High Quality Rough Wood'}
          </div>
        </header>

        <div className="flex justify-center gap-6 mb-12">
          <button
            suppressHydrationWarning={true}
            onClick={() => handleCategoryChange('slabs')}
            className={`group relative inline-block px-12 py-4 border uppercase tracking-[0.3em] text-[10px] font-bold transition-all duration-500 overflow-hidden ${currentCategory === 'slabs' ? 'border-[#d4a373]' : 'border-zinc-200 hover:border-[#d4a373]'
              }`}
          >
            <span className={`absolute inset-0 bg-[#d4a373] transition-all duration-500 ease-out ${currentCategory === 'slabs' ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></span>
            <span className={`relative z-10 transition-colors duration-500 ${currentCategory === 'slabs' ? 'text-white' : 'text-zinc-800 group-hover:text-white'
              }`}>
              Wood Slabs
            </span>
          </button>

          <button
            suppressHydrationWarning={true}
            onClick={() => handleCategoryChange('rough')}
            className={`group relative inline-block px-12 py-4 border uppercase tracking-[0.3em] text-[10px] font-bold transition-all duration-500 overflow-hidden ${currentCategory === 'rough' ? 'border-[#d4a373]' : 'border-zinc-200 hover:border-[#d4a373]'
              }`}
          >
            <span className={`absolute inset-0 bg-[#d4a373] transition-all duration-500 ease-out ${currentCategory === 'rough' ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></span>
            <span className={`relative z-10 transition-colors duration-500 ${currentCategory === 'rough' ? 'text-white' : 'text-zinc-800 group-hover:text-white'
              }`}>
              Rough Wood
            </span>
          </button>
        </div>

        <div className="controls">
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            handleFilterChange={handleFilterChange}
            handleSearch={handleSearch}
            openKey={openKey}
            setOpenKey={setOpenKey}
            options={options}
            rangeStats={rangeStats}
            rangePresets={rangePresets}
            handleRangeApply={handleRangeApply}
            setPage={setPage}
          />
        </div>

        <div className="grid">
          {loading ? (
            Array.from({ length: LIMIT }).map((_, i) => (
              <div key={i} className="card">
                <div className="img-wrap skeleton-box"></div>
                <div className="card-info"><div className="skeleton-box" style={{ height: 14, width: '70%' }}></div></div>
              </div>
            ))
          ) : products.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '80px 0' }}>No items found.</div>
          ) : (
            products.map(r => {
              const discountInfo = getProductDiscount(r)
              return (
                <WoodSlabCard key={r.id} product={r} discountInfo={discountInfo} />
              )
            })
          )}
        </div>

        <div className="footer-bar">
          <button className="btn-page" disabled={page <= 0} onClick={() => setPage(page - 1)}>Previous</button>
          <div style={{ fontSize: '0.9rem', letterSpacing: '0.1em' }}>{pageInfo}</div>
          <button className="btn-page" disabled={products.length < LIMIT} onClick={() => setPage(page + 1)}>Next</button>
        </div>
        <div style={{ textAlign: 'center', marginTop: 10, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{statusText}</div>
        <div className="hint">
          Category: <b>{currentCategory === 'slabs' ? 'WOODSLABS' : 'ROUGH WOOD'}</b>
        </div>
      </div>
    </div>
  )
}

export default function WoodSlabPageWrapper() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <WoodSlabContent />
    </Suspense>
  )
}