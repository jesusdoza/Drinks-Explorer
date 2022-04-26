

//get drinks section 
let drinksArea=document.querySelector('#drink-list')

//get drink button
let searchButton = document.querySelector('#get-drink');

//get ingredient select
let select = document.querySelector('#ingredient-select')

let test;
//event listeners 
searchButton.addEventListener('click',sendQuery)
select.addEventListener('change',addIngredient)

let drinksMatching =new Set;// all drinks matching criteria by id
let ingredientsChoosen=new Set;  // ingredients user picks
// let fullDrinkDetails= new Set;   // store full drink info for matching drinks
let fullIngredientList= new Set; //store ingredients to keep from fetching

let inDom=new Set;// is it already in dom?

let newQuery=false;


//call on load
getDrinkIngredientList()









// ===============================================================
// ========FUNCTIONS BELOW
// ===============================================================

function sendQuery(){
//if user added something new
if(newQuery==true){

    //this new query has started and is now old and should not be rerun
    newQuery=false;

    //blank drink section for new query
    drinksArea.innerHTML='';


    //send query for ingredients and so on
    getDrinksByIngredients()
}

else{
    console.log('this query already run add something new')
}







}

//not implemented yet
function makeDrinkElement(data_){
    let name, 
    id, 
    category, 
    image, 
    instructions,  
    ingredients;

    // li to put as drink into list in dom
    let drinkLi = document.createElement('li');


    name=data.drinks[0].strDrink;
    id=data.drinks[0].idDrink;
    category=data.drinks[0].strCategory;
    image=data.drinks[0].strDrinkThumb;
    instructions=data.drinks[0].strInstructions


    //restructure ingredients into string for display
    for(let i =1; i<=15; i++){
        //if str ingredient is no null then keep going through
        if(data.drinks[0][ `strIngredient${i}`]){
            ingredients+=data.drinks[0][`strIngredient${i}`] +" "+ data.drinks[0][`strMeasure${i}`] + '<br>'
        }
       
        
    }

    drinkLi.innerHTML=`
    <section class="drink-container">
         <div class="drink-image">
             <img src="${image}" alt="drink-picture">
         </div>

        <section class="drink-info">
             <h3>${name}</h3>
             <span>${id}<br></span>
             <h4>Category: </>
             <span>${category}</span>
        </section>
        <section class="drink-desc">
             <h4>Ingredients</h4>
             <p>${ingredients}</p>
             <p>${instructions}</p>
         </section>
     </section>  
    `//==============================big text string END



}



   //fetch full details of  1 drink
   function drinkDetails(){
    
    //use set to get id of each drink
    drinksMatching.forEach((e)=>{

    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${e.idDrink}`)
    .then(res=>res.json())
    .then((data)=>{
        // test=data;
        let name, 
        id, 
        category, 
        image, 
        instructions,  
        ingredientMeasures;

        let ingredients='';

        name=data.drinks[0].strDrink;
        id=data.drinks[0].idDrink;
        category=data.drinks[0].strCategory;
        image=data.drinks[0].strDrinkThumb;
        instructions=data.drinks[0].strInstructions

        for(let i =1; i<=15; i++){
            //if str ingredient is no null then keep going through
            if(data.drinks[0][ `strIngredient${i}`]){
                ingredients+=data.drinks[0][`strIngredient${i}`] +" "+ data.drinks[0][`strMeasure${i}`] + '<br>'
            }
           
            
        }
    //   console.log(ingredients)
        

        // li to put as drink into list in dom
        let drinkLi = document.createElement('li');

       drinkLi.innerHTML=`
       <section class="drink-container">
            
            <section class="drink-info">
                <h3>${name}</h3>
                <span>${id}<br></span>
                <h4>Category: </>
                <span>${category}</span>
            </section>
            <div class="drink-image">
                <img src="${image}" alt="drink-picture">
            </div>
            <section class="drink-desc">   
                <h4>Ingredients</h4>
                <p>${ingredients}</p>
                <p>${instructions}</p>
            </section>
        </section>  
       `//==============================big text string

        //if dom does not already have this ID
       if(!inDom.has(id)){

            let domPlace=document.querySelector('#drink-list')

            //if already children place before first child
            if(domPlace.firstChild){
                let child = domPlace.firstChild;
                domPlace.insertBefore(drinkLi,child)
            }
            else{//else just append since parent is empty
                    domPlace.appendChild(drinkLi);
            }

            inDom.add(id)//dont want to add multiples to dom

       }//end of if in DOM
       


    })//then end




    })//for each end
 }




//not working right
//fetch drinks that contain ingredient string and add to set one at a time
// function getDrinksByIngredients(ingredient_){
    

//     console.log(' call getdrinksbyingredients: ')
//     console.log(ingredient_)
//             fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient_}`)
//             .then(res=>res.json())
//             .then( data=>{
//                 console.log(data)
//                 data.drinks.forEach((matchingDrink)=>{
//                     drinksMatching.add(matchingDrink.idDrink)
//                 })
//              })
            
//         }





//fetch drinks that contain ingredients
function getDrinksByIngredients(){
    let choosenIngredients = document.querySelectorAll('#ingredient-choosen li')

    console.log(' call getdrinksbyingredients')
    console.log(choosenIngredients)
    choosenIngredients.forEach((e)=>console.log(`ingredient is ${e.innerText}`))

    //for each incase multiple ingredients are choosen
        choosenIngredients.forEach((ingredient_)=>{

            //fetch drinks that match the ingredient choosen by user
            fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient_.innerText}`)
            .then(res=>res.json())
            .then( data=>{
    
                console.log('get drinks by ingredient()'+data)

                //for each of the drinks retrieved 
                data.drinks.forEach((matchingDrink)=>{
                //add dink to set 
                drinksMatching.add(matchingDrink)

                //new fetch function to get drink details
                drinkDetails()
                })
             })
            })
    }

    
 


//add ingredients to selected section in dom 
function addIngredient(event){
    //ignore the place holder
    if(event.target.value.toLowerCase()=='default'){
        console.log('default value @addIngredient()'+event.target.value)
        return
    }
   
    //new ingredient choosen this is a new query
    newQuery=true;

    //get the value of target
    let value=event.target.value;
    

    //create element to insert into dom
    let li= document.createElement('li');
    li.innerText=value;
    li.dataset.value=value; 

    console.log(`value is ${li.dataset.value}`)

    //add remove event to li element
    li.addEventListener('click',remove)
    
    //add to dom
    appendTo(li,'#ingredient-choosen')
}




//remove from dom on what is clicked
function remove(event){

    console.log(event.target)
    event.target.remove()
}




//working
//fetches array with all ingredients from api if not in set already
function getDrinkIngredientList(){

    if(fullIngredientList.size){
        console.log('already have ingridients');
        return;

    }
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list`)
    .then((res)=>res.json())

    .then(ingredients => {
        console.log(`ingredients are`)
        console.log(ingredients)

        //order ingredients by alphabetical
        let sortedIngredients = ingredients.drinks.sort((a,b)=>{
            if(a.strIngredient1 > b.strIngredient1){
                return 1
            }
            else{
                return -1
            }
        })
        test=sortedIngredients;
        

        
        sortedIngredients.forEach((item)=>{
            // console.log(item)
            //create option element for DOM
            let option = document.createElement('option');


            option.value=item.strIngredient1;
            option.innerText=item.strIngredient1;

            //add ingredient to set 
            fullIngredientList.add(item.strIngredient1)

            //insert into dom at parent selector
            appendTo(option,"#ingredient-select")
        })
        

        //implement maybe caching of ingredients
        // localStorage.setItem('fullIngredientList',fullIngredientList)






        // ingredients.drinks.forEach((item)=>{
        //     // console.log(item)

        //     let option = document.createElement('option');


        //     option.value=item.strIngredient1;
        //     option.innerText=item.strIngredient1;

        //     //add ingredient to set 
        //     fullIngredientList.add(item.strIngredient1)

        //     //insert into dom at parent selector
        //     appendTo(option,"#ingredient-select")
        // })
        
        // localStorage.setItem('fullIngredientList',fullIngredientList)
    })
    .catch(err=> console.log(`error ${err}`))
}



//insert into dom function
function appendTo(childNode_, parentSelector_=body){

    const parent=document.querySelector(parentSelector_);

    parent.appendChild(childNode_);



}

//NOT USED
// //fetches drinks by ingredient
// function fetchDrinkList(ingredient_){


//     fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient_}`)
//     .then((res)=>res.json())

//     .then(data => {
//         console.log(data)

//         data.drinks.forEach((drink)=>{
//             drinksMatching.add(drink)
//         })

        




//     })
//     .catch(err=> console.log(`error ${err}`))


// }


