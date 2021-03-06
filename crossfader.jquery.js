(function( $ ){

    var cf_options = {
        'current_video' : 0,
        'switch_video' : false,
        'timeout' : false,
        'ignore_gap' : 5,
    	'duration' : 150,
   	}
    var cf_vars = {
        'players' : [],
    }
    var cf_methods = {
        init : function(options) {
            var promises = [];
            $.extend( cf_options, options );
            $(this).each(function(){
                var def = new $.Deferred();
                build_frame($(this)[0]).done(function(){
                    def.resolve();
                });
                promises.push(def);
            });
            return $.when.apply(undefined, promises).promise();
        },
        elm : function(){
            var video_id = $($(this)[0]).attr('id');
            var vars = $('.cf_wrapper#'+video_id+'_wrapper').data('vars');
            return cf_vars.players[video_id][vars.current_video];
        },
        fadeTo : function(options) {
            var video_id = $($(this)[0]).attr('id');
            return fadeTo(video_id, options)
        },
        onPlayProgess : function(func){
            cf_methods.playProgress = func;
        },
        playProgress : function(data) {
            // function from 'onPlayProgess()'
        }
    };

    function build_frame(elm)
    {
    	if(!$(elm).parent().hasClass('cf_wrapper')){
            var deferred1 = $.Deferred(),
                deferred2 = $.Deferred(),
                returnDeferred = $.Deferred();
    		var elm = $(elm),
                second_elm = $(elm).clone(),
                elm_id = elm.attr('id'),
                re = new RegExp(elm.attr('id')+'$',"g"),
                cf_wrapper;

            elm.wrap('<div class="cf_wrapper" id="'+elm_id+'_wrapper"></div>')
                .addClass('show')
                .addClass('video_1');
            cf_wrapper = $('.cf_wrapper#'+elm_id+'_wrapper');
            cf_wrapper.append('<div class="cf_overlay"></div>');
            second_elm.attr('id', elm_id+'_2')
                .addClass('video_2')
                .attr('src', second_elm.attr('src').replace(re, elm_id+'_2'));
    		cf_wrapper.append(second_elm);

            cf_vars.players[elm.attr('id')] = [];
            $f(elm[0]).addEvent('ready', function(player_id){
                cf_vars.players[elm.attr('id')][0] = $f(player_id);
                deferred1.resolve();
                $f(player_id).addEvent('playProgress', function(data){
                    var vars = cf_wrapper.data('vars');
                    if(vars.switch_video && vars.current_video == 0)
                    {
                        cf_wrapper.data('vars').switch_video = false;
                        cf_wrapper.data('vars').timeout = true;
                        $('.video_2', cf_wrapper).removeClass('show');
                        $('.video_1', cf_wrapper).addClass('show');
                        setTimeout(function(){
                            $f(second_elm[0]).api('pause');
                            cf_wrapper.data('vars').timeout = false;
                        }, vars.duration);
                    }
                    if(vars.current_video == 0) cf_methods.playProgress(data);
                })
            });
            $f(second_elm[0]).addEvent('ready', function(player_id){
                cf_vars.players[elm.attr('id')][1] = $f(player_id);
                deferred2.resolve();
                $f(second_elm[0]).api('setVolume', 0).api('play').api('pause'); //jumpstart play->pause
                $f(player_id).addEvent('playProgress', function(data){
                    var vars = cf_wrapper.data('vars');
                    if(vars.switch_video && vars.current_video == 1)
                    {
                        cf_wrapper.data('vars').timeout = true;
                        cf_wrapper.data('vars').switch_video = false;
                        $('.video_1', cf_wrapper).removeClass('show');
                        $('.video_2', cf_wrapper).addClass('show');
                        setTimeout(function(){
                            $f(elm[0]).api('pause');
                            cf_wrapper.data('vars').timeout = false;
                        }, vars.duration);
                    }
                    if(vars.current_video == 1) cf_methods.playProgress(data);
                })
            });

            //if both froogaloop objects are loaded
            $.when(deferred1, deferred2).done(function(){
                cf_wrapper.data('vars', cf_options);
                returnDeferred.resolve();
            });
            return returnDeferred;
    	}
        else
        {
            return true;
        }
    }

    function fadeTo(video_id, options)
    {  
        var vars = $('.cf_wrapper#'+video_id+'_wrapper').data('vars');
        if(!options.seconds) return false;
        if(vars.timeout) return false;
        if(options.duration){
            change_duration(vars, options.duration);
        }
        var ignore_gap = (options.ignore_gap)?options.ignore_gap:vars.ignore_gap;
        cf_vars.players[video_id][vars.current_video].api('getCurrentTime', function(current_seconds, player_id) {
            current_seconds = Math.round(current_seconds);
            var diff = options.seconds-current_seconds;
            if(diff > ignore_gap || diff < 0){
                vars.switch_video = true;
                fadeAudio(cf_vars.players[video_id][vars.current_video], vars.duration);
                vars.current_video = (vars.current_video == 0)?1:0;
                fadeAudio(cf_vars.players[video_id][vars.current_video], vars.duration, true);
                cf_vars.players[video_id][vars.current_video].api('seekTo', options.seconds);
                cf_vars.players[video_id][vars.current_video].api('play');
            }
        });
    }

    function fadeAudio(player, duration, fade_in)
    {
        var amount = (fade_in)?.1:-.1;
        var i = 1;
        var steps = 10;
        var current_volume = (!fade_in)?1:0;
        var interval = setInterval(function(){
            player.api('setVolume', current_volume+(i*amount));
            i++;
            if(i > 10){
                clearInterval(interval);
            }
        }, duration/steps);
    }

    function change_duration(vars, duration)
    {
        vars.duration = duration;
        var duration_obj = {
            '-webkit-transition' : 'opacity '+duration+'ms ease-in-out',
            '-moz-transition' : 'opacity '+duration+'ms ease-in-out',
            'transition' : 'opacity '+duration+'ms ease-in-out',
        };
        $('.cf_wrapper iframe').css(duration_obj);
    }

    $.fn.crossfader = function(methodOrOptions) {
    	if(typeof $f == 'undefined')
    	{
    		$.error( 'Crossfader needs Froogaloop' );
    	}
        if ( cf_methods[methodOrOptions] ) {
            return cf_methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
            return cf_methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  methodOrOptions + ' does not exist' );
        }    
    };


})( jQuery );