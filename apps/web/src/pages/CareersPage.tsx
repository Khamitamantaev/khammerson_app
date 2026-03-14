import { motion } from 'framer-motion';
import { Briefcase, MapPin, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CareersPage = () => {
  const positions = [
    {
      title: "Frontend Developer",
      type: "Полная занятость",
      location: "Москва/Удаленно",
      salary: "от 200 000 ₽"
    },
    {
      title: "Backend Engineer",
      type: "Полная занятость",
      location: "Санкт-Петербург",
      salary: "от 220 000 ₽"
    },
    {
      title: "UX/UI Designer",
      type: "Удаленная работа",
      location: "Любой город",
      salary: "от 180 000 ₽"
    }
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
              Карьера
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Присоединяйтесь к нашей команде профессионалов
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-6">
          {positions.map((position, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-slate-800/50 p-6 rounded-xl border border-slate-800 hover:border-cyan-500/30 transition-colors"
            >
              <h3 className="text-xl font-semibold mb-2">{position.title}</h3>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-4">
                <div className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  {position.type}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {position.location}
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  {position.salary}
                </div>
              </div>
              <Link
                to={`/careers/${index}`}
                className="inline-block px-4 py-2 border border-slate-700 rounded-lg text-white hover:bg-slate-800 transition-colors"
              >
                Подробнее о вакансии
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <h2 className="text-2xl font-semibold mb-4">Не нашли подходящую вакансию?</h2>
          <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
            Отправьте нам свое резюме, и мы свяжемся с вами, когда появится подходящая позиция
          </p>
          <Link
            to="/careers/submit"
            className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Отправить резюме
          </Link>
        </motion.div>
      </section>
    </div>
  );
};