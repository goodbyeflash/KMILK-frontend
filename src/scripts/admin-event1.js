import '../asset/css/admin.scss'

import '../scripts/lib/jquery.min'

// 메시지 수신 받는 eventListener 등록
window.addEventListener('message', receiveMsgFromChild);

// 자식으로부터 메시지 수신
function receiveMsgFromChild(e) {
    if (e.data == 6) {
        //Todo..만점자 응모 팝업
    } else {
        //Todo.. 퀴즈 다시 풀어보러 가기
    }

    var lnb = window.$('nav > ul > li');
    lnb
        .on('mouseenter', function () {
            window.$(this).siblings().removeClass('active');
            window.$(this).addClass('active');
        })
        .on('mouseleave', function () {
            window.$('nav > ul > li').removeClass('active');
        });

}

