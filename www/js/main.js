 /*****************************************************************
         Author: Bo Yang
         App Name: ReviewR
         Version: 0.0.1
         Updated: Arpil 18, 2017
     *****************************************************************/

 var app = {
     localStorageList: {
         reviews: []
     }
     , rating: 0
     , stars: null
     , imgPath: null
     , current_review_id: 0
     
     
     
     , init: function () {
         document.addEventListener('deviceready', app.onDeviceReady);
     }
     
     
     
     , onDeviceReady: function () {
         console.dir("enter onDeviceReady method");
         // make sure the onDeviceReady status
         app.Show_home_page();
         // call the Show_home_page fuction
         app.stars = document.querySelectorAll(".star");
         // get all elements from html which class = star
         app.addListeners();
         // call the addListeners fuction
         
         var close_btn_in_add_modal = document.getElementById("crossBtnOfDetailReviewModal");
         close_btn_in_add_modal.addEventListener("touchend", function (ev) {
             close_btn_in_add_modal.setAttribute("href", "#addReviewModal");
             let divAddModalContent = document.getElementById("addModalContent");
             var idPic = document.getElementById("id-pic");
             if (idPic) {
                 divAddModalContent.removeChild(idPic);
             }
             let buttons = document.getElementById("buttons");
             let take_pic_btn = document.getElementById("takePicAddReviewModal");
             if (take_pic_btn) {
                 buttons.removeChild(take_pic_btn);
             }
         });
         document.getElementById("CancelBtnOfAddReviewModal").addEventListener("touchstart", app.Cancel_Add_Review_Modal);
         var btnAddReview = document.getElementById("btnAdd");
         btnAddReview.addEventListener("touchstart", function (ev) {
             app.rating = 0; // reset the rating to default value
             app.Set_Rating(); // call Set_Rating function to get the new rating value
             app.imgPath = null;
             document.getElementById("item").value = "";
             
             var btnTakePic = document.createElement("button");
             btnTakePic.className = "btn btn-positive btn-block";
             // create take picture button in addReviewModal page
             btnTakePic.setAttribute("id", "takePicAddReviewModal");
             // create an id for the take picture button
             var span = document.createElement("span");
             span.className = "icon icon-play";
             span.textContent = "Take Picture";
             btnTakePic.appendChild(span);
             
             let buttons = document.getElementById("buttons");
             let btnCancel = document.getElementById("CancelBtnOfAddReviewModal");
             // create cancel button in addReviewModal page
             buttons.insertBefore(btnTakePic, btnCancel);
             // put the position of take picture button before cancel button
             
             // set the potions of camera plugin
             var options = {
                 quality: 20
                 , destinationType: Camera.DestinationType.DATA_URL
                 , encodingType: Camera.EncodingType.PNG
                 , mediaType: Camera.MediaType.PICTURE
                 , pictureSourceType: Camera.PictureSourceType.CAMERA
                 , allowEdit: true
                 , targetWidth: 300
                 , targetHeight: 300
             };
             btnTakePic.addEventListener("touchstart", function (ev) {
                 navigator.camera.getPicture(app.successCallback, app.errorCallback, options);
             });
         });
         
         var btnDelete = document.getElementById("DeleteBtnOfDetailReviewModal");
         btnDelete.addEventListener("touchstart", app.Delete_Review);
         
         var btnSaveReview = document.getElementById("SaveBtnOfAddReviewModal");
         btnSaveReview.addEventListener("touchstart", app.Save_Review);
     }
     
     
     
     , Show_home_page: function(){
         let list = document.getElementById("review-list");
         list.innerHTML="";
         app.localStorageList = JSON.parse(localStorage.getItem("reviewr-yang0229"));

         if(!app.localStorageList){
             app.localStorageList = {
                 reviews:[]
             };
         }else{
             app.localStorageList.reviews.sort(function(a,b){
                 return a.id - b.id;
                 // sort the reviews by created time (use timestamp as id).
             })
         }
         
         app.localStorageList.reviews.forEach(function(review){
             let li = document.createElement("li");
             li.className = "table-view-cell media";
             
             let img = document.createElement("img");
             img.className = "media-object pull-left";
             img.src =  review.img;
             if(img && img.style){
                 img.style.height = "35%";
                 img.style.width = "35%";
             }
             
             
             let divparent = document.createElement("div");
             divparent.className = "media-body ";
             divparent.textContent = review.name;
             
             let divChildStars = document.createElement("div");
             divChildStars.className = "allStarsPageOne";
             
             for(var i=0; i<review.rating; i++){
                 let span = document.createElement("span");
                 span.className = "starPageOne";
                 span.innerHTML = "&#x2605;";
                 divChildStars.appendChild(span);
                 
             }
             
             for(var i=0; i<5-review.rating; i++){
                 let span = document.createElement("span");
                 span.className = "starPageOne";
                 span.innerHTML = "&#x2606;";
                 divChildStars.appendChild(span);
                 
             }
              
             let a = document.createElement("a");
             a.className = "navigate-right";
             a.href = "#ReviewDetailModal";
             a.setAttribute("id-review-clicked", review.id);
             
             a.addEventListener("touchstart", app.Show_Review_Details);
             
             divparent.appendChild(divChildStars);
             divparent.appendChild(a);
             li.appendChild(img);
             li.appendChild(divparent);
             list.appendChild(li);
         }) 
     }
     
     
     
     , Set_Rating: function () {
         // set the statu for each star, to make sure which one should be filled and which one should be empty.
           [].forEach.call(app.stars, function (star, index) {
             if (app.rating > index) {
                 star.classList.add('rated');
             }
             else {
                 star.classList.remove('rated');
             }
         });
     }
     
     
     
     , Show_Review_Details: function(ev){
         let anchorTag = ev.currentTarget;
         let idForReviewClicked = anchorTag.getAttribute("id-review-clicked");
        
         app.current_review_id = idForReviewClicked;
         
         app.localStorageList = JSON.parse(localStorage.getItem("reviewr-yang0229"));
         
         for(var i=0, len = app.localStorageList.reviews.length; i < len; i++){
             if(idForReviewClicked == app.localStorageList.reviews[i].id){
                 let ul = document.getElementById("review-detail-list");
                 ul.innerHTML="";
                 let liImg = document.createElement("li");
                 liImg.className = "table-view-cell";
                 let img = document.createElement("img");
                 img.className = "media-object pull-left";
                 img.src = app.localStorageList.reviews[i].img;
                 if(img && img.style){
                     img.style.height = "120%";
                     img.style.width = "120%";
                 }
                 
                 let liItem = document.createElement("li");
                 liItem.className = "table-view-cell";
                 liItem.textContent ="Item: "+ app.localStorageList.reviews[i].name;
                
                 let liStars = document.createElement("li");
                 liStars.className = "table-view-cell";
                 liStars.textContent = "Rating: ";
      
                 for(var j=0; j<app.localStorageList.reviews[i].rating; j++){
                     let span = document.createElement("span");
                     span.className = "starPageOne";
                     span.innerHTML = "&#x2605;";
                     liStars.appendChild(span);

                 }
                 for(var j=0; j<5-app.localStorageList.reviews[i].rating; j++){
                     let span = document.createElement("span");
                     span.className = "starPageOne";
                     span.innerHTML = "&#x2606;";
                     liStars.appendChild(span);
                 }
]
                 liImg.appendChild(img);
                 ul.appendChild(liImg);
                 ul.appendChild(liItem);
                 ul.appendChild(liStars);
                 break;
             }
         }  
     }
     
     
     
     , Save_Review: function(){
         
         let reviewTemp = {
             id: Date.now(),
             name: document.getElementById("item").value,
             rating: app.rating,
             img: app.imgPath
         }
         
         if(reviewTemp.name && reviewTemp.rating!=0 && reviewTemp.img){
             app.localStorageList.reviews.push(reviewTemp);
             localStorage.setItem("reviewr-yang0229",JSON.stringify(app.localStorageList));
             // use push to save the new data and refresh the LocalstorageList at last to make sure all data in Localstorage always be synchronized
             
             var myTouchEndEv = new CustomEvent("touchend", {bubbles:true});
             
             var closeAddModal = document.getElementById("crossBtnOfDetailReviewModal");
             closeAddModal.dispatchEvent(myTouchEndEv);
             app.Show_home_page();
         
         }else{
             let divparent = document.getElementById("addModalContent");
             let form = document.getElementById("id-form");
             
             let divMsg = document.createElement("div");
             divMsg.classList.add("msg");
             setTimeout(function(){
                 divMsg.classList.add("bad");
             },20);
             
             divMsg.textContent = "Sorry, you can't miss any field! Please fill all of them";
             divparent.insertBefore(divMsg, form);
             // put the divMsg before the form
             setTimeout((function(dparent,dm){
                 return function(){
                     dparent.removeChild(dm);
                 }
             })(divparent,divMsg),2000);
             // diaplsy the message for 2 second, then disappear
         }
     }
     
     
     
     , Cancel_Add_Review_Modal: function () {
         var myTouchEv = new CustomEvent("touchend", {
             bubbles: true
         });
         var closeAddModal = document.getElementById("crossBtnOfDetailReviewModal");
         closeAddModal.dispatchEvent(myTouchEv);
     }
     
     
     
     , Delete_Review: function(ev){

         app.localStorageList = JSON.parse(localStorage.getItem("reviewr-yang0229"));
         for(var i=0, len = app.localStorageList.reviews.length; i < len; i++){
             if(app.current_review_id == app.localStorageList.reviews[i].id){
                 app.localStorageList.reviews.splice(i,1);
                 localStorage.setItem("reviewr-yang0229",JSON.stringify(app.localStorageList));
                 // use the current_review_id to match the reviews.id form LocalstorageList, then use splice to delete matched data and refresh the LocalstorageList at last to make sure the data in Localstorage always be synchronized
                 
                 var myTouchEndEv = new CustomEvent("touchend", {bubbles:true});
                 var closeDetailModal = document.getElementById("crossBtnOfAddReviewModal");
                 closeDetailModal.dispatchEvent(myTouchEndEv);
                 app.Show_home_page();
                 break;
             }
         }   
     }
     
     
     
     , successCallback: function (imageURI) {
         
         let divAddModalContent = document.getElementById("addModalContent");
         let ul = document.createElement("ul");
         ul.className = "table-view";
         ul.setAttribute("id", "id-pic");
         let li = document.createElement("li");
         li.className = "table-view-cell";
         let img = document.createElement("img");
         img.src = "data:image/png;base64,"+imageURI;
         app.imgPath = "data:image/png;base64,"+imageURI;
         
         if(img && img.style){
                 img.style.height = "120%";
                 img.style.width = "120%";
             }
         
         li.appendChild(img);
         ul.appendChild(li);

         let buttons = document.getElementById("buttons");
         divAddModalContent.insertBefore(ul, buttons);
         let take_pic_btn = document.getElementById("takePicAddReviewModal");
         buttons.removeChild(take_pic_btn);
     }
     
     
     
     , errorCallback: function (message) {
         alert('Failed because: ' + message);
     }
     
     
     
     , addListeners: function () {
          [].forEach.call(app.stars, function (star, index) {
             star.addEventListener('touchstart', (function (idx) {
                 return function () {
                     app.rating = idx + 1;
                     app.Set_Rating();
                 }
             })(index));
         });
     }
     
     
     
 };
 app.init();