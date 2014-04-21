var barcode = {
    
    scan: function(success) {
        console.log('scanning');

        var scanner = cordova.require("cordova/plugin/BarcodeScanner");
        scanner.scan(success, function(error) {
            console.log("Scanning failed: ", error);
            return "";
        });
    },
    encode: function() {
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.encode(scanner.Encode.TEXT_TYPE, "http://www.nhl.com", function(success) {
            alert("encode success: " + success);
        }, function(fail) {
            alert("encoding failed: " + fail);
        }
        );

    },
    alert: function() {
        alert("bla");

    }
    /* 
     * To change this license header, choose License Headers in Project Properties.
     * To change this template file, choose Tools | Templates
     * and open the template in the editor.
     */

};
