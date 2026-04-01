const BrandLockup = ({ className = "", size = "default" }: { className?: string; size?: "default" | "small" }) => {
  const isSmall = size === "small";
  
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Logo mark */}
      <div className={`relative ${isSmall ? "mb-1" : "mb-2"}`}>
        <div
          className={`border border-gold/40 flex items-center justify-center ${
            isSmall ? "px-3 py-1.5" : "px-5 py-2.5"
          }`}
        >
          <span
            className={`font-headline font-light tracking-[0.15em] text-cream ${
              isSmall ? "text-lg" : "text-2xl md:text-3xl"
            }`}
          >
            B. LIVING
          </span>
        </div>
      </div>
      <span
        className={`text-label-premium text-gold/70 ${
          isSmall ? "text-[0.5rem] tracking-[0.3em]" : "text-[0.6rem] tracking-[0.35em]"
        }`}
      >
        FLORIPA IMÓVEIS
      </span>
    </div>
  );
};

export default BrandLockup;
