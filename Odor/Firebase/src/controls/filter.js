import { config } from "./services.config.min.js";
import { FirebaseService } from "./services.firebase.min.js";
import { OdorDataStore } from "./services.odor.min.js";
import { FilterView } from "./views.filter.min.js";

/**
 * 
 * A control class for acts on both model and view.
 * 
 */
export class FilterControl {

 /**
  * 
  * Extends control class and make listener for all events
  * 
  */
 constructor() {
  // initialize view listener
  this._view = new FilterView();
  // set view backward
  this._view.backward = this.backward;
  // set view dispatch
  this._view.dispatch = this.dispatch;
  // set view handler
  this._view.handler = this.handler;
  // set view filter
  this._view.filter = this.filter;
  // set view write
  this._view.write = this.write;
  // initialize firebase service
  this._firebase = new FirebaseService(config.firebase);
  // bind an event handler to verify authentication user
  firebase.auth().onAuthStateChanged((authentication) => {
   // verify user is signed in
   if (authentication) {
    // initialize authentication
    this._authentication = authentication;
    // verify authentication permission
    if (this._authentication.email === config.admin) {
     // initialize odor data store
     this._store = new OdorDataStore();
     // set added event in store
     this._store.added = this.added;
     // set changed event in store
     this._store.changed = this.changed;
     // set removed event in store
     this._store.removed = this.removed;
     // initialize odors maps
     this._odors = new Map();
     // dispatch filter service to listener
     this.filter();
    } else {
     // redirect to master page
     window.location.replace("/master");
    }
   } else {
    // redirect to activation page
    window.location.replace("/activation");
   }
  });
 }

 /**
 * @returns {function} handler
 */
 get handler() {
  return () => {
   // open dialog in view
   this.view.dialog.open();
  };
 }

 /**
  * @returns {Object} firebase
  */
 get firebase() {
  return this._firebase;
 }

 /**
  * @returns {Object} authentication
  */
 get authentication() {
  return this._authentication;
 }

 /**
  * @param {Map} odors
  */
 set odors(odors) {
  this._odors = odors;
 }

 /**
  * @returns {Map} odors
  */
 get odors() {
  return this._odors;
 }

 /**
  * @returns {function} added
  */
 get added() {
  return (odor) => {
   // update odor in odors maps
   this.odors.set(odor.id, odor);
   // add odor in view
   this.view.added(odor);
  };
 }

 /**
  * @returns {function} changed
  */
 get changed() {
  return (odor) => {
   // update odor in odors maps
   this.odors.set(odor.id, odor);
   // update odor in view
   this.view.changed(odor);
  };
 }

 /**
  * @returns {function} removed
  */
 get removed() {
  return (id) => {
   // remove odor in odors maps
   this.odors.delete(id);
   // remove odor in view
   this.view.removed(id);
  };
 }

 /**
  * @returns {Object} view
  */
 get view() {
  return this._view;
 }

 /**
  * @returns {Object} store
  */
 get store() {
  return this._store;
 }

 /**
  * @returns {function} backward
  */
 get backward() {
  return () => {
   // redirect to master page
   window.location.replace("/master");
  };
 }

 /**
  * @returns {function} dispatch
  */
 get dispatch() {
  return (id) => {
   return new Promise((resolve, reject) => {
    try {
     // set odor data in view with map
     this.view.odor = this.odors.get(id);
     // resolve promise
     resolve();
    } catch (error) {
     // reject promise
     reject(error);
    }
   });
  };
 }

 /**
 * @returns {function} filter
 */
 get filter() {
  return async () => {
   // empty odors
   this.odors.clear();
   // empty list in view
   await this.view.empty();
   // make filter to view
   let filter = {
    begin: this.view.begin.value,
    end: this.view.end.value
   }
   // query odor in store
   await this.store.query(this.odor, filter).then(() => { })
    // request is incorrectly returned
    .catch(() => {
     // dispatch view exception
     this.view.exception();
    })
    // finally request
    .finally(() => {
     // release page
     this.view.release();
    });
  }
 }

 /**
  * @returns {function} write
  */
 get write() {
  return () => {
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
     color: { argb: "FFFFFFFF" },
     family: 4,
     size: 12,
     bold: true
    };
    // set header row border
    ws.getCell(String.fromCharCode('A'.charCodeAt(0) + i) + "1").border = {
     top: { style: "thin" },
     left: { style: "thin" },
     bottom: { style: "thin" },
     right: { style: "thin" }
    };
    // set header row background color
    ws.getCell(String.fromCharCode('A'.charCodeAt(0) + i) + "1").fill = {
     type: "pattern",
     pattern: "solid",
     fgColor: { argb: "FF0070c0" }
    };
   }
   // for all odors
   this.odors.forEach((odor) => {
    // get begin duration
    let begin = moment(moment.duration(odor.begin).format("*HH:mm:ss"), "HH:mm:ss");
    // get end duration
    let end = moment(moment.duration(odor.end).format("*HH:mm:ss"), "HH:mm:ss");
    // verify end before begin
    if (end.isBefore(begin)) {
     // add day to end duration
     end.add(1, "day");
    }
    // add data row in work sheet
    ws.addRow([
     odor.username,
     odor.address,
     Number(odor.latitude.toFixed(5)),
     Number(odor.longitude.toFixed(5)),
     new Date(odor.date),
     moment.duration(odor.begin).format("*HH:mm:ss"),
     moment.duration(odor.end).format("*HH:mm:ss"),
     moment.duration(end.diff(begin)).format("*HH:mm:ss"),
     odor.intensity,
     odor.type,
     odor.usertype,
     odor.nuisance,
     odor.origin,
     odor.userorigin
    ]);
   });
   // save work sheet
   return wb.xlsx.writeBuffer().then((data) => {
    // make a blob file
    return new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
   });
  }
 }

}

// make a control listener
export const control = new FilterControl();