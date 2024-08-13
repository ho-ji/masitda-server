# 🖥️ 맛있다(Masitda) 백엔드

<br>

🔗 [링크](https://masitda.netlify.app/)

- 테스트 ID: test001

- 비밀번호: test001!

<br>

## 기술스택

<div>
  <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"> 
<img  src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white"> <img  src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white"> 
<img  src="https://img.shields.io/badge/mongodb-47A248?style=for-the-badge&logo=mongodb&logoColor=white"> <img  src="https://img.shields.io/badge/koyeb-121212?style=for-the-badge&logo=koyeb&logoColor=white"> 
</div>

<br>

## 구현 내용

- node.js환경에서 mongoDB를 사용하는 express 서버를 구축하여 koyeb을 통해 배포함.
- models, routes, controllers, services, middlewares로 로직을 분리하여 유지보수를 용이하게 함
  - models : 데이터 구조 정의
  - routes : 요청 URL을 적절한 controller에 매핑
  - controllers : service 및 비즈니스 로직 실행으로 요청 처리
  - services : 데이터베이스와 통신
  - middlewares : 요청과 응답 중간 처리

<br>

## 구현 설명

<details>
<summary><b>product</b></summary>
<br>
  
**DB**
- 판매수량, 이름, 설명, 이미지, 가격, 할인율, 보관온도
    
```js
const productSchema = new mongoose.Schema(
  {
    salesCount: {type: Number, required: true},
    name: {type: String, required: true},
    description: {type: String},
    image: {type: String},
    cost: {type: Number, required: true},
    rate: {type: Number, default: 0},
    temp: {type: String, required: true},
  }
)
```

<br>

**요청 URL(/api/product)**

- /ranking GET
  - 홈페이지에서 상위7개의 상품 리스트, 베스트페이지에서 상위 50개의 상품 리스트를 요청할 때 사용
  - 상품DB에서 판매수량 기준으로 정렬하여 주어진 limit 개수만큼 상품 리스트를 반환
  ```js
  const getProductRankingList = async (limit) => {
    return await Product.find({}).sort({salesCount: -1}).limit(limit)
  }
  ```

<br>
</details>
<details>
<summary><b>cart</b></summary>
<br>

**DB**

- 사용자ID, 장바구니 상품리스트, 만료시간
- 장바구니 상품리스트의 아이템들은 상품DB을 참조
- 만료시간은 비회원 장바구니일 경우, 일정 시간동안 해당 장바구니에 대한 활동이 없을 시 만료되도록 설정

```js
const cartItemSchema = new mongoose.Schema({
  product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
  count: {type: Number, default: 0},
})
const cartSchema = new mongoose.Schema({
  uid: {type: String, required: true},
  products: [cartItemSchema],
  expiresAt: {type: Date, default: null, index: {expires: '0s'}},
})
```

<br>

**요청 URL(/api/cart)**

- /:uid POST
  - 사용자가 cart 상품 수량을 변경할 때 사용
  - uid기준으로 cart를 찾고 cart에 상품 정보인 productId와 count를 추가함
  - 비회원일 경우, utils의 getExpiresAt()으로 7일뒤 만료되도록 만료시간을 설정
  - 로그인 상태일 경우, token 재발급
- /:uid GET
  - 헤더에서 장바구니에 담긴 상품 개수를 구하고, 장바구니 페이지에서 장바구니 상품 정보가 필요할 때 사용
  - uid기준으로 cart를 찾고 cart 상품리스트를 반환
  - 비회원일 경우, utils의 getExpiresAt()으로 7일뒤 만료되도록 만료시간을 설정
  - 로그인 상태일 경우, token 재발급
- /:uid DELETE
  - 장바구니페이지에서 단일 상품 삭제하기나, 선택된 상품 선택 삭제할 때 사용
  - uid기준으로 cart를 찾고 주어진 idList에 해당하는 상품들을 해당 cart에서 삭제함

<br>
</details>
<details>
<summary><b>mdpick</b></summary>
<br>

**DB**

- 상품, md pick 이유
- 상품은 상품DB를 참조

```js
const mdPickSchema = new mongoose.Schema({
  product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
  reason: {type: String},
})
```

<br>

**요청 URL(/api/mdpick)**

- / GET
  - 홈페이지에서 7개의 MD PICK상품 리스트, MD PICK페이지에서 상품 리스트를 요청할 때 사용

<br>
</details>
<details>
<summary><b>password reset</b></summary>
<br>

**DB**

- 사용자ID, 비밀번호 재설정 토큰, 만료시간
- 비밀번호 재설정은 비밀번호 재설정 토큰 확인을 통해 이뤄지며, 보안을 위해 10분 후 자동으로 만료되도록 만료시간 설정

```js
const passwordResetSchema = new mongoose.Schema({
  uid: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
  passwordResetToken: {type: String, required: true},
  expiresAt: {type: Date, default: () => new Date(), index: {expires: '10m'}},
})
```

<br>

**요청 URL(/api/passwordReset)**

- /:token GET
  - 비밀번호 재설정 링크의 유효성 판별을 위해 사용

<br>
</details>
<details>
<summary><b>temp order</b></summary>
<br>
  
**DB**
- 사용자ID. 주문상품리스트, 주문일자, 만료일자
- 주문상품리스트 아이템
  - 상품DB를 참조
  - 상품 수량
  - 비용과 할인율은 행사에 따라 변경될수 있으므로 별도 저장
- 임시주문은 30분간 유효함
  - 주문하기 버튼 클릭 시엔 임시주문이 새로 생성
  - 페이지 뒤로가기, 앞으로 가기로 이동 시엔 생성했던 임시주문 페이지 그대로 사용
        
```js
const tempOrderItemSchema = new mongoose.Schema({
  product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
  count: {type: Number, required: true},
  cost: {type: Number, required: true},
  rate: {type: Number, default: 0},
})

const tempOrderSchema = new mongoose.Schema({
uid: {type: String, required: true},
products: [tempOrderItemSchema],
orderDate: {type: Date, default: Date.now},
expiresAt: {type: Date, default: () => new Date(), index: {expires: '30m'}},
})

````
<br>

**요청 URL(/api/temporder)**
- /:uid POST
  - 사용자가 장바구니 페이지에서 상품을 구매하기 클릭 시, 구매할 상품들에 대한 정보를 담기 위해 사용
  - uid기준으로 order가 저장되고, orderId를 생성해서 반환
  - 뒤로가기 등 페이지 이동 시 30분간 주문페이지를 유효하게 함
  - 로그인 상태일 경우, token 재발급
- /:uid GET
  - 사용자가 주문 페이지로 이동했을 때, 해당 주문의 유효성을 판별하기 위해 사용
  - orderId로 페이지 유효성 판별
  - 로그인 상태일 경우, token 재발급

<br>
</details>
<details>
<summary><b>order</b></summary>
<br>

**DB**
- 사용자ID, 주문상품 리스트, 주문일자, 배송지명, 연락처, 주소, 주문번호
- 주문상품 리스트 아이템
  - 상품은 상품DB 참조
  - 상품 수량
  - 비용과 할인율은 행사에 따라 변경될수 있으므로 별도 저장

```js
const orderItemSchema = new mongoose.Schema({
  product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
  count: {type: Number, required: true},
  cost: {type: Number, required: true},
  rate: {type: Number, default: 0},
})

const orderSchema = new mongoose.Schema({
  uid: {type: String, required: true},
  products: [orderItemSchema],
  orderDate: {type: Date, default: Date.now, required: true},
  name: {type: String, required: true},
  contactNumber: {
    type: String,
    match: /^\d{2,3}\d{3,4}\d{4}$/,
    required: true,
  },
  address: {
    zonecode: {type: String, match: /[0-9\-]{5}/, required: true},
    roadAddress: {type: String, required: true},
    detailAddress: {type: String, required: true},
  },
  orderNumber: {type: String},
})
````

<br>

**요청 URL(/api/order)**

- /guestOrder GET
  - 비회원 주문조회 페이지에서 주문번호와 연락처로 주문 조회 시 사용
  - 주문번호와 연락처로 일치하는 주문이 있을 경우 주문목록 반환
- /recent/:uid GET
  - 로그인한 사용자의 마이페이지에서 최근 주문 목록을 보여주기 위해 사용
  - 사용자의 주문목록에서 최근 3개의 상품에 대한 주문 정보를 반환
- /:uid POST
  - 주문페이지에서 사용자가 성공적으로 구매를 진행했을 때 주문목록을 업데이트 하기 위해 사용
  - 상품정보는 orderId로 tempOrder DB를 조회하여 업데이트
  - 배송지정보로 배송지명, 연락처, 주소 업데이트
  - 비회원 주문이었을 경우, 주문번호를 생성하여 같이 반환
  - 로그인 상태일 경우, 토큰 재발급
- /:uid GET
  - 주문목록 페이지에서 사용자의 주문목록을 보여주기 위해 사용
  - page로 구분하여 주문목록을 구분해서 반환 (무한스크롤을 위해)

<br>
</details>
<details>
<summary><b>token</b></summary>
<br>
  
**DB**
- 사용자ID, 리프레쉬 토큰, 만료 시간
- 로그인 후 인증을 안전하게 처리하기 위해 refresh token rotation 방식을 채택하여 refresh token을 저장하는 DB
- refresh token은 7일 이후에 만료되도록 설정되고, 한번 사용된 이후에는 바로 삭제됨
  
```js
const tokenSchema = new mongoose.Schema({
  uid: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
  refreshToken: {type: String, required: true},
  expiresAt: {type: Date, required: true, index: {expires: '0s'}},
})
```
<br>

**미들웨어**

- 로그인한 사용자가 사용자 관련 정보를 요청할 시, 로그인 시 발급한 token으로 유효성을 판별하기 위해 사용
- token은 access token과 refresh token을 사용하며 refresh token rotation방식으로 채택함
- access token과 refresh token은 둘다 jsonwebtoken 라이브러리를 사용하여 jwt token으로 발급
- access token은 10분, refresh token은 7일의 유효기간
- access token은 응답에 인자로, refresh token은 Http Only Cookie로 전송
- token 유효성 판별 과정
  - access token 유효 : 새로운 access token을 발급
  - access token 유호하지 않음
    - refresh token 유효 : 새로운 access token과 refresh token을 발급하고, 기존 refresh token은 DB 삭제
    - refresh token 유효하지 않음 : token 유효성 판별 실패, 로그인 정보 무효처리

<br>
</details>
<details>
<summary><b>user</b></summary>
<br>

**DB**

- 이름, 연락처, 아이디, 비밀번호, 이메일, 주문횟수
- 비밀번호는 미들웨어에서 bcrypt 라이브러리를 사용해 암호화된 상태로 저장

```js
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    match: /^(01[016789]{1})[0-9]{3,4}[0-9]{4}$/,
  },
  account: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z][a-zA-Z0-9]{4,15}$/,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  orderCount: {
    type: Number,
    default: 0,
  },
})
```

<br>

**요청 URL(/api/user)**

- /signup POST
  - 회원가입 페이지에서 회원가입 시 사용
- /check/:account GET
  - 회원가입 페이지에서 아이디 중복체크 확인을 위해 사용
- /login/:uid POST
  - 로그인 페이지에서 로그인 시 사용
  - checkPassword methods를 이용하여 bcrypto로 암호화된 비밀번호가 일치하는지 판별
    - 비밀번호가 일치하지 않을 경우, 로그인 실패
  - 비회원 장바구니가 존재할 경우, 로그인한 사용자의 장바구니에 상품 업데이트
  - token 발급
- /information/:uid GET
  - 마이페이지에서 사용자 정보를 표시하기 위해 사용
  - 사용자의 이름과 총 주문횟수를 반환
  - token 재발급
- /logout/:uid DELETE
  - 헤더의 로그아웃 버튼을 눌렀을 경우 사용
  - token DB의 refresh tokendmf 삭제하고, HTTP Only Cookie에 저장된 refresh token을 clear
- /password/:uid POST
  - 회원정보 수정 페이지에서 비밀번호 확인을 위해 사용
  - token 재발급
- /modify/:uid GET
  - 회원정보 수정 페이지에서 사용자 정보를 표시하기 위해 사용
  - 사용자 이름, 연락처, 아이디, 이메일 정보를 반환
  - token 재발급
- /modify/:uid POST
  - 회원정보 수정 페이지에서 사용자 정보를 수정하기 위해 사용
  - 수정한 사용자 정보를 DB에 업데이트
  - token 재발급
- /findAccount GET
  - ID/PW 찾기 페이지에서 ID찾기를 위해 사용
  - 이름과 이메일이 일치하는 경우 해당하는 ID 반환
- /findPassword GET
  - ID/PW 찾기 페이지에서 비밀번호 찾기를 위해 사용
  - 아이디와 이메일이 일치하는 경우 sendGrid API를 사용해 사용자가 입력한 이메일에 비밀번호 재설정 링크가 담긴 이메일 전송
  - passwordReset DB에 10분간 유효한 링크에 들어갈 토큰 추가
- /passwordChange POST
  - 비밀번호 재설정 페이지에서 비밀번호 재설정을 위해 사용
  - 비밀번호를 body에 넣기 위해 POST 메서드를 사용
  - 비밀번호 재설정 후, 사용한 passwordReset DB의 토큰은 삭제
  <br>
  </details>
