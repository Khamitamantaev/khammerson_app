import { motion } from "framer-motion";
import { Building2, Users, Globe, Award } from "lucide-react";

export const AboutPage = () => {
  const stats = [
    {
      value: "2018",
      label: "Год основания",
      icon: <Building2 className="h-6 w-6" />,
    },
    { value: "50+", label: "Сотрудников", icon: <Users className="h-6 w-6" /> },
    { value: "10k+", label: "Клиентов", icon: <Globe className="h-6 w-6" /> },
    { value: "15+", label: "Наград", icon: <Award className="h-6 w-6" /> },
  ];

  return (
    <div className="pt-20">
      <section className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              О компании
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Наша миссия — создавать технологии, которые меняют мир
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-slate-800/50 p-6 rounded-xl border border-slate-800 text-center"
            >
              <div className="inline-flex items-center justify-center rounded-full bg-cyan-500/10 p-3 text-cyan-400 mb-4 mx-auto">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-2xl font-semibold mb-6">Наша история</h2>
          <div className="space-y-4 text-slate-400">
            <p>
              Основанная в 2018 году, наша компания начинала как небольшой
              стартап с командой из трех человек. Сегодня мы — ведущий поставщик
              решений в своей отрасли с офисами в 5 странах.
            </p>
            <p>
              Мы верим в силу технологий для решения сложных проблем и улучшения
              жизни людей. Наш подход сочетает инновации, качество и внимание к
              потребностям клиентов.
            </p>
            <p>
              Присоединяйтесь к нам в этом путешествии, пока мы продолжаем
              расширять границы возможного.
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
};
