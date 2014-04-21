/*********** DATABASE ************/
/** Warehouse-DB-Zugriff */
var WarehouseDB = ClassMVC.extend({
    init: function() {


        $data.Entity.extend("dbItem", {
            guid: {type: String, key: true, computed: false},
            brand: {type: String, required: true, maxLength: 200},
            description: {type: String, required: false, maxLength: 200},
            category: {type: String, required: true, maxLength: 200},
            buycount: {type: "int", required: true},
            count: {type: "int", required: true},
            price: {type: "int", required: true},
            buydate: {type: String, maxLength: 200},
            lastupdate: {type: String, maxLength: 200},
            imagebase64: {type: String},
            barcode: {type: String, maxLength: 200}
        });

        $data.Entity.extend("acategory", {
            name: {type: String, key: true, computed: false, maxLength: 200}
        });
        $data.Entity.extend("asale", {
            date: {type: String, key: true, computed: false, maxLength: 200},
            revenue: {type: "int", required: true}
        });

        $data.EntityContext.extend("ItemDatabase", {
            dbItems: {type: $data.EntitySet, elementType: dbItem},
            Categories: {type: $data.EntitySet, elementType: acategory},
            Sales: {type: $data.EntitySet, elementType: asale}
        });


        this.db = new ItemDatabase({
            provider: 'indexedDb', databaseName: 'ItemDatabase'
        });


    },
    resetRevenues: function(date, value) {
        this.db.onReady(function(db) {

            db.Sales.forEach(function(sale) {
                sale.remove();
            });
            db.saveChanges().then(function() {
                alert("Reset successed");

            })
                    .fail(function(reason) {
                        alert("Reset failed");
                    });

        });
    },
    addSale: function(date, value) {
        this.db.onReady(function(db) {
            //alert("addCategory name:"+name);


            db.Sales.toArray(function(sales) {

                var found = "false";
                for (var i = 0; i < sales.length; i++) {
                    if (sales[i].date == date) {
                        found = "true";
                        var sale = db.Sales.attachOrGet({date: date});
                        sale.revenue = (sales[i].revenue + parseInt(value));

                        db.saveChanges().then(function() {
                            alert("Checkout succeeded");
                        })
                                .fail(function(reason) {
                                    alert("Adding Data to the Statistics failed");
                                });
                        break;

                    }
                }

                if (found == "false") {

                    var sale = new asale();
                    sale.date = date;
                    sale.revenue = value;
                    db.Sales.add(sale);
                    db.saveChanges().then(function() {

                    })
                            .fail(function(reason) {
                                alert("Adding Data to the Statistics failed");
                            });
                }



            });



        });


    },
    getRevenues: function() {
        this.db.onReady(function(db) {

            var salesarray = [];
            db.Sales.toArray(function(sales) {
                for (var i = 0; i < sales.length; i++) {
                    salesarray.push(sales[i]);
                }

                WarehouseApp.controller.setSales(salesarray);

            });
        });


    },
    addCategory: function(name) {
        this.db.onReady(function(db) {

            var c = new acategory();

            c.name = name.toUpperCase();
            db.Categories.add(c);
            db.saveChanges().then(function() {

                WarehouseApp.db.getCategories();
            })
                    .fail(function(reason) {
                        alert("Adding Category failed: Database error");
                    });

        });
    },
    deleteCategory: function(name) {
        this.db.onReady(function(db) {
            //alert("delete Category name:" + name);
            db.Categories.remove({name: name.toUpperCase()});
            db.saveChanges().then(function() {
                alert("Category deleted");
                WarehouseApp.db.getCategories();
            })
                    .fail(function(reason) {
                        alert("Deleting Category failed: Database error");
                    });

        });
    },
    getCategory: function(name) {
        this.db.onReady(function(db) {
            db.Categories.toArray(function(cats) {
                for (var i = 0; i < cats.length; i++) {
                    if (cats[i].name == name)
                        cats[i];
                }
                return false;

            });
        });
    },
    getCategories: function() {
        this.db.onReady(function(db) {

            var carray = [];
            db.Categories.toArray(function(cats) {
                for (var i = 0; i < cats.length; i++) {

                    carray.push(cats[i]);
                }

                WarehouseApp.controller.setCategories(carray);

            });
        });
    },
    /** READ ALL ITEMS */
    readItems: function() {
        this.db.onReady(function(db) {
            db.dbItems.toArray(function(dbitems) {
                var array = [];
                for (var i = 0; i < dbitems.length; i++) {
                    array.push(WarehouseApp.db.toItem(dbitems[i]));
                }
                WarehouseApp.itemcontainer.setItems(array);
            });
        });
    },
    /** INSERT */
    insertItem: function(item) {

        this.db.onReady(function(db) {

            db.dbItems.add(WarehouseApp.db.todbItem(item));

            db.saveChanges().then(function() {

            }).fail(function() {
                alert("Fehler")
            });

        });
    },
    /** DELETE*/
    delItem: function(guid) {

        this.db.onReady(function(db) {

            db.dbItems.remove({guid: guid});
            db.saveChanges().then(function() {

            }).fail(function() {
                alert("Fehler")
            });
        });
    },
    /** DELETE ALL DBITEMS */
    delAll: function() {
        this.db.onReady(function(db) {
            db.dbItems.forEach(function(item) {
                item.remove();
            });
            db.saveChanges().then(function() {

            }).fail(function() {
                alert("Fehler")
            });
        });
    },
    /** EDIT */
    editItem: function(item) {
        this.db.onReady(function(db) {
            var dbitem = db.dbItems.attachOrGet({guid: item.guid});
            dbitem.category = item.category;
            dbitem.brand = item.brand;
            dbitem.description = item.description;
            dbitem.buycount = item.buycount;
            dbitem.count = item.count;
            dbitem.price = item.price;
            dbitem.lastupdate = item.lastupdate;
            dbitem.buydate = item.buydate;
            dbitem.imagebase64 = item.imagebase64;
            dbitem.barcode = item.barcode;
            db.saveChanges().then(function() {

            }).fail(function() {
                alert("Fehler");
            });
        });
    },
    /** DB aktualisieren */
    update: function(scope, data) {
        switch (data.crud) {  // bei R nichts machen
            case 'C':
                this.insertItem(data.obj);
                break;
            case 'U':
                this.editItem(data.obj);
                break;
            case 'D':
                this.delItem(data.obj.guid);
                break;
            case 'D_all':
                this.delAll();
                break;
        }
    },
    todbItem: function(item) {
        var dbitem = new dbItem();

        dbitem.guid = item.guid;
        dbitem.category = item.category;
        dbitem.brand = item.brand;
        dbitem.description = item.description;
        dbitem.buycount = item.buycount;
        dbitem.count = item.count;
        dbitem.price = item.price;
        dbitem.lastupdate = item.lastupdate;
        dbitem.buydate = item.buydate;
        dbitem.imagebase64 = item.imagebase64;
        dbitem.barcode = item.barcode;
        return dbitem;
    },
    toItem: function(dbitem) {
        var item = new Item();

        item.guid = dbitem.guid;
        item.category = dbitem.category;
        item.brand = dbitem.brand;
        item.description = dbitem.description;
        item.buycount = dbitem.buycount;
        item.count = dbitem.count;
        item.price = dbitem.price;
        item.lastupdate = dbitem.lastupdate;
        item.buydate = dbitem.buydate;
        item.imagebase64 = dbitem.imagebase64;
        item.barcode = dbitem.barcode;
        return item;
    },
    addItemTestData: function() {
        this.db.onReady(function(db) {

            var itemarray = [];

            for (var x = 0; x < 9; x++) {
                var cat;
                var br;
                var bar;
                var buyc = 0;
                var buyd = "13.02.2014";

                var cou = (Math.random() * 100);
                var des;
                var gui = "4195863c-8b08-f9b5-553c-32fafc275a4" + x;
                var ima = "img/template.jpg";
                var las = "2014-02-13T00:03:40.195Z";
                var pri = (Math.random() * 200);
                if (x < 3) {
                    cat = "JEANS";
                    if (x == 0) {
                        br = "Levi´s";
                        des = "501 Straight";
                        ima = "img/levis.jpg";
                        bar="test-code-001";
                    }
                    if (x == 1) {
                        br = "Wrangler";
                        des = "Arizona Stretch";
                        ima = "img/wrangler.jpg";
                        bar="test-code-002";
                    }
                    if (x == 2) {
                        br = "Jack & Jones";
                        des = "Tim Slim Fit";
                        ima = "img/jackandjones.jpg";
                        bar="test-code-003";
                    }
                }
                if (x > 2 && x < 6) {
                    cat = "POLOS";
                    br = "Tom Tailor";
                    des = "No." + x;
                    if (x == 3){
                        ima = "img/tomtailorblau.jpg";
                        bar="test-code-004";
                    }
                    if (x == 4){
                        ima = "img/tomtailorrot.jpg";
                        bar="test-code-005";
                    }
                    if (x == 5){
                        ima = "img/tomtailorschwarz.jpg";
                        bar="test-code-006";
                    }
                }
                if (x > 5 && x < 9) {
                    cat = "SHOES";
                    br = "Nike";
                    des = "Air " + x;
                    if (x == 6){
                        ima = "img/nikeairgruen.jpg";
                        bar="test-code-007";
                    }
                    if (x == 7){
                        ima = "img/nikeairgrau.jpg";
                        bar="test-code-008";
                    }
                    if (x == 8){
                        ima = "img/nikeairschwarz.jpg";
                        bar="test-code-009";
                    }
                        
                }
                var it = [gui, br, buyc, buyd, cat, cou, des, ima, las, pri, bar];
                itemarray.push(it);
            }


            db.dbItems.toArray(function(items) {
                for (var i = 0; i < itemarray.length; i++) {
                    var found = "false";
                    var dbitem = new dbItem();
                    dbitem.guid = itemarray[i][0];

                    for (var j = 0; j < items.length; j++) {
                        if (items[j].guid == dbitem.guid) {
                            found = "true";
                            break;
                        }
                    }
                    if (found == "false") {
                        dbitem.brand = itemarray[i][1];
                        dbitem.description = itemarray[i][6];
                        dbitem.category = itemarray[i][4];
                        dbitem.buycount = itemarray[i][2];
                        dbitem.count = itemarray[i][5];
                        dbitem.price = parseInt(itemarray[i][9]);
                        dbitem.buydate = itemarray[i][3];
                        dbitem.lastupdate = itemarray[i][8];
                        dbitem.imagebase64 = itemarray[i][7];
                        dbitem.barcode = itemarray[i][10];
                        db.dbItems.add(dbitem);

                    }

                }
                db.saveChanges().then(function() {
                   
                        WarehouseApp.db.readItems();
                   


                }).fail(function(reason) {
                    
                });
            });
        });
    },
    addRevenueTestData: function() {
        this.db.onReady(function(db) {


            var revarray = [];
            var date = new Date();

            for (var x = 0; x < 7; x++) {
                var r = [DatetoString(minusDays(date, x)), parseInt(Math.random() * 300)];
                revarray.push(r);
            }

            db.Sales.toArray(function(sales) {
                for (var i = 0; i < revarray.length; i++) {
                    var found = "false";
                    var s = new asale();

                    s.date = revarray[i][0];
                    s.revenue = revarray[i][1];

                    for (var j = 0; j < sales.length; j++) {
                        //alert("if ("+cats[j][0]+" == "+s.date+")");

                        if (sales[j].date == s.date) {
                            found = "true";
                            //  alert("found="+found)
                            break;
                        }
                    }
                    if (found == "false")
                        db.Sales.add(s);
                }
                db.saveChanges().then(function() {
                    
                        WarehouseApp.db.addItemTestData();
                    


                }).fail(function(reason) {
                    
                });
            });

        });
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
    },
    addCategoryTestData: function() {
        this.db.onReady(function(db) {

            var catarray = ["JEANS", "POLOS", "PANTS", "SHORTS", "SHOES", "SWEATERS", "ACCESSORIES"];
            db.Categories.toArray(function(cats) {
                for (var i = 0; i < catarray.length; i++) {
                    var found = "false";
                    var c = new acategory();
                    c.name = catarray[i];

                    for (var j = 0; j < cats.length; j++) {
                        if (cats[j].name == c.name) {
                            found = "true";
                            break;
                        }
                    }
                    if (found == "false")
                        db.Categories.add(c);
                }
                db.saveChanges().then(function() {

                   
                        WarehouseApp.db.addRevenueTestData();
                    
                }).fail(function(reason) {
                   
                });
            });
        });
    },
});