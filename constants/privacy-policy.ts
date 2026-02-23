export type PolicyData = {
  title: string;
  intro: string;
  sections: { title: string; content: string[] }[];
  lastUpdated: string;
};

export const privacyContent: Record<'en' | 'ar', PolicyData> = {
  en: {
    title: "SEED – Privacy Policy",
  lastUpdated: "Last Updated: July 10, 2025",
  intro: "At SEED Sports Technologies (“SEED,” “we,” “us,” or “our”), your privacy is a priority. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use the SEED mobile application (the “App”) for court booking, session recording, and performance analytics.\n\nBy downloading, installing, or using SEED, you agree to the collection and use of information in accordance with this policy and Apple’s App Store privacy requirements.",
  sections: [
    {
      title: "1. Information We Collect",
      content: [
        "**a. Personal Information You Provide:** Name, Email, Phone Number, Demographic Data (age range, skill level), Payment Details (processed securely via third‑party gateways). Purpose: To create and manage your account, process bookings and payments, and offer personalized support. We never sell or rent this data.",
        "**b. Usage & Device Data:** Device Information (IP address, operating system, App version), Usage Metrics (Pages visited, features used, session duration), Booking Details (Courts selected, dates, times, payment status). Purpose: To monitor and improve App performance, troubleshoot issues, and understand feature adoption.",
        "**c. Location Data:** With your permission, we collect approximate location to: Display nearby courts, Suggest available time slots based on proximity. Note: Location data is used solely to enhance booking and match check‑in experiences. It is not shared with advertisers or data brokers.",
        "**d. Court Video Footage:** Fixed cameras at SEED‑enabled courts capture match footage, which is: Uploaded securely to our cloud for AI processing, Analyzed to generate heatmaps, shot charts, and performance reports, Accessible only to you and authorized personnel. Note: Footage is never sold or distributed without explicit consent."
      ]
    },
    {
      title: "2. Third‑Party Services",
      content: [
        "We employ trusted third parties to support App functionality:",
        "**Analytics:** Aggregated and anonymized data to optimize user experience.",
        "**Payment Gateways:** Secure processing via Stripe, PayPal, or local providers.",
        "No personal or sensitive data is shared beyond what is strictly necessary for service delivery."
      ]
    },
    {
      title: "3. No Cross‑App Tracking",
      content: [
        "SEED does not engage in:",
        "Cross‑app or cross‑website tracking.",
        "Device fingerprinting or profiling."
      ]
    },
    {
      title: "4. Your Choices & Rights",
      content: [
        "**Opt‑Out:** Uninstall the App or disable permissions at any time.",
        "**Data Deletion:** Request permanent removal of your data by emailing contact@seedco.sa.",
        "**Access & Correction:** Contact us to review or correct your personal information."
      ]
    },
    {
      title: "5. Data Retention",
      content: [
        "We retain your data only as long as necessary to: Fulfill App functions, Comply with legal obligations.",
        "Upon request, we will purge your data permanently."
      ]
    },
    {
      title: "6. Children’s Privacy",
      content: [
        "SEED is not directed to children under 15 years. We do not knowingly collect or maintain personal data from minors."
      ]
    },
    {
      title: "7. Security Measures",
      content: [
        "We implement industry‑standard safeguards, including encryption in transit and at rest, secure access controls, and regular security audits."
      ]
    },
    {
      title: "8. Changes to This Policy",
      content: [
        "We may update this Privacy Policy periodically. Any changes will be posted here with a revised “Last Updated” date. Continued use of SEED after updates constitutes acceptance of the revised policy."
      ]
    },
    {
      title: "9. Contact Us",
      content: [
        "For questions or concerns regarding this Privacy Policy, please contact: contact@seedco.sa or write us a message through our website."
      ]
    }
  ]
  },
  ar: {
   title: "سييد (SEED) – سياسة الخصوصية",
  lastUpdated: "آخر تحديث: 10 يوليو 2025",
  intro: "في سييد لتقنيات الرياضة (“SEED” أو “نحن” أو “لنا”)، تعد خصوصيتك أولوية قصوى. توضح سياسة الخصوصية هذه كيفية جمع معلوماتك واستخدامها والكشف عنها وحمايتها عند استخدام تطبيق سييد للهواتف المحمولة (\"التطبيق\") لحجز الملاعب وتسجيل الجلسات وتحليلات الأداء.\n\nمن خلال تحميل التطبيق أو تثبيته أو استخدامه، فإنك توافق على جمع المعلومات واستخدامها وفقاً لهذه السياسة ومتطلبات الخصوصية الخاصة بمتجر تطبيقات آبل (Apple App Store).",
  sections: [
    {
      title: "1. المعلومات التي نجمعها",
      content: [
        "**أ. المعلومات الشخصية التي تقدمها:** الاسم، البريد الإلكتروني، رقم الهاتف، البيانات الديموغرافية (الفئة العمرية، مستوى المهارة)، تفاصيل الدفع (تتم معالجتها بشكل آمن عبر بوابات طرف ثالث). الغرض: إنشاء حسابك وإدارته، ومعالجة الحجوزات والمدفوعات، وتقديم دعم مخصص. نحن لا نبيع أو نؤجر هذه البيانات أبداً.",
        "**ب. بيانات الاستخدام والجهاز:** معلومات الجهاز (عنوان IP، نظام التشغيل، إصدار التطبيق)، مقاييس الاستخدام (الصفحات التي تمت زيارتها، الميزات المستخدمة، مدة الجلسة)، تفاصيل الحجز (الملاعب المختارة، التواريخ، الأوقات، حالة الدفع). الغرض: مراقبة وتحسين أداء التطبيق، واستكشاف الأخطاء وإصلاحها، وفهم مدى اعتماد الميزات.",
        "**ج. بيانات الموقع:** بإذن منك، نجمع موقعك التقريبي من أجل: عرض الملاعب القريبة، واقتراح الفترات الزمنية المتاحة بناءً على القرب الجغرافي. ملاحظة: تُستخدم بيانات الموقع حصرياً لتحسين تجربة الحجز وتسجيل الوصول للمباريات. ولا يتم مشاركتها مع المعلنين أو وسطاء البيانات.",
        "**د. لقطات فيديو الملعب:** تلتقط الكاميرات المثبتة في الملاعب المدعومة من سييد لقطات للمباريات، والتي يتم: رفعها بشكل آمن إلى سحابتنا للمعالجة بواسطة الذكاء الاصطناعي، وتحليلها لإنشاء الخرائط الحرارية ومخططات التسديد وتقارير الأداء، وتكون متاحة فقط لك وللموظفين المصرح لهم. ملاحظة: لا يتم بيع اللقطات أو توزيعها أبداً دون موافقة صريحة."
      ]
    },
    {
      title: "2. خدمات الطرف الثالث",
      content: [
        "نحن نستعين بأطراف ثالثة موثوقة لدعم وظائف التطبيق:",
        "**التحليلات:** بيانات مجمعة ومجهولة الهوية لتحسين تجربة المستخدم.",
        "**بوابات الدفع:** معالجة آمنة عبر Stripe أو PayPal أو المزودين المحليين.",
        "لا يتم مشاركة أي بيانات شخصية أو حساسة تتجاوز ما هو ضروري تماماً لتقديم الخدمة."
      ]
    },
    {
      title: "3. عدم التتبع عبر التطبيقات",
      content: [
        "لا يشارك تطبيق سييد (SEED) في:",
        "التتبع عبر التطبيقات أو عبر المواقع الإلكترونية.",
        "بصمة الجهاز أو التنميط."
      ]
    },
    {
      title: "4. خياراتك وحقوقك",
      content: [
        "**إلغاء الاشتراك:** يمكنك إلغاء تثبيت التطبيق أو تعطيل الأذونات في أي وقت.",
        "**حذف البيانات:** اطلب إزالة بياناتك بشكل دائم عن طريق مراسلتنا عبر البريد الإلكتروني: contact@seedco.sa.",
        "**الوصول والتصحيح:** اتصل بنا لمراجعة أو تصحيح معلوماتك الشخصية."
      ]
    },
    {
      title: "5. الاحتفاظ بالبيانات",
      content: [
        "نحتفظ ببياناتك فقط طالما كان ذلك ضرورياً من أجل: أداء وظائف التطبيق، والامتثال للالتزامات القانونية.",
        "بناءً على طلبك، سنقوم بحذف بياناتك نهائياً."
      ]
    },
    {
      title: "6. خصوصية الأطفال",
      content: [
        "تطبيق سييد غير موجه للأطفال دون سن 15 عاماً. نحن لا نجمع أو نحتفظ ببيانات شخصية من القاصرين عن علم."
      ]
    },
    {
      title: "7. التدابير الأمنية",
      content: [
        "نحن نطبق ضمانات قياسية في الصناعة، بما في ذلك التشفير أثناء النقل وأثناء السكون، وضوابط الوصول الآمن، وعمليات التدقيق الأمني المنتظمة."
      ]
    },
    {
      title: "8. التغييرات على هذه السياسة",
      content: [
        "قد نقوم بتحديث سياسة الخصوصية هذه بشكل دوري. سيتم نشر أي تغييرات هنا مع تاريخ \"آخر تحديث\" معدل. استمرار استخدام سييد بعد التحديثات يشكل قبولاً للسياسة المنقحة."
      ]
    },
    {
      title: "9. اتصل بنا",
      content: [
        "للأسئلة أو الاستفسارات المتعلقة بسياسة الخصوصية هذه، يرجى التواصل عبر: contact@seedco.sa أو مراسلتنا عبر موقعنا الإلكتروني."
      ]
    }
  ]
  }
};