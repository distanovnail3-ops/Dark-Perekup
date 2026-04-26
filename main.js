"use strict";

/*
  Место для подключения Yandex Games SDK.
  Позже сюда можно добавить:
  YaGames.init().then(ysdk => { window.ysdk = ysdk; ... });
  Сохранения localStorage ниже вынесены в отдельные функции, чтобы заменить их
  на облачные сохранения SDK без переписывания игровой логики.
*/

const STORAGE_KEY = "shadowDealerEmpireSaveV1";
const AUTOSAVE_MS = 4000;
const LAST_DEAL_BONUS_MS = 45000;
const FAILED_DEAL_SAVE_MS = 30000;

const itemCatalog = [
  {
    id: "phone",
    name: "Старый телефон",
    rarity: "common",
    rarityName: "Обычный",
    minGarage: 1,
    cost: 75,
    value: 112,
    repair: 3600,
    weight: 34,
    image: "./assets/item-phone.svg"
  },
  {
    id: "vcr",
    name: "Видеомагнитофон",
    rarity: "common",
    rarityName: "Обычный",
    minGarage: 1,
    cost: 120,
    value: 182,
    repair: 4300,
    weight: 28,
    image: "./assets/item-vcr.svg"
  },
  {
    id: "tv",
    name: "Советский телевизор",
    rarity: "uncommon",
    rarityName: "Необычный",
    minGarage: 1,
    cost: 210,
    value: 330,
    repair: 5400,
    weight: 18,
    image: "./assets/item-tv.svg"
  },
  {
    id: "tapeplayer",
    name: "Кассетный плеер",
    rarity: "common",
    rarityName: "Обычный",
    minGarage: 1,
    cost: 155,
    value: 248,
    repair: 4700,
    weight: 21,
    image: "./assets/item-tapeplayer.svg"
  },
  {
    id: "toolbox",
    name: "Электроинструмент",
    rarity: "uncommon",
    rarityName: "Необычный",
    minGarage: 1,
    cost: 285,
    value: 455,
    repair: 5600,
    weight: 16,
    image: "./assets/item-toolbox.svg"
  },
  {
    id: "console",
    name: "Редкая приставка",
    rarity: "rare",
    rarityName: "Редкий",
    minGarage: 2,
    cost: 520,
    value: 870,
    repair: 6500,
    weight: 12,
    collection: true,
    image: "./assets/item-console.svg"
  },
  {
    id: "laptop",
    name: "Ноутбук с барахолки",
    rarity: "uncommon",
    rarityName: "Необычный",
    minGarage: 2,
    cost: 720,
    value: 1120,
    repair: 7200,
    weight: 14,
    image: "./assets/item-laptop.svg"
  },
  {
    id: "camera",
    name: "Пленочная камера",
    rarity: "rare",
    rarityName: "Редкий",
    minGarage: 2,
    cost: 890,
    value: 1480,
    repair: 7600,
    weight: 10,
    collection: true,
    image: "./assets/item-camera.svg"
  },
  {
    id: "lamp",
    name: "Антикварная лампа",
    rarity: "rare",
    rarityName: "Редкий",
    minGarage: 2,
    cost: 1120,
    value: 1900,
    repair: 8000,
    weight: 8,
    collection: true,
    image: "./assets/item-lamp.svg"
  },
  {
    id: "watch",
    name: "Коллекционные часы",
    rarity: "rare",
    rarityName: "Редкий",
    minGarage: 3,
    cost: 1350,
    value: 2240,
    repair: 8200,
    weight: 9,
    collection: true,
    image: "./assets/item-watch.svg"
  },
  {
    id: "drone",
    name: "Дрон с распродажи",
    rarity: "rare",
    rarityName: "Редкий",
    minGarage: 3,
    cost: 1850,
    value: 3150,
    repair: 9000,
    weight: 7,
    image: "./assets/item-drone.svg"
  },
  {
    id: "synth",
    name: "Ретро-синтезатор",
    rarity: "epic",
    rarityName: "Эпический",
    minGarage: 3,
    cost: 2400,
    value: 4300,
    repair: 9800,
    weight: 6,
    collection: true,
    image: "./assets/item-synth.svg"
  },
  {
    id: "arcade",
    name: "Игровой автомат",
    rarity: "epic",
    rarityName: "Эпический",
    minGarage: 3,
    cost: 4100,
    value: 7200,
    repair: 11200,
    weight: 4,
    collection: true,
    image: "./assets/item-arcade.svg"
  },
  {
    id: "car",
    name: "Старый автомобиль",
    rarity: "epic",
    rarityName: "Эпический",
    minGarage: 3,
    cost: 3150,
    value: 5350,
    repair: 10500,
    weight: 6,
    collection: true,
    image: "./assets/item-car.svg"
  },
  {
    id: "case",
    name: "Загадочный чемодан",
    rarity: "epic",
    rarityName: "Эпический",
    minGarage: 4,
    cost: 5200,
    value: 9300,
    repair: 11800,
    weight: 5,
    collection: true,
    image: "./assets/item-case.svg"
  },
  {
    id: "moto",
    name: "Винтажный мотоцикл",
    rarity: "epic",
    rarityName: "Эпический",
    minGarage: 4,
    cost: 6900,
    value: 12100,
    repair: 12800,
    weight: 4,
    collection: true,
    image: "./assets/item-moto.svg"
  },
  {
    id: "amberbox",
    name: "Янтарная шкатулка",
    rarity: "legendary",
    rarityName: "Легендарный",
    minGarage: 4,
    cost: 10400,
    value: 20500,
    repair: 14200,
    weight: 2,
    collection: true,
    image: "./assets/item-amberbox.svg"
  },
  {
    id: "samovar",
    name: "Золотой самовар",
    rarity: "legendary",
    rarityName: "Легендарный",
    minGarage: 4,
    cost: 8800,
    value: 16800,
    repair: 13500,
    weight: 3,
    collection: true,
    image: "./assets/item-samovar.svg"
  },
  {
    id: "meteor",
    name: "Метеоритный кулон",
    rarity: "legendary",
    rarityName: "Легендарный",
    minGarage: 5,
    cost: 12800,
    value: 26500,
    repair: 14800,
    weight: 2,
    collection: true,
    image: "./assets/item-meteor.svg"
  },
  {
    id: "gramophone",
    name: "Серебряный граммофон",
    rarity: "rare",
    rarityName: "Редкий",
    minGarage: 2,
    cost: 1600,
    value: 2850,
    repair: 8800,
    weight: 7,
    collection: true,
    image: "./assets/item-gramophone.svg"
  },
  {
    id: "toycrane",
    name: "Неоновый автомат с игрушками",
    rarity: "epic",
    rarityName: "Эпический",
    minGarage: 3,
    cost: 5600,
    value: 9900,
    repair: 12400,
    weight: 4,
    collection: true,
    image: "./assets/item-toycrane.svg"
  },
  {
    id: "server",
    name: "Секретный сервер",
    rarity: "epic",
    rarityName: "Эпический",
    minGarage: 4,
    cost: 11800,
    value: 22400,
    repair: 14600,
    weight: 3,
    image: "./assets/item-server.svg"
  },
  {
    id: "painting",
    name: "Картина из закрытого клуба",
    rarity: "legendary",
    rarityName: "Легендарный",
    minGarage: 4,
    cost: 18600,
    value: 38600,
    repair: 15800,
    weight: 2,
    collection: true,
    image: "./assets/item-painting.svg"
  },
  {
    id: "prototype",
    name: "Капсула с прототипом",
    rarity: "legendary",
    rarityName: "Легендарный",
    minGarage: 5,
    cost: 26000,
    value: 59000,
    repair: 17800,
    weight: 1,
    collection: true,
    image: "./assets/item-prototype.svg"
  },
  {
    id: "container",
    name: "Частный контейнер",
    rarity: "legendary",
    rarityName: "Легендарный",
    minGarage: 5,
    cost: 42000,
    value: 98000,
    repair: 20500,
    weight: 1,
    collection: true,
    image: "./assets/item-container.svg"
  },
  {
    id: "artifact",
    name: "Легендарный артефакт",
    rarity: "legendary",
    rarityName: "Легендарный",
    minGarage: 5,
    cost: 15500,
    value: 33000,
    repair: 15500,
    weight: 1,
    collection: true,
    image: "./assets/item-artifact.svg"
  }
];

const collectionItems = itemCatalog.filter((item) => item.collection);

const dealConfigs = {
  safe: {
    title: "Безопасная",
    duration: 3300,
    saleMultiplier: 0.96,
    success: 0.97,
    rep: 1,
    salvage: 0.82
  },
  risky: {
    title: "Рискованная",
    duration: 5200,
    saleMultiplier: 1.24,
    success: 0.72,
    rep: 3,
    salvage: 0.38
  },
  legendary: {
    title: "Легендарная",
    duration: 7600,
    saleMultiplier: 1.78,
    success: 0.45,
    rep: 7,
    salvage: 0.12
  }
};

const upgradeDefs = [
  {
    id: "repairSpeed",
    title: "Скорость ремонта",
    desc: "Ремонт быстрее на 7% за уровень.",
    baseCost: 130,
    max: 10
  },
  {
    id: "dealChance",
    title: "Шанс сделки",
    desc: "Успех любой сделки выше на 3%.",
    baseCost: 190,
    max: 8
  },
  {
    id: "saleProfit",
    title: "Прибыль продажи",
    desc: "Продажи приносят на 5% больше прибыли.",
    baseCost: 240,
    max: 10
  },
  {
    id: "capacity",
    title: "Вместимость гаража",
    desc: "Больше мест для странных товаров.",
    baseCost: 280,
    max: 6
  },
  {
    id: "helpers",
    title: "Помощники",
    desc: "Дают автоматический доход каждую секунду.",
    baseCost: 360,
    max: 8
  },
  {
    id: "autoDealer",
    title: "Автосделочник",
    desc: "Сам ускоряет ремонт и продает готовые товары.",
    baseCost: 980,
    max: 3
  },
  {
    id: "rareSearch",
    title: "Поиск редкостей",
    desc: "Выше шанс найти коллекционный предмет.",
    baseCost: 520,
    max: 7
  },
  {
    id: "dealShield",
    title: "Защита сделки",
    desc: "Иногда смягчает провал сделки.",
    baseCost: 760,
    max: 5
  },
  {
    id: "purchaseDiscount",
    title: "Жёсткий торг",
    desc: "Закупка товаров дешевле на 3% за уровень.",
    baseCost: 1200,
    max: 8
  },
  {
    id: "marketInsight",
    title: "Рыночные связи",
    desc: "Анализ рынка дешевле и держится дольше.",
    baseCost: 1650,
    max: 6
  },
  {
    id: "vipBuyers",
    title: "VIP-покупатели",
    desc: "Дорогие клиенты повышают цену и шанс сделки.",
    baseCost: 2400,
    max: 7
  },
  {
    id: "casinoEdge",
    title: "Клубные связи",
    desc: "Чуть улучшает выплаты мини-казино.",
    baseCost: 3200,
    max: 5
  },
  {
    id: "warehouseNetwork",
    title: "Сеть складов",
    desc: "Больше мест и выше автодоход от бизнеса.",
    baseCost: 5200,
    max: 6
  },
  {
    id: "autoSaveDeal",
    title: "Автоспасение сделки",
    desc: "После покупки проваленная сделка спасается автоматически.",
    baseCost: 200000,
    max: 1
  }
];

const garageRequirements = {
  1: { money: 900, reputation: 8 },
  2: { money: 2600, reputation: 26 },
  3: { money: 7600, reputation: 70 },
  4: { money: 19000, reputation: 150 }
};

const marketNames = [
  "Гаражный круг",
  "Пыльный развал",
  "Ночной павильон",
  "Аукцион чудес",
  "Империя сделок"
];

const warehouses = [
  { level: 1, icon: "▣", title: "Гаражный бокс", desc: "Ручной ремонт, первые покупатели.", tag: "старт" },
  { level: 2, icon: "▤", title: "Подвальный склад", desc: "Больше места и поток мелких лотов.", tag: "район" },
  { level: 3, icon: "▥", title: "Ночной павильон", desc: "Сюда несут редкие вещи и технику.", tag: "рынок" },
  { level: 4, icon: "▧", title: "Закрытый аукцион", desc: "Дорогие сделки и осторожные клиенты.", tag: "элита" },
  { level: 5, icon: "▨", title: "Штаб империи", desc: "Сеть складов, команда и легендарные лоты.", tag: "империя" }
];

const crewRoles = [
  { id: "tech", name: "Техник", req: () => getUpgradeLevel("repairSpeed") > 0, desc: "ускоряет ремонт" },
  { id: "scout", name: "Искатель", req: () => getUpgradeLevel("rareSearch") > 0, desc: "ищет редкости" },
  { id: "seller", name: "Продавец", req: () => getUpgradeLevel("saleProfit") > 0, desc: "торгуется дороже" },
  { id: "guard", name: "Охранник", req: () => getUpgradeLevel("dealShield") > 0, desc: "снижает провалы" },
  { id: "courier", name: "Курьер", req: () => getUpgradeLevel("helpers") > 0, desc: "несет автодоход" },
  { id: "manager", name: "Автосделочник", req: () => getUpgradeLevel("autoDealer") > 0, desc: "сам продает товары" },
  { id: "broker", name: "Брокер", req: () => getUpgradeLevel("vipBuyers") > 0, desc: "ведет VIP-клиентов" },
  { id: "analyst", name: "Аналитик", req: () => getUpgradeLevel("marketInsight") > 0, desc: "читает рынок" }
];

const megaProjectDefs = [
  {
    id: "auctionHouse",
    title: "Аукционный дом",
    desc: "Дорогие покупатели дают больше прибыли с каждой продажи.",
    baseCost: 75000,
    max: 8,
    minGarage: 4
  },
  {
    id: "logisticsHub",
    title: "Логистический узел",
    desc: "Расширяет места на складе и усиливает автодоход.",
    baseCost: 140000,
    max: 8,
    minGarage: 4
  },
  {
    id: "oddityMuseum",
    title: "Музей странностей",
    desc: "Коллекция начинает приносить стабильный доход и статус.",
    baseCost: 260000,
    max: 6,
    minGarage: 5
  },
  {
    id: "cityNetwork",
    title: "Городская сеть",
    desc: "Филиалы сами находят мелкие сделки и поднимают пассивный доход.",
    baseCost: 520000,
    max: 6,
    minGarage: 5
  },
  {
    id: "dealTower",
    title: "Башня сделок",
    desc: "Финальный символ империи: прибыль, шанс сделки и престиж выше.",
    baseCost: 1000000,
    max: 5,
    minGarage: 5
  }
];

const puzzleToggleMap = [
  [0, 1, 3],
  [1, 0, 2, 4],
  [2, 1, 5],
  [3, 0, 4, 6],
  [4, 1, 3, 5, 7],
  [5, 2, 4, 8],
  [6, 3, 7],
  [7, 4, 6, 8],
  [8, 5, 7]
];

const marketTrends = [
  {
    id: "calm",
    title: "Стабильный спрос",
    text: "Рынок спокоен: сделки идут без сюрпризов.",
    profit: 0,
    success: 0,
    match: () => true
  },
  {
    id: "retro",
    title: "Ретро на волне",
    text: "Скупщики ищут старую технику: магнитофоны, телевизоры, приставки и синтезаторы.",
    profit: 0.18,
    success: 0.04,
    match: (item) => ["vcr", "tv", "console", "synth", "arcade", "tapeplayer", "toycrane", "gramophone"].includes(item.itemId)
  },
  {
    id: "luxury",
    title: "Охота за редкостями",
    text: "Коллекционеры готовы переплачивать за часы, шкатулки, самовары и артефакты.",
    profit: 0.24,
    success: -0.03,
    match: (item) => ["watch", "amberbox", "samovar", "artifact", "meteor", "painting", "prototype", "container"].includes(item.itemId)
  },
  {
    id: "transport",
    title: "Транспортный бум",
    text: "Мастерские разбирают авто и мотоциклы, крупные сделки стали выгоднее.",
    profit: 0.22,
    success: 0.02,
    match: (item) => ["car", "moto", "drone"].includes(item.itemId)
  },
  {
    id: "slump",
    title: "Суета на рынке",
    text: "Покупатели торгуются жестко, зато внимательный анализ спасает рискованные сделки.",
    profit: -0.08,
    success: 0.07,
    match: () => true
  }
];

const emptyState = {
  version: 1,
  money: 360,
  reputation: 0,
  garageLevel: 1,
  inventory: [],
  selectedItemId: null,
  collection: {},
  upgrades: {
    repairSpeed: 0,
    dealChance: 0,
    saleProfit: 0,
    capacity: 0,
    helpers: 0,
    autoDealer: 0,
    rareSearch: 0,
    dealShield: 0,
    purchaseDiscount: 0,
    marketInsight: 0,
    vipBuyers: 0,
    casinoEdge: 0,
    warehouseNetwork: 0,
    autoSaveDeal: 0
  },
  megaprojects: {
    auctionHouse: 0,
    logisticsHub: 0,
    oddityMuseum: 0,
    cityNetwork: 0,
    dealTower: 0
  },
  stats: {
    completedDeals: 0,
    failedDeals: 0,
    dealsSinceInterstitial: 0,
    interstitialEvery: 4
  },
  lastDeal: null,
  failedDeal: null,
  market: {
    trendId: "calm",
    expiresAt: 0,
    lastAnalyzedAt: 0
  },
  casino: {
    rouletteLast: "Ставка ждёт",
    rouletteSpin: 0,
    crash: null,
    crashLast: "Готова к запуску"
  },
  puzzle: {
    active: false,
    board: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    movesLeft: 0,
    streak: 0,
    solvedTotal: 0,
    lastReward: "Награда растёт с серией.",
    hintTile: null
  },
  settings: {
    sound: true,
    music: false,
    volume: 0.45
  },
  eventLog: [
    "Гараж открыт. Первые покупатели уже шепчутся у ворот."
  ]
};

let state = loadGame();
let lastFrame = performance.now();
let lastAutosave = Date.now();
let pointerIsDown = false;
let lastPointerAt = 0;
let modalAction = null;
let passiveFloatBank = 0;
let lastRenderedMoney = state.money;
let lastMoneyPulseAt = 0;
let audioCtx = null;
let masterGain = null;
let sfxGain = null;
let musicGain = null;
let musicTimer = null;
let musicStep = 0;
const renderCache = {
  inventory: "",
  upgrades: "",
  megaprojects: "",
  puzzle: "",
  business: "",
  collection: "",
  events: "",
  settings: ""
};

const panels = {
  upgrades: false,
  megaprojects: false,
  events: false
};

const dom = {
  mainMenu: document.getElementById("mainMenu"),
  playBtn: document.getElementById("playBtn"),
  openMenuBtn: document.getElementById("openMenuBtn"),
  menuDialog: document.getElementById("menuDialog"),
  menuDialogCloseBtn: document.getElementById("menuDialogCloseBtn"),
  menuPanelSettings: document.getElementById("menuPanelSettings"),
  menuPanelAbout: document.getElementById("menuPanelAbout"),
  menuSoundToggleBtn: document.getElementById("menuSoundToggleBtn"),
  menuMusicToggleBtn: document.getElementById("menuMusicToggleBtn"),
  menuVolumeSlider: document.getElementById("menuVolumeSlider"),
  menuVolumeValue: document.getElementById("menuVolumeValue"),
  saveState: document.getElementById("saveState"),
  money: document.getElementById("money"),
  reputation: document.getElementById("reputation"),
  garageLevel: document.getElementById("garageLevel"),
  passiveIncome: document.getElementById("passiveIncome"),
  marketName: document.getElementById("marketName"),
  capacityText: document.getElementById("capacityText"),
  currentItemImage: document.getElementById("currentItemImage"),
  currentItemCard: document.getElementById("currentItemCard"),
  currentItemStage: document.getElementById("currentItemStage"),
  currentItemName: document.getElementById("currentItemName"),
  currentItemRarity: document.getElementById("currentItemRarity"),
  currentItemInfo: document.getElementById("currentItemInfo"),
  progressLabel: document.getElementById("progressLabel"),
  progressTime: document.getElementById("progressTime"),
  itemProgress: document.getElementById("itemProgress"),
  buyBtn: document.getElementById("buyBtn"),
  upgradeGarageBtn: document.getElementById("upgradeGarageBtn"),
  safeDealInfo: document.getElementById("safeDealInfo"),
  riskyDealInfo: document.getElementById("riskyDealInfo"),
  legendaryDealInfo: document.getElementById("legendaryDealInfo"),
  marketTimer: document.getElementById("marketTimer"),
  marketTrendTitle: document.getElementById("marketTrendTitle"),
  marketTrendText: document.getElementById("marketTrendText"),
  marketProfit: document.getElementById("marketProfit"),
  marketRisk: document.getElementById("marketRisk"),
  analyzeMarketBtn: document.getElementById("analyzeMarketBtn"),
  rouletteResult: document.getElementById("rouletteResult"),
  rouletteWheel: document.getElementById("rouletteWheel"),
  rouletteBetInput: document.getElementById("rouletteBetInput"),
  crashStatus: document.getElementById("crashStatus"),
  rocketWindow: document.getElementById("rocketWindow"),
  rocketIcon: document.getElementById("rocketIcon"),
  crashMultiplier: document.getElementById("crashMultiplier"),
  crashBetInput: document.getElementById("crashBetInput"),
  launchRocketBtn: document.getElementById("launchRocketBtn"),
  cashoutRocketBtn: document.getElementById("cashoutRocketBtn"),
  puzzleStreak: document.getElementById("puzzleStreak"),
  puzzleGrid: document.getElementById("puzzleGrid"),
  puzzleStatus: document.getElementById("puzzleStatus"),
  puzzleMoves: document.getElementById("puzzleMoves"),
  puzzleReward: document.getElementById("puzzleReward"),
  newPuzzleBtn: document.getElementById("newPuzzleBtn"),
  puzzleHintBtn: document.getElementById("puzzleHintBtn"),
  inventoryHint: document.getElementById("inventoryHint"),
  inventoryList: document.getElementById("inventoryList"),
  doubleProfitBtn: document.getElementById("doubleProfitBtn"),
  saveDealBtn: document.getElementById("saveDealBtn"),
  speedUpBtn: document.getElementById("speedUpBtn"),
  rareItemBtn: document.getElementById("rareItemBtn"),
  adMoneyBtn: document.getElementById("adMoneyBtn"),
  adCashBtn: document.getElementById("adCashBtn"),
  garageUpgradeHint: document.getElementById("garageUpgradeHint"),
  businessRank: document.getElementById("businessRank"),
  warehouseList: document.getElementById("warehouseList"),
  crewList: document.getElementById("crewList"),
  upgradeSection: document.getElementById("upgradeSection"),
  upgradePanelBtn: document.getElementById("upgradePanelBtn"),
  upgradeList: document.getElementById("upgradeList"),
  megaprojectSection: document.getElementById("megaprojectSection"),
  megaprojectPanelBtn: document.getElementById("megaprojectPanelBtn"),
  empireRank: document.getElementById("empireRank"),
  megaprojectList: document.getElementById("megaprojectList"),
  collectionCount: document.getElementById("collectionCount"),
  collectionGrid: document.getElementById("collectionGrid"),
  eventSection: document.getElementById("eventSection"),
  eventPanelBtn: document.getElementById("eventPanelBtn"),
  eventSummary: document.getElementById("eventSummary"),
  eventLog: document.getElementById("eventLog"),
  floatLayer: document.getElementById("floatLayer"),
  modal: document.getElementById("modal"),
  modalTitle: document.getElementById("modalTitle"),
  modalText: document.getElementById("modalText"),
  modalActions: document.getElementById("modalActions")
};

document.body.classList.add("menu-open");

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadGame() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return clone(emptyState);
    }
    const saved = JSON.parse(raw);
    return mergeState(saved);
  } catch (error) {
    console.warn("Save load failed", error);
    return clone(emptyState);
  }
}

function mergeState(saved) {
  const merged = clone(emptyState);
  Object.assign(merged, saved);
  merged.upgrades = { ...emptyState.upgrades, ...(saved.upgrades || {}) };
  merged.megaprojects = { ...emptyState.megaprojects, ...(saved.megaprojects || {}) };
  merged.stats = { ...emptyState.stats, ...(saved.stats || {}) };
  merged.market = { ...emptyState.market, ...(saved.market || {}) };
  merged.casino = { ...emptyState.casino, ...(saved.casino || {}) };
  if (merged.casino.crash?.active) {
    merged.casino.crash = null;
    merged.casino.crashLast = "Ракета вернулась в ангар";
  }
  merged.puzzle = { ...emptyState.puzzle, ...(saved.puzzle || {}) };
  if (!Array.isArray(merged.puzzle.board) || merged.puzzle.board.length !== 9) {
    merged.puzzle.board = emptyState.puzzle.board.slice();
    merged.puzzle.active = false;
  }
  merged.settings = { ...emptyState.settings, ...(saved.settings || {}) };
  merged.inventory = Array.isArray(saved.inventory) ? saved.inventory : [];
  merged.collection = saved.collection || {};
  merged.eventLog = Array.isArray(saved.eventLog) && saved.eventLog.length
    ? saved.eventLog.slice(0, 16)
    : emptyState.eventLog.slice();
  if (!merged.stats.interstitialEvery) {
    merged.stats.interstitialEvery = getNextInterstitialCount();
  }
  return merged;
}

function saveGame() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    dom.saveState.textContent = "Сохранено";
  } catch (error) {
    dom.saveState.textContent = "Нет места для сейва";
    console.warn("Save failed", error);
  }
}

function markDirty() {
  dom.saveState.textContent = "Сохраняем...";
}

function formatMoney(value) {
  return `${Math.floor(value).toLocaleString("ru-RU")} ₽`;
}

function formatShortMoney(value) {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)} млн ₽`;
  }
  if (value >= 10000) {
    return `${Math.floor(value / 1000)} тыс. ₽`;
  }
  return formatMoney(value);
}

function formatTime(ms) {
  return `${Math.max(0, Math.ceil(ms / 1000))}с`;
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getItemDef(id) {
  return itemCatalog.find((item) => item.id === id) || itemCatalog[0];
}

function getUpgradeLevel(id) {
  return state.upgrades[id] || 0;
}

function getMegaLevel(id) {
  return state.megaprojects?.[id] || 0;
}

function getUpgradeCost(def) {
  if (def.id === "autoSaveDeal") {
    return 200000;
  }
  const level = getUpgradeLevel(def.id);
  return Math.floor(def.baseCost * Math.pow(1.72, level) * (1 + state.garageLevel * 0.04));
}

function getMegaProjectCost(def) {
  const level = getMegaLevel(def.id);
  return Math.floor(def.baseCost * Math.pow(2.35, level) * (1 + Math.max(0, state.garageLevel - 4) * 0.08));
}

function getMegaProjectScore() {
  return megaProjectDefs.reduce((sum, def) => sum + getMegaLevel(def.id), 0);
}

function getEmpireRankText() {
  const score = getMegaProjectScore();
  if (score >= 24) {
    return "империя города";
  }
  if (score >= 14) {
    return "крупный магнат";
  }
  if (score >= 6) {
    return "растущая сеть";
  }
  if (score > 0) {
    return "первые активы";
  }
  return "для супер-магната";
}

function getCapacity() {
  return 1
    + state.garageLevel
    + getUpgradeLevel("capacity")
    + getUpgradeLevel("warehouseNetwork") * 2
    + getMegaLevel("logisticsHub") * 4
    + getMegaLevel("cityNetwork") * 2;
}

function getRepairMultiplier() {
  return clamp(1 - getUpgradeLevel("repairSpeed") * 0.07 - getUpgradeLevel("autoDealer") * 0.05, 0.28, 1);
}

function getProfitMultiplier() {
  return 1
    + getUpgradeLevel("saleProfit") * 0.05
    + getUpgradeLevel("vipBuyers") * 0.04
    + getMegaLevel("auctionHouse") * 0.08
    + getMegaLevel("dealTower") * 0.06;
}

function getSuccessChance(type) {
  const config = dealConfigs[type];
  const bonus = getUpgradeLevel("dealChance") * 0.03
    + getUpgradeLevel("vipBuyers") * 0.012
    + getMegaLevel("dealTower") * 0.01;
  const limit = type === "safe" ? 0.99 : type === "risky" ? 0.92 : 0.78;
  return clamp(config.success + bonus, 0.05, limit);
}

function getCurrentMarketTrend() {
  return marketTrends.find((trend) => trend.id === state.market.trendId) || marketTrends[0];
}

function getMarketEffect(item) {
  const trend = getCurrentMarketTrend();
  const active = state.market.expiresAt > Date.now();
  if (!active || !item || !trend.match(item)) {
    return { profit: 0, success: 0, trend };
  }
  return { profit: trend.profit, success: trend.success, trend };
}

function getAnalyzedCost() {
  const base = 45 + state.garageLevel * 35 + getUpgradeLevel("rareSearch") * 15;
  return Math.max(20, Math.round(base * (1 - getUpgradeLevel("marketInsight") * 0.08)));
}

function analyzeMarket() {
  const cost = getAnalyzedCost();
  if (state.money < cost) {
    toast(`Аналитик просит ${formatMoney(cost)} за свежую сводку.`);
    playSfx("error");
    return;
  }

  state.money -= cost;
  const pool = marketTrends.filter((trend) => trend.id !== state.market.trendId);
  const trend = pool[Math.floor(Math.random() * pool.length)] || marketTrends[0];
  state.market.trendId = trend.id;
  state.market.expiresAt = Date.now() + 90000 + state.garageLevel * 12000 + getUpgradeLevel("marketInsight") * 30000;
  state.market.lastAnalyzedAt = Date.now();
  pushEvent(`Анализ рынка: ${trend.title}.`);
  playSfx("upgrade");
  markDirty();
  saveGame();
  render();
}

function parseBet(input) {
  const raw = Number(input.value);
  const value = Math.floor(Number.isFinite(raw) ? raw : 0);
  return clamp(value, 10, Math.max(10, Math.floor(state.money)));
}

function getRouletteColor() {
  const roll = Math.random();
  if (roll < 0.05) {
    return "green";
  }
  return roll < 0.525 ? "red" : "black";
}

function getRouletteName(color) {
  if (color === "red") {
    return "красное";
  }
  if (color === "black") {
    return "чёрное";
  }
  return "зелёное";
}

function playRoulette(choice) {
  const bet = parseBet(dom.rouletteBetInput);
  dom.rouletteBetInput.value = String(bet);
  if (state.money < bet) {
    toast("Не хватает денег на ставку.");
    playSfx("error");
    return;
  }

  state.money -= bet;
  playSfx("casino");
  const result = getRouletteColor();
  const multiplier = result === "green" ? 14 : 2;
  const win = result === choice ? Math.round(bet * multiplier * (1 + getUpgradeLevel("casinoEdge") * 0.04)) : 0;
  state.casino.rouletteSpin = (state.casino.rouletteSpin || 0) + 1;
  dom.rouletteWheel.style.transform = `rotate(${state.casino.rouletteSpin * 1080 + Math.floor(Math.random() * 360)}deg)`;
  dom.rouletteWheel.classList.add("is-spinning");
  setTimeout(() => dom.rouletteWheel.classList.remove("is-spinning"), 850);

  if (win > 0) {
    state.money += win;
    state.casino.rouletteLast = `Выпало ${getRouletteName(result)}: выигрыш ${formatMoney(win)}.`;
    pushEvent(`Рулетка: ${getRouletteName(result)}, выигрыш ${formatMoney(win)}.`);
    floatText(`+${formatMoney(win - bet)}`);
    playSfx(result === "green" ? "rare" : "success");
  } else {
    state.casino.rouletteLast = `Выпало ${getRouletteName(result)}: ставка сгорела.`;
    pushEvent(`Рулетка: выпало ${getRouletteName(result)}, потеря ${formatMoney(bet)}.`);
    floatText(`-${formatMoney(bet)}`);
    playSfx("fail");
  }

  markDirty();
  saveGame();
  render();
}

function getCrashPoint() {
  const roll = Math.random();
  const edge = 1 + getUpgradeLevel("casinoEdge") * 0.05;
  if (roll < 0.04) {
    return randomBetween(7, 14) * edge;
  }
  if (roll < 0.18) {
    return randomBetween(3.2, 7) * edge;
  }
  if (roll < 0.48) {
    return randomBetween(1.75, 3.2) * edge;
  }
  return randomBetween(1.05, 1.75) * edge;
}

function getCrashMultiplier(crash) {
  const elapsed = Math.max(0, (Date.now() - crash.startedAt) / 1000);
  return 1 + elapsed * 0.38 + Math.pow(elapsed, 1.45) * 0.07;
}

function launchRocket() {
  if (state.casino.crash?.active) {
    toast("Ракета уже летит. Заберите выигрыш или ждите исход.");
    playSfx("error");
    return;
  }

  const bet = parseBet(dom.crashBetInput);
  dom.crashBetInput.value = String(bet);
  if (state.money < bet) {
    toast("Не хватает денег на запуск ракеты.");
    playSfx("error");
    return;
  }

  state.money -= bet;
  state.casino.crash = {
    active: true,
    bet,
    startedAt: Date.now(),
    crashPoint: getCrashPoint(),
    multiplier: 1
  };
  state.casino.crashLast = "Ракета набирает множитель.";
  pushEvent(`Ракета запущена: ставка ${formatMoney(bet)}.`);
  playSfx("deal");
  markDirty();
  saveGame();
  render();
}

function cashoutRocket() {
  const crash = state.casino.crash;
  if (!crash?.active) {
    toast("Сначала запустите ракету.");
    playSfx("error");
    return;
  }

  const multiplier = getCrashMultiplier(crash);
  const payout = Math.floor(crash.bet * multiplier);
  state.money += payout;
  state.casino.crash = null;
  state.casino.crashLast = `Забрано ${multiplier.toFixed(2)}x: ${formatMoney(payout)}.`;
  pushEvent(`Ракета: забрали на ${multiplier.toFixed(2)}x, выплата ${formatMoney(payout)}.`);
  floatText(`+${formatMoney(payout)}`);
  playSfx("success");
  markDirty();
  saveGame();
  render();
}

function updateCasino() {
  const crash = state.casino.crash;
  if (!crash?.active) {
    return;
  }

  crash.multiplier = getCrashMultiplier(crash);
  if (crash.multiplier >= crash.crashPoint) {
    const lost = crash.bet;
    state.casino.crash = null;
    state.casino.crashLast = `Упала на ${crash.crashPoint.toFixed(2)}x. Потеря ${formatMoney(lost)}.`;
    pushEvent(`Ракета упала на ${crash.crashPoint.toFixed(2)}x. Ставка ${formatMoney(lost)} потеряна.`);
    floatText("Ракета упала");
    playSfx("fail");
    markDirty();
    saveGame();
  }
}

function getPuzzleCost() {
  const base = 90 + state.garageLevel * 80 + state.puzzle.streak * 35;
  return Math.max(45, Math.round(base * (1 - getUpgradeLevel("marketInsight") * 0.04)));
}

function getPuzzleHintCost() {
  return Math.max(30, Math.round(getPuzzleCost() * 0.45));
}

function togglePuzzleTile(board, index) {
  const next = board.slice();
  for (const tile of puzzleToggleMap[index]) {
    next[tile] = next[tile] ? 0 : 1;
  }
  return next;
}

function isPuzzleSolved(board = state.puzzle.board) {
  return board.every(Boolean);
}

function generatePuzzleBoard() {
  let board = Array(9).fill(1);
  const turns = 5 + state.garageLevel + Math.floor(Math.random() * 5);
  for (let i = 0; i < turns; i += 1) {
    board = togglePuzzleTile(board, Math.floor(Math.random() * 9));
  }
  return isPuzzleSolved(board) ? togglePuzzleTile(board, 4) : board;
}

function buyPuzzleScheme() {
  if (state.puzzle.active) {
    toast("Схема уже открыта. Сначала решите её или потратьте ходы.");
    playSfx("error");
    return;
  }

  const cost = getPuzzleCost();
  if (state.money < cost) {
    toast(`Нужно ${formatMoney(cost)} на новую схему сейфа.`);
    playSfx("error");
    return;
  }

  state.money -= cost;
  state.puzzle.active = true;
  state.puzzle.board = generatePuzzleBoard();
  state.puzzle.movesLeft = 12 + Math.min(4, getMegaLevel("dealTower")) + Math.floor(getUpgradeLevel("marketInsight") / 2);
  state.puzzle.hintTile = null;
  state.puzzle.lastReward = "Включите все контакты, чтобы найти скрытую сделку.";
  pushEvent(`Куплена схема сейфа за ${formatMoney(cost)}.`);
  playSfx("puzzle");
  markDirty();
  saveGame();
  render();
}

function handlePuzzleTile(index) {
  if (!state.puzzle.active) {
    toast("Сначала купите схему сейфа.");
    playSfx("error");
    return;
  }

  state.puzzle.board = togglePuzzleTile(state.puzzle.board, index);
  state.puzzle.movesLeft -= 1;
  state.puzzle.hintTile = null;
  playSfx("puzzle");

  if (isPuzzleSolved()) {
    resolvePuzzleSuccess();
    return;
  }

  if (state.puzzle.movesLeft <= 0) {
    state.puzzle.active = false;
    state.puzzle.streak = 0;
    state.puzzle.lastReward = "Схема сгорела. Серия сброшена.";
    pushEvent("Схема сейфа не сошлась: скрытая сделка ушла конкуренту.");
    floatText("Схема сгорела");
    playSfx("fail");
  }

  markDirty();
  saveGame();
  render();
}

function getPuzzleReward() {
  const base = 180 + state.garageLevel * 220 + state.puzzle.streak * 120 + getMegaProjectScore() * 70;
  const multiplier = 1 + getMegaLevel("oddityMuseum") * 0.05 + getMegaLevel("dealTower") * 0.08;
  return Math.round(base * multiplier);
}

function resolvePuzzleSuccess() {
  const reward = getPuzzleReward();
  const reputationReward = 1 + Math.floor(state.puzzle.streak / 3) + getMegaLevel("oddityMuseum");

  state.money += reward;
  state.reputation += reputationReward;
  state.puzzle.active = false;
  state.puzzle.solvedTotal += 1;
  state.puzzle.streak += 1;
  state.puzzle.hintTile = null;
  state.puzzle.board = Array(9).fill(1);
  state.puzzle.lastReward = `Сейф открыт: +${formatMoney(reward)} и +${reputationReward} реп.`;

  pushEvent(`Схема сейфа решена. Скрытая сделка принесла ${formatMoney(reward)}.`);
  if (state.puzzle.streak > 0 && state.puzzle.streak % 3 === 0) {
    const pool = marketTrends.filter((trend) => trend.id !== "calm");
    const trend = pool[Math.floor(Math.random() * pool.length)] || marketTrends[0];
    state.market.trendId = trend.id;
    state.market.expiresAt = Date.now() + 60000 + getUpgradeLevel("marketInsight") * 18000;
    pushEvent(`Серия схем открыла инсайд: ${trend.title}.`);
  }
  maybeFindCollection(collectionItems[Math.floor(Math.random() * collectionItems.length)] || itemCatalog[0], 0.08 + getUpgradeLevel("rareSearch") * 0.012);
  floatText(`+${formatMoney(reward)}`);
  playSfx("rare");
  markDirty();
  saveGame();
  render();
}

function getPuzzleSolution(board) {
  const start = board.join("");
  const target = "111111111";
  if (start === target) {
    return [];
  }

  const queue = [{ board: board.slice(), path: [] }];
  const visited = new Set([start]);
  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const current = queue[cursor];
    for (let index = 0; index < 9; index += 1) {
      const nextBoard = togglePuzzleTile(current.board, index);
      const key = nextBoard.join("");
      if (visited.has(key)) {
        continue;
      }
      const path = current.path.concat(index);
      if (key === target) {
        return path;
      }
      visited.add(key);
      queue.push({ board: nextBoard, path });
    }
  }
  return [];
}

function buyPuzzleHint() {
  if (!state.puzzle.active) {
    toast("Подсказка нужна только для активной схемы.");
    playSfx("error");
    return;
  }

  const cost = getPuzzleHintCost();
  if (state.money < cost) {
    toast(`Подсказка стоит ${formatMoney(cost)}.`);
    playSfx("error");
    return;
  }

  const solution = getPuzzleSolution(state.puzzle.board);
  if (!solution.length) {
    toast("Схема уже почти решена.");
    return;
  }

  state.money -= cost;
  state.puzzle.hintTile = solution[0];
  state.puzzle.lastReward = `Подсказка: нажмите контакт ${solution[0] + 1}.`;
  pushEvent(`Схемщик подсказал контакт ${solution[0] + 1} за ${formatMoney(cost)}.`);
  playSfx("upgrade");
  markDirty();
  saveGame();
  render();
}

function getPassiveIncomePerSecond() {
  const helpers = getUpgradeLevel("helpers");
  const helperIncome = helpers
    ? helpers * (1.25 + state.garageLevel * 0.75)
    : 0;
  const collectionFound = collectionItems.filter((item) => state.collection[item.id]).length;
  const megaFlatIncome =
    getMegaLevel("auctionHouse") * 30
    + getMegaLevel("logisticsHub") * 55
    + getMegaLevel("oddityMuseum") * (85 + collectionFound * 7)
    + getMegaLevel("cityNetwork") * 180
    + getMegaLevel("dealTower") * 420;
  const multiplier = 1
    + getUpgradeLevel("saleProfit") * 0.03
    + getUpgradeLevel("autoDealer") * 0.02
    + getUpgradeLevel("warehouseNetwork") * 0.08
    + getMegaLevel("logisticsHub") * 0.12
    + getMegaLevel("oddityMuseum") * 0.1
    + getMegaLevel("cityNetwork") * 0.18
    + getMegaLevel("dealTower") * 0.25;
  return (helperIncome + megaFlatIncome) * multiplier;
}

function getNextInterstitialCount() {
  return Math.random() < 0.5 ? 4 : 5;
}

function getCurrentItem() {
  if (state.selectedItemId) {
    const selected = state.inventory.find((item) => item.uid === state.selectedItemId);
    if (selected) {
      return selected;
    }
  }
  return state.inventory[0] || null;
}

function chooseWeighted(items) {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;
  for (const item of items) {
    roll -= item.weight;
    if (roll <= 0) {
      return item;
    }
  }
  return items[0];
}

function getAffordableCatalog() {
  const available = itemCatalog.filter((item) => item.minGarage <= state.garageLevel);
  const affordable = available.filter((item) => item.cost * 0.9 <= state.money);
  return affordable.length ? affordable : available.filter((item) => item.cost <= state.money);
}

function makeItemInstance(def, options = {}) {
  const now = Date.now();
  const discount = clamp(1 - getUpgradeLevel("purchaseDiscount") * 0.03, 0.7, 1);
  const cost = options.free ? 0 : Math.max(1, Math.round(def.cost * randomBetween(0.88, 1.14) * discount));
  const value = Math.round(def.value * randomBetween(0.94, 1.18) * getProfitMultiplier());
  let repairDuration = Math.round(def.repair * getRepairMultiplier());
  const eventRoll = Math.random();
  let eventText = "";

  if (!options.free && eventRoll < 0.08) {
    repairDuration = Math.round(repairDuration * 1.45);
    eventText = "Товар оказался сломан: ремонт займет дольше.";
  } else if (!options.free && eventRoll < 0.16) {
    repairDuration = Math.round(repairDuration * 0.72);
    eventText = "Срочный покупатель маячит рядом: ремонт пошел быстрее.";
  }

  return {
    uid: `${def.id}_${now}_${Math.floor(Math.random() * 10000)}`,
    itemId: def.id,
    name: def.name,
    rarity: def.rarity,
    rarityName: def.rarityName,
    image: def.image,
    cost,
    value,
    status: options.ready ? "ready" : "repairing",
    createdAt: now,
    readyAt: options.ready ? now : now + repairDuration,
    repairStartedAt: now,
    repairDuration,
    eventText,
    adGift: !!options.free
  };
}

function buyItem() {
  if (state.inventory.length >= getCapacity()) {
    toast("Гараж забит. Продайте товар или улучшите вместимость.");
    playSfx("error");
    return;
  }

  const affordable = getAffordableCatalog();
  if (!affordable.length) {
    toast("Не хватает денег даже на самый пыльный лот.");
    playSfx("error");
    return;
  }

  const def = chooseWeighted(affordable);
  const item = makeItemInstance(def);
  if (state.money < item.cost) {
    toast("Продавец внезапно поднял цену. Нужно больше денег.");
    playSfx("error");
    return;
  }

  state.money -= item.cost;
  state.inventory.push(item);
  state.selectedItemId = item.uid;
  pushEvent(`Куплен товар: ${item.name} за ${formatMoney(item.cost)}.`);
  if (item.eventText) {
    pushEvent(item.eventText);
  }
  if (Math.random() < 0.07) {
    const drop = Math.round(item.value * 0.1);
    item.value = Math.max(item.cost + 1, item.value - drop);
    pushEvent(`Конкурент перебил цену: оценка товара упала на ${formatMoney(drop)}.`);
  }
  maybeFindCollection(def, 0.05 + getUpgradeLevel("rareSearch") * 0.015);
  floatText(`-${formatMoney(item.cost)}`);
  playSfx("buy");
  markDirty();
  saveGame();
  render();
}

function startDeal(type) {
  const item = getCurrentItem();
  if (!item || item.status !== "ready") {
    toast("Сначала нужен отремонтированный товар.");
    playSfx("error");
    return;
  }
  startDealForItem(item, type, false);
}

function startDealForItem(item, type, isAuto) {
  const config = dealConfigs[type];
  const now = Date.now();
  const market = getMarketEffect(item);
  const salePrice = Math.max(1, Math.round(item.value * config.saleMultiplier * (1 + market.profit)));
  const profit = Math.max(1, salePrice - item.cost);

  item.status = "dealing";
  item.deal = {
    type,
    title: config.title,
    startedAt: now,
    endsAt: now + config.duration,
    duration: config.duration,
    salePrice,
    profit,
    rep: config.rep,
    successChance: clamp(getSuccessChance(type) + market.success, 0.05, 0.99),
    marketTitle: market.profit || market.success ? market.trend.title : "",
    roll: Math.random()
  };

  if (isAuto) {
    pushEvent(`Автосделочник выставил товар: ${item.name}. Режим: ${config.title.toLowerCase()}.`);
  } else {
    pushEvent(`${config.title} сделка началась: ${item.name}.`);
  }
  playSfx("deal");
  markDirty();
  saveGame();
  render();
}

function resolveDeal(item) {
  if (!item.deal || item.resolving) {
    return;
  }
  item.resolving = true;
  const deal = item.deal;
  const success = deal.roll <= deal.successChance;

  if (success) {
    resolveSuccessfulDeal(item, deal);
  } else {
    resolveFailedDeal(item, deal);
  }

  state.inventory = state.inventory.filter((stored) => stored.uid !== item.uid);
  if (state.selectedItemId === item.uid) {
    state.selectedItemId = state.inventory[0]?.uid || null;
  }

  state.stats.dealsSinceInterstitial += 1;
  maybeShowInterstitialAfterDeal();
  markDirty();
  saveGame();
}

function resolveSuccessfulDeal(item, deal) {
  let salePrice = deal.salePrice;
  let profit = deal.profit;
  const overpayChance = deal.type === "legendary" ? 0.18 : 0.12;

  if (Math.random() < overpayChance) {
    const bonus = Math.round(profit * randomBetween(0.18, 0.34));
    salePrice += bonus;
    profit += bonus;
    pushEvent(`Покупатель переплатил: сверху ${formatMoney(bonus)}.`);
  }

  state.money += salePrice;
  state.reputation += deal.rep;
  state.stats.completedDeals += 1;
  state.lastDeal = {
    createdAt: Date.now(),
    profit,
    salePrice,
    itemName: item.name,
    doubled: false
  };

  pushEvent(`Успех: ${item.name} продан. Прибыль ${formatMoney(profit)}.`);
  floatText(`+${formatMoney(profit)}`);
  playSfx("success");

  const rareChance = deal.type === "legendary"
    ? 0.22 + getUpgradeLevel("rareSearch") * 0.025
    : 0.06 + getUpgradeLevel("rareSearch") * 0.012;
  maybeFindCollection(getItemDef(item.itemId), rareChance);
}

function resolveFailedDeal(item, deal) {
  const config = dealConfigs[deal.type];
  const shieldChance = getUpgradeLevel("dealShield") * 0.12;
  let salvageMultiplier = config.salvage;
  let shielded = false;

  if (shieldChance > 0 && Math.random() < shieldChance) {
    salvageMultiplier = Math.max(salvageMultiplier, 0.68);
    shielded = true;
  }

  const salvage = Math.round(item.cost * salvageMultiplier);
  const recoveryTarget = Math.round(item.cost + deal.profit * 0.42);
  state.money += salvage;
  state.reputation = Math.max(0, state.reputation - (deal.type === "legendary" ? 2 : 1));
  state.stats.failedDeals += 1;
  state.failedDeal = {
    createdAt: Date.now(),
    expiresAt: Date.now() + FAILED_DEAL_SAVE_MS,
    itemName: item.name,
    recovery: Math.max(0, recoveryTarget - salvage),
    saved: false
  };

  if (shielded) {
    pushEvent("Защита сделки сработала и вернула часть стоимости.");
  } else {
    pushEvent(`Сделка сорвалась: ${item.name}. Вернули только ${formatMoney(salvage)}.`);
  }

  if (getUpgradeLevel("autoSaveDeal") > 0 && state.failedDeal.recovery > 0) {
    state.money += state.failedDeal.recovery;
    state.reputation += 2;
    state.failedDeal.saved = true;
    pushEvent(`Автоспасение сделки вернуло ${formatMoney(state.failedDeal.recovery)} без рекламы.`);
    floatText(`+${formatMoney(state.failedDeal.recovery)}`);
    playSfx("success");
    return;
  }

  playSfx("fail");
  openDealFailedModal(item.name);
}

function maybeFindCollection(baseDef, chance) {
  const availableCollection = collectionItems.filter((item) => item.minGarage <= state.garageLevel);
  const def = baseDef.collection
    ? baseDef
    : chooseWeighted(availableCollection.length ? availableCollection : collectionItems);

  if (!def || state.collection[def.id] || Math.random() > chance) {
    return false;
  }

  state.collection[def.id] = {
    foundAt: Date.now(),
    name: def.name,
    rarity: def.rarity
  };
  state.reputation += def.rarity === "legendary" ? 10 : def.rarity === "epic" ? 6 : 3;
  pushEvent(`Найдена редкость для коллекции: ${def.name}!`);
  floatText("+репутация");
  return true;
}

function upgradeGarage() {
  if (state.garageLevel >= 5) {
    toast("Гараж уже стал империей.");
    playSfx("error");
    return;
  }
  const req = garageRequirements[state.garageLevel];
  if (state.money < req.money || state.reputation < req.reputation) {
    toast(`Нужно ${formatMoney(req.money)} и ${req.reputation} репутации.`);
    playSfx("error");
    return;
  }

  state.money -= req.money;
  state.garageLevel += 1;
  pushEvent(`Гараж улучшен до ${state.garageLevel} уровня. Открыт новый рынок.`);
  floatText(`Гараж ${state.garageLevel} ур.`);
  playSfx("upgrade");
  markDirty();
  saveGame();
  render();
}

function buyUpgrade(id) {
  const def = upgradeDefs.find((upgrade) => upgrade.id === id);
  if (!def) {
    return;
  }
  const level = getUpgradeLevel(id);
  if (level >= def.max) {
    toast("Это улучшение уже на максимуме.");
    playSfx("error");
    return;
  }
  const cost = getUpgradeCost(def);
  if (state.money < cost) {
    toast("Не хватает денег на улучшение.");
    playSfx("error");
    return;
  }
  state.money -= cost;
  state.upgrades[id] = level + 1;
  pushEvent(`${def.title}: уровень ${state.upgrades[id]}.`);
  if (id === "autoDealer") {
    pushEvent("Автосделочник будет ускорять ремонт и сам запускать продажи.");
  }
  if (id === "autoSaveDeal") {
    pushEvent("Теперь проваленные сделки будут спасаться автоматически.");
  }
  playSfx("upgrade");
  markDirty();
  saveGame();
  render();
}

function buyMegaProject(id) {
  const def = megaProjectDefs.find((project) => project.id === id);
  if (!def) {
    return;
  }
  if (state.garageLevel < def.minGarage) {
    toast(`Мегапроект откроется на ${def.minGarage} уровне гаража.`);
    playSfx("error");
    return;
  }
  const level = getMegaLevel(id);
  if (level >= def.max) {
    toast("Этот мегапроект уже достроен.");
    playSfx("error");
    return;
  }
  const cost = getMegaProjectCost(def);
  if (state.money < cost) {
    toast("На мегапроект пока не хватает капитала.");
    playSfx("error");
    return;
  }

  state.money -= cost;
  state.megaprojects[id] = level + 1;
  state.reputation += 3 + state.megaprojects[id];
  pushEvent(`${def.title}: уровень ${state.megaprojects[id]}. Империя стала заметнее.`);
  floatText(`${def.title} +1`);
  playSfx("upgrade");
  markDirty();
  saveGame();
  render();
}

function speedUpSelectedRepair() {
  const item = getCurrentItem();
  if (!item || item.status !== "repairing") {
    toast("Нет активного ремонта для ускорения.");
    playSfx("error");
    return false;
  }
  item.readyAt = Date.now() + 300;
  item.repairDuration = Math.max(300, Date.now() - item.repairStartedAt + 300);
  pushEvent(`Ремонт ускорен: ${item.name} почти готов.`);
  playSfx("ready");
  markDirty();
  saveGame();
  render();
  return true;
}

function addRewardRareItem() {
  if (state.inventory.length >= getCapacity()) {
    toast("Освободите место в гараже для редкого товара.");
    playSfx("error");
    return false;
  }

  const available = collectionItems.filter((item) => item.minGarage <= Math.max(2, state.garageLevel));
  const def = chooseWeighted(available.length ? available : collectionItems);
  const item = makeItemInstance(def, { free: true, ready: true });
  item.name = `${item.name}`;
  state.inventory.push(item);
  state.selectedItemId = item.uid;
  maybeFindCollection(def, 1);
  pushEvent(`Бонус принес редкий товар: ${item.name}.`);
  floatText("Редкий товар");
  playSfx("rare");
  markDirty();
  saveGame();
  render();
  return true;
}

function addRewardMoney() {
  const reward = Math.round(220 + state.garageLevel * 160 + getPassiveIncomePerSecond() * 18 + state.reputation * 3);
  state.money += reward;
  pushEvent(`Рекламный заказчик оплатил размещение: +${formatMoney(reward)}.`);
  floatText(`+${formatMoney(reward)}`);
  playSfx("success");
  markDirty();
  saveGame();
  render();
  return true;
}

function doubleLastDealProfit() {
  const lastDeal = state.lastDeal;
  if (!lastDeal || lastDeal.doubled || Date.now() - lastDeal.createdAt > LAST_DEAL_BONUS_MS) {
    toast("Нет свежей прибыли для удвоения.");
    playSfx("error");
    return false;
  }
  state.money += lastDeal.profit;
  lastDeal.doubled = true;
  pushEvent(`Прибыль сделки удвоена: +${formatMoney(lastDeal.profit)}.`);
  floatText(`+${formatMoney(lastDeal.profit)}`);
  playSfx("success");
  markDirty();
  saveGame();
  render();
  return true;
}

function saveFailedDeal() {
  const failed = state.failedDeal;
  if (!failed || failed.saved || Date.now() > failed.expiresAt) {
    toast("Нет проваленной сделки для спасения.");
    playSfx("error");
    return false;
  }
  state.money += failed.recovery;
  state.reputation += 2;
  failed.saved = true;
  pushEvent(`Провальная сделка спасена: ${failed.itemName}, возврат ${formatMoney(failed.recovery)}.`);
  floatText(`+${formatMoney(failed.recovery)}`);
  playSfx("success");
  closeModal();
  markDirty();
  saveGame();
  render();
  return true;
}

function ensureAudio() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return null;
  }

  if (!audioCtx) {
    audioCtx = new AudioContextClass();
    masterGain = audioCtx.createGain();
    sfxGain = audioCtx.createGain();
    musicGain = audioCtx.createGain();
    sfxGain.connect(masterGain);
    musicGain.connect(masterGain);
    masterGain.connect(audioCtx.destination);
    updateAudioLevels();
  }

  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  return audioCtx;
}

function updateAudioLevels() {
  if (!masterGain || !sfxGain || !musicGain) {
    return;
  }
  masterGain.gain.value = clamp(state.settings.volume, 0, 1);
  sfxGain.gain.value = state.settings.sound ? 1 : 0;
  musicGain.gain.value = state.settings.music ? 0.42 : 0;
}

function playTone(freq, duration, type, gainValue, targetGain, delay = 0) {
  const ctx = ensureAudio();
  if (!ctx || !targetGain) {
    return;
  }
  const start = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(targetGain);
  osc.start(start);
  osc.stop(start + duration + 0.04);
}

function playSfx(type) {
  if (!state.settings.sound) {
    return;
  }

  ensureAudio();
  const patterns = {
    buy: [[220, 0.08, "square", 0.035], [330, 0.08, "triangle", 0.025, 0.06]],
    deal: [[392, 0.07, "triangle", 0.03], [523, 0.09, "triangle", 0.025, 0.08]],
    ready: [[660, 0.09, "sine", 0.035], [880, 0.12, "sine", 0.025, 0.07]],
    success: [[523, 0.1, "triangle", 0.04], [784, 0.12, "triangle", 0.035, 0.09], [1046, 0.15, "sine", 0.025, 0.18]],
    fail: [[196, 0.16, "sawtooth", 0.035], [130, 0.22, "sawtooth", 0.025, 0.12]],
    upgrade: [[330, 0.09, "square", 0.03], [494, 0.1, "triangle", 0.03, 0.08], [659, 0.14, "sine", 0.024, 0.16]],
    rare: [[740, 0.08, "sine", 0.034], [988, 0.12, "triangle", 0.028, 0.08], [1318, 0.18, "sine", 0.02, 0.16]],
    casino: [[262, 0.06, "square", 0.03], [330, 0.06, "square", 0.026, 0.05], [392, 0.08, "triangle", 0.022, 0.1]],
    puzzle: [[294, 0.06, "triangle", 0.028], [440, 0.08, "sine", 0.018, 0.04]],
    error: [[110, 0.14, "sawtooth", 0.025]]
  };

  for (const note of patterns[type] || patterns.buy) {
    playTone(note[0], note[1], note[2], note[3], sfxGain, note[4] || 0);
  }
}

function playMusicStep() {
  if (!state.settings.music) {
    return;
  }
  ensureAudio();
  const bass = [98, 123, 147, 123, 110, 139, 165, 139];
  const lead = [392, 0, 494, 523, 440, 0, 587, 659];
  const step = musicStep % bass.length;
  playTone(bass[step], 0.34, "triangle", 0.03, musicGain);
  if (lead[step]) {
    playTone(lead[step], 0.18, "sine", 0.018, musicGain, 0.04);
  }
  musicStep += 1;
}

function startMusic() {
  if (!state.settings.music || musicTimer) {
    return;
  }
  ensureAudio();
  playMusicStep();
  musicTimer = setInterval(playMusicStep, 430);
}

function stopMusic() {
  if (musicTimer) {
    clearInterval(musicTimer);
    musicTimer = null;
  }
}

function toggleSound() {
  state.settings.sound = !state.settings.sound;
  updateAudioLevels();
  if (state.settings.sound) {
    playSfx("ready");
  }
  markDirty();
  saveGame();
  renderSettings();
}

function toggleMusic() {
  state.settings.music = !state.settings.music;
  updateAudioLevels();
  if (state.settings.music) {
    startMusic();
  } else {
    stopMusic();
  }
  markDirty();
  saveGame();
  renderSettings();
}

function setVolume(value) {
  state.settings.volume = clamp(Number(value) / 100, 0, 1);
  updateAudioLevels();
  markDirty();
  saveGame();
  renderSettings();
}

function openMenuPanel(panelName) {
  dom.menuPanelSettings.classList.toggle("is-active", panelName === "settings");
  dom.menuPanelAbout.classList.toggle("is-active", panelName === "about");
  dom.menuDialog.hidden = false;
  renderSettings();
}

function closeMenuPanel() {
  dom.menuDialog.hidden = true;
  dom.menuPanelSettings.classList.remove("is-active");
  dom.menuPanelAbout.classList.remove("is-active");
}

function startGameFromMenu() {
  dom.mainMenu.classList.add("is-hidden");
  document.body.classList.remove("menu-open");
  if (state.settings.sound || state.settings.music) {
    ensureAudio();
  }
  if (state.settings.music) {
    startMusic();
  }
  playSfx("deal");
}

function openMainMenu() {
  dom.mainMenu.classList.remove("is-hidden");
  document.body.classList.add("menu-open");
  closeMenuPanel();
}

function runRewardedStub(onReward) {
  // Замените тело этой функции на rewarded-вызов Yandex Games SDK.
  const rewarded = true;
  if (rewarded) {
    return onReward();
  }
  return false;
}

function showRewardedAdDoubleProfit() {
  return runRewardedStub(doubleLastDealProfit);
}

function showRewardedAdSaveDeal() {
  return runRewardedStub(saveFailedDeal);
}

function showRewardedAdSpeedUp() {
  return runRewardedStub(speedUpSelectedRepair);
}

function showRewardedAdRareItem() {
  return runRewardedStub(addRewardRareItem);
}

function showRewardedAdMoney() {
  return runRewardedStub(addRewardMoney);
}

function showInterstitialAd() {
  // Замените на interstitial-вызов Yandex Games SDK.
  openModal("Рекламная пауза", "Тестовая межстраничная реклама. В SDK здесь будет реальный interstitial.", [
    { text: "Продолжить", className: "primary", action: closeModal }
  ]);
  setTimeout(() => {
    if (!dom.modal.hidden && dom.modalTitle.textContent === "Рекламная пауза") {
      closeModal();
    }
  }, 1300);
}

window.showRewardedAdDoubleProfit = showRewardedAdDoubleProfit;
window.showRewardedAdSaveDeal = showRewardedAdSaveDeal;
window.showRewardedAdSpeedUp = showRewardedAdSpeedUp;
window.showRewardedAdRareItem = showRewardedAdRareItem;
window.showRewardedAdMoney = showRewardedAdMoney;
window.showInterstitialAd = showInterstitialAd;

function maybeShowInterstitialAfterDeal() {
  if (state.stats.dealsSinceInterstitial < state.stats.interstitialEvery) {
    return;
  }

  state.stats.dealsSinceInterstitial = 0;
  state.stats.interstitialEvery = getNextInterstitialCount();

  const tryShow = () => {
    const clickIsActive = pointerIsDown || Date.now() - lastPointerAt < 750;
    if (clickIsActive || !dom.modal.hidden) {
      setTimeout(tryShow, 400);
      return;
    }
    showInterstitialAd();
  };

  setTimeout(tryShow, 900);
}

function pushEvent(text) {
  state.eventLog.unshift(text);
  state.eventLog = state.eventLog.slice(0, 16);
}

function toast(text) {
  pushEvent(text);
  floatText(text);
  renderEvents();
}

function floatText(text) {
  const node = document.createElement("div");
  node.className = "float-pop";
  node.textContent = text;
  node.style.left = `${randomBetween(34, 66)}%`;
  node.style.top = `${randomBetween(86, 180)}px`;
  dom.floatLayer.appendChild(node);
  setTimeout(() => node.remove(), 1200);
}

function openDealFailedModal(itemName) {
  openModal(
    "Сделка сорвалась",
    `${itemName} ушел не тому покупателю. Можно нажать тестовую rewarded-кнопку и спасти часть результата.`,
    [
      { text: "Спасти сделку", className: "primary", action: showRewardedAdSaveDeal },
      { text: "Закрыть", className: "secondary", action: closeModal }
    ]
  );
}

function openModal(title, text, actions) {
  dom.modalTitle.textContent = title;
  dom.modalText.textContent = text;
  dom.modalActions.innerHTML = "";
  modalAction = null;

  actions.forEach((action, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = action.text;
    button.className = action.className || (index === 0 ? "primary" : "secondary");
    button.dataset.actionIndex = String(index);
    dom.modalActions.appendChild(button);
  });

  modalAction = (index) => {
    const action = actions[index];
    if (action) {
      action.action();
    }
  };
  dom.modal.hidden = false;
}

function closeModal() {
  dom.modal.hidden = true;
  modalAction = null;
}

function getAutoDealType(item, level) {
  if (level >= 3 && ["rare", "epic", "legendary"].includes(item.rarity)) {
    return "legendary";
  }
  if (level >= 2 && item.rarity !== "legendary") {
    return "risky";
  }
  return "safe";
}

function getAutoRepairBoost(level) {
  return level > 0 ? 0.2 + level * 0.12 : 0;
}

function updateTimers(deltaSeconds = 0) {
  const now = Date.now();
  const autoLevel = getUpgradeLevel("autoDealer");
  for (const item of [...state.inventory]) {
    if (item.status === "repairing" && autoLevel > 0 && deltaSeconds > 0) {
      item.readyAt -= deltaSeconds * 1000 * getAutoRepairBoost(autoLevel);
    }
    if (item.status === "repairing" && now >= item.readyAt) {
      item.status = "ready";
      pushEvent(`${item.name} отремонтирован и готов к продаже.`);
      if (Math.random() < 0.08) {
        const bonus = Math.round(item.value * 0.08);
        item.value += bonus;
        pushEvent(`Срочный покупатель поднял цену на ${formatMoney(bonus)}.`);
      }
      if (autoLevel > 0) {
        item.autoSellAt = now + Math.max(700, 2200 - autoLevel * 420);
        pushEvent(`Автосделочник взял ${item.name} в работу.`);
      }
      playSfx("ready");
      markDirty();
    }
    if (item.status === "ready" && autoLevel > 0) {
      if (!item.autoSellAt) {
        item.autoSellAt = now + Math.max(700, 2200 - autoLevel * 420);
      }
      if (now >= item.autoSellAt) {
        startDealForItem(item, getAutoDealType(item, autoLevel), true);
      }
    }
    if (item.status === "dealing" && item.deal && now >= item.deal.endsAt) {
      resolveDeal(item);
    }
  }

  if (state.failedDeal && Date.now() > state.failedDeal.expiresAt && !state.failedDeal.saved) {
    state.failedDeal = null;
  }
  if (state.lastDeal && Date.now() - state.lastDeal.createdAt > LAST_DEAL_BONUS_MS && state.lastDeal.doubled) {
    state.lastDeal = null;
  }
}

function applyPassiveIncome(deltaSeconds) {
  const income = getPassiveIncomePerSecond();
  if (income <= 0) {
    return;
  }

  const amount = income * deltaSeconds;
  state.money += amount;
  passiveFloatBank += amount;

  if (passiveFloatBank >= Math.max(10, income * 5)) {
    floatText(`+${formatMoney(passiveFloatBank)}`);
    passiveFloatBank = 0;
  }
}

function gameLoop(now) {
  const deltaSeconds = Math.min(1, (now - lastFrame) / 1000);
  lastFrame = now;
  updateTimers(deltaSeconds);
  updateCasino();
  applyPassiveIncome(deltaSeconds);
  render();

  if (Date.now() - lastAutosave > AUTOSAVE_MS) {
    lastAutosave = Date.now();
    saveGame();
  }

  requestAnimationFrame(gameLoop);
}

function render() {
  renderStats();
  renderCurrentItem();
  renderDealButtons();
  renderMarket();
  renderCasino();
  renderPuzzle();
  renderInventory();
  renderRewards();
  renderGarageUpgrade();
  renderBusiness();
  renderPanels();
  renderUpgrades();
  renderMegaProjects();
  renderCollection();
  renderSettings();
  renderEvents();
}

function renderStats() {
  dom.money.textContent = formatMoney(state.money);
  if (Math.abs(state.money - lastRenderedMoney) >= 1 && Date.now() - lastMoneyPulseAt > 350) {
    dom.money.classList.remove("money-bump");
    void dom.money.offsetWidth;
    dom.money.classList.add("money-bump");
    lastMoneyPulseAt = Date.now();
  }
  lastRenderedMoney = state.money;
  dom.reputation.textContent = Math.floor(state.reputation).toLocaleString("ru-RU");
  dom.garageLevel.textContent = `${state.garageLevel} ур.`;
  dom.passiveIncome.textContent = `${formatMoney(getPassiveIncomePerSecond())}/с`;
  dom.marketName.textContent = marketNames[state.garageLevel - 1] || marketNames[0];
  dom.capacityText.textContent = `${state.inventory.length} / ${getCapacity()} мест`;
}

function renderCurrentItem() {
  const item = getCurrentItem();
  const now = Date.now();

  if (!item) {
    if (dom.currentItemCard.className !== "current-item is-empty") {
      dom.currentItemCard.className = "current-item is-empty";
    }
    dom.currentItemImage.src = "./assets/box.svg";
    dom.currentItemName.textContent = "Свободное место в гараже";
    dom.currentItemRarity.textContent = "Пусто";
    dom.currentItemRarity.className = "rarity-chip rarity-common";
    dom.currentItemInfo.textContent = "Купите товар, дождитесь ремонта и выберите риск сделки.";
    dom.progressLabel.textContent = "Готов к закупке";
    dom.progressTime.textContent = "0с";
    dom.itemProgress.style.width = "0%";
    dom.buyBtn.disabled = state.inventory.length >= getCapacity();
    return;
  }

  dom.currentItemImage.src = item.image;
  const itemCardClass = `current-item is-${item.status}`;
  if (dom.currentItemCard.className !== itemCardClass) {
    dom.currentItemCard.className = itemCardClass;
  }
  dom.currentItemName.textContent = item.name;
  dom.currentItemRarity.textContent = item.rarityName;
  dom.currentItemRarity.className = `rarity-chip rarity-${item.rarity}`;
  dom.currentItemInfo.textContent = `${formatMoney(item.cost)} закупка · оценка ${formatMoney(item.value)} · ${getStatusText(item)}`;
  dom.buyBtn.disabled = state.inventory.length >= getCapacity();

  if (item.status === "repairing") {
    const left = item.readyAt - now;
    const elapsed = item.repairDuration - left;
    dom.progressLabel.textContent = "Ремонт";
    dom.progressTime.textContent = formatTime(left);
    dom.itemProgress.style.width = `${clamp((elapsed / item.repairDuration) * 100, 0, 100)}%`;
  } else if (item.status === "dealing" && item.deal) {
    const left = item.deal.endsAt - now;
    const elapsed = item.deal.duration - left;
    dom.progressLabel.textContent = `${item.deal.title} сделка`;
    dom.progressTime.textContent = formatTime(left);
    dom.itemProgress.style.width = `${clamp((elapsed / item.deal.duration) * 100, 0, 100)}%`;
  } else {
    dom.progressLabel.textContent = "Готов к продаже";
    dom.progressTime.textContent = "готово";
    dom.itemProgress.style.width = "100%";
  }
}

function getStatusText(item) {
  if (item.status === "repairing") {
    return "ремонт";
  }
  if (item.status === "dealing") {
    return "идет сделка";
  }
  return "готов к сделке";
}

function renderDealButtons() {
  const item = getCurrentItem();
  const ready = !!item && item.status === "ready";
  document.querySelectorAll("[data-deal]").forEach((button) => {
    button.disabled = !ready;
  });

  dom.safeDealInfo.textContent = getDealInfoText(item, "safe");
  dom.riskyDealInfo.textContent = getDealInfoText(item, "risky");
  dom.legendaryDealInfo.textContent = getDealInfoText(item, "legendary");
}

function getDealInfoText(item, type) {
  const market = getMarketEffect(item);
  const chance = Math.round(clamp(getSuccessChance(type) + market.success, 0.05, 0.99) * 100);
  if (!item) {
    return `${chance}% успеха`;
  }
  const config = dealConfigs[type];
  const sale = Math.round(item.value * config.saleMultiplier * (1 + market.profit));
  const profit = Math.max(1, sale - item.cost);
  return `${chance}% · прибыль около ${formatShortMoney(profit)}`;
}

function renderMarket() {
  const trend = getCurrentMarketTrend();
  const active = state.market.expiresAt > Date.now();
  const left = state.market.expiresAt - Date.now();
  dom.marketTrendTitle.textContent = trend.title;
  dom.marketTrendText.textContent = trend.text;
  const profit = active ? trend.profit : 0;
  const success = active ? trend.success : 0;
  dom.marketProfit.textContent = `${profit >= 0 ? "+" : ""}${Math.round(profit * 100)}% цена`;
  dom.marketRisk.textContent = `${success >= 0 ? "+" : ""}${Math.round(success * 100)}% успех`;
  dom.marketTimer.textContent = active ? `ещё ${formatTime(left)}` : "нужна сводка";
  const cost = getAnalyzedCost();
  dom.analyzeMarketBtn.textContent = `Изучить рынок · ${formatShortMoney(cost)}`;
  dom.analyzeMarketBtn.disabled = state.money < cost;
}

function renderCasino() {
  dom.rouletteResult.textContent = state.casino.rouletteLast || "Ставка ждёт";
  const rouletteBet = parseBet(dom.rouletteBetInput);
  const rouletteDisabled = state.money < 10 || state.money < rouletteBet;
  document.querySelectorAll("[data-roulette]").forEach((button) => {
    button.disabled = rouletteDisabled;
  });

  const crash = state.casino.crash;
  if (crash?.active) {
    const multiplier = getCrashMultiplier(crash);
    const progress = clamp((multiplier - 1) / Math.max(1, crash.crashPoint - 1), 0, 1);
    dom.crashMultiplier.textContent = `${multiplier.toFixed(2)}x`;
    dom.crashStatus.textContent = `летит · ставка ${formatMoney(crash.bet)}`;
    dom.rocketWindow.className = "rocket-window is-flying";
    dom.rocketIcon.style.transform = `translate(${progress * 160}px, ${-progress * 86}px) rotate(42deg)`;
    dom.launchRocketBtn.disabled = true;
    dom.cashoutRocketBtn.disabled = false;
    dom.cashoutRocketBtn.textContent = `Забрать ${formatShortMoney(crash.bet * multiplier)}`;
  } else {
    dom.crashMultiplier.textContent = "1.00x";
    dom.crashStatus.textContent = state.casino.crashLast || "Готова к запуску";
    dom.rocketWindow.className = state.casino.crashLast?.includes("Упала") ? "rocket-window is-crashed" : "rocket-window";
    dom.rocketIcon.style.transform = "";
    dom.launchRocketBtn.disabled = state.money < parseBet(dom.crashBetInput);
    dom.cashoutRocketBtn.disabled = true;
    dom.cashoutRocketBtn.textContent = "Забрать";
  }
}

function renderPuzzle() {
  const puzzle = state.puzzle;
  const cost = getPuzzleCost();
  const hintCost = getPuzzleHintCost();
  const activeCount = puzzle.board.filter(Boolean).length;

  dom.puzzleStreak.textContent = `серия ${puzzle.streak}`;
  dom.puzzleStatus.textContent = puzzle.active
    ? `Включено ${activeCount} из 9 контактов`
    : (puzzle.lastReward || "Купите схему и включите все контакты.");
  dom.puzzleMoves.textContent = puzzle.active
    ? `Ходов: ${puzzle.movesLeft}`
    : `Решено: ${puzzle.solvedTotal}`;
  dom.puzzleReward.textContent = puzzle.active
    ? `Награда около ${formatShortMoney(getPuzzleReward())}`
    : (puzzle.lastReward || "Награда растёт с серией.");
  dom.newPuzzleBtn.textContent = puzzle.active ? "Схема открыта" : `Купить схему · ${formatShortMoney(cost)}`;
  dom.newPuzzleBtn.disabled = puzzle.active || state.money < cost;
  dom.puzzleHintBtn.textContent = `Подсказка · ${formatShortMoney(hintCost)}`;
  dom.puzzleHintBtn.disabled = !puzzle.active || state.money < hintCost;

  const signature = `${puzzle.active ? 1 : 0}|${puzzle.board.join("")}|${puzzle.movesLeft}|${puzzle.hintTile}|${state.money >= cost ? 1 : 0}|${state.money >= hintCost ? 1 : 0}`;
  if (renderCache.puzzle === signature) {
    return;
  }
  renderCache.puzzle = signature;
  dom.puzzleGrid.innerHTML = "";

  puzzle.board.forEach((isOn, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `puzzle-tile ${isOn ? "is-on" : ""} ${puzzle.hintTile === index ? "is-hint" : ""}`;
    button.dataset.puzzleTile = String(index);
    button.disabled = !puzzle.active;
    button.setAttribute("aria-label", `Контакт ${index + 1}`);
    button.textContent = isOn ? "●" : "○";
    dom.puzzleGrid.appendChild(button);
  });
}

function renderInventory() {
  dom.inventoryHint.textContent = `${state.inventory.length} из ${getCapacity()} мест`;
  const signature = JSON.stringify(state.inventory.map((item) => [
    item.uid,
    item.itemId,
    item.status,
    item.rarityName,
    item.uid === state.selectedItemId
  ])) + `|${getCapacity()}`;

  if (renderCache.inventory !== signature) {
    renderCache.inventory = signature;
    dom.inventoryList.innerHTML = "";

    if (!state.inventory.length) {
      const empty = document.createElement("p");
      empty.className = "inventory-empty";
      empty.textContent = "Склад пуст. Пора охотиться за странными лотами.";
      dom.inventoryList.appendChild(empty);
    }

    for (const item of state.inventory) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `inventory-item is-${item.status} ${item.uid === state.selectedItemId ? "is-selected" : ""}`;
      button.dataset.itemId = item.uid;

      const img = document.createElement("img");
      img.src = item.image;
      img.alt = "";

      const text = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = item.name;
      const status = document.createElement("span");
      status.dataset.statusItem = item.uid;
      status.textContent = getInventoryStatus(item);
      text.append(title, status);

      button.append(img, text);
      dom.inventoryList.appendChild(button);
    }
  }

  for (const item of state.inventory) {
    const status = dom.inventoryList.querySelector(`[data-status-item="${item.uid}"]`);
    if (status) {
      status.textContent = getInventoryStatus(item);
    }
  }
}

function getInventoryStatus(item) {
  if (item.status === "repairing") {
    return `Ремонт ${formatTime(item.readyAt - Date.now())}`;
  }
  if (item.status === "dealing") {
    return `Сделка ${formatTime(item.deal.endsAt - Date.now())}`;
  }
  return `Готов · ${item.rarityName}`;
}

function renderRewards() {
  const item = getCurrentItem();
  const lastDealActive = state.lastDeal
    && !state.lastDeal.doubled
    && Date.now() - state.lastDeal.createdAt <= LAST_DEAL_BONUS_MS;
  const failedActive = state.failedDeal
    && !state.failedDeal.saved
    && Date.now() <= state.failedDeal.expiresAt;

  dom.doubleProfitBtn.disabled = !lastDealActive;
  dom.saveDealBtn.disabled = !failedActive;
  dom.speedUpBtn.disabled = !(item && item.status === "repairing");
  dom.rareItemBtn.disabled = state.inventory.length >= getCapacity();
}

function renderGarageUpgrade() {
  if (state.garageLevel >= 5) {
    dom.garageUpgradeHint.textContent = "Гараж на максимуме";
    dom.upgradeGarageBtn.textContent = "Гараж максимум";
    dom.upgradeGarageBtn.disabled = true;
    return;
  }

  const req = garageRequirements[state.garageLevel];
  dom.garageUpgradeHint.textContent = `Нужно ${formatMoney(req.money)} и ${req.reputation} реп.`;
  dom.upgradeGarageBtn.textContent = `Гараж ${state.garageLevel + 1} ур.`;
  dom.upgradeGarageBtn.disabled = state.money < req.money || state.reputation < req.reputation;
}

function getAutoDealerDescription(level) {
  if (level <= 0) {
    return "После покупки ускоряет ремонт и сам запускает безопасные продажи.";
  }
  if (level === 1) {
    return "Авточинит товары и продает их безопасными сделками.";
  }
  if (level === 2) {
    return "Авточинит быстрее и часто выбирает рискованные сделки.";
  }
  return "Максимум автоматики: редкие товары уходят в легендарные сделки.";
}

function renderBusiness() {
  const helpers = getUpgradeLevel("helpers");
  const activeCrew = crewRoles.map((role) => `${role.id}:${role.req() ? 1 : 0}`).join("|");
  const signature = `${state.garageLevel}|${helpers}|${getCapacity()}|${activeCrew}`;
  dom.businessRank.textContent = warehouses[state.garageLevel - 1]?.title || "Империя";

  if (renderCache.business === signature) {
    return;
  }
  renderCache.business = signature;
  dom.warehouseList.innerHTML = "";
  dom.crewList.innerHTML = "";

  for (const warehouse of warehouses) {
    const locked = warehouse.level > state.garageLevel;
    const node = document.createElement("div");
    node.className = `warehouse-card ${warehouse.level === state.garageLevel ? "is-current" : ""} ${locked ? "is-locked" : ""}`;

    const icon = document.createElement("div");
    icon.className = "warehouse-icon";
    icon.textContent = warehouse.icon;

    const text = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = warehouse.title;
    const desc = document.createElement("p");
    desc.textContent = locked ? `Откроется на ${warehouse.level} уровне гаража.` : warehouse.desc;
    text.append(title, desc);

    const tag = document.createElement("strong");
    tag.textContent = locked ? `${warehouse.level} ур.` : warehouse.tag;

    node.append(icon, text, tag);
    dom.warehouseList.appendChild(node);
  }

  for (const role of crewRoles) {
    const active = role.req();
    const node = document.createElement("div");
    node.className = `crew-card ${active ? "is-active" : ""}`;
    const title = document.createElement("strong");
    title.textContent = active ? role.name : "Место свободно";
    const desc = document.createElement("span");
    desc.textContent = active ? role.desc : `Наймите: ${role.name}`;
    node.append(title, desc);
    dom.crewList.appendChild(node);
  }
}

function renderUpgrades() {
  const signature = upgradeDefs.map((def) => {
    const level = getUpgradeLevel(def.id);
    const maxed = level >= def.max;
    const cost = getUpgradeCost(def);
    return `${def.id}:${level}:${cost}:${maxed ? 1 : 0}:${state.money >= cost ? 1 : 0}`;
  }).join("|");
  if (renderCache.upgrades === signature) {
    return;
  }
  renderCache.upgrades = signature;
  dom.upgradeList.innerHTML = "";
  for (const def of upgradeDefs) {
    const level = getUpgradeLevel(def.id);
    const maxed = level >= def.max;
    const cost = getUpgradeCost(def);
    const affordable = state.money >= cost && !maxed;
    const row = document.createElement("div");
    row.className = `upgrade-card ${maxed ? "is-max" : ""} ${affordable ? "is-affordable" : "is-locked"}`;
    row.dataset.upgrade = def.id;
    row.setAttribute("role", "button");
    row.setAttribute("tabindex", "0");
    row.setAttribute("aria-disabled", String(maxed));

    const text = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = `${def.title} · ${level}/${def.max}`;
    const desc = document.createElement("p");
    desc.textContent = def.id === "autoDealer" ? getAutoDealerDescription(level) : def.desc;
    text.append(title, desc);

    const button = document.createElement("button");
    button.type = "button";
    button.disabled = maxed || state.money < cost;
    button.textContent = maxed ? "Макс" : formatShortMoney(cost);

    row.append(text, button);
    dom.upgradeList.appendChild(row);
  }
}

function renderMegaProjects() {
  dom.empireRank.textContent = getEmpireRankText();
  const signature = megaProjectDefs.map((def) => {
    const level = getMegaLevel(def.id);
    const maxed = level >= def.max;
    const locked = state.garageLevel < def.minGarage;
    const cost = getMegaProjectCost(def);
    return `${def.id}:${level}:${cost}:${locked ? 1 : 0}:${maxed ? 1 : 0}:${state.money >= cost ? 1 : 0}`;
  }).join("|");
  if (renderCache.megaprojects === signature) {
    return;
  }
  renderCache.megaprojects = signature;
  dom.megaprojectList.innerHTML = "";

  for (const def of megaProjectDefs) {
    const level = getMegaLevel(def.id);
    const maxed = level >= def.max;
    const locked = state.garageLevel < def.minGarage;
    const cost = getMegaProjectCost(def);
    const affordable = !locked && !maxed && state.money >= cost;
    const row = document.createElement("div");
    row.className = `mega-card ${locked ? "is-locked" : ""} ${affordable ? "is-affordable" : ""} ${maxed ? "is-max" : ""}`;
    row.dataset.megaproject = def.id;

    const text = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = `${def.title} · ${level}/${def.max}`;
    const desc = document.createElement("p");
    desc.textContent = locked ? `Откроется на ${def.minGarage} уровне гаража.` : def.desc;
    text.append(title, desc);

    const button = document.createElement("button");
    button.type = "button";
    button.disabled = locked || maxed || state.money < cost;
    button.textContent = locked ? `${def.minGarage} ур.` : maxed ? "Достроено" : formatShortMoney(cost);

    row.append(text, button);
    dom.megaprojectList.appendChild(row);
  }
}

function renderPanels() {
  syncPanel("upgrades", dom.upgradeSection, dom.upgradePanelBtn);
  syncPanel("megaprojects", dom.megaprojectSection, dom.megaprojectPanelBtn);
  syncPanel("events", dom.eventSection, dom.eventPanelBtn);
}

function syncPanel(name, section, button) {
  const open = !!panels[name];
  section.classList.toggle("is-collapsed", !open);
  button.textContent = open ? "Свернуть" : "Открыть";
  button.setAttribute("aria-expanded", String(open));
}

function togglePanel(name) {
  panels[name] = !panels[name];
  renderPanels();
  playSfx("deal");
}

function renderCollection() {
  const found = collectionItems.filter((item) => state.collection[item.id]).length;
  dom.collectionCount.textContent = `${found} / ${collectionItems.length}`;
  const signature = JSON.stringify(state.collection);
  if (renderCache.collection === signature) {
    return;
  }
  renderCache.collection = signature;
  dom.collectionGrid.innerHTML = "";

  for (const item of collectionItems) {
    const unlocked = !!state.collection[item.id];
    const node = document.createElement("div");
    node.className = `collection-item ${unlocked ? "is-found" : ""}`;

    const img = document.createElement("img");
    img.src = item.image;
    img.alt = "";
    const label = document.createElement("span");
    label.textContent = unlocked ? item.name : "Не найдено";

    node.append(img, label);
    dom.collectionGrid.appendChild(node);
  }
}

function renderSettings() {
  const volume = Math.round(state.settings.volume * 100);
  const signature = `${state.settings.sound}|${state.settings.music}|${volume}|${audioCtx ? 1 : 0}`;
  if (renderCache.settings === signature) {
    return;
  }
  renderCache.settings = signature;

  dom.menuSoundToggleBtn.textContent = `Звуки: ${state.settings.sound ? "вкл" : "выкл"}`;
  dom.menuMusicToggleBtn.textContent = `Музыка: ${state.settings.music ? "вкл" : "выкл"}`;
  dom.menuSoundToggleBtn.classList.toggle("is-off", !state.settings.sound);
  dom.menuMusicToggleBtn.classList.toggle("is-off", !state.settings.music);

  dom.menuVolumeSlider.value = String(volume);
  dom.menuVolumeValue.textContent = `${volume}%`;
}

function renderEvents() {
  dom.eventSummary.textContent = state.eventLog[0] || "Жизнь гаража";
  const signature = state.eventLog.slice(0, 8).join("|");
  if (renderCache.events === signature) {
    return;
  }
  renderCache.events = signature;
  dom.eventLog.innerHTML = "";
  for (const event of state.eventLog.slice(0, 8)) {
    const li = document.createElement("li");
    li.textContent = event;
    dom.eventLog.appendChild(li);
  }
}

dom.buyBtn.addEventListener("click", buyItem);
dom.upgradeGarageBtn.addEventListener("click", upgradeGarage);
dom.doubleProfitBtn.addEventListener("click", showRewardedAdDoubleProfit);
dom.saveDealBtn.addEventListener("click", showRewardedAdSaveDeal);
dom.speedUpBtn.addEventListener("click", showRewardedAdSpeedUp);
dom.rareItemBtn.addEventListener("click", showRewardedAdRareItem);
dom.adMoneyBtn.addEventListener("click", showRewardedAdMoney);
dom.adCashBtn.addEventListener("click", showRewardedAdMoney);
dom.analyzeMarketBtn.addEventListener("click", analyzeMarket);
document.querySelectorAll("[data-roulette]").forEach((button) => {
  button.addEventListener("click", () => playRoulette(button.dataset.roulette));
});
dom.launchRocketBtn.addEventListener("click", launchRocket);
dom.cashoutRocketBtn.addEventListener("click", cashoutRocket);
dom.newPuzzleBtn.addEventListener("click", buyPuzzleScheme);
dom.puzzleHintBtn.addEventListener("click", buyPuzzleHint);
dom.upgradePanelBtn.addEventListener("click", () => togglePanel("upgrades"));
dom.megaprojectPanelBtn.addEventListener("click", () => togglePanel("megaprojects"));
dom.eventPanelBtn.addEventListener("click", () => togglePanel("events"));
dom.playBtn.addEventListener("click", startGameFromMenu);
dom.openMenuBtn.addEventListener("click", openMainMenu);
dom.menuSoundToggleBtn.addEventListener("click", toggleSound);
dom.menuMusicToggleBtn.addEventListener("click", toggleMusic);
dom.menuVolumeSlider.addEventListener("input", (event) => setVolume(event.target.value));
dom.menuDialogCloseBtn.addEventListener("click", closeMenuPanel);

document.querySelectorAll("[data-menu-panel]").forEach((button) => {
  button.addEventListener("click", () => openMenuPanel(button.dataset.menuPanel));
});

document.querySelectorAll("[data-deal]").forEach((button) => {
  button.addEventListener("click", () => startDeal(button.dataset.deal));
});

dom.inventoryList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-item-id]");
  if (!button) {
    return;
  }
  state.selectedItemId = button.dataset.itemId;
  markDirty();
  render();
});

dom.upgradeList.addEventListener("click", (event) => {
  const upgradeCard = event.target.closest("[data-upgrade]");
  if (!upgradeCard) {
    return;
  }
  buyUpgrade(upgradeCard.dataset.upgrade);
});

dom.upgradeList.addEventListener("keydown", (event) => {
  const upgradeCard = event.target.closest("[data-upgrade]");
  if (!upgradeCard || (event.key !== "Enter" && event.key !== " ")) {
    return;
  }
  event.preventDefault();
  buyUpgrade(upgradeCard.dataset.upgrade);
});

dom.megaprojectList.addEventListener("click", (event) => {
  const card = event.target.closest("[data-megaproject]");
  if (!card) {
    return;
  }
  buyMegaProject(card.dataset.megaproject);
});

dom.puzzleGrid.addEventListener("click", (event) => {
  const tile = event.target.closest("[data-puzzle-tile]");
  if (!tile) {
    return;
  }
  handlePuzzleTile(Number(tile.dataset.puzzleTile));
});

dom.modalActions.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action-index]");
  if (!button || !modalAction) {
    return;
  }
  modalAction(Number(button.dataset.actionIndex));
});

window.addEventListener("pointerdown", () => {
  pointerIsDown = true;
  lastPointerAt = Date.now();
  if (state.settings.sound || state.settings.music) {
    ensureAudio();
  }
  if (state.settings.music) {
    startMusic();
  }
});

window.addEventListener("pointerup", () => {
  pointerIsDown = false;
  lastPointerAt = Date.now();
});

window.addEventListener("beforeunload", saveGame);

render();
requestAnimationFrame(gameLoop);
