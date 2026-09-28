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
$("#addBook").onclick=()=>info("Sugestão de livro","Na versão com Firebase, cada participante poderá sugerir livros e o grupo poderá votar.");
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