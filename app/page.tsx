"use client";
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaLine, FaFacebookF, FaPhone } from 'react-icons/fa';

/* ─────────────────────────────────────
   Shared UI helpers
───────────────────────────────────── */
const FadeIn = ({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-[1100ms] ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}>
      {children}
    </div>
  );
};

const Btn = ({ href, label, dark }: { href: string; label: string; dark?: boolean }) => (
  <Link href={href}
    className={`group relative inline-flex items-center gap-3 px-9 py-3.5 border text-[10px] font-bold uppercase tracking-[0.35em] overflow-hidden transition-all duration-500
      ${dark ? 'border-white/25 text-white' : 'border-[#1C1917]/25 text-[#1C1917]'} hover:border-[#C8935A]`}>
    <span className="absolute inset-0 w-0 group-hover:w-full bg-[#C8935A] transition-all duration-500 ease-out" />
    <span className="relative z-10 group-hover:text-white transition-colors duration-500">{label}</span>
    <svg className="relative z-10 w-3.5 h-3.5 group-hover:text-white transition-colors duration-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
  </Link>
);

const Tag = ({ text }: { text: string }) => (
  <p className="text-[#C8935A] text-[9px] font-bold uppercase tracking-[0.45em] mb-4">{text}</p>
);

/* ─────────────────────────────────────
   Data
───────────────────────────────────── */
const HERO = [
  "https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1775724369710-636.webp",
  "https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1775724436708-497.webp",
  "https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1775724626723-645.webp",
  "https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1775724638171-371.webp",
  "https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1775724644851-261.webp",
  "https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1775724653183-509.webp",
  "https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1775724663183-719.webp",
  "https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1775724495973-851.webp",
];

const SOLID = [
  { th: "วอลนัทดำ", en: "North American Black Walnut", img: "https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1775725287327-673.webp", note: "0.66–0.69 g/cm³" },
  { th: "สักพม่า", en: "Burmese Teak", img: "https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1775725297620-505.webp", note: "0.65–0.70 g/cm³" },
  { th: "จามจุรี", en: "South American Rain Tree", img: "https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1775725304427-139.webp", note: "0.64 g/cm³" },
  { th: "แอชอเมริกัน", en: "American Ash", img: "https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1775725319640-116.webp", note: "0.60–0.72 g/cm³" },
];

const RESIN = [
  { th: "วอลนัทเรซิน", en: "Walnut Resin", img: "https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1775724495973-851.webp" },
  { th: "ป็อปลาร์เรซิน", en: "Poplar Resin", img: "https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1775725984128-23.webp" },
  { th: "ไม้มะกอก", en: "Olive Wood", img: "https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1775726859141-273.webp" },
  { th: "โรสวูดแอฟริกา", en: "African Rosewood", img: "https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1775726887638-45.webp" },
];

const STEPS = [
  { n: "01", th: "คัดเลือกซุง", en: "Log Selection", desc: "ผู้เชี่ยวชาญคัดเกรดลายเนื้อไม้ ปมและร่องรอยตามธรรมชาติ" },
  { n: "02", th: "การอบแห้ง", en: "Kiln Drying", desc: "อบด้วยเตาความถี่สูง 2–10 ปี ควบคุมความชื้น ≤ 12%" },
  { n: "03", th: "ขัดและตกแต่ง", en: "Sanding & Finishing", desc: "ขัด 10–20 รอบ เคลือบน้ำมันพืชธรรมชาติ ปลอดสาร" },
  { n: "04", th: "ตรวจสอบคุณภาพ", en: "Quality Inspection", desc: "ตรวจสอบ 100% ทุกชิ้น ก่อนจัดส่งถึงมือลูกค้า" },
];

const SPECIES = [
  "European Oak", "Japanese Zelkova", "Black Walnut", "Tochigi",
  "Rain Tree", "American Ash", "Burmese Teak", "French Poplar",
  "Purpleheart Wood", "African Bubinga", "Yakusugi Cedar", "African Zebrawood",
  "Spanish Cedar", "American Red Oak", "African Ebony", "American Cherry",
];

const PROJECTS = [
  {
    client: "คุณเหมียว, Haining, Zhejiang",
    title: "Portraying a Poetic Dwelling in Every Detail",
    titleTH: "บ้านกวีในทุกรายละเอียด",
    desc: "บ้านพักอาศัย 400 ตร.ม. 5 ชั้น ออกแบบสไตล์ Modern Minimalist Log Style ใช้โต๊ะไม้แผ่นใหญ่ 5 ตัวพร้อมองค์ประกอบไม้ดีไซน์พิเศษในทุกพื้นที่ สร้างบรรยากาศที่เรียบสงบและมีมิติ",
    img: "https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1775724638171-371.webp",
  },
  {
    client: "คุณวู, Hangzhou, Zhejiang",
    title: "Seeing the Art of Life in Design",
    titleTH: "มองเห็นศิลปะของชีวิตในงานออกแบบ",
    desc: "บ้านพักอาศัย 5 ชั้นสะท้อนความสมดุลระหว่างฟังก์ชันและความงาม โต๊ะวอลนัทดำเป็น centerpiece สร้างความต่อเนื่องของวัสดุธรรมชาติตลอดทั้งบ้าน",
    img: "https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1775724663183-719.webp",
  },
  {
    client: "คุณเหลียว, Fuzhou, Fujian",
    title: "Natural Wildness Under Modernism",
    titleTH: "ธรรมชาติดิบภายใต้ความทันสมัย",
    desc: "บ้าน 240 ตร.ม. ผสมผสานความดิบของไม้แผ่นธรรมชาติกับดีไซน์โมเดิร์น สร้างพื้นที่อาศัยที่มีชีวิตชีวาและแตกต่าง",
    img: "https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1775724644851-261.webp",
  },
  {
    client: "คุณหวัง, Quanzhou — Yaxiang Tea Space",
    title: "A Paradise in the Blank Space",
    titleTH: "สวรรค์ในความว่างเปล่า",
    desc: "ร้านน้ำชา 120 ตร.ม. ออกแบบโดย Fuger Design ใช้ไม้แผ่นธรรมชาติสร้างบรรยากาศสงบ ทรงพลัง และกลมกลืนกับธรรมชาติ",
    img: "https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1775724653183-509.webp",
  },
];

/* ─────────────────────────────────────
   Page
───────────────────────────────────── */
export default function HomePage() {
  const [hero, setHero] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setHero(i => (i + 1) % HERO.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-[#F7F4EF] text-[#1C1917] font-sans min-h-screen selection:bg-[#C8935A] selection:text-white">

      {/* ══════════════════════════════
          HERO
      ══════════════════════════════ */}
      <section className="relative h-screen w-full overflow-hidden bg-[#0d0b09]">
        {HERO.map((src, i) => (
          <img key={i} src={src} alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out ${i === hero ? 'opacity-60' : 'opacity-0'}`} />
        ))}
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* content */}
<div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
  <FadeIn>
    {/* ถ้ามีหัวข้อหรือ Tag อยู่ตรงนี้ด้วย มันก็จะกลางไปด้วยกันครับ */}
    
    <div className="flex flex-wrap justify-center gap-3 mt-8">
      <Btn href="/woodslab" label="ดูสินค้าทั้งหมด" dark />
      <Btn href="/woodslab?cat=rough" label="Raw Wood ไม้ดิบ" dark />
    </div>
  </FadeIn>
</div>

        {/* dot nav */}
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {HERO.map((_, i) => (
            <button key={i} onClick={() => setHero(i)}
              className={`rounded-full transition-all duration-500 ${i === hero ? 'bg-[#C8935A] w-7 h-1.5' : 'bg-white/30 w-1.5 h-1.5'}`} />
          ))}
        </div>

        {/* scroll hint */}
        <div className="absolute bottom-7 right-8 flex flex-col items-center gap-2 opacity-40">
          <div className="w-[1px] h-14 bg-white animate-pulse" />
          <span className="text-white text-[8px] uppercase tracking-[0.3em] rotate-90 mt-2">Scroll</span>
        </div>
      </section>

      {/* ══════════════════════════════
          BRAND INTRO — The Soul of Wood
      ══════════════════════════════ */}
      <section className="py-32 px-6 bg-[#F7F4EF]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 lg:gap-32 items-center">
          {/* image */}
          <div className="w-full lg:w-[46%] flex-shrink-0">
            <FadeIn>
              <div className="relative">
                <div className="aspect-[3/4] overflow-hidden">
                  <img src="https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1775724961450-113.webp"
                    alt="X Wood Brand" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-[1.5s]" />
                </div>
                {/* badge */}
                <div className="absolute -bottom-8 -right-6 lg:-right-10 w-36 h-36 rounded-full bg-[#C8935A] flex flex-col items-center justify-center text-white shadow-2xl">
                  <span className="font-serif text-3xl leading-none">40+</span>
                  <span className="text-[9px] uppercase tracking-widest mt-1 text-white/80">พันธุ์ไม้หายาก</span>
                </div>
                {/* corner accent */}
                <div className="absolute -top-4 -left-4 w-24 h-24 border border-[#C8935A]/30" />
              </div>
            </FadeIn>
          </div>

          {/* text */}
          <div className="w-full lg:w-1/2">
            <FadeIn delay={150}>
              <Tag text="Who We Are — Our Identity" />
              <h2 className="font-serif text-[#1C1917] leading-snug mb-8" style={{ fontSize: 'clamp(1.9rem, 3.5vw, 3.5rem)' }}>
                เราคือใคร<br />
                <span className="italic font-light text-zinc-500">ตัวตนและจิตวิญญาณของเรา</span>
              </h2>
              <div className="border-l-2 border-[#C8935A]/40 pl-7 space-y-5 text-zinc-500 font-light text-sm md:text-base leading-loose mb-10">
                <p>
                  เราเริ่มต้นจากแก่นแท้ของต้นไม้ คุณค่าที่สำคัญที่สุดของมันคือความเป็นธรรมชาติ
                  ต้นไม้เติบโตอย่างเป็นธรรมชาติตลอดช่วงเวลายาวนาน เราไม่รบกวนรูปทรง ลวดลาย
                  หรือร่องรอยตามธรรมชาติของไม้
                </p>
                <p>
                  เราผ่านการการดึงแห้งและอบคุณภาพชิ้นงาน ภายใต้แรงบันดาลใจจากธรรมชาติผ่านฝีมือ
                  ของช่าง เพื่อสร้างสรรค์เฟอร์นิเจอร์ไม้แผ่นที่เป็นธรรมชาติอย่างแท้จริง และถ่ายทอด
                  คุณค่าจากรุ่นสู่รุ่น
                </p>
              </div>

              {/* stats row */}
              <div className="flex flex-wrap gap-8 mb-10">
                {[
                  { n: "256", l: "ช่างฝีมือ" },
                  { n: "9,000", l: "ตร.ม. คลังสินค้า" },
                  { n: "10,000+", l: "แผ่นไม้ในสต็อก" },
                  { n: "<12%", l: "ความชื้นมาตรฐาน" },
                ].map(s => (
                  <div key={s.l} className="text-center">
                    <p className="font-serif text-3xl text-[#1C1917]">{s.n}</p>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5">{s.l}</p>
                  </div>
                ))}
              </div>

              <Btn href="/about" label="อ่านเรื่องราวของเรา" />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          COLLECTIONS
      ══════════════════════════════ */}
      <section className="bg-white py-32 border-t border-[#E8E2D9]">
        <div className="max-w-[1700px] mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-20">
              <Tag text="Our Collections" />
              <h2 className="font-serif text-[#1C1917] mb-3" style={{ fontSize: 'clamp(2rem, 4vw, 4rem)' }}>คอลเลกชันของเรา</h2>
              <p className="text-zinc-400 text-xs uppercase tracking-[0.35em]">ไม้แผ่นธรรมชาติ & ศิลปะเรซินสมัยใหม่</p>
            </div>
          </FadeIn>

          {/* Solid Wood */}
          <div className="mb-28">
            <FadeIn>
              <div className="flex items-end justify-between mb-10 pb-4 border-b border-[#E8E2D9]">
                <div>
                  <h3 className="font-serif italic text-2xl md:text-3xl text-[#1C1917]">01. โต๊ะไม้แผ่นธรรมชาติ</h3>
                  <p className="text-xs text-zinc-400 mt-1">Solid Live-Edge Wood Slabs</p>
                </div>
                <Link href="/woodslab" className="text-xs uppercase tracking-widest text-[#C8935A] hover:text-[#1C1917] transition-colors">ดูทั้งหมด →</Link>
              </div>
            </FadeIn>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5">
              {SOLID.map((w, i) => (
                <FadeIn key={i} delay={i * 80}>
                  <Link href="/woodslab" className="group relative aspect-[2/3] overflow-hidden bg-zinc-100 block">
                    <Image src={w.img} alt={w.en} fill unoptimized className="object-cover transition-transform duration-[1.8s] group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-[9px] text-white/60 uppercase tracking-widest mb-1">{w.note}</p>
                      <p className="text-white font-serif text-xl italic leading-tight">{w.th}</p>
                      <p className="text-white/60 text-[10px] mt-0.5">{w.en}</p>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>

          {/* Resin Art */}
          <div>
            <FadeIn>
              <div className="flex items-end justify-between mb-10 pb-4 border-b border-[#E8E2D9]">
                <div>
                  <h3 className="font-serif italic text-2xl md:text-3xl text-[#1C1917]">02. ศิลปะเรซิน Crystal</h3>
                  <p className="text-xs text-zinc-400 mt-1">Crystal Resin Art — Modern Fusion</p>
                </div>
                <Link href="/woodslab" className="text-xs uppercase tracking-widest text-[#C8935A] hover:text-[#1C1917] transition-colors">ดูทั้งหมด →</Link>
              </div>
            </FadeIn>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5">
              {RESIN.map((w, i) => (
                <FadeIn key={i} delay={i * 80}>
                  <Link href="/woodslab" className="group relative aspect-[2/3] overflow-hidden bg-zinc-100 block">
                    <Image src={w.img} alt={w.en} fill unoptimized className="object-cover transition-transform duration-[1.8s] group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-[9px] text-white/60 uppercase tracking-widest mb-1">Epoxy & Wood</p>
                      <p className="text-white font-serif text-xl italic leading-tight">{w.th}</p>
                      <p className="text-white/60 text-[10px] mt-0.5">{w.en}</p>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          WABI-SABI PHILOSOPHY
      ══════════════════════════════ */}
      <section className="py-40 px-6 bg-[#1C1917] text-[#DCD3C8] overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 79px,#fff 79px,#fff 80px),repeating-linear-gradient(90deg,transparent,transparent 79px,#fff 79px,#fff 80px)' }} />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="w-full lg:w-1/2">
              <FadeIn>
                <Tag text="Design Philosophy" />
                <h2 className="font-serif leading-snug mb-8 text-white" style={{ fontSize: 'clamp(1.8rem, 3vw, 3rem)' }}>
                  THE WABI-SABI<br />
                  <span className="italic text-[#C8935A]">Aesthetics of a Single Board</span>
                </h2>
                <p className="text-zinc-400 font-light leading-loose text-sm md:text-base mb-6">
                  เราไม่ได้หยุดอยู่เพียงเฉดสีธรรมชาติ แต่สร้างมิติใหม่ผ่านกระบวนการทำสีอันเป็นเอกลักษณ์
                  ของ X Wood เพื่อให้ไม้แต่ละชนิดได้แสดงปฏิกิริยาของสีที่เหมาะสมตามคุณสมบัติของไม้นั้น
                </p>
                <p className="text-zinc-400 font-light leading-loose text-sm md:text-base mb-10">
                  โดยยังคงรักษาเสน่ห์ของลวดลายไม้ไว้ครบถ้วนพร้อมเติมเต็มด้วยเอฟเฟกต์สีแบบวาบิ-ซาบิ
                  ทั้งงดงามเฉพาะตัว — ความไม่สมบูรณ์คือความสมบูรณ์แบบที่แท้จริง
                </p>
                <blockquote className="border-l-2 border-[#C8935A] pl-6 text-white/80 font-serif italic text-lg">
                  "ไม้แผ่นก็เหมือนมนุษย์ ต่างมีบุคลิกเฉพาะตัว<br />
                  เฉดสี ปมไม้ หรือร่องรอยแห่งกาลเวลา"
                </blockquote>
              </FadeIn>
            </div>
            <div className="w-full lg:w-1/2">
              <FadeIn delay={200}>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    "https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1775724644851-261.webp",
                    "https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1775724653183-509.webp",
                    "https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1775724663183-719.webp",
                    "https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1775726859141-273.webp",
                    "https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1775726887638-45.webp",
                    "https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1775725984128-23.webp",
                  ].map((src, i) => (
                    <div key={i} className="aspect-square overflow-hidden">
                      <img src={src} alt="" className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000 opacity-80 hover:opacity-100" />
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          SPECIES MARQUEE
      ══════════════════════════════ */}
      <section className="py-16 bg-[#F0EBE3] border-y border-[#DDD6C9] overflow-hidden">
        <FadeIn>
          <p className="text-center text-[9px] uppercase tracking-[0.5em] text-[#C8935A] mb-6">Our Material Heritage — Global Collection</p>
        </FadeIn>
        <div className="flex gap-8 whitespace-nowrap" style={{ animation: 'marquee 28s linear infinite' }}>
          {[...SPECIES, ...SPECIES].map((s, i) => (
            <span key={i} className="text-[#8B7355] text-xs uppercase tracking-widest font-light flex items-center gap-8">
              {s} <span className="text-[#C8935A]">◆</span>
            </span>
          ))}
        </div>
        <style>{`@keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }`}</style>
      </section>

      {/* ══════════════════════════════
          MANUFACTURING PROCESS
      ══════════════════════════════ */}
      <section className="py-32 px-6 bg-[#F7F4EF]">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="text-center mb-20">
              <Tag text="Craftsmanship & Precision — Behind the Scenes" />
              <h2 className="font-serif text-[#1C1917]" style={{ fontSize: 'clamp(1.8rem, 3.2vw, 3.2rem)' }}>
                กระบวนการผลิตด้วยมาตรฐานสูงสุด
              </h2>
            </div>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STEPS.map((s, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="border border-[#DDD6C9] bg-white p-8 group hover:border-[#C8935A] transition-colors duration-500">
                  <p className="font-serif text-5xl text-[#DDD6C9] group-hover:text-[#C8935A] transition-colors duration-500 mb-6 leading-none">{s.n}</p>
                  <p className="font-serif text-lg text-[#1C1917] mb-2">{s.th}</p>
                  <p className="text-[10px] text-[#C8935A] uppercase tracking-widest mb-4">{s.en}</p>
                  <p className="text-zinc-500 text-xs leading-loose font-light">{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          PARALLAX — Possibilities
      ══════════════════════════════ */}
      <section className="relative py-52 px-6 bg-fixed bg-cover bg-center"
        style={{ backgroundImage: `url("https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1775726986607-180.webp")` }}>
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
          <FadeIn>
            <Tag text="Infinite Possibilities — Beyond Just a Table" />
            <h2 className="font-serif text-white leading-snug mb-6" style={{ fontSize: 'clamp(2.2rem, 5vw, 5rem)' }}>
              ไม้แผ่นหนึ่งแผ่น<br />
              <span className="italic text-[#C8935A]">ความเป็นไปได้ไม่สิ้นสุด</span>
            </h2>
            <p className="text-white/60 font-light text-sm md:text-base max-w-lg mx-auto mb-4 leading-relaxed">
              โต๊ะทาน, โต๊ะชา, เคาน์เตอร์, บาร์, ชั้นวาง, ประตู, ผนัง — ทุกพื้นที่ในบ้านของคุณ
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-12 text-[10px] text-white/50 uppercase tracking-widest">
              {["Dining Table", "Coffee Table", "Bar Top", "Counter", "Shelf", "Partition", "Door", "Desk"].map(t => (
                <span key={t} className="border border-white/10 px-3 py-1">{t}</span>
              ))}
            </div>
            <Btn href="/woodslab" label="ดูโปรเจกต์ทั้งหมด" dark />
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════
          PROJECT GALLERY
      ══════════════════════════════ */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-20">
              <Tag text="Project Gallery — Dreams Made Real" />
              <h2 className="font-serif text-[#1C1917]" style={{ fontSize: 'clamp(1.8rem, 3.2vw, 3.2rem)' }}>
                ผลงานจากลูกค้าของเรา
              </h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
            {PROJECTS.map((p, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="group relative overflow-hidden bg-zinc-100 aspect-[4/3]">
                  <img src={p.img} alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-[1.8s] group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-7">
                    <p className="text-[#C8935A] text-[9px] uppercase tracking-widest mb-1">{p.client}</p>
                    <h3 className="font-serif text-white text-xl mb-1">{p.titleTH}</h3>
                    <p className="text-white/60 text-xs italic mb-3">{p.title}</p>
                    <p className="text-white/70 text-xs font-light leading-relaxed max-w-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-3 group-hover:translate-y-0">{p.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          CUSTOMIZATION JOURNEY
      ══════════════════════════════ */}
      <section className="py-32 px-6 bg-[#F0EBE3]">
        <div className="max-w-5xl mx-auto text-center">
          <FadeIn>
            <Tag text="Your Design Roadmap — The Bespoke Journey" />
            <h2 className="font-serif text-[#1C1917] mb-16" style={{ fontSize: 'clamp(1.8rem, 3vw, 3rem)' }}>
              เส้นทางสู่ไม้แผ่นในฝันของคุณ
            </h2>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 relative">
            <div className="absolute top-9 left-[12.5%] right-[12.5%] h-[1px] bg-[#DDD6C9] hidden md:block" />
            {[
              { n: "01", th: "บอกความต้องการ", en: "Share Your Vision" },
              { n: "02", th: "เลือกไม้แผ่น", en: "Select Your Slab" },
              { n: "03", th: "ออกแบบและยืนยัน", en: "Design & Confirm" },
              { n: "04", th: "ส่งมอบถึงบ้าน", en: "Delivered to You" },
            ].map((s, i) => (
              <FadeIn key={i} delay={i * 120}>
                <div className="flex flex-col items-center px-4 py-8">
                  <div className="w-18 h-18 w-16 h-16 rounded-full border-2 border-[#C8935A] flex items-center justify-center mb-6 bg-white relative z-10">
                    <span className="font-serif text-[#C8935A] text-xl">{s.n}</span>
                  </div>
                  <p className="font-serif text-base text-[#1C1917] mb-1">{s.th}</p>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wider">{s.en}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={300}>
            <div className="mt-12">
              <Btn href="/contact" label="เริ่มสั่งทำวันนี้" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════
          WOOD CARE
      ══════════════════════════════ */}
      <section className="py-32 px-6 bg-[#F7F4EF] border-t border-[#E8E2D9]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <FadeIn>
            <div className="aspect-[3/4] overflow-hidden">
              <img src="https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1775724436708-497.webp"
                alt="Wood Care" className="w-full h-full object-cover hover:scale-105 transition-transform duration-[1.5s]" />
            </div>
          </FadeIn>
          <FadeIn delay={150}>
            <Tag text="Maintenance Instructions — After-Sales Service" />
            <h2 className="font-serif text-[#1C1917] mb-10" style={{ fontSize: 'clamp(1.8rem, 2.8vw, 2.8rem)' }}>
              การดูแลรักษา<br />
              <span className="italic font-light text-zinc-500">ไม้แผ่นของคุณ</span>
            </h2>
            <div className="space-y-7">
              {[
                { title: "ควบคุมความชื้นในห้อง", desc: "รักษาความชื้น 55–65% เพื่อป้องกันการแตกร้าว โดยเฉพาะในฤดูหนาวหรืออากาศแห้ง" },
                { title: "เคลือบน้ำมันพืชธรรมชาติ", desc: "ช่วยคงสัมผัสและลวดลายธรรมชาติของเนื้อไม้ปีละ 1–2 ครั้งตามแนวลายไม้" },
                { title: "รอยขีดข่วนซ่อมได้", desc: "รอยเล็กใช้กระดาษทรายละเอียด รอยหนักติดต่อช่างผู้เชี่ยวชาญ รับประกัน 3 ปี" },
                { title: "ธรรมชาติคือเอกลักษณ์", desc: "รอยแตกเล็กน้อยตามฤดูกาลเป็นลักษณะตามธรรมชาติ ไม่ใช่ความเสียหาย" },
              ].map((c, i) => (
                <div key={i} className="flex gap-5 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C8935A] mt-2.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#1C1917] text-sm mb-1">{c.title}</p>
                    <p className="text-zinc-500 text-xs font-light leading-loose">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════
          EVENTS
      ══════════════════════════════ */}
      <section className="py-20 px-6 bg-[#1C1917]">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <Tag text="Brand Events — Our Presence" />
              <h2 className="font-serif text-white text-2xl">เราพบกันได้ที่นิทรรศการระดับโลก</h2>
            </div>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { year: "2021", event: "Guangzhou\nDesign Week" },
              { year: "2022", event: "Shanghai\nFurniture Fair" },
              { year: "2023", event: "Guangzhou\nDesign Week" },
              { year: "2024", event: "Xiamen\nTea Expo" },
            ].map((e, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div className="border border-white/10 p-6 hover:border-[#C8935A] transition-colors duration-500 text-center">
                  <p className="font-serif text-4xl text-[#C8935A] mb-3">{e.year}</p>
                  <p className="text-white/60 text-xs uppercase tracking-widest leading-relaxed whitespace-pre-line">{e.event}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          CTA — Visit Us
      ══════════════════════════════ */}
      <section className="bg-[#0d0b09] text-[#DCD3C8] py-32 px-6">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 space-y-8">
            <Tag text="Visit Us — Experience the Texture" />
            <h2 className="font-serif text-white leading-snug" style={{ fontSize: 'clamp(2rem, 4vw, 4rem)' }}>
              สัมผัส<br />
              <span className="italic text-[#C8935A]">ความจริงของไม้</span>
            </h2>
            <div className="border-l border-white/10 pl-6 space-y-3 text-zinc-400 font-light text-sm leading-loose">
              <p>🏢 ชั้น 13 อาคาร WanNeng, No. 10 Chuangye Road<br />Fuzhou High-tech Zone, China</p>
              <p>📍 WOODDEN SHOWROOM<br />ชั้น 2 Design Village, ถ.นวมินทร์ กรุงเทพฯ</p>
            </div>
            <div className="flex flex-wrap gap-3 pt-4">
              <Btn href="/contact" label="นัดเข้าเยี่ยมชม" dark />
              <Btn href="/woodslab" label="ดูสินค้าออนไลน์" dark />
            </div>
          </div>
          <div className="w-full lg:w-1/2 h-[440px] relative overflow-hidden group">
            <img src="https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1775724369710-636.webp"
              alt="Showroom" className="w-full h-full object-cover transition-transform duration-[1.8s] group-hover:scale-110 opacity-65 group-hover:opacity-90" />
            <div className="absolute inset-0 border border-white/8 m-5 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          FOOTER
      ══════════════════════════════ */}
      <footer className="bg-[#070605] text-zinc-500 py-12 border-t border-white/5 text-center text-[10px] tracking-widest uppercase">
        <div className="flex justify-center gap-8 mb-8">
          <a href="https://line.me/R/ti/p/@doy2013q?oat__id=35314" target="_blank" rel="noopener noreferrer" className="hover:text-[#C8935A] transition-colors duration-300 p-2"><FaLine className="w-5 h-5" /></a>
          <a href="https://www.facebook.com/wooddenthailand" target="_blank" rel="noopener noreferrer" className="hover:text-[#C8935A] transition-colors duration-300 p-2"><FaFacebookF className="w-5 h-5" /></a>
          <a href="tel:+66626670009" className="hover:text-[#C8935A] transition-colors duration-300 p-2"><FaPhone className="w-5 h-5" /></a>
        </div>
        <p className="mb-1">© 2026 Woodslabs Industry Co., Ltd. — BY WOODDEN™</p>
        <p className="mt-1 normal-case opacity-40 text-[9px]">woodenthailand@woodslabs.com.cn | +86 177 2080 3060 | Sales@wooddenthailand.com</p>
        <p className="mt-1 normal-case opacity-30 text-[9px]">"making every piece of wood warm the world."</p>
      </footer>

    </div>
  );
}
