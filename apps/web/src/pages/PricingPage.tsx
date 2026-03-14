import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";

export const PricingPage = () => {
  const plans = [
    {
      name: "Стартовый",
      price: "0",
      period: "навсегда",
      features: [
        "Базовые функции",
        "До 3 пользователей",
        "5GB хранилища",
        "Поддержка по email",
      ],
      cta: "Начать бесплатно",
      path: "/sign-up",
    },
    {
      name: "Профессиональный",
      price: "29",
      period: "в месяц",
      features: [
        "Все стартовые функции",
        "До 10 пользователей",
        "50GB хранилища",
        "Приоритетная поддержка",
      ],
      cta: "Попробовать",
      path: "/sign-up?plan=pro",
      popular: true,
    },
    {
      name: "Корпоративный",
      price: "99",
      period: "в месяц",
      features: [
        "Все профессиональные функции",
        "Неограниченные пользователи",
        "500GB хранилища",
        "Персональный менеджер",
      ],
      cta: "Связаться с нами",
      path: "/contact",
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
              Гибкие тарифы
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Выберите план, который подходит именно вам
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className={cn(
                "bg-slate-800/50 p-8 rounded-xl border border-slate-800 hover:border-cyan-500/30 transition-colors",
                plan.popular && "border-cyan-500/50 ring-1 ring-cyan-500/30",
              )}
            >
              {plan.popular && (
                <div className="text-xs font-semibold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full inline-block mb-4">
                  Популярный выбор
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-slate-400">/{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-slate-300"
                  >
                    <Check className="h-4 w-4 text-cyan-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                to={plan.path}
                className={cn(
                  "block text-center px-6 py-3 rounded-lg font-medium transition-all",
                  plan.popular
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                    : "border border-slate-700 text-white hover:bg-slate-800",
                )}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
