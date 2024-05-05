//File to manage the Product management section in the inventory.php page

/*
NOTE: The main Form refers to the form in the product management section of the inventory.php page. The one that is there when the page loads.
The subForm refers to the new row that is created when the user clicks the add product button in the product management section of the inventory.php page.
*/

/*Brief overview of all the functions in this file and how they work
1. newSubForm() - This function is called when the user clicks the add product button in the product management section of the inventory.php page. It gets the data from the main form and calls the createSubForm() function to create a new subForm.
2. createSubForm() - This function creates a new subForm and adds it to the productFields div. It also adds the DOM elements to the new subForm.
3. addElements() - This function adds the DOM elements to the new subForm.
4. calculatePrice() - This function calculates the price of a product based on the category, size, color and collar of the product.
5. removeSubForm() - This function removes a subForm when the user clicks the remove button in that subForm.
6. nextSubForm() - This function is called when the user clicks the add another product button in a subForm. It gets the data from the subForm and calls the createSubForm() function to create a new subForm.
7. changeCategory() - This function is called when the user changes the product category in a subForm. It adds the collar field if the product category is a dress.
*/

//Function to create a new form to add a new product
var fieldID=0;
function newSubForm()
{
    //Select the main form
    let mainForm=document.getElementById("productForm");
    //Get the details currently in the main form
    let shopNumber=mainForm.querySelector("#shopNumberP").value;
    let productCategory=mainForm.querySelector("#productCategory").selectedIndex;
    let type=mainForm.querySelector("#productCategory").value;
    let productCategoryOptions=mainForm.querySelector("#productCategory").options;
    let productColor=mainForm.querySelector("#productColor").value;
    let productSize=mainForm.querySelector("#productSize").value;
    //make sure the size is a number
    if(isNaN(productSize)){
        alert("Please enter a number for the size");
        return;
    }
    productSize=parseInt(productSize);
    //increase the size by 2
    productSize+=2;
    let productPrice=mainForm.querySelector("#productPrice").value;
    // let productQuantity=mainForm.querySelector("#productQuantity").value;
    let productQuantity="";
    let collar=mainForm.querySelector("#collar").selectedIndex;
    let collarOptions=mainForm.querySelector("#collar").options;
    //Put the data in an object to send it to the next function
    let productData={
        shopNumber:shopNumber,
        productCategory:productCategory,
        productColor:productColor,
        productSize:productSize,
        productPrice:productPrice,
        productQuantity:productQuantity,
        collar:collar,
        productCategoryOptions:productCategoryOptions,
        collarOptions:collarOptions,
        type:type
    }
    //Call the function to create the new subForm
    createSubForm(productData);
}

//Function to addDOM elements to the new subForm
function createSubForm(productData){
  let elementsArray=[];//Array to store the elements to add to the new subForm
  //Select the area to add the new subForm
  let subForm=document.getElementById("productFields");
    //Create the new subForm
    var newFields=document.createElement("div");//Create the div to contain the new fields
    //Set the id to the new div
    newFields.setAttribute("id","productFields"+fieldID);
    //Set the class to the new div
    newFields.setAttribute("class","productFields");
    fieldID++;//Increment the fieldID
    //Create the new fields
    //Create the shopNumber field which is a select element
    var shopNumber=document.createElement("select");
    shopNumber.setAttribute("id","shopNumber"+fieldID);
    //Create the options for the select element
    var defaultOption=document.createElement("option");
    defaultOption.setAttribute("value","0");
    defaultOption.innerHTML="Select a shop number";
    var option1=document.createElement("option");
    option1.setAttribute("value","1");
    option1.innerHTML="Shop 1";
    var option2=document.createElement("option");
    option2.setAttribute("value","2");
    option2.innerHTML="Shop 2";
    //Attach the options to the select element
    shopNumber.appendChild(defaultOption);
    shopNumber.appendChild(option1);
    shopNumber.appendChild(option2);
    shopNumber.setAttribute("name","shopNumber[]");
    shopNumber.selectedIndex=productData.shopNumber;//Set the selected index to the shopNumber value
    //Add a label to the shopNumber field
    var shopNumberLabel=document.createElement("label");
    shopNumberLabel.innerHTML="Shop Number";
    shopNumberLabel.setAttribute("for","shopNumber"+fieldID);
    //Add the shopNumber field and label to the array
    elementsArray.push(shopNumberLabel);
    elementsArray.push(shopNumber);
    //Create the productCategory field
    var productCategory=document.createElement("select");
    productCategory.setAttribute("id","productCategory"+fieldID);
    productCategory.setAttribute("name","productCategory[]");
    //Create the options for the select element using the productCategoryOptions from the productData object
    var defaultOption=document.createElement("option");
    for(let i=0;i<productData.productCategoryOptions.length;i++){
        var option=document.createElement("option");
        option.setAttribute("value",productData.productCategoryOptions[i].value);
        option.innerHTML=productData.productCategoryOptions[i].innerHTML;
        productCategory.appendChild(option);
    }
    productCategory.selectedIndex=productData.productCategory;//Set the selected index to the productCategory value
    //Set the onchange attribute to the productCategory field
    productCategory.setAttribute("onchange","changeCategory(this)");
    //Add a label to the productCategory field
    var productCategoryLabel=document.createElement("label");
    productCategoryLabel.innerHTML="Product Category";
    productCategoryLabel.setAttribute("for","productCategory"+fieldID);
    //Add the productCategory field and label to the array
    elementsArray.push(productCategoryLabel);
    elementsArray.push(productCategory);

    //Section to create the collar field if the productCategory is a dress
    if(productData.type=="dresses"){
        //Create the collar field
        var collar=document.createElement("select");
        collar.setAttribute("id","collar"+fieldID);
        collar.setAttribute("name","collar[]");
        //Add a label to the collar field
        var collarLabel=document.createElement("label");
        collarLabel.innerHTML="Collar";
        collarLabel.setAttribute("for","collar"+fieldID);
        //set a name for the label
        collarLabel.setAttribute("name","collarLabel");
        //Add options to the collar field using the collarOptions from the productData object
        for(let i=0;i<productData.collarOptions.length;i++){
            var option=document.createElement("option");
            option.setAttribute("value",productData.collarOptions[i].value);
            option.innerHTML=productData.collarOptions[i].innerHTML;
            collar.appendChild(option);
        }
        collar.selectedIndex=productData.collar;//Set the selected index to the collar value
        //Add the collar field and label to the array
        elementsArray.push(collarLabel);
        elementsArray.push(collar);
    }

    //To create the productColor field which is a text input
    var productColor=document.createElement("input");
    productColor.setAttribute("type","text");
    productColor.setAttribute("id","productColor"+fieldID);
    productColor.setAttribute("name","productColor[]");
    productColor.setAttribute("value",productData.productColor);
    //Add a label to the productColor field
    var productColorLabel=document.createElement("label");
    productColorLabel.innerHTML="Product Color";
    productColorLabel.setAttribute("for","productColor"+fieldID);
    //Add the productColor field and label to the array
    elementsArray.push(productColorLabel);
    elementsArray.push(productColor);

    //All the other fields are text inputs
    //Create the productSize field
    var productSize=document.createElement("input");
    productSize.setAttribute("type","text");
    productSize.setAttribute("id","productSize"+fieldID);
    productSize.setAttribute("name","productSize[]");
    productSize.setAttribute("value",productData.productSize);
    //Add a label to the productSize field
    var productSizeLabel=document.createElement("label");
    productSizeLabel.innerHTML="Product Size";
    productSizeLabel.setAttribute("for","productSize"+fieldID);
    //Add the productSize field and label to the array
    elementsArray.push(productSizeLabel);
    elementsArray.push(productSize);

    //Create the productQuantity field
    var productQuantity=document.createElement("input");
    productQuantity.setAttribute("type","text");
    productQuantity.setAttribute("id","productQuantity"+fieldID);
    productQuantity.setAttribute("name","productQuantity[]");
    productQuantity.setAttribute("value",productData.productQuantity);
    //Add a label to the productQuantity field
    var productQuantityLabel=document.createElement("label");
    productQuantityLabel.innerHTML="Product Quantity";
    productQuantityLabel.setAttribute("for","productQuantity"+fieldID);
    //Add the productQuantity field and label to the array
    elementsArray.push(productQuantityLabel);
    elementsArray.push(productQuantity);
    //Create the productPrice field
    var productPrice=document.createElement("input");
    productPrice.setAttribute("type","text");
    productPrice.setAttribute("id","productPrice"+fieldID);
    productPrice.setAttribute("name","productPrice[]");
    //Calculate the price of the product
    var calculatedPrice=calculatePrice(productData.type,productData.productSize,productData.productColor,productData.collar);
    if(calculatedPrice==undefined){
        calculatedPrice="Error calculating price"
    }
    productPrice.setAttribute("value",calculatedPrice);
    //Add a label to the productPrice field
    var productPriceLabel=document.createElement("label");
    productPriceLabel.innerHTML="Product Price";
    productPriceLabel.setAttribute("for","productPrice"+fieldID);
    //Add the productPrice field and label to the array
    elementsArray.push(productPriceLabel);
    elementsArray.push(productPrice);

    //Add a button to add a new subForm
    var addButton=document.createElement("button");
    addButton.setAttribute("type","button");
    addButton.setAttribute("id","addButton"+fieldID);
    let target=newFields.getAttribute("id");
    let action="nextSubForm('"+target+"')";
    addButton.setAttribute("onclick",action);
    addButton.innerHTML="Add another product";
    //Add the button to the array
    elementsArray.push(addButton);
    //Add a button to remove the subForm
    var removeButton=document.createElement("button");
    removeButton.setAttribute("type","button");
    removeButton.setAttribute("id","removeButton"+fieldID);
    removeButton.setAttribute("onclick","removeSubForm(this)");
    removeButton.innerHTML="Remove this product";
    //Add the button to the array
    elementsArray.push(removeButton);
    addElements(elementsArray,subForm,newFields);//Call the function to add the elements to the new subForm
}

//Function that adds DOM elements to the new subForm
function addElements(elementsArray,subForm,newFields){
    //Add the elements to the productFields div
    for(let i=0;i<elementsArray.length;i++){
        newFields.appendChild(elementsArray[i]);
    }
    //Add the newFields div to the subForm div
    subForm.appendChild(newFields);
}
//Function to calculate the price of a product
function calculatePrice(category, size, color, style) {
    var price;
    if (category === 'sweaters') {
        if (size >= 22 && size <= 26) {
            price = 300;
        } else if (size >= 28 && size <= 30) {
            price = 350;
        } else if (size >= 32 && size <= 34) {
            price = 500;
        } else if (size >= 36 && size <= 38) {
            price = 550;
        } else if (size == 40) {
            price = 600;
        }
    } else if (category === 'trucksuits') {
        if (size >= 22 && size <= 30) {
            price = 700;
        } else if (size >= 32 && size <= 36) {
            price = 800;
        } else if (size >= 38 && size <= 40) {
            price = 900;
        }
    } else if (category === 'dresses') {
        if (color === 'grey' && style === 'collar') {
            switch(size) {
                case 24:
                    price = 370;
                    break;
                case 26:
                    price = 390;
                    break;
                case 28:
                    price = 410;
                    break;
                case 30:
                    price = 440;
                    break;
                case 32:
                    price = 470;
                    break;
                case 34:
                    price = 500;
                    break;
                case 36:
                    price = 550;
                    break;
                case 38:
                    price = 570;
                    break;
                case 40:
                    price = 610;
                    break;
            }
        } else {
            switch(size) {
                case 24:
                    price = 210;
                    break;
                case 26:
                    price = 220;
                    break;
                case 28:
                    price = 230;
                    break;
                case 30:
                    price = 240;
                    break;
                case 32:
                    price = 250;
                    break;
                case 34:
                    price = 260;
                    break;
                case 36:
                    price = 270;
                    break;
                case 38:
                    price = 290;
                    break;
                case 40:
                    price = 300;
                    break;
            }
        }
    } else {
        price = 500 + idCounter * 50;
    }
    return price;
}

//Function to remove a subForm
function removeSubForm(button){
    //Select the subForm to remove
    let subForm=button.parentElement;
    //Remove the subForm
    subForm.remove();
}

//Function to add a new subForm based on the previous subform
function nextSubForm(target)
{
    console.clear();
    //select the target div
    let targetDiv=document.getElementById(target);
    //get the price field from the targetDiv
    let targetPrice=targetDiv.getElementsByTagName("input").namedItem("productPrice[]").value;
    //get the quantity field from the targetDiv
    // let targetQuantity=targetDiv.getElementsByTagName("input").namedItem("productQuantity[]").value;
    let targetQuantity="";
    //get the size field from the targetDiv
    let targetSize=targetDiv.getElementsByTagName("input").namedItem("productSize[]").value;
    //Make sure the size is a number
    if(isNaN(targetSize)){
        alert("Please enter a number for the size");
        return;
    }
    targetSize=parseInt(targetSize);
    //Increae the size by 2
    targetSize+=2;
    //get the color field from the targetDiv
    let targetColor=targetDiv.getElementsByTagName("input").namedItem("productColor[]").value;
    //get the collar field from the targetDiv if the product is a dress
    let targetCollar,targetCollarOptions;
    if(targetDiv.getElementsByTagName("select").namedItem("collar[]")!=null){
     targetCollar=targetDiv.getElementsByTagName("select").namedItem("collar[]").selectedIndex;
     targetCollarOptions=targetDiv.getElementsByTagName("select").namedItem("collar[]").options;
    }
    //get the category field from the targetDiv
    let targetCategory=targetDiv.getElementsByTagName("select").namedItem("productCategory[]").selectedIndex;
    //get the shopNumber field from the targetDiv
    let targetShopNumber=targetDiv.getElementsByTagName("select").namedItem("shopNumber[]").selectedIndex;
   
    //To create the new subForm just like the new subForm function but with the values from the previous subForm
    //Put the data in an object to send it to the next function
    if(targetCollar==undefined || targetCollar==null){
        targetCollar=0;
        targetCollarOptions=null;
    }
    let productData={
            shopNumber:targetShopNumber,
            productCategory:targetCategory,
            productColor:targetColor,
            productSize:targetSize,
            productPrice:targetPrice,
            productQuantity:targetQuantity,
            collar:targetCollar,
            type:targetDiv.getElementsByTagName("select").namedItem("productCategory[]").value,
            productCategoryOptions:targetDiv.getElementsByTagName("select").namedItem("productCategory[]").options,
            collarOptions:targetCollarOptions
    }
    createSubForm(productData);
}

//Function to add the collar field if the productCategory is a dress in the new subForm
function changeCategory(productCategory){
    //Select the target div
    let targetDiv=productCategory.parentElement;
    //Select the collar field
    let collarField=targetDiv.getElementsByTagName("select").namedItem("collar[]");
    let label2=targetDiv.getElementsByTagName("label").namedItem("collarLabel");
    //Remove the collar field if it exists
    if(collarField!=null){
        collarField.remove();
        label2.remove();//remove the label
    }
    //Check if the productCategory is a dress and add the collar field
    if(productCategory.value=="dresses"){
        //Create the collar field
        var collar=document.createElement("select");
        collar.setAttribute("id","collar"+fieldID);
        collar.setAttribute("name","collar[]");
        //Add a label to the collar field
        var collarLabel=document.createElement("label");
        collarLabel.innerHTML="Collar";
        collarLabel.setAttribute("name","collarLabel");
        collarLabel.setAttribute("for","collar"+fieldID);
        //Add options to the collar field using the collarOptions from the main form
        let mainForm=document.getElementById("productForm");
        let collarOptions=mainForm.querySelector("#collar").options;
        for(let i=0;i<collarOptions.length;i++){
            var option=document.createElement("option");
            option.setAttribute("value",collarOptions[i].value);
            option.innerHTML=collarOptions[i].innerHTML;
            collar.appendChild(option);
        }
        //Add the collar field and label to the target div
        targetDiv.insertBefore(collar,productCategory.nextSibling);
        targetDiv.insertBefore(collarLabel,productCategory.nextSibling);
    }
}
