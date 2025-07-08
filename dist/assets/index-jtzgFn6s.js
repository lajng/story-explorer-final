import*as s from"https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function o(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(n){if(n.ep)return;n.ep=!0;const a=o(n);fetch(n.href,a)}})();const h="user_token",d={setToken(e){localStorage.setItem(h,e)},getToken(){return localStorage.getItem(h)},isAuthenticated(){return!!this.getToken()},logout(){localStorage.removeItem(h),location.hash="#login"}},f={init(){const e=document.getElementById("login-form"),t=document.getElementById("register-form");e&&e.addEventListener("submit",this.handleLogin),t&&t.addEventListener("submit",this.handleRegister);const o=document.getElementById("logout-button");o&&o.addEventListener("click",()=>{d.logout(),window.location.hash="#login"})},async handleLogin(e){e.preventDefault();const t=document.getElementById("login-email").value.trim(),o=document.getElementById("login-password").value.trim(),i=document.getElementById("login-message");try{const n=await fetch("https://story-api.dicoding.dev/v1/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t,password:o})}),a=await n.json();if(!n.ok)throw new Error(a.message);d.setToken(a.loginResult.token),i.textContent="Login berhasil!",i.style.color="green",setTimeout(()=>{window.location.hash="#home"},1e3)}catch(n){d.logout(),i.textContent="Login gagal: "+n.message,i.style.color="red"}},async handleRegister(e){e.preventDefault();const t=document.getElementById("register-name").value.trim(),o=document.getElementById("register-email").value.trim(),i=document.getElementById("register-password").value.trim(),n=document.getElementById("register-message");if(!t||!o||!i){n.textContent="Semua field harus diisi.",n.style.color="red";return}if(i.length<6){n.textContent="Password minimal 6 karakter.",n.style.color="red";return}console.log("Data yang dikirim:",{name:t,email:o,password:i});try{const a=await fetch("https://story-api.dicoding.dev/v1/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:t,email:o,password:i})}),r=await a.json();if(!a.ok)throw new Error(r.message);n.textContent="Registrasi berhasil! Silakan login.",n.style.color="green",e.target.reset(),setTimeout(()=>{window.location.hash="#login"},1e3)}catch(a){n.textContent="Gagal daftar: "+a.message,n.style.color="red"}}};let l;const b=indexedDB.open("story-db",1);b.onupgradeneeded=function(e){l=e.target.result,l.createObjectStore("stories",{keyPath:"id"})};b.onsuccess=function(e){l=e.target.result};function S(e){l.transaction("stories","readwrite").objectStore("stories").put(e)}function E(e){const i=l.transaction("stories","readonly").objectStore("stories").getAll();i.onsuccess=()=>e(i.result)}const m={async renderHomePage(){const e=document.createElement("section");return e.className="page",e.id="home-page",e.innerHTML=`
      <h1>Explore Amazing Stories</h1>
      <div id="stories-container" class="story-list"></div>
      <div id="stories-map" class="map-container" style="height: 400px; margin-top: 1rem;"></div>
    `,setTimeout(()=>{E(t=>{t&&t.length>0&&this.renderStoryList(t,e)})},0),e},async renderAddStoryPage(){const e=document.createElement("section");return e.className="page",e.id="add-story-page",e.innerHTML=`
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
    `,e},renderStoryList(e,t=document){const o=t.querySelector("#stories-container");o&&(o.innerHTML="",e.forEach(i=>{const n=document.createElement("div");n.className="story-card",n.innerHTML=`
        <div class="story-content">
          <h3>${i.name||i.title||"Tanpa Judul"}</h3>
          <p>${i.description||i.body||""}</p>
          ${i.createdAt?`<small>${new Date(i.createdAt).toLocaleDateString()}</small>`:""}
          ${i.lat&&i.lon?`<p><span>📍 ${i.lat}, ${i.lon}</span></p>`:""}
        </div>
      `,o.appendChild(n)}))},renderError(e){const t=document.getElementById("stories-container");t&&(t.innerHTML=`
      <div class="error-message">
        <p>${e}</p>
      </div>
    `)}},p={storyMap:null,addStoryMap:null,initStoryMap(e){document.getElementById("stories-map")&&(this.storyMap&&this.storyMap.remove(),this.storyMap=s.map("stories-map").setView([-6.2,106.8],5),s.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"&copy; OpenStreetMap contributors"}).addTo(this.storyMap),setTimeout(()=>{this.storyMap.invalidateSize()},200),e.forEach(o=>{o.lat&&o.lon&&s.marker([o.lat,o.lon]).addTo(this.storyMap).bindPopup(`<strong>${o.name}</strong><br>${o.description}`)}))},initAddStoryMap(){if(!document.getElementById("location-map"))return;this.addStoryMap&&this.addStoryMap.remove(),this.addStoryMap=s.map("location-map").setView([-6.2,106.8],10),s.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"&copy; OpenStreetMap contributors"}).addTo(this.addStoryMap),setTimeout(()=>{this.addStoryMap.invalidateSize()},200);let t=null;this.addStoryMap.on("click",function(o){const{lat:i,lng:n}=o.latlng;t?t.setLatLng([i,n]):t=s.marker([i,n]).addTo(p.addStoryMap),window.AppState=window.AppState||{},window.AppState.currentLocation={lat:i.toFixed(6),lon:n.toFixed(6)}})}},w={async loadStories(){const e=d.getToken();if(!e){window.location.hash="#login";return}try{const t=await fetch("https://story-api.dicoding.dev/v1/stories",{headers:{Authorization:`Bearer ${e}`}});if(t.status===401){d.logout(),window.location.hash="#login";return}const o=await t.json();if(!t.ok)throw new Error(o.message||"Gagal memuat cerita");m.renderStoryList(o.listStory),p.initStoryMap(o.listStory)}catch(t){m.renderError(t.message||"Terjadi kesalahan saat memuat cerita.")}},initSubmitHandler(){const e=document.getElementById("story-form");e&&(e.addEventListener("submit",async t=>{t.preventDefault();const o=document.getElementById("story-description").value,i=window.AppState?.capturedPhoto,n=window.AppState?.currentLocation;if(!i){alert("Silakan ambil foto terlebih dahulu.");return}if(!n){alert("Silakan pilih lokasi terlebih dahulu.");return}const a=new FormData;a.append("description",o),a.append("lat",n.lat),a.append("lon",n.lon),a.append("photo",i);try{const r=d.getToken();if(!r){alert("Anda harus login terlebih dahulu."),window.location.hash="#login";return}const y=await fetch("https://story-api.dicoding.dev/v1/stories",{method:"POST",headers:{Authorization:`Bearer ${r}`},body:a}),u=await y.json();if(!y.ok)throw new Error(u.message);alert("Cerita berhasil ditambahkan!"),S({id:u.story.id||Date.now().toString(),title:u.story.name||"Cerita Offline",body:o,lat:n.lat,lon:n.lon,createdAt:new Date().toISOString()}),window.location.hash="#home"}catch(r){alert("Gagal mengirim cerita: "+r.message)}}),p.initAddStoryMap())}},v={async renderLoginPage(){const e=document.createElement("section");return e.className="page",e.id="login-page",e.innerHTML=`
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
    `,e},showLoginMessage(e,t=!1){const o=document.getElementById("login-message");o&&(o.textContent=e,o.style.color=t?"red":"green")},showRegisterMessage(e,t=!1){const o=document.getElementById("register-message");o&&(o.textContent=e,o.style.color=t?"red":"green")}},L={stream:null,video:null,canvas:null,initCamera(){this.video=document.getElementById("camera-preview"),this.canvas=document.createElement("canvas"),document.getElementById("start-camera")?.addEventListener("click",()=>this.startCamera()),document.getElementById("capture-photo")?.addEventListener("click",()=>this.capturePhoto()),document.getElementById("retake-photo")?.addEventListener("click",()=>this.retakePhoto())},async startCamera(){try{this.stream=await navigator.mediaDevices.getUserMedia({video:!0}),this.video.srcObject=this.stream,this.video.play(),this.video.style.display="block",document.getElementById("captured-image").style.display="none"}catch(e){alert("Kamera tidak dapat diakses: "+e.message)}},capturePhoto(){const e=this.video.videoWidth,t=this.video.videoHeight;this.canvas.width=e,this.canvas.height=t,this.canvas.getContext("2d").drawImage(this.video,0,0,e,t),this.canvas.toBlob(o=>{const i=document.getElementById("captured-image");i.src=URL.createObjectURL(o),i.style.display="block",this.video.pause(),this.video.style.display="none",window.AppState=window.AppState||{},window.AppState.capturedPhoto=o},"image/jpeg")},retakePhoto(){window.AppState.capturedPhoto=null,this.video.style.display="block",document.getElementById("captured-image").style.display="none",this.video.play()}},g={"#login":async()=>{const e=await v.renderLoginPage();c(e),f.init()},"#register":async()=>{const e=await v.renderRegisterPage();c(e),f.init()},"#home":async()=>{const e=await m.renderHomePage();c(e),w.loadStories()},"#add-story":async()=>{const e=await m.renderAddStoryPage();c(e),L.initCamera(),p.initAddStoryMap(),w.initSubmitHandler()}};function c(e){const t=document.getElementById("main-content");t.innerHTML="",e.classList.add("fade-in"),t.appendChild(e),t.focus()}window.addEventListener("hashchange",()=>{const e=window.location.hash;g[e]&&g[e]()});window.addEventListener("DOMContentLoaded",()=>{const e=window.location.hash||"#login";g[e]&&g[e]()});
