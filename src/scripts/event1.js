import '../asset/css/common.scss';
import '../asset/css/popup.scss';
import $ from 'jquery';
import api from './lib/api';

window.onload = () => {
  let nowUrl;
  let name, phoneNumber, address, url, check1;
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
    address = document.getElementById('address').value;
    url = document.getElementById('url').value;
    check1 = document.getElementById('chk01').checked;

    if (name.trim() == '') {
      alert('이름을 입력 해주세요.');
      return;
    }

    if (phoneNumber.length < 10) {
      alert('연락처는 최소 10자 이상 입력 해주세요.');
      return;
    }

    let check = /^[0-9]+$/; 

    if( !check.test(phoneNumber) ) {
      alert('연락처는 숫자만 입력 해주세요.');
      return;
    }

    if (address.trim() == '') {
      alert('주소를 입력 해주세요.');
      return;
    }

    if (url.trim() == '') {
      alert('리그램한 피드URL을 입력 해주세요.');
      return;
    }

    if (!check1) {
      alert('개인 정보 수집 및 이용에 동의 해주세요.');
      return;
    }

    sendButton.setAttribute('loading', true);
    api(
      'POST',
      'event1',
      {
        name: name,
        hp: phoneNumber,
        address: address,
        url: url,
        privacy: '동의',
        publishedDate : new Date(),
      },
      (res) => {
        if (res.msg == 'OK') {
          alert('접수가 완료 되었습니다.');
        } else {
          if (res.result.response.data == 'Conflict') {
            document.getElementById('popup04').className += ' active';
          } else {
            alert('오류가 발생 하였습니다.');
          }
        }
        sendButton.setAttribute('loading', false);
      }
    );
  };

  document.getElementById('video01').onclick = () => {
    const url = 'https://www.instagram.com/reel/CjSQYnRhoiv/?igshid=MDJmNzVkMjY=';
    window.open(url, '_blank');
    document.getElementById("instargramUrl").value = url;
    document.getElementById('popup03').className += ' active';
    nowUrl = url;
  };

  document.getElementById('video02').onclick = () => {
    const url = 'https://www.instagram.com/reel/CjSQ7sBhEK0/?igshid=MDJmNzVkMjY=';
    window.open(url, '_blank');
    document.getElementById("instargramUrl").value = url;
    document.getElementById('popup03').className += ' active';
    nowUrl = url;
  };

  document.getElementById('video03').onclick = () => {
    const url = 'https://www.instagram.com/reel/CjSVZ7cBzXC/?igshid=MDJmNzVkMjY=';
    window.open(url, '_blank');
    document.getElementById("instargramUrl").value = url;
    document.getElementById('popup03').className += ' active';
    nowUrl = url;
  };

  document.getElementById('regram').onclick = () => {
    window.open(nowUrl, '_blank');
  };

  document.getElementById('copyUrl').onclick = () => {
    const IE = document.all ? true : false;
    const url = `https://kmilkevent.co.kr`;
    if (IE) {
      window.clipboardData.setData('Text', url);
      alert('이 글의 단축url이 클립보드에 복사되었습니다.');
    } else {
      prompt(
        '이 글의 단축 URL 입니다. 전체선택-복사하기(Ctrl+C)를 눌러 링크를 공유하세요',
        url
      );
    }
  };

  api('GET', 'visitant', undefined, () => {});

  api('GET', 'view', undefined, () => {});

  document.body.style.display = 'block';
};
