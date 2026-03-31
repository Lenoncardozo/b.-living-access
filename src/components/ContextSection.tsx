import { motion } from "framer-motion";

const ContextSection = () => {
  return (
    <section className="py-20 md:py-28 px-6 md:px-12 lg:px-20">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="divider-fine mb-10" />
          <p className="text-body-refined text-muted-foreground text-base md:text-lg leading-relaxed">
            Um encontro para celebrar a abertura da nova casa da B. Living
            e apresentar, de forma reservada, o início de uma nova fase da marca.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ContextSection;
