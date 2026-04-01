import logoBLiving from "@/assets/brand/logo-b-living-white.png";

const BrandLockup = ({ className = "", size = "default" }: { className?: string; size?: "default" | "small" }) => {
  const imageClass = size === "small" ? "w-[150px] md:w-[168px]" : "w-[260px] md:w-[320px]";

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img
        src={logoBLiving}
        alt="B. Living Floripa"
        className={`${imageClass} block h-auto object-contain`}
        loading="eager"
      />
    </div>
  );
};

export default BrandLockup;
