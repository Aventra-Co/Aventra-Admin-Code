"use strict";

function dragNdrop(event) {

    var fileName = URL.createObjectURL(event.target.files[0]);

    var preview = document.getElementById("preview");

    var previewImg = document.createElement("img");

    // alert(document.getElementById('uploadFile').value);

    readURLNew(document.getElementById('uploadFile'));

    previewImg.setAttribute("src", fileName);
 
    preview.innerHTML = "";

    preview.appendChild(previewImg);

}



function readURLNew(input) {

    console.log('readURLNew',input);

    if (input.files && input.files[0]) {

        var reader = new FileReader();

        var file = input.files[0];

        var fileName = file.name;

        var fileExtension = fileName.split('.').pop().toLowerCase();

    

        reader.onload = function(e) {

            console.log('e.target.result', e.target.result);

            var get_image = e.target.result;

            var global_image = dataURLToBlob(get_image);

            console.log("global_image", global_image);

    

            var image_name = '';

            if (fileExtension === 'png' || fileExtension === 'jpg' || fileExtension === 'jpeg') {

                image_name = 'image';

            } else if (fileExtension === 'pdf') {

                image_name = 'file';

            }

         

            var blank = '';

    

            $('#onclickImageSend').attr("onclick", 'uploadChatFilesFirebase(\'' + get_image + '\', \'' + image_name + '\')');

            setTimeout(function() {

                $('#onclickImageSend').trigger('click');

            }, 300);

        }

        reader.readAsDataURL(file);

    }

    



}











function drag() {

    document.getElementById('uploadFile').parentNode.className = 'draging dragBox';

}

function file_ondragover() {

  $('.drop_to_attach').fadeIn();

}

function uploadingOpen() {

  $('.drop_to_attach').show();

}

function uploadingClose() {

  $('.drop_to_attach').fadeOut();

  console.log("uploadingClose");

 

}



function drop() {

    document.getElementById('uploadFile').parentNode.className = 'dragBox';

}



