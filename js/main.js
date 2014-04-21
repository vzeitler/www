var WarehouseApp = {
    //Model
   itemcontainer: new ItemContainer(),
   //Controller
   controller: new WarehouseAppController(),
   //IdexedDB oder WebSQL
   db: new WarehouseDB(),
   //View
   gui: new WarehouseView()
   
}
//Für Testen auf dem Browser
if((typeof cordova=='undefined') && (typeof Cordova=='undefined')){
 
// Observer auf Tastings
WarehouseApp.itemcontainer.addObserver(WarehouseApp.gui, "update");
WarehouseApp.itemcontainer.addObserver(WarehouseApp.db, "update");

WarehouseApp.db.readItems();
}