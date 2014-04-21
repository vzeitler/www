/** Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

  // The base Class implementation (does nothing)
  this.ClassMVC = function(){};
 
  // Create a new Class that inherits from this class
  ClassMVC.extend = function(prop) {
    var _super = this.prototype;
   
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
   
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);       
            this._super = tmp;
           
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
   
    // The dummy class constructor
    function ClassMVC() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
   
    // Populate our constructed prototype object
    ClassMVC.prototype = prototype;
   
    // Enforce the constructor to be what we expect
    ClassMVC.prototype.constructor = ClassMVC;

    // And make this class extendable
    ClassMVC.extend = arguments.callee;
   
    return ClassMVC;
  };
})();

/** Observer-Implementierung 
 * by Philipp Friberg */
var Observer = ClassMVC.extend({
   init: function() {
      this.observers = [];
   },
   /** Beobachter hinzufügen */
   addObserver: function(obj, callback) {
      // Check, ob Funktion existiert
      if( typeof( obj[callback] ) !== 'function' )
         throw( "Function don't exist" );
      // ok
      this.observers.push({obj: obj, callback: callback});
   },
   /** Beobachter entfernen */
   removeObserver: function(obj, callback) {
      this.observers = this.observers.filter(function(el) {
         if (el.obj !== obj && el.callback != callback) {
            return el;
         }
      });
   },
   /** es hat sich etwas geändert, alle informieren */
   notify: function(data) {
      var scope = this; // Aufrufendes Model
      for( var i=0; i<this.observers.length; i++ ) {
         var el = this.observers[i];
         el.obj[el.callback].call(el.obj, scope, data);
      }
   }
});

/** View-Implementierung 
 * by Philipp Friberg */
var View = ClassMVC.extend({
   init: function() {
   },
   /** Konsolen-Log */
   log: function(value) {
      console.log(value);
   },
   /** Alert-Ausgabe */
   alert : function(text) {
      if (( typeof cordova == 'undefined') && ( typeof Cordova == 'undefined'))
         alert(text);
      else
         navigator.notification.alert(text,this.ok,"WarehouseApp");
   }
});

/** Validierung
 * by Philipp Friberg, inspiriert von Michael Grosch
 * http://www.webkrauts.de/2010/12/13/formulare-auf-der-hoehe-der-zeit/ */
var Validator = ClassMVC.extend({
   init: function() {
   },
   /** Statische Funktion, kann als Code dem Event-Handler mitgegeben werden */
   validate: function() {
      var err = 0;
      var page = $.mobile.activePage;
      if( page == undefined )
         page = "";
      else
         page = '#' + $.mobile.activePage.attr("id");
      $(page+' input[required]').each(function(n,element) {
         if(($(element).val().length == 0)) {
            err++;
            $(element).parents('div').find("label[for='"+$(element)[0].id+"']").addClass('V_invalid_field');
            $(element).parents('div').find("label[for='"+$(element)[0].id+"']").removeClass('V_valid_field');
         }
         else {
            $(element).parents('div').find("label[for='"+$(element)[0].id+"']").addClass('V_valid_field');
            $(element).parents('div').find("label[for='"+$(element)[0].id+"']").removeClass('V_invalid_field');
         }
      });
    
      $(page+" select[required]").each(function(n,element) {
          
        if($(element).val()== null) {
            err++;
            $(element).parents('div').find("label[for='"+$(element)[0].id+"']").addClass('V_invalid_field');
            $(element).parents('div').find("label[for='"+$(element)[0].id+"']").removeClass('V_valid_field');
         }
         else {
            $(element).parents('div').find("label[for='"+$(element)[0].id+"']").addClass('V_valid_field');
            $(element).parents('div').find("label[for='"+$(element)[0].id+"']").removeClass('V_invalid_field');
         }
      });
      
      if(err > 0) {
         return false;
      } else {
         return true;
      }
   },
   /** Event-Handler registrieren */
   autoValidate: function() {
      $('input[required]').on( 'keyup', this.validate);
      $('select[required]').on("change",this.validate);
   }
});

/** GUID Generator, je nach Browser mit Crypro-Bibliothek oder nicht.
 * by stackoverflow.com
 * Wird zur Methode der Ur-Klasse.
 */
ClassMVC.prototype.generateGUID = (typeof(window.crypto) != 'undefined' && 
                typeof(window.crypto.getRandomValues) != 'undefined') ?
    function() {
        // Crypto-Bibliothek vorhanden
        // http://stackoverflow.com/questions/6906916/collisions-when-generating-uuids-in-javascript
        var buf = new Uint16Array(8);
        window.crypto.getRandomValues(buf);
        var S4 = function(num) {
            var ret = num.toString(16);
            while(ret.length < 4){
                ret = "0"+ret;
            }
            return ret;
        };
        return (S4(buf[0])+S4(buf[1])+"-"+S4(buf[2])+"-"+S4(buf[3])+"-"+S4(buf[4])+"-"+S4(buf[5])+S4(buf[6])+S4(buf[7]));
    }

    :

    function() {
        // Alternativ Math.random
        // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    };
