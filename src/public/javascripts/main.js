function myFilter(){
    const input = document.querySelector('#search');
    const filter = input.value.toUpperCase();
    const tbody = document.querySelector('tbody');
    const trList = [...tbody.querySelectorAll('tr')];


    trList.map(row =>{
        const comp = row.querySelector("#company");
        if (comp.textContent.toUpperCase().indexOf(filter) > -1) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
        
    });


}
function main(){
    const btn = document.querySelector("#btn");
    btn.addEventListener("click",function(evt){
        evt.preventDefault();
        myFilter();
    });

}

document.addEventListener('DOMContentLoaded', main);