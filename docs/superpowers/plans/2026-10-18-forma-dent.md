# FORMA DENT Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Создать полноценный локальный демонстрационный сайт стоматологии с выбором зуба, подбором лечения, безопасной онлайн-записью и печатным заявлением.

**Architecture:** Статическое React-приложение с двумя маршрутами. Каталог и расписание — типизированные данные; подбор, валидация и интервалы — чистые функции; связанное состояние записи — React context. Персональные формы живут только в памяти, localStorage хранит только анонимные интервалы.

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide React, shadcn/ui, Vitest; браузерная проверка доступным средством автоматизации.

**Spec:** `docs/superpowers/specs/2026-10-18-forma-dent-design.md`

## Global Constraints

- «Проект работает без бэкенда, обязательных API-ключей и отправки персональных данных».
- «Публикация во внешнем сервисе не входит в текущую реализацию».
- «SVG содержит 32 отдельных интерактивных зуба с анатомически согласованной FDI-нумерацией».
- «Расписание строится на 14 дней от текущей даты в часовом поясе Europe/Moscow».
- «Начало слотов предлагается с шагом 30 минут»; длительность услуги учитывается полностью.
- «Имя и телефон не сохраняются»; сведения из заявления также не сохраняются.
- «Демонстрационная запись. Для реального подтверждения требуется подключение системы клиники».
- «Результат — заявление на получение справки, а не справка ФНС».
- Дизайн и UX — `design-system/forma-dent/MASTER.md`, основанный на ui-ux-pro-max и приоритетах пользователя.
- Все тексты на русском; демонстрационный характер контента явно обозначен.

## Review Focus

1. Часовой пояс устройства отличается от Москвы: даты горизонта и запрет прошедшего времени всё равно вычисляются по Москве. Тест в задаче 3.
2. Повреждённое хранилище или запрет доступа к нему: приложение работает в памяти, личные поля не восстанавливаются. Тест в задаче 4.
3. Пользователь меняет филиал/услугу после выбора времени: несовместимые значения сбрасываются, подтвердить старое время нельзя. Проверка в задаче 4.
4. Неверные даты и разделители суммы в заявлении: ошибки у полей, печать доступна только после валидации. Тест в задаче 5.
5. Клавиатура и узкий экран: доступен каждый зуб, мобильная кнопка не закрывает поля, модальные окна возвращают фокус. Проверка в задачах 2 и 7.

## Карта файлов

- `package.json`, `index.html`, `vite.config.ts`, `tsconfig*.json`, `components.json`, `src/main.tsx`, `src/App.tsx`, `src/styles.css`: сборка, стили, маршрутизация.
- `src/types/domain.ts`: публичные типы предметной области.
- `src/data/{services,doctors,branches,symptoms,teeth,schedule,content}.ts`: отдельные наборы демонстрационных данных.
- `src/lib/{catalog,schedule,validation,storage,utils}.ts`: чистые алгоритмы и вспомогательные функции.
- `src/components/ui/{button,dialog,input,select,accordion}.tsx`: необходимые компоненты shadcn/ui.
- `src/components/{Header,Footer,SectionHeading,FieldError,ErrorSummary,Toast}.tsx`: общие блоки.
- `src/features/teeth/ToothNavigator.tsx`, `src/features/catalog/ServiceCatalog.tsx`: подбор и каталог.
- `src/features/booking/{BookingContext,Schedule,BookingForm}.tsx`: связанный сценарий записи.
- `src/features/tax/{TaxWizard,TaxStatement}.tsx`: заявление и печать.
- `src/features/clinic/{Doctors,Gallery,BeforeAfter,CallbackForm}.tsx`: дополнительные взаимодействия.
- `src/pages/{HomePage,DemoSchedulePage}.tsx`: страницы.
- `src/lib/*.test.ts`, `src/data/teeth.test.ts`: unit-тесты.
- `public/images/`, `public/fonts/`, `README.md`: локальные ресурсы и инструкция запуска.

### Task 1: Запускаемая основа и медицинский каталог

**Files:** создать конфигурацию, точку входа, `src/types/domain.ts`, файлы данных, `src/lib/catalog.ts`, `src/lib/catalog.test.ts`, общие UI-компоненты.

**Interfaces:**
- `Specialty = 'therapy' | 'endodontics' | 'surgery' | 'orthodontics' | 'prosthetics' | 'hygiene'`.
- `Service`: `id`, `name`, `medicalName`, `category`, `description`, `priceMin`, `priceMax`, `durationMinutes`, `specialty`, `included: string[]`, `extra: string[]`, `symptomIds: string[]`.
- `Doctor`: `id`, `name`, `specialty`, `experienceYears`, `branchIds: string[]`, `serviceIds: string[]`, `image`, `bio`.
- `Branch`: `id`, `name`, `address`, `hours`, `image`.
- `Symptom`: `id`, `label`, `possibleCauses: string[]`, `diagnostics: string[]`, `wholeMouth: boolean`.
- Производит `searchServices(query: string, category?: string): Service[]` и `recommendServices(symptomId: string): Service[]`.

- [ ] **Step 1:** Создать минимальную Vite/TS/Vitest-конфигурацию, команды `dev`, `build` (`tsc --noEmit && vite build`), `test` (`vitest run`) и `.gitignore` для node_modules/dist. Установить зависимости одним процессом.
- [ ] **Step 2:** Написать тесты: поиск «ГИГИЕНА» находит гигиену, пробельный запрос возвращает все услуги, неизвестный запрос даёт пустой массив, симптом боли возвращает терапию/эндодонтию, неизвестный симптом — пустой массив.
- [ ] **Step 3:** Выполнить `npm test -- src/lib/catalog.test.ts`; убедиться в падении из-за отсутствия реализации.
- [ ] **Step 4:** Создать типы, данные восьми категорий, шести врачей, двух филиалов, восьми симптомов и реализовать функции поиска/подбора. Все ссылки ID согласованы.
- [ ] **Step 5:** Создать App, главную страницу-заготовку, базовые стили из MASTER, необходимые shadcn/ui-компоненты и SEO-метаданные. Избегать необязательных UI-зависимостей.
- [ ] **Step 6:** Выполнить `npm test -- src/lib/catalog.test.ts` и `npm run build`; ожидаются проход тестов и успешная сборка.
- [ ] **Step 7:** Закоммитить: `feat: scaffold FORMA DENT and typed service catalog`.

### Task 2: SVG-схема, подбор лечения и каталог

**Files:** `src/data/teeth.ts`, `src/data/teeth.test.ts`, `src/features/teeth/ToothNavigator.tsx`, `src/features/catalog/ServiceCatalog.tsx`.

**Interfaces:**
- `Tooth`: `fdi: number`, `name: string`, `jaw: 'upper' | 'lower'`, `side: 'left' | 'right'` (относительно пациента).
- `BookingIntent = { serviceId?: string; doctorId?: string; specialty?: Specialty }` в `src/types/domain.ts`.
- `ToothNavigator({ onBook }: { onBook: (intent: BookingIntent) => void })`.
- `ServiceCatalog({ onBook }: { onBook: (intent: BookingIntent) => void })`.
- Использует функции каталога из задачи 1, передаёт serviceId и specialty в запись.

- [ ] **Step 1:** Написать тест: 32 уникальных FDI-номера, квадранты 1–4 с позициями 1–8, верхние только 1/2, нижние только 3/4, русские названия не пусты.
- [ ] **Step 2:** Выполнить `npm test -- src/data/teeth.test.ts`; зафиксировать ожидаемое падение.
- [ ] **Step 3:** Реализовать данные зубов и полноценную SVG-схему дуг. Каждый зуб — самостоятельная форма с номером, tabIndex, role, aria-label/pressed и обработкой Enter/Space. Обозначить стороны пациента.
- [ ] **Step 4:** Добавить выбор симптома и результат: причины, диагностика, специалист, услуги, цены, длительность, оговорка об отсутствии диагноза. Смена симптома сбрасывает предыдущий результат.
- [ ] **Step 5:** Реализовать каталог с поиском, фильтром категорий, раскрытием состава стоимости и рабочими кнопками записи. Для пустого результата добавить сброс фильтров.
- [ ] **Step 6:** Выполнить тесты FDI/каталога и сборку; при браузерной проверке пройти выбор зуба клавиатурой и проверить 375 px без наложения областей выбора.
- [ ] **Step 7:** Закоммитить: `feat: add interactive tooth navigator and treatment search`.

### Task 3: Корректное расписание

**Files:** `src/data/schedule.ts`, `src/lib/schedule.ts`, `src/lib/schedule.test.ts`, `src/types/domain.ts`.

**Interfaces:**
- `Interval = { start: string; end: string }`, строки — ISO timestamp с часовым смещением.
- `Appointment = Interval & { id: string; doctorId: string; branchId: string; serviceId: string }`.
- `DayShift = Interval & { doctorId: string; branchId: string; breaks: Interval[] }`.
- `Slot = Interval & { available: boolean; reason?: 'past' | 'busy' | 'break' | 'outside-shift' }`.
- `moscowDate(now: Date): string`, `getHorizon(now: Date): string[]` (YYYY-MM-DD).
- `overlaps(a: Interval, b: Interval): boolean` (полуоткрытые интервалы).
- `getDayShifts(date: string): DayShift[]`, `getSeedAppointments(date: string): Appointment[]`.
- `getSlots(input: { date: string; doctorId: string; branchId: string; serviceId: string; appointments: Appointment[]; now: Date }): Slot[]`.

- [ ] **Step 1:** Написать тесты: пересечение запрещено, смежность разрешена, 90-минутная услуга конфликтует с записью через 60 минут, конец после смены недоступен, прошлое время запрещено, перерыв исключается, врач без нужной услуги/филиала даёт пустой массив.
- [ ] **Step 2:** Добавить проверку московского дня: для `2026-10-18T21:30:00Z` первый день — `2026-10-19`, всего 14 дат, последний — `2026-11-01`. Тесты не зависят от часов хоста.
- [ ] **Step 3:** Выполнить `npm test -- src/lib/schedule.test.ts`; ожидается падение отсутствующих функций.
- [ ] **Step 4:** Реализовать детерминированные смены 09:00–20:00 Москвы, перерывы и занятые интервалы. Один врач имеет только один филиал на дату. Генерировать начала с шагом 30 минут, проверять весь интервал по длительности услуги.
- [ ] **Step 5:** Выполнить `npm test -- src/lib/schedule.test.ts`; все указанные ограничения проходят.
- [ ] **Step 6:** Закоммитить: `feat: implement duration-aware Moscow appointment availability`.

### Task 4: Полный сценарий записи и безопасное хранение

**Files:** `src/lib/validation.ts`, `src/lib/validation.test.ts`, `src/lib/storage.ts`, `src/lib/storage.test.ts`, компоненты booking, `src/pages/DemoSchedulePage.tsx`, ErrorSummary/FieldError/Toast.

**Interfaces:**
- `normalizeRuPhone(value: string): string | null` возвращает +7XXXXXXXXXX или null; принимает 10 цифр либо 11 с 7/8.
- `validateContact(input: { name: string; phone: string; consent: boolean }): Record<string, string>`.
- `StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>`.
- `readAppointments(storage: StorageLike, now: Date): Appointment[]`.
- `saveAppointments(storage: StorageLike, appointments: Appointment[]): boolean`, `clearAppointments(storage: StorageLike): boolean`.
- Ключ хранилища: `forma-dent.appointments.v1`.
- `useBooking()` возвращает `openBooking(intent: BookingIntent): void`, `appointments: Appointment[]`, `confirmAppointment(appointment: Appointment): { ok: boolean; persisted: boolean; error?: string }`, `resetAppointments(): void`.
- `Schedule()` и `BookingForm()` используют этот context; новые записи создаются через crypto.randomUUID().

- [ ] **Step 1:** Написать тесты телефона, короткого имени и отсутствия согласия; валидная форма даёт пустой набор ошибок. Написать тесты хранилища: некорректный JSON, неизвестные ID и даты, устаревшие записи игнорируются; исключение getItem/setItem не пробрасывается; лишние name/phone удаляются при чтении и записи.
- [ ] **Step 2:** Выполнить соответствующие тесты и убедиться в падении, затем реализовать чистую валидацию и хранение с явным перечислением разрешённых полей. Неверные и пересекающиеся локальные записи не восстанавливать.
- [ ] **Step 3:** Реализовать фильтры календаря, недели 1/2, даты, доступные и занятые слоты. Изменение фильтра сбрасывает несовместимые значения. Выбор времени открывает контактную форму через доступный диалог.
- [ ] **Step 4:** Подтверждать запись после повторной getSlots-проверки на текущий момент и актуальные локальные записи; обновлять context и storage. При изменениях storage в другой вкладке обновлять анонимное состояние; при ошибке сохранения оставлять запись в памяти и показывать ограничение.
- [ ] **Step 5:** Добавить `/demo-schedule`, таблицу анонимных записей, отдельно исходную занятость и сброс только собственного ключа. В навигации предусмотреть возврат на главную.
- [ ] **Step 6:** Выполнить unit-тесты и браузерный сценарий записи, перезагрузки и сброса. Проверить отказ старого времени после смены филиала; в localStorage отсутствуют введённые имя и телефон.
- [ ] **Step 7:** Закоммитить: `feat: add interactive booking and anonymous demo schedule`.

### Task 5: Заявление для налогового вычета

**Files:** `src/features/tax/TaxWizard.tsx`, `src/features/tax/TaxStatement.tsx`, `src/lib/validation.ts`, `src/lib/validation.test.ts`, print-стили в `src/styles.css`.

**Interfaces:**
- `TaxApplication = { year: number; branchId: string; patientName: string; payerName: string; samePayer: boolean; phone: string; amount: string; paymentDate: string; contractNumber: string }`.
- `validateTaxStep(step: 0 | 1 | 2, input: TaxApplication, now: Date): Record<string, string>`.
- `TaxStatement({ application }: { application: TaxApplication })` рендерит безопасный React-текст без dangerouslySetInnerHTML.

- [ ] **Step 1:** Написать тесты: год вне текущего и трёх предыдущих запрещён; пустые ФИО и неверный телефон запрещены; samePayer не требует отдельного ФИО плательщика; сумма 0/отрицательная/нечисловая запрещена; `1200,50` допустима; дата не существует, не соответствует году или позже московского сегодня — ошибка.
- [ ] **Step 2:** Выполнить тесты до реализации и убедиться в падении, затем реализовать validateTaxStep с проверкой реальной календарной даты и конечности суммы.
- [ ] **Step 3:** Создать управляемую четырёхшаговую форму с возвратом назад, полевыми ошибками и фокусируемым списком ошибок. Значения существуют только в памяти. Кнопка печати появляется после успешной проверки всех шагов.
- [ ] **Step 4:** Создать заявление и @media print: печатать только заявление, скрывать навигацию и кнопки, не обрезать текст, не добавлять подписи/печати. Использовать window.print() для печати и сохранения PDF средствами браузера.
- [ ] **Step 5:** Добавить точные оговорки из спецификации без расчёта обещанного возврата; любые дополнительные правовые утверждения предварительно проверять по официальным источникам ФНС.
- [ ] **Step 6:** Выполнить тесты, проверить форму/возврат/печать в браузере, подтвердить отсутствие данных заявления в storage.
- [ ] **Step 7:** Закоммитить: `feat: add validated tax certificate application and print view`.

### Task 6: Коммерческая главная страница и дополнительные взаимодействия

**Files:** HomePage, Header/Footer, данные content, компоненты clinic, public/images и public/fonts.

**Interfaces:**
- `Doctors({ onBook }: { onBook: (intent: BookingIntent) => void })` передаёт doctorId и specialty.
- `Gallery({ images }: { images: { src: string; alt: string }[] })`.
- `BeforeAfter({ before, after }: { before: string; after: string })` с range 0–100.
- `CallbackForm()` использует validateContact и локальное уведомление; ничего не отправляет.
- HomePage соединяет все блоки с единым BookingProvider и существующими якорями.

- [ ] **Step 1:** Подобрать локально сохраняемые фотографии интерьера и портреты, проверить происхождение/доступность ресурсов. По возможности использовать пользовательский интерьер как визуальный ориентир. Любые синтетические или демонстрационные материалы обозначать явно; не выдавать чужие отзывы и результаты за реальные.
- [ ] **Step 2:** Собрать hero, преимущества и пакеты по MASTER, подключить навигатор, каталог и календарь. Добавить все тексты на русском, без неподтверждённых статистических обещаний.
- [ ] **Step 3:** Реализовать врачей с диалогами и записью, галерею с переключением, сравнение с клавиатурным range, FAQ с aria-expanded, форму обратного звонка.
- [ ] **Step 4:** Добавить переключатель филиалов, контакты демонстрационной клиники, footer со ссылкой на `/demo-schedule`, мобильную навигацию и фиксированную кнопку записи. Все кнопки имеют действие, каждый якорь существует.
- [ ] **Step 5:** Добавить Framer Motion для появления блоков с учётом reduced motion, локальные шрифты/fallback, lazy loading для нижних изображений и заданные размеры изображений.
- [ ] **Step 6:** Выполнить `npm run build`; проверить все перечисленные кнопки и диалоги, пустой поиск и запись к конкретному врачу в браузере.
- [ ] **Step 7:** Закоммитить: `feat: complete premium FORMA DENT clinic experience`.

### Task 7: Итоговая проверка и передача проекта

**Files:** при необходимости исправить файлы соответствующих модулей; создать `README.md`.

**Interfaces:** готовое приложение `/` и `/demo-schedule`, команды npm dev/test/build.

- [ ] **Step 1:** Выполнить `npm test` и `npm run build`, ожидаются отсутствие упавших тестов и exit 0 сборки. Если найдена ошибка — воспроизвести её, исправить в ответственном модуле, повторить затронутые проверки.
- [ ] **Step 2:** Запустить локальный dev server и открыть его доступным браузерным инструментом. Проверить 375, 768, 1024, 1440 px: отсутствие горизонтального overflow, обрезанных полей и перекрытий мобильной кнопкой. Если браузерная автоматизация недоступна, явно описать предел проверки, не утверждать её выполнение.
- [ ] **Step 3:** Пройти сквозной сценарий и негативные случаи из задач 2–5; проверить, что услуги/врач/филиал согласованы, занятый слот нельзя выбрать, длинная услуга учитывает все интервалы, текущий момент проверяется при подтверждении.
- [ ] **Step 4:** Пройти клавиатурой SVG и запись, закрыть диалоги Escape и проверить возврат фокуса. Проверить ошибки screen reader через aria-атрибуты, контраст палитры и reduced motion.
- [ ] **Step 5:** Проверить печатное заявление, галерею, range, FAQ, callback и обе страницы. Проверить консоль на ошибки и все ресурсы на успешную загрузку.
- [ ] **Step 6:** Написать README: установка/запуск/сборка/тесты, архитектура, demo-data, безопасный ключ storage, ограничения отсутствия backend, интеграция с реальной клиникой и список фактически выполненных проверок.
- [ ] **Step 7:** Выполнить свежие `npm test` и `npm run build` после последних изменений. Закоммитить проверенный результат, показать локальный preview и кратко сообщить подтверждённые результаты и ограничения.

## Самопроверка плана

Все разделы спецификации покрыты задачами 1–7. Имена моделей и интерфейсы едины; московские даты, повреждение storage, смена фильтров, невалидное заявление и клавиатурная доступность закреплены конкретными проверками. Рекомендуемый способ исполнения — самостоятельно в текущей сессии: задачи связаны общими моделями и единым состоянием записи. Делегирование возможно только после выбора пользователя.
