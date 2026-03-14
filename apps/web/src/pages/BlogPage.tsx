import { motion } from 'framer-motion';
import { Calendar, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BlogPage = () => {
  const posts = [
    {
      title: "Новые возможности API v3.0",
      excerpt: "Обзор ключевых изменений в последней версии нашего API",
      date: "15 мая 2023",
      readTime: "5 мин",
      author: "Иван Петров"
    },
    {
      title: "Оптимизация производительности",
      excerpt: "Как мы добились 3-кратного ускорения обработки запросов",
      date: "2 мая 2023",
      readTime: "7 мин",
      author: "Мария Сидорова"
    },
    {
      title: "Внедрение AI в продукты",
      excerpt: "Как искусственный интеллект меняет наш подход к разработке",
      date: "20 апреля 2023",
      readTime: "8 мин",
      author: "Алексей Иванов"
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
              Блог
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Последние новости, статьи и кейсы от нашей команды
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-slate-800/50 rounded-xl border border-slate-800 hover:border-cyan-500/30 transition-colors overflow-hidden"
            >
              <div className="h-48 bg-gradient-to-br from-cyan-500/10 to-blue-600/10"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-slate-400 mb-4">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {post.readTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {post.author}
                  </div>
                </div>
                <Link 
                  to={`/blog/${index}`} 
                  className="inline-block text-cyan-400 hover:text-cyan-300 mt-4 transition-colors"
                >
                  Читать статью →
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
};