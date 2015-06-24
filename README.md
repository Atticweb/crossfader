# crossfader

This plugin is made with jQuery and Froogaloop. Instead of just using seekTo function from Froogaloop, this has a fadeTo function.

It's currently in beta, so dont expect too much

## init function

This function builds the frame arround the video to create the fadeTo function.

```javascript
$('iframe#video_player').crossfader();
```

## fadeTo function

This function looks a lot like the seekTo function from Froogaloop.

#### parameters:

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

## Access original Froogaloop element

You can get access to the Froogaloop element via the 'elm' function like so:

```javascript
$('iframe#video_player').crossfader('elm').api('play');
```