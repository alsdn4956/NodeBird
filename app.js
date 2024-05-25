const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');

//process.env.cookie_secret 없음
// 이 전까지는 없다!
// 그래서 dotenv는 위에 있는게 좋다.
dotenv.config(); // process.env

//process.env.cookie_secret 있음
const pageRouter = require('./routes/page');

const app = express();
app.set('port', process.env.PORT || 8001);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});

app.use(morgan('dev')); //morgan 로깅하는 것, 나중에 배포할때는 combined로 사용한다고 함
app.use(express.static(path.join(__dirname, 'public'))); //public 폴더를 static 폴더로 사용하는 것 허용
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,  //자바스크립트로 쿠키에 접근하는 것을 막는 것
        secure: false,  //https를 쓸때 true로 바꿔야함
    },
}));

app.use('/', pageRouter); //미들웨어 함수를 올바르게 설정했는지 확인
app.use((req, res, next) => { //404 Not Fount
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => { //500 Error 처리 미들웨어는 항상 매개변수 4개여야함
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};   //베포모드가 아닐때는 err표시, 베포모드면 err표시 x
    res.status(err.status || 500);
    res.render('error');
});
app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});
