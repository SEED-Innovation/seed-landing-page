export type TermsData = {
  title: string;
  intro: string;
  sections: { title: string; content: string[] }[];
  lastUpdated: string;
};

export const termsContent: Record<'en' | 'ar', TermsData> = {
  en: {
    title: "SEED Innovation – Terms of Service",
    lastUpdated: "Last Updated: December 10, 2025",
    intro: "These Terms and Conditions govern the contractual relationship between SEED Innovation (SEED Innovation) and the beneficiary who wishes to book courts and related services through the application. These Terms form part of the regulatory framework governing use of the application, including but not limited to the Terms of Use Policy, Privacy Policy, and other related policies. The beneficiary's use of the application constitutes explicit agreement to fully comply with all provisions herein and any subsequent amendments.",
    sections: [
          {
            title: "Clause One: Definitions",
            content: [
              "**Application / Platform:** The SEED Innovation application named (SEED/سييد) and all its electronic services related to court booking, photography, performance analysis, tournament organization, and any other accompanying services.",
              "**Company:** SEED Innovation (SEED Innovation), the owner and operator of the application.",
              "**Beneficiary:** Any natural person who uses the application to make bookings or benefit from available services, including — without limitation — padel court bookings, photography, performance analysis, tournament organization, participation, and joining.",
              "**Service Provider:** The owner or operator of the court, or the provider of accompanying services (such as photography, performance analysis, tournament organization, and others), whose services are displayed within the application, whether service is provided using the provider's tools, the company's tools, or third-party tools.",
              "**Booking:** The process of requesting and renting a court or service for a specific period according to the terms displayed in the application.",
              "**Photography:** A service provided by service providers — using their own tools, the company's tools, or third-party tools — that includes capturing beneficiary matches or activity inside the court using specialized recording equipment as shown in the application.",
              "**Performance Analysis:** An optional service provided by some service providers that includes reviewing and analyzing the beneficiary's performance using tools, software, or technical reports — whether from the service provider, the company, or a third party — as displayed in the application."
            ]
          },
          {
            title: "Clause Two: Scope of Agreement",
            content: [
              "These Terms and Conditions regulate the contractual relationship between SEED Innovation and the beneficiary regarding the use of the application to book courts or any other services displayed within it.",
              "The company's role is limited to providing an electronic platform acting as an intermediary that connects the beneficiary with the service provider. The company is not the owner or operator of any court and bears no responsibility for its operation, maintenance, quality, or suitability for use.",
              "The company is responsible only for maintaining its own cameras installed inside courts, which are offered to service providers or used through them to provide services to beneficiaries. The company bears no responsibility for the operation of courts or for any equipment belonging to service providers or beneficiaries.",
              "All obligations related to the service — including court quality, cleanliness, readiness, availability, usage rules, time commitments, or any other obligations — rest solely with the service provider.",
              "Completing a booking constitutes a direct agreement between the beneficiary and the service provider. The company bears no responsibility toward the beneficiary for any breach, error, or negligence by the service provider, including the quality of the service, its execution, or any operational or organizational arrangements.",
              "The beneficiary acknowledges that completing a booking constitutes implicit acceptance of the service provider's terms and policies as displayed on the booking page or provider's profile."
            ]
          },
          {
            title: "Clause Three: Account Creation and Beneficiary Duties",
            content: [
              "To complete any booking, the beneficiary must create a verified and accurate user account, entering all required information correctly, including contact details and payment methods. The beneficiary must update their account data immediately upon any change. Failure to update makes the beneficiary liable for resulting consequences.",
              "All operations made through the beneficiary's account — whether performed by them or by any party using their login credentials — shall be considered issued by the beneficiary and legally binding upon them.",
              "The beneficiary must maintain the confidentiality of their login information. They bear full legal and financial responsibility for any use of their account resulting from negligence in safeguarding login credentials.",
              "The company reserves the right to suspend or delete any account containing false, misleading, or incomplete data without prior notice and without any liability."
            ]
          },
          {
            title: "Clause Four: Booking and Payment Terms",
            content: [
              "Bookings are made according to the prices, specifications, and options displayed in the application. Displaying them on the booking page constitutes a binding offer from the service provider, not from the company.",
              "Payment by the beneficiary constitutes final, irrevocable acceptance of the booking. Bookings cannot be modified or canceled after payment unless done in accordance with the modification/refund/cancellation policy displayed in the application.",
              "Prices may vary according to provider policy, promotions, or seasons. The company does not guarantee price stability and bears no responsibility for price changes before payment is completed.",
              "The company collects a commission from the booking value for its electronic mediation services. Completion of the booking constitutes explicit acceptance of this commission.",
              "The beneficiary must use valid, authorized payment methods and is responsible for the accuracy of payment data and all transactions carried out using the payment method registered in their account.",
              "If payment is rejected or an error occurs, the company may cancel the booking without liability and without prior notice.",
              "The booking or service fee may be paid in full by one person, split between two persons, or divided among up to four persons. All individuals who participate in payment are fully subject to these Terms and all other policies."
            ]
          },
          {
            title: "Clause Five: Beneficiary Obligations",
            content: [
              "The beneficiary acknowledges that some courts may contain cameras for regulatory, security, operational, or revenue-related purposes. The beneficiary explicitly consents to this and is fully responsible for informing all accompanying persons of the presence of cameras and ensuring no one enters without agreeing to being recorded. The company bears no responsibility for any objection or claim by companions brought without their knowledge or consent.",
              "If the beneficiary wishes to obtain additional services (photography, data analysis, performance recording), they must pay the applicable fees through approved payment methods. Payment is a prerequisite for receiving the service.",
              "If the beneficiary receives any video containing other individuals, they must not retain or share it. They must delete it immediately and notify the company. The beneficiary bears full responsibility for any unlawful use of such content.",
              "The beneficiary is entitled to receive only the videos related to their own presence after paying the service fee. The company bears no responsibility for: the appearance of any other person in the footage, video quality or clarity, privacy or image-rights claims, any sharing or distribution done by the beneficiary after receiving the footage.",
              "The beneficiary acknowledges that photography and performance-analysis services — when available — are provided 'as is,' and the company does not guarantee accuracy, error-free output, or compliance with professional or technical standards.",
              "The beneficiary and their companions must maintain proper conduct within the court and refrain from any improper, disruptive, dangerous, or inappropriate behavior. The beneficiary is solely responsible for any misconduct by their companions during the booking period.",
              "The beneficiary is fully responsible for any damage or loss to equipment or facilities inside the court and must pay the repair or replacement costs determined by the service provider."
            ]
          },
          {
            title: "Clause Six: Company Responsibilities",
            content: [
              "SEED Innovation's role is limited to providing a technical platform enabling beneficiaries to make bookings and view services offered by service providers. The company is not the owner, operator, or maintainer of any court and bears no responsibility for readiness or suitability of courts.",
              "The company bears no direct or indirect responsibility, including but not limited to: Court quality, cleanliness, equipment, or compliance with descriptions; Service providers' adherence to schedules, rules, or instructions; Any injuries or personal or financial damages suffered by the beneficiary or their companions at the court location; Any breach, negligence, refusal, or error by the service provider; Any additional content or service offered outside the application; Any dispute between the beneficiary and the service provider.",
              "Regarding photography or performance-analysis services, the company's responsibility is limited to enabling access to the service after payment. The company bears no responsibility for: individuals appearing in footage, quality or accuracy of footage or technical results, any use or sharing of content by the beneficiary or third parties.",
              "The company does not guarantee uninterrupted operation of application services. Technical issues and interruptions may occur without liability.",
              "The company reserves the right to modify, restrict, suspend, or stop any part of the application temporarily or permanently for operational, technical, or regulatory reasons without prior notice and without liability.",
              "If — exceptionally — liability is proven against the company by a final court judgment, the maximum liability is limited to the amount of commission received for the disputed booking only."
            ]
          },
          {
            title: "Clause Seven: Content and Reviews Obligations",
            content: [
              "The beneficiary must ensure that reviews, comments, or feedback posted within the application are truthful, objective, reflective of actual experience, and free of abusive, defamatory, misleading, offensive, or unlawful content.",
              "The beneficiary is prohibited from posting any content that includes: inaccurate or misleading information, insults, defamation, or abuse toward service providers, the company, or other users, hate speech, discrimination, or incitement, personal or sensitive data of others without consent, any content violating intellectual property or others' rights.",
              "The company reserves the unconditional right — without prior notice — to delete any review or content it deems inappropriate, abusive, false, rights-violating, or unsuitable, without any liability to the beneficiary.",
              "The beneficiary grants the company a perpetual, irrevocable, non-exclusive license to use any reviews or comments they post, including republication, display, and use in marketing or quality improvement, without compensation.",
              "The beneficiary bears full legal responsibility for all content they publish. The company may take any legal or technical action in case of violations."
            ]
          },
          {
            title: "Clause Eight: Service Description and Application Liability Limits",
            content: [
              "The SEED application operates as an intermediary platform displaying services, prices, and options offered by service providers. Displaying services does not constitute a recommendation or guarantee from the company. Providers alone are responsible for entering and updating service details. The company's role is limited to technical display.",
              "Completing a booking constitutes acceptance of the court's conditions and provider's policy, and forms a direct contract between the beneficiary and the service provider. The company does not intervene in any stage of service delivery, including reception, access, usage, schedule compliance, or equipment quality. All such responsibilities rest solely with the service provider.",
              "The application may provide additional services (such as photography or analysis), but the company's role is limited to enabling the service technically after payment.",
              "Using the application does not replace direct communication with the service provider. The company bears no responsibility for operational coordination or side agreements between the parties."
            ]
          },
          {
            title: "Clause Nine: Account Cancellation and Suspension",
            content: [
              "The company may suspend, restrict, or permanently cancel the beneficiary's account at its sole discretion in cases including but not limited to: violation of any Terms or policies, providing false or outdated information, misuse of the application or attempt to disrupt systems, attempted fraud, deception, or unlawful transactions, any use likely to harm the application, company, providers, or other users.",
              "In such cases, the beneficiary is not entitled to compensation, reinstatement, or further explanation.",
              "The beneficiary may request account closure at any time, which is considered voluntary and does not entitle them to refunds. The company reserves the right to retain data and records related to the closed account.",
              "Account closure does not remove any financial or legal obligations incurred before closure."
            ]
          },
          {
            title: "Clause Ten: Intellectual Property",
            content: [
              "All intellectual property rights, content, materials, and technical components of the application belong exclusively to SEED Innovation, including — without limitation — trademarks, logos, designs, text, images, videos, databases, source code, graphical interfaces, and all other content.",
              "The beneficiary is prohibited — without prior written approval — from: copying or reproducing any part of the application, modifying, translating, adapting, or redistributing content, using materials for commercial or unlawful purposes, exploiting any trademark or branding associated with the company.",
              "Any violation constitutes a material breach entitling the company to suspend or cancel the account and pursue legal action including compensation."
            ]
          },
          {
            title: "Clause Eleven: Limitation of Liability",
            content: [
              "The beneficiary acknowledges that use of the application is at their sole responsibility. The company acts solely as a technical intermediary.",
              "The company bears no responsibility for: any errors or negligence by service providers, factors beyond control, personal injuries, financial losses, or damages, technical failures, service interruptions, or operational issues.",
              "If liability is established by a final court ruling, the company's maximum liability is limited to the commission amount received from the disputed booking.",
              "The company bears no liability for indirect, consequential, special, or incidental damages, including loss of profits, data, or business interruption. Continued use of the application constitutes explicit acceptance of these limitations."
            ]
          },
          {
            title: "Clause Twelve: Governing Law and Jurisdiction",
            content: [
              "These Terms are governed by the laws and regulations of the Kingdom of Saudi Arabia. Exclusive jurisdiction over any disputes lies with the competent courts and authorities in Saudi Arabia."
            ]
          },
          {
            title: "Clause Thirteen: Force Majeure and Emergencies",
            content: [
              "The company bears no responsibility for delays or failures caused by force majeure or unforeseen external events beyond reasonable control, including — without limitation — natural disasters, floods, fires, wars, security disruption, pandemics, electrical or communication outages, governmental actions, or regulatory restrictions.",
              "In such cases, the company may suspend service without liability or compensation. Continued use of the application after the event ends constitutes acceptance."
            ]
          },
          {
            title: "Clause Fourteen: General Provisions",
            content: [
              "The company may amend these Terms at any time, effective upon publication. Continued use constitutes acceptance.",
              "Invalidity of any clause does not affect the validity of remaining clauses.",
              "In case of conflict with other policies, the company determines which provision applies.",
              "Delay or failure to enforce rights does not constitute waiver.",
              "No partnership, agency, or legal representation exists between the beneficiary and the company.",
              "Arabic is the official and binding language for interpretation and enforcement. The Arabic version prevails over any translation.",
              "The Saudi Riyal is the official currency for all financial operations. The beneficiary bears responsibility for any exchange differences.",
              "Singular includes plural and vice versa unless the context requires otherwise."
            ]
          },
          {
            title: "Contact Us",
            content: [
              "For questions or concerns regarding these Terms and Conditions, please contact us at: contact@seedco.sa"
            ]
          }
    ]
  },
  ar: {
   title: "سياسة الشروط والأحكام – شركة سييد إنوفايشن (Innovation SEED)",
  lastUpdated: "آخر تحديث: 13 ديسمبر 2025",
  intro: "تحكم هذه الشروط والأحكام العلاقة التعاقدية بين شركة سييد إنوفايشن (Innovation SEED)، والمستفيد الراغبين في حجز الملاعب والخدمات المرتبطة بها من خلال التطبيق. وتعد هذه الشروط جزءًا من المنظومة التنظيمية لاستخدام التطبيق، بما في ذلك على سبيل المثال لا الحصر سياسة الاستخدام وسياسة الخصوصية وسياسات الإلغاء والاسترجاع والاستبدال وغيرها من السياسات ذات العلاقة. ويعد استخدام المستفيد للتطبيق موافقة صريحة على الالتزام الكامل بما يرد في هذه الوثيقة وما يطرأ عليها من تعديلات لاحقة.",
sections: [
      {
        title: "البند الأول: التعريفات",
        content: [
          "**التطبيق / المنصة:** التطبيق الخاص بشركة سييد إنوفايشن واسمه: (SEED) (سييد)، وجميع خدماته الإلكترونية المتعلقة بحجز الملاعب والتصوير وتحليل الأداء وتنظيم البطولات والخدمات الأخرى المصاحبة.",
          "**الشركة:** شركة سييد إنوفايشن (SEED Innovation Company)، المالكة والمشغلة للتطبيق.",
          "**المستفيد:** كل فرد طبيعي يقوم باستخدام التطبيق لإجراء الحجوزات أو الاستفادة من الخدمات المتاحة، بما في ذلك — على سبيل المثال لا الحصر — (حجز ملاعب البادل، التصوير، تحليل الأداء، تنظيم البطولات والمشاركة فيها والانضمام إليها).",
          "**مقدم الخدمة:** مالك أو مشغل الملعب أو مزود الخدمات المصاحبة (مثل خدمات التصوير أو تحليل الأداء أو تنظيم البطولات وغيرها) والذي يتم عرض خدماته داخل التطبيق سواء تم تقديم الخدمة باستخدام أدوات مزود الخدمة أو أدوات الشركة أو من خلال طرف ثالث.",
          "**الحجز:** عملية طلب واستئجار ملعب أو خدمة لفترة زمنية محددة وفق الشروط الظاهرة داخل التطبيق.",
          "**التصوير:** خدمة يقدمها مقدمو الخدمات سواء باستخدام أدواتهم الخاصة أو أدوات الشركة أو أدوات طرف ثالث، وتشمل تصوير مباريات المستفيد أو نشاطه داخل الملعب باستخدام تجهيزات تصوير مخصصة، وفق الضوابط المعروضة داخل التطبيق.",
          "**تحليل الأداء:** خدمة اختيارية يقدمها بعض مقدمي الخدمات وتشمل مراجعة وتحليل أداء المستفيد أثناء اللعب باستخدام أدوات أو برمجيات أو تقارير فنية سواء باستخدام أدوات مقدمي الخدمة أو أدوات الشركة أو أدوات طرف ثالث، ووفق ما يظهر داخل التطبيق."
        ]
      },
      {
        title: "البند الثاني: نطاق الاتفاقية",
        content: [
          "تنظم هذه الشروط والأحكام العلاقة التعاقدية بين شركة سييد إنوفايشن والمستفيد فيما يتعلق باستخدام التطبيق لإجراء حجوزات الملاعب أو أي خدمات أخرى يتم عرضها داخل التطبيق.",
          "يقتصر دور الشركة على توفير تطبيق إلكتروني يعمل كوسيط لربط المستفيد بمقدمي الخدمة، ولا تعد الشركة مالكة أو مشغلة لأي ملعب أو مسؤولة عن تشغيله أو صيانته أو جودته أو مدى ملاءمته للاستخدام.",
          "تكون الشركة مسؤولة فقط عن صيانة الكاميرات الخاصة بها والتي تم وضعها داخل الملاعب، والتي تُقدم لمقدمي الخدمة أو عن طريقها لاستخدامها في تقديم الخدمات للمستفيدين، ولا تتحمل الشركة أي مسؤولية عن تشغيل الملاعب أو عن أي معدات أخرى تخص مقدمي الخدمة أو المستفيدين.",
          "جميع الالتزامات المتعلقة بالخدمة — بما في ذلك جودة الملعب، نظافته، توفره، جاهزيته، شروط استخدامه، الالتزام بالمواعيد، أو أي الالتزامات أخرى — تقع على عاتق مقدم الخدمة وحده، ويعد إبرام الحجز اتفاقًا مباشرًا بين المستفيد ومقدم الخدمة.",
          "لا تتحمل الشركة أي مسؤولية تجاه المستفيد عن أي إخلال أو خطأ أو تقصير يصدر من مقدم الخدمة، سواء تعلق ذلك بجودة الخدمة أو تنفيذها أو أي ترتيبات تشغيلية أو تنظيمية أخرى.",
          "يقر المستفيد بأن إتمام عملية الحجز عبر التطبيق يعد موافقة ضمنية على شروط مقدم الخدمة وسياساته، كما هو ظاهر في صفحة الحجز أو موقعه."
        ]
      },
      {
        title: "البند الثالث: إنشاء الحساب وواجبات المستفيد",
        content: [
          "يشترط لإتمام أي عملية حجز داخل التطبيق أن يقوم المستفيد بإنشاء حساب مستخدم موثق وصحيح، وإدخال جميع البيانات المطلوبة بدقة، بما في ذلك معلومات الاتصال ووسائل الدفع.",
          "يلتزم المستفيد بتحديث بيانات حسابه فور حدوث أي تغيير عليها، ويعد عدم التحديث مخالفة موجبة لتحمل أي تبعات أو مسؤوليات تنتج عن ذلك.",
          "يقر المستفيد بأن جميع العمليات التي تتم من خلال حسابه — سواء قام بها بنفسه أو عبر أي طرف آخر استخدم بيانات الدخول الخاصة به — تعد صادرة منه وملزمة له.",
          "يلتزم المستفيد بالحفاظ على سرية معلومات دخوله للتطبيق وعدم إفشائها لأي طرف آخر، ويتحمل كامل المسؤولية النظامية والمالية عن أي استخدام يتم لحسابه نتيجة التقصير في حفظ معلومات الدخول.",
          "تحتفظ الشركة بحق تعليق أو إلغاء أي حساب يتضح أنه يحتوي على بيانات غير صحيحة أو مضللة أو غير مكتملة، دون أي التزام بإشعار مسبق ودون أي مسؤولية تجاه المستفيد."
        ]
      },
      {
        title: "البند الرابع: شروط الحجز والدفع",
        content: [
          "يتم الحجز وفق الأسعار، والمواصفات، والخيارات المعروضة للمستفيد داخل التطبيق، ويعد ظهورها في صفحة الحجز بمثابة عرض ملزم من مقدم الخدمة وليس من الشركة.",
          "يُعد إجراء الدفع من قبل المستفيد موافقة نهائية وغير قابلة للرجوع على الحجز، ولا يجوز تعديل الحجز أو إلغاؤه بعد الدفع، إلا وفقًا لم نص عليه في سياسة التعديل والاسترجاع والالغاء والمعلنة داخل التطبيق.",
          "قد تختلف الأسعار من وقت لآخر وفق سياسة مقدمي الخدمة أو بحسب العروض أو المواسم، ولا تضمن الشركة بقاء الأسعار ثابتة، ولا تتحمل مسؤولية أي تغيّر يطرأ عليها قبل إتمام الدفع.",
          "تُحصّل الشركة نسبة عمولة من قيمة الحجز نظير خدمات الوساطة الإلكترونية التي تقدمها، ويُعد إتمام الحجز قبولاً صريحًا من المستفيد بهذه العمولة.",
          "يلتزم المستفيد باستخدام وسائل دفع صحيحة ومصرّح بها نظامًا، ويعدّ مسؤولاً عن صحة بيانات الدفع وعن أي عمليات مالية تتم عبر وسيلة الدفع المسجلة في حسابه.",
          "في حال رفض عملية الدفع أو وجود خطأ في الوسيلة المستخدمة، يحق للشركة إلغاء الحجز دون أي التزام تجاه المستفيد، دون الحاجة لإشعار مسبق.",
          "يجوز للمستفيد سداد قيمة الحجز أو الخدمة بالكامل من قبل شخص واحد، أو تقسيمها بين شخصين، أو تقسيمها على أربعة أشخاص كحد أقصى، وفي جميع الحالات تُطبَّق أحكام هذه السياسة والسياسات الأخرى على جميع الأشخاص الذين شاركوا في السداد."
        ]
      },
      {
        title: "البند الخامس: التزامات المستفيد",
        content: [
          "يُقر المستفيد بأن بعض الملاعب قد تتضمن كاميرات مراقبة أو تصوير لأغراض تنظيمية أو أمنية أو تشغيلية أو ربحية، ويوافق المستفيد صراحة على ذلك، كما يقر بأنه مسؤول مسؤولية كاملة عن إبلاغ جميع مرافقيه بوجود التصوير، وعدم إحضار أي شخص لا يوافق على وجود كاميرات داخل الملعب أو التصرف بالتسجيلات الخاصة بها. وتُخلي الشركة مسؤوليتها عن أي اعتراض أو مطالبة تصدر من أي مرافق أو شخص حضر مع المستفيد دون علمه أو رضاه.",
          "في حال رغب المستفيد في الحصول على أي خدمات إضافية مثل: (التصوير – تحليل البيانات – تسجيل الأداء)، فيجب سداد الرسوم الخاصة بتلك الخدمات من خلال وسائل الدفع المعتمدة داخل التطبيق، ويُعد السداد شرطًا للحصول على الخدمة.",
          "يقر المستفيد بأنه في حال استلامه أي مقطع فيديو يتضمن ظهور أشخاص آخرين داخل الملعب، فإنه يلتزم التزامًا كاملًا بعدم الاحتفاظ به أو مشاركته، ويجب عليه حذفه فورًا وإبلاغ الشركة بذلك، ويتحمل المسؤولية الكاملة عن أي استخدام غير مشروع لهذا المحتوى.",
          "يحق للمستفيد الحصول على مقاطع الفيديو المتعلقة به فقط بعد سداد القيمة المحددة للخدمة، إلا أن الشركة تُخلي مسؤوليتها بشكل كامل عن أي مما يلي - على سبيل المثال لا الحصر -: ظهور أي شخص في المقطع، جودة التصوير أو تفاصيله، أي مطالبات تتعلق بالحقوق الشخصية أو حقوق الخصوصية أو حقوق الصورة، أي نشر أو تداول يقوم به المستفيد بعد استلامه للمادة المصورة.",
          "يقر المستفيد بأن خدمات التصوير وتحليل البيانات — متى كانت متاحة — تقدم على أساس “كما هي”، ولا تضمن الشركة دقة التحليل أو خلوّه من الأخطاء أو مطابقته للمعايير الفنية أو الاحترافية.",
          "يلتزم المستفيد وجميع مرافقيه بالالتزام بالمحافظة على السلوك العام داخل الملعب، وعدم القيام بأي تصرف مخالف أو مزعج أو خطير أو مخل، كما يتحمل المستفيد وحده كامل المسؤولية عن أي ممارسات أو تصرفات صادرة من مرافقيه أثناء فترة الحجز.",
          "يكون المستفيد مسؤولاً مسؤولية كاملة عن أي أضرار أو خسائر تلحق بالمرافق أو التجهيزات أو الأدوات الموجودة في الملعب خلال فترة استخدامه، ويلتزم بسداد تكاليف الإصلاح أو الاستبدال التي يقررها مقدم الخدمة."
        ]
      },
      {
        title: "البند السادس: مسؤوليات الشركة",
        content: [
          "يقتصر دور شركة سييد إنوفايشن على توفير منصة إلكترونية تعمل كوسيط تقني يتيح للمستفيد إجراء الحجوزات والاطلاع على الخدمات المعروضة من قبل مقدمي الخدمة، ولا تعد الشركة مالكة أو مشغلة لأي ملعب أو مسؤولة عن تشغيله أو صيانته أو جاهزيته أو ملاءمته للاستخدام.",
          "لا تتحمل الشركة أي مسؤولية، بشكل مباشر أو غير مباشر، عن أي من الأمور التالية على سبيل المثال لا الحصر: جودة الملاعب أو نظافتها أو تجهيزاتها أو مطابقتها للوصف المعروض، التزام مقدم الخدمة بالمواعيد أو الشروط أو التعليمات أو أي ترتيبات تنظيمية خاصة بالملعب، أي إصابات أو أضرار شخصية أو مالية يتعرض لها المستفيد أو مرافقيه أثناء وجودهم في موقع الملعب أو استخدامهم له، أي إخلال أو تقصير أو امتناع أو خطأ يصدر من مقدم الخدمة تجاه المستفيد، أي محتوى أو خدمات إضافية يقدمها مقدم الخدمة خارج ما يظهر داخل التطبيق، أي نزاع أو خلاف ينشأ بين المستفيد ومقدم الخدمة، أياً كانت طبيعته.",
          "فيما يتعلق بخدمات التصوير أو تحليل الأداء (إن وجدت)، فإن مسؤولية الشركة تقتصر على تمكين المستفيد من الحصول على الخدمة بعد إتمام الدفع، ولا تتحمل الشركة مسؤولية: ظهور الأشخاص في المقاطع المصورة، جودة المقاطع أو النتائج الفنية، أي استخدام يقوم به المستفيد أو الغير للمحتوى المصور أو مشاركته.",
          "لا تضمن الشركة أن تعمل خدمات التطبيق بشكل مستمر أو دون انقطاع أو خلوّ من المشاكل البرمجية أو الأعطال التقنية، ويقر المستفيد بأن بعض الأعطال قد تؤثر على الخدمات دون أي مسؤولية على الشركة.",
          "تحتفظ الشركة بحق تعديل أو تقييد أو تعليق أو إيقاف أي جزء من خدمات التطبيق بشكل مؤقت أو دائم لأسباب تشغيلية أو فنية أو تنظيمية دون إشعار مسبق، ودون أن يترتب على ذلك أي التزام تجاه المستفيد.",
          "وفي جميع الأحوال، إذا ثبت — استثناءً — وجود خطأ على الشركة، فإن أقصى مسؤولية يمكن أن تتحملها لا تتجاوز مقدار العمولة التي حصلت عليها الشركة مقابل الحجز محل المطالبة فقط."
        ]
      },
      {
        title: "البند السابع: الالتزامات المتعلقة بالمحتوى والتقييمات",
        content: [
          "يلتزم المستفيد بأن تكون التقييمات أو التعليقات أو الملاحظات التي يقوم بنشرها عبر التطبيق صادقة وموضوعية وتعكس تجربته الحقيقية، وأن تخلو من أي عبارات مسيئة أو تشهيرية أو مضللة أو مخالفة للذوق العام أو النظام العام أو الآداب أو حقوق الغير.",
          "يحظر على المستفيد نشر أي محتوى قد يتضمن أي من: معلومات غير صحيحة أو مضللة، إساءة أو سب أو قذف لمقدمي الخدمة أو الشركة أو مستخدمين آخرين، محتوى يحض على الكراهية أو التمييز أو العنف، بيانات شخصية أو معلومات حساسة للغير دون إذن، أي محتوى ينتهك حقوق الملكية الفكرية أو حقوق الآخرين.",
          "تحتفظ الشركة بالحق الكامل — دون إشعار مسبق — في حذف أي تقييم أو تعليق أو محتوى ترى أنه مخالف أو مسيء أو كاذب أو منتهك للحقوق أو غير مناسب، دون أن يترتب على ذلك أي التزام أو مسؤولية تجاه المستفيد.",
          "يوافق المستفيد صراحة على منح الشركة ترخيصًا دائمًا وغير حصري وغير قابل للإلغاء باستخدام التقييمات أو التعليقات التي ينشرها داخل التطبيق، بما في ذلك إعادة نشرها أو عرضها أو استخدامها في التسويق أو تحسين الجودة، دون أي مقابل أو تعويض للمستفيد.",
          "يقر المستفيد بأنه يتحمل المسؤولية القانونية الكاملة عن أي محتوى يقوم بنشره، ويحق للشركة اتخاذ أي إجراءات نظامية أو تقنية تجاه أي إساءة أو مخالفة صادرة منه."
        ]
      },
      {
        title: "البند الثامن: وصف الخدمة وحدود مسؤولية التطبيق",
        content: [
          "يعمل تطبيق سييد إنوفايشن كمنصة إلكترونية وسيطة تجمع بين مقدمي خدمات الملاعب وبين المستفيدين الراغبين في الحجز، وذلك عبر عرض الخدمات والأسعار والخيارات المتاحة وفقاً لما يوفره مقدمو الخدمة.",
          "لا يشكّل عرض الخدمات داخل التطبيق توصية أو ضمانًا من الشركة، بل هو عرض يتم إدخاله وتحديثه من قبل مقدمي الخدمة وحدهم، وتقتصر مسؤولية الشركة على العرض التقني للخدمات دون تدخل في محتواها أو دقتها.",
          "يعد إتمام الحجز من قبل المستفيد موافقة على الشروط المعروضة في صفحة الملعب وعلى السياسة الخاصة بمقدم الخدمة، كما يعد بمثابة اتفاق مباشر بين المستفيد ومقدم الخدمة.",
          "لا تتدخل الشركة في أي مرحلة من مراحل تقديم الخدمة الفعلية، بما في ذلك الاستقبال، الدخول، الاستخدام، الالتزام بالوقت، جودة التجهيزات، أو أي ترتيبات تشغيلية، ويكون ذلك كله تحت مسؤولية مقدم الخدمة وحده.",
          "قد يتيح التطبيق خدمات إضافية — مثل التصوير أو تحليل الأداء — وتقتصر مسؤولية الشركة في هذه الحالة على إتاحة الخدمة تقنياً بعد الدفع، دون ضمان أي مخرجات فنية.",
          "لا يعد استخدام التطبيق بديلاً عن التواصل المباشر مع مقدم الخدمة، ويُعفى التطبيق من أي مسؤولية تتعلق بالتنسيق التشغيلي أو الاتفاقات الجانبية بين المستفيد ومقدم الخدمة."
        ]
      },
      {
        title: "البند التاسع: الإلغـاء وتعليق الحساب",
        content: [
          "يحق لشركة سييد إنوفايشن، وفق تقديرها المطلق، إيقاف أو تعليق أو تقييد وصول المستفيد إلى حسابه داخل التطبيق، سواء بشكل مؤقت أو دائم، في أيٍ من الحالات التالية على سبيل المثال لا الحصر: مخالفة أي من الشروط والأحكام أو السياسات المرتبطة بالتطبيق، تقديم بيانات غير صحيحة أو مضللة أو غير محدثة، إساءة استخدام التطبيق أو الخدمات أو محاولة تعطيل الأنظمة، محاولة الاحتيال أو التحايل أو تنفيذ معاملات غير مشروعة، أي استخدام يُحتمل أن يُلحق ضررًا بالتطبيق أو بالشركة أو بمقدمي الخدمة أو بالمستخدمين الآخرين.",
          "لا يحق للمستفيد، في حال تعليق الحساب أو إلغائه لأي سبب من الأسباب المذكورة أعلاه، المطالبة بأي تعويض أو إعادة تفعيل أو إبداء أسباب إضافية لاتخاذ هذا الإجراء.",
          "يحق للمستفيد طلب إغلاق حسابه في أي وقت عبر الوسائل المتاحة داخل التطبيق، ويُعد ذلك إغلاقًا اختياريًا للحساب لا يترتب عليه أي التزام على الشركة بإعادة أي مبالغ مدفوعة سابقًا.",
          "تحتفظ الشركة بالحق في الاحتفاظ ببيانات العمليات والسجلات المرتبطة بالحساب المغلق (سواء كان الإغلاق من الشركة أو بناءً على طلب المستفيد).",
          "لا يؤثر إغلاق الحساب على أي التزامات مالية أو نظامية مستحقة قبل الإغلاق، ويظل المستفيد مسؤولًا عنها."
        ]
      },
      {
        title: "البند العاشر: الملكية الفكرية",
        content: [
          "تؤول ملكية جميع الحقوق الفكرية والحقوق المتعلقة بالمحتوى والمواد والعناصر التقنية داخل التطبيق إلى شركة سييد إنوفايشن حصريًا، بما في ذلك — على سبيل المثال لا الحصر — الشعار، العلامة التجارية، التصميمات، النصوص، الصور، المقاطع، قواعد البيانات، الأكواد البرمجية، الواجهات الرسومية، الهيكل العام للتطبيق، وأي محتوى آخر يظهر من خلاله، سواء كان مملوكًا للشركة أو مرخّصًا لها من الغير.",
          "يحظر على المستفيد بأي شكل من الأشكال القيام بالآتي دون الحصول على موافقة خطية وصريحة مسبقة من الشركة: نسخ أو إعادة إنتاج أو نشر أي جزء من محتوى التطبيق، تعديل أو ترجمة أو اقتباس أو إعادة توزيع المحتوى، استخدام أي مواد من التطبيق لأغراض تجارية أو غير مشروعة، استغلال العلامة التجارية أو الشعار أو أي علامة أو مادة مرتبطة بالشركة.",
          "يُعد أي انتهاك لأحكام الملكية الفكرية الواردة في هذا البند مخالفة جوهرية تمنح الشركة الحق في اتخاذ ما تراه مناسبًا من إجراءات، بما في ذلك تعليق الحساب أو إلغاؤه أو اتخاذ الإجراءات النظامية والمطالبة بالتعويض عن أي أضرار مباشرة أو غير مباشرة."
        ]
      },
      {
        title: "البند الحادي عشر: حدود المسؤولية",
        content: [
          "يُقرّ المستفيد بأن استخدامه للتطبيق وخدماته يتم على مسؤوليته الشخصية، وأن دور الشركة يقتصر على توفير منصة تقنية للربط بين المستفيد ومقدمي الخدمة دون أي تدخل في الخدمة المقدمة فعليًا داخل الملاعب.",
          "وفي هذا الإطار، لا تتحمل الشركة أي مسؤولية عن أي مما يلي، على سبيل المثال لا الحصر: (أي أخطاء أو تقصير أو إخلال يصدر من مقدمي الخدمة - أي ظروف أو عوامل خارجة عن الإرادة - أي أضرار شخصية أو إصابات أو خسائر مالية يتعرض لها المستفيد أو مرافقيه أثناء استخدام الملعب أو التواجد فيه - أي أضرار ناتجة عن أعطال تقنية أو انقطاعات في الخدمة نتيجة الصيانة أو المشكلات الفنية أو التحديثات أو أي أسباب تشغيلية)",
          "وفي جميع الأحوال، وفي حال ثبوت أي خطأ على الشركة بموجب حكم قضائي نهائي، يقتصر الحدّ الأقصى لمسؤولية الشركة على قيمة العمولة التي حصلت عليها من عملية الحجز محل المطالبة فقط، دون غيرها من أي تعويضات أو مطالبات إضافية.",
          "ولا تتحمل الشركة أي مسؤولية عن أي أضرار غير مباشرة أو تبعية أو خاصة أو عرضية، بما في ذلك — دون حصر — فقدان الأرباح أو البيانات أو توقف الأعمال، ويُعد استمرار استخدام المستفيد للتطبيق قبولًا صريحًا بهذه الحدود."
        ]
      },
      {
        title: "البند الثاني عشر: القوانين والاختصاص القضائي",
        content: [
          "تخضع هذه الشروط والأحكام — وما ينشأ عنها من حقوق أو التزامات أو نزاعات — لأحكام وأنظمة المملكة العربية السعودية، بما في ذلك الأنظمة واللوائح ذات الصلة. ويكون الاختصاص القضائي الحصري بنظر أي نزاع أو مطالبة تتعلق باستخدام التطبيق أو تفسير هذه الشروط أو تنفيذها للمحاكم والجهات القضائية المختصة داخل المملكة العربية السعودية."
        ]
      },
      {
        title: "البند الثالث عشر: القوة القاهرة والظروف الطارئة",
        content: [
          "لا تتحمل الشركة أي مسؤولية عن أي تأخير أو فشل في تقديم الخدمات أو تنفيذ أي من الالتزامات الناشئة عن هذه الشروط إذا كان ذلك نتيجة لظروف طارئة أو قوة قاهرة أو أحداث خارجة عن الإرادة ولا يمكن توقعها أو منعها، بما في ذلك — على سبيل المثال لا الحصر — الكوارث الطبيعية، والفيضانات، والحرائق، والحروب، والاضطرابات الأمنية، والأوبئة، والأعطال العامة، وانقطاع الكهرباء أو الاتصالات، والقرارات أو الإجراءات الحكومية، والحظر أو القيود التنظيمية، وأي أحداث أخرى تشكل قوة قاهرة أو ظرفًا طارئًا.",
          "وفي حال وقوع أي من تلك الظروف، يحق للشركة تعليق تقديم الخدمة كليًا أو جزئيًا طوال فترة الحدث، دون أن يترتب على ذلك أي التزام أو مسؤولية أو تعويض تجاه المستفيد، ويُعد استمرار المستفيد في استخدام التطبيق بعد زوال السبب قبولًا ضمنيًا بذلك."
        ]
      },
      {
        title: "البند الرابع عشر: أحكام عامة",
        content: [
          "تحتفظ الشركة بحقها في تعديل أو تحديث هذه الشروط والأحكام في أي وقت، وتصبح التعديلات نافذة من تاريخ نشرها داخل التطبيق. ويُعد استمرار المستفيد في استخدام التطبيق بعد التعديل موافقة صريحة على الشروط المعدَّلة.",
          "إذا تبين أن أي حكم من أحكام هذه الشروط باطل أو غير قابل للتنفيذ لأي سبب، فإن ذلك لا يؤثر على صحة ونفاذ باقي الأحكام، وتظل جميع البنود الأخرى سارية وملزمة بكامل آثارها.",
          "في حال وجود أي تعارض بين هذه الشروط وأي سياسات أخرى منشورة داخل التطبيق (مثل سياسة الاستخدام أو سياسة الخصوصية)، فيُعمل بالنص الذي تقرره الشركة باعتباره الأرجح تطبيقًا وفق طبيعة العلاقة والغرض من الخدمة.",
          "لا يُعد أي تأخر من الشركة في ممارسة أي حق مقرر لها أو عدم ممارسته تنازلاً عنه، كما لا يُعد التنازل عن أي حق سارياً إلا إذا كان مكتوبًا وصادرًا من ممثل مفوض عن الشركة.",
          "لا يترتب على استخدام المستفيد للتطبيق أي علاقة شراكة أو وكالة أو تمثيل قانوني بينه وبين الشركة، وتقتصر العلاقة على استخدام منصة إلكترونية للوساطة التقنية فقط.",
          "تُعد اللغة العربية هي اللغة الرسمية والمعتمدة في تفسير وتطبيق هذه الشروط والأحكام، وفي جميع المراسلات والعقود والإخطارات المتعلقة باستخدام التطبيق. وفي حال تم توفير ترجمة لهذه الشروط إلى أي لغة أخرى، فإن النسخة العربية هي النسخة السائدة والواجبة التطبيق عند التعارض، وهي المرجع القانوني الوحيد أمام الجهات القضائية في المملكة العربية السعودية.",
          "يعد الريال السعودي العملة الرسمية والمعتمدة في جميع العمليات المالية داخل التطبيق، بما في ذلك أسعار الخدمات، رسوم الحجز، العمولات، عمليات الدفع والاسترداد، وأي التزامات مالية أخرى. وفي حال الاختلاف يتحمل المستفيد وحده فرق الصرف.",
          "حيثما وردت الألفاظ بصيغة المفرد شملت الجمع، وبصيغة الجمع شملت المفرد ما لم يقتض السياق خلاف ذلك."
        ]
      },
      {
        title: "تواصل معنا",
        content: [
          "للأسئلة أو الاستفسارات المتعلقة بالشروط والأحكام، يرجى التواصل معنا عبر البريد الإلكتروني: contact@seedco.sa"
        ]
      }
    ]
  }
};