import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertRegistrationSchema, type InsertRegistration } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Rocket, 
  Clock, 
  Users, 
  Car, 
  Trophy, 
  CheckCircle, 
  Brain, 
  TrendingUp, 
  Shield, 
  Coins,
  CloudLightning,
  Flame,
  PhoneCall,
  Mail,
  Star
} from "lucide-react";

export default function Landing() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<InsertRegistration>({
    resolver: zodResolver(insertRegistrationSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      experience: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: InsertRegistration) => {
      const response = await apiRequest("POST", "/api/register", data);
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Заявка отправлена!",
        description: "Мы свяжемся с вами в ближайшее время",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message || "Произошла ошибка при отправке заявки",
      });
    },
  });

  const onSubmit = (data: InsertRegistration) => {
    registerMutation.mutate(data);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50" data-testid="navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-crypto bg-clip-text text-transparent">
                ДЖАМБО
              </span>
              <span className="ml-2 text-sm text-gray-600">CRYPTO ACADEMY</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <button 
                onClick={() => scrollToSection("course")} 
                className="text-gray-700 hover:text-crypto-blue transition-colors"
                data-testid="nav-course"
              >
                О курсе
              </button>
              <button 
                onClick={() => scrollToSection("results")} 
                className="text-gray-700 hover:text-crypto-blue transition-colors"
                data-testid="nav-results"
              >
                Результаты
              </button>
              <button 
                onClick={() => scrollToSection("giveaway")} 
                className="text-gray-700 hover:text-crypto-blue transition-colors"
                data-testid="nav-giveaway"
              >
                Розыгрыш
              </button>
              <button 
                onClick={() => scrollToSection("register")} 
                className="bg-gradient-crypto text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
                data-testid="nav-register"
              >
                Записаться
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-crypto text-white py-20 relative overflow-hidden" data-testid="hero-section">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Rocket className="text-crypto-gold mr-2 h-4 w-4" />
                <span className="text-sm font-medium">ОГРАНИЧЕННОЕ ПРЕДЛОЖЕНИЕ</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight" data-testid="hero-title">
                Заработай на 
                <span className="bg-gradient-gold bg-clip-text text-transparent"> КРИПТОВАЛЮТЕ</span>
                за 3 дня
              </h1>
              <p className="text-xl mb-8 text-gray-200 leading-relaxed" data-testid="hero-description">
                Единственный интенсив, который покажет реальные способы заработка на криптовалютах. 
                Банковская система уходит в прошлое — крипта это будущее!
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <Clock className="text-crypto-gold mr-2 h-4 w-4" />
                  <span>3 дня интенсива</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <Users className="text-crypto-gold mr-2 h-4 w-4" />
                  <span>300+ успешных учеников</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <Car className="text-crypto-gold mr-2 h-4 w-4" />
                  <span>Розыгрыш BMW M5</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => scrollToSection("register")} 
                  className="bg-crypto-gold hover:bg-yellow-500 text-black font-bold px-8 py-4 rounded-xl transition-all transform hover:scale-105 text-center"
                  data-testid="cta-register"
                >
                  <CloudLightning className="inline mr-2 h-4 w-4" />
                  ЗАПИСАТЬСЯ СЕЙЧАС - 2990₽
                </button>
                <button 
                  onClick={() => scrollToSection("course")} 
                  className="border-2 border-white text-white hover:bg-white hover:text-crypto-blue font-bold px-8 py-4 rounded-xl transition-all text-center"
                  data-testid="cta-learn-more"
                >
                  Подробнее о курсе
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-2xl shadow-2xl flex items-center justify-center">
                <TrendingUp className="h-32 w-32 text-white/50" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl">
                <div className="text-2xl font-bold text-crypto-green" data-testid="earnings-display">+₽300,000</div>
                <div className="text-sm text-gray-600">средний доход в месяц</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BMW Giveaway Banner */}
      <section id="giveaway" className="bg-black text-white py-16" data-testid="giveaway-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-full h-80 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl flex items-center justify-center">
                <Car className="h-32 w-32 text-white/30" />
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-6" data-testid="giveaway-title">
                <span className="text-crypto-gold">ЭКСКЛЮЗИВНЫЙ</span> РОЗЫГРЫШ
              </h2>
              <h3 className="text-3xl font-bold mb-6 text-gray-300">BMW M5 F10 - МАШИНА МЕЧТЫ</h3>
              <p className="text-xl mb-8 text-gray-300 leading-relaxed">
                Каждый участник интенсива автоматически участвует в розыгрыше BMW M5 F10. 
                Это не просто обучение — это твой шанс изменить жизнь!
              </p>
              <Card className="bg-crypto-gold/10 border border-crypto-gold/30">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Trophy className="text-crypto-gold text-2xl mr-4" />
                    <div>
                      <div className="font-bold text-lg">ГЛАВНЫЙ ПРИЗ</div>
                      <div className="text-gray-400">BMW M5 F10 (стоимость ~4,500,000₽)</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    Розыгрыш проводится среди всех участников интенсива. Результаты в прямом эфире.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section id="results" className="py-20 bg-white" data-testid="results-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900" data-testid="results-title">
              РЕАЛЬНЫЕ РЕЗУЛЬТАТЫ 
              <span className="bg-gradient-crypto bg-clip-text text-transparent">УЧЕНИКОВ</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Более 300 учеников уже изменили свою жизнь благодаря знаниям о криптовалютах
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-gradient-to-br from-crypto-green to-emerald-400 text-white transform hover:scale-105 transition-all shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="text-5xl font-bold mb-4" data-testid="stat-days">7</div>
                <div className="text-xl font-semibold mb-2">ДНЕЙ</div>
                <div className="text-green-100">Мой ученик купил BMW за 7 дней работы</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-crypto-gold to-yellow-400 text-black transform hover:scale-105 transition-all shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="text-5xl font-bold mb-4" data-testid="stat-hours">40</div>
                <div className="text-xl font-semibold mb-2">ЧАСОВ</div>
                <div className="text-yellow-800">Мой ученик заработал на Rolex за 40 часов</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-crypto text-white transform hover:scale-105 transition-all shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="text-5xl font-bold mb-4" data-testid="stat-students">300+</div>
                <div className="text-xl font-semibold mb-2">УЧЕНИКОВ</div>
                <div className="text-blue-100">Стабильно зарабатывают свыше 300.000₽/месяц</div>
              </CardContent>
            </Card>
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-crypto rounded-full flex items-center justify-center text-white font-bold">А</div>
                  <div className="ml-4">
                    <div className="font-semibold" data-testid="testimonial-name-1">Алексей К.</div>
                    <div className="text-sm text-gray-600">Москва</div>
                  </div>
                </div>
                <p className="text-gray-700 italic mb-4" data-testid="testimonial-text-1">
                  "За первую неделю после интенсива заработал 150.000₽ на Bitcoin. Джамбо показал реальные стратегии!"
                </p>
                <div className="text-crypto-green font-semibold">Заработок: +150.000₽</div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center text-black font-bold">М</div>
                  <div className="ml-4">
                    <div className="font-semibold" data-testid="testimonial-name-2">Марина С.</div>
                    <div className="text-sm text-gray-600">СПБ</div>
                  </div>
                </div>
                <p className="text-gray-700 italic mb-4" data-testid="testimonial-text-2">
                  "Купила Rolex через месяц! Криптовалюты действительно изменили мою жизнь. Спасибо за знания!"
                </p>
                <div className="text-crypto-green font-semibold">Заработок: +800.000₽</div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-crypto-purple to-pink-500 rounded-full flex items-center justify-center text-white font-bold">Д</div>
                  <div className="ml-4">
                    <div className="font-semibold" data-testid="testimonial-name-3">Дмитрий В.</div>
                    <div className="text-sm text-gray-600">Екатеринбург</div>
                  </div>
                </div>
                <p className="text-gray-700 italic mb-4" data-testid="testimonial-text-3">
                  "Стабильно получаю 400.000₽ в месяц. Банки уже не нужны, работаю только с криптой!"
                </p>
                <div className="text-crypto-green font-semibold">Заработок: +400.000₽/мес</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Course Details */}
      <section id="course" className="py-20 bg-gray-50" data-testid="course-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900" data-testid="course-title">
              ЧТО ВЫ ПОЛУЧИТЕ НА 
              <span className="bg-gradient-crypto bg-clip-text text-transparent">ИНТЕНСИВЕ</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              3 дня интенсивного обучения, которые изменят ваше отношение к деньгам навсегда
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="w-full h-80 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl shadow-2xl flex items-center justify-center">
                <TrendingUp className="h-32 w-32 text-blue-500/50" />
              </div>
            </div>
            <div>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-crypto-blue text-white rounded-xl p-3 mr-4 flex-shrink-0">
                    <Brain className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Психология криптотрейдинга</h3>
                    <p className="text-gray-600">Научитесь контролировать эмоции и принимать правильные решения на волатильном рынке</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-crypto-green text-white rounded-xl p-3 mr-4 flex-shrink-0">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Технический анализ</h3>
                    <p className="text-gray-600">Изучите паттерны, индикаторы и стратегии для успешной торговли криптовалютами</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-crypto-gold text-black rounded-xl p-3 mr-4 flex-shrink-0">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Управление рисками</h3>
                    <p className="text-gray-600">Защитите свой капитал с помощью проверенных стратегий риск-менеджмента</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-crypto-purple text-white rounded-xl p-3 mr-4 flex-shrink-0">
                    <Coins className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Альткоины и DeFi</h3>
                    <p className="text-gray-600">Откройте возможности заработка на альтернативных монетах и децентрализованных финансах</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Future of Crypto Section */}
          <Card className="mt-20 bg-gradient-crypto text-white">
            <CardContent className="p-12 text-center">
              <h3 className="text-3xl font-bold mb-6" data-testid="future-title">КРИПТА — ЭТО БУДУЩЕЕ</h3>
              <p className="text-xl mb-8 text-blue-100 max-w-4xl mx-auto leading-relaxed">
                Банковская система уходит в прошлое. Децентрализованные финансы, блокчейн-технологии и 
                криптовалюты формируют новый мировой порядок. Те, кто войдет в эту сферу сейчас, 
                получат максимальную выгоду в ближайшие годы.
              </p>
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="text-3xl font-bold text-crypto-gold mb-2">2030</div>
                  <div className="text-blue-100">Год, когда крипта станет основной валютой</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="text-3xl font-bold text-crypto-gold mb-2">1000%</div>
                  <div className="text-blue-100">Потенциальный рост Bitcoin к 2025</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="text-3xl font-bold text-crypto-gold mb-2">80%</div>
                  <div className="text-blue-100">Банков закроются в ближайшие 10 лет</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing & Registration */}
      <section id="register" className="py-20 bg-white" data-testid="register-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900" data-testid="register-title">
              НАЧНИТЕ ЗАРАБАТЫВАТЬ НА 
              <span className="bg-gradient-crypto bg-clip-text text-transparent">КРИПТОВАЛЮТАХ</span>
            </h2>
            <p className="text-xl text-gray-600">
              Присоединяйтесь к интенсиву и получите шанс выиграть BMW M5 F10
            </p>
          </div>

          <Card className="shadow-2xl">
            <CardContent className="p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Pricing Info */}
                <div className="space-y-8">
                  <div className="text-center lg:text-left">
                    <div className="bg-red-100 text-red-700 inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-4">
                      <Flame className="mr-2 h-4 w-4" />
                      ОГРАНИЧЕННОЕ ПРЕДЛОЖЕНИЕ
                    </div>
                    <div className="text-5xl font-bold text-gray-900 mb-4" data-testid="price-display">
                      2990₽
                      <span className="text-2xl text-gray-500 line-through ml-2">9990₽</span>
                    </div>
                    <div className="text-lg text-gray-600 mb-6">Полный доступ к 3-дневному интенсиву</div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <CheckCircle className="text-crypto-green mr-3 h-5 w-5" />
                      <span>3 дня интенсивного обучения</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="text-crypto-green mr-3 h-5 w-5" />
                      <span>Участие в розыгрыше BMW M5 F10</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="text-crypto-green mr-3 h-5 w-5" />
                      <span>Доступ к закрытому телеграм-каналу</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="text-crypto-green mr-3 h-5 w-5" />
                      <span>Пожизненная поддержка от Джамбо</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="text-crypto-green mr-3 h-5 w-5" />
                      <span>Проверенные стратегии заработка</span>
                    </div>
                  </div>

                  <div className="w-full h-64 bg-gradient-to-br from-gold-500/20 to-yellow-500/20 rounded-xl flex items-center justify-center">
                    <Star className="h-24 w-24 text-yellow-500/50" />
                  </div>
                </div>

                {/* Registration Form */}
                <div className="bg-white rounded-2xl p-8 shadow-xl">
                  {isSubmitted ? (
                    <div className="text-center" data-testid="success-message">
                      <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                      <h3 className="text-2xl font-bold text-green-800 mb-2">Заявка успешно отправлена!</h3>
                      <p className="text-green-600">Мы свяжемся с вами в ближайшее время</p>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-2xl font-bold mb-6 text-center" data-testid="form-title">Запишитесь на интенсив</h3>
                      
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="registration-form">
                        <div>
                          <Label htmlFor="name">Ваше имя *</Label>
                          <Input
                            id="name"
                            {...form.register("name")}
                            placeholder="Введите ваше имя"
                            className="mt-2"
                            data-testid="input-name"
                          />
                          {form.formState.errors.name && (
                            <p className="text-red-500 text-sm mt-1" data-testid="error-name">
                              {form.formState.errors.name.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="phone">Телефон *</Label>
                          <Input
                            id="phone"
                            {...form.register("phone")}
                            placeholder="+7 (999) 123-45-67"
                            className="mt-2"
                            data-testid="input-phone"
                          />
                          {form.formState.errors.phone && (
                            <p className="text-red-500 text-sm mt-1" data-testid="error-phone">
                              {form.formState.errors.phone.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            {...form.register("email")}
                            placeholder="your@email.com"
                            className="mt-2"
                            data-testid="input-email"
                          />
                          {form.formState.errors.email && (
                            <p className="text-red-500 text-sm mt-1" data-testid="error-email">
                              {form.formState.errors.email.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="experience">Опыт работы с криптовалютами</Label>
                          <Select onValueChange={(value) => form.setValue("experience", value)}>
                            <SelectTrigger className="mt-2" data-testid="select-experience">
                              <SelectValue placeholder="Выберите ваш уровень" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="beginner">Новичок</SelectItem>
                              <SelectItem value="intermediate">Есть базовые знания</SelectItem>
                              <SelectItem value="advanced">Продвинутый уровень</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="consent"
                            required
                            data-testid="checkbox-consent"
                          />
                          <Label htmlFor="consent" className="text-sm text-gray-600 leading-5">
                            Я согласен с обработкой персональных данных и получением информационных сообщений *
                          </Label>
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full bg-gradient-crypto hover:shadow-xl font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50"
                          disabled={registerMutation.isPending}
                          data-testid="button-submit"
                        >
                          {registerMutation.isPending ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Отправка...
                            </>
                          ) : (
                            <>
                              <Rocket className="mr-2 h-4 w-4" />
                              ЗАПИСАТЬСЯ НА ИНТЕНСИВ - 2990₽
                            </>
                          )}
                        </Button>
                      </form>

                      <div className="mt-6 text-center text-sm text-gray-500">
                        <Shield className="inline mr-1 h-4 w-4" />
                        Безопасная обработка данных
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12" data-testid="footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-2xl font-bold bg-gradient-crypto bg-clip-text text-transparent mb-4">ДЖАМБО</div>
              <p className="text-gray-400 mb-4">Эксперт по криптовалютам с 5-летним опытом. Помогаю людям зарабатывать на цифровых активах.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="social-telegram">
                  <PhoneCall className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="social-youtube">
                  <TrendingUp className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="social-instagram">
                  <Star className="h-5 w-5" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <div className="space-y-2 text-gray-400">
                <div><Mail className="inline mr-2 h-4 w-4" /> support@jambo-crypto.ru</div>
                <div><PhoneCall className="inline mr-2 h-4 w-4" /> +7 (999) 123-45-67</div>
                <div><PhoneCall className="inline mr-2 h-4 w-4" /> @jambo_crypto_bot</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Правовая информация</h4>
              <div className="space-y-2 text-gray-400">
                <div><a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a></div>
                <div><a href="#" className="hover:text-white transition-colors">Пользовательское соглашение</a></div>
                <div><a href="#" className="hover:text-white transition-colors">Правила розыгрыша</a></div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Джамбо Crypto Academy. Все права защищены.</p>
            <p className="text-sm mt-2">Инвестиции в криптовалюты связаны с рисками. Не инвестируйте больше, чем можете позволить себе потерять.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
