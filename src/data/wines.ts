import { Wine } from '../types/wine';

// 示例数据 - 你可以后续替换成真实的葡萄酒数据
export const sampleWines: Wine[] = [
  {
    id: 'wine-1',
    name: 'Cloudy Bay Chardonnay 2023',
    region: 'Marlborough',
    country: '新西兰',
    coordinates: {
      lat: -41.5160,
      lng: 173.9528
    },
    vintage: 2023,
    grapeVariety: 'Chardonnay',
    price: 50,
    rating: 4.3,
    tastingNotes: '浅金色，散发柑橘、白桃与烤榛子的香气，伴随轻微的矿物质感。口感平衡，酸度清新，余味带有橡木与奶油风味。',
    personalComment: '入口圆润，香气细腻，适合搭配海鲜和奶油类菜肴。',
    dateConsumed: '2025-09-06',
    winery: 'Cloudy Bay',
    alcoholContent: 13.5,
    color: 'white',
    image: '/images/wines/wine-1-cloudy-bay-chardonnay-2023.jpg',
    images: ['/images/wines/wine-1-cloudy-bay-chardonnay-2023.jpg']
  },
  {
    id: 'wine-2',
    name: 'Mooiplaas Chenin Blanc Bush Vines 2023',
    region: 'Stellenbosch',
    country: '南非',
    coordinates: {
      lat: -33.9321,
      lng: 18.8602
    },
    vintage: 2023,
    grapeVariety: 'Chenin Blanc',
    price: 25,
    rating: 4.1,
    tastingNotes: '浅稻草色，散发梨子、青苹果和蜂蜜香气，口感饱满，酸度适中，带有一丝花香和矿物质风味。',
    personalComment: '清新爽口，适合夏天饮用，单独饮用或搭配白肉均佳。',
    dateConsumed: '2025-09-06',
    winery: 'Mooiplaas Wine Estate',
    alcoholContent: 13.0,
    color: 'white',
    image: '/images/wines/wine-2-mooiplaas-chenin-blanc-2023.jpg',
    images: ['/images/wines/wine-2-mooiplaas-chenin-blanc-2023.jpg']
  },
  {
    id: 'wine-3',
    name: 'Black Stallion Los Carneros Chardonnay 2022',
    region: 'Los Carneros, Napa Valley',
    country: '美国',
    coordinates: {
      lat: 38.2545,
      lng: -122.3493
    },
    vintage: 2022,
    grapeVariety: 'Chardonnay',
    price: 35,
    rating: 4.2,
    tastingNotes: '金黄色泽，散发柑橘、菠萝和香草的香气，橡木味明显，口感圆润，酸度均衡，余味悠长。',
    personalComment: '典型纳帕霞多丽，橡木与果味融合度佳，适合慢慢品饮。',
    dateConsumed: '2025-09-06',
    winery: 'Black Stallion Estate Winery',
    alcoholContent: 14.0,
    color: 'white',
    image: '/images/wines/wine-3-black-stallion-chardonnay-2022.jpg',
    images: ['/images/wines/wine-3-black-stallion-chardonnay-2022.jpg']
  },
  {
    id: 'wine-4',
    name: 'Tread Softly Shiraz 2024',
    region: 'South Australia',
    country: '澳大利亚',
    coordinates: {
      lat: -34.9285,
      lng: 138.6007
    },
    vintage: 2024,
    grapeVariety: 'Shiraz',
    price: 20,
    rating: 3.9,
    tastingNotes: '深红宝石色，散发黑莓、李子和胡椒的香气，口感中带有香料和轻微橡木味，酒体中等，单宁柔和。',
    personalComment: '果味突出，轻松易饮，适合日常搭配烧烤。',
    dateConsumed: '2025-09-06',
    winery: 'Tread Softly Wines',
    alcoholContent: 13.0,
    color: 'red',
    image: '/images/wines/wine-4-tread-softly-shiraz-2024.jpg',
    images: ['/images/wines/wine-4-tread-softly-shiraz-2024.jpg']
  },
  {
    id: 'wine-5',
    name: 'Biscardo Neropasso Rosso',
    region: 'Veneto',
    country: '意大利',
    coordinates: {
      lat: 45.4408,
      lng: 12.3155
    },
    vintage: undefined,
    grapeVariety: 'Corvina, Corvinone, Cabernet Sauvignon',
    price: 30,
    rating: 4.0,
    tastingNotes: '深宝石红色，浓郁的黑樱桃、干果和香料气息。口感醇厚，带有轻微甜感和柔和单宁。',
    personalComment: '典型威尼托风格，浓郁顺滑，非常适合搭配意大利面和红肉。',
    dateConsumed: '2025-09-06',
    winery: 'Biscardo',
    alcoholContent: 13.5,
    color: 'red',
    image: '/images/wines/wine-5-neropasso-biscardo.jpg',
    images: ['/images/wines/wine-5-neropasso-biscardo.jpg']
  }
];