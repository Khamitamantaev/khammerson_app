import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const WelcomePage = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 backdrop-blur-sm p-8 md:p-12">
          {/* Иконка успеха */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="flex justify-center mb-8"
          >
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check className="h-10 w-10 text-green-400" />
            </div>
          </motion.div>

          {/* Заголовок */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-center mb-4"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Добро пожаловать
            </span>
          </motion.h1>

          {/* Приветствие */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-center text-slate-300 mb-2"
          >
            {user?.email?.split("@")[0] || "Пользователь"}!
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-slate-400 text-center mb-8"
          >
            Рады видеть вас в нашем сообществе. Ваш аккаунт успешно создан.
          </motion.p>

          {/* Список возможностей */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4 mb-8"
          >
            <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700">
              <Sparkles className="h-5 w-5 text-cyan-400 flex-shrink-0" />
              <span className="text-slate-300">
                Создавайте и управляйте своими проектами
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700">
              <Sparkles className="h-5 w-5 text-cyan-400 flex-shrink-0" />
              <span className="text-slate-300">
                Работайте в команде в реальном времени
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700">
              <Sparkles className="h-5 w-5 text-cyan-400 flex-shrink-0" />
              <span className="text-slate-300">
                Доступ к эксклюзивным функциям
              </span>
            </div>
          </motion.div>

          {/* Кнопки */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/workspace"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all"
            >
              Перейти в рабочее пространство
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/profile"
              className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-slate-700 hover:border-cyan-500/30 text-slate-300 hover:text-white font-medium rounded-lg transition-all"
            >
              Настроить профиль
            </Link>
          </motion.div>

          {/* Прогресс-бар (опционально) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center"
          >
            <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1, duration: 2 }}
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Перенаправление через несколько секунд...
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
