import { motion } from "framer-motion";

const ContextSection = () => {
  return (
    <section className="relative py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-navy-deep">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="divider-gold" />

          <p className="font-headline text-cream/80 text-lg md:text-xl lg:text-2xl font-light leading-relaxed tracking-wide">
            No dia 09 de abril, às 18 horas,
            <br />
            a B. Living inaugura uma nova era
            <br />
            em Florianópolis.
          </p>

          <div className="divider-gold" />

          <p className="text-body-refined text-cream/45 text-xs md:text-sm max-w-lg mx-auto leading-relaxed">
            Nascida na ilha, a marca surge para orientar decisões imobiliárias de alto padrão
            com curadoria, leitura de cidade e confiança.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ContextSection;
