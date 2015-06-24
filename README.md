# crossfader

This plugin is made with jQuery and Froogaloop. Instead of just using seekTo function from Froogaloop, this has a fadeTo function.

## init function

this function builds the frame arround the video to create the fadeTo function.

```javascript
$('iframe#video_player').crossfader();
```

## fadeTo function

This function looks a lot like the seekTo function from Froogaloop.

__parameters:__
_seconds_ = the seconds the video needs to skip to (number)
_duration_ = the duration of the fade in ms (number)

```javascript
$('iframe#video_player').crossfader('fadeTo', {'seconds' : 20, 'duration' : 500});
```

## onPlayProgess event

You can access the onPlayProgess event like so:

```javascript
$('iframe#video_player').crossfader('onPlayProgess', function(data){
    console.debug(data.seconds+' seconds');
});
```