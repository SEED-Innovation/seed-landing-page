export type TermsOfUseData = {
  title: string;
  intro: string;
  sections: { title: string; content: string[] }[];
  lastUpdated: string;
};

export const termsOfUseContent: Record<'en' | 'ar', TermsOfUseData> = {
  en: {
    title: "SEED Innovation – Terms of Use Policy",
    lastUpdated: "Last Updated: December 2025",
    intro: "This Terms of Use Policy governs your access to and use of the (SEED) application owned by SEED Innovation Company. This policy forms part of the set of policies regulating the use of the application, including but not limited to the Terms & Conditions, Privacy Policy, and others. \n\nYour use of the application constitutes an explicit agreement to fully comply with all provisions herein and with any subsequent amendments.",
    sections: [
      {
        title: "1. Acceptance of Terms",
        content: [
          "Your access to or use of the application constitutes an explicit and binding acceptance of all provisions and obligations contained in this policy. If you do not agree, you must immediately stop using the application.",
          "You acknowledge that you possess full legal capacity to use the application in accordance with the laws applicable in the Kingdom of Saudi Arabia.",
          "SEED Innovation reserves the right to amend this policy at any time; amended versions become effective immediately upon publication."
        ]
      },
      {
        title: "2. Lawful Use & Prohibited Conduct",
        content: [
          "**Lawful Use:** The user must use the application for purposes consistent with Islamic Sharia and KSA laws (Anti-Cyber Crime Law, E-Commerce Law, etc.).",
          "**Technical Violations:** Attempting unauthorized access, hacking, or using automated tools (bots) to collect data or make bookings is strictly prohibited.",
          "**Fraudulent Behavior:** Creating fake accounts, impersonating others, or providing false information is a material breach.",
          "**Booking Misconduct:** Repeated unjustified cancellations or creating fake bookings to harm venue owners is prohibited.",
          "**Financial Integrity:** Using stolen or unauthorized payment methods will lead to immediate account termination and legal action."
        ]
      },
      {
        title: "3. User Obligations",
        content: [
          "Users must provide accurate, up-to-date information and are responsible for securing their account credentials.",
          "The user assumes full responsibility for any actions performed through their account, even if performed by a third party through the user's device.",
          "If payment is shared among a group, all participants are bound by this policy to the same extent."
        ]
      },
      {
        title: "4. Intellectual Property",
        content: [
          "All intellectual property (trademarks, designs, software code, audiovisual content) belongs exclusively to SEED Innovation.",
          "Users may not copy, modify, distribute, or exploit any content without prior written approval.",
          "Personal use of content is permitted; commercial exploitation is strictly forbidden."
        ]
      },
      {
        title: "5. Eligibility & Geographic Restrictions",
        content: [
          "**Age:** Users must be at least 18 years old. Minors must use the application under direct guardian supervision.",
          "**Location:** Use is restricted to the Kingdom of Saudi Arabia. The company does not guarantee legality or availability outside KSA."
        ]
      },
      {
        title: "6. Limitation of Liability",
        content: [
          "SEED Innovation disclaims liability for direct or indirect damages, including data loss, service disruption, or actions by third-party venue providers.",
          "The company does not guarantee uninterrupted or error-free operation. Maintenance or technical emergencies may cause temporary suspensions without compensation."
        ]
      },
      {
        title: "7. Termination & Updates",
        content: [
          "The company may suspend or terminate access without notice for policy violations.",
          "Users may request account deletion at any time, acknowledging the loss of associated services.",
          "Continued use of the app after updates constitutes implicit acceptance of the revised terms."
        ]
      },
      {
        title: "8. General Provisions",
        content: [
          "**Governing Law:** All disputes are subject to Saudi Arabian law and the exclusive jurisdiction of Saudi courts.",
          "**Language:** Arabic is the official language. In case of discrepancies, the Arabic version prevails.",
          "**Contact:** For concerns, please contact: **contact@seedco.sa**"
        ]
      }
    ]
  },
  ar: {
    title: "سياسة شروط الاستخدام – شركة سييد إنوفيشن المحدودة",
    lastUpdated: "آخر تحديث: ديسمبر 2025",
    intro: "تحكم سياسة شروط الاستخدام هذه وصولكم إلى تطبيق (سييد) المملوك لشركة سييد إنوفيشن واستخدامكم له. وتشكل هذه السياسة جزءًا من مجموعة السياسات المنظمة لاستخدام التطبيق. \n\nيُعد استخدامكم للتطبيق موافقة صريحة على الالتزام الكامل بجميع الأحكام الواردة هنا وبأي تعديلات لاحقة. في حالة وجود تعارض بين النسخة العربية وأي نسخة مترجمة، تسود النسخة العربية وتُعتبر هي الملزمة قانونيًا.",
    sections: [
      {
        title: "1. قبول الشروط ونطاق التطبيق",
        content: [
          "يُشكل وصولكم إلى التطبيق قبولاً ملزماً لجميع الالتزامات الواردة هنا. إذا كنتم لا توافقون، يجب التوقف فوراً عن الاستخدام.",
          "تقرون بأنكم تتمتعون بالأهلية القانونية الكاملة بموجب قوانين المملكة العربية السعودية.",
          "تحتفظ الشركة بالحق في تعديل السياسة في أي وقت، وتصبح نافذة فور نشرها."
        ]
      },
      {
        title: "2. الاستخدام المشروع والمحظورات",
        content: [
          "**الاستخدام المشروع:** يجب استخدام التطبيق لأغراض متوافقة مع الشريعة الإسلامية والأنظمة السعودية (نظام مكافحة الجرائم المعلوماتية، ونظام حماية البيانات).",
          "**الانتهاكات التقنية:** يُحظر تماماً محاولة الوصول غير المصرح به، أو استخدام برامج آلية لجمع البيانات أو إجراء حجوزات وهمية.",
          "**السلوك المخادع:** إنشاء حسابات وهمية أو انتحال الشخصيات يُعد مخالفة جسيمة تستوجب إنهاء الحساب.",
          "**سوء سلوك الحجوزات:** يُحظر الإلغاء المتكرر غير المبرر أو محاولة الإضرار بمقدمي الملاعب.",
          "**الانتهاكات المالية:** استخدام وسائل دفع مسروقة أو مزورة يعرض المستخدم للمساءلة القانونية الفورية."
        ]
      },
      {
        title: "3. التزامات المستخدم",
        content: [
          "يجب تقديم معلومات دقيقة وتحديثها فوراً عند التغيير. المستخدم مسؤول عن حماية بيانات تسجيل الدخول الخاصة به.",
          "يتحمل المستخدم المسؤولية الكاملة عن أي تصرف يتم من خلال حسابه، سواء قام به بنفسه أو عبر طرف ثالث.",
          "في حال تقسيم الدفع بين مجموعة، يلتزم جميع الأطراف بهذه السياسة بنفس الدرجة."
        ]
      },
      {
        title: "4. حقوق الملكية الفكرية",
        content: [
          "جميع الحقوق (العلامات التجارية، الأكواد، التصاميم، المحتوى) مملوكة حصرياً لشركة سييد إنوفيشن.",
          "يُحظر نسخ أو تعديل أو توزيع أي محتوى دون موافقة خطية مسبقة.",
          "يُسمح بالاستخدام الشخصي فقط؛ الاستغلال التجاري يتطلب ترخيصاً خاصاً."
        ]
      },
      {
        title: "5. الأهلية والقيود الجغرافية",
        content: [
          "**العمر:** يجب أن يكون المستخدم بعمر 18 عاماً على الأقل. القاصرون يجب أن يستخدموا التطبيق تحت إشراف الوصي.",
          "**الموقع:** استخدام التطبيق مقتصر على داخل المملكة العربية السعودية، ولا تضمن الشركة توفره خارجها."
        ]
      },
      {
        title: "6. حدود المسؤولية",
        content: [
          "تخلي الشركة مسؤوليتها عن أي أضرار ناتجة عن أفعال مقدمي الخدمة (الملاعب) أو أطراف ثالثة.",
          "لا تضمن الشركة تشغيلاً خالياً من الأخطاء؛ قد يحدث تعليق مؤقت للصيانة أو الطوارئ دون حق في التعويض."
        ]
      },
      {
        title: "7. إنهاء الاستخدام والتحديثات",
        content: [
          "للشركة الحق في تعليق أو إنهاء الحسابات عند الاشتباه في سلوك غير قانوني أو ضار.",
          "يمكن للمستخدم طلب حذف حسابه في أي وقت مع فقدان الخدمات المرتبطة به.",
          "استمرار الاستخدام بعد التحديثات يعني القبول الضمني بالشروط الجديدة."
        ]
      },
      {
        title: "8. أحكام عامة",
        content: [
          "**القانون الواجب التطبيق:** تخضع النزاعات للقانون السعودي والاختصاص الحصري للمحاكم السعودية.",
          "**اللغة:** العربية هي اللغة الرسمية للتطبيق، وفي حال التضارب تسود النسخة العربية.",
          "**التواصل:** لأي استفسار يرجى المراسلة عبر: **contact@seedco.sa**"
        ]
      }
    ]
  }
};