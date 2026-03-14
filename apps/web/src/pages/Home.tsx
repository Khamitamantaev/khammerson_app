import { motion } from "framer-motion";
import { ArrowRight, Zap, Code, Globe, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Testimonials } from "../components/testimonials/Testimonials";

export const LandingPage = () => {
  const features = [
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Молниеносная скорость",
      description: "Оптимизировано для максимальной производительности",
    },
    {
      icon: <Code className="h-5 w-5" />,
      title: "Интуитивный интерфейс",
      description: "Простота использования без ущерба для функциональности",
    },
    {
      icon: <Globe className="h-5 w-5" />,
      title: "Глобальная инфраструктура",
      description: "Серверы по всему миру для минимальных задержек",
    },
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 sm:py-32 lg:py-40">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center rounded-full bg-cyan-500/15 px-4 py-1.5 text-sm font-medium text-cyan-400 mb-6"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Новая версия доступна!
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Создавайте
            </span>{" "}
            будущее сегодня
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-slate-400 max-w-2xl mx-auto"
          >
            Инновационная платформа для команд, которые хотят вывести свой
            продукт на новый уровень
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/login"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-lg shadow-cyan-500/20 transition-all"
            >
              Начать бесплатно
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center px-8 py-3 border border-slate-700 text-white font-medium rounded-lg hover:bg-slate-800/50 transition-all"
            >
              Узнать больше
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 sm:py-24 lg:py-32 bg-slate-900/50 rounded-3xl mx-6">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold"
          >
            Почему выбирают нас
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-slate-400"
          >
            Все необходимое для вашего успеха в одном месте
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/30 p-8 rounded-xl border border-slate-800 hover:border-cyan-500/30 transition-colors"
            >
              <div className="inline-flex items-center justify-center rounded-full bg-cyan-500/10 p-3 text-cyan-400 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 sm:py-24 lg:py-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-slate-800 px-8 py-12 sm:p-12 text-center shadow-xl"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Готовы начать?
          </h2>
          <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
            Присоединяйтесь к тысячам довольных клиентов по всему миру
          </p>
          <Link
            to="/sign-up"
            className="inline-flex items-center px-8 py-3 bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-lg shadow-cyan-500/20 transition-all"
          >
            Начать бесплатно
          </Link>
        </motion.div>
      </section>
    </div>
  );
};
