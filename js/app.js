const $=s=>document.querySelector(s);
const sidebar=$("#sidebar"),overlay=$("#overlay");
$("#menuBtn").onclick=()=>{sidebar.classList.add("open");overlay.classList.add("show")};
overlay.onclick=()=>{sidebar.classList.remove("open");overlay.classList.remove("show")};
document.querySelectorAll(".sidebar a").forEach(a=>a.onclick=()=>{sidebar.classList.remove("open");overlay.classList.remove("show")});
$("#year").textContent=new Date().getFullYear();

let progress=0;
$("#progressBtn").onclick=()=>{progress=(progress+10)%110;$("#progressText").textContent=progress+"%";$("#progressBar").style.width=progress+"%"};

const dialog=$("#dialog");
function info(title,text){$("#dialogTitle").textContent=title;$("#dialogText").textContent=text;dialog.showModal()}
const libraryBooks=[
  {id:1,title:"Primeira leitura",author:"Escolha coletiva",status:"lendo",label:"Lendo agora",number:"01",description:"O primeiro livro do RE7NASCER será escolhido pelo grupo."},
  {id:2,title:"Segunda leitura",author:"Sugestões da Sala 7",status:"proximo",label:"Próximo",number:"02",description:"Espaço reservado para a próxima escolha coletiva."},
  {id:3,title:"Terceira leitura",author:"Em construção",status:"proximo",label:"Próximo",number:"03",description:"Mais uma leitura para construirmos juntos."}
];
let currentFilter="todos";
function renderLibrary(){
  const q=($("#bookSearch")?.value||"").trim().toLowerCase();
  const items=libraryBooks.filter(b=>(currentFilter==="todos"||b.status===currentFilter)&&(`${b.title} ${b.author}`.toLowerCase().includes(q)));
  $("#libraryGrid").innerHTML=items.map(b=>`
    <article class="library-book" tabindex="0" data-book="${b.id}">
      <div class="library-cover status-${b.status}"><span>RE7</span><strong>${b.number}</strong><small>Clube de Leitura</small></div>
      <div class="library-info"><span class="status-tag ${b.status}">${b.label}</span><h4>${b.title}</h4><p>${b.author}</p><button class="book-details" data-book="${b.id}">Ver detalhes →</button></div>
    </article>`).join("");
  $("#libraryEmpty").hidden=items.length!==0;
  document.querySelectorAll(".book-details").forEach(btn=>btn.onclick=()=>showBook(Number(btn.dataset.book)));
}
function showBook(id){
  const b=libraryBooks.find(x=>x.id===id);
  info(b.title,`${b.author}. ${b.description} A ficha completa terá sinopse, período de leitura, progresso e discussões do grupo.`);
}
$("#bookSearch")?.addEventListener("input",renderLibrary);
document.querySelectorAll(".filter").forEach(btn=>btn.onclick=()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));btn.classList.add("active");currentFilter=btn.dataset.filter;renderLibrary()});
$("#addBook").onclick=()=>info("Sugerir um livro","Em breve este botão abrirá um formulário com título, autor, motivo da sugestão e opção para enviar o livro à votação do grupo.");
renderLibrary();

$("#voteBtn").onclick=()=>info("Votações","As votações serão ativadas quando conectarmos as contas dos participantes ao Firebase.");

let view=new Date(); view.setDate(1);
const months=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
function renderCalendar(){
  const y=view.getFullYear(),m=view.getMonth(),first=new Date(y,m,1).getDay(),last=new Date(y,m+1,0).getDate(),today=new Date();
  $("#calendarTitle").textContent=`${months[m]} ${y}`; $("#monthLabel").textContent=months[m].toUpperCase();
  let html=""; for(let i=0;i<first;i++)html+='<span class="blank"></span>';
  for(let d=1;d<=last;d++){const isToday=d===today.getDate()&&m===today.getMonth()&&y===today.getFullYear();html+=`<button class="${isToday?"today":""}" title="${d} de ${months[m]}">${d}</button>`}
  $("#calendarDays").innerHTML=html;
}
$("#prevMonth").onclick=()=>{view.setMonth(view.getMonth()-1);renderCalendar()};
$("#nextMonth").onclick=()=>{view.setMonth(view.getMonth()+1);renderCalendar()};
renderCalendar();
/* Biblioteca como página própria */
let pageFilter="todos";
function renderPageLibrary(){
  const input=document.querySelector("#pageBookSearch");
  const q=(input?.value||"").trim().toLowerCase();
  const items=libraryBooks.filter(b=>(pageFilter==="todos"||b.status===pageFilter)&&(`${b.title} ${b.author}`.toLowerCase().includes(q)));
  const grid=document.querySelector("#pageLibraryGrid"); if(!grid)return;
  grid.innerHTML=items.map(b=>`<article class="library-book page-book"><div class="library-cover status-${b.status}"><span>RE7</span><strong>${b.number}</strong><small>Clube de Leitura</small></div><div class="library-info"><span class="status-tag ${b.status}">${b.label}</span><h4>${b.title}</h4><p>${b.author}</p><p class="book-description">${b.description}</p><button class="book-details page-detail" data-book="${b.id}">Abrir ficha →</button></div></article>`).join("");
  document.querySelector("#pageLibraryEmpty").hidden=items.length!==0;
  document.querySelectorAll(".page-detail").forEach(btn=>btn.onclick=()=>showBook(Number(btn.dataset.book)));
}
function showView(view){
  const dashboard=document.querySelector("#dashboardView"),library=document.querySelector("#libraryView"),calendar=document.querySelector("#calendarView"),reading=document.querySelector("#readingView"),voting=document.querySelector("#votingView"),meetings=document.querySelector("#meetingsView"),participate=document.querySelector("#participateView");
  dashboard.hidden=view!=="dashboard"; library.hidden=view!=="biblioteca"; if(calendar)calendar.hidden=view!=="calendario"; if(reading)reading.hidden=view!=="leitura"; if(voting)voting.hidden=view!=="votacoes"; if(meetings)meetings.hidden=view!=="encontros"; if(participate)participate.hidden=view!=="participar";
  if(view==="biblioteca")renderPageLibrary();
  if(view==="calendario")renderPageCalendar();
  if(view==="leitura")renderPersonalReading();
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll('[data-view-link="biblioteca"]').forEach(a=>a.addEventListener("click",e=>{e.preventDefault();showView("biblioteca");history.replaceState(null,"","#biblioteca")}));
document.querySelector("#backDashboard")?.addEventListener("click",()=>{showView("dashboard");history.replaceState(null,"","#inicio")});
document.querySelector("#pageBookSearch")?.addEventListener("input",renderPageLibrary);
document.querySelectorAll("[data-page-filter]").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll("[data-page-filter]").forEach(x=>x.classList.remove("active"));btn.classList.add("active");pageFilter=btn.dataset.pageFilter;renderPageLibrary()}));
document.querySelector("#pageAddBook")?.addEventListener("click",()=>info("Sugerir um livro","Na próxima etapa, este botão receberá título, autor e o motivo da sugestão para encaminhar o livro à votação."));
if(location.hash==="#biblioteca")showView("biblioteca");

/* Corrige navegação entre a Biblioteca e as seções do Dashboard */
document.querySelectorAll('[data-view-link="dashboard"]').forEach(a=>a.addEventListener("click",e=>{
  e.preventDefault();
  const target=a.getAttribute("href");
  showView("dashboard");
  history.replaceState(null,"",target);
  requestAnimationFrame(()=>document.querySelector(target)?.scrollIntoView({behavior:"smooth",block:"start"}));
}));

/* Navegação robusta para seções internas */
function openDashboardSection(selector){
  showView("dashboard");
  history.replaceState(null,"",selector);
  setTimeout(()=>{
    const el=document.querySelector(selector);
    if(el){
      const header=document.querySelector("header");
      const top=el.getBoundingClientRect().top+window.scrollY-(header?.offsetHeight||92)-20;
      window.scrollTo({top,behavior:"smooth"});
    }
  },60);
}
document.querySelectorAll('[data-view-link="dashboard"]').forEach(a=>{
  a.onclick=e=>{e.preventDefault();openDashboardSection(a.getAttribute("href"));};
});

/* Página própria — Calendário */
let pageCalendarDate=new Date();pageCalendarDate.setDate(1);
function renderPageCalendar(){
 const el=document.querySelector("#pageCalendarDays");if(!el)return;
 const y=pageCalendarDate.getFullYear(),m=pageCalendarDate.getMonth(),first=new Date(y,m,1).getDay(),last=new Date(y,m+1,0).getDate(),today=new Date();
 document.querySelector("#pageCalendarTitle").textContent=`${months[m]} ${y}`;
 let out="";for(let i=0;i<first;i++)out+='<span class="blank"></span>';
 for(let d=1;d<=last;d++){const now=d===today.getDate()&&m===today.getMonth()&&y===today.getFullYear();out+=`<button class="${now?"today":""}"><span>${d}</span></button>`;}
 el.innerHTML=out;
}
document.querySelector("#pagePrevMonth")?.addEventListener("click",()=>{pageCalendarDate.setMonth(pageCalendarDate.getMonth()-1);renderPageCalendar()});
document.querySelector("#pageNextMonth")?.addEventListener("click",()=>{pageCalendarDate.setMonth(pageCalendarDate.getMonth()+1);renderPageCalendar()});
document.querySelectorAll('[data-view-link="calendario"]').forEach(a=>a.addEventListener("click",e=>{e.preventDefault();showView("calendario");history.replaceState(null,"","#agenda")}));
document.querySelector("#calendarBackDashboard")?.addEventListener("click",()=>{showView("dashboard");history.replaceState(null,"","#inicio")});
["#newEventBtn","#agendaCreateBtn"].forEach(s=>document.querySelector(s)?.addEventListener("click",()=>info("Novo encontro","Na etapa Firebase, aqui você poderá informar data, horário, local e escolher entre encontro presencial ou on-line.")));
if(location.hash==="#agenda")showView("calendario");

/* Página própria — Minha Leitura */
let personalProgress=Number(localStorage.getItem("re7-progress")||0);
let chapterCount=Number(localStorage.getItem("re7-chapters")||0);
function renderPersonalReading(){
 const t=document.querySelector("#personalProgressText"),b=document.querySelector("#personalProgressBar"),ch=document.querySelector("#chaptersRead"),n=document.querySelector("#readingNotes");
 if(t)t.textContent=personalProgress+"%";if(b)b.style.width=personalProgress+"%";if(ch)ch.textContent=chapterCount;if(n&&!n.dataset.loaded){n.value=localStorage.getItem("re7-notes")||"";n.dataset.loaded="1";}
}
document.querySelectorAll('[data-view-link="leitura"]').forEach(a=>a.addEventListener("click",e=>{e.preventDefault();showView("leitura");history.replaceState(null,"","#minha-leitura")}));
document.querySelectorAll("[data-progress-add]").forEach(btn=>btn.addEventListener("click",()=>{personalProgress=Math.min(100,personalProgress+Number(btn.dataset.progressAdd));localStorage.setItem("re7-progress",personalProgress);renderPersonalReading()}));
document.querySelector("#resetPersonalProgress")?.addEventListener("click",()=>{personalProgress=0;localStorage.setItem("re7-progress","0");renderPersonalReading()});
document.querySelector("#chapterBtn")?.addEventListener("click",()=>{chapterCount++;localStorage.setItem("re7-chapters",chapterCount);renderPersonalReading()});
document.querySelector("#saveNoteBtn")?.addEventListener("click",()=>{const n=document.querySelector("#readingNotes"),s=document.querySelector("#noteStatus");localStorage.setItem("re7-notes",n.value);s.textContent="Anotação salva neste navegador ✓";setTimeout(()=>s.textContent="Salvo somente neste navegador",2200)});
document.querySelector("#readingBackDashboard")?.addEventListener("click",()=>{showView("dashboard");history.replaceState(null,"","#inicio")});
if(location.hash==="#minha-leitura")showView("leitura");

/* Página própria — Votações */
document.querySelectorAll('[data-view-link="votacoes"]').forEach(a=>a.addEventListener("click",e=>{e.preventDefault();showView("votacoes");history.replaceState(null,"","#votacoes")}));
document.querySelector("#votingBackDashboard")?.addEventListener("click",()=>{showView("dashboard");history.replaceState(null,"","#inicio")});
document.querySelectorAll('[data-view-link="votacoes"]').forEach(a=>a.addEventListener("click",e=>{e.preventDefault();showView("votacoes");history.replaceState(null,"","#votacoes")}));
document.querySelector("#votingBackDashboard")?.addEventListener("click",()=>{showView("dashboard");history.replaceState(null,"","#inicio")});
if(location.hash==="#votacoes")showView("votacoes");


/* Firebase — Próximo encontro (somente leitura) */
(async function loadFirebaseMeeting(){
  const title=document.querySelector("#meetingTitle");
  const details=document.querySelector("#meetingDetails");
  const note=document.querySelector("#meetingNote");
  if(!title||!details)return;
  try{
    const {initializeApp}=await import("https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js");
    const {getFirestore,collection,query,where,getDocs,limit}=await import("https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js");
    const firebaseConfig={
      apiKey:"AIzaSyAZjk_gY-uC0nJvilClYIWHKkAleNSSAAc",
      authDomain:"re7nascer.firebaseapp.com",
      projectId:"re7nascer",
      storageBucket:"re7nascer.firebasestorage.app",
      messagingSenderId:"224691445083",
      appId:"1:224691445083:web:8a3dd40472062325648e7e"
    };
    const db=getFirestore(initializeApp(firebaseConfig));
    const snap=await getDocs(query(collection(db,"encontros"),where("ativo","==",true),limit(1)));
    if(snap.empty){
      title.textContent="Nenhum encontro ativo";
      details.textContent="A próxima data ainda será definida.";
      if(note)note.textContent="";
      return;
    }
    const d=snap.docs[0].data();
    title.textContent=d.titulo||"Próximo encontro";
    const parts=[];
    if(d.data)parts.push("📅 "+d.data);
    if(d.horario)parts.push("🕒 "+d.horario);
    if(d.local)parts.push("📍 "+d.local);
    if(d.modalidade)parts.push("☕ "+d.modalidade);
    details.textContent=parts.join("  •  ")||"Informações a confirmar.";
    if(note)note.textContent=d.observacao||"";
    const pt=document.querySelector("#meetingPageTitle"),pm=document.querySelector("#meetingPageMeta"),pn=document.querySelector("#meetingPageNote");if(pt)pt.textContent=d.titulo||"Próximo encontro";if(pm)pm.textContent=parts.join("  •  ")||"Informações a confirmar.";if(pn)pn.textContent=d.observacao||"";
  }catch(err){
    console.error("RE7NASCER Firestore:",err);
    title.textContent="Próximo encontro";
    details.textContent="Não foi possível carregar a agenda agora.";
    if(note)note.textContent="Tente atualizar a página em alguns instantes.";
  }
})();

/* Página própria — Encontros */
document.querySelectorAll('[data-view-link="encontros"]').forEach(a=>a.addEventListener("click",e=>{e.preventDefault();showView("encontros");history.replaceState(null,"","#encontros")}));
document.querySelector("#meetingsBackDashboard")?.addEventListener("click",()=>{showView("dashboard");history.replaceState(null,"","#inicio")});
if(location.hash==="#encontros")showView("encontros");

/* Firebase compartilhado — votos e inscrições */
const re7FirebaseConfig={apiKey:"AIzaSyAZjk_gY-uC0nJvilClYIWHKkAleNSSAAc",authDomain:"re7nascer.firebaseapp.com",projectId:"re7nascer",storageBucket:"re7nascer.firebasestorage.app",messagingSenderId:"224691445083",appId:"1:224691445083:web:8a3dd40472062325648e7e"};
async function re7Firestore(){
 const {initializeApp,getApps}=await import("https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js");
 const fs=await import("https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js");
 const app=getApps().length?getApps()[0]:initializeApp(re7FirebaseConfig);
 return {db:fs.getFirestore(app),fs};
}
document.querySelector("#voteForm")?.addEventListener("submit",async e=>{
 e.preventDefault();const feedback=document.querySelector("#voteFeedback"),form=e.currentTarget,selected=new FormData(form).get("bookVote"),name=document.querySelector("#voterName")?.value.trim();
 if(!selected||!name){feedback.textContent="Escolha uma leitura e informe seu nome.";return}
 feedback.textContent="Registrando seu voto...";
 try{const {db,fs}=await re7Firestore();await fs.addDoc(fs.collection(db,"votos"),{votacao:"primeira-leitura",opcao:selected,nome:name,criadoEm:fs.serverTimestamp()});feedback.textContent="Voto registrado. Obrigado por participar! ✓";form.reset();}
 catch(err){console.error(err);feedback.textContent="A votação ainda precisa ser liberada nas regras do Firebase. Seus dados não foram enviados."}
});
document.querySelectorAll('[data-view-link="participar"]').forEach(a=>a.addEventListener("click",e=>{e.preventDefault();showView("participar");history.replaceState(null,"","#participar")}));
document.querySelector("#participateBackDashboard")?.addEventListener("click",()=>{showView("dashboard");history.replaceState(null,"","#inicio")});
if(location.hash==="#participar")showView("participar");
document.querySelector("#joinForm")?.addEventListener("submit",async e=>{
 e.preventDefault();const form=e.currentTarget,fd=new FormData(form),feedback=document.querySelector("#joinFeedback");
 const interesses=fd.getAll("interesse");if(!interesses.length){feedback.textContent="Marque pelo menos uma forma de participação.";return}
 feedback.textContent="Enviando...";
 try{const {db,fs}=await re7Firestore();await fs.addDoc(fs.collection(db,"inscricoes"),{nome:fd.get("nome").trim(),cidade:fd.get("cidade").trim(),grupo:fd.get("grupo").trim(),whatsapp:fd.get("whatsapp").trim(),email:fd.get("email").trim(),origem:fd.get("origem"),interesses,mensagem:fd.get("mensagem").trim(),status:"pendente",criadoEm:fs.serverTimestamp()});feedback.textContent="Recebemos seu interesse. Obrigado! ✓";form.reset();}
 catch(err){console.error(err);feedback.textContent="A inscrição ainda precisa ser liberada nas regras do Firebase. Seus dados não foram enviados."}
});
