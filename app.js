function getip() {
   return fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => data.ip)
      .catch(error => console.error(error));
}

function saveToGoogle(obj, fname) {
   var url =
      'https://script.google.com/macros/s/AKfycbwIEpU3T4a-viBWyH2RC3ywIqJ2V2xkUaUUYt9khATwbHEewj3EUndT6qY9JylxcLkykA/exec';
   if (fname) {
      url += "?action=" + fname;
   }
   return new Promise((res, rej) => {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.addEventListener('error', (e) => {
         console.log("xhr.addEventListener - error:", e)
      })
      xhr.onreadystatechange = (e) => {
         if (xhr.status !== 200) {
            console.log("xhr.onreadystatechange:", xhr.readyState, xhr.status, e);
            rej(xhr.readyState);
         }
         else if (xhr.readyState === 4) {
            res(xhr.responseText);
         }
      };
      let sp = new URLSearchParams(obj).toString();
      xhr.send(sp);
   });
}

let device = new Promise(res => {
   let scrSize = `${window.screen.width}x${window.screen.height}`;
   const screenResolutionWidth = screen.width / window.devicePixelRatio;
   const screenResolutionHeight = screen.height / window.devicePixelRatio;
   let scrRes = `${screenResolutionWidth}x${screenResolutionHeight}`;
   let wndSize = `${window.innerWidth}x${window.innerHeight}`;
   res({
      dpr: window.devicePixelRatio,
      wndsize: wndSize,
      scrsize: scrSize,
      scrres: scrRes,
      date: Date.now(),
      href: window.location.href,
      agent: navigator.userAgent,
      ref: document.referrer
   })
})

if (!window.location.host.startsWith('127.0.0.1')) {
   getip().then(async ip => {
      saveToGoogle({
         text: ip,
         ...(await device)
      }).catch(console.log);
   });
}


async function saveEmail(email) {
   saveToGoogle({
      text: email,
      ...(await device)
   }).catch(console.log);
}

