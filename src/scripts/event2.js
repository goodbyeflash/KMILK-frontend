import '../asset/css/common.scss';
import '../asset/css/popup.scss';
import $ from 'jquery';
import api from './lib/api';

window.onload = () => {
  let name, phoneNumber, check1;
  const sendButton = document.getElementById('sendButton');

  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    $('.popup-contents').addClass('scale');
  }

  if ($('.popup').hasClass('active')) {
    $('html, body').css('overflow', 'hidden');
  } else {
    $('html, body').css('overflow', 'auto');
  }

  $('.popup-open').on('click', function () {
    let targetPop = $(this).attr('data-target');
    $('html, body').css('overflow', 'hidden');
    $(targetPop).addClass('active');
  });

  $('.popup-close').on('click', function () {
    $(this).closest('.popup').removeClass('active');
    $('html, body').css('overflow', 'auto');
  });

  $(`#phoneNumber`).keyup(function (event) {
    if (!(event.keyCode >= 37 && event.keyCode <= 40)) {
      let inputVal = $(this).val();
      $(this).val(inputVal.replace(/[^0-9]/gi, ''));
    }
  });

  sendButton.onclick = () => {
    if (sendButton.getAttribute('loading') == 'true') return;

    name = document.getElementById('name').value;
    phoneNumber = document.getElementById('phoneNumber').value;
    check1 = document.getElementById('chk01').checked;

    if (name.trim() == '') {
      alert('이름을 입력 해주세요.');
      return;
    }

    if (phoneNumber.length < 10) {
      alert('연락처는 최소 10자 이상 입력 해주세요.');
      return;
    }

    if (!check1) {
      alert('개인 정보 수집 및 이용에 동의 해주세요.');
      return;
    }

    sendButton.setAttribute('loading', true);
    api(
      'POST',
      'event2',
      {
        name: name,
        hp: phoneNumber,
        privacy: '동의',
      },
      (res) => {
        if (res.msg == 'OK') {
          alert('접수가 완료 되었습니다.');
        } else {
          if (res.result.response.data == 'Conflict') {
            document.getElementById('popup02').className += ' active';
          } else {
            alert('오류가 발생 하였습니다.');
          }
        }
        sendButton.setAttribute('loading', false);
      }
    );
  };

  document.getElementById('replay').onclick = () => {
    document.getElementById('popup04').className = 'popup';
  };

  api('GET', 'visitant', undefined, () => {});

  api('GET', 'view', undefined, () => {});

  document.body.style.display = 'block';
};

// 메시지 수신 받는 eventListener 등록
window.addEventListener('message', receiveMsgFromChild);

// 자식으로부터 메시지 수신
function receiveMsgFromChild(e) {
  if (typeof e.data == 'number') {
    if (e.data == 6) {
      document.getElementById('popup03').className += ' active';
    } else {
      document.getElementById('popup04').className += ' active';
    }
  }
}
