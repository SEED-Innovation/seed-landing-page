export type TermsData = {
  title: string;
  intro: string;
  sections: { title: string; content: string[] }[];
  lastUpdated: string;
};

export const termsContent: Record<'en' | 'ar', TermsData> = {
  en: {
   title: "SEED Innovation – Terms of Service",
  lastUpdated: "Last Updated: July 10, 2025",
  intro: "Welcome to SEED Innovation (“SEED Innovation,” “we,” “us,” or “our”). These Terms of Service (“Terms”) govern your access to and use of the SEED Innovation mobile application (the “App”).\n\nBy downloading, installing, or using the App, you agree to be bound by these Terms and our Privacy Policy. If you do not agree, you must delete the App immediately.",
  sections: [
    {
      title: "1. Provision of Services",
      content: ["SEED provides an AI‑powered platform for booking tennis & paddle courts, recording sessions, delivering performance analytics and advertisement. We may update or modify features at any time, without prior notice, provided we do not materially degrade your user experience."]
    },
    {
      title: "2. Eligibility",
      content: ["You must be at least 15 years old to register for and use the App. By creating an account, you represent that you meet this age requirement and that all information you provide is accurate and complete."]
    },
    {
      title: "3. User Accounts",
      content: [
        "● **Registration:** You may sign up via email, phone number, or social login.",
        "● **Credentials:** You are responsible for maintaining the security of your account credentials.",
        "● **Accuracy:** You agree to keep your account information current and truthful.",
        "● **Suspension:** We reserve the right to suspend or terminate any account that violates these Terms or engages in fraudulent activity."
      ]
    },
    {
      title: "4. Subscriptions & Payments",
      content: [
        "● **Plans:** SEED offers Free, Basic, and Premium subscription tiers.",
        "● **Billing:** Payments are processed through secure third‑party gateways.",
        "● **Renewals:** Paid plans auto‑renew unless you cancel at least 24 hours before the end of the current term.",
        "● **Cancellations & Refunds:** You may cancel at any time via the App or by emailing support. No refunds are issued for partial billing periods."
      ]
    },
    {
      title: "5. User Obligations",
      content: [
        "● **Lawful Use:** You agree not to use the App for any unlawful purpose or in a way that violates these Terms.",
        "● **Respectful Conduct:** Harassment, hate speech, or abusive behavior toward other users or staff or any is strictly prohibited.",
        "**Data Integrity:** Do not falsify booking or performance data and do not attempt to tamper with smart court hardware."
      ]
    },
    {
      title: "6. Intellectual Property",
      content: [
        "● **Ownership:** All App content, software, trademarks, and analytics models are the property of SEED Innovation or its licensors.",
        "● **License:** We grant you a limited, non‑exclusive, non‑transferable license to use the App for personal or organizational purposes in accordance with these Terms.",
        "● **Restrictions:** You may not reverse‑engineer, modify, or distribute any part of the App without our prior written consent."
      ]
    },
    {
      title: "7. Privacy & Data Protection",
      content: ["Our Privacy Policy (available within the App and at seedco.sa) explains how we collect, use, and disclose your information. By using SEED Innovation, you consent to our data practices as described there."]
    },
    {
      title: "8. Disclaimers & Limitation of Liability",
      content: [
        "● **“As Is” Basis:** The App is provided on an “as is” and “as available” basis. SEED makes no warranties, express or implied, regarding performance, accuracy, or fitness for a particular purpose.",
        "● **Limitation:** To the maximum extent permitted by law, SEED Innovation and its affiliates are not liable for any indirect, incidental, or consequential damages arising from your use of the App."
      ]
    },
    {
      title: "9. Termination",
      content: ["We may terminate or suspend your access at any time, without notice, for conduct we believe violates these Terms or is harmful to SEED Innovation or other users. Upon termination, your right to use the App ceases immediately, but Sections 6, 7, 8, and this Section 9 will survive."]
    },
    {
      title: "10. Changes to These Terms",
      content: ["We may update these Terms from time to time. We will notify you of material changes via the App or email. Continued use of the App after such notice constitutes acceptance of the updated Terms."]
    },
    {
      title: "11. Governing Law",
      content: ["These Terms are complied & governed by the laws of the Kingdom of Saudi Arabia, without regard to conflict of laws principles."]
    },
    {
      title: "12. Contact Us",
      content: ["If you have any questions or concerns about these Terms or the App, please reach out to us at: contact@seedco.sa", "Thank you for choosing SEED Innovation. We look forward to helping you elevate your game."]
    }
  ]
  },
  ar: {
   title: "سييد للابتكار (SEED Innovation) – شروط الخدمة",
  lastUpdated: "آخر تحديث: 10 يوليو 2025",
  intro: "مرحباً بكم في سييد للابتكار (“SEED Innovation” أو “نحن” أو “لنا”). تحكم شروط الخدمة هذه (“الشروط”) وصولك إلى تطبيق سييد للابتكار للهواتف المحمولة (“التطبيق”) واستخدامه.\n\nبتحميل التطبيق أو تثبيته أو استخدامه، فإنك توافق على الالتزام بهذه الشروط وسياسة الخصوصية الخاصة بنا. إذا كنت لا توافق، يجب عليك حذف التطبيق فوراً.",
  sections: [
    {
      title: "1. تقديم الخدمات",
      content: ["توفر سييد منصة مدعومة بالذكاء الاصطناعي لحجز ملاعب التنس والبادل، وتسجيل الجلسات، وتقديم تحليلات الأداء والإعلانات. قد نقوم بتحديث أو تعديل الميزات في أي وقت، دون إشعار مسبق، شريطة ألا يؤدي ذلك إلى تدهور تجربة المستخدم بشكل جوهري."]
    },
    {
      title: "2. الأهلية",
      content: ["يجب أن لا يقل عمرك عن 15 عاماً للتسجيل في التطبيق واستخدامه. من خلال إنشاء حساب، فإنك تقر بأنك تستوفي شرط السن هذا وأن جميع المعلومات التي تقدمها دقيقة وكاملة."]
    },
    {
      title: "3. حسابات المستخدمين",
      content: [
        "● **التسجيل:** يمكنك التسجيل عبر البريد الإلكتروني أو رقم الهاتف أو تسجيل الدخول الاجتماعي.",
        "● **بيانات الاعتماد:** أنت مسؤول عن الحفاظ على أمن بيانات اعتماد حسابك.",
        "● **الدقة:** توافق على الحفاظ على معلومات حسابك محدثة وصادقة.",
        "● **التعليق:** نحتفظ بالحق في تعليق أو إنهاء أي حساب ينتهك هذه الشروط أو يشارك في نشاط احتيالي."
      ]
    },
    {
      title: "4. الاشتراكات والمدفوعات",
      content: [
        "● **الخطط:** تقدم سييد فئات اشتراك مجانية وأساسية ومميزة.",
        "● **الفواتير:** تتم معالجة المدفوعات من خلال بوابات طرف ثالث آمنة.",
        "● **التجديدات:** تتجدد الخطط المدفوعة تلقائياً ما لم تقم بالإلغاء قبل 24 ساعة على الأقل من نهاية الفترة الحالية.",
        "● **الإلغاء والاسترداد:** يمكنك الإلغاء في أي وقت عبر التطبيق أو بمراسلة الدعم. لا يتم استرداد أي مبالغ لفترات الفواتير الجزئية."
      ]
    },
    {
      title: "5. التزامات المستخدم",
      content: [
        "● **الاستخدام المشروع:** توافق على عدم استخدام التطبيق لأي غرض غير قانوني أو بطريقة تنتهك هذه الشروط.",
        "● **السلوك المحترم:** يمنع منعاً باتاً المضايقة أو خطاب الكراهية أو السلوك المسيء تجاه المستخدمين الآخرين أو الموظفين أو أي جهة.",
        "**نزاهة البيانات:** لا تقم بتزوير بيانات الحجز أو الأداء ولا تحاول العبث بأجهزة الملاعب الذكية."
      ]
    },
    {
      title: "6. الملكية الفكرية",
      content: [
        "● **الملكية:** جميع محتويات التطبيق والبرامج والعلامات التجارية ونماذج التحليلات هي ملك لشركة سييد للابتكار أو مرخصيها.",
        "● **الترخيص:** نمنحك ترخيصاً محدوداً وغير حصري وغير قابل للنقل لاستخدام التطبيق لأغراض شخصية أو تنظيمية وفقاً لهذه الشروط.",
        "● **القيود:** لا يجوز لك هندسة عكسية أو تعديل أو توزيع أي جزء من التطبيق دون موافقة خطية مسبقة منا."
      ]
    },
    {
      title: "7. الخصوصية وحماية البيانات",
      content: ["توضح سياسة الخصوصية الخاصة بنا (المتاحة داخل التطبيق وعلى seedco.sa) كيفية جمع معلوماتك واستخدامها والكشف عنها. باستخدامك لسييد للابتكار، فإنك توافق على ممارسات البيانات الخاصة بنا كما هي موصوفة هناك."]
    },
    {
      title: "8. إخلاء المسؤولية وحدود المسؤولية",
      content: [
        "● **أساس 'كما هو':** يتم توفير التطبيق على أساس 'كما هو' و 'كما هو متاح'. لا تقدم سييد أي ضمانات، صريحة أو ضمنية، فيما يتعلق بالأداء أو الدقة أو الملاءمة لغرض معين.",
        "● **المسؤولية:** إلى أقصى حد يسمح به القانون، لا تتحمل سييد للابتكار وشركاتها التابعة المسؤولية عن أي أضرار غير مباشرة أو عرضية أو تبعية تنشأ عن استخدامك للتطبيق."
      ]
    },
    {
      title: "9. الإنهاء",
      content: ["يجوز لنا إنهاء أو تعليق وصولك في أي وقت، دون إشعار، بسبب سلوك نعتقد أنه ينتهك هذه الشروط أو يضر بسييد للابتكار أو المستخدمين الآخرين. عند الإنهاء، يتوقف حقك في استخدام التطبيق فوراً، ولكن الأقسام 6 و7 و8 وهذا القسم 9 ستظل سارية."]
    },
    {
      title: "10. التغييرات على هذه الشروط",
      content: ["قد نقوم بتحديث هذه الشروط من وقت لآخر. سنخطرك بالتغييرات الجوهرية عبر التطبيق أو البريد الإلكتروني. استمرار استخدام التطبيق بعد هذا الإشعار يشكل قبولاً للشروط المحدثة."]
    },
    {
      title: "11. القانون الواجب التطبيق",
      content: ["تخضع هذه الشروط وتفسر وفقاً لقوانين المملكة العربية السعودية، دون اعتبار لمبادئ تنازع القوانين."]
    },
    {
      title: "12. اتصل بنا",
      content: ["إذا كان لديك أي أسئلة أو استفسارات بشأن هذه الشروط أو التطبيق، يرجى التواصل معنا على: contact@seedco.sa", "شكراً لاختياركم سييد للابتكار. نتطلع لمساعدتكم في الارتقاء بمستوى لعبكم."]
    }
  ]
  }
};