import { motion } from "framer-motion";
import { Calendar, Edit2, Mail, User, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Пожалуйста, войдите в систему</p>
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-colors"
          >
            Войти
          </Link>
        </div>
      </div>
    );
  }

  // Получаем первую букву email для аватара
  const getInitial = () => {
    return user.email?.charAt(0).toUpperCase() || "?";
  };

  return (
    <div className="min-h-screen bg-slate-900 py-20">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Профиль
            </span>
          </h1>
          <p className="text-slate-400">Управление вашей учетной записью</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 rounded-xl border border-slate-800 p-8"
        >
          {/* Аватар и основная информация */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
              {getInitial()}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold mb-1">Пользователь</h2>
              <p className="text-slate-400 mb-3">{user.email}</p>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>ID: {user.id.substring(0, 8)}...</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  <span>Пользователь</span>
                </div>
              </div>
            </div>
          </div>

          {/* Детальная информация */}
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                <div className="flex items-center gap-2 text-cyan-400 mb-2">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm font-medium">Email</span>
                </div>
                <p className="text-slate-300">{user.email}</p>
              </div>

              <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                <div className="flex items-center gap-2 text-cyan-400 mb-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">ID пользователя</span>
                </div>
                <p className="text-slate-300 text-sm break-all">{user.id}</p>
              </div>
            </div>

            {/* Кнопка редактирования (пока неактивна) */}
            <div className="pt-4 flex justify-end">
              <button
                disabled
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-400 rounded-lg cursor-not-allowed"
              >
                <Edit2 className="h-4 w-4" />
                Редактирование временно недоступно
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
