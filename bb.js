
document.addEventListener("DOMContentLoaded", function(){

const users = {
  admin: { username: "PHC", password: "30998870" },
  official: { username: "PHC", password: "808541" }
};

const modules = [
  { id:"program", title:"program" },

];

let changed=false;

const loginBtn=document.getElementById("loginBtn");
const role=document.getElementById("role");
const username=document.getElementById("username");
const password=document.getElementById("password");
const loginMsg=document.getElementById("loginMsg");

const loginPage=document.getElementById("loginPage");
const adminPage=document.getElementById("adminPage");
const officialPage=document.getElementById("officialPage");
const modulesContainer=document.getElementById("modulesContainer");
const adminData=document.getElementById("adminData");
const status=document.getElementById("status");

function showPage(p){
  loginPage.classList.add("hidden");
  adminPage.classList.add("hidden");
  officialPage.classList.add("hidden");
  document.getElementById(p).classList.remove("hidden");
}

loginBtn.onclick=function(){
  const r=role.value;
  if(username.value===users[r].username && password.value===users[r].password){
    if(r==="admin"){ showPage("adminPage"); loadAdmin(); }
    if(r==="official"){ showPage("officialPage"); loadModules(); startAutoSave(); }
  } else {
    loginMsg.innerText="Invalid login";
  }
};

window.logout=function(){ location.reload(); };

function loadModules(){
  modulesContainer.innerHTML="";
  modules.forEach(m=>{
    const card=document.createElement("div");
    card.className="card";
    card.innerHTML=`
      <h3>${m.title}</h3>
      <table>
        <thead>
          <tr>
          <th>ward</th>
            <th>Programme</th>
            <th>Vacc/received/used</th>
            <th>Total/male/female</th>
             <th>Age/Month</th>
             <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody id="${m.id}Body"></tbody>
      </table>
      <button onclick="addRow('${m.id}Body')">Add Row</button>
    `;
    modulesContainer.appendChild(card);
  });
}

window.addRow=function(id){
  const body=document.getElementById(id);
  const tr=document.createElement("tr");
  tr.innerHTML=`
    <td contenteditable="true"></td>
    <td contenteditable="true"></td>
    <td contenteditable="true"></td>
    <td contenteditable="true"></td>
        <td contenteditable="true"></td>
    <td contenteditable="true"></td>
    <td><button onclick="deleteRow(this)">Delete</button></td>
  `;
  tr.addEventListener("input",()=>changed=true);
  body.appendChild(tr);
};

window.deleteRow=function(btn){
  btn.parentElement.parentElement.remove();
  changed=true;
};

function startAutoSave(){
  setInterval(()=>{
    if(changed){
      saveAll();
      changed=false;
      status.innerText="Auto saved";
    }
  },6000);
}

function saveAll(){
  const existing=JSON.parse(localStorage.getItem("phcData"))||{};
  const newData={};

  modules.forEach(m=>{
    const body=document.getElementById(m.id+"Body");
    newData[m.id]=[];
    for(let r of body.children){
      newData[m.id].push({
        ward:r.children[0].innerText,
        programme:r.children[1].innerText,
        vaccine:r.children[2].innerText,
         total:r.children[3].innerText,
          age:r.children[4].innerText
          
      });
    }
  });

  for(let k in newData){
    if(!existing[k]) existing[k]=[];
    existing[k]=existing[k].concat(newData[k]);
  }

  localStorage.setItem("phcData", JSON.stringify(existing));
}

window.submitAll=function(){
  saveAll();
  alert("Data submitted successfully");
};

function loadAdmin(){
  const data=JSON.parse(localStorage.getItem("phcData"))||{};
  adminData.innerHTML="<pre>"+JSON.stringify(data,null,2)+"</pre>";
}

window.printPDF=function(){ window.print(); };
window.toggleDark=function(){ document.body.classList.toggle("dark"); };

});
