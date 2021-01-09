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
						// make an work book object
						let wb = new ExcelJS.Workbook();
						// make an work sheet object
						let ws = wb.addWorksheet("odor");
						// make a array to columns width
						let columns = [40, 60, 16, 16, 24, 24, 24, 28, 32, 32, 40, 32, 32, 40];
						// add headers row in work sheet
						ws.addRow(["Nome", "Endereço", "Latitude (º)", "Longitude (º)", "Data da Ocorrência", "Horário da Ocorrência", "Horário Final", "Duração da Ocorrência", "Intensidade do Odor", "Característica do Odor", "Detalhe da Característica", "Incômodo", "Origem", "Detalhe da Origem"]);
						// format columns and headers row
						for (let i = 0; i < columns.length; i++) {
							// set column width
							ws.getColumn(i + 1).width = columns[i];
							// set header row font
							ws.getCell(String.fromCharCode('A'.charCodeAt(0) + i) + "1").font = {
								name: "Calibri",
								color: {argb: "FFFFFFFF"},
								family: 4,
								size: 12,
								bold: true
							};
							// set header row border
							ws.getCell(String.fromCharCode('A'.charCodeAt(0) + i) + "1").border = {
								top: {style: "thin"},
								left: {style: "thin"},
								bottom: {style: "thin"},
								right: {style: "thin"}
							};
							// set header row background color
							ws.getCell(String.fromCharCode('A'.charCodeAt(0) + i) + "1").fill = {
								type: "pattern",
								pattern: "solid",
								fgColor: {argb: "FF0070c0"}
							};
						}
						// get values of result
						let odors = snapshot.val();
						// for all odors
						for (key in odors) {
							// get begin date
							let begin = moment(moment.duration(odors[key]["Begin"]).format("*HH:mm:ss"), "HH:mm:ss");
							// get end date
							let end = moment(moment.duration(odors[key]["End"]).format("*HH:mm:ss"), "HH:mm:ss");
							// verify end before begin
							if (end.isBefore(begin)) {
								// add day to end date
								end.add(1, "day");
							}
							// add data row in work sheet
							ws.addRow([
								odors[key]["UserName"],
								odors[key]["Address"],
								Number((odors[key]["Latitude"]).toFixed(5)),
								Number((odors[key]["Longitude"]).toFixed(5)),
								new Date(odors[key]["Date"]),
								moment.duration(odors[key]["Begin"]).format("*HH:mm:ss"),
								moment.duration(odors[key]["End"]).format("*HH:mm:ss"),
								moment.duration(end.diff(begin)).format("*HH:mm:ss"),
								odors[key]["Intensity"],
								odors[key]["Type"],
								odors[key]["UserType"],
								odors[key]["Nuisance"],
								odors[key]["Origin"],
								odors[key]["UserOrigin"]
							]);
						}
						// save work sheet
						wb.xlsx.writeBuffer().then(function (data) {
							let blob = new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
							save(blob, "odor.xlsx");
			   });
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