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
$("#meetingBtn").onclick=()=>info("Novo encontro","O módulo de encontros permitirá definir data, horário, local e formato presencial ou on-line.");
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
  const dashboard=document.querySelector("#dashboardView"),library=document.querySelector("#libraryView");
  if(view==="biblioteca"){dashboard.hidden=true;library.hidden=false;renderPageLibrary();window.scrollTo({top:0,behavior:"smooth"});}
  else{dashboard.hidden=false;library.hidden=true;window.scrollTo({top:0,behavior:"smooth"});}
}
document.querySelectorAll('[data-view-link="biblioteca"]').forEach(a=>a.addEventListener("click",e=>{e.preventDefault();showView("biblioteca");history.replaceState(null,"","#biblioteca")}));
document.querySelector("#backDashboard")?.addEventListener("click",()=>{showView("dashboard");history.replaceState(null,"","#inicio")});
document.querySelector("#pageBookSearch")?.addEventListener("input",renderPageLibrary);
document.querySelectorAll("[data-page-filter]").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll("[data-page-filter]").forEach(x=>x.classList.remove("active"));btn.classList.add("active");pageFilter=btn.dataset.pageFilter;renderPageLibrary()}));
document.querySelector("#pageAddBook")?.addEventListener("click",()=>info("Sugerir um livro","Na próxima etapa, este botão receberá título, autor e o motivo da sugestão para encaminhar o livro à votação."));
if(location.hash==="#biblioteca")showView("biblioteca");
