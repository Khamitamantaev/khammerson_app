import { motion } from "framer-motion";
import { BookOpen, Code, Terminal, Database } from "lucide-react";
import { Link } from "react-router-dom";

export const DocsPage = () => {
  const sections = [
    {
      icon: <BookOpen className="h-5 w-5 text-cyan-400" />,
      title: "Начало работы",
      description: "Быстрый старт с нашей платформой",
      path: "/docs/getting-started",
    },
    {
      icon: <Code className="h-5 w-5 text-cyan-400" />,
      title: "API Reference",
      description: "Полная документация по API",
      path: "/docs/api",
    },
    {
      icon: <Terminal className="h-5 w-5 text-cyan-400" />,
      title: "CLI Guide",
      description: "Работа с командной строкой",
      path: "/docs/cli",
    },
    {
      icon: <Database className="h-5 w-5 text-cyan-400" />,
      title: "Базы данных",
      description: "Настройка и работа с данными",
      path: "/docs/database",
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
              Документация
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Исчерпывающие руководства и справочные материалы
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-slate-800/50 p-6 rounded-xl border border-slate-800 hover:border-cyan-500/30 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="inline-flex items-center justify-center rounded-full bg-cyan-500/10 p-2 mt-1 flex-shrink-0">
                  {section.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {section.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-3">
                    {section.description}
                  </p>
                  <Link
                    to={section.path}
                    className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors text-sm"
                  >
                    Читать документацию
                    <span className="ml-1">→</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
