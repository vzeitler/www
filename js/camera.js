function id(element) {
    return document.getElementById(element);
}

var cameraApp={
    pictureSource: null,
    
    destinationType: null,
    
    run: function(){
        
        var that=this;
	    that.pictureSource = navigator.camera.PictureSourceType;
	    that.destinationType = navigator.camera.DestinationType;
    },
    
    capturePhoto: function(success) {
        var that = this;
        
        // Take picture using device camera and retrieve image as base64-encoded string.
        navigator.camera.getPicture(function(){
            //that.onPhotoDataSuccess.apply(that,arguments);
            success.apply(that,arguments);
        },function(){
            that.onFail.apply(that,arguments);
        },{
            quality: 50,
            //destinationType: that.destinationType.DATA_URL
            destinationType: that.destinationType.FILE_URI,
            correctOrientation: true,
            targetWidth: 500, targetHeight: 500
        });
    },
    
    
    getPhotoFromLibrary: function() {
        var that= this;
        // On Android devices, pictureSource.PHOTOLIBRARY and
        // pictureSource.SAVEDPHOTOALBUM display the same photo album.
        that.getPhoto(that.pictureSource.PHOTOLIBRARY);         
    },
    
    getPhotoFromAlbum: function() {
        var that= this;
        // On Android devices, pictureSource.PHOTOLIBRARY and
        // pictureSource.SAVEDPHOTOALBUM display the same photo album.
        that.getPhoto(that.pictureSource.SAVEDPHOTOALBUM)
    },
    
    getPhoto: function(source) {
        var that = this;
        // Retrieve image file location from specified source.
        navigator.camera.getPicture(function(){
            that.onPhotoURISuccess.apply(that,arguments);
        }, function(){
            cameraApp.onFail.apply(that,arguments);
        }, {
            quality: 10,
            destinationType: cameraApp.destinationType.FILE_URI,
            sourceType: source
        });
    },
    
    onPhotoURISuccess: function(imageURI) {
        var smallImage = document.getElementById('smallImage');
        smallImage.style.display = 'block';
         
        // Show the captured photo.
        smallImage.src = imageURI;
        id("imagebase64").value=imageURI;
    },
    
    onFail: function(message) {
        $.mobile.loading('hide');
        alert(message);
    }
};