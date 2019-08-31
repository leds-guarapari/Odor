/**
 * 
 * Make a script to get odors in realtime database.
 * 
 */

// authentication resource
let auth = firebase.auth();

// realtime database resource
let database = firebase.database();

// make a local control to data process
let isBusy = false;

// get page element of user input
let user = document.getElementById("user");

// get page element of password input
let password = document.getElementById("password");

// get page element of begin input
let begin = document.getElementById("begin");

// get page element of end input
let end = document.getElementById("end");

/**
 * @param {string} message 
 */
let message = (message) => {
	// make a message in snackbar
	document.getElementById("message").MaterialSnackbar.showSnackbar({
		message : message
	});
};

/**
 * @param {string} message 
 */ 
let error = (message) => {
	// make a message in snackbar
	document.getElementById("error").MaterialSnackbar.showSnackbar({
		message : message
	});
};

// get page element of progress
let progress = document.querySelector(".mdl-progress");

/**
* 
* Make event to required input
*
* @param {object} input
* 
*/
let required = (input) => {
	// set attribute required in input
	input.setAttribute("required", true);
	// force to check if input parent is validity
	input.parentNode.MaterialTextfield.checkValidity();
	// wait three seconds
	setTimeout(()=>{
		// remove attribute required in input
		input.removeAttribute("required");
		// force to check if input parent is validity
		input.parentNode.MaterialTextfield.checkValidity();
	}, 3000);
};

/**
* 
* Make event to save data
*
* @param {blob} blob
* @param {string} name
* 
*/
const save = (() => {
	let a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return (blob, name) => {
		let url = window.URL.createObjectURL(blob);
		a.href = url;
		a.download = name;
		a.click();
		window.URL.revokeObjectURL(url);
    };
})();

/**
*
* Make event handler to button
*
*/
document.querySelector("button").addEventListener("click", async (event) => {
	// stops the default action
	event.preventDefault();
	// verify if control is valid
	if (!isBusy) {
		// make a local control to validate data
		let validate = true;
		// verify if user is valid
		if (!user.value) {
			// set false value of control
			validate = false;
			// dispatch required event to user input
			required(user);
		}
		// verify if password is valid
		if (!password.value) {
			// set false value of control
			validate = false;
			// dispatch required event to password input
			required(password);
		}
		// verify if begin is valid
		if (!begin.value) {
			// set false value of control
			validate = false;
			// dispatch required event to begin input
			required(begin);
		}
		// verify if end is valid
		if (!end.value) {
			// set false value of control
			validate = false;
			// dispatch required event to end input
			required(end);
		}
		// verify if control is valid
		if (validate) {
			// set true value of control
			isBusy = true;
			// show progress page
			progress.style.display = "block";
			// dispatch authentication sign in
			await auth.signInWithEmailAndPassword(user.value, password.value)
				.then(async () => {
					// make get promise 
					await database.ref("odors").orderByChild("Date").startAt(begin.value).endAt(end.value).once("value").then((snapshot) => {
						// make an array of rows data
						let rows = [];
						// get values of result
						let odors = snapshot.val();
						// for all odors
						for (key in odors) {
							// make an array of odor data
							let row = [];
							// for all header of odor data
							for (header in odors[key]) {
								// add data in odor array
								row.push(odors[key][header]);
							}
							// add row data in odors array
							rows.push(row.join("\t"));
						}
						// make an binary object that represents odors data
						let blob = new Blob(["\ufeff", rows.join("\r\n")], {type: "text/csv"});
						// save data in file
						save(blob, "odor.csv");
					})
					.finally(async () => {
						// dispatch authentication sign out
						await auth.signOut().then(() => {
							// make a message of successfully
							message("Download concluído.");
						});
					});
				})
				.catch((exception) => {
					// verify if user is valid
					if(exception.code == "auth/invalid-email" || exception.code == "auth/user-not-found") {
						// make a error of user not found
						error("Usuário inválido.");
					}
					// verify if password is valid
					else if(exception.code == "auth/wrong-password") {
						// make a error of wrong password
						error("Senha inválida.");
					} else {
						// make a error of exception code
						error("Erro: " + exception.code);
					}
				});
			// hide progress page
			progress.style.display = "none";
			// set false value of control
			isBusy = false;
		}
	}
});