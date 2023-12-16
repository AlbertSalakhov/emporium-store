//relative to index.html - NOT js file
var RELATIVE_PATH_TO_FLAG_IMGS = './img/flags/';

var storesListWrapperElem = document.querySelector('.js-stores-list');

var selectedCountry;
var isFnfShown;

document.addEventListener("DOMContentLoaded", function () {
    try {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', 'https://ipapi.co/json/', true);

        xhr.send();

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var countryCodeOfUserFromLocation = JSON.parse(xhr.response).country_code;

                var storeObjOfThisCountry = storesArr.find(function (storeObj) {
                    return storeObj.countryCode.trim().toLowerCase() === countryCodeOfUserFromLocation.trim().toLowerCase();
                });

                if (storeObjOfThisCountry) {
                    var uniqStoreId = createUniqStoreId(storeObjOfThisCountry);

                    var topChoiceLinkElem = document.querySelector('.select-items [data-uniq-id="' + uniqStoreId + '"]');

                    if (topChoiceLinkElem) {
                        var storeElemToMoveToTopChoice = topChoiceLinkElem.parentNode;

                        selectItem(storeElemToMoveToTopChoice, false);
                    }
                }
            }
        };
    } catch {
        console.error('Something went wrong during country determination');
    }

    fillCountrySelectWithOtions();
    createCustomSelect();

    document.querySelector('form').addEventListener('submit', function (event) {
        event.preventDefault();

        var isCountrySelected = validateMethod(document.getElementById("countrySelect")),
            isFnFSelected;

        if(isFnfShown) {
            isFnFSelected = validateMethod(document.getElementById("fnfSelect"));
        }

        if(!isCountrySelected) {
            return;
        }

        if(!isFnfShown) {
            window.location.href =  document.querySelector('#countrySelect').value;

            return;
        }

        if(isFnFSelected) {
            //employee - not Friends and Family
            if(document.getElementById("fnfSelect").value === "employee") {
                window.location.href =  document.querySelector('#countrySelect').value;
            } else {
                var fnfItem = fnfArray.find(function (obj) {
                    return obj.countryCode === selectedCountry;
                });

                window.location.href = fnfItem.url;
            }
        }
    });
});

//function declarations start form here
function fillCountrySelectWithOtions(){
    var storeElemOption = document.createElement('option');
    storeElemOption.setAttribute('value', 0);
    storeElemOption.setAttribute('selected', true);
    storeElemOption.classList.add('store-item');
    storeElemOption.innerHTML = '<div class="store-item__link"><div class="store-item__name js-store-item-name">'+ 'Please select country' +'</div></div>';
    storesListWrapperElem.appendChild(storeElemOption);

    storesArr.forEach(function (storeObj) {
        var storeName = storeObj.name;
        var storeUrl = storeObj.url;
        var countryCode = storeObj.countryCode;

        var uniqStoreId = createUniqStoreId(storeObj);

        var storeElemOption = document.createElement('option');

        storeElemOption.setAttribute('value', storeUrl);

        var flagImgPath = RELATIVE_PATH_TO_FLAG_IMGS + storeObj.flagImageName;

        storeElemOption.classList.add('store-item');

        storeElemOption.innerHTML = '<div class="js-store-link store-item__link" data-country-code="'+countryCode+'" data-uniq-id="'+uniqStoreId+'" href="'+storeUrl+'"><div class="store-item__flag js-store-item-flag" style="background-image:url('+ flagImgPath +')"></div><div class="store-item__name js-store-item-name">'+storeName+'</div></div>';

        storesListWrapperElem.appendChild(storeElemOption);
    });
}

function createUniqStoreId(storeObj){
    return storeObj.name + "__" + storeObj.url;
}

// CUSTOM SELECT - START - original can be found here https://www.w3schools.com/howto/howto_custom_select.asp Was modified a little bit
// - moved what happens when option is selected to separate function selectItem

function createCustomSelect() {
    var x, i, j, l, ll, selElmnt, a, b, c;
    /*look for any elements with the class "custom-select":*/
    x = document.getElementsByClassName("custom-select");
    l = x.length;

    for (i = 0; i < l; i++) {
        selElmnt = x[i].getElementsByTagName("select")[0];
        ll = selElmnt.length;
        /*for each element, create a new DIV that will act as the selected item:*/
        a = document.createElement("DIV");
        a.setAttribute("class", "select-selected");
        a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;

        x[i].appendChild(a);
        /*for each element, create a new DIV that will contain the option list:*/
        b = document.createElement("DIV");
        b.setAttribute("class", "select-items select-hide");

        for (j = 1; j < ll; j++) {
            /*for each option in the original select element,
            create a new DIV that will act as an option item:*/
            c = document.createElement("DIV");
            c.setAttribute("class", "select-option-wrapper");
            c.innerHTML = selElmnt.options[j].innerHTML;
            c.addEventListener("click", function(event) {
                selectItem(event.currentTarget, true);
            });
            b.appendChild(c);
        }
        x[i].appendChild(b);
        a.addEventListener("click", function(e) {
            /*when the select box is clicked, close any other select boxes,
            and open/close the current select box:*/
            e.stopPropagation();
            closeAllSelect(this);
            this.nextSibling.classList.toggle("select-hide");
            this.classList.toggle("select-arrow-active");
        });
    }
    function closeAllSelect(elmnt) {
        /*a function that will close all select boxes in the document,
        except the current select box:*/
        var x, y, i, xl, yl, arrNo = [];
        x = document.getElementsByClassName("select-items");
        y = document.getElementsByClassName("select-selected");
        xl = x.length;
        yl = y.length;
        for (i = 0; i < yl; i++) {
            if (elmnt == y[i]) {
                arrNo.push(i)
            } else {
                y[i].classList.remove("select-arrow-active");
            }
        }
        for (i = 0; i < xl; i++) {
            if (arrNo.indexOf(i)) {
                x[i].classList.add("select-hide");
            }
        }
    }
    /*if the user clicks anywhere outside the select box,
    then close all select boxes:*/
    document.addEventListener("click", closeAllSelect);
}

function selectItem(elem, isShouldOpen){
    /*when an item is clicked, update the original select box,
                and the selected item:*/
    var currentlySelectedItem, i, k, options, selectedItemInHeader, originalSelectElem;

    if(elem.querySelector('.js-store-link') && elem.querySelector('.js-store-link').dataset.countryCode) {
        selectedCountry = elem.querySelector('.js-store-link').dataset.countryCode;

        showOrUnshowFnFSelector();
    };

    originalSelectElem = elem.parentNode.parentNode.getElementsByTagName("select");

    options = originalSelectElem[0];
    selectedItemInHeader = elem.parentNode.previousSibling;
    for (i = 0; i < options.length; i++) {
        if (options.options[i].innerHTML == elem.innerHTML) {
            options.selectedIndex = i;
            selectedItemInHeader.innerHTML = elem.innerHTML;
            currentlySelectedItem = elem.parentNode.getElementsByClassName("same-as-selected");
            for (k = 0; k < currentlySelectedItem.length; k++) {
                currentlySelectedItem[k].removeAttribute("class");
            }
            elem.setAttribute("class", "same-as-selected");
            break;
        }
    }

    if(isShouldOpen){
        selectedItemInHeader.click();
    }

    validateMethod(originalSelectElem[0]);
}
// CUSTOM SELECT - END

function showOrUnshowFnFSelector () {
    // check ifFnfExists for this country
    var fnfItem = fnfArray.find(function (obj) {
        return obj.countryCode === selectedCountry;
    });

    if(fnfItem) {
        document.querySelector('.js-fnf-select-wrapper').classList.remove('d-none');
        isFnfShown = true;
    } else {
        document.querySelector('.js-fnf-select-wrapper').classList.add('d-none');
        isFnfShown = false;
    }
}

function validateMethod(selectElem) {
    var selectWrapperElem =  selectElem.closest('.js-select-wrapper');
    var validationMsgElem = selectWrapperElem.querySelector('.js-validation-messages');
    var selectDivWrapper = selectWrapperElem.querySelector('.custom-select');

    if(selectElem.value === "0"){
        validationMsgElem.classList.remove('d-none');
        selectDivWrapper.classList.add('-has-error');
    } else {
        validationMsgElem.classList.add('d-none');
        selectDivWrapper.classList.remove('-has-error');
    }

    return selectElem.value !== "0";
}
