import '../asset/css/admin.scss';
import api from './lib/api';

let userItems;
let year = new Date().getFullYear();
let month = new Date().getMonth() + 1;
let maxDay = new Date(year, month, 0).getDate();
let data = {
  dateGte: `${year}-${month}-1`,
  dateLte: `${year}-${month}-${maxDay}`,
};
const table = document
  .getElementsByClassName('table')[0]
  .getElementsByTagName('tbody')[0];

window.onload = () => {
  document.getElementById('monthSelect').value = (
    new Date().getMonth() + 1
  ).toString();

  api('get', 'admin/check', undefined, (res) => {
    if (res) {
      if (res.msg && res.msg == 'ERROR') {
        location.href = 'admin.html';
        return;
      }

      document.getElementById('today').innerHTML = `
      <span>오늘 날짜</span>
      ${new Date().getFullYear()}년 ${
        new Date().getMonth() + 1
      }월 ${new Date().getDate()}일
      `;

      document.getElementById('findBtn').onclick = () => {
        year = document.getElementById('yaerSelect').value;
        month = document.getElementById('monthSelect').value;
        maxDay = new Date(year, month, 0).getDate();
        data = {
          dateGte: `${year}-${month}-1`,
          dateLte: `${year}-${month}-${maxDay}`,
        };
        onloadUserTable();
      };

      onloadUserTable();

      document.getElementById('logout').onclick = () => {
        api('post', 'admin/logout', undefined, (res) => {
          if (res) {
            location.href = 'admin.html';
          }
        });
      };

      document.getElementsByTagName('body')[0].style.display = 'block';
    }
  });
};

function onloadUserTable() {
  table.innerHTML = '';

  for (let index = 1; index <= maxDay; index++) {
    const today = `${year}-${pad(month, 2)}-${pad(index, 2)}`;
    table.innerHTML += `<tr>
                <td>${today}</td>
                <td id='visitant-${today}'>0</td>
                <td id='view-${today}'>0</td>
            </tr>`;
  }
  api('post', 'visitant', data, (res) => {
    if (res) {
      if (res.msg && res.msg == 'OK') {
        let visitantTotalCount = 0;
        userItems = res.result.data;
        userItems.forEach((item) => {
          document.getElementById(
            `visitant-${new Date(item._id).YYYYMMDD()}`
          ).innerText = item.count;
          visitantTotalCount += item.count;
        });
        document.getElementById('totalVisitant').innerText = visitantTotalCount;
      } else {
        console.log('[API] => 방문자 데이터를 불러올 수 없습니다.');
      }
    }
  });

  api('post', 'view', data, (res) => {
    if (res) {
      if (res.msg && res.msg == 'OK') {
        let viewTotalCount = 0;
        userItems = res.result.data;
        userItems.forEach((item) => {
          document.getElementById(
            `view-${new Date(item.date).YYYYMMDD()}`
          ).innerText = item.count;
          viewTotalCount += parseInt(item.count);
        });
        document.getElementById('totalView').innerText = viewTotalCount;
      } else {
        console.log('[API] => 페이지 수 데이터를 불러올 수 없습니다.');
      }
    }
  });
}

function pad(number, length) {
  var str = '' + number;
  while (str.length < length) {
    str = '0' + str;
  }
  return str;
}

Date.prototype.YYYYMMDD = function () {
  var yyyy = this.getFullYear().toString();
  var MM = pad(this.getMonth() + 1, 2);
  var dd = pad(this.getDate(), 2);
  return `${yyyy}-${MM}-${dd}`;
};
