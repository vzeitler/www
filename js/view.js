/**
 *  UPDATE METHODE
 *  Aktualisiert der Items-Liste */
var WarehouseView = View.extend({
   init : function() {
      this._super();
   },
   /** Sortierung des Tasting-Arrays */
   sortAlg : function(a, b) {
      a = a.category.toLowerCase();
      b = b.category.toLowerCase();
      return (a == b) ? 0 : (a > b) ? 1 : -1;
   },
   /** GUI aktualisieren */
   update : function(scope, data) {
      var actCategory = "";
      var count = 0;

      // (1) Alte Listview löschen
      $('#collapsiblesetForFilterChildren [data-role="collapsible"]').remove();

      var ar = scope.getItems(); // (2) alle Items lesen
      ar.sort(this.sortAlg);         // und sortieren

      // (3) Durch die Items gehen
      for(var i = 0; i < ar.length; i++) {
         // Titel
         if(ar[i].category != actCategory) {
            if(newEntryRowTitle != null) {
               // Anzahl Items der letzten Distillery setzen
               newEntryRowTitle.find('.ui-li-count').text(count);
              count = 0;
              $("#collapsiblesetForFilterChildren").find("[id='"+ar[i].category+"']").collapsible( "refresh" );
              //$("#collapsiblesetForFilterChildren #"+ar[i].category).collapsible( "refresh" );
            }
            var newEntryRowTitle = $('#collapsible-template').attr("data-role","collapsible").clone();
            actCategory = ar[i].category;
           // newEntryRowTitle.find('h2').text(actCategory.toUpperCase());
           newEntryRowTitle.find('h2').html(actCategory.toUpperCase()+'<span class="ui-li-count"></span>');
            newEntryRowTitle.attr("id",actCategory);
            newEntryRowTitle.appendTo('#collapsiblesetForFilterChildren');                      
         }

         // (4) Allg. Informationen
         count++;
         var newEntryRow = $('#entryTemplate').clone();
         newEntryRow.jqmData('entryId', ar[i].guid);
         newEntryRow.find('#ui-li-brand').text(ar[i].brand);
         newEntryRow.find('#ui-li-description').html(ar[i].description);
         newEntryRow.find('#forsearch').text(ar[i].barcode);
        
         newEntryRow.find('#ui-li-icount').html(ar[i].count+" left");
         newEntryRow.find('#ui-li-price').html(ar[i].price+" $");
                             
         newEntryRow.find('.ui-li-icon').attr("src", ar[i].imagebase64);        
            
         // Event-Listener setzen auf Clicken
         newEntryRow.on("tap",function() {
            WarehouseApp.controller.edit($(this).jqmData('entryId'));
            return false;
         });

         // (5) Der Liste hinzufügen
         newEntryRow.appendTo("#collapsiblesetForFilterChildren [id='"+ar[i].category+"'] #itemlist");
        // 
      }

      // Anzahl Items der letzten Distillery setzen
      if (newEntryRowTitle != null) {
         newEntryRowTitle.find('.ui-li-count').text(count);
        //$("#collapsiblesetForFilterChildren #"+actCategory).collapsible( "refresh" );
      }
     /* $.mobile.loading( 'show', {
        text: "öffnet Camera",
        textVisible: true,
        theme: "b",
        textonly: false
  });*/
     
     $("#collapsiblesetForFilterChildren").collapsibleset().trigger('create');
     $("#collapsiblesetForFilterChildren").collapsibleset( "refresh" );
   }
});


