exports.renderProfile= (req, res) => {
    // 서비스를 호출
    res.render('profile', { title: '내 정보 - NodeBird' });

};
exports.renderJoin = (req, res) => {
    res.render('join', { title: '회원가입 - NodeBird' });
};
exports.renderMain = (req, res) => {
    res.render('main', { title: 'NodeBird',
        twits: [],
     });
};

// 라우터-> 컨트롤러 -> 서비스(요청,응답을 모른다)