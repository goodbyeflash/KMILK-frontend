import '../asset/css/common.scss'
import '../asset/css/popup.scss'

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


  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    $('.popup-contents').addClass('scale');
  }

  if($('.popup').hasClass('active')){
    $('html, body').css('overflow','hidden');
  }else {
    $('html, body').css('overflow','auto');
  }

  $('.popup-open').on('click', function(){
    let targetPop = $(this).attr('data-target');
    $('html, body').css('overflow','hidden');
    $(targetPop).addClass('active');
  })

  $('.popup-close').on('click', function(){
    $(this).closest('.popup').removeClass('active');
    $('html, body').css('overflow','auto');
  })
}
