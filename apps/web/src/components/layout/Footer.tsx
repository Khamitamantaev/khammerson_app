import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const links = [
    { name: 'Продукт', href: '/product' },
    { name: 'Решения', href: '/solutions' },
    { name: 'Цены', href: '/pricing' },
    { name: 'Ресурсы', href: '/resources' },
    { name: 'Документация', href: '/docs' },
    { name: 'О компании', href: '/about' },
    { name: 'Блог', href: '/blog' },
    { name: 'Карьера', href: '/careers' },
  ];

  const social = [
    { icon: <Github className="h-5 w-5" />, href: '#' },
    { icon: <Twitter className="h-5 w-5" />, href: '#' },
    { icon: <Linkedin className="h-5 w-5" />, href: '#' },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="bg-slate-900/80 border-t border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Лого и описание */}
          <div className="col-span-full lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2">
                <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                  Khammerson
                </span>
              </motion.div>
            </Link>
            <p className="text-sm text-slate-400">
              Инновационные решения для современного бизнеса
            </p>
          </div>

          {/* Колонки со ссылками */}
          {[0, 1, 2, 3].map((col) => (
            <div key={col} className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-300">Категория</h3>
              <ul className="space-y-2">
                {links.slice(col * 2, col * 2 + 2).map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-slate-400 hover:text-cyan-400 text-sm font-normal transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Нижняя часть */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-800">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Khammerson App. Все права защищены.
          </p>

          <div className="flex items-center gap-4">
            {social.map((item, index) => (
              <motion.a
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                href={item.href}
                className="text-slate-500 hover:text-cyan-400 transition-colors"
              >
                {item.icon}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  );
};