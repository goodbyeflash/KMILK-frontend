import '../asset/css/common.scss'

// 메시지 수신 받는 eventListener 등록
window.addEventListener('message', receiveMsgFromChild);

// 자식으로부터 메시지 수신
function receiveMsgFromChild(e) {
  if (e.data == 6) {
    //Todo..만점자 응모 팝업
  } else {
    //Todo.. 퀴즈 다시 풀어보러 가기
  }
}
