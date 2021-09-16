window.onload = function() {
    const savedRecipeCard = document.getElementsByClassName('recipe-container')[0];


    const dropDownContent = savedRecipeCard.getElementsByClassName('recipe-card-container')

    for(const card in dropDownContent) {
       dropDownContent[card].addEventListener('mouseover', (e) => {
           dropDownContent[card].getElementsByClassName('missing-dropdown-content')[0].style.display = "block"
       })
       dropDownContent[card].addEventListener('mouseout', (e) => {
        dropDownContent[card].getElementsByClassName('missing-dropdown-content')[0].style.display = "none"
    })
    }






    // dropDownContent.addEventListener('mouseover', () => {
        
    // })

    
    // savedRecipeCard.addEventListener('mouseover', () =>  {
        
    // const dropDownContent = document.getElementsByClassName('missing-dropdown-content')
    // console.log('line 9', dropDownContent)
    // // dropDownContent.forEach((element) => {
    // //     element.style.display = "block"
    // // })

    // const dropDownStuff = dropDownContent.map(element => {
    //     return element.style.display = "block"
    // })

    // console.log('line 18', dropDownStuff)
  
    
        
    //     console.log('line 6');
    //     // ;
    //     // dropDownContent.classList.add('missing-dropdown-content-active');
    //     // dropDownContent.classList.remove('missing-dropdown-content');
    
    // });
    
}

// element.addEventListener("click", myFunction);

// function myFunction() {
//   alert ("Hello World!");
// }

// window.onload
console.log('window', window);


