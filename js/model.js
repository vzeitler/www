
var Item = ClassMVC.extend({
   // Konstruktor
   init : function(category,brand,description,count,price,buydate,lastupdate,imagebase64,barcode) {

      // GUID als ID (somit keine Probleme bei Verteilten Einträgen)
      this.guid = this.generateGUID();

      // Allgemeine Parameter
      this.category = category;
      this.brand = brand;
      this.description = description;
      this.buycount = count;
      this.count = count;
      this.price = price;
      this.buydate = buydate;
      this.lastupdate = lastupdate;
      this.imagebase64 = imagebase64;
      this.barcode = barcode;
   },

   /**
    * Gibt eine Bezeichnung der Item zurück.
    */
   getName : function() {
      return "Category: "+this.category+" Brand: "+this.brand + ":" +  this.description;
   }
});


var ItemContainer = Observer.extend({
   init : function() {
      this._super();
      this.itemarray= new Array();
   },
   
   /** Tastings setzen */
   setItems : function(array) {
      this.itemarray = array;

      // update
      this.notify({obj: this.itemarray, crud: "R"});
   },
   
   // Nun die CRUD Funktionen
   /** (C) Erzeugt eine Item und fügt diese hinzu.
    */
   create : function(category,brand,description,buycount,count,price,buydate,lastupdate,imagebase64,barcode) {
   
      // Item erzeugen
   	var item = new Item(category,brand,description,buycount,count,price,buydate,lastupdate,imagebase64,barcode);
   
      // dem Array hinzufügen      
      this.itemarray.push(item);

      // update
      this.notify({obj: item, crud: "C"});
   },
   
   /** (C) Fügt einen Eintrag hinzu, mit Items-Objekt
    */
   add : function(item) {
         // dem Array hinzufügen
         console.log(item.imagebase64);
      this.itemarray.push(item);

      // update
      this.notify({obj: item, crud: "C"});
   },
   
   /** (R) Sucht die Item mit der GUID.
    */
   getItemByID : function(guid) {
       
       
   	for ( var i = 0; i < this.itemarray.length; i++) {
            
   		if (this.itemarray[i].guid == guid) {
                    
   			return this.itemarray[i];
   		}
   	}
   },
   
   /** (R) Array mit Items zurückgeben
    */
   getItems : function() {
      return this.itemarray;
   },
   
   /** (U) Aktualisiert die Item.
    * Wenn diese nicht vorhanden ist, wird eine neue erzeugt.
    */
   edit : function(item) {
      var gefunden = 0;
      
      for ( var i = 0; i < this.itemarray.length; i++) {
         if (this.itemarray[i].guid == item.guid) {
            // Item gefunden, nun ersetzen
            
            
            this.itemarray[i] = item;
            
            gefunden = 1;
            this.notify({obj: item, crud: "U"});
         }
      }
      
      // existiert keine, dann hinzufügen
      if( gefunden == 0 )
         this.add(item);
   },

   /** (D) Löscht die Item mit der GUID.
    */
   deleteID : function(guid) {
   	for ( var i = 0; i < this.itemarray.length; i++) {
   		if (this.itemarray[i].guid == guid) {
   			var deleted = this.itemarray.splice(i, 1);
            this.notify({obj: deleted[0], crud: "D"});
   			return;
   		}
   	}
   },
   deleteAll : function() {

   	   this.itemarray= new Array();
            this.notify({obj: null, crud: "D_all"});
   			
   		
   			
   		
   	
   }
});
