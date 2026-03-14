import { motion } from "framer-motion";
import { FileText, Video, BookOpen, Code2 } from "lucide-react";
import { Link } from "react-router-dom";

export const ResourcesPage = () => {
  const resources = [
    {
      icon: <FileText className="h-6 w-6 text-cyan-400" />,
      title: "Техническая документация",
      description: "Полное руководство по API и интеграциям",
      path: "/docs",
    },
    {
      icon: <Video className="h-6 w-6 text-cyan-400" />,
      title: "Видеоуроки",
      description: "Пошаговые обучающие материалы",
      path: "/tutorials",
    },
    {
      icon: <BookOpen className="h-6 w-6 text-cyan-400" />,
      title: "Блог разработчиков",
      description: "Статьи и кейсы от нашей команды",
      path: "/blog",
    },
    {
      icon: <Code2 className="h-6 w-6 text-cyan-400" />,
      title: "Примеры кода",
      description: "Готовые сниппеты для быстрого старта",
      path: "/snippets",
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
              Ресурсы
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Все материалы для успешной работы с нашей платформой
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((resource, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-slate-800/50 p-6 rounded-xl border border-slate-800 hover:border-cyan-500/30 transition-colors group cursor-pointer"
            >
              <div className="inline-flex items-center justify-center rounded-full bg-cyan-500/10 p-3 mb-4 group-hover:bg-cyan-500/20 transition-colors">
                {resource.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
              <p className="text-slate-400 text-sm mb-4">
                {resource.description}
              </p>
              <Link
                to={resource.path}
                className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors text-sm"
              >
                Подробнее
                <span className="ml-1 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
