let HOST = 'localhost';
// let HOST = 16.171.166.138;

function redirectToForgotPasswordPage() {
    windows.location.href = 'forgot-password.html';
}
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
    console.log('inside submitData login');
    // Get values from the form
    const email = document.getElementById('inputEmail').value;
    console.log('email = ' + email);
    const obj = {
        email: email,
    }
    try {
        const token = localStorage.getItem('token');
        console.log('token:' + token);
        // and null is used as the second parameter since you are making a POST request without a request body.
        const response = await axios.post(`http://${HOST}:3000/password/forgotpassword/`, obj, {
            headers: {
                "Authorization": token
            }
        });
        console.log('response data = ' + JSON.stringify(response.data));
        //this will give the data inside the array
        const dataUser = response.data.userData[0];
        console.log('email = ' + dataUser.email);
        console.log('password = ' + dataUser.password);

        showMessage(response.data.message, 'succesMessage');
    }
    catch (error) {
        console.log('Error object:', error.response.data.message);
        showMessage(error.response.data.message, 'failureMessage');
    }

}//submitData