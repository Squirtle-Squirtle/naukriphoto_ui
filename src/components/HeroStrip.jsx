// Edit the text content here to change the hero section copy.
export default function HeroStrip() {
  return (
    <div className="bg-gradient-to-r from-primary/5 via-background to-primary/5 border-b border-border">
      <div className="max-w-6xl mx-auto px-5 py-7">
        {/* Small label above heading — edit or remove this line */}
        <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-1">
          Exam Document Preparation
        </p>

        {/* Main heading — edit text here */}
        <h1
          className="text-2xl md:text-3xl font-extrabold text-foreground leading-tight"
          style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
        >
          Prepare your exam photos,
          <br className="hidden sm:block" /> instantly.
        </h1>

        {/* Subtext — edit or remove this paragraph */}
        <p className="text-sm text-muted-foreground mt-2 max-w-lg">
          Pick your exam to see required documents, then use our resizer to get the perfect photo dimensions.
        </p>
      </div>
    </div>
  );
}
