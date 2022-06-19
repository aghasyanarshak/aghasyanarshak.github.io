let myNodelist = document.getElementById("myUL");
let myBtn = document.querySelector('.btn');
let input = document.querySelector(".inp");

function check(event){
    if(event.target.tagName === 'LI'){
        event.target.classList.toggle('checked');
    }
}
myNodelist.addEventListener('click',check);

function addNewLi(){
    let newLi = document.createElement("li");
    let newVal = document.createTextNode(input.value);
    let close = document.createElement('span');
    close.classList.add('close');
    close.innerHTML = "&#x2715;";
    newLi.appendChild(newVal);
    newLi.appendChild(close);
    if( input.value === ''){
        alert("You must write something!");
    }else{
        myNodelist.appendChild(newLi);
    }
    input.value = '';
    
}
myBtn.addEventListener('click',addNewLi);

function removeLi(event){
    if(event.target.classList.contains('close')){
        event.target.parentNode.remove();
    }
}
myNodelist.addEventListener('click',removeLi);

    