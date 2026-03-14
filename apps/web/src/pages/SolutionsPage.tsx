import { motion } from "framer-motion";
import { Briefcase, Server, Users, Database } from "lucide-react";
import { Link } from "react-router-dom";

export const SolutionsPage = () => {
  const solutions = [
    {
      icon: <Briefcase className="h-6 w-6 text-cyan-400" />,
      title: "Для бизнеса",
      description: "Комплексные решения для корпораций",
      path: "/solutions/business",
    },
    {
      icon: <Server className="h-6 w-6 text-cyan-400" />,
      title: "Для разработчиков",
      description: "Инструменты для профессиональных команд",
      path: "/solutions/developers",
    },
    {
      icon: <Users className="h-6 w-6 text-cyan-400" />,
      title: "Для стартапов",
      description: "Быстрый старт с минимальными затратами",
      path: "/solutions/startups",
    },
    {
      icon: <Database className="h-6 w-6 text-cyan-400" />,
      title: "Для предприятий",
      description: "Масштабируемые корпоративные решения",
      path: "/solutions/enterprise",
    },
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
              Отраслевые решения
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Специализированные продукты для вашего бизнеса
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-slate-800/50 p-6 rounded-xl border border-slate-800 hover:border-cyan-500/30 transition-colors group"
            >
              <Link to={solution.path} className="block">
                <div className="inline-flex items-center justify-center rounded-full bg-cyan-500/10 p-3 mb-4 group-hover:bg-cyan-500/20 transition-colors">
                  {solution.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-cyan-400 transition-colors">
                  {solution.title}
                </h3>
                <p className="text-slate-400 text-sm">{solution.description}</p>
                <div className="mt-4 text-cyan-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  Подробнее →
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
