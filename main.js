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

const recordDefs = [
  { id: "darkrock", title: "Dark Rock", author: "godlikelove", src: "./assets/music/dark-rock.mp3", value: 980 },
  { id: "cheapyblues", title: "Cheapy Blues", author: "godlikelove", src: "./assets/music/cheapy-blues.mp3", value: 1280 },
  { id: "countrylove", title: "Country Love", author: "godlikelove", src: "./assets/music/country-love.mp3", value: 1680 },
  { id: "sunflower", title: "The Sunflower", author: "godlikelove", src: "./assets/music/the-sunflower.mp3", value: 2200 },
  { id: "richman", title: "Born To Be RIchMan", author: "godlikelove", src: "./assets/music/born-to-be-richman.wav", value: 3200 }
];

const duelBosses = [
  { id: "arsen", name: "Арсен «Тбилисская тень»", hp: 98, aim: 14, guard: 9, ammo: 6, reward: 4200, pattern: ["aim", "shoot", "cover", "rush", "bait"] },
  { id: "konchik", name: "Константин «Кончик» Молотов", hp: 118, aim: 16, guard: 12, ammo: 6, reward: 6500, pattern: ["cover", "aim", "shoot", "reload", "rush"] },
  { id: "robot", name: "Роберт «Сухой курок» Бруклинский", hp: 90, aim: 20, guard: 6, ammo: 7, reward: 5600, pattern: ["aim", "shoot", "shoot", "reload", "bait"] },
  { id: "marquis", name: "Маркиз Ночной Доли", hp: 132, aim: 15, guard: 14, ammo: 6, reward: 9200, pattern: ["bait", "cover", "aim", "shoot", "rush"] },
  { id: "baron", name: "Барон «Чёрный саксофон»", hp: 146, aim: 18, guard: 16, ammo: 8, reward: 13500, pattern: ["cover", "bait", "shoot", "aim", "rush", "reload"] }
];

const gunSkinDefs = [
  { id: "starter", title: "Гаражный ствол", cost: 0, power: 1, guard: 0, ammo: 6, reload: 3, color: "#d8d0c7", accent: "#303030" },
  { id: "chrome", title: "Хромовый блюз", cost: 9500, power: 1.08, guard: 1, ammo: 6, reload: 3, color: "#58a6ff", accent: "#dcecff" },
  { id: "gold", title: "Золотой переговорщик", cost: 42000, power: 1.18, guard: 2, ammo: 7, reload: 4, color: "#ffc44d", accent: "#241100" },
  { id: "midnight", title: "Полночный лак", cost: 115000, power: 1.28, guard: 4, ammo: 7, reload: 4, color: "#aa7cff", accent: "#17110e" },
  { id: "bluesnake", title: "Синий змей", cost: 240000, power: 1.38, guard: 5, ammo: 8, reload: 5, color: "#2fd0c4", accent: "#081918" },
  { id: "bossmark", title: "Печать босса", cost: 520000, power: 1.5, guard: 7, ammo: 9, reload: 5, color: "#ff6363", accent: "#ffc44d" }
];

const carSkinDefs = [
  { id: "garage", title: "Гаражная классика", cost: 0, speed: 1, handling: 1, armor: 1, reward: 1, color: "#ff6363", accent: "#fff7ed" },
  { id: "neon", title: "Неоновый универсал", cost: 18000, speed: 1.06, handling: 1.08, armor: 1, reward: 1.08, color: "#2fd0c4", accent: "#17110e" },
  { id: "retro", title: "Ретро-купе бутлегера", cost: 69000, speed: 1.12, handling: 1.12, armor: 1.1, reward: 1.18, color: "#ffc44d", accent: "#241100" },
  { id: "shadow", title: "Теневой болид", cost: 180000, speed: 1.2, handling: 1.22, armor: 1.08, reward: 1.32, color: "#aa7cff", accent: "#100820" },
  { id: "capone", title: "Капоне седан", cost: 360000, speed: 1.16, handling: 1.05, armor: 1.55, reward: 1.45, color: "#111111", accent: "#ffc44d" },
  { id: "tommy", title: "Томми-родстер", cost: 720000, speed: 1.32, handling: 1.28, armor: 1.18, reward: 1.7, color: "#3b0d0d", accent: "#d8d0c7" },
  { id: "godfather", title: "Крёстный лимузин", cost: 1400000, speed: 1.24, handling: 1.12, armor: 2, reward: 2.05, color: "#050505", accent: "#aa7cff" },
  { id: "speakeasy", title: "Speakeasy Phantom", cost: 2600000, speed: 1.45, handling: 1.38, armor: 1.35, reward: 2.45, color: "#0b2530", accent: "#2fd0c4" }
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
  records: {
    owned: {},
    activeId: null,
    uploadedNames: {}
  },
  duels: {
    active: null,
    wins: 0,
    losses: 0,
    selectedGunSkin: "starter",
    ownedGunSkins: { starter: true },
    lastText: "Выбери дуэль и проверь нервы."
  },
  races: {
    active: false,
    x: 180,
    y: 462,
    speed: 0,
    angle: 0,
    drift: 0,
    heat: 0,
    damage: 0,
    distance: 0,
    bestDistance: 0,
    selectedCarSkin: "garage",
    ownedCarSkins: { garage: true },
    lastReward: 0,
    lastText: "Дорога ждёт ночного рейдера."
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
  records: "",
  gunSkins: "",
  carSkins: "",
  business: "",
  collection: "",
  events: "",
  settings: ""
};

const panels = {
  music: false,
  business: false,
  collection: false,
  upgrades: false,
  megaprojects: false,
  events: false
};

let activeView = "business";
let raceCtx = null;
let raceObstacleId = 0;
const raceInput = {
  steer: 0,
  throttle: 0,
  brake: 0
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
  businessView: document.getElementById("businessView"),
  duelView: document.getElementById("duelView"),
  raceView: document.getElementById("raceView"),
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
  musicSection: document.getElementById("musicSection"),
  musicPanelBtn: document.getElementById("musicPanelBtn"),
  recordCount: document.getElementById("recordCount"),
  tapeDeckDrop: document.getElementById("tapeDeckDrop"),
  tapeDeckTitle: document.getElementById("tapeDeckTitle"),
  tapeDeckStatus: document.getElementById("tapeDeckStatus"),
  stopRecordBtn: document.getElementById("stopRecordBtn"),
  bluesAudio: document.getElementById("bluesAudio"),
  recordRack: document.getElementById("recordRack"),
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
  businessSection: document.getElementById("businessSection"),
  businessPanelBtn: document.getElementById("businessPanelBtn"),
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
  collectionSection: document.getElementById("collectionSection"),
  collectionPanelBtn: document.getElementById("collectionPanelBtn"),
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
  modalActions: document.getElementById("modalActions"),
  startDuelBtn: document.getElementById("startDuelBtn"),
  duelPlayerName: document.getElementById("duelPlayerName"),
  duelPlayerHp: document.getElementById("duelPlayerHp"),
  duelPlayerFocus: document.getElementById("duelPlayerFocus"),
  duelBossName: document.getElementById("duelBossName"),
  duelBossHp: document.getElementById("duelBossHp"),
  duelBossFocus: document.getElementById("duelBossFocus"),
  duelStatus: document.getElementById("duelStatus"),
  duelFlash: document.getElementById("duelFlash"),
  playerPistolView: document.getElementById("playerPistolView"),
  gunSkinName: document.getElementById("gunSkinName"),
  gunSkinList: document.getElementById("gunSkinList"),
  startRaceBtn: document.getElementById("startRaceBtn"),
  raceCanvas: document.getElementById("raceCanvas"),
  raceDistance: document.getElementById("raceDistance"),
  raceBest: document.getElementById("raceBest"),
  raceReward: document.getElementById("raceReward"),
  raceLeftBtn: document.getElementById("raceLeftBtn"),
  raceRightBtn: document.getElementById("raceRightBtn"),
  raceGasBtn: document.getElementById("raceGasBtn"),
  raceBrakeBtn: document.getElementById("raceBrakeBtn"),
  carSkinName: document.getElementById("carSkinName"),
  carSkinList: document.getElementById("carSkinList")
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
  merged.records = { ...emptyState.records, ...(saved.records || {}) };
  merged.records.owned = { ...emptyState.records.owned, ...(saved.records?.owned || {}) };
  merged.records.uploadedNames = { ...emptyState.records.uploadedNames, ...(saved.records?.uploadedNames || {}) };
  const recordIds = new Set(recordDefs.map((record) => record.id));
  for (const id of Object.keys(merged.records.owned)) {
    if (!recordIds.has(id)) {
      delete merged.records.owned[id];
    }
  }
  if (merged.records.activeId && !recordIds.has(merged.records.activeId)) {
    merged.records.activeId = null;
  }
  merged.duels = { ...emptyState.duels, ...(saved.duels || {}) };
  merged.duels.ownedGunSkins = { ...emptyState.duels.ownedGunSkins, ...(saved.duels?.ownedGunSkins || {}) };
  if (merged.duels.active) {
    merged.duels.active = null;
    merged.duels.lastText = "Дуэль перенесена. Можно начать новую.";
  }
  merged.races = { ...emptyState.races, ...(saved.races || {}) };
  merged.races.ownedCarSkins = { ...emptyState.races.ownedCarSkins, ...(saved.races?.ownedCarSkins || {}) };
  merged.races.active = false;
  merged.races.obstacles = [];
  if (!Number.isFinite(merged.races.x)) {
    merged.races.x = emptyState.races.x;
  }
  if (!Number.isFinite(merged.races.y)) {
    merged.races.y = emptyState.races.y;
  }
  if (!Number.isFinite(merged.races.speed)) {
    merged.races.speed = 0;
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

function getRecordDef(id) {
  return recordDefs.find((record) => record.id === id) || recordDefs[0];
}

function getOwnedRecordCount() {
  return recordDefs.filter((record) => state.records.owned[record.id]).length;
}

function getRecordValue(record) {
  return Math.round(record.value * (1 + state.garageLevel * 0.08 + getMegaLevel("oddityMuseum") * 0.05));
}

function maybeFindRecordFromItem(itemDef) {
  const available = recordDefs.filter((record) => !state.records.owned[record.id]);
  if (!available.length) {
    return false;
  }

  const rarityBonus = itemDef.rarity === "legendary" ? 0.1 : itemDef.rarity === "epic" ? 0.06 : itemDef.rarity === "rare" ? 0.035 : 0;
  const chance = 0.16 + rarityBonus + getUpgradeLevel("rareSearch") * 0.012;
  if (Math.random() > chance) {
    return false;
  }

  const record = available[Math.floor(Math.random() * available.length)];
  openRecordFoundModal(record);
  return true;
}

function keepRecord(id, playNow = false) {
  const record = getRecordDef(id);
  state.records.owned[id] = {
    foundAt: Date.now(),
    title: record.title
  };
  pushEvent(`Пластинка оставлена в коллекции: ${record.title}.`);
  if (playNow) {
    playRecord(id);
  } else {
    playSfx("rare");
  }
  markDirty();
  saveGame();
  render();
  closeModal();
}

function sellFoundRecord(id) {
  const record = getRecordDef(id);
  const value = getRecordValue(record);
  state.money += value;
  pushEvent(`Пластинка продана: ${record.title}, +${formatMoney(value)}.`);
  floatText(`+${formatMoney(value)}`);
  playSfx("success");
  markDirty();
  saveGame();
  render();
  closeModal();
}

function sellOwnedRecord(id) {
  if (!state.records.owned[id]) {
    return;
  }
  const record = getRecordDef(id);
  if (state.records.activeId === id) {
    stopRecord();
  }
  delete state.records.owned[id];
  const value = getRecordValue(record);
  state.money += value;
  pushEvent(`Пластинка ушла коллекционеру: ${record.title}, +${formatMoney(value)}.`);
  floatText(`+${formatMoney(value)}`);
  playSfx("success");
  markDirty();
  saveGame();
  render();
}

function tapGarageAction(action) {
  const item = getCurrentItem();
  const labels = {
    repair: "Ключ провернул гайку.",
    spark: "Искра пошла по верстаку.",
    deal: "Покупатель услышал уверенный тон."
  };

  if (item?.status === "repairing") {
    const cut = action === "repair" ? 1200 : action === "spark" ? 850 : 520;
    item.readyAt = Math.max(Date.now() + 250, item.readyAt - cut);
    item.repairDuration = Math.max(300, item.repairDuration - Math.floor(cut * 0.35));
    floatText("ремонт быстрее");
    pushEvent(`${labels[action]} Ремонт ускорился.`);
    playSfx("puzzle");
  } else if (item?.status === "ready" && action === "deal") {
    item.value += Math.round(item.value * 0.015);
    floatText("+оценка");
    pushEvent("Мини-торг поднял оценку готового товара.");
    playSfx("success");
  } else {
    const coins = Math.round(8 + state.garageLevel * 6 + Math.random() * 12);
    state.money += coins;
    floatText(`+${formatMoney(coins)}`);
    pushEvent("На верстаке нашлась мелочь от старых сделок.");
    playSfx("buy");
  }

  markDirty();
  saveGame();
  render();
}

function openRecordFoundModal(record) {
  state.records.owned[record.id] = {
    foundAt: Date.now(),
    title: record.title
  };
  pushEvent(`В товаре нашлась блюзовая пластинка: ${record.title}.`);
  openModal(
    "Найдена пластинка",
    `На пластинке написано: «${record.title}». Можно поставить её на магнитофон, оставить на полке или продать.`,
    [
      { text: "Поставить", className: "primary", action: () => keepRecord(record.id, true) },
      { text: "Оставить", className: "secondary", action: () => keepRecord(record.id, false) },
      { text: `Продать ${formatShortMoney(getRecordValue(record))}`, className: "secondary", action: () => { sellOwnedRecord(record.id); closeModal(); } }
    ]
  );
  playSfx("rare");
}

function getRecordAudioSrc(id) {
  const record = getRecordDef(id);
  return record.src;
}

function playRecord(id) {
  if (!state.records.owned[id]) {
    toast("Этой пластинки пока нет на полке.");
    playSfx("error");
    return;
  }

  const record = getRecordDef(id);
  state.records.activeId = id;
  dom.bluesAudio.src = getRecordAudioSrc(id);
  dom.bluesAudio.loop = true;
  dom.bluesAudio.volume = clamp(state.settings.volume, 0, 1);
  const promise = dom.bluesAudio.play();
  if (promise && typeof promise.catch === "function") {
    promise.catch(() => {
      dom.tapeDeckStatus.textContent = "Положите трек в assets/music или загрузите файл.";
    });
  }
  pushEvent(`Магнитофон играет: ${record.title}.`);
  playSfx("deal");
  markDirty();
  saveGame();
  render();
}

function stopRecord() {
  dom.bluesAudio.pause();
  dom.bluesAudio.currentTime = 0;
  state.records.activeId = null;
  markDirty();
  saveGame();
  render();
}

function switchView(view) {
  activeView = view;
  dom.businessView.classList.toggle("is-active", view === "business");
  dom.duelView.classList.toggle("is-active", view === "duels");
  dom.raceView.classList.toggle("is-active", view === "races");
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === view);
  });
  if (view === "races") {
    drawRace();
  }
  playSfx("deal");
}

function getGunSkinDef(id = state.duels.selectedGunSkin) {
  return gunSkinDefs.find((skin) => skin.id === id) || gunSkinDefs[0];
}

function getCarSkinDef(id = state.races.selectedCarSkin) {
  return carSkinDefs.find((skin) => skin.id === id) || carSkinDefs[0];
}

function startDuel() {
  if (state.duels.active) {
    toast("Дуэль уже идёт.");
    playSfx("error");
    return;
  }

  const boss = duelBosses[Math.floor(Math.random() * duelBosses.length)];
  const gun = getGunSkinDef();
  state.duels.active = {
    bossId: boss.id,
    playerHp: 100,
    bossHp: boss.hp,
    playerFocus: 12,
    bossFocus: 0,
    playerCover: 0,
    bossCover: Math.round(boss.guard * 0.7),
    playerAmmo: gun.ammo,
    bossAmmo: boss.ammo || 6,
    bossIntent: "aim",
    revealedIntent: "",
    turn: 1
  };
  state.duels.active.bossIntent = chooseBossIntent(state.duels.active, boss);
  state.duels.active.revealedIntent = describeBossIntent(state.duels.active.bossIntent, boss);
  state.duels.lastText = `На линию вышел ${boss.name}.`;
  pushEvent(`Дуэль началась: ${boss.name}.`);
  playSfx("deal");
  markDirty();
  saveGame();
  render();
}

function getActiveBoss() {
  const duel = state.duels.active;
  return duelBosses.find((boss) => boss.id === duel?.bossId)
    || duelBosses.find((boss) => boss.id === state.duels.lastBossId)
    || duelBosses[0];
}

function chooseBossIntent(duel, boss) {
  if (duel.bossAmmo <= 0) {
    return "reload";
  }

  if (duel.playerAmmo <= 0 && duel.bossAmmo >= 2 && duel.turn % 2 === 0) {
    return "rush";
  }

  if (duel.bossHp < boss.hp * 0.35 && duel.turn % 3 === 0) {
    return "bait";
  }

  const pattern = boss.pattern || ["aim", "shoot", "cover", "rush", "bait"];
  let intent = pattern[(duel.turn - 1 + state.duels.wins) % pattern.length];
  if ((intent === "shoot" || intent === "rush") && duel.bossAmmo <= 0) {
    intent = "reload";
  }
  if (intent === "cover" && duel.bossCover > 46) {
    intent = "aim";
  }
  if (intent === "reload" && duel.bossAmmo >= (boss.ammo || 6)) {
    return "cover";
  }
  return intent;
}

function describeBossIntent(intent, boss) {
  const texts = {
    aim: `План босса: точный прицел. Контрход: укрыться или обойти.`,
    cover: `План босса: уйти за укрытие. Контрход: обойти.`,
    shoot: `План босса: прямой выстрел. Контрход: укрыться.`,
    rush: `План босса: резкий рывок. Контрход: выстрелить.`,
    reload: `План босса: перезарядка. Контрход: выстрелить.`,
    bait: `План босса: провокация. Контрход: считать босса.`
  };
  return texts[intent] || `${boss.name} выжидает.`;
}

function getDuelCounterScore(action, intent) {
  const strong = {
    aim: ["bait"],
    cover: ["shoot", "aim"],
    shoot: ["rush", "reload"],
    trick: ["cover"],
    reload: ["cover", "bait"]
  };
  const soft = {
    aim: ["cover"],
    cover: ["rush"],
    shoot: ["aim"],
    trick: ["aim", "reload"],
    reload: ["aim"]
  };
  const punished = {
    aim: ["rush"],
    cover: ["reload", "cover"],
    shoot: ["cover", "bait"],
    trick: ["rush", "shoot", "bait"],
    reload: ["shoot", "rush"]
  };

  if (strong[action]?.includes(intent)) {
    return 2;
  }
  if (soft[action]?.includes(intent)) {
    return 1;
  }
  if (punished[action]?.includes(intent)) {
    return -1;
  }
  return 0;
}

function getDuelActionName(action) {
  const names = {
    aim: "считывание",
    cover: "укрытие",
    shoot: "выстрел",
    trick: "обход",
    reload: "перезарядка"
  };
  return names[action] || "ход";
}

function getDuelResultName(score) {
  if (score >= 2) {
    return "идеальный контрход";
  }
  if (score === 1) {
    return "хороший ответ";
  }
  if (score < 0) {
    return "опасный ход";
  }
  return "нейтральный ход";
}

function doDuelAction(action) {
  const duel = state.duels.active;
  if (!duel) {
    toast("Сначала начните дуэль.");
    playSfx("error");
    return;
  }

  const skin = getGunSkinDef();
  const boss = getActiveBoss();
  const intent = duel.bossIntent || chooseBossIntent(duel, boss);
  const bossMaxAmmo = boss.ammo || 6;
  const score = getDuelCounterScore(action, intent);
  let bossDamage = 0;
  let playerDamage = 0;
  let playerText = "";
  let bossText = "";

  if (action === "aim") {
    const focusGain = score >= 2 ? 36 : score === 1 ? 28 : 20;
    duel.playerFocus = clamp(duel.playerFocus + focusGain, 0, 100);
    if (score >= 2) {
      bossDamage += Math.round((8 + duel.playerFocus * 0.08) * skin.power);
    } else if (score < 0) {
      playerDamage += 7;
    }
    playerText = `Ты читаешь босса: ${getDuelResultName(score)}. Фокус +${focusGain}.`;
  } else if (action === "cover") {
    const coverGain = score >= 1 ? 42 + skin.guard * 4 : 32 + skin.guard * 3;
    duel.playerCover = clamp(duel.playerCover + coverGain, 0, 92);
    duel.playerFocus = clamp(duel.playerFocus + (score >= 1 ? 12 : 4), 0, 100);
    if (score >= 2) {
      bossDamage += Math.round((8 + skin.guard * 2) * skin.power);
    }
    playerText = `Ты занял укрытие: ${getDuelResultName(score)}. Защита +${coverGain}.`;
  } else if (action === "reload") {
    const before = duel.playerAmmo;
    duel.playerAmmo = clamp(duel.playerAmmo + skin.reload, 0, skin.ammo);
    duel.playerFocus = clamp(duel.playerFocus + (score >= 1 ? 12 : 5), 0, 100);
    if (score >= 1) {
      duel.playerCover = clamp(duel.playerCover + 12, 0, 92);
    }
    playerText = `Перезарядка: ${before} → ${duel.playerAmmo}/${skin.ammo}. ${getDuelResultName(score)}.`;
  } else if (action === "shoot") {
    if (duel.playerAmmo <= 0) {
      toast("Пустой магазин. Нужна перезарядка.");
      playSfx("error");
      return;
    }
    duel.playerAmmo -= 1;
    const baseDamage = score >= 2 ? 38 : score === 1 ? 27 : score < 0 ? 9 : 19;
    bossDamage += Math.max(4, Math.round((baseDamage + duel.playerFocus * 0.25) * skin.power - duel.bossCover * 0.28));
    if (intent === "bait") {
      playerDamage += 8;
    }
    duel.playerFocus = Math.max(0, Math.floor(duel.playerFocus * 0.22));
    playerText = `Выстрел: ${getDuelResultName(score)}. Патроны ${duel.playerAmmo}/${skin.ammo}.`;
  } else {
    if (duel.playerAmmo <= 0) {
      toast("Для хитрого выстрела не хватает патронов.");
      playSfx("error");
      return;
    }
    duel.playerAmmo -= 1;
    const baseDamage = score >= 2 ? 42 : score === 1 ? 30 : score < 0 ? 8 : 18;
    duel.bossCover = Math.max(0, duel.bossCover - (score >= 1 ? 38 : 12));
    bossDamage += Math.max(5, Math.round((baseDamage + duel.playerFocus * 0.3) * skin.power - duel.bossCover * 0.14));
    if (score < 0) {
      playerDamage += 12;
    }
    duel.playerFocus = Math.max(0, Math.floor(duel.playerFocus * 0.38));
    playerText = `Обход: ${getDuelResultName(score)}. Укрытие босса сбито.`;
  }

  if (intent === "reload") {
    if (score >= 2) {
      bossText = `${boss.name} не успел спокойно сменить обойму.`;
    } else {
      duel.bossAmmo = bossMaxAmmo;
      duel.bossFocus = clamp(duel.bossFocus + 6, 0, 100);
      bossText = `${boss.name} перезарядился.`;
    }
  } else if (intent === "cover") {
    const coverGain = score >= 2 ? 5 : boss.guard + 22;
    duel.bossCover = clamp(duel.bossCover + coverGain, 0, 92);
    bossText = score >= 2 ? `${boss.name} не успел спрятаться.` : `${boss.name} укрепил позицию.`;
  } else if (intent === "aim") {
    if (score >= 1) {
      duel.bossFocus = clamp(duel.bossFocus + 4, 0, 100);
      bossText = `${boss.name} потерял чистую линию выстрела.`;
    } else {
      duel.bossFocus = clamp(duel.bossFocus + boss.aim + 12, 0, 100);
      playerDamage += score < 0 ? 8 : 4;
      bossText = `${boss.name} поймал прицел.`;
    }
  } else if (intent === "bait") {
    if (score >= 2) {
      duel.bossFocus = Math.max(0, duel.bossFocus - 12);
      bossText = `${boss.name} не продавил провокацию.`;
    } else {
      duel.bossFocus = clamp(duel.bossFocus + 18, 0, 100);
      if (action === "shoot" || action === "trick") {
        playerDamage += 9;
      }
      bossText = `${boss.name} выманил резкий ход.`;
    }
  } else {
    const rushed = intent === "rush";
    const shots = rushed && duel.bossAmmo >= 2 ? 2 : 1;
    duel.bossAmmo = Math.max(0, duel.bossAmmo - shots);
    if (score >= 2) {
      duel.bossFocus = Math.max(0, Math.floor(duel.bossFocus * 0.45));
      bossText = rushed ? `${boss.name} сорвался на рывке.` : `${boss.name} стрелял в пустоту.`;
    } else {
      const coverCut = duel.playerCover * (score === 1 ? 0.58 : 0.42);
      const pressure = score < 0 ? 1.2 : 1;
      const damage = Math.max(3, Math.round((boss.aim + 12 + duel.bossFocus * 0.18 + shots * 5 - coverCut - skin.guard * 1.6) * pressure));
      playerDamage += damage;
      bossText = rushed ? `${boss.name} продавил дистанцию.` : `${boss.name} дал прямой выстрел.`;
      duel.bossFocus = Math.max(0, Math.floor(duel.bossFocus * 0.35));
    }
  }

  const finalBossDamage = Math.max(0, Math.round(bossDamage));
  const finalPlayerDamage = Math.max(0, Math.round(playerDamage));
  if (finalBossDamage > 0) {
    duel.bossHp -= finalBossDamage;
  }
  if (finalPlayerDamage > 0) {
    duel.playerHp -= finalPlayerDamage;
  }

  state.duels.lastText = `${playerText} ${bossText} Урон: ты ${finalBossDamage}, тебе ${finalPlayerDamage}.`;
  if (finalBossDamage > 0 || finalPlayerDamage > 0) {
    flashDuel();
  }
  if (finalBossDamage > finalPlayerDamage) {
    playSfx(score >= 2 ? "rare" : "casino");
  } else if (finalPlayerDamage > 0) {
    playSfx("fail");
  } else {
    playSfx("puzzle");
  }

  if (finishDuelIfNeeded()) {
    return;
  }

  duel.turn += 1;
  duel.playerCover = Math.max(0, Math.floor(duel.playerCover * 0.52));
  duel.bossCover = Math.max(0, Math.floor(duel.bossCover * 0.55));
  if (state.duels.active) {
    duel.bossIntent = chooseBossIntent(duel, boss);
    duel.revealedIntent = describeBossIntent(duel.bossIntent, boss);
  }
  markDirty();
  saveGame();
  render();
}

function finishDuelIfNeeded() {
  const duel = state.duels.active;
  if (!duel) {
    return false;
  }

  const boss = getActiveBoss();
  if (duel.bossHp <= 0) {
    const reward = Math.round(boss.reward * getGunSkinDef().power * (1 + state.duels.wins * 0.025));
    state.money += reward;
    state.reputation += 4;
    state.duels.wins += 1;
    state.duels.active = null;
    state.duels.lastText = `Победа над ${boss.name}. Награда ${formatMoney(reward)}.`;
    state.duels.lastBossId = boss.id;
    pushEvent(`Дуэль выиграна: ${boss.name}, +${formatMoney(reward)}.`);
    floatText(`+${formatMoney(reward)}`);
    playSfx("success");
    markDirty();
    saveGame();
    render();
    return true;
  }

  if (duel.playerHp <= 0) {
    state.reputation = Math.max(0, state.reputation - 1);
    state.duels.losses += 1;
    state.duels.active = null;
    state.duels.lastText = `${boss.name} забрал раунд. Репутация просела.`;
    state.duels.lastBossId = boss.id;
    pushEvent(`Дуэль проиграна: ${boss.name}.`);
    playSfx("fail");
    markDirty();
    saveGame();
    render();
    return true;
  }
  return false;
}

function flashDuel() {
  dom.duelFlash.classList.remove("is-active");
  void dom.duelFlash.offsetWidth;
  dom.duelFlash.classList.add("is-active");
}

function buyOrSelectGunSkin(id) {
  const skin = getGunSkinDef(id);
  if (state.duels.ownedGunSkins[id]) {
    state.duels.selectedGunSkin = id;
    playSfx("deal");
  } else if (state.money >= skin.cost) {
    state.money -= skin.cost;
    state.duels.ownedGunSkins[id] = true;
    state.duels.selectedGunSkin = id;
    pushEvent(`Куплен скин пистолета: ${skin.title}.`);
    playSfx("upgrade");
  } else {
    toast("Не хватает денег на скин пистолета.");
    playSfx("error");
    return;
  }
  markDirty();
  saveGame();
  render();
}

function startRace() {
  if (state.races.active) {
    finishRace(true);
    return;
  }

  resetRaceControls();
  state.races.active = true;
  state.races.x = 180;
  state.races.y = 456;
  state.races.speed = 72;
  state.races.angle = 0;
  state.races.drift = 0;
  state.races.damage = 0;
  state.races.heat = 0;
  state.races.distance = 0;
  state.races.obstacles = [];
  state.races.nextObstacleIn = 1.15;
  state.races.lastReward = 0;
  state.races.lastText = "Держи газ, рули плавно: дорога стала шире, а занос мягче.";
  raceObstacleId = 0;
  pushEvent("Ночной рейдер выехал на трассу.");
  playSfx("deal");
  markDirty();
  saveGame();
  render();
}

function moveRace(direction) {
  if (!state.races.active) {
    toast("Сначала начните гонку.");
    playSfx("error");
    return;
  }
  raceInput.steer = clamp(direction, -1, 1);
  playSfx("puzzle");
  renderRace();
}

function setRaceControl(name, value) {
  raceInput[name] = value;
}

function resetRaceControls() {
  raceInput.steer = 0;
  raceInput.throttle = 0;
  raceInput.brake = 0;
}

function updateRace(deltaSeconds) {
  const race = state.races;
  if (!race.active) {
    return;
  }

  const skin = getCarSkinDef();
  const maxSpeed = 300 * skin.speed;
  const acceleration = raceInput.throttle ? 210 * skin.speed : 58;
  const brakeForce = raceInput.brake ? 300 : 0;
  const drag = 28 + race.speed * 0.03;
  race.speed = clamp(race.speed + (acceleration - brakeForce - drag) * deltaSeconds, 38, maxSpeed + race.distance * 0.003);

  const steerPower = (0.55 + race.speed / maxSpeed * 1.05) * skin.handling;
  race.angle = clamp(race.angle + raceInput.steer * steerPower * deltaSeconds, -0.46, 0.46);
  race.angle *= Math.pow(0.62, deltaSeconds);
  race.drift = race.drift * Math.pow(0.36, deltaSeconds) + raceInput.steer * race.speed * 0.012;
  race.x += Math.sin(race.angle) * race.speed * deltaSeconds * 0.62 + race.drift * deltaSeconds;
  race.y = clamp(race.y + (raceInput.brake ? 34 : raceInput.throttle ? -12 : 6) * deltaSeconds, 408, 484);

  const roadLeft = 28;
  const roadRight = 332;
  if (race.x < roadLeft || race.x > roadRight) {
    race.damage += deltaSeconds * 7 / skin.armor;
    race.speed *= 0.992;
    race.x = clamp(race.x, 14, 346);
  }

  race.heat = clamp(race.heat + (race.speed / maxSpeed) * deltaSeconds * 4.2 - deltaSeconds * 2.2, 0, 100);
  race.distance += race.speed * deltaSeconds * 0.68;
  race.nextObstacleIn -= deltaSeconds;
  if (race.nextObstacleIn <= 0) {
    const wide = Math.random() < 0.14;
    const typeRoll = Math.random();
    const type = typeRoll < 0.38 ? "puddle" : typeRoll < 0.72 ? "barrier" : "cones";
    race.obstacles.push({
      id: raceObstacleId,
      x: randomBetween(82, 278),
      y: -70,
      w: wide ? randomBetween(56, 70) : randomBetween(28, 42),
      h: wide ? randomBetween(40, 52) : randomBetween(50, 66),
      type,
      color: type === "puddle" ? "#2fd0c4" : type === "cones" ? "#ffc44d" : "#ff6363"
    });
    raceObstacleId += 1;
    race.nextObstacleIn = clamp(1.35 - race.distance / 4200 - race.heat / 900, 0.58, 1.35);
  }

  for (const obstacle of race.obstacles) {
    obstacle.y += (race.speed * 0.72 + 90) * deltaSeconds;
  }

  const carBox = { x: race.x - 18, y: race.y - 35, w: 36, h: 70 };
  race.obstacles = race.obstacles.filter((obstacle) => {
    const box = { x: obstacle.x - obstacle.w / 2, y: obstacle.y, w: obstacle.w, h: obstacle.h };
    const hit = carBox.x < box.x + box.w
      && carBox.x + carBox.w > box.x
      && carBox.y < box.y + box.h
      && carBox.y + carBox.h > box.y;
    if (hit) {
      if (obstacle.type === "puddle") {
        race.drift += (Math.random() < 0.5 ? -1 : 1) * race.speed * 0.16;
        race.damage += 3 / skin.armor;
      } else {
        race.damage += (obstacle.w > 55 ? 18 : 13) / skin.armor;
        race.speed *= 0.78;
        race.drift *= -0.12;
      }
      playSfx("fail");
      return false;
    }
    return obstacle.y < 640;
  });

  if (race.damage >= 130) {
    finishRace(false);
  }
}

function finishRace(manual) {
  const race = state.races;
  const skin = getCarSkinDef();
  const reward = Math.max(0, Math.round(race.distance * (2.4 + race.heat * 0.015) * skin.reward));
  state.money += reward;
  state.races.lastReward = reward;
  state.races.bestDistance = Math.max(state.races.bestDistance || 0, Math.floor(race.distance));
  state.races.active = false;
  state.races.obstacles = [];
  resetRaceControls();
  state.races.lastText = manual ? `Заезд завершён: +${formatMoney(reward)}.` : `Авария на трассе: +${formatMoney(reward)}.`;
  pushEvent(state.races.lastText);
  if (reward > 0) {
    floatText(`+${formatMoney(reward)}`);
  }
  playSfx(manual ? "success" : "fail");
  markDirty();
  saveGame();
  render();
}

function buyOrSelectCarSkin(id) {
  const skin = getCarSkinDef(id);
  if (state.races.ownedCarSkins[id]) {
    state.races.selectedCarSkin = id;
    playSfx("deal");
  } else if (state.money >= skin.cost) {
    state.money -= skin.cost;
    state.races.ownedCarSkins[id] = true;
    state.races.selectedCarSkin = id;
    pushEvent(`Куплен скин машины: ${skin.title}.`);
    playSfx("upgrade");
  } else {
    toast("Не хватает денег на скин машины.");
    playSfx("error");
    return;
  }
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
  maybeFindRecordFromItem(def);
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
  dom.bluesAudio.volume = state.settings.volume;
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
  updateRace(deltaSeconds);
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
  renderRecords();
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
  renderDuel();
  renderRace();
  renderSkinShops();
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

function renderRecords() {
  const ownedCount = getOwnedRecordCount();
  const active = state.records.activeId ? getRecordDef(state.records.activeId) : null;
  dom.recordCount.textContent = `${ownedCount} / ${recordDefs.length} пластинок`;
  dom.tapeDeckTitle.textContent = active ? active.title : "Пластинка не стоит";
  if (active) {
    dom.tapeDeckStatus.textContent = `Играет ${active.author} · файл из assets/music.`;
  } else {
    dom.tapeDeckStatus.textContent = "Перетащи пластинку в магнитофон.";
  }
  dom.tapeDeckDrop.classList.toggle("is-playing", !!active && !dom.bluesAudio.paused);

  const signature = recordDefs.map((record) => {
    const owned = state.records.owned[record.id] ? 1 : 0;
    const activeFlag = state.records.activeId === record.id ? 1 : 0;
    return `${record.id}:${owned}:${activeFlag}`;
  }).join("|");
  if (renderCache.records === signature) {
    return;
  }
  renderCache.records = signature;
  dom.recordRack.innerHTML = "";

  for (const record of recordDefs) {
    const owned = !!state.records.owned[record.id];
    const node = document.createElement("div");
    node.className = `record-card ${owned ? "is-owned" : "is-locked"} ${state.records.activeId === record.id ? "is-active" : ""}`;
    node.draggable = owned;
    node.dataset.recordId = record.id;

    const disc = document.createElement("div");
    disc.className = "record-disc";
    const text = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = owned ? record.title : "Пластинка не найдена";
    const meta = document.createElement("span");
    meta.textContent = owned
      ? `${record.author} · цена ${formatShortMoney(getRecordValue(record))}`
      : "ищется в товарах";
    text.append(title, meta);

    const actions = document.createElement("div");
    actions.className = "record-actions";
    const play = document.createElement("button");
    play.type = "button";
    play.textContent = "Поставить";
    play.dataset.recordPlay = record.id;
    play.disabled = !owned;
    const sell = document.createElement("button");
    sell.type = "button";
    sell.textContent = "Продать";
    sell.dataset.recordSell = record.id;
    sell.disabled = !owned;
    actions.append(play, sell);

    node.append(disc, text, actions);
    dom.recordRack.appendChild(node);
  }
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
  syncPanel("music", dom.musicSection, dom.musicPanelBtn);
  syncPanel("business", dom.businessSection, dom.businessPanelBtn);
  syncPanel("collection", dom.collectionSection, dom.collectionPanelBtn);
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

function renderDuel() {
  const duel = state.duels.active;
  const boss = getActiveBoss();
  const gun = getGunSkinDef();
  dom.duelPlayerName.textContent = "Перекуп";
  dom.duelBossName.textContent = duel ? boss.name : "Противник не выбран";
  dom.duelPlayerHp.style.width = `${clamp(duel?.playerHp ?? 100, 0, 100)}%`;
  dom.duelBossHp.style.width = `${clamp(((duel?.bossHp ?? boss.hp) / boss.hp) * 100, 0, 100)}%`;
  dom.duelPlayerFocus.textContent = duel ? `Чтение ${duel.playerFocus} · укрытие ${duel.playerCover} · патроны ${duel.playerAmmo}/${gun.ammo}` : `Побед ${state.duels.wins}`;
  dom.duelBossFocus.textContent = duel ? `${duel.revealedIntent || describeBossIntent(duel.bossIntent, boss)} · патроны ${duel.bossAmmo}/${boss.ammo || 6}` : `Поражений ${state.duels.losses}`;
  dom.duelStatus.textContent = state.duels.lastText;
  dom.startDuelBtn.textContent = duel ? "Дуэль идёт" : "Начать дуэль";
  dom.startDuelBtn.disabled = !!duel;
  dom.playerPistolView.style.setProperty("--skin-color", gun.color);
  dom.playerPistolView.style.setProperty("--skin-accent", gun.accent || "#17110e");
  document.querySelectorAll("[data-duel-action]").forEach((button) => {
    button.disabled = !duel;
  });
}

function renderRace() {
  const race = state.races;
  dom.raceDistance.textContent = `${Math.floor(race.distance || 0)} м`;
  dom.raceBest.textContent = `рекорд ${Math.floor(race.bestDistance || 0)} м`;
  dom.raceReward.textContent = race.active
    ? `скорость ${Math.floor(race.speed || 0)} · прочность ${Math.max(0, 130 - Math.floor(race.damage || 0))}/130`
    : `награда ${formatShortMoney(race.lastReward || 0)}`;
  dom.startRaceBtn.textContent = race.active ? "Завершить заезд" : "Начать гонку";
  dom.raceLeftBtn.disabled = !race.active;
  dom.raceRightBtn.disabled = !race.active;
  dom.raceGasBtn.disabled = !race.active;
  dom.raceBrakeBtn.disabled = !race.active;
  dom.raceLeftBtn.classList.toggle("is-held", raceInput.steer < 0);
  dom.raceRightBtn.classList.toggle("is-held", raceInput.steer > 0);
  dom.raceGasBtn.classList.toggle("is-held", !!raceInput.throttle);
  dom.raceBrakeBtn.classList.toggle("is-held", !!raceInput.brake);
  drawRace();
}

function drawRace() {
  if (!raceCtx) {
    raceCtx = dom.raceCanvas.getContext("2d");
  }
  if (!raceCtx) {
    return;
  }

  const ctx = raceCtx;
  const width = dom.raceCanvas.width;
  const height = dom.raceCanvas.height;
  const race = state.races;
  const car = getCarSkinDef();

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#120f0d";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "rgba(88,166,255,0.1)";
  for (let i = 0; i < 7; i += 1) {
    const y = (i * 96 + (race.distance || 0) * 0.6) % (height + 96) - 96;
    ctx.fillRect(0, y, 26, 72);
    ctx.fillRect(width - 26, y + 32, 26, 72);
    ctx.fillStyle = "rgba(255,196,77,0.28)";
    ctx.fillRect(6, y + 12, 5, 5);
    ctx.fillRect(width - 16, y + 48, 5, 5);
    ctx.fillStyle = "rgba(88,166,255,0.1)";
  }
  const roadLeft = 28;
  const roadRight = width - 28;
  const roadWidth = roadRight - roadLeft;
  const curve = Math.sin((race.distance || 0) / 260) * 12;
  ctx.fillStyle = "#262626";
  ctx.beginPath();
  ctx.moveTo(roadLeft + curve, 0);
  ctx.lineTo(roadRight + curve * 0.4, 0);
  ctx.lineTo(roadRight - curve, height);
  ctx.lineTo(roadLeft - curve * 0.5, height);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 2;
  ctx.setLineDash([26, 24]);
  for (let i = 1; i < 3; i += 1) {
    const x = roadLeft + roadWidth * i / 3;
    ctx.beginPath();
    ctx.moveTo(x + curve * 0.4, 0);
    ctx.lineTo(x - curve * 0.4, height);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(255,196,77,0.16)";
  for (let i = 0; i < 10; i += 1) {
    const y = (i * 76 + (race.distance || 0) * 2.7) % (height + 86) - 86;
    ctx.fillRect(12, y, 12, 42);
    ctx.fillRect(width - 24, y + 24, 12, 42);
  }

  for (const obstacle of race.obstacles || []) {
    const x = obstacle.x - obstacle.w / 2;
    if (obstacle.type === "puddle") {
      ctx.fillStyle = "rgba(47,208,196,0.34)";
      ctx.beginPath();
      ctx.ellipse(obstacle.x, obstacle.y + obstacle.h / 2, obstacle.w / 2, obstacle.h / 3, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(47,208,196,0.5)";
      ctx.stroke();
    } else if (obstacle.type === "cones") {
      ctx.fillStyle = "#ffc44d";
      for (let i = 0; i < 3; i += 1) {
        const coneX = x + i * (obstacle.w / 2.6);
        ctx.beginPath();
        ctx.moveTo(coneX + 8, obstacle.y);
        ctx.lineTo(coneX + 18, obstacle.y + obstacle.h);
        ctx.lineTo(coneX - 2, obstacle.y + obstacle.h);
        ctx.closePath();
        ctx.fill();
      }
    } else {
      ctx.fillStyle = obstacle.color || "#ff6363";
      roundRect(ctx, x, obstacle.y, obstacle.w, obstacle.h, 7);
      ctx.fill();
      ctx.fillStyle = "rgba(0,0,0,0.28)";
      ctx.fillRect(x + 6, obstacle.y + 10, obstacle.w - 12, 10);
      ctx.fillRect(x + 6, obstacle.y + obstacle.h - 17, obstacle.w - 12, 8);
    }
  }

  const carWidth = 42;
  const carHeight = 70;
  const carX = race.x || width / 2;
  const carY = race.y || height - 104;
  ctx.save();
  ctx.translate(carX, carY);
  ctx.rotate(race.angle || 0);
  ctx.fillStyle = car.color;
  roundRect(ctx, -carWidth / 2, -carHeight / 2, carWidth, carHeight, 8);
  ctx.fill();
  ctx.fillStyle = car.accent || "#fff7ed";
  ctx.fillRect(-carWidth / 2 + 6, -carHeight / 2 + 8, carWidth - 12, 10);
  ctx.fillRect(-carWidth / 2 + 7, carHeight / 2 - 18, carWidth - 14, 8);
  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.fillRect(-carWidth / 2 + 8, -carHeight / 2 + 22, carWidth - 16, 14);
  ctx.fillStyle = "rgba(0,0,0,0.38)";
  ctx.fillRect(-carWidth / 2 - 3, -carHeight / 2 + 14, 7, 16);
  ctx.fillRect(carWidth / 2 - 4, -carHeight / 2 + 14, 7, 16);
  ctx.fillRect(-carWidth / 2 - 3, carHeight / 2 - 28, 7, 16);
  ctx.fillRect(carWidth / 2 - 4, carHeight / 2 - 28, 7, 16);
  if (raceInput.throttle && race.active) {
    ctx.fillStyle = "rgba(255,196,77,0.65)";
    ctx.fillRect(-8, carHeight / 2, 16, 24);
  }
  ctx.restore();

  const damage = clamp(race.damage || 0, 0, 100);
  ctx.fillStyle = "rgba(0,0,0,0.38)";
  ctx.fillRect(14, 14, width - 28, 12);
  ctx.fillStyle = damage > 70 ? "#ff6363" : "#45d483";
  ctx.fillRect(14, 14, (width - 28) * (1 - damage / 100), 12);

  if (!race.active) {
    ctx.fillStyle = "rgba(0,0,0,0.42)";
    ctx.fillRect(roadLeft, 0, roadWidth, height);
    ctx.fillStyle = "#fff7ed";
    ctx.font = "700 20px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(race.lastText || "Нажми старт", width / 2, height / 2);
  }
}

function roundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
}

function renderSkinShops() {
  const gun = getGunSkinDef();
  const car = getCarSkinDef();
  dom.gunSkinName.textContent = gun.title;
  dom.carSkinName.textContent = car.title;

  const gunSignature = gunSkinDefs.map((skin) => `${skin.id}:${state.duels.ownedGunSkins[skin.id] ? 1 : 0}:${state.duels.selectedGunSkin === skin.id ? 1 : 0}:${state.money >= skin.cost ? 1 : 0}`).join("|");
  if (renderCache.gunSkins !== gunSignature) {
    renderCache.gunSkins = gunSignature;
    dom.gunSkinList.innerHTML = "";
    for (const skin of gunSkinDefs) {
      dom.gunSkinList.appendChild(createSkinCard(skin, "gun"));
    }
  }

  const carSignature = carSkinDefs.map((skin) => `${skin.id}:${state.races.ownedCarSkins[skin.id] ? 1 : 0}:${state.races.selectedCarSkin === skin.id ? 1 : 0}:${state.money >= skin.cost ? 1 : 0}`).join("|");
  if (renderCache.carSkins !== carSignature) {
    renderCache.carSkins = carSignature;
    dom.carSkinList.innerHTML = "";
    for (const skin of carSkinDefs) {
      dom.carSkinList.appendChild(createSkinCard(skin, "car"));
    }
  }
}

function createSkinCard(skin, type) {
  const owned = type === "gun" ? state.duels.ownedGunSkins[skin.id] : state.races.ownedCarSkins[skin.id];
  const selected = type === "gun" ? state.duels.selectedGunSkin === skin.id : state.races.selectedCarSkin === skin.id;
  const node = document.createElement("button");
  node.type = "button";
  node.className = `skin-card ${owned ? "is-owned" : ""} ${selected ? "is-selected" : ""}`;
  node.dataset.skinType = type;
  node.dataset.skinId = skin.id;

  const swatch = document.createElement("span");
  swatch.className = "skin-swatch";
  swatch.style.background = skin.color;
  swatch.style.setProperty("--skin-accent", skin.accent || "#fff");
  const text = document.createElement("strong");
  text.textContent = skin.title;
  const meta = document.createElement("small");
  if (selected) {
    meta.textContent = "выбрано";
  } else if (owned) {
    meta.textContent = "выбрать";
  } else if (type === "gun") {
    meta.textContent = `${formatShortMoney(skin.cost)} · ${skin.ammo} патр.`;
  } else {
    meta.textContent = `${formatShortMoney(skin.cost)} · броня x${skin.armor}`;
  }

  node.append(swatch, text, meta);
  node.disabled = !owned && state.money < skin.cost;
  return node;
}

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => switchView(button.dataset.view));
});

function bindRaceHold(button, onDown, onUp) {
  const release = (event) => {
    event.preventDefault();
    onUp();
    button.classList.remove("is-held");
    renderRace();
  };
  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    if (!state.races.active) {
      return;
    }
    onDown();
    button.classList.add("is-held");
    renderRace();
  });
  button.addEventListener("pointerup", release);
  button.addEventListener("pointerleave", release);
  button.addEventListener("pointercancel", release);
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
dom.stopRecordBtn.addEventListener("click", stopRecord);
dom.startDuelBtn.addEventListener("click", startDuel);
dom.startRaceBtn.addEventListener("click", startRace);
bindRaceHold(dom.raceLeftBtn, () => setRaceControl("steer", -1), () => {
  if (raceInput.steer < 0) {
    setRaceControl("steer", 0);
  }
});
bindRaceHold(dom.raceRightBtn, () => setRaceControl("steer", 1), () => {
  if (raceInput.steer > 0) {
    setRaceControl("steer", 0);
  }
});
bindRaceHold(dom.raceGasBtn, () => setRaceControl("throttle", 1), () => setRaceControl("throttle", 0));
bindRaceHold(dom.raceBrakeBtn, () => setRaceControl("brake", 1), () => setRaceControl("brake", 0));
dom.musicPanelBtn.addEventListener("click", () => togglePanel("music"));
dom.businessPanelBtn.addEventListener("click", () => togglePanel("business"));
dom.collectionPanelBtn.addEventListener("click", () => togglePanel("collection"));
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

document.querySelectorAll("[data-garage-action]").forEach((button) => {
  button.addEventListener("click", () => tapGarageAction(button.dataset.garageAction));
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

dom.recordRack.addEventListener("click", (event) => {
  const play = event.target.closest("[data-record-play]");
  if (play) {
    playRecord(play.dataset.recordPlay);
    return;
  }
  const sell = event.target.closest("[data-record-sell]");
  if (sell) {
    sellOwnedRecord(sell.dataset.recordSell);
    return;
  }
  const card = event.target.closest("[data-record-id]");
  if (card && state.records.owned[card.dataset.recordId]) {
    playRecord(card.dataset.recordId);
  }
});

dom.recordRack.addEventListener("dragstart", (event) => {
  const card = event.target.closest("[data-record-id]");
  if (!card || !state.records.owned[card.dataset.recordId]) {
    return;
  }
  event.dataTransfer.setData("text/plain", card.dataset.recordId);
});

dom.tapeDeckDrop.addEventListener("dragover", (event) => {
  event.preventDefault();
  dom.tapeDeckDrop.classList.add("is-dragover");
});

dom.tapeDeckDrop.addEventListener("dragleave", () => {
  dom.tapeDeckDrop.classList.remove("is-dragover");
});

dom.tapeDeckDrop.addEventListener("drop", (event) => {
  event.preventDefault();
  dom.tapeDeckDrop.classList.remove("is-dragover");
  const id = event.dataTransfer.getData("text/plain");
  if (id) {
    playRecord(id);
  }
});

dom.bluesAudio.addEventListener("error", () => {
  if (state.records.activeId) {
    dom.tapeDeckStatus.textContent = "Файл не найден. Загрузите блюз или добавьте mp3 в assets/music.";
  }
});

dom.bluesAudio.addEventListener("play", renderRecords);
dom.bluesAudio.addEventListener("pause", renderRecords);

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

document.querySelectorAll("[data-duel-action]").forEach((button) => {
  button.addEventListener("click", () => doDuelAction(button.dataset.duelAction));
});

dom.gunSkinList.addEventListener("click", (event) => {
  const card = event.target.closest("[data-skin-id]");
  if (!card) {
    return;
  }
  buyOrSelectGunSkin(card.dataset.skinId);
});

dom.carSkinList.addEventListener("click", (event) => {
  const card = event.target.closest("[data-skin-id]");
  if (!card) {
    return;
  }
  buyOrSelectCarSkin(card.dataset.skinId);
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

window.addEventListener("keydown", (event) => {
  if (activeView !== "races" || !state.races.active) {
    return;
  }
  const key = event.key.toLowerCase();
  if (event.key === "ArrowLeft" || key === "a") {
    event.preventDefault();
    setRaceControl("steer", -1);
  }
  if (event.key === "ArrowRight" || key === "d") {
    event.preventDefault();
    setRaceControl("steer", 1);
  }
  if (event.key === "ArrowUp" || key === "w") {
    event.preventDefault();
    setRaceControl("throttle", 1);
  }
  if (event.key === "ArrowDown" || key === "s") {
    event.preventDefault();
    setRaceControl("brake", 1);
  }
});

window.addEventListener("keyup", (event) => {
  const key = event.key.toLowerCase();
  if (event.key === "ArrowLeft" || key === "a") {
    if (raceInput.steer < 0) {
      setRaceControl("steer", 0);
    }
  }
  if (event.key === "ArrowRight" || key === "d") {
    if (raceInput.steer > 0) {
      setRaceControl("steer", 0);
    }
  }
  if (event.key === "ArrowUp" || key === "w") {
    setRaceControl("throttle", 0);
  }
  if (event.key === "ArrowDown" || key === "s") {
    setRaceControl("brake", 0);
  }
});

window.addEventListener("beforeunload", saveGame);

render();
requestAnimationFrame(gameLoop);
