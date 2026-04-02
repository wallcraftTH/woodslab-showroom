'use client'
import React from 'react';
import { STATUS_TABS, HEADERS } from '../config';
import { FilterState } from '../../actions/product'; // Adjust import path as needed

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  handleFilterChange: (key: keyof FilterState, val: string) => void;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  openKey: string;
  setOpenKey: (key: string) => void;
  options: any;
  rangeStats: any;
  rangePresets: any;
  handleRangeApply: (minKey: string, maxKey: string, minVal: string, maxVal: string) => void;
  setPage: (page: number) => void;
}

export default function FilterBar({
  filters,
  handleFilterChange,
  handleSearch,
  openKey,
  setOpenKey,
  options,
  rangeStats,
  rangePresets,
  handleRangeApply
}: FilterBarProps) {

  return (
    <>
      <div className="top-row">
        <div className="tabs">
          {STATUS_TABS.map(t => (
            <button
              key={t.key}
              className={`tab-btn ${filters.status === t.key ? "active" : ""}`}
              onClick={() => handleFilterChange("status", t.key)}
              suppressHydrationWarning={true}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="search-wrap">
          <div className="search-box">
            <input
              placeholder="Search..."
              onChange={handleSearch}
              suppressHydrationWarning={true}
            />
            <span className="search-icon">⚲</span>
          </div>
        </div>
      </div>

      <div className="mega-filter">
        <div className="mf-head">
          {HEADERS.map(h => {
            let chip = "";
            if (h.key === "type") chip = filters.type;
            if (h.key === "material") chip = filters.material;
            if (h.key === "panel") chip = filters.panel;
            if (h.key === "status") chip = STATUS_TABS.find(t => t.key === filters.status)?.label || "";
            if (h.key === "discount") chip = filters.discount === "yes" ? "On Sale" : "";

            if (["length", "width", "thickness"].includes(h.key)) {
              // @ts-ignore
              const min = filters[`${h.key === "thickness" ? "thick" : h.key}Min`];
              // @ts-ignore
              const max = filters[`${h.key === "thickness" ? "thick" : h.key}Max`];
              if (min || max) chip = `${min}-${max}`;
            }

            return (
              <button
                suppressHydrationWarning={true}
                key={h.key}
                className={`mf-h ${openKey === h.key ? "active" : ""}`}
                onClick={() => setOpenKey(openKey === h.key ? "" : h.key)}
              >
                {h.label} {chip && <span className="mf-chip">{chip}</span>}
              </button>
            );
          })}
        </div>

        {openKey && (
          <div className="mf-body open">
            <div className="mf-row">
              <div className="mf-title">{HEADERS.find(x => x.key === openKey)?.label}</div>
              <div className="mf-options">
                {["type", "material", "panel"].includes(openKey) && (
                  <>
                    <button className={`mf-opt ${filters[openKey as keyof FilterState] === "" ? "active" : ""}`} onClick={() => handleFilterChange(openKey as keyof FilterState, "")}>All</button>
                    {/* @ts-ignore */}
                    {options[openKey]?.map((opt: string) => (
                      <button
                        key={opt}
                        className={`mf-opt ${filters[openKey as keyof FilterState] === opt ? "active" : ""}`}
                        onClick={() => handleFilterChange(openKey as keyof FilterState, opt)}
                      >
                        {opt}
                      </button>
                    ))}
                  </>
                )}

                {openKey === "discount" && (
                  <>
                    <button className={`mf-opt ${filters.discount === "all" ? "active" : ""}`} onClick={() => handleFilterChange("discount", "all")}>All</button>
                    <button className={`mf-opt ${filters.discount === "yes" ? "active" : ""}`} onClick={() => handleFilterChange("discount", "yes")}>On Sale</button>
                  </>
                )}

                {openKey === "status" && STATUS_TABS.map(t => (
                  <button key={t.key} className={`mf-opt ${filters.status === t.key ? "active" : ""}`} onClick={() => handleFilterChange("status", t.key)}>{t.label}</button>
                ))}

                {/* Range Rendering */}
                {["length", "width", "thickness"].includes(openKey) && (() => {
                  const mapKey = openKey === "thickness" ? "thick" : openKey;
                  // @ts-ignore
                  const minKey = `${mapKey}Min`; const maxKey = `${mapKey}Max`;
                  // @ts-ignore
                  const stats = rangeStats[openKey]; const presets = rangePresets[openKey];

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                        {Array.isArray(presets) && presets.map((p: any, idx: number) => (
                          <button key={idx} className="mf-opt" onClick={() => handleRangeApply(minKey, maxKey, p.min, p.max)}>
                            {p.label}
                          </button>
                        ))}
                      </div>
                      <div className="mf-range">
                        {/* @ts-ignore */}
                        <input type="number" placeholder="min" value={filters[minKey]} onChange={e => handleFilterChange(minKey, e.target.value)} />
                        <span>–</span>
                        {/* @ts-ignore */}
                        <input type="number" placeholder="max" value={filters[maxKey]} onChange={e => handleFilterChange(maxKey, e.target.value)} />
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {stats?.min !== undefined && `Data: ${stats.min} – ${stats.max}`}
                      </div>
                    </div>
                  );
                })()}

                {/* Price Rendering */}
                {openKey === "price" && (
                  <div className="mf-range">
                    <input type="number" placeholder="$" value={filters.priceMin} onChange={e => handleFilterChange("priceMin", e.target.value)} />
                    <span>–</span>
                    <input type="number" placeholder="$" value={filters.priceMax} onChange={e => handleFilterChange("priceMax", e.target.value)} />
                  </div>
                )}
              </div>
            </div>
            <div className="mf-tools">
              <button className="mf-clear" onClick={() => setOpenKey("")}>Close</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}