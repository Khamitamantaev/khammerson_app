import { motion } from 'framer-motion'
import { Button } from '@web/components/ui/button'
import { Zap, Code, Shield } from 'lucide-react'

export const ProductPage = () => {
  const features = [
    {
      icon: <Zap className="h-6 w-6 text-cyan-400" />,
      title: "Молниеносная скорость",
      description: "Оптимизированная архитектура для максимальной производительности"
    },
    {
      icon: <Code className="h-6 w-6 text-cyan-400" />,
      title: "Гибкость разработки",
      description: "Поддержка всех современных технологий и фреймворков"
    },
    {
      icon: <Shield className="h-6 w-6 text-cyan-400" />,
      title: "Безопасность",
      description: "Встроенные механизмы защиты данных"
    }
  ]

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
              Наш продукт
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Инновационное решение для современных бизнес-задач
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-slate-800/50 p-8 rounded-xl border border-slate-800 hover:border-cyan-500/30 transition-colors"
            >
              <div className="inline-flex items-center justify-center rounded-full bg-cyan-500/10 p-3 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-8"
          >
            Запросить демо
          </Button>
        </motion.div>
      </section>
    </div>
  )
}