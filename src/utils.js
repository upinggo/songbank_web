import axios from 'axios'
import moment from 'moment'
import vm from './main.js'


// export function initUtils() {

// }
moment.locale('zh-cn', {
  months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
  monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
  weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
  weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
  weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
  longDateFormat: {
    LT: 'Ah点mm分',
    LTS: 'Ah点m分s秒',
    L: 'YYYY-MM-DD',
    LL: 'YYYY年MMMD日',
    LLL: 'YYYY年MMMD日Ah点mm分',
    LLLL: 'YYYY年MMMD日ddddAh点mm分',
    l: 'YYYY-MM-DD',
    ll: 'YYYY年MMMD日',
    lll: 'YYYY年MMMD日Ah点mm分',
    llll: 'YYYY年MMMD日ddddAh点mm分'
  },
  meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
  meridiemHour: function (hour, meridiem) {
    if (hour === 12) {
      hour = 0;
    }
    if (meridiem === '凌晨' || meridiem === '早上' ||
      meridiem === '上午') {
      return hour;
    } else if (meridiem === '下午' || meridiem === '晚上') {
      return hour + 12;
    } else {
      // '中午'  
      return hour >= 11 ? hour : hour + 12;
    }
  },
  meridiem: function (hour, minute, isLower) {
    var hm = hour * 100 + minute;
    if (hm < 600) {
      return '凌晨';
    } else if (hm < 900) {
      return '早上';
    } else if (hm < 1130) {
      return '上午';
    } else if (hm < 1230) {
      return '中午';
    } else if (hm < 1800) {
      return '下午';
    } else {
      return '晚上';
    }
  },
  calendar: {
    sameDay: function () {
      return this.minutes() === 0 ? '[今天]Ah[点整]' : '[今天]LT';
    },
    nextDay: function () {
      return this.minutes() === 0 ? '[明天]Ah[点整]' : '[明天]LT';
    },
    lastDay: function () {
      return this.minutes() === 0 ? '[昨天]Ah[点整]' : '[昨天]LT';
    },
    nextWeek: function () {
      var startOfWeek, prefix;
      startOfWeek = moment().startOf('week');
      prefix = this.unix() - startOfWeek.unix() >= 7 * 24 * 3600 ? '[下]' : '[本]';
      return this.minutes() === 0 ? prefix + 'dddAh点整' : prefix + 'dddAh点mm';
    },
    lastWeek: function () {
      var startOfWeek, prefix;
      startOfWeek = moment().startOf('week');
      prefix = this.unix() < startOfWeek.unix() ? '[上]' : '[本]';
      return this.minutes() === 0 ? prefix + 'dddAh点整' : prefix + 'dddAh点mm';
    },
    sameElse: 'LL'
  },
  ordinalParse: /\d{1,2}(日|月|周)/,
  ordinal: function (number, period) {
    switch (period) {
      case 'd':
      case 'D':
      case 'DDD':
        return number + '日';
      case 'M':
        return number + '月';
      case 'w':
      case 'W':
        return number + '周';
      default:
        return number;
    }
  },
  relativeTime: {
    future: '%s内',
    past: '%s前',
    s: '几秒',
    m: '1分钟',
    mm: '%d分钟',
    h: '1小时',
    hh: '%d小时',
    d: '1天',
    dd: '%d天',
    M: '1个月',
    MM: '%d个月',
    y: '1年',
    yy: '%d年'
  },
  week: {
    // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效  
    dow: 1, // Monday is the first day of the week.  
    doy: 4  // The week that contains Jan 4th is the first week of the year.  
  }
});
export function getElementViewLeft(element) {
  let actualLeft = element.offsetLeft;
  let current = element.offsetParent;
  let elementScrollLeft;
  while (current !== null) {
    actualLeft += current.offsetLeft;
    current = current.offsetParent;
  }
  elementScrollLeft = document.body.scrollLeft + document.documentElement.scrollLeft;
  return actualLeft - elementScrollLeft;
}

export function getElementViewTop(element) {
  let actualTop = element.offsetTop;
  let current = element;
  let elementScrollTop;
  while (current.offsetParent !== null) {
    current = current.offsetParent;
    actualTop += current.offsetTop;
  }
  elementScrollTop =
    current === document.body
      ? document.body.scrollTop + document.documentElement.scrollTop
      : 0;
  return actualTop - elementScrollTop;
}

export const userInfo = JSON.parse(localStorage.getItem('userInfo'))

let token = userInfo ? userInfo.token : ''
export function loginSuccessed(pinfo) {
  token = pinfo.token
  localStorage.setItem('userInfo', JSON.stringify(pinfo))
}
export function logout() {
  token = ''
  localStorage.removeItem('userInfo')
}

export const apiUrl = "http://songbank.staging.newband.cn/songbank_api/"
export function request(url, params={}) {
  return axios
    .post(apiUrl + url, { ...params }, { headers: { token: token }})
    .then(res => {
      if (res.status >= 200 && res.status < 300) {
        return res.data
      }
      let error = new Error(res.statusText)
      error.response = res
      throw error
    })
    .then(res => {
      if(parseInt(res.code) === 10000) {
        return {success: true, data: res.data}
      }
      else {
        if (res.prompt[0].code > 20000 && res.prompt[0].code < 30000) {
          vm.$store.commit('logoutSuccess')
        }
        return {success: false, messages: res.prompt}
      }
    })
    .catch(err => 
      {
        console.log(err)
        return { success: false, messages: [{message: '请求失败'}] }
      })
}
export function checkPhone(phone) {
  let myreg = /^[1][0-9]{10}$/;
  return myreg.test(phone)
}
export function relativelyTime(time) {
  return moment.unix(time).fromNow()
}
export function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}
