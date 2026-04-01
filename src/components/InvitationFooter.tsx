import BrandLockup from "./BrandLockup";

const InvitationFooter = () => (
  <footer className="py-16 px-6 bg-navy-deep text-center">
    <BrandLockup size="small" className="mb-6" />
    <div className="rule-gold max-w-[60px] mx-auto mb-6" />
    <p className="text-[0.6rem] text-cream/25 font-body tracking-widest uppercase">
      © 2025 B. Living Floripa
    </p>
  </footer>
);

export default InvitationFooter;
