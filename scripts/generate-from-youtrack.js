const fs = require("fs");
const path = require("path");

const raw = [
  { id: "HACK-81", summary: "[AI-first-2026] RAG-based Task Estimation", reporter: "p.kukaev", assignee: "p.kukaev", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-81" },
  { id: "HACK-521", summary: "[AI-first-2026] HRMS на базе Frappe HR: полноценная HR-система для компании", reporter: "r.dunaev", assignee: "r.dunaev", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-521" },
  { id: "HACK-123", summary: "[AI-first-2026] Автоматизация создания новостей из Telegram-каналов", reporter: "s.ustinov", assignee: "s.ustinov", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-123" },
  { id: "HACK-278", summary: "[AI-first-2026] Проверка опубликованного контента — отчёт бота по URL и качеству", reporter: "e.zakharchev", assignee: "e.zakharchev", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-278" },
  { id: "HACK-196", summary: "[AI-first-2026] SEO Site Classifier — классификация сайтов (продукт/инфо) по мета-тегам", reporter: "e.tyshchuk", assignee: "e.tyshchuk", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-196" },
  { id: "HACK-502", summary: "[AI-first-2026] Автоматизация конкурентного мониторинга SEO (daily snapshots + one-shot report)", reporter: "m.loban", assignee: "m.loban", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-502" },
  { id: "HACK-78", summary: "[AI-first-2026] MetaRatings.by: алерты публикаций, RSS BY-спортмедиа, генератор подписей + QC эксклюзивов", reporter: "i.adamenko", assignee: "i.adamenko", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-78" },
  { id: "HACK-982", summary: "[AI-first-2026] Telegram-бот: бомбардиры и ассисты после матча", reporter: "a.miroshnichenko", assignee: "a.miroshnichenko", state: "Open", url: "https://youtrack.rantsports.com/issue/HACK-982" },
  { id: "HACK-452", summary: "[AI-first-2026] IdeaHub — захват идей из Slack/Cursor, дедуп и витрина (SFE MVP)", reporter: "a.tsarev", assignee: "a.tsarev", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-452" },
  { id: "HACK-592", summary: "[AI-first-2026] Музей памяти Metaratings — корпоративный медиа-архив", reporter: "o.panasyuk", assignee: "o.panasyuk", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-592" },
  { id: "HACK-249", summary: "[AI-first-2026] AI Toolbox — собранный контекст и toolset для Laravel/GraphQL в SFE", reporter: "a.tsarev", assignee: "a.tsarev", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-249" },
  { id: "HACK-438", summary: "[AI-first-2026] Система рейтингов БК: методология, мини-сервис, симуляция, скиллы Cursor", reporter: "m.kravchenko", assignee: "m.kravchenko", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-438" },
  { id: "HACK-57", summary: "[AI-first-2026] Среда создания ИИ-сотрудников + AI Project Manager", reporter: "a.parshin", assignee: "a.parshin", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-57" },
  { id: "HACK-857", summary: "[AI-first-2026] TWLF.ai — 12-й Игрок: AI-компаньон для футбольных болельщиков", reporter: "a.andryushin", assignee: "a.andryushin", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-857" },
  { id: "HACK-152", summary: "[AI-first-2026] Pipeline Failure Collector", reporter: "r.nikolaev", assignee: "r.nikolaev", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-152" },
  { id: "HACK-382", summary: "[AI-first-2026] Агент автоматических ответов вебмастерам (линкбилдинг)", reporter: "o.tsebulevsky", assignee: "o.tsebulevsky", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-382" },
  { id: "HACK-975", summary: "[AI-first-2026] Metaratings Sponsor Project Builder — конструктор бриф → draft КП", reporter: "e.kim", assignee: null, state: "Open", url: "https://youtrack.rantsports.com/issue/HACK-975" },
  { id: "HACK-130", summary: "[AI-first-2026] Domain Agent — автоматизация управления доменами Metaratings", reporter: "a.lachugin", assignee: "a.lachugin", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-130" },
  { id: "HACK-167", summary: "[AI-first-2026] Backlog Groomer — помощник PM/PDM по актуализации бэклога", reporter: "o.volostrigov", assignee: "o.volostrigov", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-167" },
  { id: "HACK-206", summary: "[AI-first-2026] FS Monitor: Seometrics vs браузер, сводный отчёт и YT handoff", reporter: "d.ermoshkin", assignee: "d.ermoshkin", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-206" },
  { id: "HACK-606", summary: "[AI-first-2026] Сервис расчёта отыгрыша бонуса: демо UI, GitLab Pages, сдача (ступени 3–4)", reporter: "a.dudkina", assignee: "a.dudkina", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-606" },
  { id: "HACK-690", summary: "Интерактивный дашборд «Дерево метрик»", reporter: "v.azzheurov", assignee: "v.azzheurov", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-690" },
  { id: "HACK-406", summary: "[AI-first-2026] Еженедельный HR-отчёт: Huntflow, Calendar, YouTrack → Markdown", reporter: "e.meshcherikova", assignee: "e.meshcherikova", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-406" },
  { id: "HACK-390", summary: "[AI-first-2026] SEO Knowledge Base — синхронизация YouTrack ↔ Git", reporter: "n.scheglov", assignee: "n.scheglov", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-390" },
  { id: "HACK-740", summary: "[AI-first-2026] Автоматизация скриншотов для отчётности букмекерам (RU)", reporter: "e.chechin", assignee: "e.chechin", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-740" },
  { id: "HACK-964", summary: "[AI-first-2026] Пайплайн ИИ-текстов для Cybersport и публикация в Sports Media Admin API", reporter: "r.sadykov", assignee: "r.sadykov", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-964" },
  { id: "HACK-481", summary: "[AI-first-2026] Витрина персональных офферов БК: виджет, ЛК, моки", reporter: "e.khayretdinov", assignee: "e.khayretdinov", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-481" },
  { id: "HACK-613", summary: "[AI-first-2026] Бонус-чат: скилл анализа CSV (ст. 2) + Slack-алерты в облаке (ст. 4)", reporter: "l.strelnik", assignee: "l.strelnik", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-613" },
  { id: "HACK-792", summary: "[AI-first-2026] PR-разбор готовой спортивной новости: тематика, лиды, каналы", reporter: "s.huseynzade", assignee: "s.huseynzade", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-792" },
  { id: "HACK-474", summary: "[AI-first-2026] SEO-видео: сценарий из статьи для сайтов Меты (MVP)", reporter: "David_Baghdasarov", assignee: "David_Baghdasarov", state: "Open", url: "https://youtrack.rantsports.com/issue/HACK-474" },
  { id: "HACK-934", summary: "[AI-first-2026] Шаблон прогнозов MetaRatings: MD по команде, коэффициенты, папка «Шаблоны ИИ»", reporter: "a.kapustin", assignee: "a.kapustin", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-934" },
  { id: "HACK-145", summary: "[AI-first-2026] MR Analyzer", reporter: "i.serpukhov", assignee: "i.serpukhov", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-145" },
  { id: "HACK-242", summary: "[AI-first-2026] Pochtalyon: дайджест и напоминания (Slack, почта, YT, календарь)", reporter: "a.tarasova", assignee: "a.tarasova", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-242" },
  { id: "HACK-50", summary: "[AI-first-2026] Топ-10 — мини-игра «угадай топ» для фанатов", reporter: "s.avanesyan", assignee: "s.avanesyan", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-50" },
  { id: "HACK-181", summary: "[AI-first-2026] YouTrack баги → анализ частоты → Allure TestOps (покрытие/регресс) → тест-кейсы + отчёт в Slack", reporter: "v.kostarev", assignee: "v.kostarev", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-181" },
  { id: "HACK-614", summary: "[AI-first-2026] Отпуск: остаток, использовано, периоды (планы и прошлое), полная сводка — скилл Cursor под один источник", reporter: "a.burundukov", assignee: "a.burundukov", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-614" },
  { id: "HACK-754", summary: "[AI-first-2026] Bots Audit Tool — анализ бот-логов и приоритизированный бэклог", reporter: "a.mikhailova", assignee: "a.mikhailova", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-754" },
  { id: "HACK-271", summary: "[AI-first-2026] Автогенерация изображений для событийного контента", reporter: "a.aspidov", assignee: "a.aspidov", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-271" },
  { id: "HACK-846", summary: "[AI-first-2026] Школа беттинга Metaratings — геймифицированная образовательная платформа", reporter: "e.morozov", assignee: "e.morozov", state: "In Progress", url: "https://youtrack.rantsports.com/issue/HACK-846" },
  { id: "HACK-459", summary: "[AI-first-2026] Траст-метр: сервис проверки доменов букмекеров и казино — хакатон", reporter: "a.barladyan", assignee: "a.barladyan", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-459" },
  { id: "HACK-526", summary: "[AI-first-2026] Автоматический post-release мониторинг метрик ключевых страниц", reporter: "g.bagdasaryan", assignee: "g.bagdasaryan", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-526" },
  { id: "HACK-15", summary: "[AI-first-2026] MCP-сервис и API endpoints для управления материалами Sports Media", reporter: "m.atabaev", assignee: "m.atabaev", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-15" },
  { id: "HACK-8", summary: "[AI-first-2026] Автономный агент авто-фикса багов по логам", reporter: "m.atabaev", assignee: "m.atabaev", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-8" },
  { id: "HACK-109", summary: "[AI-first-2026] Помощник по почте конкурсов и таблицам", reporter: "v.gruzdev", assignee: "v.gruzdev", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-109" },
  { id: "HACK-747", summary: "[AI-first-2026] Dispatch Agent — персональный AI для рабочего контекста", reporter: "v.mekhontsev", assignee: "v.mekhontsev", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-747" },
  { id: "HACK-801", summary: "[AI-first-2026] WoWScore (WinScore Vite Edition) — React + Capacitor + WinScore API", reporter: "m.drozdov", assignee: "m.drozdov", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-801" },
  { id: "HACK-1", summary: "[AI-first-2026] AI Associate Template – шаблон разворачивания автономного агента в AWS", reporter: "n.kritsiuk", assignee: "n.kritsiuk", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-1" },
  { id: "HACK-656", summary: "[AI-first-2026] Тренд-чекер: сбор инфоповодов, сферы, хайпометр, дайджест в Telegram", reporter: "i.panasyuk", assignee: "i.panasyuk", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-656" },
  { id: "HACK-941", summary: "[AI-first-2026] CyberMeta Streamline: календарь релизов", reporter: "i.panasyuk", assignee: "i.panasyuk", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-941" },
  { id: "HACK-808", summary: "[AI-first-2026] Автономная AI-среда и Linear (оркестрация процессов)", reporter: "m.drozdov", assignee: "m.drozdov", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-808" },
  { id: "HACK-102", summary: "[AI-first-2026] AI QA Workflow Assistant для контентного QA в Sports Media", reporter: "s.andreev", assignee: "s.andreev", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-102" },
  { id: "HACK-467", summary: "[AI-first-2026] SEO Health Monitor", reporter: "l.ayupova", assignee: "l.ayupova", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-467" },
  { id: "HACK-383", summary: "[AI-first-2026] Agent swarm for expiring AI usage: docs hygiene + ANL research acceleration", reporter: "r.avanesov", assignee: "r.avanesov", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-383" },
  { id: "HACK-174", summary: "[AI-first-2026] PBN: линк-чекер сети (uptime и ссылки)", reporter: "s.kokornov", assignee: "s.kokornov", state: "Open", url: "https://youtrack.rantsports.com/issue/HACK-174" },
  { id: "HACK-949", summary: "[AI-first-2026] Агрегатор актуальных новостей СМИ Казахстана", reporter: "d.kadyrov", assignee: "d.kadyrov", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-949" },
  { id: "HACK-956", summary: "[AI-first-2026] Telegram-бот: расшифровка аудио/видео (Gemini)", reporter: "i.karsaulidze", assignee: "i.karsaulidze", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-956" },
  { id: "HACK-642", summary: "[AI-first-2026] Palpite: вычитка черновиков в Google Docs (Cursor)", reporter: "anastasia.aspidova", assignee: "anastasia.aspidova", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-642" },
  { id: "HACK-514", summary: "[AI-first-2026] Автодеплой env на dev-стенд из Deploy Notes", reporter: "d.miziak", assignee: "d.miziak", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-514" },
  { id: "HACK-675", summary: "[AI-first-2026] Автогенерация прогнозов киберспорта по SEO-шаблону и ИИ", reporter: "y.poddubny", assignee: "y.poddubny", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-675" },
  { id: "HACK-861", summary: "[AI-first-2026] Оркестр доменных агентов для префлайта задач перед PBR", reporter: "r.nikolaev", assignee: "r.nikolaev", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-861" },
  { id: "HACK-58", summary: "[AI-first-2026] Предупреждения при назначении и спринте с учётом отпусков (Google Calendar)", reporter: "t.gevorgyan", assignee: "t.gevorgyan", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-58" },
  { id: "HACK-220", summary: "[AI-first-2026] Телеграм-бот: грамматика и стиль новостей Metaratings", reporter: "d.kharchenko", assignee: "d.kharchenko", state: "Open", url: "https://youtrack.rantsports.com/issue/HACK-220" },
  { id: "HACK-227", summary: "[AI-first-2026] Мониторинг актуальности бонусов Metaratings.tj", reporter: "m.zvyagintsev", assignee: "m.zvyagintsev", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-227" },
  { id: "HACK-874", summary: "[AI-first-2026] Brazuca AI-Editor — pt-BR прогнозы из статистики", reporter: "y.yakovleva", assignee: "y.yakovleva", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-874" },
  { id: "HACK-921", summary: "[AI-first-2026] Ставочные новости — адаптация черновика под эксклюзивный формат в Cursor", reporter: "s.goncharov", assignee: "s.goncharov", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-921" },
  { id: "HACK-838", summary: "[AI-first-2026] Telegram-бот: H1 и URL для редакторов", reporter: "d.sadriev", assignee: "d.sadriev", state: "Open", url: "https://youtrack.rantsports.com/issue/HACK-838" },
  { id: "HACK-555", summary: "[AI-first-2026] Автоматизация ежемесячной отчетности по рекламным креативам Metaratings", reporter: "n.bondarenko", assignee: "n.bondarenko", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-555" },
  { id: "HACK-909", summary: "[AI-first-2026] ИИ-автор черновиков КиберМеты", reporter: "r.sadykov", assignee: "r.sadykov", state: "Open", url: "https://youtrack.rantsports.com/issue/HACK-909" },
  { id: "HACK-264", summary: "[AI-first-2026] QA Watcher Agent — автоанализ задач и проверка по плану", reporter: "d.bryantsev", assignee: "d.bryantsev", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-264" },
  { id: "HACK-559", summary: "[AI-first-2026] Интервью → новости + видео-сценарий", reporter: "l.romanovich", assignee: "r.semeneev", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-559" },
  { id: "HACK-197", summary: "[AI-first-2026] Календарь матчей и прогнозов — автообновление Google Таблицы", reporter: "a.moskvin", assignee: "a.moskvin", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-197" },
  { id: "HACK-495", summary: "[AI-first-2026] Скилл: фото для обложек (спикер, клуб/федерация)", reporter: "i.karsaulidze", assignee: "i.karsaulidze", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-495" },
  { id: "HACK-204", summary: "[AI-first-2026] Ad Campaign Autopilot — автоматизация подготовки рекламных кампаний", reporter: "o.bondar", assignee: "o.bondar", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-204" },
  { id: "HACK-131", summary: "[AI-first-2026] Генератор промо-лендингов с бонусами через админку Sports Media", reporter: "a.lonshakova", assignee: "a.lonshakova", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-131" },
  { id: "HACK-414", summary: "[AI-first-2026] Мониторинг вакансий hh.ru ↔ сайт компании", reporter: "a.rukin", assignee: "a.rukin", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-414" },
  { id: "HACK-153", summary: "[AI-first-2026] PBN: повторяемый скилл отбора доменов (Ahrefs / фильтры)", reporter: "s.kokornov", assignee: "s.kokornov", state: "Obsolete", url: "https://youtrack.rantsports.com/issue/HACK-153" },
  { id: "HACK-29", summary: "[AI-first-2026] Props — внутреннее приложение благодарностей коллегам", reporter: "i.starikov", assignee: "i.starikov", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-29" },
  { id: "HACK-434", summary: "[AI-first-2026] Автосбор regs/FTD из партнёрских API в Google Таблицу (пилот 3–5 партнёров, хакатон) + триггер Apps Script", reporter: "a.makarenko", assignee: "a.makarenko", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-434" },
  { id: "HACK-72", summary: "[AI-first-2026] Кастомные напоминалки о бизнес-процессах", reporter: "n.trukhin", assignee: "n.trukhin", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-72" },
  { id: "HACK-95", summary: "[AI-first-2026] Discovery: Telegram-сигналы → скоринг → Discovery Backlog в YouTrack", reporter: "p.sidogov", assignee: "p.sidogov", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-95" },
  { id: "HACK-235", summary: "[AI-first-2026] Онбординг Back Office: скилл Cursor и материалы", reporter: "a.shishko", assignee: "a.shishko", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-235" },
  { id: "HACK-160", summary: "[AI-first-2026] SEO Sentinel — автономный мониторинг позиций, конкурентов и реагирование", reporter: "y.bakanovski", assignee: "y.bakanovski", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-160" },
  { id: "HACK-368", summary: "[AI-first-2026] Рынки предсказаний: темы, вероятности, актуальность", reporter: "e.bagirov", assignee: "e.bagirov", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-368" },
  { id: "HACK-116", summary: "[AI-first-2026] CSAT Metaratings: виджет, микросервис, Slack", reporter: "a.chekanov", assignee: "a.chekanov", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-116" },
  { id: "HACK-205", summary: "Zero to Live: автоматизированный SEO-цикл от текста до индексации в Google", reporter: "a.tyurin", assignee: "a.tyurin", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-205" },
  { id: "HACK-182", summary: "[AI-first-2026] InsightsTube — дайджест идей с YouTube", reporter: "m.rakutko", assignee: "m.rakutko", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-182" },
  { id: "HACK-189", summary: "[AI-first-2026] Автоматизация внутренней перелинковки", reporter: "s.khartimeev", assignee: "s.khartimeev", state: "Open", url: "https://youtrack.rantsports.com/issue/HACK-189" },
  { id: "HACK-88", summary: "[AI-first-2026] Гео-отчёты TelecomAsia: GSC → Sheets → email → YouTrack", reporter: "s.kovaleva", assignee: "s.kovaleva", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-88" },
  { id: "HACK-234", summary: "[AI-first-2026] Smart Regression System — Система интеллектуального регрессионного тестирования", reporter: "o.iltsov", assignee: "o.iltsov", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-234" },
  { id: "HACK-34", summary: "[AI-first-2026] Оценочный сервис для МЦ", reporter: "d.panferov", assignee: "d.panferov", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-34" },
  { id: "HACK-542", summary: "[AI-first-2026] Дайджест алертов Telegram и задач YouTrack в Slack", reporter: "i.salahov", assignee: "i.salahov", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-542" },
  { id: "HACK-375", summary: "[AI-first-2026] Paul 2.0 — Осьминог-предсказатель ЧМ-2026", reporter: "b.chervyakov", assignee: "b.chervyakov", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-375" },
  { id: "HACK-780", summary: "[AI-first-2026] Актуализация обновляемого контента: пакет данных в Cursor (скилл/источники)", reporter: "a.levchenko", assignee: "a.levchenko", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-780" },
  { id: "HACK-460", summary: "[AI-first-2026] Автоматическое расписание смен редакторов (YAML → Markdown)", reporter: "d.sadriev", assignee: "d.sadriev", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-460" },
  { id: "HACK-65", summary: "[AI-first-2026] Impact site changes — веб-интерфейс с графиками", reporter: "a.koshkosh", assignee: "a.koshkosh", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-65" },
  { id: "HACK-22", summary: "[AI-first-2026] Пайплайн Ahrefs CSV → SERP — приоритизация линкбилдинга", reporter: "m.mann", assignee: "m.mann", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-22" },
  { id: "HACK-399", summary: "[AI-first-2026] TZChecker – автопроверка текстов на соответствие ТЗ", reporter: "i.karpenko", assignee: "i.karpenko", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-399" },
  { id: "HACK-579", summary: "[AI-first-2026] Мониторинг разметки GA4 события click_on_bk_web (промоссылки → БК)", reporter: "a.agafonova", assignee: "a.agafonova", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-579" },
  { id: "HACK-213", summary: "[AI-first-2026] Квизы из новостей: ИИ, игра в браузере, выгрузка в админку", reporter: "d.zainullin", assignee: "d.zainullin", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-213" },
  { id: "HACK-773", summary: "[AI-first-2026] Django Unchained — Autonomous Dev Pipeline", reporter: "chris", assignee: "chris", state: "Open", url: "https://youtrack.rantsports.com/issue/HACK-773" },
  { id: "HACK-765", summary: "[AI-first-2026] Автопостинг новостей в Telegram, VK и MAX", reporter: "r.sadykov", assignee: "r.sadykov", state: "Open", url: "https://youtrack.rantsports.com/issue/HACK-765" },
  { id: "HACK-720", summary: "[AI-first-2026] AI Forecast Editor — улучшение прогнозов через LLM", reporter: "i.kushmantsev", assignee: "i.kushmantsev", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-720" },
  { id: "HACK-138", summary: "[AI-first-2026] Автономный агент микро-улучшений кода Sports Media", reporter: "d.popov", assignee: "d.popov", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-138" },
  { id: "HACK-256", summary: "[AI-first-2026] Slack alert triage agent: dossier, YouTrack draft, MR proposal", reporter: "d.susha", assignee: "d.susha", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-256" },
  { id: "HACK-43", summary: "[AI-first-2026] Sports Content Engine — программатический генератор SEO-страниц", reporter: "chris", assignee: "chris", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-43" },
  { id: "HACK-535", summary: "[AI-first-2026] Duty-bot для triage HELP-тикетов DevOps", reporter: "i.isakov", assignee: "i.isakov", state: "Open", url: "https://youtrack.rantsports.com/issue/HACK-535" },
  { id: "HACK-488", summary: "[AI-first-2026] Hackathon Assessor", reporter: "v.hambardzumyan", assignee: "v.hambardzumyan", state: "Open", url: "https://youtrack.rantsports.com/issue/HACK-488" },
  { id: "HACK-809", summary: "[AI-first-2026] Хакатон: инфра и команда Алины Тарасовой (Pochtalyon, Slack, AWS)", reporter: "m.drozdov", assignee: "m.drozdov", state: "Done", url: "https://youtrack.rantsports.com/issue/HACK-809" },
];

const EXCLUDE_IDS = new Set(["HACK-153", "HACK-809"]);

function cleanTitle(summary) {
  return summary.replace(/^\[AI-first-2026\]\s*/, "").trim();
}

function formatAuthorName(login) {
  if (!login) return "Unknown";
  if (login === "chris") return "Chris";
  if (login === "David_Baghdasarov") return "D. Baghdasarov";
  const parts = login.split(".");
  if (parts.length === 2) {
    return parts[0].charAt(0).toUpperCase() + ". " + parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
  }
  return login.charAt(0).toUpperCase() + login.slice(1);
}

function toEmail(login) {
  if (!login) return "";
  const clean = login.toLowerCase().replace("_", ".");
  return `${clean}@rantsports.com`;
}

function classify(title) {
  const t = title.toLowerCase();

  if (t.includes("seo") || t.includes("позиц") || t.includes("линкбилдинг") || t.includes("pbn") || t.includes("перелинков") || t.includes("ahrefs") || t.includes("serp") || t.includes("индексац") || t.includes("seometrics")) {
    return { forWhom: ["SEO-специалисты"], whoAffected: ["SEO-отдел"], whatImproves: ["SEO-эффективность"] };
  }
  if (t.includes("qa") || t.includes("тест") || t.includes("регресс") || t.includes("allure")) {
    return { forWhom: ["QA-инженеры"], whoAffected: ["Разработка", "QA"], whatImproves: ["Качество тестирования"] };
  }
  if (t.includes("hr") || t.includes("онбординг") || t.includes("отпуск") || t.includes("вакансий") || t.includes("huntflow") || t.includes("performance") || t.includes("благодарност") || t.includes("сотрудник")) {
    return { forWhom: ["HR"], whoAffected: ["Вся компания"], whatImproves: ["HR-процессы"] };
  }
  if (t.includes("pipeline") || t.includes("деплой") || t.includes("ci/cd") || t.includes("docker") || t.includes("aws") || t.includes("инфра") || t.includes("dev-стенд") || t.includes("авто-фикс")) {
    return { forWhom: ["DevOps", "Разработчики"], whoAffected: ["Техническая команда"], whatImproves: ["Инфраструктура"] };
  }
  if (t.includes("мониторинг") || t.includes("метрик") || t.includes("дашборд") || t.includes("отчёт") || t.includes("отчет") || t.includes("аналитик") || t.includes("ga4")) {
    return { forWhom: ["Аналитики", "Менеджеры"], whoAffected: ["Бизнес"], whatImproves: ["Аналитика и отчётность"] };
  }
  if (t.includes("telegram") || t.includes("бот") || t.includes("slack") && t.includes("алерт")) {
    return { forWhom: ["Команда"], whoAffected: ["Пользователи сервиса"], whatImproves: ["Автоматизация уведомлений"] };
  }
  if (t.includes("контент") || t.includes("новост") || t.includes("редакт") || t.includes("текст") || t.includes("статей") || t.includes("прогноз") || t.includes("черновик") || t.includes("публикац") || t.includes("видео-сценарий") || t.includes("сценарий")) {
    return { forWhom: ["Редакция", "Контент-менеджеры"], whoAffected: ["Контент-команда"], whatImproves: ["Скорость создания контента"] };
  }
  if (t.includes("бэклог") || t.includes("youtrack") || t.includes("задач") || t.includes("спринт") || t.includes("тикет")) {
    return { forWhom: ["Продакт-менеджеры", "Тимлиды"], whoAffected: ["Продуктовые команды"], whatImproves: ["Управление задачами"] };
  }
  if (t.includes("реклам") || t.includes("креатив") || t.includes("кампани") || t.includes("маркетинг") || t.includes("промо")) {
    return { forWhom: ["Маркетинг"], whoAffected: ["Бизнес"], whatImproves: ["Эффективность рекламы"] };
  }
  if (t.includes("mr ") || t.includes("код") || t.includes("code") || t.includes("gitlab") || t.includes("mcp") || t.includes("api") || t.includes("laravel") || t.includes("django") || t.includes("react")) {
    return { forWhom: ["Разработчики"], whoAffected: ["Техническая команда"], whatImproves: ["Процессы разработки"] };
  }
  if (t.includes("бонус") || t.includes("букмекер") || t.includes("бк") || t.includes("оффер") || t.includes("ставоч") || t.includes("беттинг")) {
    return { forWhom: ["Монетизация"], whoAffected: ["Бизнес", "Пользователи"], whatImproves: ["Монетизация и конверсия"] };
  }
  if (t.includes("болельщ") || t.includes("фанат") || t.includes("игра") || t.includes("квиз") || t.includes("осьминог") || t.includes("рынки предсказ")) {
    return { forWhom: ["Пользователи", "Фанаты"], whoAffected: ["Аудитория сайта"], whatImproves: ["Вовлечённость аудитории"] };
  }
  if (t.includes("домен") || t.includes("траст")) {
    return { forWhom: ["SEO-специалисты"], whoAffected: ["SEO-отдел"], whatImproves: ["Управление доменами"] };
  }
  if (t.includes("рейтинг") || t.includes("оценоч") || t.includes("estimation") || t.includes("оценк")) {
    return { forWhom: ["Продакт-менеджеры"], whoAffected: ["Продуктовые команды"], whatImproves: ["Точность оценок"] };
  }

  return { forWhom: ["Команда"], whoAffected: ["Компания"], whatImproves: ["Автоматизация процессов"] };
}

const projects = raw
  .filter((p) => !EXCLUDE_IDS.has(p.id))
  .map((p) => {
    const title = cleanTitle(p.summary);
    const cat = classify(title);
    const num = p.id.replace("HACK-", "");

    const emails = [toEmail(p.reporter)];
    if (p.assignee && p.assignee !== p.reporter) {
      emails.push(toEmail(p.assignee));
    }

    const authors = [formatAuthorName(p.reporter)];
    if (p.assignee && p.assignee !== p.reporter) {
      authors.push(formatAuthorName(p.assignee));
    }

    return {
      id: `hack-${num}`,
      title,
      oneLiner: title,
      coverUrl: "",
      forWhom: cat.forWhom,
      whoAffected: cat.whoAffected,
      whatImproves: cat.whatImproves,
      fullDescription: "",
      youtrackUrl: p.url,
      authors,
      authorEmails: emails.filter(Boolean),
      epicId: p.id,
    };
  });

const outPath = path.join(__dirname, "..", "src", "data", "projects.json");
fs.writeFileSync(outPath, JSON.stringify(projects, null, 2), "utf-8");
console.log(`Generated ${projects.length} projects -> ${outPath}`);
