//Represent a single marker
var Marker = function (marker) {
    var self = this;
	self.marker = marker;
	self.city = ko.observable('');
	self.image = ko.observable('');
	self.weather = ko.observable('Grabbing weather..');
    self.color = ko.observable('');
    self.infowindow;
	self.lat = ko.observable(marker.getPosition().lat());
	self.lng = ko.observable(marker.getPosition().lng());
	self.content = ko.computed(function(){
		return "<div><img src=\""+self.image()+"\" alt=\"Map not found\"><br>" + self.city() + "<br><br>" + self.weather() + "</div>";
	});
}

var ViewModel = function () {

    var self = this;
    self.markersList = ko.observableArray(); // Full list of markers
    self.segmentedMarkersList = ko.observableArray(); // Visible markers on page, limited by maxLength
    self.mapURL = ko.observable('https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyDHx-zS8oiRJ96FygRO5IFuGGN_-2-g4Bk&callback=viewModel.init');
    self.selectedMarker = ko.observable();
    self.filterText = ko.observable('');
    self.infowindow;
    self.geocoder;
    self.map;
    self.startIndex = 0;
    self.maxLength = Math.floor((window.innerHeight-132) / 90); // Determines maximum number of visible markers in markers list
    
    self.moveUp = function (){
        // Shift view up if next marker is above first visible marker in list
        if (self.markersList().indexOf(self.selectedMarker()) - 1 < self.startIndex && self.startIndex > 0){
            self.startIndex --;
            self.segmentedMarkersList(self.markersList().slice(self.startIndex, self.startIndex + self.maxLength));
        }
        // Select marker above currently selected marker
        else if (self.markersList().indexOf(self.selectedMarker()) - 1 > -1){
            self.setSelected(self.markersList()[self.markersList().indexOf(self.selectedMarker()) - 1]);
        }
    }
    
    self.moveDown = function () {
        // Shift view down if next marker is below last visible marker in markers list
        if(self.markersList().indexOf(self.selectedMarker()) > self.maxLength - 2 && self.startIndex < self.markersList().length - self.maxLength){
            self.startIndex ++;
            self.segmentedMarkersList(self.markersList().slice(self.startIndex, self.startIndex + self.maxLength));
        }
        // Select marker below currently selected marker
        else if (self.markersList().indexOf(self.selectedMarker()) < self.startIndex + self.maxLength - 1){
            self.setSelected(self.markersList()[self.markersList().indexOf(self.selectedMarker()) + 1]);
        }
    }
    
    self.setSelected = function (marker) {
        self.setDeselected();
        if(marker.infowindow){
            marker.infowindow.open(self.map, marker.marker);
        }
        self.selectedMarker(marker);
        self.markersList()[self.markersList().indexOf(marker)].color("#33CC33");
    }
    
    self.setDeselected = function () {
        if (self.markersList().indexOf(self.selectedMarker()) > -1){
            self.markersList()[self.markersList().indexOf(self.selectedMarker())].color("black");
            if(self.selectedMarker().infowindow){
                self.selectedMarker().infowindow.close();
            }
        }
    }
    
    self.addMarker = function (marker) {
        var newMarker = new Marker(marker);
		self.getWeather(newMarker);
        self.markersList.push(newMarker);
        google.maps.event.addListener(marker, 'click', function(event) {
            self.markersList().forEach(function(item){
                if(item.marker === marker){
                    console.log(item.content());
                    self.setSelected(item);
                }
            });
    	})
        if(self.markersList().length > self.maxLength){
            self.startIndex++;
        }
        self.segmentedMarkersList(self.markersList().slice(self.startIndex, self.startIndex + self.maxLength));
        self.getAddress(newMarker);
    }
    
    self.removeMarker = function () {
        var index = self.markersList().indexOf(this); // Marker to be removed
        var selected = self.markersList().indexOf(self.selectedMarker());
        var markersLength = self.markersList().length;
        
        self.markersList()[index].marker.setMap(null);
        self.markersList.remove(this);
        if(self.markersList().length > self.maxLength - 1 && self.startIndex > 0){
            self.startIndex--;
        }
        /*  There's a weird bug where updating segmentedMarkersList causes setSelected to fire. To fix this I
            remove the selected marker first, update the viewable markers, and then select the active marker. 
        */
        self.segmentedMarkersList(self.markersList().slice(self.startIndex, self.startIndex + self.maxLength));
        
        // Remove non-primary marker from multiple markers 
        if(index > 0 && markersLength > 1 && selected !== 0){
        
            // Remove selected marker that is not last in list
            if(selected !== markersLength-1 && index !== markersLength-1 && selected === index){
                self.setDeselected();
                self.selectedMarker("");
                self.setSelected(self.markersList()[index]);
            }
            
            // Remove marker that is not selected
            else if (selected !== index && index != selected) {
                if(index < selected) {
                    self.setSelected(self.markersList()[selected-1]);
                }
                else {
                    self.setSelected(self.markersList()[selected]);                    
                }
            }
            
            // Remove selected marker that is last in list
            else {
                self.setDeselected();
                self.selectedMarker("");
                self.setSelected(self.markersList()[index-1]);
            }
        }
        
        // Remove primary marker from multiple markers
        else if (index === 0 && markersLength > 1){
        
            //  Selected marker is last in list
            if(selected === markersLength-1){
                self.setSelected(self.markersList()[markersLength-2]);
            }
            
            // Selected marker is first in list
            else if(selected === 0){
                self.setDeselected();
                self.selectedMarker("");
                self.setSelected(self.markersList()[0]);
            }
            // Selected marker is neither first nor last in list
            else {
                self.setSelected(self.markersList()[selected-1]);
            }
        }

        // Remove last marker 
        else if (index === 0 && markersLength === 1){
            self.setDeselected();
            self.selectedMarker("");
            self.setDeselected(self.markersList()[index]);
        }
    }
    
    self.clearFilter = function () {
        self.filterText("");
    }
    
    self.filteredMarkers = ko.computed(function() {
        return ko.utils.arrayFilter(self.segmentedMarkersList(), function(item) {
            return item.city().toLowerCase().indexOf(self.filterText().toLowerCase()) >= 0;
        });
    });
	
	self.filteredSegmentedMarkers = ko.computed(function(){
		//self.segmentedMarkersList(self.filteredMarkers().slice(self.startIndex, self.startIndex + self.maxLength));
		return self.filteredMarkers().slice(self.startIndex, self.startIndex + self.maxLength);
	});
    
	self.getWeather = function (marker) {
		var xmlhttp;
		if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp=new XMLHttpRequest();
		}
		else {// code for IE6, IE5
			xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.onreadystatechange=function() {
            if (xmlhttp.readyState==4 && xmlhttp.status==200) {
                var response = JSON.parse(xmlhttp.responseText);
                var status = response.weather[0].description[0].toUpperCase() + response.weather[0].description.substring(1);
                var temp = response.main.temp;
                marker.weather("<div class=\"temp-status\"><strong>" + Math.floor(temp) + "°C </strong>, " + status + "</div><div class=\"temp-icon\"><img src=\"http://openweathermap.org/img/w/" + response.weather[0].icon + ".png\" alt=\"Weather icon not found\"></div>");
                if(marker.infowindow){
                    marker.infowindow.setContent(marker.content());
                }
            }
            else if(xmlhttp.readyState==4 && xmlhttp.status!=200){
                marker.weather("Weather data not found. Check your internet");
            }
		}
		xmlhttp.open("GET","http://api.openweathermap.org/data/2.5/weather?lat="+marker.lat()+"&lon="+marker.lng()+"&units=metric",true);
		xmlhttp.send();
	}
	
    // Taken from Google Maps API geocoder example
    self.getAddress = function(location){
        var lat = location.lat();
        var lng = location.lng();
        var latlng = new google.maps.LatLng(lat, lng);
        self.geocoder.geocode({'latLng': latlng}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    self.map.setZoom(14);
                    location.city(results[1].formatted_address);
                    location.image("https://maps.googleapis.com/maps/api/streetview?size=300x150&location="+lat+","+lng+"&fov=180&heading=90&pitch=20");
                    location.infowindow = new google.maps.InfoWindow();
                    location.infowindow.setContent(location.content());
                    location.infowindow.open(self.map, self.selectedMarker().marker);
                } else {
                    alert('No results found');
                }
            } else {
                alert('Geocoder failed due to: ' + status);
            }
        });
    }
    
    //Initialize page by setting up map and listeners
    self.init = function () {   
        self.geocoder = new google.maps.Geocoder();
        self.infowindow = new google.maps.InfoWindow();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position){
                var mapOptions = {
                  center: { lat: position.coords.latitude, lng: position.coords.longitude},
                  zoom: 14
                };
                self.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);  
                //Add marker when map is clicked
                google.maps.event.addListener(self.map, 'click', function(event) {
                var marker = new google.maps.Marker({position: event.latLng, map: self.map});
                    self.addMarker(marker);
                });
            });
        } 
        else { 
            console.log("Geolocation is not supported by this browser.");
            var mapOptions = {
              center: { lat: 40.730885, lng: -73.997383},
              zoom: 14
            };
            self.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);  
            //Add marker when map is clicked
            google.maps.event.addListener(self.map, 'click', function(event) {
            var marker = new google.maps.Marker({position: event.latLng, map: self.map});
                self.addMarker(marker);
            });
        }
    }
}

var viewModel = new ViewModel();
ko.applyBindings(viewModel);

