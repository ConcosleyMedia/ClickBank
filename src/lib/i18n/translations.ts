export const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
] as const

export type LanguageCode = typeof languages[number]['code']

export const translations: Record<LanguageCode, {
  // Navbar
  nav: {
    logIn: string
    startTest: string
    dashboard: string
    training: string
    logout: string
  }
  // Landing page
  landing: {
    headline: string
    headlineHighlight: string
    subheadline: string
    ctaStart: string
    ctaContinue: string
    socialProof: string
    testsTaken: string
  }
  // Quiz
  quiz: {
    preparing: string
    redirecting: string
    getReady: string
    startNow: string
    back: string
    skip: string
    getResults: string
    questionOf: string
  }
  // Results
  results: {
    yourScore: string
    percentile: string
    higherThan: string
    unlock: string
    unlockDesc: string
    certificate: string
    training: string
  }
  // Dashboard
  dashboard: {
    results: string
    certificate: string
    training: string
    yourIQ: string
    percentileRank: string
    downloadCert: string
    customize: string
    yourName: string
  }
  // Training
  training: {
    hub: string
    daily: string
    memory: string
    logic: string
    speed: string
    focus: string
    puzzles: string
    play: string
    start: string
    complete: string
    yourScore: string
    accuracy: string
    avgSpeed: string
    playAgain: string
    tryAnother: string
  }
  // Auth
  auth: {
    signIn: string
    accessResults: string
    enterEmail: string
    email: string
    checking: string
    accessMyResults: string
    noAccount: string
    takeTest: string
    noSubscription: string
    checkEmail: string
  }
  // Payment
  payment: {
    success: string
    checkEmail: string
    checkSpam: string
    spamWarning: string
    stillCantFind: string
    useSignIn: string
    returnHome: string
  }
  // Common
  common: {
    loading: string
    error: string
    tryAgain: string
    continue: string
    cancel: string
  }
}> = {
  en: {
    nav: {
      logIn: 'Log In',
      startTest: 'Start Test',
      dashboard: 'Dashboard',
      training: 'Training',
      logout: 'Logout',
    },
    landing: {
      headline: 'Want to Know Your',
      headlineHighlight: 'Real IQ Score?',
      subheadline: 'Take our scientifically designed IQ test and discover your cognitive abilities',
      ctaStart: 'Start IQ Test Now',
      ctaContinue: 'Continue Training',
      socialProof: 'Excellent user reviews',
      testsTaken: 'tests taken today',
    },
    quiz: {
      preparing: 'Preparing your quiz...',
      redirecting: 'Redirecting...',
      getReady: 'Get ready...',
      startNow: 'Start now!',
      back: 'Back',
      skip: 'Skip',
      getResults: 'Get My Results',
      questionOf: 'of',
    },
    results: {
      yourScore: 'Your IQ Score',
      percentile: 'Percentile',
      higherThan: 'Higher than',
      unlock: 'Unlock Your Full Results',
      unlockDesc: 'Get your detailed IQ analysis, certificate, and brain training',
      certificate: 'Certificate',
      training: 'Brain Training',
    },
    dashboard: {
      results: 'Results',
      certificate: 'Certificate',
      training: 'Training',
      yourIQ: 'Your IQ Score',
      percentileRank: 'Percentile Rank',
      downloadCert: 'Download Certificate',
      customize: 'Customize Your Certificate',
      yourName: 'Your Name',
    },
    training: {
      hub: 'Training Hub',
      daily: 'Daily Challenge',
      memory: 'Memory',
      logic: 'Logic',
      speed: 'Speed',
      focus: 'Focus',
      puzzles: 'Puzzles',
      play: 'Play',
      start: 'Start',
      complete: 'Complete!',
      yourScore: 'Your Score',
      accuracy: 'Accuracy',
      avgSpeed: 'Avg Speed',
      playAgain: 'Play Again',
      tryAnother: 'Try Another',
    },
    auth: {
      signIn: 'Sign In',
      accessResults: 'Access Your Results',
      enterEmail: 'Enter the email you used to purchase your subscription.',
      email: 'Email',
      checking: 'Checking...',
      accessMyResults: 'Access My Results',
      noAccount: "Don't have an account?",
      takeTest: 'Take the IQ test',
      noSubscription: 'No active subscription found for this email.',
      checkEmail: 'Please check your email',
    },
    payment: {
      success: 'Payment Successful!',
      checkEmail: 'Check your email for a link to access your IQ results.',
      checkSpam: 'Check your spam/junk folder!',
      spamWarning: 'The access link email sometimes gets filtered. Look for an email from BrainRank.',
      stillCantFind: "Still can't find it?",
      useSignIn: 'Use the sign-in page to access your results.',
      returnHome: 'Return to home',
    },
    common: {
      loading: 'Loading...',
      error: 'Something went wrong',
      tryAgain: 'Try Again',
      continue: 'Continue',
      cancel: 'Cancel',
    },
  },
  es: {
    nav: {
      logIn: 'Iniciar Sesión',
      startTest: 'Comenzar Test',
      dashboard: 'Panel',
      training: 'Entrenamiento',
      logout: 'Cerrar Sesión',
    },
    landing: {
      headline: '¿Quieres Saber Tu',
      headlineHighlight: 'Puntuación de IQ Real?',
      subheadline: 'Realiza nuestro test de IQ científicamente diseñado y descubre tus habilidades cognitivas',
      ctaStart: 'Comenzar Test de IQ',
      ctaContinue: 'Continuar Entrenamiento',
      socialProof: 'Excelentes reseñas de usuarios',
      testsTaken: 'tests realizados hoy',
    },
    quiz: {
      preparing: 'Preparando tu quiz...',
      redirecting: 'Redirigiendo...',
      getReady: 'Prepárate...',
      startNow: '¡Comienza ahora!',
      back: 'Atrás',
      skip: 'Omitir',
      getResults: 'Obtener Resultados',
      questionOf: 'de',
    },
    results: {
      yourScore: 'Tu Puntuación de IQ',
      percentile: 'Percentil',
      higherThan: 'Mayor que',
      unlock: 'Desbloquea Tus Resultados Completos',
      unlockDesc: 'Obtén tu análisis detallado de IQ, certificado y entrenamiento cerebral',
      certificate: 'Certificado',
      training: 'Entrenamiento Cerebral',
    },
    dashboard: {
      results: 'Resultados',
      certificate: 'Certificado',
      training: 'Entrenamiento',
      yourIQ: 'Tu Puntuación de IQ',
      percentileRank: 'Rango Percentil',
      downloadCert: 'Descargar Certificado',
      customize: 'Personaliza Tu Certificado',
      yourName: 'Tu Nombre',
    },
    training: {
      hub: 'Centro de Entrenamiento',
      daily: 'Desafío Diario',
      memory: 'Memoria',
      logic: 'Lógica',
      speed: 'Velocidad',
      focus: 'Enfoque',
      puzzles: 'Puzzles',
      play: 'Jugar',
      start: 'Iniciar',
      complete: '¡Completo!',
      yourScore: 'Tu Puntuación',
      accuracy: 'Precisión',
      avgSpeed: 'Velocidad Prom.',
      playAgain: 'Jugar de Nuevo',
      tryAnother: 'Probar Otro',
    },
    auth: {
      signIn: 'Iniciar Sesión',
      accessResults: 'Accede a Tus Resultados',
      enterEmail: 'Ingresa el correo que usaste para comprar tu suscripción.',
      email: 'Correo',
      checking: 'Verificando...',
      accessMyResults: 'Acceder a Mis Resultados',
      noAccount: '¿No tienes cuenta?',
      takeTest: 'Realiza el test de IQ',
      noSubscription: 'No se encontró suscripción activa para este correo.',
      checkEmail: 'Por favor revisa tu correo',
    },
    payment: {
      success: '¡Pago Exitoso!',
      checkEmail: 'Revisa tu correo para acceder a tus resultados de IQ.',
      checkSpam: '¡Revisa tu carpeta de spam!',
      spamWarning: 'El correo con el enlace a veces se filtra. Busca un correo de BrainRank.',
      stillCantFind: '¿Aún no lo encuentras?',
      useSignIn: 'Usa la página de inicio de sesión para acceder a tus resultados.',
      returnHome: 'Volver al inicio',
    },
    common: {
      loading: 'Cargando...',
      error: 'Algo salió mal',
      tryAgain: 'Intentar de Nuevo',
      continue: 'Continuar',
      cancel: 'Cancelar',
    },
  },
  pt: {
    nav: {
      logIn: 'Entrar',
      startTest: 'Iniciar Teste',
      dashboard: 'Painel',
      training: 'Treino',
      logout: 'Sair',
    },
    landing: {
      headline: 'Quer Saber Seu',
      headlineHighlight: 'QI Real?',
      subheadline: 'Faça nosso teste de QI cientificamente projetado e descubra suas habilidades cognitivas',
      ctaStart: 'Iniciar Teste de QI',
      ctaContinue: 'Continuar Treino',
      socialProof: 'Excelentes avaliações',
      testsTaken: 'testes realizados hoje',
    },
    quiz: {
      preparing: 'Preparando seu quiz...',
      redirecting: 'Redirecionando...',
      getReady: 'Prepare-se...',
      startNow: 'Comece agora!',
      back: 'Voltar',
      skip: 'Pular',
      getResults: 'Ver Resultados',
      questionOf: 'de',
    },
    results: {
      yourScore: 'Sua Pontuação de QI',
      percentile: 'Percentil',
      higherThan: 'Maior que',
      unlock: 'Desbloqueie Seus Resultados Completos',
      unlockDesc: 'Obtenha sua análise detalhada de QI, certificado e treino cerebral',
      certificate: 'Certificado',
      training: 'Treino Cerebral',
    },
    dashboard: {
      results: 'Resultados',
      certificate: 'Certificado',
      training: 'Treino',
      yourIQ: 'Sua Pontuação de QI',
      percentileRank: 'Ranking Percentil',
      downloadCert: 'Baixar Certificado',
      customize: 'Personalize Seu Certificado',
      yourName: 'Seu Nome',
    },
    training: {
      hub: 'Centro de Treino',
      daily: 'Desafio Diário',
      memory: 'Memória',
      logic: 'Lógica',
      speed: 'Velocidade',
      focus: 'Foco',
      puzzles: 'Puzzles',
      play: 'Jogar',
      start: 'Iniciar',
      complete: 'Completo!',
      yourScore: 'Sua Pontuação',
      accuracy: 'Precisão',
      avgSpeed: 'Veloc. Média',
      playAgain: 'Jogar Novamente',
      tryAnother: 'Tentar Outro',
    },
    auth: {
      signIn: 'Entrar',
      accessResults: 'Acesse Seus Resultados',
      enterEmail: 'Digite o email usado para comprar sua assinatura.',
      email: 'Email',
      checking: 'Verificando...',
      accessMyResults: 'Acessar Meus Resultados',
      noAccount: 'Não tem conta?',
      takeTest: 'Faça o teste de QI',
      noSubscription: 'Nenhuma assinatura ativa encontrada para este email.',
      checkEmail: 'Por favor verifique seu email',
    },
    payment: {
      success: 'Pagamento Bem-sucedido!',
      checkEmail: 'Verifique seu email para acessar seus resultados de QI.',
      checkSpam: 'Verifique sua pasta de spam!',
      spamWarning: 'O email com o link às vezes é filtrado. Procure um email do BrainRank.',
      stillCantFind: 'Ainda não encontrou?',
      useSignIn: 'Use a página de login para acessar seus resultados.',
      returnHome: 'Voltar ao início',
    },
    common: {
      loading: 'Carregando...',
      error: 'Algo deu errado',
      tryAgain: 'Tentar Novamente',
      continue: 'Continuar',
      cancel: 'Cancelar',
    },
  },
  ar: {
    nav: {
      logIn: 'تسجيل الدخول',
      startTest: 'ابدأ الاختبار',
      dashboard: 'لوحة التحكم',
      training: 'التدريب',
      logout: 'تسجيل الخروج',
    },
    landing: {
      headline: 'هل تريد معرفة',
      headlineHighlight: 'معدل ذكائك الحقيقي؟',
      subheadline: 'قم بإجراء اختبار الذكاء المصمم علمياً واكتشف قدراتك المعرفية',
      ctaStart: 'ابدأ اختبار الذكاء',
      ctaContinue: 'متابعة التدريب',
      socialProof: 'تقييمات ممتازة',
      testsTaken: 'اختبار تم إجراؤه اليوم',
    },
    quiz: {
      preparing: 'جارٍ تحضير الاختبار...',
      redirecting: 'جارٍ التحويل...',
      getReady: 'استعد...',
      startNow: 'ابدأ الآن!',
      back: 'رجوع',
      skip: 'تخطي',
      getResults: 'احصل على نتائجي',
      questionOf: 'من',
    },
    results: {
      yourScore: 'نتيجة ذكائك',
      percentile: 'المئين',
      higherThan: 'أعلى من',
      unlock: 'افتح نتائجك الكاملة',
      unlockDesc: 'احصل على تحليل ذكائك المفصل والشهادة وتدريب الدماغ',
      certificate: 'الشهادة',
      training: 'تدريب الدماغ',
    },
    dashboard: {
      results: 'النتائج',
      certificate: 'الشهادة',
      training: 'التدريب',
      yourIQ: 'نتيجة ذكائك',
      percentileRank: 'ترتيب المئين',
      downloadCert: 'تحميل الشهادة',
      customize: 'خصص شهادتك',
      yourName: 'اسمك',
    },
    training: {
      hub: 'مركز التدريب',
      daily: 'التحدي اليومي',
      memory: 'الذاكرة',
      logic: 'المنطق',
      speed: 'السرعة',
      focus: 'التركيز',
      puzzles: 'الألغاز',
      play: 'العب',
      start: 'ابدأ',
      complete: 'اكتمل!',
      yourScore: 'نتيجتك',
      accuracy: 'الدقة',
      avgSpeed: 'متوسط السرعة',
      playAgain: 'العب مجدداً',
      tryAnother: 'جرب آخر',
    },
    auth: {
      signIn: 'تسجيل الدخول',
      accessResults: 'الوصول إلى نتائجك',
      enterEmail: 'أدخل البريد الإلكتروني المستخدم لشراء اشتراكك.',
      email: 'البريد الإلكتروني',
      checking: 'جارٍ التحقق...',
      accessMyResults: 'الوصول إلى نتائجي',
      noAccount: 'ليس لديك حساب؟',
      takeTest: 'قم بإجراء اختبار الذكاء',
      noSubscription: 'لم يتم العثور على اشتراك نشط لهذا البريد.',
      checkEmail: 'يرجى التحقق من بريدك الإلكتروني',
    },
    payment: {
      success: 'تم الدفع بنجاح!',
      checkEmail: 'تحقق من بريدك للوصول إلى نتائج ذكائك.',
      checkSpam: 'تحقق من مجلد البريد المزعج!',
      spamWarning: 'قد يتم فلترة رسالة الرابط. ابحث عن رسالة من BrainRank.',
      stillCantFind: 'لا تزال لم تجدها؟',
      useSignIn: 'استخدم صفحة تسجيل الدخول للوصول إلى نتائجك.',
      returnHome: 'العودة للرئيسية',
    },
    common: {
      loading: 'جارٍ التحميل...',
      error: 'حدث خطأ ما',
      tryAgain: 'حاول مجدداً',
      continue: 'متابعة',
      cancel: 'إلغاء',
    },
  },
  id: {
    nav: {
      logIn: 'Masuk',
      startTest: 'Mulai Tes',
      dashboard: 'Dasbor',
      training: 'Pelatihan',
      logout: 'Keluar',
    },
    landing: {
      headline: 'Ingin Tahu',
      headlineHighlight: 'Skor IQ Asli Anda?',
      subheadline: 'Ikuti tes IQ yang dirancang secara ilmiah dan temukan kemampuan kognitif Anda',
      ctaStart: 'Mulai Tes IQ',
      ctaContinue: 'Lanjutkan Pelatihan',
      socialProof: 'Ulasan pengguna yang sangat baik',
      testsTaken: 'tes dilakukan hari ini',
    },
    quiz: {
      preparing: 'Menyiapkan kuis Anda...',
      redirecting: 'Mengalihkan...',
      getReady: 'Bersiaplah...',
      startNow: 'Mulai sekarang!',
      back: 'Kembali',
      skip: 'Lewati',
      getResults: 'Dapatkan Hasil',
      questionOf: 'dari',
    },
    results: {
      yourScore: 'Skor IQ Anda',
      percentile: 'Persentil',
      higherThan: 'Lebih tinggi dari',
      unlock: 'Buka Hasil Lengkap Anda',
      unlockDesc: 'Dapatkan analisis IQ detail, sertifikat, dan pelatihan otak',
      certificate: 'Sertifikat',
      training: 'Pelatihan Otak',
    },
    dashboard: {
      results: 'Hasil',
      certificate: 'Sertifikat',
      training: 'Pelatihan',
      yourIQ: 'Skor IQ Anda',
      percentileRank: 'Peringkat Persentil',
      downloadCert: 'Unduh Sertifikat',
      customize: 'Sesuaikan Sertifikat Anda',
      yourName: 'Nama Anda',
    },
    training: {
      hub: 'Pusat Pelatihan',
      daily: 'Tantangan Harian',
      memory: 'Memori',
      logic: 'Logika',
      speed: 'Kecepatan',
      focus: 'Fokus',
      puzzles: 'Teka-teki',
      play: 'Main',
      start: 'Mulai',
      complete: 'Selesai!',
      yourScore: 'Skor Anda',
      accuracy: 'Akurasi',
      avgSpeed: 'Kec. Rata-rata',
      playAgain: 'Main Lagi',
      tryAnother: 'Coba Lain',
    },
    auth: {
      signIn: 'Masuk',
      accessResults: 'Akses Hasil Anda',
      enterEmail: 'Masukkan email yang digunakan untuk membeli langganan.',
      email: 'Email',
      checking: 'Memeriksa...',
      accessMyResults: 'Akses Hasil Saya',
      noAccount: 'Belum punya akun?',
      takeTest: 'Ikuti tes IQ',
      noSubscription: 'Tidak ada langganan aktif untuk email ini.',
      checkEmail: 'Silakan periksa email Anda',
    },
    payment: {
      success: 'Pembayaran Berhasil!',
      checkEmail: 'Periksa email Anda untuk mengakses hasil IQ.',
      checkSpam: 'Periksa folder spam Anda!',
      spamWarning: 'Email tautan kadang terfilter. Cari email dari BrainRank.',
      stillCantFind: 'Masih tidak menemukan?',
      useSignIn: 'Gunakan halaman masuk untuk mengakses hasil Anda.',
      returnHome: 'Kembali ke beranda',
    },
    common: {
      loading: 'Memuat...',
      error: 'Terjadi kesalahan',
      tryAgain: 'Coba Lagi',
      continue: 'Lanjutkan',
      cancel: 'Batal',
    },
  },
  hi: {
    nav: {
      logIn: 'लॉग इन',
      startTest: 'टेस्ट शुरू करें',
      dashboard: 'डैशबोर्ड',
      training: 'प्रशिक्षण',
      logout: 'लॉग आउट',
    },
    landing: {
      headline: 'अपना जानना चाहते हैं',
      headlineHighlight: 'असली IQ स्कोर?',
      subheadline: 'हमारा वैज्ञानिक रूप से डिज़ाइन किया गया IQ टेस्ट लें और अपनी संज्ञानात्मक क्षमताओं का पता लगाएं',
      ctaStart: 'IQ टेस्ट शुरू करें',
      ctaContinue: 'प्रशिक्षण जारी रखें',
      socialProof: 'उत्कृष्ट उपयोगकर्ता समीक्षाएं',
      testsTaken: 'आज टेस्ट लिए गए',
    },
    quiz: {
      preparing: 'आपकी क्विज़ तैयार हो रही है...',
      redirecting: 'रीडायरेक्ट हो रहा है...',
      getReady: 'तैयार हो जाइए...',
      startNow: 'अभी शुरू करें!',
      back: 'वापस',
      skip: 'छोड़ें',
      getResults: 'मेरे परिणाम प्राप्त करें',
      questionOf: 'में से',
    },
    results: {
      yourScore: 'आपका IQ स्कोर',
      percentile: 'प्रतिशतक',
      higherThan: 'से अधिक',
      unlock: 'अपने पूर्ण परिणाम अनलॉक करें',
      unlockDesc: 'अपना विस्तृत IQ विश्लेषण, प्रमाणपत्र और मस्तिष्क प्रशिक्षण प्राप्त करें',
      certificate: 'प्रमाणपत्र',
      training: 'मस्तिष्क प्रशिक्षण',
    },
    dashboard: {
      results: 'परिणाम',
      certificate: 'प्रमाणपत्र',
      training: 'प्रशिक्षण',
      yourIQ: 'आपका IQ स्कोर',
      percentileRank: 'प्रतिशतक रैंक',
      downloadCert: 'प्रमाणपत्र डाउनलोड करें',
      customize: 'अपना प्रमाणपत्र अनुकूलित करें',
      yourName: 'आपका नाम',
    },
    training: {
      hub: 'प्रशिक्षण केंद्र',
      daily: 'दैनिक चुनौती',
      memory: 'स्मृति',
      logic: 'तर्क',
      speed: 'गति',
      focus: 'ध्यान',
      puzzles: 'पहेलियां',
      play: 'खेलें',
      start: 'शुरू करें',
      complete: 'पूर्ण!',
      yourScore: 'आपका स्कोर',
      accuracy: 'सटीकता',
      avgSpeed: 'औसत गति',
      playAgain: 'फिर से खेलें',
      tryAnother: 'दूसरा प्रयास करें',
    },
    auth: {
      signIn: 'साइन इन',
      accessResults: 'अपने परिणाम एक्सेस करें',
      enterEmail: 'अपनी सदस्यता खरीदने के लिए उपयोग किया गया ईमेल दर्ज करें।',
      email: 'ईमेल',
      checking: 'जांच रहे हैं...',
      accessMyResults: 'मेरे परिणाम एक्सेस करें',
      noAccount: 'खाता नहीं है?',
      takeTest: 'IQ टेस्ट लें',
      noSubscription: 'इस ईमेल के लिए कोई सक्रिय सदस्यता नहीं मिली।',
      checkEmail: 'कृपया अपना ईमेल जांचें',
    },
    payment: {
      success: 'भुगतान सफल!',
      checkEmail: 'अपने IQ परिणामों तक पहुंचने के लिए अपना ईमेल जांचें।',
      checkSpam: 'अपना स्पैम फ़ोल्डर जांचें!',
      spamWarning: 'एक्सेस लिंक ईमेल कभी-कभी फ़िल्टर हो जाती है। BrainRank से ईमेल खोजें।',
      stillCantFind: 'अभी भी नहीं मिला?',
      useSignIn: 'अपने परिणामों तक पहुंचने के लिए साइन-इन पेज का उपयोग करें।',
      returnHome: 'होम पर वापस जाएं',
    },
    common: {
      loading: 'लोड हो रहा है...',
      error: 'कुछ गलत हो गया',
      tryAgain: 'पुनः प्रयास करें',
      continue: 'जारी रखें',
      cancel: 'रद्द करें',
    },
  },
  ja: {
    nav: {
      logIn: 'ログイン',
      startTest: 'テスト開始',
      dashboard: 'ダッシュボード',
      training: 'トレーニング',
      logout: 'ログアウト',
    },
    landing: {
      headline: 'あなたの',
      headlineHighlight: '本当のIQスコアを知りたい？',
      subheadline: '科学的に設計されたIQテストで、あなたの認知能力を発見しましょう',
      ctaStart: 'IQテストを始める',
      ctaContinue: 'トレーニングを続ける',
      socialProof: '素晴らしいユーザーレビュー',
      testsTaken: '本日のテスト数',
    },
    quiz: {
      preparing: 'クイズを準備中...',
      redirecting: 'リダイレクト中...',
      getReady: '準備して...',
      startNow: '今すぐ始めましょう！',
      back: '戻る',
      skip: 'スキップ',
      getResults: '結果を見る',
      questionOf: '/',
    },
    results: {
      yourScore: 'あなたのIQスコア',
      percentile: 'パーセンタイル',
      higherThan: 'より高い',
      unlock: '完全な結果をアンロック',
      unlockDesc: '詳細なIQ分析、証明書、脳トレーニングを入手',
      certificate: '証明書',
      training: '脳トレーニング',
    },
    dashboard: {
      results: '結果',
      certificate: '証明書',
      training: 'トレーニング',
      yourIQ: 'あなたのIQスコア',
      percentileRank: 'パーセンタイル順位',
      downloadCert: '証明書をダウンロード',
      customize: '証明書をカスタマイズ',
      yourName: 'お名前',
    },
    training: {
      hub: 'トレーニングハブ',
      daily: 'デイリーチャレンジ',
      memory: '記憶力',
      logic: '論理',
      speed: 'スピード',
      focus: '集中力',
      puzzles: 'パズル',
      play: 'プレイ',
      start: '開始',
      complete: '完了！',
      yourScore: 'あなたのスコア',
      accuracy: '正確性',
      avgSpeed: '平均速度',
      playAgain: 'もう一度',
      tryAnother: '別を試す',
    },
    auth: {
      signIn: 'サインイン',
      accessResults: '結果にアクセス',
      enterEmail: 'サブスクリプション購入時に使用したメールを入力してください。',
      email: 'メール',
      checking: '確認中...',
      accessMyResults: '結果にアクセス',
      noAccount: 'アカウントをお持ちでない？',
      takeTest: 'IQテストを受ける',
      noSubscription: 'このメールでアクティブなサブスクリプションが見つかりません。',
      checkEmail: 'メールをご確認ください',
    },
    payment: {
      success: '支払い完了！',
      checkEmail: 'IQ結果にアクセスするためにメールをご確認ください。',
      checkSpam: '迷惑メールフォルダを確認！',
      spamWarning: 'アクセスリンクメールがフィルタリングされることがあります。BrainRankからのメールを探してください。',
      stillCantFind: 'まだ見つからない？',
      useSignIn: 'サインインページから結果にアクセスしてください。',
      returnHome: 'ホームに戻る',
    },
    common: {
      loading: '読み込み中...',
      error: 'エラーが発生しました',
      tryAgain: '再試行',
      continue: '続ける',
      cancel: 'キャンセル',
    },
  },
  fr: {
    nav: {
      logIn: 'Connexion',
      startTest: 'Commencer le Test',
      dashboard: 'Tableau de Bord',
      training: 'Entraînement',
      logout: 'Déconnexion',
    },
    landing: {
      headline: 'Voulez-vous Connaître Votre',
      headlineHighlight: 'Vrai Score de QI ?',
      subheadline: 'Passez notre test de QI scientifiquement conçu et découvrez vos capacités cognitives',
      ctaStart: 'Commencer le Test de QI',
      ctaContinue: 'Continuer l\'Entraînement',
      socialProof: 'Excellents avis utilisateurs',
      testsTaken: 'tests effectués aujourd\'hui',
    },
    quiz: {
      preparing: 'Préparation de votre quiz...',
      redirecting: 'Redirection...',
      getReady: 'Préparez-vous...',
      startNow: 'Commencez maintenant !',
      back: 'Retour',
      skip: 'Passer',
      getResults: 'Obtenir Mes Résultats',
      questionOf: 'sur',
    },
    results: {
      yourScore: 'Votre Score de QI',
      percentile: 'Percentile',
      higherThan: 'Plus élevé que',
      unlock: 'Débloquez Vos Résultats Complets',
      unlockDesc: 'Obtenez votre analyse détaillée du QI, certificat et entraînement cérébral',
      certificate: 'Certificat',
      training: 'Entraînement Cérébral',
    },
    dashboard: {
      results: 'Résultats',
      certificate: 'Certificat',
      training: 'Entraînement',
      yourIQ: 'Votre Score de QI',
      percentileRank: 'Rang Percentile',
      downloadCert: 'Télécharger le Certificat',
      customize: 'Personnalisez Votre Certificat',
      yourName: 'Votre Nom',
    },
    training: {
      hub: 'Centre d\'Entraînement',
      daily: 'Défi Quotidien',
      memory: 'Mémoire',
      logic: 'Logique',
      speed: 'Vitesse',
      focus: 'Concentration',
      puzzles: 'Puzzles',
      play: 'Jouer',
      start: 'Commencer',
      complete: 'Terminé !',
      yourScore: 'Votre Score',
      accuracy: 'Précision',
      avgSpeed: 'Vitesse Moy.',
      playAgain: 'Rejouer',
      tryAnother: 'Essayer Autre',
    },
    auth: {
      signIn: 'Connexion',
      accessResults: 'Accédez à Vos Résultats',
      enterEmail: 'Entrez l\'email utilisé pour acheter votre abonnement.',
      email: 'Email',
      checking: 'Vérification...',
      accessMyResults: 'Accéder à Mes Résultats',
      noAccount: 'Pas de compte ?',
      takeTest: 'Passez le test de QI',
      noSubscription: 'Aucun abonnement actif trouvé pour cet email.',
      checkEmail: 'Veuillez vérifier votre email',
    },
    payment: {
      success: 'Paiement Réussi !',
      checkEmail: 'Vérifiez votre email pour accéder à vos résultats de QI.',
      checkSpam: 'Vérifiez votre dossier spam !',
      spamWarning: 'L\'email avec le lien est parfois filtré. Cherchez un email de BrainRank.',
      stillCantFind: 'Toujours introuvable ?',
      useSignIn: 'Utilisez la page de connexion pour accéder à vos résultats.',
      returnHome: 'Retour à l\'accueil',
    },
    common: {
      loading: 'Chargement...',
      error: 'Une erreur s\'est produite',
      tryAgain: 'Réessayer',
      continue: 'Continuer',
      cancel: 'Annuler',
    },
  },
  ko: {
    nav: {
      logIn: '로그인',
      startTest: '테스트 시작',
      dashboard: '대시보드',
      training: '훈련',
      logout: '로그아웃',
    },
    landing: {
      headline: '당신의',
      headlineHighlight: '진짜 IQ 점수를 알고 싶으신가요?',
      subheadline: '과학적으로 설계된 IQ 테스트를 통해 인지 능력을 발견하세요',
      ctaStart: 'IQ 테스트 시작',
      ctaContinue: '훈련 계속하기',
      socialProof: '우수한 사용자 리뷰',
      testsTaken: '오늘 완료된 테스트',
    },
    quiz: {
      preparing: '퀴즈 준비 중...',
      redirecting: '리디렉션 중...',
      getReady: '준비하세요...',
      startNow: '지금 시작!',
      back: '뒤로',
      skip: '건너뛰기',
      getResults: '결과 보기',
      questionOf: '/',
    },
    results: {
      yourScore: '당신의 IQ 점수',
      percentile: '백분위',
      higherThan: '보다 높음',
      unlock: '전체 결과 잠금 해제',
      unlockDesc: '상세한 IQ 분석, 인증서 및 두뇌 훈련을 받으세요',
      certificate: '인증서',
      training: '두뇌 훈련',
    },
    dashboard: {
      results: '결과',
      certificate: '인증서',
      training: '훈련',
      yourIQ: '당신의 IQ 점수',
      percentileRank: '백분위 순위',
      downloadCert: '인증서 다운로드',
      customize: '인증서 사용자 정의',
      yourName: '이름',
    },
    training: {
      hub: '훈련 센터',
      daily: '일일 챌린지',
      memory: '기억력',
      logic: '논리',
      speed: '속도',
      focus: '집중력',
      puzzles: '퍼즐',
      play: '플레이',
      start: '시작',
      complete: '완료!',
      yourScore: '당신의 점수',
      accuracy: '정확도',
      avgSpeed: '평균 속도',
      playAgain: '다시 플레이',
      tryAnother: '다른 것 시도',
    },
    auth: {
      signIn: '로그인',
      accessResults: '결과 접근',
      enterEmail: '구독 구매 시 사용한 이메일을 입력하세요.',
      email: '이메일',
      checking: '확인 중...',
      accessMyResults: '내 결과 접근',
      noAccount: '계정이 없으신가요?',
      takeTest: 'IQ 테스트 받기',
      noSubscription: '이 이메일에 대한 활성 구독이 없습니다.',
      checkEmail: '이메일을 확인해 주세요',
    },
    payment: {
      success: '결제 성공!',
      checkEmail: 'IQ 결과에 접근하려면 이메일을 확인하세요.',
      checkSpam: '스팸 폴더를 확인하세요!',
      spamWarning: '접근 링크 이메일이 필터링될 수 있습니다. BrainRank에서 온 이메일을 찾아보세요.',
      stillCantFind: '아직 찾을 수 없나요?',
      useSignIn: '로그인 페이지를 사용하여 결과에 접근하세요.',
      returnHome: '홈으로 돌아가기',
    },
    common: {
      loading: '로딩 중...',
      error: '오류가 발생했습니다',
      tryAgain: '다시 시도',
      continue: '계속',
      cancel: '취소',
    },
  },
  tr: {
    nav: {
      logIn: 'Giriş Yap',
      startTest: 'Teste Başla',
      dashboard: 'Panel',
      training: 'Eğitim',
      logout: 'Çıkış Yap',
    },
    landing: {
      headline: 'Gerçek',
      headlineHighlight: 'IQ Puanınızı Öğrenmek İster misiniz?',
      subheadline: 'Bilimsel olarak tasarlanmış IQ testimizi yapın ve bilişsel yeteneklerinizi keşfedin',
      ctaStart: 'IQ Testine Başla',
      ctaContinue: 'Eğitime Devam Et',
      socialProof: 'Mükemmel kullanıcı yorumları',
      testsTaken: 'bugün yapılan test',
    },
    quiz: {
      preparing: 'Sınavınız hazırlanıyor...',
      redirecting: 'Yönlendiriliyor...',
      getReady: 'Hazır olun...',
      startNow: 'Şimdi başlayın!',
      back: 'Geri',
      skip: 'Atla',
      getResults: 'Sonuçlarımı Al',
      questionOf: '/',
    },
    results: {
      yourScore: 'IQ Puanınız',
      percentile: 'Yüzdelik',
      higherThan: 'daha yüksek',
      unlock: 'Tam Sonuçlarınızın Kilidini Açın',
      unlockDesc: 'Detaylı IQ analizinizi, sertifikanızı ve beyin eğitiminizi alın',
      certificate: 'Sertifika',
      training: 'Beyin Eğitimi',
    },
    dashboard: {
      results: 'Sonuçlar',
      certificate: 'Sertifika',
      training: 'Eğitim',
      yourIQ: 'IQ Puanınız',
      percentileRank: 'Yüzdelik Sıralaması',
      downloadCert: 'Sertifikayı İndir',
      customize: 'Sertifikanızı Özelleştirin',
      yourName: 'Adınız',
    },
    training: {
      hub: 'Eğitim Merkezi',
      daily: 'Günlük Meydan Okuma',
      memory: 'Hafıza',
      logic: 'Mantık',
      speed: 'Hız',
      focus: 'Odak',
      puzzles: 'Bulmacalar',
      play: 'Oyna',
      start: 'Başla',
      complete: 'Tamamlandı!',
      yourScore: 'Puanınız',
      accuracy: 'Doğruluk',
      avgSpeed: 'Ort. Hız',
      playAgain: 'Tekrar Oyna',
      tryAnother: 'Başka Dene',
    },
    auth: {
      signIn: 'Giriş Yap',
      accessResults: 'Sonuçlarınıza Erişin',
      enterEmail: 'Abonelik satın alırken kullandığınız e-postayı girin.',
      email: 'E-posta',
      checking: 'Kontrol ediliyor...',
      accessMyResults: 'Sonuçlarıma Eriş',
      noAccount: 'Hesabınız yok mu?',
      takeTest: 'IQ testini yapın',
      noSubscription: 'Bu e-posta için aktif abonelik bulunamadı.',
      checkEmail: 'Lütfen e-postanızı kontrol edin',
    },
    payment: {
      success: 'Ödeme Başarılı!',
      checkEmail: 'IQ sonuçlarınıza erişmek için e-postanızı kontrol edin.',
      checkSpam: 'Spam klasörünüzü kontrol edin!',
      spamWarning: 'Erişim bağlantısı e-postası bazen filtrelenir. BrainRank\'ten bir e-posta arayın.',
      stillCantFind: 'Hala bulamıyor musunuz?',
      useSignIn: 'Sonuçlarınıza erişmek için giriş sayfasını kullanın.',
      returnHome: 'Ana sayfaya dön',
    },
    common: {
      loading: 'Yükleniyor...',
      error: 'Bir şeyler ters gitti',
      tryAgain: 'Tekrar Dene',
      continue: 'Devam Et',
      cancel: 'İptal',
    },
  },
}
