// **절대 실무용으로 사용하지 마세요. 강좌를 위한 백엔드 더미 구현입니다.** //
const fs = require('fs');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const SocketIO = require('socket.io');
const shortid = require('shortid');
const multer = require('multer');
const admin = require('firebase-admin');
const cors = require('cors');

let phoneToken;
// process.env.GOOGLE_APPLICATION_CREDENTIALS =
//   "./fooddeliveryapp-6609a-firebase-adminsdk-nev9a-603a8b9ae6.json";
//
// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
//   databaseURL: "https://fooddeliveryapp-6609a.firebaseio.com",
// });
const orders = [];
const app = express();
app.use('/', express.static(path.join(__dirname, 'uploads')));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

const jwtSecret = 'JWT_SECRET';
const users = {};
const menus = [
  '근수네 옛날통닭',
  '상호네 막창구이',
  '예훈이네 피자스쿨',
  '상희네 족발&보쌈',
  '연주네 직화짬뽕',
  '김가네 홍합짬뽕',
  '가츠비',
  '삼식이 식당',
  '두진이형의 파스타',
  '모루',
  '스모키 하우스',
];
const startLocal = [
  '둔산동',
  '탄방동',
  '용문동',
  '도마 1동',
  '도마 2동',
  '정림동',
  '관저동',
  '홍대 네거리',
  '전주',
  '익산',
  '용산',
  '광명',
  '부산',
  '시청역',
];
const EndLocal = [
  '가수원동',
  '은행동',
  '관평동',
  '신촌',
  '대흥동',
  '목동',
  '법동',
  '비래동',
  '문화동',
];

const random = array => {
  return array[Math.abs(Math.floor(Math.random() * array.length - 1))];
};

const verifyToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({message: '토큰이 없습니다.'});
  }
  try {
    const data = jwt.verify(
      req.headers.authorization.replace('Bearer ', ''),
      jwtSecret,
    );
    res.locals.email = data.email;
  } catch (error) {
    console.error(error);
    if (error.name === 'TokenExpiredError') {
      return res
        .status(419)
        .json({message: '만료된 액세스 토큰입니다.', code: 'expired'});
    }
    return res.status(401).json({message: '유효하지 않은 액세스 토큰입니다.'});
  }
  next();
};

const verifyRefreshToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({message: '토큰이 없습니다.'});
  }
  try {
    const data = jwt.verify(
      req.headers.authorization.replace('Bearer ', ''),
      jwtSecret,
    );
    res.locals.email = data.email;
  } catch (error) {
    console.error(error);
    if (error.name === 'TokenExpiredError') {
      return res
        .status(419)
        .json({message: '만료된 리프레시 토큰입니다.', code: 'expired'});
    }
    return res
      .status(401)
      .json({message: '유효하지 않은 리프레시 토큰입니다.'});
  }
  next();
};

app.get('/', (req, res) => {
  res.send('ok');
});

app.post('/refreshToken', verifyRefreshToken, (req, res, next) => {
  const accessToken = jwt.sign(
    {sub: 'access', email: res.locals.email},
    jwtSecret,
    {expiresIn: '5m'},
  );
  if (!users[res.locals.email]) {
    return res.status(404).json({message: '가입되지 않은 회원입니다.'});
  }
  res.json({
    data: {
      accessToken,
      email: res.locals.email,
      name: users[res.locals.email].name,
      money: users[res.locals.email].money,
    },
  });
});
app.get('/test', (req, res) => {
  res.send('하이');
});
app.post('/user', (req, res, next) => {
  if (users[req.body.email]) {
    return res.status(401).json({message: '이미 가입한 회원입니다.'});
  }
  users[req.body.email] = {
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
    money: 0,
  };

  return res.json({
    data: {
      email: req.body.email,
      name: req.body.name,
      money: 0,
    },
  });
});

app.post('/money', verifyToken, (req, res) => {
  users[res.locals.email].money += Number(req.body.money);
  res.json(users[res.locals.email].name);
});

app.post('/login', (req, res, next) => {
  if (!users[req.body.email]) {
    return res.status(401).json({message: '가입하지 않은 회원입니다.'});
  }
  if (req.body.password !== users[req.body.email].password) {
    return res.status(401).json({message: '잘못된 비밀번호입니다.'});
  }
  const refreshToken = jwt.sign(
    {sub: 'refresh', email: req.body.email},
    jwtSecret,
    {expiresIn: '24h'},
  );
  const accessToken = jwt.sign(
    {sub: 'access', email: req.body.email},
    jwtSecret,
    {expiresIn: '5m'},
  );
  users[req.body.email].refreshToken = refreshToken;

  return res.json({
    data: {
      name: users[req.body.email].name,
      email: req.body.email,
      money: users[req.body.email].money,
      refreshToken,
      accessToken,
    },
  });
});
app.post('/logout', verifyToken, (req, res, next) => {
  res.json({message: 'ok'});
});

app.post('/accept', verifyToken, (req, res, next) => {
  const order = orders.filter(v => {
    return v.orderId === req.body.orderId;
  });

  if (!order[0]) {
    return res.status(400).json({message: '유효하지 않은 주문입니다.'});
  }
  if (order[0].rider) {
    return res
      .status(400)
      .json({message: '다른 사람이 이미 수락한 주문건입니다. '});
  }
  order[0].rider = res.locals.email;
  res.json({status: 201});
});

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, 'uploads'));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});
app.post('/complete', verifyToken, upload.single('image'), (req, res, next) => {
  console.log(req.file, req.body, res.locals.email, req.headers);
  const order = orders.find(
    v => v.orderId === req.body.orderId && v.rider === res.locals.email,
  );
  if (!order) {
    return res.status(400).json({message: '유효하지 않은 주문입니다.'});
  }
  order.image = req.file.filename;
  order.completedAt = new Date();
  console.log('phonetoken', phoneToken);
  if (phoneToken) {
    admin
      .messaging()
      .send({
        token: phoneToken,
        notification: {
          title: '배송 완료!',
          body: '배송이 성공적으로 완료되었습니다.',
        },
        android: {
          notification: {
            channelId: 'riders',
            vibrateTimingsMillis: [0, 500, 500, 500],
            priority: 'high',
            defaultVibrateTimings: false,
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              category: 'riders',
            },
          },
        },
      })
      .then(console.log)
      .catch(console.error);
  }
  res.send('ok');
});
app.post('/phonetoken', (req, res, next) => {
  phoneToken = req.body.token;
  res.send('ok');
});
app.get('/showmethemoney', verifyToken, (req, res, next) => {
  // const order = orders.filter(
  //   v => v.rider === res.locals.email && !!v.completedAt,
  // );
  res.json({
    // data: order.reduce((a, c) => a + c.price, 0) || 0,
    data: users[res.locals.email].money,
  });
});

app.get('/completes', verifyToken, (req, res, next) => {
  const order = orders.filter(
    v => v.rider === res.locals.email && !!v.completedAt,
  );
  res.json({
    data: order,
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json(err);
});

const server = app.listen(8080, () => {
  console.log('Start Express Server : 8080');
});

const io = SocketIO(server, {
  path: '/socket.io',
});
app.set('io', io);

io.on('connection', socket => {
  let id;
  let orderId;
  console.log(socket.id, '연결되었습니다.');
  socket.on('login', () => {
    if (id) {
      clearInterval(id);
    }
    console.log(socket.id, '로그인했습니다.');
    id = setInterval(() => {
      io.emit('data', 'orderData');
    }, 1000);
  });
  socket.on('ignoreOrder', () => {
    if (orderId) {
      clearInterval(orderId);
    }
  });
  socket.on('acceptOrder', () => {
    if (orderId) {
      clearInterval(orderId);
    }
    orderId = setInterval(() => {
      const order = {
        orderId: shortid(),
        start: {
          latitude: Math.floor(Math.random() * 200) * 0.001 + 37.4,
          longitude: Math.floor(Math.random() * 300) * 0.001 + 126.8,
        },
        end: {
          latitude: Math.floor(Math.random() * 200) * 0.001 + 37.4,
          longitude: Math.floor(Math.random() * 300) * 0.001 + 126.8,
        },
        price: Math.floor(Math.random() * 6) * 1000 + 6000,
        rider: Math.random() > 0.5 ? shortid() : undefined,
        menu: random(menus),
        startLocal: random(startLocal),
        endLocal: random(EndLocal),
      };
      orders.push(order);
      io.emit('order', order);
    }, 10_000);
  });
  socket.on('disconnect', () => {
    console.log(socket.id, '연결 끊었습니다..');
    if (id) {
      clearInterval(id);
    }
    if (orderId) {
      clearInterval(orderId);
    }
  });
});
