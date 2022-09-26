import '../asset/css/admin.scss';
import api from './lib/api';

let pageCount = 1;
let lastPageNum = 0;
let type = 'all';
let data = {};
let userItems;
let columns = [
  { header: '이름', key: 'name', width: 25 },
  { header: '연락처', key: 'hp', width: 25 },
  { header: '주소', key: 'address', width: 50 },
  { header: '리그램한 피드 URL', key: 'url', width: 50 },
  { header: '개인정보수집동의', key: 'privacy', width: 25 },
  { header: 'IP', key: 'ip', width: 25 },
  { header: '응모날짜', key: 'publishedDate', width: 25 },
];
const table = document
  .getElementsByClassName('table')[0]
  .getElementsByTagName('tbody')[0];

window.onload = () => {
  api('get', 'admin/check', undefined, (res) => {
    if (res) {
      if (res.msg && res.msg == 'ERROR') {
        location.href = 'admin.html';
        return;
      }
      document.getElementById('prev').onclick = () => {
        if (pageCount == 1) {
          return;
        } else {
          pageCount--;
          onloadUserTable();
        }
      };

      document.getElementById('next').onclick = () => {
        if (pageCount == lastPageNum) {
          return;
        } else {
          pageCount++;
          onloadUserTable();
        }
      };

      document.getElementById('findBtn').onclick = () => {
        if( document.getElementById('findText').value.trim() == "" ) {
          alert("검색어를 입력 해주세요.");
          return;
        }
        data = {};
        data[document.getElementById('findSelect').value] =
          document.getElementById('findText').value;
        pageCount = 1;
        type = 'find';
        window.sessionStorage.setItem('user_filter', JSON.stringify(data));
        onloadUserTable();
      };

      onloadUserTable();

      document.getElementById('findClear').onclick = () => {
        window.sessionStorage.clear('user_filter');
        document.getElementById('findText').value = '';
        pageCount = 1;
        data = {};
        type == 'all';
        onloadUserTable();
      };

      document.getElementsByClassName('btn btn-excel')[0].onclick = () => {
        api(
          'post',
          'excel/download',
          {
            columns: columns,
            type: 'event1',
          },
          (res) => {
            const blob = new Blob([res.result.data], {
              type: res.result.headers['content-type'],
            });
            var a = document.createElement('a');
            a.href = window.URL.createObjectURL(blob);
            a.download = 'EVENT1 응모 내역 리스트.xlsx';
            a.click();
          }
        );
      };

      //   document.getElementsByClassName("allCheck")[0].onclick = (e) => {
      //     table.childNodes.forEach((el)=>{
      //         el.children[0].children[0].checked = e.target.checked;
      //     });
      //   };

      api('get', 'event1/count', undefined, (res) => {
        if (res.msg == 'OK') {
          document.getElementById('totalCount').innerHTML = `
            <span>참여자 수</span>
            총 ${res.result.data}명
          `;
        }
      });

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
  const filter = window.sessionStorage.getItem('user_filter');
  let method = type == 'find' || filter ? 'post' : 'get';
  let url = type == 'find' || filter ? 'event1/find' : 'event1';

  // 검색 된 필터 있을 경우
  if (filter) {
    data = JSON.parse(filter);
    const key = Object.keys(data)[0];
    const value = data[key];
    const selectOptions = [
      ...document.getElementById('findSelect').getElementsByTagName('option'),
    ];
    selectOptions.forEach((optionEl) => {
      if (optionEl.value == key) {
        optionEl.selected = true;
      }
    });
    document.getElementById('findText').value = value;
  }

  api(method, `${url}?page=${pageCount}`, data, (res) => {
    if (res) {
      if (res.msg && res.msg == 'OK') {
        lastPageNum = res.result.headers['last-page'];
        userItems = res.result.data;
        table.innerHTML = '';
        userItems.forEach((item) => {
          table.innerHTML += `<tr>
                <td>${item.name}</td>
                <td>${item.hp}</td>
                <td>${item.address}</td>
                <td><a href='${item.url}'>${item.url}</a></td>
                <td>${item.privacy}</td>
                <td>${item.ip}</td>
                <td>${new Date(item.publishedDate).YYYYMMDDHHMMSS()}</td>
                <td><span name='delete' data-val='${
                  item._id
                }' style='cursor : pointer;'>삭제</span></td>
            </tr>`;
        });
        document.getElementById(
          'pageNav'
        ).innerText = `${pageCount}/${lastPageNum}`;
        document.getElementsByName('delete').forEach((el) => {
          el.onclick = (e) => {
            const objectId = e.target.getAttribute('data-val');
            const confirm = window.confirm('정말 삭제 하시겠습니까?');
            if (confirm) {
              api('delete', `event1/${objectId}`, undefined, (res) => {
                if (res.msg == 'OK') {
                  onloadUserTable();
                } else {
                  console.log('[API] => 오류가 발생 하였습니다.');
                }
              });
            }
          };
        });
      } else {
        console.log('[API] => 응모자 목록을 불러올 수 없습니다.');
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

Date.prototype.YYYYMMDDHHMMSS = function () {
  var yyyy = this.getFullYear().toString();
  var MM = pad(this.getMonth() + 1, 2);
  var dd = pad(this.getDate(), 2);
  var hh = pad(this.getHours(), 2);
  var mm = pad(this.getMinutes(), 2);
  var ss = pad(this.getSeconds(), 2);

  return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
};
