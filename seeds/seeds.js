const mongoose = require('mongoose')
const Product = require('../models/Product')

const url = `https://acceptable-virgina-yeji-85400ab7.koyeb.app/images`

const product = [
  {
    salesCount: 0,
    name: '사골곰탕',
    description: '100% 사골로 고아낸 진한 사골곰탕',
    image: `${url}/1.jpg`,
    cost: 1750,
    rate: 50,
    temp: '실온',
  },
  {
    salesCount: 0,
    name: '깍두기 볶음밥',
    description: '국내산 깍두기 볶음밥',
    image: `${url}/2.jpg`,
    cost: 5680,
    rate: 50,
    temp: '냉동',
  },
  {
    salesCount: 0,
    name: '소고기 비빔밥',
    description: '토핑 듬뿍, 소고기, 한국의 맛',
    image: `${url}/3.jpg`,
    cost: 5980,
    rate: 50,
    temp: '냉동',
  },
  {
    salesCount: 0,
    name: '라구 볼로네제 파스타',
    description: '매콤달콤, 고기듬뿍, 라구 소스, 펜네파스타',
    image: `${url}/4.jpg`,
    cost: 5980,
    rate: 50,
    temp: '냉동',
  },
  {
    salesCount: 0,
    name: '숯불향 우삼겹덮밥',
    description: '숯불향 가득, 숙성 불고기',
    image: `${url}/5.jpg`,
    cost: 5980,
    rate: 50,
    temp: '냉동',
  },
  {
    salesCount: 0,
    name: '함박 스테이크',
    description: '육즙 가득, 달짝지근, 어린이가 좋아하는',
    image: `${url}/6.jpg`,
    cost: 5980,
    rate: 50,
    temp: '냉동',
  },
  {
    salesCount: 0,
    name: '분모자 로제 떡볶이',
    description: '쫄깃쫄깃 분모자, 로제소스, 떡볶이',
    image: `${url}/7.jpg`,
    cost: 5980,
    rate: 50,
    temp: '냉동',
  },
  {
    salesCount: 0,
    name: '마살라 레드커리',
    description: '겉바속촉 마살라 레드커리',
    image: `${url}/8.jpg`,
    cost: 10980,
    rate: 50,
    temp: '냉동',
  },
  {
    salesCount: 0,
    name: '고추잡채&꽃빵',
    description: '중화식, 꽃빵, 고추잡채',
    image: `${url}/9.jpg`,
    cost: 6480,
    rate: 50,
    temp: '냉동',
  },
  {
    salesCount: 0,
    name: '동그랑땡',
    description: '도톰한 계란옷이 입혀진 고소하나 동그랑땡!',
    image: `${url}/10.jpg`,
    cost: 6980,
    rate: 50,
    temp: '냉동',
  },
  {
    salesCount: 0,
    name: '바베큐 폭립',
    description: '푸짐한 갈빗살, 불향 풍미 가득 폭립',
    image: `${url}/11.jpg`,
    cost: 35800,
    rate: 50,
    temp: '냉동',
  },
  {
    salesCount: 0,
    name: '전복 갈비탕',
    description: '통전복 한마리, 부드러운 갈비',
    image: `${url}/12.jpg`,
    cost: 11980,
    rate: 20,
    temp: '실온',
  },
  {
    salesCount: 0,
    name: '소고기 미역국',
    description: '완도산 미역, 소고기',
    image: `${url}/13.jpg`,
    cost: 2620,
    rate: 5,
    temp: '실온',
  },
  {
    salesCount: 0,
    name: '김치철판볶음밥',
    description: '국내산 김치로 맛깔나게 철판에 볶아낸',
    image: `${url}/14.jpg`,
    cost: 1890,
    rate: 5,
    temp: '냉동',
  },
  {
    salesCount: 0,
    name: '짜장덮밥',
    description: '돼지고기, 애호박, 당근, 짜장',
    image: `${url}/15.jpg`,
    cost: 6480,
    rate: 5,
    temp: '냉동',
  },
  {
    salesCount: 0,
    name: '소불고기덮밥',
    description: '간장베이스 소불고기 덮밥',
    image: `${url}/16.jpg`,
    cost: 2070,
    rate: 50,
    temp: '냉동',
  },
  {
    salesCount: 0,
    name: '황태콩나물국',
    description: '황태, 콩나물, 칼칼, 시원한',
    image: `${url}/17.jpg`,
    cost: 6600,
    rate: 50,
    temp: '실온',
  },
  {
    salesCount: 0,
    name: '전복죽',
    description: '전복과 전복 내장소스가 들어간 전복죽',
    image: `${url}/18.jpg`,
    cost: 3120,
    rate: 50,
    temp: '실온',
  },
  {
    salesCount: 0,
    name: '부드러운 닭가슴살',
    description: '고단백질, 다이어트 운동필수템',
    image: `${url}/19.jpg`,
    cost: 2980,
    rate: 6,
    temp: '냉동',
  },
  {
    salesCount: 0,
    name: '동파육',
    description: '부드러운, 달짝지근, 중화식',
    image: `${url}/20.jpg`,
    cost: 17900,
    rate: 50,
    temp: '실온',
  },
  {
    salesCount: 0,
    name: '등심돈까스',
    description: '국내산 돼지고기 등심, 바삭바삭',
    image: `${url}/21.jpg`,
    cost: 5980,
    rate: 5,
    temp: '냉동',
  },
  {
    salesCount: 0,
    name: '육개장',
    description: '얼큰한 국물',
    image: `${url}/22.jpg`,
    cost: 3150,
    rate: 5,
    temp: '실온',
  },
  {
    salesCount: 0,
    name: '차돌 된장찌개',
    description: '쫄깃한 차돌박이와 푸짐한 재료',
    image: `${url}/23.jpg`,
    cost: 4410,
    rate: 10,
    temp: '실온',
  },
  {
    salesCount: 0,
    name: '불맛 간장불고기',
    description: '국내산 앞다리살, 달콤짭짤, 불향 가득',
    image: `${url}/24.jpg`,
    cost: 7580,
    rate: 5,
    temp: '냉동',
  },
  {
    salesCount: 0,
    name: '견과류 모듬',
    description: '아몬드, 호두, 건크랜베리, 윌넛',
    image: `${url}/25.jpg`,
    cost: 7580,
    rate: 5,
    temp: '상온',
  },
  {
    salesCount: 0,
    name: '통살치킨',
    description: '닭다리살을 튀겨낸 바삭바삭 후라이드 치킨',
    image: `${url}/26.jpg`,
    cost: 7980,
    rate: 5,
    temp: '냉동',
  },
  {
    salesCount: 0,
    name: '단팥죽',
    description: '부드러운 통 단팥, 찹쌀 새알',
    image: `${url}/27.jpg`,
    cost: 2810,
    rate: 5,
    temp: '실온',
  },
  {
    salesCount: 0,
    name: '김치 등갈비찜',
    description: '국내산 김치, 매콤달달 부드러운 등갈비',
    image: `${url}/28.jpg`,
    cost: 16900,
    rate: 50,
    temp: '냉동',
  },
  {
    salesCount: 0,
    name: '베이컨 까르보나라 파스타',
    description: '베이컨 듬뿍, 크림소스, 스파게티',
    image: `${url}/29.jpg`,
    cost: 7980,
    rate: 5,
    temp: '냉동',
  },
  {
    salesCount: 0,
    name: '카레라이스',
    description: '감자, 당근, 돼지고기, 카레',
    image: `${url}/30.jpg`,
    cost: 2810,
    rate: 5,
    temp: '실온',
  },
  {
    salesCount: 0,
    name: '김치제육덮밥',
    description: '앞다리살, 볶음 김치, 고추장 양념',
    image: `${url}/31.jpg`,
    cost: 5980,
    temp: '냉동',
  },
  {
    salesCount: 0,
    name: '소고기장조림',
    description: '장조림, 간편반찬, 꽈리고추',
    image: `${url}/32.jpg`,
    cost: 3670,
    temp: '냉장',
  },
  {
    salesCount: 0,
    name: '배추김치',
    description: '기본 반찬, 국내산',
    image: `${url}/33.jpg`,
    cost: 19000,
    rate: 20,
    temp: '냉장',
  },
  {
    salesCount: 0,
    name: '햄치즈샌드위치',
    description: '햄과 치즈가 들어간 맛있는 샌드위치',
    image: `${url}/34.jpg`,
    cost: 2980,
    rate: 5,
    temp: '냉동',
  },
  {
    salesCount: 0,
    name: '고추장 불고기',
    description: '부드러운 앞다리살, 매콤달콤',
    image: `${url}/35.jpg`,
    cost: 7580,
    rate: 5,
    temp: '냉동',
  },
  {
    salesCount: 0,
    name: '치킨마요덮밥',
    description: '치킨과 마요네즈의 환상적인 조합',
    image: `${url}/36.jpg`,
    cost: 2980,
    rate: 5,
    temp: '냉동',
  },
  {
    salesCount: 0,
    name: '미트 라자냐',
    description: '미트소스로 층층이 쌓아올린 라자냐',
    image: `${url}/37.jpg`,
    cost: 6980,
    temp: '냉동',
  },
  {
    salesCount: 0,
    name: '총각김치',
    description: '시원하고 깔끔한 양념',
    image: `${url}/38.jpg`,
    cost: 35000,
    rate: 50,
    temp: '냉장',
  },
  {
    salesCount: 0,
    name: '닭갈비',
    description: '춘천식, 통닭다리살, 닭갈비',
    image: `${url}/39.jpg`,
    cost: 7580,
    rate: 5,
    temp: '냉동',
  },
  {
    salesCount: 0,
    name: '탕수육',
    description: '새콤달콤 소스, 바삭한 등심',
    image: `${url}/40.jpg`,
    cost: 14000,
    rate: 20,
    temp: '냉동',
  },
  {
    salesCount: 0,
    name: '부대찌개',
    description: '칼칼한 양념, 스팸, 소세지, 라면사리',
    image: `${url}/41.jpg`,
    cost: 6300,
    rate: 5,
    temp: '냉장',
  },
  {
    salesCount: 0,
    name: '궁중 너비아비',
    description: '숯불갈비양념으로 만든 너비아니',
    image: `${url}/42.jpg`,
    cost: 6980,
    rate: 5,
    temp: '냉동',
  },
  {
    salesCount: 0,
    name: '푸팟퐁 커리',
    description: '꽃게 튀김, 태국식 커리, 코코넛 밀크',
    image: `${url}/43.jpg`,
    cost: 5980,
    temp: '냉동',
  },
  {
    salesCount: 0,
    name: '국물떡볶이',
    description: '매콤한 소스와 쫄깃한 쌀 떡뽁이',
    image: `${url}/44.jpg`,
    cost: 3900,
    rate: 2,
    temp: '냉장',
  },
  {
    salesCount: 0,
    name: '치킨너겟',
    description: '국내산 닭고기, 에어프라이어, 아이들이 좋아하는',
    image: `${url}/45.jpg`,
    cost: 10400,
    temp: '냉동',
  },
  {
    salesCount: 0,
    name: '치즈 돈까스',
    description: '모짜렐라 치즈, 에어프라이어',
    image: `${url}/46.jpg`,
    cost: 5500,
    temp: '냉동',
  },
  {
    salesCount: 0,
    name: '간짜장',
    description: '짜장소스, 중화면, 푸짐한 야채와 고기',
    image: `${url}/47.jpg`,
    cost: 12980,
    rate: 5,
    temp: '냉동',
  },
  {
    salesCount: 0,
    name: '닭강정',
    description: '새콤달콤 양념소스, 대용량',
    image: `${url}/48.jpg`,
    cost: 9240,
    temp: '냉동',
  },
  {
    salesCount: 0,
    name: '해물짬뽕',
    description: '오징어, 홍합, 새우, 칼칼한 국물',
    image: `${url}/49.jpg`,
    cost: 12980,
    rate: 5,
    temp: '냉동',
  },
  {
    salesCount: 0,
    name: '닭가슴살 샐러드',
    description: '양상추, 방울토마토, 닭가슴살, 다이어트',
    image: `${url}/50.jpg`,
    cost: 6980,
    temp: '냉장',
  },
]

const seedProduct = async () => {
  try {
    if (mongoose.connection.models['Product']) await Product.collection.drop()
    Product.insertMany(product).then((data) => {
      console.log('Success initial Database')
    })
  } catch (error) {
    console.error(error)
  }
}

module.exports = seedProduct
