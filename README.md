# Crossfader

I made this plugin because i needed it for a project i'm currently working on.

This plugin is made with jQuery and Froogaloop. The fadeTo function is almost the same as the seekTo function from Froogaloop. It uses a second instance of the video to fade to another time in the video.

It's currently in beta, so dont expect too much.

_! when using this plugin, you can't use the standard vimeo controls anymore._

## Demo

[http://codepen.io/atticweb/pen/QbOaNo](http://codepen.io/atticweb/pen/QbOaNo)

## Dependencies

##### jQuery:
```html
<script type="text/javascript" src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
```
##### Froogaloop:
```html
<script type="text/javascript" src="http://a.vimeocdn.com/js/froogaloop2.min.js"></script>
```

## HTML

U can just use a Vimeo embed code like this:

```html
<iframe id="video_player" src="https://player.vimeo.com/video/2696386?api=1&player_id=video_player" width="630" height="354" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
```

Don't forget to add 'api=1' and 'player_id={id from iframe}' to the embed url.

## Init function

This function builds the frame arround the video to create the fadeTo function.

```javascript
$('iframe#video_player').crossfader().done(function(){
	console.debug('Lets do some magic here');
});
```

## FadeTo function

This function looks a lot like the seekTo function from Froogaloop.

##### Parameters:

_seconds_ = the seconds the video needs to skip to (number)  
_duration_ = the duration of the fade in ms (number)

```javascript
$('iframe#video_player').crossfader('fadeTo', {'seconds' : 20, 'duration' : 500});
```

## OnPlayProgess event

You can access the onPlayProgess event like so:

```javascript
$('iframe#video_player').crossfader('onPlayProgess', function(data){
    console.debug(data.seconds+' seconds');
});
```

## Access original Froogaloop element

You can get access to the Froogaloop element via the 'elm' function like so:

```javascript
$('iframe#video_player').crossfader('elm').api('play');
```

## Browser support

I'm still testing for browser support, if you have tested the code in another browser please let me know!

 - IE 10 >  
 - Chrome Version 43.0.2357.130 m >
 - Firefox 30.0 >