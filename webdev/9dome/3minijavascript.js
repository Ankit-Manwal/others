let btn= document.querySelector("button");
let ul= document.querySelector("ul");
let inp= document.querySelector("input");

btn.addEventListener("click", function(){
  console.log(inp.value);

  let item=document.createElement("li");
  item.innerText=inp.value;

  let delbtn=document.createElement("button");
  delbtn.innerText="delete";
  delbtn.classList.add("delete");

  item.appendChild(delbtn);
  ul.appendChild(item);

  inp.value="";
});

ul.addEventListener("click", function(event){
  if(event.target.nodeName=="BUTTON"){
    let listitem= event.target.parentElement;
    listitem.remove();
    console.log("delete");
  }
})



// let delbtnss= document.querySelectorAll(".delete");     //querySelectorAll work  only for initail task, not for newly added tasks
// console.log(delbtnss.length);
// for(delbt of delbtnss){
//   delbt.addEventListener("click" , function(){
//     let par=this.parentElement;
//     console.log(par);
//     par.remove();
//   })  
// }