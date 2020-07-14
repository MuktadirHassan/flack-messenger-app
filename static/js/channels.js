document.addEventListener("DOMContentLoaded",() =>{


    // Disables input if empty
    function validate(formInput,button){
        formInput.onkeyup = () => {
            if(formInput.value.length > 0){
                button.disabled = false;
            }else{
                button.disabled = true;
            }
        }
    }

    // Homepage form validation & Storing display name
    if(document.getElementById('form-d')){
        let formName = document.getElementById('form-d');
        let inputValue = document.getElementById('dname');
        let proceed = document.getElementById('proceed');

        validate(inputValue,proceed);

        formName.onsubmit = () =>{
            localStorage.setItem('user',inputValue.value);
        }
    };
    // END =======================

    // Display Name
    let currentUser = localStorage.getItem('user');
    document.querySelector('.dname').innerHTML = currentUser;
    
    // Validate message input
    if(document.getElementById("message-form")){
        let inputValue = document.getElementById('message');
        let send = document.getElementById('send');
        validate(inputValue,send);
    }


    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('connect', () => {
        document.getElementById('message-form').onsubmit = () => {
            let message = document.getElementById('message').value;
            let sender = localStorage.getItem('user');
            let time = new Date();
            let currentTime = time.getHours()+':'+ time.getMinutes();
            socket.emit('message incoming',{'message':message,'sender':sender,'currentTime':currentTime});
            document.getElementById('message').value = '';
            return false;
        };
    });

    // When a new message is announced, add it to the DOM
    socket.on("message outgoing", data =>{
        var message_block = document.createElement('div');
        if(data.message_sender == localStorage.getItem('user')){
        message_block.classList.add('message','bg-light', 'rounded', 'mt-2','my_message','align-self-end');
        message_block.innerHTML = `
        <p class="text-break">
        ${data.message_content}
        </p>
        <p class="bg-dark text-light p-1 rounded">${data.message_sender} - <span class="text-info">${data.message_time}
        </span>
        </p>`   
        }else{
        message_block.classList.add('message','bg-light', 'rounded', 'mt-2','align-self-start');
        message_block.innerHTML = `
        <p class="text-break">
        ${data.message_content}
        </p>
        <p class="bg-dark text-light p-1 rounded">${data.message_sender} - <span class="text-info">${data.message_time}
        </span>
        </p>
        `
        }
        document.querySelector('.messaging').appendChild(message_block);
    });

});