// ***** MODEL ******

var locations = ko.observableArray([{
        title: 'Empire State Building',
        location: {
            lat: 40.748380,
            lng: -73.985686
        },
    },
    {
        title: 'Pennsylvania Station',
        location: {
            lat: 40.750359,
            lng: -73.993248
        },
    },
    {
        title: 'The Morgan',
        location: {
            lat: 40.749447,
            lng: -73.981408
        },
    },
    {
        title: 'Banana Republic',
        location: {
            lat: 40.749152,
            lng: -73.985691
        },
    },
    {
        title: 'Herald Towers',
        location: {
            lat: 40.749426,
            lng: -73.987282
        },
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
                if (location.marker) {
                  location.marker.setVisible(true);
                }
                return true;
            } else {
                location.visibility === false;
                location.marker.setVisible(false);
                return false;
            }
        });
    });

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

    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 40.748380,
            lng: -73.985686
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

        locations()[i].marker = marker;

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

var urls = [];
var headers = [];
var snippets = [];

var loaddata = function () {
  for (var i = 0; i < locations().length; i++) {

  var locationTitle = locations()[i].title;

  var nytAPIUrl = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + locationTitle + "&sort=newest&api-key=355f67db9079418ea4d60df829f7df18";

  $.getJSON(nytAPIUrl, function (data) {

    var articles = data.response.docs;
    var article = articles[0];
    urls.push(article.web_url);
    urls.push(article.headline.main);
    urls.push(article.snippet)
  })
  locations()[i].url = urls[i];
  console.log(locationTitle);
}
}
//WAS JETZT NOCH FEHLT IST DIE INFO AN DEN JEWEILIGEN MARKER ZU HÄNGEN!

loaddata();

function showInfoWindow(marker, infowindow) {


    var contentstring = "<div>" + marker.title + "</br>" + "" + "</div>";
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent(contentstring);
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
