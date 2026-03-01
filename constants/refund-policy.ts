export type refundData = {
  title: string;
  intro: string;
  sections: { title: string; content: string[] }[];
  lastUpdated: string;
};

export const refundContent: Record<'en' | 'ar', refundData> = {
  en: {
    title: "Cancellation, Refund, and Replacement Policy — SEED Innovation",
    lastUpdated: "Last Updated: December 2025",
    intro: "This policy governs the terms and procedures for cancellation, refund, and replacement for all bookings and services made through the application, including court bookings, photography services, and performance-analysis services. The beneficiary's use of the application constitutes explicit acceptance of this policy and any future amendments.\n\n**Important Note:** In the event of any discrepancy, inconsistency, or conflict between the Arabic version of this policy and any translated version, the Arabic version shall prevail and be deemed the official and legally binding version.",
    sections: [
      {
        title: "Clause One: Definitions",
        content: [
          "**Cancellation:** A request submitted by the beneficiary to cancel a booking or service before its scheduled time in accordance with the provisions of this policy.",
          "**Refund:** Returning paid amounts to the beneficiary according to the terms outlined herein.",
          "**Replacement:** Modifying the booking time or replacing it with another time slot subject to the conditions and fees specified in this policy.",
          "**Application / Platform:** The SEED Innovation application named (SEED/سييد), including all electronic services related to court booking, photography, performance analysis, tournament organization, and any other accompanying services.",
          "**Company:** SEED Innovation (SEED Innovation), the owner and operator of the application.",
          "**Beneficiary:** Any natural person using the application to make bookings or benefit from services, including without limitation: padel court bookings, photography, performance analysis, and tournament organization/participation."
        ]
      },
      {
        title: "Clause Two: Scope of the Policy",
        content: [
          "This policy applies to all bookings and services provided to the beneficiary through the application. It defines the beneficiary's rights and obligations, as well as the company's role as a technical intermediary between the beneficiary and service providers."
        ]
      },
      {
        title: "Clause Three: Cancellation",
        content: [
          "The beneficiary has the right to cancel a booking at least **72 hours prior** to the scheduled time. In such a case, the beneficiary is entitled to a full refund of the amount paid.",
          "If cancellation is requested after the 72-hour period, the beneficiary is not entitled to a refund, and cancellation will not be accepted under any other circumstances.",
          "Cancellation decisions are final and cannot be reversed once submitted.",
          "All additional services — including photography and performance-analysis services — are **final upon payment** and cannot be canceled or refunded under any circumstances, including administrative fees.",
          "Refunds (when applicable) will be processed within 72 hours of confirming the cancellation, via the approved payment mechanism in the application."
        ]
      },
      {
        title: "Clause Four: Refunds",
        content: [
          "The beneficiary is only entitled to a refund in the case specified in Clause Three, i.e., when a cancellation request is submitted at least 72 hours before the booking time.",
          "Refunds are issued through the original payment method used or via in-app credit.",
          "The company reserves the right to deduct any service fees or commissions already collected from the booking amount prior to issuing a refund."
        ]
      },
      {
        title: "Clause Five: Replacement",
        content: [
          "The application does not allow the exchange, modification, or rescheduling of bookings after the completion of payment.",
          "All bookings are deemed **final and non-modifiable**, non-transferable, and non-exchangeable, whether for primary bookings or any associated additional services.",
          "No requests in this regard shall be accepted under any circumstances.",
          "The application also does not permit the exchange or modification of any other products or services, including but not limited to photography services, performance analysis, tournament organization, or similar services.",
          "All such products and services are considered final and non-exchangeable once payment has been completed."
        ]
      },
      {
        title: "Clause Six: Company Obligations",
        content: [
          "The company is obligated to process cancellation, refund, and replacement requests in accordance with this policy.",
          "The company bears no responsibility for any failure by the service provider to deliver the service or adhere to the scheduled time.",
          "Any compensation or remedy is handled directly between the beneficiary and the service provider, under the company's supervision to safeguard the beneficiary's rights."
        ]
      },
      {
        title: "Clause Seven: Beneficiary Obligations",
        content: [
          "The beneficiary must submit cancellation, refund, or replacement requests within the designated timeframes.",
          "The beneficiary must pay any applicable fees or price differences when modifying or canceling a booking.",
          "The beneficiary is not entitled to claim any compensation or financial amounts beyond what is explicitly provided in this policy."
        ]
      },
      {
        title: "Clause Eight: Exceptions",
        content: [
          "The company bears no responsibility for refunds or compensation in cases of **force majeure** or events beyond control, including without limitation: natural disasters, emergency closures, accidents, or any unexpected events.",
          "If the service provider breaches their obligations, the matter is handled directly between the beneficiary and the service provider. The company bears no responsibility for resulting outcomes or compensation."
        ]
      },
      {
        title: "Clause Nine: Notifications and Acceptance",
        content: [
          "Any notifications or messages sent through the application or email form an integral part of this policy.",
          "The beneficiary explicitly agrees to this policy when using the application.",
          "Continued use of the application after amendments constitutes implicit acceptance of the updated version."
        ]
      },
      {
        title: "Clause Ten: General Provisions",
        content: [
          "The company may amend or update this policy at any time. Amendments take effect upon publication in the application.",
          "If any clause is deemed invalid or unenforceable, the remaining provisions remain valid and fully enforceable.",
          "In case of conflict between this policy and other policies, the company's determination of the applicable clause prevails.",
          "Arabic is the **official language** for interpretation and enforcement. In case of translation discrepancies, the Arabic version prevails.",
          "The **Saudi Riyal** is the official currency for all financial transactions.",
          "The booking or service fee may be split between up to four persons. All individuals involved are subject to this policy."
        ]
      }
    ]
  },
  ar: {
    title: "سياسة الإلغاء والاسترجاع والاستبدال – شركة سييد إنوفيشن",
    lastUpdated: "آخر تحديث: ديسمبر 2025",
    intro: "تحكم هذه السياسة شروط وآليات الإلغاء والاسترجاع والاستبدال لجميع الحجوزات والخدمات عبر التطبيق، بما في ذلك حجز الملاعب وخدمات التصوير وتحليل الأداء. ويُعد استخدام المستفيد للتطبيق موافقة صريحة على الالتزام بهذه السياسة وما يطرأ عليها من تعديلات لاحقة.\n\n**ملاحظة هامة:** في حال وجود أي تعارض أو اختلاف بين النسخة العربية لهذه السياسة وأي نسخة مترجمة، فإن النسخة العربية هي المرجعية القانونية الوحيدة والمعتمدة.",
    sections: [
      {
        title: "البند الأول: التعريفات",
        content: [
          "**الإلغاء:** طلب المستفيد إلغاء الحجز أو الخدمة قبل موعده المحدد وفق الضوابط الواردة في هذه السياسة.",
          "**الاسترجاع:** إعادة المبالغ المدفوعة للمستفيد وفق الأحكام والشروط المشار إليها في السياسة.",
          "**الاستبدال:** تعديل موعد الحجز أو استبداله بموعد آخر وفق الشروط والرسوم المحددة في هذه السياسة.",
          "**التطبيق / المنصة:** التطبيق الخاص بشركة سييد إنوفيشن واسمه: (SEED)، (سييد).",
          "**الشركة:** شركة سييد إنوفيشن (SEED Innovation)، المالكة والمشغلة للتطبيق.",
          "**المستفيد:** كل فرد طبيعي يقوم باستخدام التطبيق لإجراء الحجوزات أو الاستفادة من الخدمات المتاحة."
        ]
      },
      {
        title: "البند الثاني: نطاق السياسة",
        content: [
          "تنطبق هذه السياسة على جميع الحجوزات والخدمات المقدمة للمستفيد عبر التطبيق، ويحدد هذا البند حقوق المستفيد وواجباته ودور الشركة كوسيط تقني بين المستفيد ومقدمي الخدمة."
        ]
      },
      {
        title: "البند الثالث: الإلغاء",
        content: [
          "يحق للمستفيد إلغاء الحجز قبل **72 ساعة** من تاريخ موعد الحجز، وفي هذه الحالة يمكنه استرجاع المبلغ المدفوع بالكامل.",
          "إذا تم الإلغاء بعد هذه الفترة، لا يحق للمستفيد استرجاع المبلغ، كما لا يجوز إلغاء الحجز في غير هذه الحالة.",
          "يُعد قرار الإلغاء نهائيًا، ولا يجوز للمستفيد التراجع عنه بعد تقديمه.",
          "تُعد جميع الخدمات الإضافية، بما في ذلك خدمات التصوير وتحليل الأداء، **نهائية بمجرد الدفع**، ولا يجوز إلغاؤها أو استرجاع قيمتها.",
          "يتم استرجاع المبلغ المستحق خلال 72 ساعة من تاريخ تأكيد الإلغاء، وفق آلية الدفع المعتمدة داخل التطبيق."
        ]
      },
      {
        title: "البند الرابع: الاسترجاع",
        content: [
          "لا يحق للمستفيد استرجاع المبلغ المدفوع إلا في الحالة المنصوص عليها في البند الثالث (الإلغاء قبل 72 ساعة).",
          "يتم استرجاع المبلغ عبر وسيلة الدفع الأصلية المستخدمة في الحجز أو عن طريق رصيد التطبيق.",
          "تحتفظ الشركة بحق خصم أي رسوم خدمة أو عمولات تم تحصيلها بالفعل من قيمة الحجز قبل إجراء الاسترجاع."
        ]
      },
      {
        title: "البند الخامس: الاستبدال",
        content: [
          "لا يسمح التطبيق باستبدال أو تعديل أو تغيير موعد الحجز بعد إتمام عملية الدفع.",
          "تُعد جميع الحجوزات **نهائية وغير قابلة للتعديل** أو النقل أو الاستبدال، سواء للحجز الأساسي أو الخدمات الإضافية.",
          "لا يتم قبول أي طلبات بهذا الخصوص تحت أي ظرف من الظروف.",
          "لا يسمح التطبيق أيضاً باستبدال أو تعديل أي منتجات أو خدمات أخرى مثل خدمات التصوير أو تحليل الأداء أو تنظيم البطولات."
        ]
      },
      {
        title: "البند السادس: التزامات الشركة",
        content: [
          "تلتزم الشركة بمعالجة طلبات الإلغاء والاسترجاع والاستبدال وفق ما ورد في هذه السياسات.",
          "لا تتحمل الشركة أي مسؤولية عن إخفاق مقدم الخدمة في الالتزام بتقديم الخدمة أو الالتزام بالموعد.",
          "يجري التعامل مع أي تعويض أو معالجة مباشرة من قبل مقدم الخدمة تحت إشراف الشركة لضمان حقوق المستفيد."
        ]
      },
      {
        title: "البند السابع: التزامات المستفيد",
        content: [
          "يلتزم المستفيد بتقديم طلبات الإلغاء أو الاسترجاع أو الاستبدال ضمن المواعيد المحددة.",
          "يلتزم المستفيد بسداد أي رسوم أو فروق أسعار معلنة عند تعديل أو إلغاء الحجز.",
          "لا يحق للمستفيد المطالبة بأي تعويضات إضافية خارج ما تنص عليه هذه السياسة."
        ]
      },
      {
        title: "البند الثامن: الاستثناءات",
        content: [
          "لا تتحمل الشركة أي مسؤولية عن الإرجاع أو التعويض في حالات **الأحوال القاهرة** أو الظروف الخارجة عن السيطرة (كوارث طبيعية، إغلاقات طارئة، إلخ).",
          "في حال إخلال مقدم الخدمة بالتزاماته، يُعالج الأمر بالتنسيق المباشر بين المستفيد ومقدم الخدمة."
        ]
      },
      {
        title: "البند التاسع: الإشعارات والقبول",
        content: [
          "تُعتبر أي إشعارات صادرة عبر التطبيق أو البريد الإلكتروني جزءًا لا يتجزأ من هذه السياسة.",
          "يُقر المستفيد بموافقته الصريحة على هذه السياسة عند استخدام التطبيق.",
          "استمرار استخدام التطبيق بعد أي تعديل يُعد قبولاً ضمنيًا بالنسخة المعدلة."
        ]
      },
      {
        title: "البند العاشر: أحكام عامة",
        content: [
          "تحتفظ الشركة بحقها في تعديل هذه السياسة في أي وقت.",
          "بطلان أي حكم لا يؤثر على صحة ونفاذ باقي الأحكام.",
          "اللغة العربية هي **اللغة الرسمية** المعتمدة في تفسير وتطبيق هذه الشروط.",
          "يعد **الريال السعودي** العملة الرسمية والمعتمدة في جميع العمليات المالية.",
          "يجوز تقسيم قيمة الحجز على أربعة أشخاص كحد أقصى، وجميعهم يخضعون لهذه السياسة."
        ]
      }
    ]
  }
};