export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-[var(--color-secondary)] selection:bg-[var(--color-accent)] selection:text-[var(--color-heading)]">

      {/* Search/Nav Floating Pill */}
      {/* <nav className="fixed top-6 z-50 glass-nav px-6 py-3 rounded-full border border-white/20 shadow-sm flex items-center gap-4 animate-fade-in-up">
        <span className="font-semibold text-sm tracking-tight text-[var(--color-heading)]">AI Sales Manager</span>
        <div className="w-px h-4 bg-gray-200"></div>
        <button className="text-sm font-medium text-[var(--color-muted)] hover:text-black transition-colors">Sign In</button>
      </nav> */}

      <div className="w-full relative pb-20">
        {/* Helper gradient for blend */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white pointer-events-none z-10 bottom-0 top-1/2" style={{ zIndex: 0 }}></div>

        {/* Top Badge */}
        <div className="flex justify-center pt-8 mb-6 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-white/60 shadow-sm backdrop-blur-sm text-sm font-medium text-[var(--color-heading)]">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Turn sales calls into clear insights and actionable coaching for sales managers.
          </span>
        </div>

        {/* Hero Section */}
        <section className="w-full max-w-6xl mx-auto px-6 pt-12 pb-32 flex flex-col items-center text-center animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-[var(--color-header-muted)] mb-8 max-w-5xl leading-[1.1]">
            An <span className="text-[var(--color-heading)] font-bold">AI Sales Manager</span> that is <span className="text-[var(--color-heading)] font-bold">actually helpful.</span>
          </h1>

          {/* Hero CTA - Premium Invite */}
          <div className="flex flex-col md:flex-row items-center gap-4 mb-20 animate-fade-in-up [animation-delay:200ms]">
            <button className="px-8 py-4 bg-[var(--color-heading)] text-white rounded-full font-medium text-lg hover:bg-opacity-90 transition-all shadow-sm hover:shadow-md cursor-pointer">
              View the demo
            </button>
            <button className="px-8 py-4 text-[var(--color-heading)] rounded-full font-medium text-lg hover:bg-[var(--color-heading)]/5 transition-all cursor-pointer">
              Explore the product
            </button>
          </div>


          {/* Product Demo - Before/After Cards */}
          <div className="relative w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start text-left z-20">
            {/* Left Card - Raw */}
            <div className="relative">
              <div className="text-center mb-4 text-[var(--color-muted)] font-medium text-sm">Your notes + transcript</div>
              <div className="bg-white rounded-[24px] shadow-xl p-8 min-h-[420px] relative border border-gray-100 rotate-[-2deg] transition-transform hover:rotate-0 duration-500">
                {/* Header */}
                <div className="flex items-start gap-4 mb-8">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                {/* Content */}
                <h3 className="text-xl font-bold text-black mb-2">Intro call: AllFound</h3>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-6 font-mono">
                  <span>3:30pm</span>
                  <div className="w-4 h-4 rounded-full bg-gray-200"></div>
                  <span>Joss +1</span>
                </div>

                <div className="font-mono text-sm space-y-4">
                  <p>Company around 100 ppl, growing fast</p>
                  <p>Using Tuesday.ai currently but team finds it too manual</p>

                  <p>Mentioned data entry takes lot of time</p>
                  <p>Non-technical reps struggle with setup</p>

                  <p>Pricing came up — $180 per employee per year</p>
                  <p>They feel it's expensive for current usage</p>

                  <p>Looking for something simpler for sales team</p>
                  <p>Jess to send more details later</p>

                  <p>Follow up next week</p>

                </div>

                {/* Floating Video Bubble */}
                {/* <div className="absolute bottom-8 left-8 right-8 h-32 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-200 shadow-inner">
                  <div className="flex gap-4 opacity-50">
                    <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                    <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  </div>
                </div> */}
              </div>
            </div>

            {/* Arrow */}
            <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-[var(--color-accent)] drop-shadow-sm">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Right Card - AI Enhanced */}
            <div className="relative">
              <div className="text-center mb-4 text-green-600 font-medium text-sm flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                AI enhanced
              </div>
              <div className="bg-white rounded-[24px] shadow-2xl p-8 min-h-[500px] border border-green-100 rotate-[2deg] transition-transform hover:rotate-0 duration-500 relative z-10">
                {/* Header */}
                <div className="flex items-start gap-4 mb-8">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                {/* Content */}
                <h3 className="text-xl font-bold text-black mb-2">Intro call: AllFound</h3>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
                  <span>3:30pm</span>
                  <div className="w-4 h-4 rounded-full bg-gray-200"></div>
                  <span>Jess +1</span>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">AllFound Summary</h4>
                    <ul className="list-disc list-outside ml-4 text-sm text-[var(--color-heading)] space-y-1">
                      <li>Introductory <strong>call with AllFound </strong>to understand their current sales tooling and pain points.</li>
                      <li>The team is evaluating alternatives due to <strong>manual workflows and pricing concerns.</strong></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Key Insights</h4>
                    <ul className="list-disc list-outside ml-4 text-sm text-[var(--color-heading)] space-y-1">
                      <li>Company size: <strong>~100 employees</strong>, planning to grow next quarter</li>
                      <li>Current tool: <strong>Tuesday.ai</strong></li>
                      <li>Primary pain point: Manual data entry and complex setup for reps</li>
                      <li>Pricing concern: <strong>$180 per employee per year considered expensive</strong></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Coaching Notes (For Sales Rep)</h4>
                    <ul className="list-disc list-outside ml-4 text-sm text-[var(--color-heading)] space-y-1">
                      <li>Lead pricing discussion earlier to uncover budget sensitivity</li>
                      <li>Emphasize simplicity and time savings over features</li>
                      <li>Prepare a side-by-side comparison vs Tuesday.ai</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Problem Section - The Reality */}
      <section className="w-full max-w-5xl px-6 py-24 md:py-32">
        <div className="flex flex-col md:flex-row gap-16 items-start">
          {/* Left Column: Section Label */}
          <div className="md:w-1/3 sticky top-32">
            <div className="flex gap-6">
              <div className="w-px h-24 bg-gray-200 shrink-0"></div>
              <div className="flex flex-col pt-1">
                <h2 className="text-xl font-medium uppercase tracking-wide text-blck-500">The Reality</h2>
                <p className="text-lg text-gray-600 mt-2 max-w-xs">Where sales coaching breaks down</p>
              </div>
            </div>
          </div>

          {/* Right Column: Main Content */}
          <div className="md:w-2/3">
            {/* Primary Statement */}
            <p className="text-2xl md:text-3xl leading-relaxed text-gray-900 mb-8 max-w-prose">
              Sales managers want to coach.
              <br className="hidden md:block" /> But most of their time is spent just trying to find the right call to listen to.
            </p>

            {/* Subtle Divider */}
            <div className="h-px bg-gray-200 w-16 my-8"></div>

            {/* Structured Pain Points */}
            <div className="space-y-10">
              <div className="animate-fade-in-up [animation-delay:200ms]">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Important signals get lost.</h3>
                <p className="text-gray-600 leading-relaxed text-lg">Key objections and buying signals are buried inside long sales calls.</p>
              </div>

              <div className="animate-fade-in-up [animation-delay:400ms]">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Teams repeat the same mistakes.</h3>
                <p className="text-gray-600 leading-relaxed text-lg">Without clear insights, reps don’t know what to improve from one call to the next.</p>
              </div>

              <div className="animate-fade-in-up [animation-delay:600ms]">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Coaching comes too late.</h3>
                <p className="text-gray-600 leading-relaxed text-lg">Feedback often arrives after the deal is already lost.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Premium Product Flow */}
      <section className="w-full max-w-6xl px-6 py-32">
        <h2 className="text-3xl md:text-4xl font-medium text-[var(--color-heading)] tracking-tight mb-20 text-center">How it works</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 01 */}
          <div className="flex flex-col p-8 md:p-10 bg-white rounded-[32px] border border-gray-100/50 shadow-[0_2px_8px_rgba(0,0,0,0.04)] h-full">
            <div className="mb-8">
              <span className="inline-block px-3 py-1 rounded-full bg-gray-50 text-[11px] font-bold tracking-wide uppercase text-gray-400">01</span>
            </div>
            <h3 className="text-xl md:text-2xl font-medium text-[var(--color-heading)] mb-4">Review the call</h3>
            <p className="text-gray-500 leading-relaxed text-base">
              Select a sales call or paste a transcript to quickly revisit what was discussed.
            </p>
          </div>

          {/* Step 02 - Subtle Emphasis */}
          <div className="flex flex-col p-8 md:p-10 bg-white rounded-[32px] border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.06)] h-full relative z-10 scale-[1.02] md:scale-105 transition-transform duration-500">
            <div className="mb-8">
              <span className="inline-block px-3 py-1 rounded-full bg-gray-50 text-[11px] font-bold tracking-wide uppercase text-gray-400">02</span>
            </div>
            <h3 className="text-xl md:text-2xl font-medium text-[var(--color-heading)] mb-4">AI extracts what matters</h3>
            <p className="text-gray-500 leading-relaxed text-base">
              The AI summarizes the conversation, highlights objections, and surfaces key signals.
            </p>
          </div>

          {/* Step 03 */}
          <div className="flex flex-col p-8 md:p-10 bg-white rounded-[32px] border border-gray-100/50 shadow-[0_2px_8px_rgba(0,0,0,0.04)] h-full">
            <div className="mb-8">
              <span className="inline-block px-3 py-1 rounded-full bg-gray-50 text-[11px] font-bold tracking-wide uppercase text-gray-400">03</span>
            </div>
            <h3 className="text-xl md:text-2xl font-medium text-[var(--color-heading)] mb-4">Coach with clarity</h3>
            <p className="text-gray-500 leading-relaxed text-base">
              Get clear coaching notes and next steps for each rep—without listening to the full call.
            </p>
          </div>
        </div>
      </section>

      {/* Core Capabilities - Premium Feature Callouts */}
      <section className="w-full max-w-6xl px-6 py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Deep Summaries Container */}
          <div className="p-10 md:p-14 rounded-[32px] bg-[var(--color-heading)] text-white flex flex-col justify-between min-h-[460px] relative overflow-hidden group">
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <span className="inline-block text-[11px] font-bold tracking-widest text-white/40 uppercase mb-6">AI Summary</span>
                <h3 className="text-3xl font-medium mb-4 tracking-tight">Deep Summaries</h3>
                <p className="text-white/70 text-lg leading-relaxed max-w-md">
                  We go beyond bullet points. Each summary captures context, nuance, and clear next steps—so managers don’t have to interpret raw notes.
                </p>
              </div>

              {/* Subtle Example Snippet */}
              <div className="mt-12 p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm max-w-sm">
                <p className="font-mono text-sm text-white/60 leading-relaxed">
                  “Customer evaluating alternatives due to pricing concerns. Follow up scheduled for next week.”
                </p>
              </div>
            </div>
            {/* Subtle Gradient Glow */}
            <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none group-hover:bg-emerald-500/30 transition-colors duration-700"></div>
          </div>

          {/* Objection Tagging Container */}
          <div className="p-10 md:p-14 rounded-[32px] bg-gray-50 border border-gray-300 flex flex-col justify-between min-h-[460px] relative overflow-hidden">
            <div>
              <h3 className="text-3xl font-medium text-[var(--color-heading)] mb-4 tracking-tight">Objection Tagging</h3>
              <p className="text-gray-500 text-lg leading-relaxed max-w-md">
                See where deals are stalling by identifying common objections across calls.
              </p>
            </div>

            {/* Tags - Neutral/Analytical */}
            <div className="mt-8 flex flex-col gap-3 items-start">
              <span className="inline-flex px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 text-sm font-medium shadow-sm">
                Dining pricing too high
              </span>
              <span className="inline-flex px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 text-sm font-medium shadow-sm opacity-80">
                Competitor mentioned
              </span>
              <span className="inline-flex px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 text-sm font-medium shadow-sm opacity-60">
                Not ready
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Minimal & Confident */}
      <section className="w-full px-6 py-32 md:py-48 flex flex-col items-center text-center bg-white">
        <h2 className="text-4xl md:text-5xl font-medium text-[var(--color-heading)] mb-8 tracking-tight">
          Ready to coach with clarity?
        </h2>
        <p className="text-gray-500 text-lg md:text-xl mb-12 max-w-2xl leading-relaxed">
          See how sales managers turn calls into clear insights and actionable coaching.
        </p>
        <button className="px-8 py-4 bg-[var(--color-heading)] text-white rounded-full font-medium text-lg hover:bg-opacity-90 transition-all shadow-sm hover:shadow-md">
          View the demo
        </button>
      </section>
    </main>
  );
}
