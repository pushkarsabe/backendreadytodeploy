let HOST = 'localhost';
// let HOST = 16.171.166.138;

//function to display the message
function showMessage(msgText, className) {
    const msg = document.getElementById('message');
    const div = document.createElement('div');
    const textNode = document.createTextNode(msgText);
    div.appendChild(textNode);
    msg.appendChild(div);
    msg.classList.add(className);

    setTimeout(() => {
        msg.classList.remove(className);
        msg.removeChild(div);
    }, 2000);
}

async function submitData(event) {
    event.preventDefault();
    // Get values from the form
    const name = document.getElementById('inputName').value;
    const email = document.getElementById('inputEmail').value;
    const password = document.getElementById('inputPassword').value;

    console.log('name = ' + name);
    console.log('email = ' + email);
    console.log('password = ' + password);
    const obj = {
        name: name,
        email: email,
        password: password
    }
    try {
        const response = await axios.post(`http://${HOST}:3000/user/signup`, obj);

        console.log('data added');
        console.log('response data = ' + JSON.stringify(response));
        console.log('response name = ' + response.data.newUserDetails.name);
        console.log('response email = ' + response.data.newUserDetails.email);
        console.log('response password = ' + response.data.newUserDetails.password);

        showMessage(response.data.meassage, 'succesMessage');
        document.getElementById('inputName').value = "";
        document.getElementById('inputEmail').value = "";
        document.getElementById('inputPassword').value = "";
        //to move to login page after showing successful login message after 3 sec
        setTimeout(() => {
            window.location.href = '../Login/login.html';
        }, 2000);

    } catch (error) {
        // console.error('Error during form submission:', error);
        //to handle the output response errors
        if (error.response.status === 401) {
            console.log('Error object:', error.response.data.meassage);
            showMessage(error.response.data.meassage, 'failureMessage');
        }
        else if (error.response.status === 400) {
            console.log('Error object:', error.response.data.error);
            showMessage(error.response.data.error, 'failureMessage');
        } else {
            console.log('Unhandled error:', error);
            // Handle other errors here
        }
    }

}//submitData