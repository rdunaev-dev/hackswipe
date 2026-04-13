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

const MANUAL_OVERRIDES = {
  "HACK-81": {
    oneLiner: "ИИ оценивает трудозатраты задач на основе истории похожих тикетов и кодовой базы.",
    forWhom: ["Продакт-менеджеры", "Тимлиды"],
    whoAffected: ["Продуктовые команды"],
    whatImproves: ["Точность оценки сроков задач"],
  },
  "HACK-521": {
    oneLiner: "Единая HR-платформа на Frappe: от найма до отпусков и кадрового учёта в одном окне.",
    forWhom: ["HR-менеджеры", "Кадровые специалисты"],
    whoAffected: ["HR-отдел", "Все сотрудники"],
    whatImproves: ["Централизация кадрового учёта"],
  },
  "HACK-123": {
    oneLiner: "Бот парсит Telegram-каналы и превращает посты в готовые черновики новостей для редакции.",
    forWhom: ["Редакторы новостей", "Контент-менеджеры"],
    whoAffected: ["Редакция"],
    whatImproves: ["Скорость выпуска горячих новостей"],
  },
  "HACK-278": {
    oneLiner: "Бот получает URL, проверяет качество опубликованного материала и выдаёт детальный отчёт.",
    forWhom: ["Контент-редакторы", "QA-контента"],
    whoAffected: ["Редакция"],
    whatImproves: ["Контроль качества публикаций"],
  },
  "HACK-196": {
    oneLiner: "Автоматически отличает продуктовые сайты от информационных по мета-тегам для SEO-анализа.",
    forWhom: ["SEO-аналитики", "Линкбилдеры"],
    whoAffected: ["SEO-отдел"],
    whatImproves: ["Скорость классификации доноров для ссылок"],
  },
  "HACK-502": {
    oneLiner: "Ежедневные снапшоты позиций конкурентов и сводный отчёт для быстрого реагирования SEO-команды.",
    forWhom: ["SEO-стратеги", "SEO-аналитики"],
    whoAffected: ["SEO-отдел"],
    whatImproves: ["Оперативность реакции на действия конкурентов"],
  },
  "HACK-78": {
    oneLiner: "Алерты публикаций BY-медиа, генератор подписей и проверка эксклюзивности для белорусской редакции.",
    forWhom: ["Редакторы MetaRatings.by"],
    whoAffected: ["Белорусская редакция"],
    whatImproves: ["Мониторинг конкурентов в BY-сегменте"],
  },
  "HACK-982": {
    oneLiner: "После финального свистка бот мгновенно выдаёт статистику бомбардиров и ассистентов матча.",
    forWhom: ["Спортивные редакторы"],
    whoAffected: ["Читатели Metaratings"],
    whatImproves: ["Скорость публикации послематчевой статистики"],
  },
  "HACK-452": {
    oneLiner: "Единая витрина идей: агент собирает предложения из Slack и Cursor, убирает дубли, показывает лучшее.",
    forWhom: ["Продакт-менеджеры", "Разработчики SFE"],
    whoAffected: ["Продуктовые команды"],
    whatImproves: ["Сохранность и видимость продуктовых идей"],
  },
  "HACK-592": {
    oneLiner: "Корпоративный медиа-архив с ключевыми событиями, мемами и историей компании для всех сотрудников.",
    forWhom: ["HR-менеджеры", "Маркетологи"],
    whoAffected: ["Все сотрудники"],
    whatImproves: ["Корпоративная культура и сохранение истории"],
  },
  "HACK-249": {
    oneLiner: "Готовый набор контекста и инструментов для разработки на Laravel/GraphQL прямо в Cursor.",
    forWhom: ["Backend-разработчики SFE"],
    whoAffected: ["Команда разработки SFE"],
    whatImproves: ["Продуктивность разработки на Laravel"],
  },
  "HACK-438": {
    oneLiner: "Методология и мини-сервис для расчёта рейтингов букмекерских контор с симуляцией и скиллами Cursor.",
    forWhom: ["Аналитики монетизации", "Контент-менеджеры БК"],
    whoAffected: ["Отдел монетизации"],
    whatImproves: ["Объективность и прозрачность рейтингов БК"],
  },
  "HACK-57": {
    oneLiner: "Платформа для создания ИИ-ассистентов и виртуальный PM, который ведёт проекты автономно.",
    forWhom: ["Тимлиды", "AI-инженеры"],
    whoAffected: ["Все отделы"],
    whatImproves: ["Скорость запуска новых AI-агентов"],
  },
  "HACK-857": {
    oneLiner: "AI-компаньон болельщика: персональная статистика, предматчевые брифинги и советы по ставкам.",
    forWhom: ["Продакт-менеджеры", "Разработчики"],
    whoAffected: ["Футбольные болельщики"],
    whatImproves: ["Вовлечённость и удержание аудитории"],
  },
  "HACK-152": {
    oneLiner: "Автоматически собирает и группирует падения CI/CD-пайплайнов для быстрого анализа причин.",
    forWhom: ["DevOps-инженеры", "Backend-разработчики"],
    whoAffected: ["Техническая команда"],
    whatImproves: ["Время диагностики сломанных пайплайнов"],
  },
  "HACK-382": {
    oneLiner: "ИИ-агент отвечает вебмастерам по шаблону, экономя часы рутинной переписки по линкбилдингу.",
    forWhom: ["Линкбилдеры", "SEO-аутрич-менеджеры"],
    whoAffected: ["SEO-отдел"],
    whatImproves: ["Скорость обработки заявок вебмастеров"],
  },
  "HACK-975": {
    oneLiner: "Конструктор коммерческих предложений: из брифа спонсора — в готовый драфт КП за минуты.",
    forWhom: ["Менеджеры по продажам", "Маркетологи"],
    whoAffected: ["Отдел монетизации"],
    whatImproves: ["Скорость подготовки коммерческих предложений"],
  },
  "HACK-130": {
    oneLiner: "Агент управляет сотнями доменов Metaratings: продление, DNS, мониторинг — без ручной рутины.",
    forWhom: ["DevOps-инженеры", "SEO-специалисты"],
    whoAffected: ["Техническая команда", "SEO-отдел"],
    whatImproves: ["Контроль над доменным портфелем"],
  },
  "HACK-167": {
    oneLiner: "ИИ-помощник чистит бэклог: находит устаревшие задачи, дублирует и предлагает приоритеты.",
    forWhom: ["Продакт-менеджеры", "Владельцы бэклогов"],
    whoAffected: ["Продуктовые команды"],
    whatImproves: ["Актуальность и чистота бэклога"],
  },
  "HACK-206": {
    oneLiner: "Сравнивает данные Seometrics с реальными позициями в браузере и передаёт расхождения в YouTrack.",
    forWhom: ["SEO-аналитики"],
    whoAffected: ["SEO-отдел"],
    whatImproves: ["Достоверность данных о позициях сайта"],
  },
  "HACK-606": {
    oneLiner: "Калькулятор отыгрыша бонуса БК с наглядным UI — пользователь видит свой прогресс по вейджеру.",
    forWhom: ["Frontend-разработчики", "Контент-менеджеры БК"],
    whoAffected: ["Читатели обзоров бонусов"],
    whatImproves: ["Прозрачность условий бонусов для пользователей"],
  },
  "HACK-690": {
    oneLiner: "Визуальное дерево метрик: от верхнеуровневых KPI до атомарных показателей с drill-down.",
    forWhom: ["Аналитики", "Руководители отделов"],
    whoAffected: ["Менеджмент"],
    whatImproves: ["Понимание взаимосвязей между метриками"],
  },
  "HACK-406": {
    oneLiner: "Автосборка еженедельного HR-отчёта из Huntflow, календаря и YouTrack в Markdown.",
    forWhom: ["HR-менеджеры", "HR-директор"],
    whoAffected: ["HR-отдел"],
    whatImproves: ["Время подготовки еженедельной HR-отчётности"],
  },
  "HACK-390": {
    oneLiner: "Двусторонняя синхронизация SEO-знаний между YouTrack-статьями и Git-репозиторием.",
    forWhom: ["SEO-специалисты", "SEO-тимлид"],
    whoAffected: ["SEO-отдел"],
    whatImproves: ["Доступность и актуальность SEO-документации"],
  },
  "HACK-740": {
    oneLiner: "Робот делает скриншоты страниц с бонусами и собирает их в отчёт для партнёров-букмекеров.",
    forWhom: ["Менеджеры по работе с партнёрами"],
    whoAffected: ["Отдел монетизации"],
    whatImproves: ["Скорость подготовки отчётов для БК-партнёров"],
  },
  "HACK-964": {
    oneLiner: "Полный конвейер: ИИ пишет тексты про киберспорт и публикует через Sports Media Admin API.",
    forWhom: ["Киберспортивные редакторы"],
    whoAffected: ["Редакция CyberMeta"],
    whatImproves: ["Объём киберспортивного контента"],
  },
  "HACK-481": {
    oneLiner: "Персональная витрина офферов БК: каждый пользователь видит бонусы, релевантные именно ему.",
    forWhom: ["Продакт-менеджеры монетизации", "Frontend-разработчики"],
    whoAffected: ["Пользователи Metaratings"],
    whatImproves: ["Конверсия в переходы к букмекерам"],
  },
  "HACK-613": {
    oneLiner: "Чат-бот анализирует загруженный CSV с бонусами и рассылает Slack-алерты при аномалиях.",
    forWhom: ["Аналитики монетизации", "Контент-менеджеры БК"],
    whoAffected: ["Отдел монетизации"],
    whatImproves: ["Оперативность контроля бонусных данных"],
  },
  "HACK-792": {
    oneLiner: "ИИ разбирает готовую новость на тематику, ключевые лиды и подходящие каналы дистрибуции.",
    forWhom: ["PR-менеджеры", "Главные редакторы"],
    whoAffected: ["Отдел маркетинга", "Редакция"],
    whatImproves: ["Эффективность дистрибуции спортивных новостей"],
  },
  "HACK-474": {
    oneLiner: "Из текстовой статьи — в готовый видео-сценарий для YouTube-канала Metaratings.",
    forWhom: ["Видеопродюсеры", "SEO-контент-менеджеры"],
    whoAffected: ["Видео-команда"],
    whatImproves: ["Скорость производства SEO-видеоконтента"],
  },
  "HACK-934": {
    oneLiner: "Готовый Markdown-шаблон прогноза по команде с коэффициентами, хранящийся в папке ИИ-шаблонов.",
    forWhom: ["Авторы прогнозов", "Спортивные аналитики"],
    whoAffected: ["Редакция прогнозов"],
    whatImproves: ["Единообразие и скорость написания прогнозов"],
  },
  "HACK-145": {
    oneLiner: "Автоанализ Merge Request: замечания по коду, метрики сложности и рекомендации ревьюеру.",
    forWhom: ["Backend-разработчики", "Код-ревьюеры"],
    whoAffected: ["Команда разработки"],
    whatImproves: ["Качество и скорость код-ревью"],
  },
  "HACK-242": {
    oneLiner: "Персональный дайджест и умные напоминания из Slack, почты, YouTrack и календаря в одном месте.",
    forWhom: ["Все сотрудники"],
    whoAffected: ["Все отделы"],
    whatImproves: ["Управление информационным потоком сотрудника"],
  },
  "HACK-50": {
    oneLiner: "Мини-игра «угадай топ-10»: фанаты составляют рейтинги игроков и сравнивают с реальными.",
    forWhom: ["Продакт-менеджеры", "Frontend-разработчики"],
    whoAffected: ["Спортивные фанаты"],
    whatImproves: ["Вовлечённость аудитории на сайте"],
  },
  "HACK-181": {
    oneLiner: "Цепочка: баги из YouTrack → частотный анализ → покрытие в Allure → автогенерация тест-кейсов.",
    forWhom: ["QA-инженеры", "QA-лиды"],
    whoAffected: ["QA-отдел"],
    whatImproves: ["Покрытие регрессионного тестирования"],
  },
  "HACK-614": {
    oneLiner: "Скилл Cursor показывает остаток отпуска, использованные дни и будущие планы из одного источника.",
    forWhom: ["Все сотрудники", "HR-менеджеры"],
    whoAffected: ["Все отделы"],
    whatImproves: ["Прозрачность учёта отпусков"],
  },
  "HACK-754": {
    oneLiner: "Анализирует логи Telegram-ботов компании, находит ошибки и формирует приоритизированный бэклог.",
    forWhom: ["Backend-разработчики", "Продакт-менеджеры"],
    whoAffected: ["Команда разработки ботов"],
    whatImproves: ["Стабильность работы Telegram-ботов"],
  },
  "HACK-271": {
    oneLiner: "ИИ генерирует уникальные картинки для обложек спортивных событий без помощи дизайнера.",
    forWhom: ["Контент-менеджеры", "Редакторы"],
    whoAffected: ["Редакция"],
    whatImproves: ["Скорость оформления событийного контента"],
  },
  "HACK-846": {
    oneLiner: "Геймифицированная платформа для новичков в ставках: уроки, квизы, рейтинги, бейджи.",
    forWhom: ["Продакт-менеджеры", "Контент-менеджеры БК"],
    whoAffected: ["Начинающие бетторы"],
    whatImproves: ["Образование аудитории в теме беттинга"],
  },
  "HACK-459": {
    oneLiner: "Сервис проверяет домен букмекера или казино и выдаёт оценку доверия с обоснованием.",
    forWhom: ["SEO-специалисты", "Контент-менеджеры БК"],
    whoAffected: ["Пользователи Metaratings"],
    whatImproves: ["Защита пользователей от мошеннических сайтов"],
  },
  "HACK-526": {
    oneLiner: "После каждого релиза автоматически проверяет метрики ключевых страниц и сигналит о просадках.",
    forWhom: ["DevOps-инженеры", "SEO-аналитики"],
    whoAffected: ["Техническая команда", "SEO-отдел"],
    whatImproves: ["Раннее обнаружение регрессий после деплоя"],
  },
  "HACK-15": {
    oneLiner: "MCP-сервис и API для управления статьями Sports Media прямо из Cursor и AI-агентов.",
    forWhom: ["Backend-разработчики", "AI-инженеры"],
    whoAffected: ["Команда разработки"],
    whatImproves: ["Интеграция CMS с AI-инструментами"],
  },
  "HACK-8": {
    oneLiner: "Агент читает логи продакшена, находит баги и автоматически создаёт MR с исправлением.",
    forWhom: ["Backend-разработчики", "DevOps-инженеры"],
    whoAffected: ["Техническая команда"],
    whatImproves: ["Время устранения продакшен-багов"],
  },
  "HACK-109": {
    oneLiner: "Автоматизирует рутину маркетолога: парсит почту конкурсов, заполняет таблицы участия.",
    forWhom: ["Маркетологи", "PR-менеджеры"],
    whoAffected: ["Отдел маркетинга"],
    whatImproves: ["Скорость обработки входящих предложений конкурсов"],
  },
  "HACK-747": {
    oneLiner: "Персональный AI-ассистент, который знает контекст ваших задач, встреч и переписок.",
    forWhom: ["Руководители отделов", "Продакт-менеджеры"],
    whoAffected: ["Менеджмент"],
    whatImproves: ["Персональная продуктивность менеджера"],
  },
  "HACK-801": {
    oneLiner: "Мобильное приложение WinScore на React + Capacitor для отслеживания live-счёта матчей.",
    forWhom: ["Frontend-разработчики", "Продакт-менеджеры"],
    whoAffected: ["Мобильные пользователи"],
    whatImproves: ["Доступность live-счёта на мобильных устройствах"],
  },
  "HACK-1": {
    oneLiner: "Шаблон для разворачивания автономного AI-агента в AWS за 15 минут: от кода до продакшена.",
    forWhom: ["DevOps-инженеры", "AI-инженеры"],
    whoAffected: ["Все отделы с AI-проектами"],
    whatImproves: ["Скорость запуска новых AI-сервисов"],
  },
  "HACK-656": {
    oneLiner: "Собирает инфоповоды из медиа, оценивает хайп и отправляет горячий дайджест в Telegram.",
    forWhom: ["Контент-редакторы", "Маркетологи"],
    whoAffected: ["Редакция", "Отдел маркетинга"],
    whatImproves: ["Оперативность реагирования на тренды"],
  },
  "HACK-941": {
    oneLiner: "Календарь киберспортивных релизов: не пропустите дату выхода турнира или обновления игры.",
    forWhom: ["Киберспортивные редакторы"],
    whoAffected: ["Редакция CyberMeta"],
    whatImproves: ["Планирование киберспортивного контента"],
  },
  "HACK-808": {
    oneLiner: "AI-среда с Linear-интеграцией: агенты сами берут задачи, выполняют и двигают по доске.",
    forWhom: ["Тимлиды", "AI-инженеры"],
    whoAffected: ["Техническая команда"],
    whatImproves: ["Автономность выполнения рутинных задач"],
  },
  "HACK-102": {
    oneLiner: "AI-ассистент для QA контента: проверяет материалы Sports Media по чеклисту качества.",
    forWhom: ["QA-контента", "Контент-менеджеры"],
    whoAffected: ["Редакция"],
    whatImproves: ["Систематичность проверки контента перед публикацией"],
  },
  "HACK-467": {
    oneLiner: "Панель здоровья SEO: ежедневная проверка индексации, скорости, битых ссылок и мета-тегов.",
    forWhom: ["SEO-специалисты", "SEO-тимлид"],
    whoAffected: ["SEO-отдел"],
    whatImproves: ["Раннее обнаружение SEO-проблем на сайте"],
  },
  "HACK-383": {
    oneLiner: "Рой агентов следит за актуальностью AI-документации и ускоряет исследования аналитиков.",
    forWhom: ["Аналитики", "AI-инженеры"],
    whoAffected: ["Отдел аналитики"],
    whatImproves: ["Актуальность внутренней документации AI-проектов"],
  },
  "HACK-174": {
    oneLiner: "Проверяет uptime и наличие ссылок на всех сателлитах PBN-сети в режиме реального времени.",
    forWhom: ["Линкбилдеры", "SEO-специалисты"],
    whoAffected: ["SEO-отдел"],
    whatImproves: ["Контроль работоспособности PBN-сети"],
  },
  "HACK-949": {
    oneLiner: "Агрегатор спортивных новостей из казахстанских СМИ для редакции локальной версии сайта.",
    forWhom: ["Редакторы казахстанского контента"],
    whoAffected: ["Казахстанская редакция"],
    whatImproves: ["Покрытие новостной повестки Казахстана"],
  },
  "HACK-956": {
    oneLiner: "Telegram-бот расшифровывает аудио и видеосообщения в текст через Gemini за секунды.",
    forWhom: ["Все сотрудники"],
    whoAffected: ["Все отделы"],
    whatImproves: ["Удобство работы с голосовыми сообщениями"],
  },
  "HACK-642": {
    oneLiner: "Вычитывает черновики прогнозов в Google Docs из Cursor: грамматика, стиль, фактчек.",
    forWhom: ["Авторы прогнозов", "Контент-редакторы"],
    whoAffected: ["Бразильская редакция"],
    whatImproves: ["Качество текстов до публикации"],
  },
  "HACK-514": {
    oneLiner: "Один клик — и нужный env разворачивается на dev-стенде прямо из Deploy Notes задачи.",
    forWhom: ["Backend-разработчики", "DevOps-инженеры"],
    whoAffected: ["Техническая команда"],
    whatImproves: ["Время настройки тестовых окружений"],
  },
  "HACK-675": {
    oneLiner: "ИИ генерирует прогнозы по киберспортивным матчам на базе SEO-шаблонов и актуальной статистики.",
    forWhom: ["Киберспортивные редакторы", "SEO-контент-менеджеры"],
    whoAffected: ["Редакция CyberMeta"],
    whatImproves: ["Объём и скорость выпуска киберспортивных прогнозов"],
  },
  "HACK-861": {
    oneLiner: "Группа специализированных агентов проверяет задачи перед PBR: полнота, зависимости, риски.",
    forWhom: ["Продакт-менеджеры", "Тимлиды"],
    whoAffected: ["Продуктовые команды"],
    whatImproves: ["Качество подготовки задач к PBR"],
  },
  "HACK-58": {
    oneLiner: "Не дадим назначить задачу тому, кто в отпуске — алерты при назначении и планировании спринта.",
    forWhom: ["Тимлиды", "Продакт-менеджеры"],
    whoAffected: ["Все проектные команды"],
    whatImproves: ["Точность ресурсного планирования"],
  },
  "HACK-220": {
    oneLiner: "Telegram-бот вычитывает новости Metaratings на грамматику и стиль перед публикацией.",
    forWhom: ["Спортивные редакторы", "Корректоры"],
    whoAffected: ["Редакция"],
    whatImproves: ["Грамотность и стилистика публикуемых новостей"],
  },
  "HACK-227": {
    oneLiner: "Мониторит актуальность бонусных предложений на сайте Metaratings.tj и сигналит о просрочке.",
    forWhom: ["Контент-менеджеры БК", "Региональные менеджеры"],
    whoAffected: ["Таджикистанская редакция"],
    whatImproves: ["Актуальность бонусного контента для TJ"],
  },
  "HACK-874": {
    oneLiner: "ИИ-редактор генерирует спортивные прогнозы на бразильском португальском из данных статистики.",
    forWhom: ["Бразильские контент-менеджеры", "SEO-контент-менеджеры"],
    whoAffected: ["Бразильская редакция"],
    whatImproves: ["Объём контента на pt-BR"],
  },
  "HACK-921": {
    oneLiner: "Cursor-скилл превращает черновик новости в эксклюзивный формат ставочных новостей Metaratings.",
    forWhom: ["Спортивные редакторы", "Авторы ставочного контента"],
    whoAffected: ["Редакция"],
    whatImproves: ["Скорость оформления эксклюзивных новостей"],
  },
  "HACK-838": {
    oneLiner: "Бот подсказывает редактору оптимальный H1 и URL для материала прямо в Telegram.",
    forWhom: ["Спортивные редакторы", "SEO-специалисты"],
    whoAffected: ["Редакция"],
    whatImproves: ["SEO-оптимизация заголовков на этапе создания"],
  },
  "HACK-555": {
    oneLiner: "Собирает данные по рекламным креативам Metaratings и формирует ежемесячный отчёт автоматически.",
    forWhom: ["Маркетологи", "Дизайнеры рекламных креативов"],
    whoAffected: ["Отдел маркетинга"],
    whatImproves: ["Скорость подготовки отчётности по рекламе"],
  },
  "HACK-909": {
    oneLiner: "ИИ пишет черновики материалов для CyberMeta, редактор только правит и публикует.",
    forWhom: ["Киберспортивные редакторы"],
    whoAffected: ["Редакция CyberMeta"],
    whatImproves: ["Скорость наполнения CyberMeta контентом"],
  },
  "HACK-264": {
    oneLiner: "Агент автоматически проверяет задачу по QA-плану и сигналит о пропущенных кейсах.",
    forWhom: ["QA-инженеры", "QA-лиды"],
    whoAffected: ["QA-отдел"],
    whatImproves: ["Полнота тестового покрытия задач"],
  },
  "HACK-559": {
    oneLiner: "Из интервью со спикером — готовая новость и видео-сценарий в два клика.",
    forWhom: ["Спортивные журналисты", "Видеопродюсеры"],
    whoAffected: ["Редакция"],
    whatImproves: ["Скорость производства контента из интервью"],
  },
  "HACK-197": {
    oneLiner: "Google Таблица с календарём матчей и прогнозов обновляется автоматически без ручного ввода.",
    forWhom: ["Авторы прогнозов", "Контент-планировщики"],
    whoAffected: ["Редакция прогнозов"],
    whatImproves: ["Актуальность расписания матчей и прогнозов"],
  },
  "HACK-495": {
    oneLiner: "Cursor-скилл подбирает фото спикера, клуба или федерации для обложки материала.",
    forWhom: ["Контент-менеджеры", "Редакторы"],
    whoAffected: ["Редакция"],
    whatImproves: ["Скорость подбора обложек для публикаций"],
  },
  "HACK-204": {
    oneLiner: "Автопилот рекламных кампаний: от медиаплана до креативов и настройки таргетинга.",
    forWhom: ["Маркетологи", "Специалисты по рекламе"],
    whoAffected: ["Отдел маркетинга"],
    whatImproves: ["Скорость запуска рекламных кампаний"],
  },
  "HACK-131": {
    oneLiner: "Генерирует промо-лендинги с бонусами БК через админку Sports Media без верстальщика.",
    forWhom: ["Контент-менеджеры БК", "Маркетологи"],
    whoAffected: ["Отдел монетизации"],
    whatImproves: ["Скорость запуска промо-страниц"],
  },
  "HACK-414": {
    oneLiner: "Сравнивает вакансии на hh.ru с карьерной страницей и сигналит о расхождениях.",
    forWhom: ["HR-рекрутеры", "HR-менеджеры"],
    whoAffected: ["HR-отдел"],
    whatImproves: ["Консистентность описаний вакансий"],
  },
  "HACK-29": {
    oneLiner: "Внутренний сервис благодарностей: скажи «спасибо» коллеге, видно всей компании.",
    forWhom: ["Все сотрудники"],
    whoAffected: ["Все сотрудники"],
    whatImproves: ["Культура признания заслуг внутри компании"],
  },
  "HACK-434": {
    oneLiner: "Автоматически собирает регистрации и FTD из партнёрских API букмекеров в Google Таблицу.",
    forWhom: ["Affiliate-менеджеры", "Аналитики монетизации"],
    whoAffected: ["Отдел монетизации"],
    whatImproves: ["Оперативность сбора партнёрской статистики"],
  },
  "HACK-72": {
    oneLiner: "Настраиваемые напоминания о бизнес-процессах: дедлайны, повторяющиеся задачи, ревью.",
    forWhom: ["Руководители отделов", "Продакт-менеджеры"],
    whoAffected: ["Менеджмент"],
    whatImproves: ["Соблюдение регламентов и дедлайнов"],
  },
  "HACK-95": {
    oneLiner: "Telegram-сигналы проходят скоринг и превращаются в продуктовые гипотезы в Discovery-бэклоге.",
    forWhom: ["Продакт-менеджеры", "Аналитики"],
    whoAffected: ["Продуктовые команды"],
    whatImproves: ["Систематизация входящих продуктовых идей"],
  },
  "HACK-235": {
    oneLiner: "Cursor-скилл проводит нового сотрудника Back Office через онбординг: документы, доступы, гайды.",
    forWhom: ["HR-менеджеры", "Новые сотрудники"],
    whoAffected: ["Back Office"],
    whatImproves: ["Скорость и полнота адаптации новичков"],
  },
  "HACK-160": {
    oneLiner: "Автономный агент мониторит позиции, следит за конкурентами и сам запускает SEO-реагирование.",
    forWhom: ["SEO-стратеги", "SEO-тимлид"],
    whoAffected: ["SEO-отдел"],
    whatImproves: ["Скорость реакции на падение позиций"],
  },
  "HACK-368": {
    oneLiner: "Рынки предсказаний на спортивные события: темы, вероятности, актуальность для контента.",
    forWhom: ["Контент-менеджеры", "Спортивные аналитики"],
    whoAffected: ["Редакция"],
    whatImproves: ["Разнообразие контента для вовлечения аудитории"],
  },
  "HACK-116": {
    oneLiner: "Виджет оценки удовлетворённости на сайте: сбор фидбека, микросервис, алерты в Slack.",
    forWhom: ["Продакт-менеджеры", "UX-дизайнеры"],
    whoAffected: ["Пользователи Metaratings"],
    whatImproves: ["Сбор обратной связи от пользователей сайта"],
  },
  "HACK-205": {
    oneLiner: "Полный цикл от написания текста до индексации в Google — SEO-автоматизация «под ключ».",
    forWhom: ["SEO-контент-менеджеры", "SEO-специалисты"],
    whoAffected: ["SEO-отдел"],
    whatImproves: ["Время от создания контента до попадания в индекс"],
  },
  "HACK-182": {
    oneLiner: "Собирает ключевые идеи из YouTube-видео в компактный дайджест для быстрого ознакомления.",
    forWhom: ["Контент-менеджеры", "Маркетологи"],
    whoAffected: ["Редакция", "Отдел маркетинга"],
    whatImproves: ["Экономия времени при анализе видеоконтента"],
  },
  "HACK-189": {
    oneLiner: "Автоматически проставляет внутренние ссылки между статьями сайта по семантической близости.",
    forWhom: ["SEO-специалисты", "Контент-менеджеры"],
    whoAffected: ["SEO-отдел"],
    whatImproves: ["Глубина внутренней перелинковки сайта"],
  },
  "HACK-88": {
    oneLiner: "Пайплайн гео-отчётов TelecomAsia: данные из GSC → Sheets → email менеджерам → задача в YouTrack.",
    forWhom: ["SEO-менеджеры", "Региональные менеджеры"],
    whoAffected: ["Команда TelecomAsia"],
    whatImproves: ["Автоматизация региональной SEO-отчётности"],
  },
  "HACK-234": {
    oneLiner: "ИИ выбирает, какие тесты запускать при каждом изменении, сокращая время регрессии вдвое.",
    forWhom: ["QA-инженеры", "QA-лиды"],
    whoAffected: ["QA-отдел", "Разработка"],
    whatImproves: ["Скорость регрессионного тестирования"],
  },
  "HACK-34": {
    oneLiner: "Сервис оценки медийных центров: скоринг площадок по метрикам для внутренних нужд.",
    forWhom: ["Аналитики", "Продакт-менеджеры"],
    whoAffected: ["Отдел монетизации"],
    whatImproves: ["Объективность оценки медийных площадок"],
  },
  "HACK-542": {
    oneLiner: "Всё важное из Telegram-алертов и YouTrack-задач — в ежедневном Slack-дайджесте для команды.",
    forWhom: ["Тимлиды", "DevOps-инженеры"],
    whoAffected: ["Техническая команда"],
    whatImproves: ["Централизация уведомлений в одном канале"],
  },
  "HACK-375": {
    oneLiner: "Осьминог Paul 2.0 предсказывает результаты матчей ЧМ-2026 с помощью ИИ и статистики.",
    forWhom: ["Контент-менеджеры", "Маркетологи"],
    whoAffected: ["Читатели Metaratings"],
    whatImproves: ["Виральность и развлекательность контента к ЧМ-2026"],
  },
  "HACK-780": {
    oneLiner: "Cursor-скилл обновляет устаревший контент, подтягивая свежие данные из источников.",
    forWhom: ["Контент-менеджеры", "SEO-редакторы"],
    whoAffected: ["Редакция"],
    whatImproves: ["Актуальность обновляемого контента на сайте"],
  },
  "HACK-460": {
    oneLiner: "Из YAML-конфигурации генерирует расписание смен редакторов в читаемый Markdown.",
    forWhom: ["Главные редакторы", "Шеф-редакторы"],
    whoAffected: ["Редакция"],
    whatImproves: ["Прозрачность расписания дежурств редакции"],
  },
  "HACK-65": {
    oneLiner: "Веб-интерфейс с графиками: как каждое изменение на сайте влияет на ключевые метрики.",
    forWhom: ["SEO-аналитики", "Продакт-менеджеры"],
    whoAffected: ["SEO-отдел", "Продуктовые команды"],
    whatImproves: ["Видимость влияния релизов на трафик"],
  },
  "HACK-22": {
    oneLiner: "Пайплайн превращает CSV из Ahrefs в приоритезированный список страниц для линкбилдинга.",
    forWhom: ["Линкбилдеры", "SEO-стратеги"],
    whoAffected: ["SEO-отдел"],
    whatImproves: ["Приоритизация задач линкбилдинга"],
  },
  "HACK-399": {
    oneLiner: "Автопроверка: сравнивает готовый текст с ТЗ и показывает, что упущено или не соответствует.",
    forWhom: ["Контент-менеджеры", "Корректоры"],
    whoAffected: ["Редакция"],
    whatImproves: ["Соответствие текстов техническому заданию"],
  },
  "HACK-579": {
    oneLiner: "Мониторит разметку GA4-событий на промоссылках к букмекерам и сигналит о поломках.",
    forWhom: ["Аналитики", "Маркетологи"],
    whoAffected: ["Отдел аналитики", "Монетизация"],
    whatImproves: ["Достоверность данных по кликам на букмекеров"],
  },
  "HACK-213": {
    oneLiner: "ИИ создаёт квизы по спортивным новостям, запускает их в браузере и выгружает в админку.",
    forWhom: ["Контент-менеджеры", "Frontend-разработчики"],
    whoAffected: ["Читатели Metaratings"],
    whatImproves: ["Интерактивность и вовлечённость аудитории"],
  },
  "HACK-773": {
    oneLiner: "Автономный конвейер разработки на Django: агенты пишут, тестируют и деплоят код сами.",
    forWhom: ["Backend-разработчики", "Тимлиды"],
    whoAffected: ["Команда разработки"],
    whatImproves: ["Автоматизация рутинных задач разработки"],
  },
  "HACK-765": {
    oneLiner: "Автопостинг спортивных новостей одновременно в Telegram, VK и MAX из одного источника.",
    forWhom: ["SMM-менеджеры", "Контент-менеджеры"],
    whoAffected: ["Отдел маркетинга"],
    whatImproves: ["Охват аудитории в соцсетях"],
  },
  "HACK-720": {
    oneLiner: "LLM дорабатывает черновик прогноза: улучшает аргументацию, добавляет статистику, чистит стиль.",
    forWhom: ["Авторы прогнозов", "Спортивные аналитики"],
    whoAffected: ["Редакция прогнозов"],
    whatImproves: ["Качество и убедительность прогнозов"],
  },
  "HACK-138": {
    oneLiner: "Агент сам находит мелкие проблемы в коде Sports Media и присылает MR с улучшениями.",
    forWhom: ["Backend-разработчики", "Тимлиды"],
    whoAffected: ["Команда разработки"],
    whatImproves: ["Качество кодовой базы Sports Media"],
  },
  "HACK-256": {
    oneLiner: "Slack-алерт → автоматическое досье, черновик задачи в YouTrack и предложение MR.",
    forWhom: ["DevOps-инженеры", "Backend-разработчики"],
    whoAffected: ["Техническая команда"],
    whatImproves: ["Время реакции на инциденты из Slack"],
  },
  "HACK-43": {
    oneLiner: "Программатический генератор SEO-страниц: шаблоны + данные = тысячи оптимизированных страниц.",
    forWhom: ["SEO-специалисты", "Backend-разработчики"],
    whoAffected: ["SEO-отдел"],
    whatImproves: ["Масштаб производства SEO-контента"],
  },
  "HACK-535": {
    oneLiner: "Бот-дежурный для DevOps: триажит HELP-тикеты, определяет приоритет и назначает ответственного.",
    forWhom: ["DevOps-инженеры", "Саппорт-инженеры"],
    whoAffected: ["Техническая команда"],
    whatImproves: ["Скорость обработки DevOps-тикетов"],
  },
  "HACK-488": {
    oneLiner: "Автоматизированный оценщик хакатонных проектов по формальным критериям и чеклистам.",
    forWhom: ["Организаторы хакатона", "Жюри"],
    whoAffected: ["Участники хакатона"],
    whatImproves: ["Объективность и скорость оценки проектов"],
  },
};

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
    return { forWhom: ["HR-менеджеры"], whoAffected: ["Вся компания"], whatImproves: ["HR-процессы"] };
  }
  if (t.includes("pipeline") || t.includes("деплой") || t.includes("ci/cd") || t.includes("docker") || t.includes("aws") || t.includes("инфра") || t.includes("dev-стенд") || t.includes("авто-фикс")) {
    return { forWhom: ["DevOps-инженеры", "Разработчики"], whoAffected: ["Техническая команда"], whatImproves: ["Инфраструктура"] };
  }
  if (t.includes("мониторинг") || t.includes("метрик") || t.includes("дашборд") || t.includes("отчёт") || t.includes("отчет") || t.includes("аналитик") || t.includes("ga4")) {
    return { forWhom: ["Аналитики"], whoAffected: ["Бизнес"], whatImproves: ["Аналитика и отчётность"] };
  }
  if (t.includes("telegram") || t.includes("бот") || (t.includes("slack") && t.includes("алерт"))) {
    return { forWhom: ["Все сотрудники"], whoAffected: ["Все отделы"], whatImproves: ["Автоматизация уведомлений"] };
  }
  if (t.includes("контент") || t.includes("новост") || t.includes("редакт") || t.includes("текст") || t.includes("статей") || t.includes("прогноз") || t.includes("черновик") || t.includes("публикац") || t.includes("видео-сценарий") || t.includes("сценарий")) {
    return { forWhom: ["Редакторы", "Контент-менеджеры"], whoAffected: ["Редакция"], whatImproves: ["Скорость создания контента"] };
  }
  if (t.includes("бэклог") || t.includes("youtrack") || t.includes("задач") || t.includes("спринт") || t.includes("тикет")) {
    return { forWhom: ["Продакт-менеджеры", "Тимлиды"], whoAffected: ["Продуктовые команды"], whatImproves: ["Управление задачами"] };
  }
  if (t.includes("реклам") || t.includes("креатив") || t.includes("кампани") || t.includes("маркетинг") || t.includes("промо")) {
    return { forWhom: ["Маркетологи"], whoAffected: ["Отдел маркетинга"], whatImproves: ["Эффективность рекламы"] };
  }
  if (t.includes("mr ") || t.includes("код") || t.includes("code") || t.includes("gitlab") || t.includes("mcp") || t.includes("api") || t.includes("laravel") || t.includes("django") || t.includes("react")) {
    return { forWhom: ["Разработчики"], whoAffected: ["Техническая команда"], whatImproves: ["Процессы разработки"] };
  }
  if (t.includes("бонус") || t.includes("букмекер") || t.includes("бк") || t.includes("оффер") || t.includes("ставоч") || t.includes("беттинг")) {
    return { forWhom: ["Контент-менеджеры БК"], whoAffected: ["Отдел монетизации"], whatImproves: ["Монетизация и конверсия"] };
  }
  if (t.includes("болельщ") || t.includes("фанат") || t.includes("игра") || t.includes("квиз") || t.includes("осьминог") || t.includes("рынки предсказ")) {
    return { forWhom: ["Продакт-менеджеры"], whoAffected: ["Аудитория сайта"], whatImproves: ["Вовлечённость аудитории"] };
  }
  if (t.includes("домен") || t.includes("траст")) {
    return { forWhom: ["SEO-специалисты", "DevOps-инженеры"], whoAffected: ["SEO-отдел"], whatImproves: ["Управление доменами"] };
  }
  if (t.includes("рейтинг") || t.includes("оценоч") || t.includes("estimation") || t.includes("оценк")) {
    return { forWhom: ["Продакт-менеджеры"], whoAffected: ["Продуктовые команды"], whatImproves: ["Точность оценок"] };
  }

  return { forWhom: ["Все сотрудники"], whoAffected: ["Компания"], whatImproves: ["Автоматизация процессов"] };
}

const DESCRIPTIONS = {
  "HACK-81": "RAG-based Task Estimation анализирует историю похожих тикетов в YouTrack и изменения в кодовой базе, чтобы с помощью RAG-пайплайна предсказать трудозатраты на новую задачу. Продакт-менеджеры и тимлиды получают обоснованные оценки сроков вместо интуитивных догадок.",
  "HACK-521": "HRMS на базе Frappe HR объединяет найм, кадровый учёт, управление отпусками и документооборот в единой платформе с открытым исходным кодом. HR-отдел работает в одном окне вместо десятка разрозненных таблиц, а сотрудники самостоятельно оформляют заявки на отпуск.",
  "HACK-123": "Система мониторит Telegram-каналы в реальном времени, извлекает из постов ключевые факты и формирует черновики новостей для редакции. Редакторы получают готовые заготовки за секунды вместо ручного мониторинга десятков каналов.",
  "HACK-278": "Бот принимает URL опубликованного материала, проверяет текст на соответствие редакционным стандартам и SEO-требованиям, формируя детальный отчёт с замечаниями. Контент-редакторы видят проблемы до того, как их заметит читатель.",
  "HACK-196": "SEO Site Classifier анализирует мета-теги, структуру и контент сайтов, классифицируя их на продуктовые и информационные ресурсы. Линкбилдеры мгновенно фильтруют тысячи доноров для ссылочного продвижения без ручного просмотра.",
  "HACK-502": "Сервис ежедневно собирает снапшоты поисковых позиций конкурентов и формирует сводный отчёт с трендами и аномалиями. SEO-команда оперативно реагирует на действия конкурентов без ручного сбора данных.",
  "HACK-78": "MetaRatings.by отслеживает публикации белорусских спортивных медиа через RSS, генерирует SMM-подписи и проверяет эксклюзивность материалов. Белорусская редакция первой узнаёт о публикациях конкурентов и защищает уникальный контент.",
  "HACK-982": "Telegram-бот отслеживает завершение матчей и мгновенно отправляет в чат статистику бомбардиров и ассистентов с разбивкой по командам. Спортивные редакторы публикуют послематчевую статистику за секунды.",
  "HACK-452": "IdeaHub собирает продуктовые идеи из Slack и Cursor, дедуплицирует предложения и выкладывает на интерактивную витрину с рейтингом. Ни одна идея не теряется в потоке сообщений, а команда видит полную картину предложений.",
  "HACK-592": "Музей памяти Metaratings хранит ключевые события, мемы, фото и вехи истории компании в структурированном архиве с хронологией и тегами. Новые сотрудники быстрее погружаются в культуру, а старожилы сохраняют коллективную память.",
  "HACK-249": "AI Toolbox предоставляет набор контекстных правил, скиллов и инструментов для разработки на Laravel и GraphQL прямо в Cursor с учётом архитектуры Sports Media. Разработчики SFE пишут код быстрее, опираясь на встроенные паттерны проекта.",
  "HACK-438": "Система рейтингов БК включает методологию оценки букмекеров, мини-сервис расчёта рейтингов, симуляцию сценариев и Cursor-скиллы для работы с данными. Аналитики получают объективный и воспроизводимый рейтинг вместо субъективных оценок.",
  "HACK-57": "Платформа для создания ИИ-сотрудников с настраиваемыми ролями, а автономный AI Project Manager координирует их работу и контролирует выполнение. Команды масштабируют рутинные процессы без найма, а ИИ-менеджер снижает нагрузку на руководителей.",
  "HACK-857": "TWLF.ai — 12-й Игрок — ИИ-компаньон для футбольных болельщиков: анализирует статистику команд, историю встреч и коэффициенты, выдавая персонализированные сводки. Болельщики принимают информированные решения, а контент вовлекает аудиторию в интерактивный формат.",
  "HACK-152": "Pipeline Failure Collector собирает данные о падениях CI/CD-пайплайнов из GitLab, группирует по типу ошибки и визуализирует проблемные зоны. DevOps видит системные проблемы вместо разрозненных алертов и приоритезирует фиксы по импакту.",
  "HACK-382": "Агент анализирует входящие сообщения от вебмастеров, классифицирует запросы и генерирует релевантные ответы с учётом политик и истории переписки. Линкбилдеры обрабатывают в разы больше обращений за тот же срок.",
  "HACK-975": "Metaratings Sponsor Project Builder анализирует бриф от рекламодателя, подбирает площадки и форматы, собирая коммерческое предложение в готовом документе. Менеджеры по продажам формируют персонализированные КП за минуты вместо часов.",
  "HACK-130": "Domain Agent управляет сотнями корпоративных доменов: отслеживает продление, мониторит DNS, выявляет аномалии и уведомляет о предстоящих событиях. Компания исключает риск потери домена и держит DNS-конфигурацию под контролем.",
  "HACK-167": "Backlog Groomer выявляет устаревшие, дублирующиеся и заброшенные задачи в YouTrack и предлагает их закрыть или переприоритезировать. Продакт-менеджеры поддерживают чистый бэклог без многочасовых сессий ручного груминга.",
  "HACK-206": "FS Monitor сравнивает позиции из Seometrics с реальными результатами в браузере и создаёт задачи в YouTrack при расхождениях. SEO-команда узнаёт о некорректных данных мониторинга и реагирует на просадки.",
  "HACK-606": "Сервис расчёта отыгрыша бонуса принимает параметры бонусной программы и рассчитывает оптимальную стратегию с визуализацией сценариев. Контент-менеджеры дают читателям точные рекомендации по бонусам вместо общих формулировок.",
  "HACK-690": "Интерактивный дашборд «Дерево метрик» визуализирует иерархию от стратегических KPI до атомарных показателей с drill-down и цветовой индикацией. Руководители видят, какие метрики влияют на бизнес-результат, и точечно управляют приоритетами.",
  "HACK-406": "Еженедельный HR-отчёт собирает данные из Huntflow, Google Calendar и YouTrack, компонуя единый документ. HR-менеджеры получают готовый отчёт без ручного сбора информации из трёх систем.",
  "HACK-390": "SEO Knowledge Base обеспечивает двустороннюю синхронизацию между статьями в YouTrack и Git-репозиторием с историей изменений. SEO-специалисты работают в привычной среде, а знания всегда актуальны и версионированы.",
  "HACK-740": "Робот автоматически делает скриншоты бонусных страниц по расписанию и собирает архив для партнёрской отчётности. Менеджеры получают доказательства размещения без ручного обхода десятков сайтов.",
  "HACK-964": "Пайплайн генерирует контент о киберспортивных событиях на основе статистики и публикует через Sports Media Admin API. Редакция CyberMeta поддерживает высокий темп публикаций без увеличения штата.",
  "HACK-481": "Витрина персональных офферов формирует виджет с наиболее релевантными бонусами букмекеров для каждого пользователя. Конверсия растёт за счёт точного таргетинга вместо одинаковых баннеров для всех.",
  "HACK-613": "Бонус-чат — Cursor-скилл для анализа логов бонусного чата и отправки алертов в Slack при обнаружении аномалий. Поддержка реагирует на проблемы проактивно, а не после жалоб пользователей.",
  "HACK-792": "Сервис анализирует спортивную новость, определяет темы, оценивает качество лида и предлагает каналы дистрибуции. Редакторы получают структурированную обратную связь и рекомендации по продвижению до публикации.",
  "HACK-474": "SEO-видео превращает статьи с сайтов Meta в короткие видеосценарии с раскадровкой и ключевыми кадрами. Контент-команда масштабирует производство видео, переиспользуя текстовый контент.",
  "HACK-934": "Шаблон прогнозов MetaRatings генерирует структурированные заготовки с актуальными коэффициентами, статистикой команд и историей встреч. Авторы прогнозов получают шаблон с данными, сокращая подготовку с часа до минут.",
  "HACK-145": "MR Analyzer проверяет GitLab Merge Request на стандарты кода, тесты и описание изменений, публикуя отчёт в MR. Ревьюеры экономят время на рутинных проверках и фокусируются на логике и архитектуре.",
  "HACK-242": "Pochtalyon каждое утро собирает непрочитанное из Slack, почты, YouTrack и Calendar, компонуя дайджест в Slack DM. Сотрудник начинает день с полной картины без переключения между инструментами.",
  "HACK-50": "Топ-10 — мини-игра, где спортивные болельщики угадывают состав топ-10 лучших игроков или команд, соревнуясь друг с другом. Проект вовлекает аудиторию Metaratings в интерактивный формат.",
  "HACK-181": "YouTrack → Allure TestOps вытягивает баги, проверяет покрытие, генерирует тест-кейсы и отправляет отчёт в Slack. QA-команда систематически закрывает пробелы в покрытии вместо ручного поиска.",
  "HACK-614": "Скилл «Отпуск» в Cursor показывает остаток отпускных дней, историю использования и запланированные периоды из единого источника. Сотрудники и руководители получают актуальную информацию без запросов в HR.",
  "HACK-754": "Bots Audit Tool анализирует логи ботов, выявляет частые ошибки и узкие места, формируя приоритизированный бэклог доработок. Команда фокусируется на критичных проблемах вместо ручного разбора логов.",
  "HACK-271": "Сервис генерирует изображения для событийного контента на основе данных о матче или турнире с QA-проверкой. Редакция получает готовые обложки без дизайнера, ускоряя публикацию.",
  "HACK-846": "Школа беттинга Metaratings — геймифицированная платформа с уроками, квизами, XP-системой и маскотами, обучающая основам ставок. Пользователи проходят обучение в игровой форме, повышая грамотность и лояльность к бренду.",
  "HACK-459": "Траст-метр проверяет домены букмекеров и казино по техническим, юридическим и репутационным сигналам, формируя скоринг. Аналитики быстро оценивают надёжность партнёра перед размещением рекомендации.",
  "HACK-526": "Post-release мониторинг запускает Lighthouse-аудит ключевых URL после деплоя, сравнивает с прошлой неделей и сигнализирует о регрессиях. Разработчики ловят просадки сразу после релиза, а не из жалоб пользователей.",
  "HACK-15": "MCP-сервис для Sports Media оборачивает Laravel Admin API в 50+ MCP-инструментов для управления контентом из Cursor. Разработчики и редакторы управляют Sports Media без переключения в админку.",
  "HACK-8": "Автономный агент мониторит логи, классифицирует ошибки, создаёт тикеты и предлагает фикс через Merge Request. Время от бага в логах до исправления сокращается с часов до минут без участия дежурного.",
  "HACK-109": "Помощник обрабатывает входящие письма с результатами конкурсов и автоматически обновляет сводные Google-таблицы. Менеджеры конкурсов избавляются от ручного копирования данных из десятков писем.",
  "HACK-747": "Dispatch Agent синхронизирует рабочий контекст между Slack, YouTrack и календарём, отслеживает изменения и подсказывает приоритеты. Сотрудник всегда в курсе статуса задач без переключения между инструментами.",
  "HACK-801": "WoWScore — мобильное приложение на React и Capacitor с WinScore API для спортивных прогнозов, рейтингов и live-данных. Болельщики получают нативный мобильный доступ к аналитике матчей.",
  "HACK-1": "AI Associate Template — готовый шаблон для развёртывания автономных ИИ-агентов в AWS с преднастроенной инфраструктурой и мониторингом. Команды запускают нового ИИ-сотрудника за минуты, не тратя недели на настройку с нуля.",
  "HACK-656": "Тренд-чекер собирает данные о медиатрендах из соцсетей и новостных агрегаторов, рассчитывает «метр хайпа» и доставляет дайджест в Telegram. Редакция выбирает темы на основе реальных данных о востребованности.",
  "HACK-941": "CyberMeta Streamline — публичный календарь релизов аниме, игр и медиа-событий с автоматическим обновлением из открытых источников. Редакция планирует контент-план вокруг актуальных релизов без ручного мониторинга.",
  "HACK-808": "Автономная AI-среда интегрирует Linear с Cursor-агентами: ИИ берёт задачи из бэклога, выполняет и отчитывается о статусе. Агенты закрывают рутинные задачи автономно в AI-friendly delivery-процессе.",
  "HACK-102": "AI QA Workflow Assistant проверяет контент Sports Media по чек-листу: орфографию, SEO-теги, мета-описания и форматирование. Материалы выходят с меньшим числом ошибок, а QA занимает секунды.",
  "HACK-467": "SEO Health Monitor еженедельно сканирует 200+ URL на девяти сайтах, проверяя мета-теги, скорость и битые ссылки, выявляя регрессии. SEO-команда получает единый отчёт и чинит проблемы до падения позиций.",
  "HACK-383": "Agent Swarm запускает обслуживающих агентов при приближении к лимитам ИИ-квоты: агенты выполняют задачи до истечения периода. Компания утилизирует оплаченные ресурсы на 100% вместо потери квоты.",
  "HACK-174": "PBN линк-чекер проверяет аптайм сайтов сети, наличие размещённых ссылок и их корректность. SEO-команда мгновенно узнаёт о слетевших ссылках и упавших сайтах, защищая ссылочный профиль.",
  "HACK-949": "Агрегатор собирает RSS казахстанских спортивных СМИ, фильтрует новости по видам спорта и формирует единую ленту с дедупликацией. Редакция MetaRatings.kz отслеживает повестку из одного окна.",
  "HACK-956": "Telegram-бот принимает аудио- и видеофайлы, расшифровывает через Google Gemini и возвращает текст прямо в чат. Редакторы мгновенно получают расшифровки интервью и совещаний без ручного набора.",
  "HACK-642": "Palpite вычитывает черновики на португальском в Google Docs через Cursor: грамматика, стиль, SEO и фактология. Авторы бразильской редакции получают вычитанный текст без привлечения корректора.",
  "HACK-514": "Автодеплой env парсит Deploy Notes из MR и автоматически создаёт MR на обновление конфигурации dev-стенда. Разработчики не забывают про env-переменные, а настройка стенда происходит автоматически.",
  "HACK-675": "Сервис берёт SEO-шаблон матча, обогащает статистикой через API и формирует экспертный киберспортивный прогноз с помощью ИИ. Редакция масштабирует производство прогнозов без увеличения штата аналитиков.",
  "HACK-861": "Оркестр доменных агентов анализирует задачи PBR в YouTrack: каждый агент-эксперт добавляет уточняющие вопросы из своего домена. Команда приходит на PBR с готовым списком вопросов, сокращая время обсуждения.",
  "HACK-58": "Система проверяет календарь отпусков при назначении задач и предупреждает, если исполнитель в отпуске или скоро уйдёт. Задачи не зависают на отсутствующих, а руководители учитывают доступность команды.",
  "HACK-220": "Telegram-бот проверяет текст новости на орфографические, пунктуационные и стилистические ошибки, возвращая исправленную версию. Редакторы правят тексты на ходу с телефона без привлечения корректора.",
  "HACK-227": "Сервис ежедневно сравнивает бонусы на MetaRatings.tj с акциями конкурентов, формируя отчёт с расхождениями. Контент-менеджеры оперативно обновляют устаревшие бонусы.",
  "HACK-874": "Brazuca AI-Editor генерирует прогнозы на португальском, анализируя статистику команд и текущую форму через OpenAI. Бразильская редакция получает готовые черновики, адаптированные под локальный стиль pt-BR.",
  "HACK-921": "Сервис адаптирует черновики ставочных новостей к эксклюзивному формату Metaratings, обогащая коэффициентами и аналитикой. Редакторы превращают стандартную новость в уникальный материал за минуты.",
  "HACK-838": "Telegram-бот выдаёт оптимальные H1-заголовки и URL-slug для статей на основе SEO-анализа темы и конкурентов. Редакторы получают SEO-оптимизированные заголовки прямо в Telegram.",
  "HACK-555": "Система собирает данные о рекламных креативах, проверяет маркировку ERID и формирует ежемесячный compliance-отчёт. Маркетологи и юристы получают готовый отчёт без обхода сотен креативов.",
  "HACK-909": "ИИ-автор генерирует контент о киберспортивных событиях на основе актуальных данных и статистики, формируя структурированные черновики. Редакция CyberMeta поддерживает поток публикаций без увеличения авторского состава.",
  "HACK-264": "QA Watcher Agent анализирует новые задачи в YouTrack, сопоставляет с тест-планом и сигнализирует о пробелах в покрытии. QA-инженеры видят незакрытые сценарии при попадании задачи в спринт, а не после релиза.",
  "HACK-559": "Сервис берёт записанное интервью, извлекает тезисы и генерирует новостную статью и видеосценарий с таймингами. Редакция получает два формата контента из одного интервью без двойной работы.",
  "HACK-197": "Календарь матчей обновляет Google Sheets с расписанием, подтягивая коэффициенты из WinScore API в реальном времени. Авторы прогнозов видят актуальное расписание с котировками в одной таблице.",
  "HACK-495": "Скилл фото для обложек находит изображения спикеров, клубов и спортсменов для статей через Telegram-бот и Cursor. Редакторы тратят секунды на подбор обложки вместо поиска в фотобанках.",
  "HACK-204": "Ad Campaign Autopilot принимает рекламный бриф и генерирует пакеты материалов под каждый канал: тексты, баннеры, UTM-метки. Маркетологи запускают мультиканальные кампании быстрее из одного брифа.",
  "HACK-131": "Генератор промо-лендингов позволяет менеджерам создавать промо-страницы с бонусами в админке Sports Media через визуальный конструктор. Запуск промо-акции сокращается с дней до часов без участия разработчиков.",
  "HACK-414": "Сервис ежедневно сравнивает вакансии на hh.ru с позициями на корпоративном сайте, выявляя расхождения. HR всегда уверен, что все площадки актуальны, а кандидаты видят одинаковый список вакансий.",
  "HACK-29": "Props — внутреннее приложение для публичной благодарности коллегам за помощь, инициативу и вклад. Культура признания укрепляется, а руководители видят неформальных лидеров и активных участников.",
  "HACK-434": "Автосбор regs/FTD подключается к партнёрским API букмекеров и записывает метрики регистраций и депозитов в Google Sheets по расписанию. Менеджеры получают актуальные отчёты без ежедневного экспорта из десятка кабинетов.",
  "HACK-72": "Кастомные напоминалки формируют триггерные уведомления в Slack на основе событий из YouTrack и GitLab. Команды не пропускают критичные события, а уведомления настраиваются без разработчиков.",
  "HACK-95": "Discovery-пайплайн парсит Telegram-каналы с SEO-сигналами, скорит возможности и создаёт тикеты в Discovery Backlog. SEO-команда получает приоритизированный поток идей без ручного мониторинга каналов.",
  "HACK-235": "Онбординг Back Office собирает Cursor-скиллы, чек-листы и справочные материалы для новых сотрудников в единый пакет. Новички адаптируются быстрее, а наставники тратят меньше времени на инструктажи.",
  "HACK-160": "SEO Sentinel мониторит позиции, действия конкурентов и технические метрики, генерируя алерты при аномалиях. SEO-команда реагирует на изменения в выдаче раньше, чем проблема повлияет на трафик.",
  "HACK-368": "Рынки предсказаний — демо-приложение с бинарными рынками на спортивные события, виртуальной валютой и механикой ставок. Проект демонстрирует концепцию prediction market для вовлечения аудитории.",
  "HACK-116": "CSAT Metaratings включает виджет обратной связи на сайте, микросервис сбора оценок и Slack-алерты о негативных отзывах. Команда измеряет удовлетворённость в реальном времени и реагирует на проблемы.",
  "HACK-205": "Zero to Live автоматизирует полный SEO-цикл: от генерации текста до публикации и отправки в Google на индексацию. Контент появляется в выдаче максимально быстро как конвейер.",
  "HACK-182": "InsightsTube ежедневно мониторит YouTube-каналы и плейлисты, извлекает идеи из субтитров и доставляет структурированный дайджест в Telegram. Команда получает поток свежих идей без ручного просмотра видео.",
  "HACK-189": "Сервис анализирует контент сайтов, находит релевантные связи между статьями и расставляет внутренние ссылки. SEO-показатели улучшаются за счёт усиления ссылочной структуры без ручной перелинковки.",
  "HACK-88": "Гео-отчёты TelecomAsia забирают данные из Google Search Console, агрегируют в Sheets и рассылают дайджесты по email и Slack. Команда отслеживает SEO по каждому гео без ручного экспорта.",
  "HACK-234": "Smart Regression System определяет, какие тесты запускать при каждом изменении, анализируя граф зависимостей и историю падений. QA сокращает время прогона без потери покрытия, ускоряя релизы.",
  "HACK-34": "Оценочный сервис для МЦ собирает статистику игроков, рассчитывает рейтинги и строит прогнозы развития футболистов. Тренеры принимают решения на основе объективных данных, а не только визуальных наблюдений.",
  "HACK-542": "Дайджест алертов собирает DevOps-алерты из Telegram и задачи из YouTrack в единый утренний дайджест в Slack. Дежурные начинают смену с полной картины проблем без переключения между мессенджерами.",
  "HACK-375": "Paul 2.0 — Осьминог-предсказатель ЧМ-2026 — PWA с маскотом-осьминогом, предсказывающим результаты матчей, и турнирной сеткой для болельщиков. Фан-проект привлекает аудиторию к чемпионату мира через игровую механику.",
  "HACK-780": "Скилл ежедневно парсит спортивные ленты, выявляет обновления по темам статей и формирует рекомендации по актуализации в Cursor. Редакция поддерживает evergreen-контент актуальным без ручного мониторинга.",
  "HACK-460": "Автоматическое расписание смен генерирует Markdown-таблицу из YAML-конфигурации с учётом ограничений сотрудников. Главный редактор создаёт расписание за минуту вместо ручного согласования.",
  "HACK-65": "Impact Site Changes — веб-интерфейс с графиками динамики регистраций и FTD по сайтам и партнёрам. Менеджеры видят влияние изменений на конверсию в реальном времени.",
  "HACK-22": "Пайплайн Ahrefs CSV → SERP загружает выгрузки, анализирует конкурентные данные и формирует приоритизированную очередь для линкбилдинга. SEO-команда фокусирует ресурсы на самых перспективных возможностях.",
  "HACK-399": "TZChecker сравнивает готовый контент с исходным ТЗ, выявляя несоответствия и пропущенные требования. Качество материалов соответствует ТЗ с первого раза без ручной сверки.",
  "HACK-579": "Мониторинг GA4 click_on_bk_web аудитит разметку кликов по промо-ссылкам букмекеров на корректность тегов. Аналитики находят проблемы в трекинге, не теряя данные о конверсиях.",
  "HACK-213": "Сервис генерирует интерактивные квизы из спортивных новостей, доступные для прохождения в браузере. Аудитория вовлекается через игровую механику, увеличивая время на сайте.",
  "HACK-773": "Django Unchained — пайплайн, где Cursor-агенты проектируют, кодят, тестируют и деплоят фичи для Django-проектов. Разработчики делегируют рутину агентам и фокусируются на архитектуре.",
  "HACK-765": "Автопостинг публикует новости из CMS в Telegram, VK и MAX с адаптацией формата под каждую платформу. SMM поддерживает активность во всех соцсетях без ручного копирования.",
  "HACK-720": "AI Forecast Editor уточняет спортивные прогнозы через LLM, улучшая структуру и стиль без добавления фактов. Авторы получают текст издательского качества без риска фактологических ошибок.",
  "HACK-138": "Автономный агент сканирует кодовую базу Sports Media, находит мелкие проблемы и создаёт MR с исправлениями. Технический долг сокращается непрерывно без выделения времени разработчиков.",
  "HACK-256": "Slack Alert Triage Agent расследует алерты: определяет причину, создаёт задачу в YouTrack и предлагает MR с исправлением. Дежурный получает готовый анализ и решение вместо сырого алерта.",
  "HACK-43": "Sports Content Engine подтягивает live-данные матчей, генерирует SEO-превью и публикует через Laravel-админку. Редакция получает контент о матчах в реальном времени без ручного набора.",
  "HACK-535": "Duty-bot анализирует HELP-тикеты DevOps, классифицирует проблемы и предлагает решения из базы знаний. Инженеры обрабатывают тикеты быстрее, получая контекст и рекомендации автоматически.",
  "HACK-488": "Hackathon Assessor — сервис автоматической оценки проектов хакатона по формализованным критериям: документация, работоспособность и соответствие теме. Жюри получает предварительные скоринги, экономя время на первичном анализе.",
};

const projects = raw
  .filter((p) => !EXCLUDE_IDS.has(p.id))
  .map((p) => {
    const title = cleanTitle(p.summary);
    const override = MANUAL_OVERRIDES[p.id];
    const cat = override || classify(title);
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
      oneLiner: DESCRIPTIONS[p.id] || (override ? override.oneLiner : title),
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
