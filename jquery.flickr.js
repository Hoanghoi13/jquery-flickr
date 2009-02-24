/*****************************************
 * Flickr API (in jQuery)
 * version: 1.0 (02/23/2009)
 * written for jQuery 1.3.2 or later
 *****************************************/
(function($) {
  // core extensions
  $.extend({
    // determines if an object is empty
    // $.isEmpty({})             // => true
    // $.isEmpty({user: 'rph'})  // => false
    isEmpty: function(obj) {
      for (var i in obj) { return false }
      return true
    }
  })
  
  // base flickr object
  $.flickr = {
    url: function(method, params) {
      return 'http://api.flickr.com/services/rest/?method=' + method + '&format=json' +
        '&api_key=' + $.flickr.settings.api_key + ($.isEmpty(params) ? '' : '&' + $.param(params)) + '&jsoncallback=?'
    },
    thumbnail: function(photos) {
      return $.map(photos.photo, function(photo) {
        var src = 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_s.jpg',
            image = new Image(), html = ''

        image.src = src
        image.alt = photo.title
        
        if ($.flickr.settings.link_images) {
          html = '<a href="' + ['http://www.flickr.com/photos', photo.owner, photo.id].join('/') + '/"' +
            'title="' + photo.title + '"><img src="' + image.src + '" alt="' + image.alt + '" /></a>'
        } else {
          html = '<img src="' + image.src + '" alt="' + image.alt + '" />'
        }
          
        return [html]
      }).join("\n")
    }
  }
  
  // handles requesting and thumbnailing photos
  $.flickr.handle = function(method, options) {
    var options = $.extend($.flickr.settings, options || {}),
        elements = $.flickr.self
    
    return elements.each(function() {
      $.getJSON($.flickr.url(method, options), function(data) {
        elements.append($.flickr.thumbnail(data.photos))
      })
    })
  }
  
  // namespace to hold available API methods
  $.flickr.methods = {
    // http://www.flickr.com/services/api/flickr.photos.getRecent.html
    photosGetRecent: function(options) {
      $.flickr.handle('flickr.photos.getRecent', options)
    },
    // http://www.flickr.com/services/api/flickr.photos.getContactsPublicPhotos.html
    photosGetContactsPublicPhotos: function(options) {
      $.flickr.handle('flickr.photos.getContactsPublicPhotos', options)
    }
  }
  
  // the plugin
  $.fn.flickr = function(options) {
    $.flickr.self = $(this)
    
    // base configuration
    $.flickr.settings = $.extend({
      api_key: 'YOUR API KEY',
      link_images: true
    }, options || {})
    
    return $.flickr.methods
  }
})(jQuery);