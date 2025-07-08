import*as d from"https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function o(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(r){if(r.ep)return;r.ep=!0;const i=o(r);fetch(r.href,i)}})();const y={async renderLoginPage(){const e=document.createElement("section");return e.className="page",e.id="login-page",e.innerHTML=`
      <h1>Login</h1>
      <form id="login-form">
        <label for="login-email">Email</label>
        <input type="email" id="login-email" required />

        <label for="login-password">Password</label>
        <input type="password" id="login-password" required />

        <button type="submit" class="btn btn-primary">Login</button>
      </form>
      <div id="login-message" class="form-message"></div>
    `,e},async renderRegisterPage(){const e=document.createElement("section");return e.className="page",e.id="register-page",e.innerHTML=`
      <h1>Register</h1>
      <form id="register-form">
        <label for="register-name">Nama</label>
        <input type="text" id="register-name" required />

        <label for="register-email">Email</label>
        <input type="email" id="register-email" required />

        <label for="register-password">Password</label>
        <input type="password" id="register-password" required />

        <button type="submit" class="btn btn-primary">Daftar</button>
      </form>
      <div id="register-message" class="form-message"></div>
    `,e},showLoginMessage(e,t=!1){const o=document.getElementById("login-message");o&&(o.textContent=e,o.style.color=t?"red":"green")},showRegisterMessage(e,t=!1){const o=document.getElementById("register-message");o&&(o.textContent=e,o.style.color=t?"red":"green")}};let s;function w(){const e=indexedDB.open("story-db",1);e.onupgradeneeded=t=>{s=t.target.result,s.objectStoreNames.contains("stories")||s.createObjectStore("stories",{keyPath:"id"})},e.onsuccess=t=>{s=t.target.result,console.log("✅ IndexedDB initialized")},e.onerror=t=>{console.error("❌ IndexedDB failed:",t.target.errorCode)}}function v(e){if(!s)return;s.transaction("stories","readwrite").objectStore("stories").put(e)}function S(e){if(!s)return;const n=s.transaction("stories","readonly").objectStore("stories").getAll();n.onsuccess=()=>{e(n.result)}}const m={async renderHomePage(){const e=document.createElement("section");return e.className="page",e.id="home-page",e.innerHTML=`
      <h1>Explore Amazing Stories</h1>
      <div id="stories-container" class="story-list"></div>
      <div id="stories-map" class="map-container" style="height: 400px; margin-top: 1rem;"></div>
    `,setTimeout(()=>{S(t=>{t&&t.length>0&&this.renderStoryList(t,e)})},0),e},async renderAddStoryPage(){const e=document.createElement("section");return e.className="page",e.id="add-story-page",e.innerHTML=`
      <h2>Tambah Cerita</h2>
      <form id="story-form">
        <label for="story-description">Deskripsi</label>
        <textarea id="story-description" name="description" required></textarea>

        <div class="camera-container">
          <video id="camera-preview" autoplay playsinline></video>
          <img id="captured-image" alt="Captured" style="display:none;" />
          <div class="camera-controls">
            <button type="button" id="start-camera">Start Camera</button>
            <button type="button" id="capture-photo">Capture Photo</button>
            <button type="button" id="retake-photo">Retake</button>
          </div>
        </div>

        <div class="map-container">
          <h3>Pilih Lokasi</h3>
          <div id="location-map" style="height: 400px;"></div>
        </div>

        <div class="form-actions">
          <button type="submit" id="submit-btn" class="btn btn-primary">Kirim</button>
        </div>
      </form>
    `,e},renderStoryList(e,t=document){const o=t.querySelector("#stories-container");o&&(o.innerHTML="",e.forEach(n=>{const r=document.createElement("div");r.className="story-card",r.innerHTML=`
        <div class="story-content">
          <h3>${n.name||n.title||"Tanpa Judul"}</h3>
          <p>${n.description||n.body||""}</p>
          ${n.createdAt?`<small>${new Date(n.createdAt).toLocaleDateString()}</small>`:""}
          ${n.lat&&n.lon?`<p><span>📍 ${n.lat}, ${n.lon}</span></p>`:""}
        </div>
      `,o.appendChild(r)}))},renderError(e){const t=document.getElementById("stories-container");t&&(t.innerHTML=`
      <div class="error-message">
        <p>${e}</p>
      </div>
    `)}},g="user_token",l={setToken(e){localStorage.setItem(g,e)},getToken(){return localStorage.getItem(g)},isAuthenticated(){return!!this.getToken()},logout(){localStorage.removeItem(g),location.hash="#login"}},f={init(){const e=document.getElementById("login-form"),t=document.getElementById("register-form");e&&e.addEventListener("submit",this.handleLogin),t&&t.addEventListener("submit",this.handleRegister);const o=document.getElementById("logout-button");o&&o.addEventListener("click",()=>{l.logout(),window.location.hash="#login"})},async handleLogin(e){e.preventDefault();const t=document.getElementById("login-email").value.trim(),o=document.getElementById("login-password").value.trim(),n=document.getElementById("login-message");try{const r=await fetch("https://story-api.dicoding.dev/v1/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t,password:o})}),i=await r.json();if(!r.ok)throw new Error(i.message);l.setToken(i.loginResult.token),n.textContent="Login berhasil!",n.style.color="green",setTimeout(()=>{window.location.hash="#home"},1e3)}catch(r){l.logout(),n.textContent="Login gagal: "+r.message,n.style.color="red"}},async handleRegister(e){e.preventDefault();const t=document.getElementById("register-name").value.trim(),o=document.getElementById("register-email").value.trim(),n=document.getElementById("register-password").value.trim(),r=document.getElementById("register-message");if(!t||!o||!n){r.textContent="Semua field harus diisi.",r.style.color="red";return}if(n.length<6){r.textContent="Password minimal 6 karakter.",r.style.color="red";return}console.log("Data yang dikirim:",{name:t,email:o,password:n});try{const i=await fetch("https://story-api.dicoding.dev/v1/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:t,email:o,password:n})}),a=await i.json();if(!i.ok)throw new Error(a.message);r.textContent="Registrasi berhasil! Silakan login.",r.style.color="green",e.target.reset(),setTimeout(()=>{window.location.hash="#login"},1e3)}catch(i){r.textContent="Gagal daftar: "+i.message,r.style.color="red"}}},c={storyMap:null,addStoryMap:null,initStoryMap(e){const t=document.getElementById("stories-map");t&&(this.storyMap&&this.storyMap.remove(),this.storyMap=d.map(t).setView([-6.2,106.8],5),d.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"&copy; OpenStreetMap contributors"}).addTo(this.storyMap),setTimeout(()=>{this.storyMap.invalidateSize()},500),e.forEach(o=>{o.lat&&o.lon&&d.marker([o.lat,o.lon]).addTo(this.storyMap).bindPopup(`<strong>${o.name}</strong><br>${o.description}`)}))},initAddStoryMap(){const e=document.getElementById("location-map");if(!e)return;this.addStoryMap&&this.addStoryMap.remove(),this.addStoryMap=d.map(e).setView([-6.2,106.8],10),d.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"&copy; OpenStreetMap contributors"}).addTo(this.addStoryMap),setTimeout(()=>{this.addStoryMap.invalidateSize()},500);let t=null;this.addStoryMap.on("click",function(o){const{lat:n,lng:r}=o.latlng;t?t.setLatLng([n,r]):t=d.marker([n,r]).addTo(c.addStoryMap),window.AppState=window.AppState||{},window.AppState.currentLocation={lat:n.toFixed(6),lon:r.toFixed(6)}})}},b={async loadStories(){const e=l.getToken();if(!e){window.location.hash="#login";return}try{const t=await fetch("https://story-api.dicoding.dev/v1/stories",{headers:{Authorization:`Bearer ${e}`}});if(t.status===401){l.logout(),window.location.hash="#login";return}const o=await t.json();if(!t.ok)throw new Error(o.message||"Gagal memuat cerita");m.renderStoryList(o.listStory),c.initStoryMap(o.listStory),setTimeout(()=>{c.storyMap&&c.storyMap.invalidateSize()},300)}catch(t){m.renderError(t.message||"Terjadi kesalahan saat memuat cerita.")}},initSubmitHandler(){const e=document.getElementById("story-form");e&&(e.addEventListener("submit",async t=>{t.preventDefault();const o=document.getElementById("story-description").value,n=window.AppState?.capturedPhoto,r=window.AppState?.currentLocation;if(!n){alert("Silakan ambil foto terlebih dahulu.");return}if(!r){alert("Silakan pilih lokasi terlebih dahulu.");return}const i=new FormData;i.append("description",o),i.append("lat",r.lat),i.append("lon",r.lon),i.append("photo",n);try{const a=l.getToken();if(!a){alert("Anda harus login terlebih dahulu."),window.location.hash="#login";return}const h=await fetch("https://story-api.dicoding.dev/v1/stories",{method:"POST",headers:{Authorization:`Bearer ${a}`},body:i}),u=await h.json();if(!h.ok)throw new Error(u.message);alert("Cerita berhasil ditambahkan!"),v({id:u.story.id||Date.now().toString(),title:u.story.name||"Cerita Offline",body:o,lat:r.lat,lon:r.lon,createdAt:new Date().toISOString()}),window.location.hash="#home"}catch(a){alert("Gagal mengirim cerita: "+a.message)}}),c.initAddStoryMap())}},E="BObTt6J9Ey2b......";function L(e){const t="=".repeat((4-e.length%4)%4),o=(e+t).replace(/\-/g,"+").replace(/_/g,"/"),n=atob(o);return Uint8Array.from([...n].map(r=>r.charCodeAt(0)))}async function k(){const e=await Notification.requestPermission();console.log(e==="granted"?"✅ Notification permission granted.":"❌ Notification permission denied.")}async function M(){if(!("serviceWorker"in navigator))return;const e=await navigator.serviceWorker.ready;try{const t=await e.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:L(E)});console.log("✅ Push subscribed:",t)}catch(t){console.error("❌ Failed to subscribe the user: ",t)}}const p={init:async()=>{await w(),"serviceWorker"in navigator&&window.addEventListener("load",async()=>{try{const e=await navigator.serviceWorker.register("/sw.js");console.log("✅ Service Worker registered:",e),await k(),await M(e)}catch(e){console.error("❌ SW registration/push failed:",e)}}),window.addEventListener("hashchange",p.route),window.addEventListener("DOMContentLoaded",p.route)},route:async()=>{const e=window.location.hash||"#login",t=document.getElementById("main-content");switch(t.innerHTML="",e){case"#register":t.appendChild(await y.renderRegisterPage()),f.initRegisterHandler();break;case"#login":t.appendChild(await y.renderLoginPage()),f.initLoginHandler();break;case"#home":t.appendChild(await m.renderHomePage()),b.loadStories();break;case"#add-story":t.appendChild(await m.renderAddStoryPage()),b.initSubmitHandler();break;default:t.innerHTML="<p>Halaman tidak ditemukan</p>"}}};p.init();
