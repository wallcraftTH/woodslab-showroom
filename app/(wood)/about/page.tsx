'use client'

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

/* ─── FadeIn helper ─── */
const FadeIn = ({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const [v, setV] = useState(false);
  const r = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.08 });
    if (r.current) obs.observe(r.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={r} style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-[1100ms] ease-out ${v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}>
      {children}
    </div>
  );
};

const Tag = ({ text }: { text: string }) => (
  <p className="text-[#C8935A] text-[9px] font-bold uppercase tracking-[0.5em] mb-5">{text}</p>
);

const Divider = () => <div className="w-12 h-[1px] bg-[#C8935A] my-10 opacity-60" />;

/* ─── Data ─── */
const HERO_IMGS = [
  "https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1775724369710-636.webp",
  "https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1775724626723-645.webp",
  "https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1775724663183-719.webp",
];

const STORIES = [
  {
    tag: "01 — The Journey",
    title: "ค้นหาไม้แผ่นที่สมบูรณ์แบบ",
    titleEn: "Finding The Perfect Slab",
    desc: "เพื่อดึงเสน่ห์เฉพาะตัวของต้นไม้แต่ละต้นออกมาอย่างเต็มที่และสร้างเฟอร์นิเจอร์ไม้แผ่นที่อบอุ่นและคงทนตลอดกาล X Wood ค้นหาและคัดเลือกไม้อย่างพิถีพิถัน เราสำรวจป่าและซัพพลายเออร์ไม้ชั้นนำทั่วโลก หวังจะค้นพบซุงหายากอายุหลายร้อยปีที่เหมาะสำหรับการสร้างไม้แผ่นใหญ่ ด้วยความจริงใจและความอดทน เราคัดเลือกจากซุงนับไม่ถ้วนที่มีรูปทรงและรูปแบบต่างๆ ทั้งหมดนี้เพื่อค้นหาไม้ที่สมบูรณ์แบบชิ้นเดียว",
    img: "https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1775724436708-497.webp",
    reverse: false,
  },
  {
    tag: "02 — Philosophy",
    title: "ธรรมชาติคือเอกลักษณ์",
    titleEn: "Natural Living",
    desc: "เราเริ่มต้นจากแก่นแท้ของต้นไม้ คุณค่าที่สำคัญที่สุดของมันคือความเป็นธรรมชาติ ต้นไม้เติบโตอย่างเป็นธรรมชาติตลอดช่วงเวลายาวนาน และเรามุ่งมั่นที่จะรักษาธรรมชาติอันหายากและล้ำค่านี้ไว้ เราไม่รบกวนรูปทรง ลวดลาย หรือร่องรอยตามธรรมชาติของไม้ แต่เราเติมเต็มด้วยภาษาการออกแบบที่ได้รับแรงบันดาลใจจากธรรมชาติผ่านฝีมือของช่าง สร้างพื้นที่ที่กลมกลืนระหว่างคนและธรรมชาติ",
    img: "https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1775724644851-261.webp",
    reverse: true,
  },
  {
    tag: "03 — Craftsmanship",
    title: "ภาษาการออกแบบเฉพาะตัว",
    titleEn: "Unique Design Language",
    desc: "เรามุ่งมอบประสบการณ์ที่ไม่เหมือนใครให้แก่ผู้ใช้ จากซุงชิ้นเดียวสู่ไม้แผ่นเดียว ไม่ว่าจะเป็นรูปทรง เนื้อสัมผัส สี ขอบธรรมชาติ หรือกลิ่น แต่ละชิ้นมีบุคลิกเฉพาะตัวของมัน ไม่เคยเหมือนกัน ช่างฝีมือที่มีประสบการณ์ของเราทุ่มเทอย่างไม่รู้จักเหน็ดเหนื่อย รักษาคุณลักษณะตามธรรมชาติของต้นไม้ไว้ในขณะที่ผสมผสานการออกแบบส่วนตัวที่เหมาะสมที่สุดสำหรับแต่ละแผ่น",
    img: "https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1775724653183-509.webp",
    reverse: false,
  },
  {
    tag: "04 — Legacy",
    title: "ส่งต่อจากรุ่นสู่รุ่น",
    titleEn: "Passing It On",
    desc: "หากความทรงจำของไม้แผ่นหนึ่งมีน้ำหนัก มันคงหนักอย่างไม่ต้องสงสัย มันเดินทางผ่านกาลเวลาอันยาวนานมาสู่ชีวิตประจำวัน แบกรับการเดินทางอันยิ่งใหญ่ของต้นไม้อายุร้อยปี ความทรงจำทุกชั่วขณะแปรเปลี่ยนเป็นรอยของวงปี จากนั้นกลายเป็นไม้แผ่น เข้าสู่ชีวิตของผู้คน ครอบครัวรับประทานอาหารร่วมกันที่โต๊ะ เด็กทำการบ้านที่โต๊ะทำงาน บ่ายที่แสนสบายกับชาน้ำ... ทุกฉากชีวิตคลี่คลายอย่างเงียบๆ บนไม้แผ่นเดียว",
    img: "https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1775724638171-371.webp",
    reverse: true,
  },
];

const PROCESS = [
  { n: "01", th: "คัดเลือกซุง", en: "Log Selection & Grading", desc: "ผู้เชี่ยวชาญประเมินลายเนื้อไม้ ปม ร่องรอยธรรมชาติ และคัดทิ้งไม้ที่มีตำหนิ" },
  { n: "02", th: "อบแห้ง 2–10 ปี", en: "Long-Term Kiln Drying", desc: "ใช้เตาอบความถี่สูงระดับอุตสาหกรรม ควบคุมความชื้นให้ต่ำกว่า 12% มาตรฐานสูงสุดในอุตสาหกรรม" },
  { n: "03", th: "ตัดและขึ้นรูป", en: "Precision Shaping & CNC", desc: "ตัดด้วย CNC ความแม่นยำสูง รักษาขอบธรรมชาติ ปรับแต่งขนาดตามออเดอร์ลูกค้า" },
  { n: "04", th: "ขัดผิว 10–20 รอบ", en: "Multi-Pass Sanding", desc: "ขัดหลายรอบจากหยาบสู่ละเอียด รักษาเนื้อสัมผัสดิบแท้ตามธรรมชาติของไม้" },
  { n: "05", th: "เคลือบน้ำมันพืช", en: "Natural Oil Coating", desc: "เคลือบด้วยน้ำมันแว็กซ์จากพืชปลอดสาร ปลอดภัยและเป็นมิตรต่อสิ่งแวดล้อม" },
  { n: "06", th: "ตรวจสอบ 100%", en: "Final Quality Inspection", desc: "ตรวจทุกชิ้นก่อนจัดส่ง บันทึกข้อมูลไม้เพื่อการดูแลรักษาระยะยาว" },
];

const CERTS = ["PEFC", "ISO 9001", "SGS", "EPH"];

const EVENTS = [
  { y: "2021", e: "Guangzhou Design Week", city: "Guangzhou, China" },
  { y: "2022", e: "Shanghai International\nFurniture Fair", city: "Shanghai, China" },
  { y: "2023", e: "Guangzhou Design Week", city: "Guangzhou, China" },
  { y: "2024", e: "Xiamen Tea Expo", city: "Xiamen, China" },
];

export default function AboutPage() {
  const [hi, setHi] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setHi(i => (i + 1) % HERO_IMGS.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-[#F7F4EF] text-[#1C1917] font-sans selection:bg-[#C8935A] selection:text-white min-h-screen">

      {/* ══ HERO ══ */}
      <section className="relative w-full h-[75vh] md:h-screen overflow-hidden bg-[#0d0b09]">
        {HERO_IMGS.map((src, i) => (
          <img key={i} src={src} alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out ${i === hi ? 'opacity-60' : 'opacity-0'}`} />
        ))}
        {/* 2-layer gradient — แสงมาจากขวา เหมือนหน้าหลัก */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <FadeIn>
            <p className="text-[#C8935A] text-[9px] uppercase tracking-[0.6em] mb-6 font-medium">BY WOODDEN™ — Since 2016</p>
            <p className="text-white/60 text-xs md:text-sm uppercase tracking-[0.4em] font-light">
              Our Story — Crafting Nature's Legacy
            </p>
          </FadeIn>
        </div>

        {/* dot nav */}
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {HERO_IMGS.map((_, i) => (
            <button key={i} onClick={() => setHi(i)}
              className={`rounded-full transition-all duration-500 ${i === hi ? 'bg-[#C8935A] w-7 h-1.5' : 'bg-white/30 w-1.5 h-1.5'}`} />
          ))}
        </div>

        {/* scroll hint */}
        <div className="absolute bottom-7 right-8 flex flex-col items-center gap-2 opacity-40">
          <div className="w-[1px] h-14 bg-white animate-pulse" />
          <span className="text-white text-[8px] uppercase tracking-[0.3em] rotate-90 mt-2">Scroll</span>
        </div>
      </section>

      {/* ══ OPENING QUOTE ══ */}
      <section className="py-32 px-6 bg-[#F7F4EF]">
        <FadeIn className="max-w-4xl mx-auto text-center">
          <Tag text="The Philosophy" />
          <h2 className="font-serif text-[#1C1917] leading-snug mb-8"
            style={{ fontSize: 'clamp(1.6rem, 3.5vw, 3.5rem)' }}>
            "เฟอร์นิเจอร์ที่อยู่เคียงข้างทุกช่วงเวลา<br className="hidden md:block" />
            <span className="italic text-zinc-400 font-light"> มอบความอบอุ่นในทุกสายสัมพันธ์"</span>
          </h2>
          <p className="text-zinc-500 font-light leading-loose text-sm md:text-lg max-w-2xl mx-auto">
            อายุการใช้งานของไม้แผ่นหนึ่งไม้ — เราไม่อาจคำนวณหรือกำหนดได้อย่างแน่ชัด
            การสร้างโต๊ะไม้แผ่นเดียวที่ลูกค้าสามารถใช้งานได้ตลอดไปคือเป้าหมายที่ X Wood มุ่งมั่นเสมอมา
            เราหวังว่าไม้แผ่นของเราจะสามารถส่งต่อคุณค่าจากรุ่นสู่รุ่น
          </p>
          <Divider />
          <p className="text-[#C8935A] text-sm font-serif italic">
            "making every piece of wood warm the world."
          </p>
        </FadeIn>
      </section>

      {/* ══ STORY SECTIONS — ZigZag ══ */}
      {STORIES.map((s, i) => (
        <section key={i} className={`flex flex-col ${s.reverse ? 'md:flex-row-reverse' : 'md:flex-row'} min-h-[600px] md:h-[680px]`}>
          {/* image */}
          <div className="w-full md:w-1/2 h-[50vw] md:h-full overflow-hidden relative group">
            <img src={s.img} alt={s.title}
              className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700" />
            {/* number overlay */}
            <div className="absolute bottom-6 right-6 font-serif text-white/20 text-8xl leading-none select-none pointer-events-none">
              {String(i + 1).padStart(2, '0')}
            </div>
          </div>
          {/* text */}
          <div className={`w-full md:w-1/2 flex items-center ${i % 2 === 0 ? 'bg-white' : 'bg-[#F7F4EF]'}`}>
            <div className="p-10 md:p-20 lg:p-24 w-full">
              <FadeIn>
                <Tag text={s.tag} />
                <h3 className="font-serif text-[#1C1917] leading-snug mb-2"
                  style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.8rem)' }}>
                  {s.title}
                </h3>
                <p className="text-xs text-zinc-400 italic mb-8 tracking-wider">{s.titleEn}</p>
                <p className="text-zinc-500 font-light leading-[1.95] text-sm md:text-[0.95rem] text-justify">
                  {s.desc}
                </p>
              </FadeIn>
            </div>
          </div>
        </section>
      ))}

      {/* ══ STATS ══ */}
      <section className="py-0 bg-[#1C1917] overflow-hidden">
        {/* top image strip */}
        <div className="w-full h-64 md:h-80 relative overflow-hidden">
          <img src="https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1775724961450-113.webp"
            alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1C1917]" />
        </div>

        <div className="max-w-6xl mx-auto px-6 pb-24 -mt-10 relative z-10">
          {/* stats row */}
          <FadeIn>
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/8 border border-white/8 mb-20">
              {[
                { n: "256", label: "ช่างฝีมือมืออาชีพ", sub: "Professional Artisans" },
                { n: "26,500 ตร.ม.", label: "พื้นที่โรงงาน", sub: "Factory Area" },
                { n: "10,000+", label: "แผ่นไม้ในสต็อก", sub: "Slabs in Stock" },
                { n: "40+", label: "พันธุ์ไม้หายาก", sub: "Rare Wood Species" },
              ].map((s, i) => (
                <div key={i} className="px-8 py-10 text-center group hover:bg-white/4 transition-colors duration-500">
                  <p className="font-serif text-3xl md:text-4xl text-[#C8935A] leading-none mb-3">{s.n}</p>
                  <p className="text-white text-sm font-light mb-1">{s.label}</p>
                  <p className="text-white/30 text-[9px] uppercase tracking-widest">{s.sub}</p>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* certs */}
          <FadeIn delay={150}>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <p className="text-white/30 text-[9px] uppercase tracking-[0.5em] mb-2 text-center md:text-left">มาตรฐานสากล</p>
                <p className="text-white/60 text-[9px] uppercase tracking-[0.4em]">International Certifications</p>
              </div>
              <div className="w-[1px] h-10 bg-white/10 hidden md:block" />
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {CERTS.map(c => (
                  <span key={c} className="border border-white/10 px-5 py-2 text-white/50 text-[10px] tracking-[0.3em] uppercase font-light hover:border-[#C8935A] hover:text-[#C8935A] transition-colors duration-300 cursor-default">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ MANUFACTURING PROCESS ══ */}
      <section className="py-32 px-6 bg-[#F7F4EF]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

            {/* left — heading */}
            <div className="lg:w-[320px] flex-shrink-0">
              <FadeIn>
                <Tag text="Craftsmanship — Behind the Scenes" />
                <h2 className="font-serif text-[#1C1917] leading-snug mb-6"
                  style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.8rem)' }}>
                  กระบวนการ<br />
                  <span className="italic font-light text-zinc-400">สร้างสรรค์</span>
                </h2>
                <p className="text-zinc-500 text-sm font-light leading-loose mb-8">
                  ด้วยคลังสินค้า 9,000 ตร.ม. สต็อกกว่า 10,000 ชิ้นจากซัพพลายเออร์ชั้นนำ
                  ในยุโรป แอฟริกา อเมริกา และเอเชียตะวันออกเฉียงใต้
                </p>
                <div className="w-10 h-[1px] bg-[#C8935A] opacity-60" />
              </FadeIn>
            </div>

            {/* right — steps */}
            <div className="flex-1">
              <div className="space-y-0">
                {PROCESS.map((p, i) => (
                  <FadeIn key={i} delay={i * 60}>
                    <div className="flex gap-6 md:gap-10 py-7 border-b border-[#E8E2D9] group hover:border-[#C8935A] transition-colors duration-500 last:border-0">
                      <div className="flex-shrink-0 pt-1">
                        <p className="font-serif text-2xl text-[#DDD6C9] group-hover:text-[#C8935A] transition-colors duration-500 leading-none w-10 text-right">{p.n}</p>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-3 mb-2">
                          <p className="font-serif text-lg text-[#1C1917]">{p.th}</p>
                          <p className="text-[9px] text-[#C8935A] uppercase tracking-widest hidden sm:block">{p.en}</p>
                        </div>
                        <p className="text-zinc-500 text-sm font-light leading-relaxed">{p.desc}</p>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SOURCING ══ */}
      <section className="py-28 px-6 bg-[#1C1917]">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div>
                <Tag text="Global Material Heritage" />
                <h2 className="font-serif text-white" style={{ fontSize: 'clamp(1.8rem, 3vw, 3rem)' }}>
                  แหล่งไม้หายาก<br />
                  <span className="italic text-[#C8935A]">จากทั่วโลก</span>
                </h2>
              </div>
              <p className="text-white/40 text-xs font-light max-w-xs leading-loose">
                เราคัดสรรพันธุ์ไม้มากกว่า 40 ชนิด จาก 4 ภูมิภาคหลักของโลก
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
            {[
              { region: "ยุโรป", en: "Europe", woods: ["European Oak", "Japanese Zelkova", "French Poplar", "European Beech"], img: "https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1775725297620-505.webp" },
              { region: "อเมริกา", en: "Americas", woods: ["Black Walnut", "American Ash", "American Cherry", "American Red Oak"], img: "https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1775725287327-673.webp" },
              { region: "แอฟริกา", en: "Africa", woods: ["African Bubinga", "African Zebrawood", "African Ebony", "African Rosewood"], img: "https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1775726887638-45.webp" },
              { region: "เอเชีย", en: "Asia", woods: ["Burmese Teak", "Rain Tree", "Yakusugi Cedar", "Merbau"], img: "https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1775725304427-139.webp" },
            ].map((r, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div className="group relative overflow-hidden bg-[#1C1917] cursor-default">
                  {/* bg image */}
                  <div className="h-48 overflow-hidden">
                    <img src={r.img} alt={r.region}
                      className="w-full h-full object-cover opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-[1.5s]" />
                  </div>
                  <div className="p-6">
                    <p className="font-serif text-white text-xl mb-0.5">{r.region}</p>
                    <p className="text-[#C8935A] text-[9px] uppercase tracking-[0.4em] mb-5">{r.en}</p>
                    <ul className="space-y-2">
                      {r.woods.map(w => (
                        <li key={w} className="flex items-center gap-2 text-white/40 text-[10px] uppercase tracking-wider font-light group-hover:text-white/60 transition-colors duration-500">
                          <span className="w-3 h-[1px] bg-[#C8935A] opacity-60 flex-shrink-0" />
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BRAND EVENTS ══ */}
      <section className="py-28 px-6 bg-[#F7F4EF]">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-16">
            <Tag text="Brand Events — Our Global Presence" />
            <h2 className="font-serif text-[#1C1917] text-2xl md:text-4xl">เราพบกันที่เวทีโลก</h2>
          </FadeIn>
          <div className="relative">
            {/* timeline line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#DDD6C9] hidden md:block" />
            <div className="space-y-8">
              {EVENTS.map((e, i) => (
                <FadeIn key={i} delay={i * 100}>
                  <div className={`flex flex-col md:flex-row gap-6 items-center ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className={`w-full md:w-[45%] ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <p className="font-serif text-4xl text-[#C8935A]">{e.y}</p>
                      <p className="font-medium text-[#1C1917] mt-1 whitespace-pre-line leading-snug">{e.e}</p>
                      <p className="text-xs text-zinc-400 tracking-widest uppercase mt-1">{e.city}</p>
                    </div>
                    {/* dot */}
                    <div className="hidden md:flex w-4 h-4 rounded-full border-2 border-[#C8935A] bg-[#F7F4EF] flex-shrink-0 relative z-10" />
                    <div className="w-full md:w-[45%]" />
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ WABI-SABI CLOSING ══ */}
      <section className="relative py-52 px-6 bg-fixed bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: `url("https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1775726986607-180.webp")` }}>
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
          <FadeIn>
            <Tag text="Wabi-Sabi — The Beauty of Imperfection" />
            <h2 className="font-serif text-white leading-snug mb-8"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 4.5rem)' }}>
              ความไม่สมบูรณ์<br />
              <span className="italic text-[#C8935A]">คือความงามที่แท้จริง</span>
            </h2>
            <p className="text-white/65 font-light text-sm md:text-base max-w-xl mx-auto leading-loose mb-3">
              ปมไม้ รอยแตก ลายธรรมชาติ — สิ่งเหล่านี้คือเรื่องราวที่ต้นไม้เขียนด้วยตัวเอง
              ตลอดร้อยปีแห่งการเติบโต ทุกร่องรอยคือหลักฐานว่ามันเคยมีชีวิตอยู่จริง
            </p>
            <p className="text-[#C8935A] font-serif italic text-lg mt-6">
              "ไม้แผ่นก็เหมือนมนุษย์ ต่างมีบุคลิกเฉพาะตัว<br />ไม่มีสองชิ้นที่เหมือนกัน"
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="py-32 px-6 bg-[#F7F4EF] text-center">
        <FadeIn>
          <Tag text="Start Your Journey" />
          <h2 className="font-serif text-[#1C1917] mb-4" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3.5rem)' }}>
            พร้อมค้นหาไม้แผ่นของคุณหรือยัง?
          </h2>
          <p className="text-zinc-500 mb-12 max-w-lg mx-auto font-light leading-relaxed text-sm md:text-base">
            สำรวจคอลเลกชันไม้แผ่นหายากของเรา แต่ละชิ้นรอคอยการบอกเล่าเรื่องราวของมัน
            ในบ้านของคุณ
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/woodslab"
              className="group relative inline-flex items-center gap-3 px-10 py-4 border border-[#1C1917]/25 text-[10px] font-bold uppercase tracking-[0.35em] overflow-hidden transition-all duration-500 hover:border-[#C8935A]">
              <span className="absolute inset-0 w-0 group-hover:w-full bg-[#C8935A] transition-all duration-500 ease-out" />
              <span className="relative z-10 group-hover:text-white transition-colors duration-500">สำรวจคอลเลกชัน</span>
            </Link>
            <Link href="/contact"
              className="group relative inline-flex items-center gap-3 px-10 py-4 border border-[#1C1917]/25 text-[10px] font-bold uppercase tracking-[0.35em] overflow-hidden transition-all duration-500 hover:border-[#C8935A]">
              <span className="absolute inset-0 w-0 group-hover:w-full bg-[#C8935A] transition-all duration-500 ease-out" />
              <span className="relative z-10 group-hover:text-white transition-colors duration-500">ติดต่อเรา</span>
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="py-16 bg-[#0a0a0a] text-zinc-500 border-t border-white/5 text-center">
        <p className="font-serif text-white/20 text-4xl tracking-[0.4em] uppercase mb-6">WOODSLABS</p>
        <p className="text-[10px] uppercase tracking-widest mb-1">© 2026 Woodslabs Industry Co., Ltd. — BY WOODDEN™</p>
        <p className="text-[9px] opacity-40 normal-case mt-1">"making every piece of wood warm the world."</p>
      </footer>

    </div>
  );
}
