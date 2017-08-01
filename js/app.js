// ***** MODEL ******
var locations = ko.observableArray([{
        title: 'Villa Amarilla',
        location: {
            lat: 53.851782,
            lng: 10.690741
        },
        visibility: true
    },
    {
        title: 'Edeka',
        location: {
            lat: 53.853263,
            lng: 10.699552
        },
        visibility: true
    },
    {
        title: 'Old Appartment',
        location: {
            lat: 53.850747,
            lng: 10.695349
        },
        visibility: true
    },
    {
        title: 'Kolloseum',
        location: {
            lat: 53.854943,
            lng: 10.688857
        },
        visibility: true
    },
    {
        title: 'Bakery Junge',
        location: {
            lat: 53.849327,
            lng: 10.686381
        },
        visibility: true
    }
]);

// ***** VIEWMODEL *****

function mapViewModel() {
    var self = this;


    self.filter = ko.observable('');
    self.filteredPlaces = ko.computed(function() {
    var filter = self.filter().toLowerCase();

        return ko.utils.arrayFilter(locations(), function(location) {
            if (location.title.toLowerCase().indexOf(filter) > -1) {
                location.visibility === true;
                return true;
            } else {
                location.visibility === false;
                return false;
            }
        });
    });


  //  self.userinput = ko.observable("");

  /*  self.placesFiltered = ko.computed(function() {
    return ko.utils.arrayFilter(this.locations(), function(location) {
        if (location.title === self.userinput()) {
          return location.visibility === true;
        } else {
          return location.visibility === false;
        }

    });
});*/

    self.showSelectedMarker = function(location) {
        var infowindow = new google.maps.InfoWindow({
            content: location.title
        })

        for (i = 0; i < markers.length; i++) {
            markers[i].setAnimation(null);
            if (markers[i].title === location.title) {
                if (markers[i].getAnimation() !== null) {
                    markers[i].setAnimation(null);
                } else {
                    markers[i].setAnimation(google.maps.Animation.BOUNCE);
                    showInfoWindow(markers[i], infowindow);
                }
            }
        }
    },

    self.filterListings = function () {
      for (i=0;i<locations().length; i++) {
        if (locations().title === "Villa Amarilla") {
          locations()[i].showMarker = false;
        }
      }
      console.log("hi");
    }
};

// ***** INIT GOOGLE MAP ON PAGE ******

var map;
var markers = [];
var initMap = function() {

    var styles = [{
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [{
            "saturation": 36
        }, {
            "color": "#000000"
        }, {
            "lightness": 40
        }]
    }, {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [{
            "visibility": "on"
        }, {
            "color": "#000000"
        }, {
            "lightness": 16
        }]
    }, {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#000000"
        }, {
            "lightness": 20
        }]
    }, {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [{
            "color": "#000000"
        }, {
            "lightness": 17
        }, {
            "weight": 1.2
        }]
    }, {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [{
            "color": "#000000"
        }, {
            "lightness": 20
        }]
    }, {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{
            "color": "#000000"
        }, {
            "lightness": 21
        }]
    }, {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#000000"
        }, {
            "lightness": 17
        }]
    }, {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [{
            "color": "#000000"
        }, {
            "lightness": 29
        }, {
            "weight": 0.2
        }]
    }, {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [{
            "color": "#000000"
        }, {
            "lightness": 18
        }]
    }, {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [{
            "color": "#000000"
        }, {
            "lightness": 16
        }]
    }, {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [{
            "color": "#000000"
        }, {
            "lightness": 19
        }]
    }, {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{
            "color": "#000000"
        }, {
            "lightness": 17
        }]
    }];

    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 53.851782,
            lng: 10.690741
        },
        zoom: 15,
        styles: styles,
        mapTypeControl: false
    });

    for (var i = 0; i < locations().length; i++) {
        // Get the position from the locationArray array.
        var position = locations()[i].location;
        var title = locations()[i].title;
        // Create a marker per location and display on map
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            map: map
        });

        markers.push(marker);

        var infowindow = new google.maps.InfoWindow({
            content: locations()[i].title
        })
        marker.addListener("click", function() {
            showInfoWindow(this, infowindow);
        })
        marker.addListener("click", toggleMarker)
    }
}

function toggleMarker(marker) {
    for (i = 0; i < markers.length; i++) {
        markers[i].setAnimation(null);
    }
    if (this.getAnimation() !== null) {
        this.setAnimation(null);
    } else {
        this.setAnimation(google.maps.Animation.BOUNCE);
    }
}

function showInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.setMarker = null;
            for (i = 0; i < markers.length; i++) {
                markers[i].setAnimation(null);
            }
        });
    }
}

// init viewModel functionality
var vm = new mapViewModel();
ko.applyBindings(vm);
