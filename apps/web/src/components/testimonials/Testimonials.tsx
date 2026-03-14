import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@web/components/ui/avatar";
import { Star } from "lucide-react";

export const Testimonials = () => {
  const testimonials = [
    {
      name: "Алексей Петров",
      role: "CTO, TechSolutions",
      content:
        "Lumina полностью изменила наш workflow. Скорость развертывания увеличилась в 3 раза, а надежность системы стала безупречной.",
      avatar: "/avatars/1.jpg",
      rating: 5,
    },
    {
      name: "Мария Иванова",
      role: "Product Lead, DigitalMind",
      content:
        "Лучший инструмент для командной разработки. Интуитивный интерфейс и мощные возможности под капотом.",
      avatar: "/avatars/2.jpg",
      rating: 5,
    },
    {
      name: "Дмитрий Смирнов",
      role: "Founder, StartupVision",
      content:
        "Как стартап, мы ценим простоту и эффективность. Lumina дает и то, и другое, плюс отличную документацию.",
      avatar: "/avatars/3.jpg",
      rating: 4,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-3xl text-center mb-16">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold"
        >
          Отзывы наших клиентов
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-4 text-lg text-slate-400"
        >
          Узнайте, что говорят о нас те, кто уже использует Lumina
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-800/30 p-8 rounded-xl border border-slate-800 hover:border-cyan-500/30 transition-colors"
          >
            <div className="flex items-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < testimonial.rating ? "text-amber-400 fill-amber-400" : "text-slate-600"}`}
                />
              ))}
            </div>
            <p className="text-slate-300 mb-6 italic">
              "{testimonial.content}"
            </p>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={testimonial.avatar} />
                <AvatarFallback className="bg-slate-700">
                  {testimonial.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium">{testimonial.name}</h4>
                <p className="text-sm text-slate-400">{testimonial.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
