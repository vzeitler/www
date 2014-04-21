/** Controller */
var WarehouseAppController = function() {
    var templatePhoto = "img/template.jpg"
    var actItem;   // Aktuell bearbeitete Wertug
    var valid = new Validator();
    var categories = [];
    var sales = [];


    function setSales(array) {

        sales = array;
        statisticsbarchart();
    }
    function setCategories(array) {


        categories = array;
        if ($.mobile.activePage.attr('id') == "warehouse-details") {


            $('#category option').remove();
            $('#category').append('<option>Choose Category</option>');
            for (var i = 0; i < categories.length; i++) {

                $('#category').append('<option value="' + categories[i].name + '">' + categories[i].name + '</option>');
                //$('#category').append('<option value="New">NEW</option>');  
            }
            $('#category').selectmenu("refresh");
            $('#category', $.mobile.activePage).val(actItem.category).selectmenu("refresh");
        }


        if ($.mobile.activePage.attr('id') == "warehouse-options") {

            $('#categories-itemlist .options_li_template').remove();
            for (var i = 0; i < categories.length; i++) {

                var li_template = $("#options_li_template").clone();
                li_template.find("#aleft").html(categories[i].name);
                li_template.attr("id", categories[i].name);

                $("#categories-itemlist", $.mobile.activePage).append(li_template);

            }
            $("#categories-itemlist", $.mobile.activePage).listview("refresh");
        }

    }

    function getCategories() {

        //$( document ).off("pageinit","#warehouse-details").on( "pageinit","#warehouse-details",WarehouseApp.db.getCategories);

    }
    /** Zurück auf Home.
     * Quelle: warehouse-details
     * Ziel: warehouse-home */
    function home() {

        /*$.mobile.changePage("#warehouse-home", 
         { transition: "slideup" } );*/
        //$( ":mobile-pagecontainer" ).pagecontainer( "change", "#warehouse-home", { transition: "slideup" } );
        $(":mobile-pagecontainer").pagecontainer("change", "#warehouse-home", {transition: "slideup"});
    }

    /** Neue Item erstellen.
     * Quelle: warehouse-home
     * Ziel: warehouse-details */
    function addItem() {


        //$.mobile.silentScroll();


        // Neues Item mit Default-Werten löschen
        //category,brand,description,count,price,creationdate,lastupdatetdate
        actItem = new Item("", "", "", "", "", "", new Date(), templatePhoto, "no barcode");


        // und so tun, als ob es eine gäbe...
        edit();

        valid.validate();  // erstmalige Validierung
    }

    /** Item darstellen zum editieren
     * Quelle: warehouse-home
     * Ziel: warehouse-details */
    function edit(guid) {
        // $.mobile.silentScroll();

        // aktuelle Item merken, wenn nicht schon gemacht
        if (guid != undefined)
            actItem = WarehouseApp.itemcontainer.getItemByID(guid);

        // Page wechseln

        /*$.mobile.changePage("#warehouse-details", 
         { transition: "slidedown" } );*/
        //$( ":mobile-pagecontainer" ).pagecontainer( "change", "#warehouse-details", { transition: "slidedown" } );
        $(":mobile-pagecontainer").pagecontainer("change", "#warehouse-details", {transition: "slidedown"});


        // Werte setzen
        refreshItem();
        //valid.validate();
    }

    /** Item löschen.
     * Quelle: warehouse-details
     * Ziel: warehouse-home */
    function deleteItem() {
        if (actItem != null)
            WarehouseApp.itemcontainer.deleteID(actItem.guid);



        //$.mobile.changePage("#warehouse-home", { transition: "slideup" } );
        $(":mobile-pagecontainer").pagecontainer("change", "#warehouse-home", {transition: "slide", reverse: true});
    }
    function deleteallItems() {

        WarehouseApp.itemcontainer.deleteAll();
        $('#delDialog', $.mobile.activePage).popup('close');

    }

    /** Item speichern.
     * Quelle: warehouse-details
     * Ziel: warehouse-home */
    function saveItem() {
        var w;
        // Eintrag hinzufügen

        if (actItem == null) {
            w = new Item();
        }
        else { // Item updaten
            w = actItem;
        }

        if (valid.validate() === false) {
            alert("Fill out all required boxes!");
            return false;
        }
        w.barcode = $("#barcodetext").text();
        w.imagebase64 = $('#smallImage', $.mobile.activePage).attr("src");
        //w.imagebase64 =$("#imagebase64").val();



        w.category = $('#category').val();
        w.brand = $('#brand').val();
        w.description = $('#description').val();

        w.count = $('#count').val();
        w.price = $('#price').val();
        w.buydate = $('#buydate').val();
        w.lastupdate = new Date();

        // Eintrag hinzufügen/erzeugen (wird in Methode entschieden)
        WarehouseApp.itemcontainer.edit(w);


        //$.mobile.changePage("#warehouse-home", { transition: "slideup" } );
        $(":mobile-pagecontainer").pagecontainer("change", "#warehouse-home");

    }

    /** About-Seite als Dialog.
     * Quelle: warehouse-home
     * Ziel: about.html 
     * kein changeHash: false! */
    function changetocheckout() {

        // $.mobile.changePage("about.html", { transition: "fade", role: "dialog" } );
        $(":mobile-pagecontainer").pagecontainer("change", "#warehouse-checkout");

    }
    function changetostatistics(e) {
        // $.mobile.changePage("about.html", { transition: "fade", role: "dialog" } );


        $(":mobile-pagecontainer").pagecontainer("change", "#warehouse-statistics");

    }

    /** Aktualisiert Items-Page
     */
    function refreshItem() {
        // Zuweisungen
        WarehouseApp.db.getCategories();
        //$('#date').val(actItem.date
        //category,brand,description,count,price,creationdate,lastupdatetdate
        //$('#shootphoto').attr("src", "img/fruit.png");

        //WarehouseApp.db.getCategories();

        /*for (var i = 0; i < categories.length; i++) {
         alert("controller"+categories[i].name);          
         // $('#category').append('<option value="'+array[i].name+'">'+array[i].name+'</option>');
         $('#category').append('<option value="New">NEW</option>');  
         }*/


        // $('#category').append('<option value="New">NEW</option>');              
        //$('#category').listview('refresh');

        $("#barcodetext", $.mobile.activePage).text(actItem.barcode);
        $('#imagebase64', $.mobile.activePage).val(actItem.imagebase64);

        var smallImage = document.getElementById('smallImage');

        // Show the captured photo.
        smallImage.src = actItem.imagebase64;

        $('#category', $.mobile.activePage).val(actItem.category).selectmenu("refresh");
        $('#brand', $.mobile.activePage).val(actItem.brand);
        $('#description', $.mobile.activePage).val(actItem.description);
        $('#count', $.mobile.activePage).val(actItem.count).slider("refresh");
        ;
        $('#price', $.mobile.activePage).val(actItem.price);
        $('#buydate', $.mobile.activePage).val(actItem.buydate);
        // $('#warehousedetaillist').listview('refresh'); 

    }
    function deletePhoto() {

        $('#imagebase64', $.mobile.activePage).val(templatePhoto);

        $('#smallImage').attr("src", templatePhoto);

    }
    function capturePhoto() {
        cameraApp.capturePhoto(function(imageData) {

            $('#smallImage').attr("src", imageData);
            /*var smallImage = document.getElementById('smallImage');
             
             // Show the captured photo.
             smallImage.src = imageData;*/
        });
    }
    function getPhotoFromLibrary() {

        cameraApp.getPhotoFromLibrary();
    }
    function scanBarcode() {

        //Beispiel Item für Chrome-Debug
        /* var checkout_li = $('#checkout_li_template').clone();
         checkout_li.find('#brand').text(actItem.brand);
         checkout_li.find('#description').html(actItem.description);
         checkout_li.find('#checkoutcount').val("1");
         
         //checkout_li.find('#price').text(found.price+" $ ");
         checkout_li.attr("id", actItem.guid);
         checkout_li.find("div").first().jqmData("priceperitem", actItem.price);
         
         $("#warehouse-checkout #checkoutlist").append(checkout_li).listview("refresh");
         
         updatecart();*/

        barcode.scan(function(data) {
            var items = WarehouseApp.itemcontainer.getItems();
            var found = "";
            for (var i = 0; i < items.length; i++) {
                if (items[i].barcode == data.text) {
                    found = items[i];
                    break;
                }
            }
            if (found != "") {
                if ($("#" + found.guid).length > 0) {
                    var newcount = parseInt($("#" + found.guid).find('#checkoutcount').val()) + 1;
                    $("#" + found.guid).find('#checkoutcount').val(newcount).change();

                }
                else {

                    var checkout_li = $('#checkout_li_template').clone();
                    checkout_li.find('#brand').text(found.brand);
                    checkout_li.find('#description').html(found.description);
                    checkout_li.find('#checkoutcount').val("1");
                    //checkout_li.find('#price').text(found.price+" $ ");
                    checkout_li.attr("id", found.guid);
                    checkout_li.find("div").first().jqmData("priceperitem", found.price);

                    $("#warehouse-checkout #checkoutlist").append(checkout_li).listview("refresh");

                    updatecart();
                }

            }
            else {
                alert("Item not found");
            }
        });



    }
    function scanBarcodeforItem() {

        barcode.scan(function(data) {

            $("#barcodetext", $.mobile.activePage).text(data.text);
        });
    }
    function scanBarcodeforSearch() {


        barcode.scan(function(data) {

            $("#filterBasic-input", $.mobile.activePage).val(data.text);
            $("#filterBasic-input", $.mobile.activePage).keyup();
        });

    }
    function createpanel() {

        /*alert($("#checkoutlist li").find("div").first().length);
         $("#checkoutlist li").find("div").first().jqmData("pricepi","10");
         alert($("#checkoutlist li").find("div").first().jqmData("pricepi"));*/


        /* $("#select option")
         for(var i=0;i<liarray.length;i++){
         
         liarray[i]..find("div").first().jqmData("priceperitem","45.50");
         alert(liarray[i].find("div").first().jqmData("priceperitem"));
         
         }*/
        var menu = [{t: "Items", u: "#warehouse-home"}, {t: "Checkout", u: "#warehouse-checkout"}, {t: "Statistics", u: "#warehouse-statistics"}, {t: "Options", u: "#warehouse-options"}, {t: "About", u: "#warehouse-about"}];
        var items = "";

        for (var i = 0; i < menu.length; i++) {
            items += '<li><a href="' + menu[i].u + '" id="' + menu[i].t + '">' + menu[i].t + '</a></li>';
        }
        ul = $(".mainMenu:empty", $.mobile.activePage);// get "every" mainMenu that has not yet been processed
        //alert("createpanel ullenght="+ul.length+" Page= "+$.mobile.activePage.attr('id'))
        ul.append(items);
        ul.listview('refresh');

        /* $( document ).off('tap', "#Checkout").on('tap',"#Checkout",changetocheckout);
         $( document ).off('vclick', "#Statistics").on('vclick',"#Statistics",function(e){
         e.preventDefault();
         e.stopImmediatePropagation();
         changetostatistics();
         });*/
        //$( document ).off('tap', "#Items").on('tap',"#Items",function(){$( ":mobile-pagecontainer" ).pagecontainer( "change", "#warehouse-home", { transition: "slide", reverse: true} );});

    }
    function checkout() {

        createpanel();



        //,$.mobile.activePage überprüfen ob nötig ist !!!!! wenn nicht entfernen
        $(document).off('tap', "#scanitems").on('tap', "#scanitems", $.mobile.activePage, scanBarcode);
        $(document).off("tap", "#deleteitem").on("tap", "#deleteitem", $.mobile.activePage, deleteitemfromcart);
        $(document).off("tap", "#clearcheckout").on("tap", "#clearcheckout", $.mobile.activePage, removeallcartitems);
        $(document).off("tap", "#savecheckout").on("tap", "#savecheckout", $.mobile.activePage, savecheckout);
        $(document).off("change", "#checkoutcount").on("change", "#checkoutcount", $.mobile.activePage, updatecart);



    }
    function deleteitemfromcart() {

        var id = $(this).closest("li").attr("id");

        $("#checkoutlist > #" + id).remove();
        $("#checkoutlist").listview("refresh");
        updatecart();
    }
    function removeallcartitems() {

        $('#checkoutlist > li').remove();
        $("#totalprice").html(0);
        $("#totalprice").closest("ul").addClass("hidden");
    }
    function savecheckout() {



        if ($("#checkoutlist li").length > 0) {

            $("#checkoutlist li").each(function(i) {


                var itemid = $(this).attr("id");

                var boughtcount = parseInt($(this).find("#checkoutcount").val());

                var found = WarehouseApp.itemcontainer.getItemByID(itemid);

                var oldcount = found.count;
                var newcount = parseInt(oldcount) - boughtcount;

                if (newcount < 0) {

                    alert("Caution: Count of your Item: " + found.brand + " : " + found.description + " was = " + oldcount + " You sold:" + boughtcount + ". New Itemcount = 0.");
                    found.count = 0;
                    WarehouseApp.itemcontainer.edit(found);

                }
                else {

                    found.count = newcount;
                    WarehouseApp.itemcontainer.edit(found);
                }


            });

            var price = $("#totalprice", $.mobile.activePage).text();


            WarehouseApp.db.addSale(DatetoString(new Date()), price);
            removeallcartitems();
        }
        else {
            alert("There are no Items");
        }
    }
    function updatecart() {

        var total = 0;
        $("#checkoutlist li").each(function(i) {

            var ppi = parseInt($(this).find("div").first().jqmData("priceperitem"));
            var count = parseInt($(this).find("#checkoutcount").val());
            $(this).find('#price').text(ppi * count + " $ ");
            total = total + ppi * count;
        });
        $("#checkoutlist").listview("refresh");

        if ($("#checkoutlist li").length > 0) {
            $("#totalprice").html(total);
            $("#totalprice").closest("ul").removeClass("hidden");
        }
    }
    function submitCategory() {


        var category = $("#options-text", $.mobile.activePage).val();
        if (category != "") {
            for (var i = 0; i < categories.length; i++) {
                if (category.toUpperCase() == categories[i].name) {
                    alert("This Category exists already!");
                    return false;
                }
            }
            WarehouseApp.db.addCategory(category);
        }



    }
    function deleteCategory() {

        var id = $(this).closest("li").attr("id");

        WarehouseApp.db.deleteCategory(id);




    }
    function options() {

        $(document).off("tap", "#deletecategory").on("tap", "#deletecategory", deleteCategory);
        $(document).off('tap', "#statistics-reset").on('tap', "#statistics-reset", statistic_reset);
        WarehouseApp.db.getCategories();
        /* $('#categories-itemlist #options_li_template').remove();
         
         for (var i = 0; i < categories.length; i++) {
         alert("options "+categories[i].name);
         var li_template=$("#options_li_template").clone();
         li_template.find("#aleft").html(categories[i].name);
         $("#categories-itemlist",$.mobile.activePage).append(li_template); 
         
         }
         $("#categories-itemlist",$.mobile.activePage).listview("refresh");
         */
    }
    function statistics() {
        /* var date=new Date();
         var date7=minusDays(date,3);
         WarehouseApp.db.addSale(DatetoString(date7),parseInt(100));*/
        statisticscollapsible();

        WarehouseApp.db.getRevenues();



    }
    function statisticsbarchart() {

        var date = new Date();
        var datenew = minusDays(date, 7);
        var minDate = DatetoString(datenew);

        //line1=[['2014-02-08',231], ['2014-02-09',176], ['2014-02-10',64], ['2014-02-11',253],['2014-02-12',171],['2014-02-14',247],['2014-02-13',164]];
        var line1 = [];

        for (var i = 0; i < 7; i++) {
            var onedate = DatetoString(minusDays(date, i));
            //var pos=jQuery.inArray(onedate,sales);
            pos = -1;
            for (var j = 0; j < sales.length; j++) {
                if (sales[j].date == onedate) {
                    pos = j;
                    break;
                }
            }
            var x;

            if (pos == -1) {

                x = [onedate, 0];
                line1.push(x);
            }
            else {

                revenue = sales[pos].revenue;

                x = [onedate, revenue];
                line1.push(x);
            }


        }
        //WarehouseApp.db.addSale(DatetoString(date7),parseInt(100));

        // var vals = [[1,55],[2,124],[3,342],[4,178],[5,231]];
        //$.jqplot('plotChart',[vals]).replot({clear: true, resetAxes:true});
        //var line1=[['2014-02-08',231], ['2014-02-09',176], ['2014-02-10',64], ['2014-02-11',253],['2014-02-12',171],['2014-02-14',247],['2014-02-13',164]];
        //var x=['2014-02-15',131];
        //line1.push(x);
        // var date=new Date();
        // var date7=minusDays(date,1);
        // alert(DatetoString(date7));






        $.jqplot.config.enablePlugins = true;
        var plot2 = $.jqplot('plotChart', [line1], {
            //title:'Revenue last 7 Days', 
            seriesDefaults: {
                renderer: $.jqplot.DateBarRenderer,
                rendererOptions: {fillToZero: false}
            },
            gridPadding: {right: 35},
            axes: {
                xaxis: {
                    renderer: $.jqplot.DateAxisRenderer,
                    tickOptions: {formatString: '%#d.%#m '},
                    tickInterval: '1 day',
                    min: minDate
                },
                yaxis: {
                    tickOptions: {formatString: '%#d $ '},
                }
            },
            series: [{lineWidth: 4, markerOptions: {style: 'square'}}]
        }).replot();

    }
    function addDays(date, days) {
        var result = new Date(date);
        result.setDate(date.getDate() + days);
        return result;
    }
    function minusDays(date, days) {
        var result = new Date(date);
        result.setDate(date.getDate() - days);
        return result;
    }
    function DatetoString(date) {
        var string = "";
        var year = date.getFullYear();
        var month = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
        var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        ;
        string = (year + "-" + month + "-" + day);
        return string;

    }
    function statisticscollapsible() {
        $(document).off('tap', "#statistics-collapsible-button").on('tap', "#statistics-collapsible-button", function() {



            if ($("#statistics-collapsible-button").attr("data-icon") == "minus") {
                $("#statistics-collapsible-button").attr("data-icon", "plus");
                $("#statistics-collapsible-button").buttonMarkup({icon: "plus"});
                // $("#statistics-collapsible-button").attr('data-icon', "plus");
                // $("#statistics-collapsible-button").find('.ui-icon').addClass('ui-icon-plus').removeClass('ui-icon-minus');
            }
            else {
                $("#statistics-collapsible-button").attr("data-icon", "minus");
                $("#statistics-collapsible-button").buttonMarkup({icon: "minus"});
            }
            $("#plotChart").toggleClass("hiddenstatistics");
        });
    }
    function statistic_reset() {
        WarehouseApp.db.resetRevenues();

    }


    return {
        initialize: function() {
            // Add-Button in der Liste

            WarehouseApp.db.addCategoryTestData();
            //WarehouseApp.db.addRevenueTestData();
            //WarehouseApp.db.addItemTestData();

            $(document).off('tap', "#newItem").on("tap", "#newItem", addItem);

            // About-Dialog
            // $(document).off('tap', "#options").on('tap',"#options",options);

            // Home-Button
            $(document).off('tap', "#hometop").on('tap', "#hometop", home);
            $(document).off('tap', "#homebottom").on('tap', "#homebottom", home);
            //$( document ).on( "tap", "#home", home);
            //$( ":mobile-pagecontainer" ).on( "vtap", "#home", home );

            // Delete-Button
            $(document).off('tap', "#delItem").on('tap', "#delItem", function() {
                $('#delDialog', $.mobile.activePage).popup('open')
            });
            $(document).off('tap', "#delRealy").on('tap', "#delRealy", deleteItem);
            $(document).off('tap', "#delNo").on('tap', "#delNo", function() {
                $('#delDialog', $.mobile.activePage).popup('close')
            });

            // Save-Button
            $(document).off('tap', "#saveItem").on('tap', "#saveItem", saveItem);

            // Tooltips
            $(document).off('tap', "#labelcategory").on('tap', "#labelcategory", function() {
                $('#tooltipcategory').popup('open', {positionTo: '#category'})
            });


            if ((typeof cordova != 'undefined') || (typeof Cordova != 'undefined')) {



                $(document).off('tap', "#folder").on('tap', "#folder", getPhotoFromLibrary);
                $(document).off('tap', "#camera").on('tap', "#camera", capturePhoto);
                $(document).off('tap', "#smallImage").on('tap', "#smallImage", capturePhoto);
                $(document).off('tap', "#barcodebutton").on('tap', "#barcodebutton", scanBarcodeforItem);
                $(document).off('tap', "#barcodesearch").on('tap', "#barcodesearch", scanBarcodeforSearch);
            }

            $(document).off('tap', "#delete").on('tap', "#delete", deletePhoto);


            $(document).one("pagebeforeshow", "#warehouse-home", createpanel);
            $(document).one("pagebeforeshow", "#warehouse-about", createpanel);
            $(document).one("pagebeforeshow", "#warehouse-options", createpanel);
            $(document).one("pagebeforeshow", "#warehouse-statistics", createpanel);


            $(document).one("pagebeforeshow", "#warehouse-checkout", checkout);
            $(document).on("pagebeforeshow", "#warehouse-options", function(e) {
                e.stopImmediatePropagation();
                options();
            });
            $(document).on("pagebeforeshow", "#warehouse-checkout", function(e) {
                e.stopImmediatePropagation();
                removeallcartitems();
            });
            $(document).on("pageshow", "#warehouse-statistics", function(e) {
                e.stopImmediatePropagation();
                statistics();
            });
            //$( document ).on( "pageshow","#warehouse-details",getCategories);

            $(document).off('tap', "#delallitems").on('tap', "#delallitems", function() {
                $('#delDialog', $.mobile.activePage).popup('open')
            });
            $(document).off('tap', "#delallRealy").on('tap', "#delallRealy", deleteallItems);

            $(document).off('tap', "#options-submit").on('tap', "#options-submit", submitCategory);





            // Live-Validierung
            valid.autoValidate();
        },
        /* tap auf Eintrag */
        edit: function(guid) {
            edit(guid);
        },
        /* tap auf Eintrag */
        firstView: function() {
            addItem();
        },
        setCategories: function(array) {
            setCategories(array);
        },
        setSales: function(array) {
            setSales(array);
        },
    };
}

/** Controller aufrufen, wenn pageinit von jQM geworfen wird. */
$(document).on("pagecreate", "#warehouse-home", function() {
    // Event-Listener Buttons
    WarehouseApp.controller.initialize();
    //$.mobile.loadPage("#warehouse-details");
    // $( ":mobile-pagecontainer" ).pagecontainer( "load", "about.html" );
    // $( ":mobile-pagecontainer" ).pagecontainer( "load", "#warehouse-details" );
});

