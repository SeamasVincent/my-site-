'use client';

import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' as const } },
};

export default function Home() {
  return (
    <main className="relative w-full overflow-hidden pt-24">

      {/* ── Ambient Background Lights ── */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#E8F1F8] rounded-full blur-[120px] -z-10 pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.03, 0.07, 0.03] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="fixed bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[#FFBF00] rounded-full blur-[150px] -z-10 pointer-events-none"
      />

{/* ══════════════════════════════════════
    SECTION 1 — HERO
══════════════════════════════════════ */}
<section className="max-w-7xl mx-auto px-6 py-20 md:py-32">

  {/* Mobile layout: headline → image → body → CTA */}
  {/* Desktop layout: two columns side by side */}
  <div className="flex flex-col md:flex-row md:items-center gap-12 md:gap-16">

    {/* LEFT: Copy — on mobile this splits around the image */}
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      className="w-full md:w-1/2 flex flex-col gap-6 md:gap-8"
    >
      {/* Amber divider */}
      <div className="w-12 h-[3px] bg-[#FFBF00] rounded-full" />

      {/* Headline — shows first on both mobile and desktop */}
      <h1 className="font-jakarta font-bold text-4xl md:text-6xl leading-[1.1] tracking-tight text-[#0A1931]">
        A great product deserves a great business.
      </h1>

      {/* Portrait — only visible on mobile, sits between headline and body */}
      <motion.div
  initial={{ opacity: 0, scale: 0.92 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 1, ease: 'easeOut' }}
  className="md:hidden w-full flex justify-center"
>
  <div className="w-full max-w-sm aspect-[4/5] relative bg-[#E8F1F8] rounded-3xl overflow-hidden shadow-xl">
    <img
      src="/FSH.png"
      alt="Seamas Vincent"
      className="object-cover w-full h-full"
    />
  </div>
</motion.div>

      {/* Body copy */}
      <p className="font-newsreader text-xl md:text-2xl leading-relaxed text-[#0A1931]/80">
       Hi, I am Seamas Vincent, business consultant, educator and entrepreneur. For years I have worked with Nigerian founders across for-profit and non-profit organisations, helping them build businesses that are built to last and ready to grow.
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <motion.a
          whileHover={{ scale: 1.02, boxShadow: '0 12px 32px rgba(255,191,0,0.35)' }}
          whileTap={{ scale: 0.98 }}
          href="https://selar.com/y870581q2e"
          className="bg-[#FFBF00] text-[#0A1931] font-jakarta font-bold text-lg px-8 py-4 rounded-full text-center shadow-lg shadow-[#FFBF00]/20"
        >
          Get The Workbook — ₦7,500
        </motion.a>
        <motion.a
          whileHover={{ backgroundColor: '#E8F1F8' }}
          href="#consulting"
          className="border border-[#0A1931] text-[#0A1931] font-jakarta font-bold text-lg px-8 py-4 rounded-full text-center transition-colors"
        >
          Book a Clarity Session
        </motion.a>
      </div>
    </motion.div>

    {/* RIGHT: Portrait — only visible on desktop */}
    <motion.div
  initial={{ opacity: 0, scale: 0.92 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 1, ease: 'easeOut' }}
  className="hidden md:flex w-full md:w-1/2 justify-center"
>
  <div className="w-full max-w-xl aspect-[4/5] relative bg-[#E8F1F8] rounded-3xl overflow-hidden shadow-xl">
    <img
      src="/FSH.png"
      alt="Seamas Vincent"
      className="object-cover w-full h-full"
    />
  </div>
</motion.div>

  </div>
</section>
      {/* ══════════════════════════════════════
          SECTION 2 — THE ECOSYSTEM
      ══════════════════════════════════════ */}
      <section id="ecosystem" className="w-full bg-[#E8F1F8]/40 py-24 md:py-32 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeUp}
            className="mb-16"
          >
            <p className="font-jakarta text-xs font-semibold tracking-[0.12em] uppercase text-[#0A1931]/50 mb-4">
              The Ecosystem
            </p>
            <h2 className="font-jakarta font-bold text-4xl md:text-5xl text-[#0A1931] mb-5">
              Built Intelligently.
            </h2>
            <p className="font-newsreader text-xl text-[#0A1931]/75 max-w-2xl">
              My business development frameworks are not theory. They are the exact operational blueprints I use to scale my own ventures across the African market.
            </p>
          </motion.div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

            {/* Card 1: Sókè — full width */}
            <motion.a
              href="https://www.sokedigital.com/"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeUp}
              whileHover={{ scale: 1.015, y: -4, boxShadow: '0 20px 48px rgba(10,25,49,0.09)' }}
              className="col-span-1 md:col-span-2 lg:col-span-4 bg-[#FCFBF8] rounded-[24px] p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 group cursor-pointer"
            >
              <div className="max-w-2xl">
                <img
                  src="/soke-logo.svg"
                  alt="Sókè Africa"
                  className="h-8 mb-6"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
                <h3 className="font-jakarta font-bold text-3xl mb-3 text-[#0A1931]">Sókè Africa</h3>
                <p className="font-newsreader text-lg text-[#0A1931]/75">
                  A business development firm based in Abuja, Nigeria. We help businesses enter and dominate new markets — from strategy through execution and operational management.
                </p>
              </div>
              <div className="relative overflow-hidden bg-[#0A1931] text-[#FCFBF8] font-jakarta font-semibold px-7 py-3 rounded-full whitespace-nowrap transition-colors duration-300 group-hover:bg-[#FFBF00] group-hover:text-[#0A1931]">
                Explore the Firm
              </div>
            </motion.a>

            {/* Card 2: EEPod — half width */}
            <motion.a
              href="https://bio.site/eepodcast"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.8, ease: 'easeOut', delay: 0.05 } } }}
              whileHover={{ scale: 1.015, y: -4, boxShadow: '0 20px 48px rgba(10,25,49,0.09)' }}
              className="col-span-1 md:col-span-2 lg:col-span-2 bg-[#FCFBF8] rounded-[24px] p-10 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <img
                  src="/eepod-logo.svg"
                  alt="EEPod"
                  className="h-8 mb-6"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
                <h3 className="font-jakarta font-bold text-2xl mb-3 text-[#0A1931]">Everything Entrepreneurship Podcast</h3>
                <p className="font-newsreader text-lg text-[#0A1931]/75 mb-8">
                  A podcast documenting entrepreneurship in Africa — the technical, emotional, and human side of building.
                </p>
              </div>
              <span className="font-jakarta font-bold flex items-center gap-2 text-[#0A1931]">
                <span className="text-lg opacity-60">≋</span>
                Listen to the Podcast
                <span className="group-hover:translate-x-2 transition-transform duration-200">→</span>
              </span>
            </motion.a>

            {/* Card 3: URA — quarter */}
            <motion.a
              href="https://forms.gle/FgmhqiH893kDGcof6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.8, ease: 'easeOut', delay: 0.1 } } }}
              whileHover={{ scale: 1.015, y: -4, boxShadow: '0 20px 48px rgba(10,25,49,0.09)' }}
              className="col-span-1 bg-[#FCFBF8] rounded-[24px] p-8 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <img
                  src="/ura-logo.svg"
                  alt="URA"
                  className="h-6 mb-4"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
                <h3 className="font-jakarta font-bold text-xl mb-3 text-[#0A1931]">URA</h3>
                <p className="font-newsreader text-[#0A1931]/75 mb-6">
                  Digital infrastructure for African e-commerce. Verified vendors, secure payments, and the confidence to buy and sell without the risk.
                </p>
              </div>
              <div className="border border-[#0A1931] group-hover:border-[#FFBF00] group-hover:text-[#FFBF00] transition-colors duration-200 font-jakarta font-semibold text-sm px-4 py-2 rounded-full text-center">
                Join the Waitlist
              </div>
            </motion.a>

            {/* Card 4: Dalo — quarter */}
            <motion.a
              href="https://wa.me/+2347059490151?text=Hi%20Daloteam%2C%20I%20would%20like%20to%20order%20from%20Dalo."
              target="_blank"
              rel="noopener noreferrer"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.8, ease: 'easeOut', delay: 0.15 } } }}
              whileHover={{
                scale: 1.015,
                y: -4,
                backgroundColor: '#fef6e0',
                boxShadow: '0 0 48px rgba(255,191,0,0.15), 0 20px 40px rgba(10,25,49,0.08)',
              }}
              className="col-span-1 bg-[#FCFBF8] rounded-[24px] p-8 flex flex-col justify-between group cursor-pointer transition-colors duration-300"
            >
              <div>
                <img
                  src="/dalo-logo.svg"
                  alt="Dalo"
                  className="h-6 mb-4"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
                <h3 className="font-jakarta font-bold text-xl mb-3 text-[#0A1931]">Dalo</h3>
                <p className="font-newsreader text-[#0A1931]/75 mb-6">
                  A lifestyle brand providing young professionals with the premium gadgets — primarily laptops — they need to execute at the highest level.
                </p>
              </div>
              <span className="font-jakarta font-bold flex items-center gap-2 text-[#0A1931]">
                💬 Message to Order
                <span className="group-hover:translate-x-2 transition-transform duration-200">→</span>
              </span>
            </motion.a>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 3 — THE WORKBOOK
      ══════════════════════════════════════ */}
      <section id="book" className="max-w-7xl mx-auto px-6 py-24 md:py-32 flex flex-col md:flex-row items-center gap-16 scroll-mt-24">

        {/* Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="w-full md:w-5/12 flex justify-center"
        >
          <div className="w-full max-w-sm aspect-[3/4] rounded-2xl shadow-2xl relative rotate-[-2deg] hover:rotate-0 transition-transform duration-500 overflow-hidden">
            <img
              src="/workbook-mockup.png"
              alt="Build Intelligently Workbook"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 flex items-center justify-center font-jakarta text-xs text-[#FCFBF8]/25 tracking-widest uppercase -z-10">
              Workbook mockup
            </div>
          </div>
        </motion.div>

        {/* Copy */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeUp}
          className="w-full md:w-7/12 flex flex-col gap-6"
        >
          <p className="font-jakarta text-xs font-semibold tracking-[0.12em] uppercase text-[#FFBF00]">
            The Book
          </p>
          <h2 className="font-jakarta font-bold text-xl md:text-2xl text-[#0A1931] uppercase tracking-wide leading-snug">
            BUILD INTELLIGENTLY: A Practical Workbook to Model a Business That Thrives in Nigeria.
          </h2>
          <h3 className="font-jakarta font-bold text-3xl md:text-4xl text-[#0A1931] leading-tight">
            Are you actually making money, or are you just running a stressful charity?
          </h3>
          <p className="font-newsreader text-xl text-[#0A1931]/80 leading-relaxed">
            Capital in the hands of a founder who does not understand their business model does not solve the problem. It amplifies it. More money moving in the wrong direction just means a more expensive failure.
          </p>

          <div className="pt-2 pb-1">
            <p className="font-jakarta font-bold text-lg text-[#0A1931] mb-5">
              Here is what I will teach you in this practical workbook:
            </p>
            <ul className="flex flex-col gap-4 font-jakarta font-medium text-[#0A1931]/90">
              {[
                ['A Guided Experience', 'Step-by-step explanations and practical exercises at the end of every chapter to help you build your own model.'],
                ['Customer Reality', 'How to base your business decisions on real customer data, not your personal preferences.'],
                ['Cultural Alignment', 'How to align your business with how Nigerians actually live and buy.'],
                ['Profitable Margins', 'How to uncover hidden costs and set profitable selling prices.'],
                ['Building for Scale', 'How to build a service delivery system that handles high demand without collapsing.'],
                ['Revenue Architecture', 'How to generate more revenue from the customers you already have.'],
                ['Three Free Templates', 'Includes a Sales & Transaction Tracker, a Business Cost Tracker, and your complete Digital Business Model Document.'],
              ].map(([title, desc]) => (
                <li key={title} className="flex gap-3 items-start">
                  <span className="text-[#FFBF00] text-lg leading-none mt-[3px]">✦</span>
                  <span><strong>{title}:</strong> {desc}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4 mt-2">
            <motion.a
              whileHover={{ scale: 1.02, boxShadow: '0 16px 40px rgba(255,191,0,0.35)' }}
              whileTap={{ scale: 0.98 }}
              href="https://selar.com/y870581q2e"
              className="bg-[#FFBF00] text-[#0A1931] font-jakarta font-bold text-xl px-8 py-5 rounded-full text-center shadow-lg shadow-[#FFBF00]/20"
            >
              Get The Workbook Now — ₦7,500
            </motion.a>
            <motion.a
              whileHover={{ backgroundColor: '#dbedf7' }}
              href="https://wa.me/+2349075314576?text=Hi%20Seamas%2C%20I%20am%20on%20your%20site%20looking%20at%20the%20Build%20Intelligently%20workbook.%20I%20just%20have%20a%20quick%20question%20before%20I%20buy..."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#E8F1F8] text-[#0A1931] font-jakarta font-semibold text-lg px-8 py-4 rounded-full text-center flex justify-center items-center gap-3 transition-colors"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
              Have a question first? Message me.
            </motion.a>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 4 — CONSULTING
      ══════════════════════════════════════ */}
      <section id="consulting" className="w-full bg-[#E8F1F8] py-32 scroll-mt-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeUp}
            className="flex flex-col items-center gap-8"
          >
            <div className="w-12 h-[3px] bg-[#FFBF00] rounded-full" />
            <h2 className="font-jakarta font-bold text-4xl md:text-5xl text-[#0A1931] leading-tight">
              You have seen the blueprint. Let us build your model.
            </h2>
            <p className="font-newsreader text-xl md:text-2xl text-[#0A1931]/80 max-w-2xl leading-relaxed">
              Book a Clarity Session. We will sit down, strip away the noise, and structure your operations to capture value and handle growth.
            </p>
            <motion.a
              whileHover={{ backgroundColor: '#FFBF00', color: '#0A1931', scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="https://selar.com/183538732c"
              className="mt-4 bg-[#0A1931] text-[#FCFBF8] font-jakarta font-bold text-xl px-10 py-5 rounded-full shadow-xl transition-colors duration-300"
            >
              Book a Clarity Session
            </motion.a>
          </motion.div>
        </div>
      </section>

    </main>
  );
}