// create our anonymous function so that js won't clash with any other JS included on the page
(function(){
	// Localize jQuery variable
	var jQuery;
	// Load jQuery if not present
	if (window.jQuery === undefined) {
		var abs = "http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js";
		var s = document.createElement('script');
		s.type = "text/javascript";
		s.src = (window.location.protocol == 'file:' ? abs : abs.substring(5));
		//once library has loaded run the scriptLoadHandler function on ready state or onLoad 
		if (s.readyState) {
		  s.onreadystatechange = function () { // For old versions of IE
			  if (this.readyState == 'complete' || this.readyState == 'loaded') {
				  scriptLoadHandler();
			  }
		  };
		} else { // Other browsers
		  s.onload = scriptLoadHandler;
		}
		// Try to find the head, otherwise default to the documentElement
		(document.getElementsByTagName("head")[0] || document.documentElement).appendChild(s);
	}  else {
		// The jQuery version on the window is the one we want to use
		jQuery = window.jQuery;
		main();
	}
	// Called once jQuery has loaded
	function scriptLoadHandler() {
		// Restore $ and window.jQuery to their previous values and store the
		// new jQuery in our local jQuery variable
		jQuery = window.jQuery.noConflict(true);
		// Call our main function
		main(); 
	}
	// indexOf fix for browsers that don't support it (that means you ie)
	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
			"use strict";
			if (this == null) {
				throw new TypeError();
			}
			var t = Object(this);
			var len = t.length >>> 0;
			if (len === 0) {
				return -1;
			}
			var n = 0;
			if (arguments.length > 0) {
				n = Number(arguments[1]);
				if (n != n) { // shortcut for verifying if it's NaN
					n = 0;
				} else if (n != 0 && n != Infinity && n != -Infinity) {
					n = (n > 0 || -1) * Math.floor(Math.abs(n));
				}
			}
			if (n >= len) {
				return -1;
			}
			var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
			for (; k < len; k++) {
				if (k in t && t[k] === searchElement) {
					return k;
				}
			}
			return -1;
		}
	}
	// Our main function
	function main() { 
		jQuery(document).ready(function($) {
			// load CSS
			$("<link>").appendTo($('head')).attr({type : 'text/css', rel : 'stylesheet', href: 'script/components.css'});
			$("<link>").appendTo($('head')).attr({type : 'text/css', rel : 'stylesheet', href: 'script/layout.css'});
			// global vars
			var page = $('body');
			var tag = $('div, table');
			var authentication = $('.authentication');
			var currency = $('.currency');
			var explore = $('.explore');
			var registration = $('.registration');
			var sortable = $('.sortable');
			var winnow = $('.winnow');
			var rcontrols = $('h3#register, label[for=confirmPassword], input[name=confirmPassword], input[name=register]');
	        // timer to render drop down on keypress
	        var typingTimer; //timer identifier
	        var doneTypingInterval = 500;  //time in ms
	        // email regex
    		var eregex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-zA-Z0-9_\-\.]{2,6}(?:\.[a-zA-Z0-9_\-\.]{2})?)$/;
    		// password regex
    		var pregex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,16}$/;
			// vars for internet explorer
			var ie = /MSIE (\d+\.\d+);/.test(navigator.userAgent);
			var version = new Number(RegExp.$1);
			ie && version < 10 ? $('html').addClass('ie9') : "";
			var ie9 = $('html').hasClass('ie9');
			// tag work
			var removal = function(type, element){
				// tag action
				element.clone().insertBefore(type);
				type.remove();
			}
			// end tag work
    		// validation
    		var validation = function(){
	    		var a = $('.authBox input[type=text]');
				var b = $('.authBox input[name=password]');
				var d = $('.authBox label[for=email]');
				var f = $('.authBox label[for=password]');
				var g = $('.regBox input[type=text]');
				var h = $('.regBox input[name=password]');
				var j = $('.regBox label[for=email]');
				var k = $('.regBox label[for=password]');
				var l = $('.regBox input[name=confirmPassword]');
				var m = $('.regBox label[for=confirmPassword]');
				var n = $('.authBox input');
				var o = $('.regBox input');	
				var credentials;
				var form = $(this).closest('div');
				var login = $('.authBox');
				var registration = $('.regBox');
				var eValidator = "<span class='validate-error email'>(Please enter a valid email address)</span>";
				var mValidator = "<span class='validate-error password'>(Passwords must match)</span>";
				var pValidator = "<span class='validate-error password'>(Must be 8 characters: 1 lower, 1 uppercase letter & 1 number)</span>";
				var submit = $('input[type=button]');
				var txt = $('input[type=text]');
				// validate login and registration
				var error_handling = function(element, label, type, message){
					credentials = ( element.is(txt) ? eregex.test(element.val()) : pregex.test(element.val()) );
					var u = function(){ element.removeClass('input-error'); label.children('span').remove(); }
					var w = function(){ u(); element.addClass('input-error').before(message); }
					credentials ? u() : w();
				}
				var unmatched = function(){
					m.children('span').remove();
					l.removeClass('input-error').addClass('input-error').before(mValidator);
				}
				a.blur(function(){
					error_handling(a,d,'email',eValidator);
				});
				b.blur(function(){
					error_handling(b,f,'password',pValidator);
				});
				g.blur(function(){
					error_handling(g,j,'email',eValidator);
				});
				h.blur(function(){
					error_handling(h,k,'password',pValidator);
				});
				l.blur(function(){
					h.val() !== l.val() ? unmatched() : error_handling(l,m,'confirmPassword', pValidator);
				});	
				login.on('click', submit, function(event){
					n.trigger('blur');
					var error = $('.validate-error').is(':visible');
					error ? event.preventDefault() : "";
				});	
				registration.on('click', submit, function(event){
					o.trigger('blur');
					var error = $('.validate-error').is(':visible');
					error ? event.preventDefault() : "";
				});
			}
			// end validation
			// ajax loader
			var loadFX = function(value){
				var winWidth = $(window).innerWidth();
				var winHeight = $(window).innerHeight();
				var bWidth = $('html').attr('data-width');
				var bHeight = $('html').attr('data-height');
				var center = (winWidth/2) - 30;
				var vertical = (winHeight/2) - 30;
				// for ie
				var ieRotate = function(){
					var interval = null;
					var counter = 0;
					interval = setInterval(function(){
						counter -= 1;
						$('#loader').css({ '-ms-transform' : 'rotate(' + -counter + 'deg)' });
					}, 0);
				}
				var modality = function(){
					var winWidth = $(window).innerWidth();
					var winHeight = $(window).innerHeight();
					var bWidth = $('html').attr('data-width');
					var bHeight = $('html').attr('data-height');
					var center = (winWidth/2) - 30;
					var vertical = (winHeight/2) - 30;
					$('#modal').css({ 'width' : winWidth, 'height' : winHeight });
					$('.loadContainer').css({ 'top' : vertical, 'left' : center });
				}
				var showLoader = function(){
					page.prepend('<div id="modal"></div>'
						+ '<div class="loadContainer">'
						+ '<div id="loader"></div>'
						+ '<p>loading</p>'
						+ '</div>'
					);
					modality();
					ie9 ? ieRotate : "";
				}
				$(window).resize(function(){
					modality();
				});
				value ? showLoader() : $('#modal, .loadContainer').remove();
			} 
			// end ajax loader
    		// miniloader
			var miniloader = function(value, placement){
				var elem = placement;
				var value = value;
				var margin = parseInt(elem.css('marginTop'));
				var t = elem.position().top;
				t = t + margin;
				var l = (elem.innerWidth() + 10) + elem.position().left;
				var h = elem.innerHeight() - 10;
				var w = elem.innerHeight();
				// for ie
				var ieRotate = function(){
					var interval = null;
					var counter = 0;
					interval = setInterval(function(){
						counter -= 1;
						$('#miniloader').css({ '-ms-transform' : 'rotate(' + -counter + 'deg)','width' : w/3, 'height': h/2 });
					}, 0);
				}
				var modality = function(){
					$('.miniloadContainer').css({ 'top' : t, 'left' : l, 'height' : h, 'width' : w });
					$('#miniloader').css({ 'width' : w - 20, 'height': h - 10 });
				}
				var showLoader = function(){
					elem.after('<div class="miniloadContainer">'
						+ '<div id="miniloader"></div>'
						+ '</div>'
					);
					modality();
					ie9 ? ieRotate : "";
				}
				$(window).resize(function(){
					modality();
				});
				value ? showLoader() : $('.miniloadContainer').remove();
			}
    		// end miniloader
			// prototype
			var searchOptions = function(url, key, datanode, image, imagenode, miniload, element, type, sorter){
				this.a = url;
				this.b = key;
				this.c = datanode;
				this.d = image;
				this.e = imagenode;
				this.f = miniload;
				this.g = element;
				this.h = type;
				this.k = sorter;
				var exploration = function(a, b, c, d, e, f, h){
					// textfield var
			        var filter = $('.searchFilter');
			        var list = $('.searchFilter dl.search');
			        var search = $('.searchFilter input[type=text]');
			        var datalist = function(){
			        	var position = filter.position();
					    var searchXpos = position.left;
					    var searchYpos = search.outerHeight() + 1;
				    }
			        datalist();
			        $(window).resize(function () { datalist(); });
		    		var stop = function(){ search.addClass('keyOff'); }
				    var start = function(){
				        $('dl.search').html('').removeClass('hide');
						search.removeClass('keyOff');
				    }
				    var clearNoEvent = function(){
				    	$('dl.search dd[class="noEvent"]').remove();
				    }
					var searchData = function () {
			            var searchIt = function () {
			                $('dl.search').hide().html('');
			                var searchVal = $.trim(search.val().toLowerCase());
			                var searchData = {};
			                searchData[b] = searchVal;
			                f ? miniloader(true, search) : loadFX(true);
			                $.ajax({
			                    url: a,
			                    dataType: "json",
			                    type: "post",
			                    data: searchData,
			                    complete: function(jqXHR, textStatus){ 
			                    	f ? miniloader(false, search) : loadFX(false);
			                	},
			                    success: function (data, jqXHR, textStatus) {
			                        for(i=0; i<data.length; i++){
	                        			clearNoEvent();
	                        			if(data[i][c].toLowerCase().indexOf(searchVal) !== -1){
	                        				d ? $('dl.search').show().append('<dd><img src="' + data[i][e] + '" /><span>' + data[i][c] + '</span></dd>') : $('dl.search').show().append('<dd>' + data[i][c] + '</dd>');
	                        			} else if((i + 1 == data.length) && $('dl.search').children().length == 0){
	                        				$('dl.search').show().html('<dd class="noEvent">There is no data available</dd>');
			    							$('dl.search dd[class!="noEvent"]').remove(); // handle timing for rapid typing
			                                $('dl.search').show();
	                        			}
	                        		}
					    			list.width(search.width());
                    				$('dl.search dd').width(search.width());
			                    }
			                });
			            }
			            var hideData = function(){ $('dl.search').hide().html(""); }
			            search.hasClass('keyOff') || search.val() == "" ? hideData() : searchIt();
			        }
				    search.keyup(function () {
			        	f ? miniloader(false, search) : loadFX(false);
			            clearTimeout(typingTimer);
			            typingTimer = setTimeout(searchData, doneTypingInterval);
			        }).keydown(function (event) {
			            if(event.keyCode == 8) { start(); }
						if(event.keycode == 13){
							$('dl.search dd').hasClass('selected') ? $(this).trigger('click') : search.trigger('keyup'); 
						}
						if ((event.keyCode == 38 || event.keyCode == 40) && $('dl.search dd').length > 0) {
			                if (event.keyCode == 38) {
			                    $('dl.search dd').hasClass('selected') ? $('dl.search dd.selected').removeClass('selected').prev().addClass('selected') : $('dl.search dd:last-child').addClass('selected');
			                } else {
			                    $('dl.search dd').hasClass('selected') ? $('dl.search dd.selected').removeClass('selected').next().addClass('selected') : $('dl.search dd:first-child').addClass('selected');
			                }
			                stop();
			            }
			            if($('dl.search dd.selected').length == 0){ search.removeClass('keyOff'); }
					}).focus(function(){
						start();
						search.val() != "" ? "" : $('dl.search').hide().html("");
					});
			        $(document).on('click', 'dl.search dd', function(){
			        	search.val( d ? $(this).find('span').html() : $(this).html() ).blur();
			        	$('dl.search').hide().html("");
			        }).on('click', 'dl.search dd.selected', function(){
			        	search.val( d ? $(this).find('span').html() : $(this).html() ).blur();
			        	$('dl.search').hide().html("");
			        });
				}
				var filter = function(a, b, c, d, e, f, h){
					var l = $('input[class=sort]');
					var s = $('.filter');
					var searchData = function(){
						var search = $.trim(l.val());
						search = search.toLowerCase();
						var searchData = {};
		                searchData[b] = search;
		                l.val() == "" ? "" : (f ? miniloader(true, l) : loadFX(true));
		                $.ajax({
							url: a,
							dataType: 'json',
							type: 'post',
							data: searchData,
							complete: function(){
			        			f ? miniloader(false, l) : loadFX(false);
							},
							success: function(data){
								s.html("");
			        			if(l.val() == ""){
									s.html("");
			        			} else {
				        			for(i=0; i<data.length; i++){
				        				if( data[i][c].toLowerCase().indexOf( $.trim( l.val() ) ) !== -1 ){
				        					d == 'true' ? s.append('<div>' + data[i][e] + data[i][c] + '</div>') : s.append('<div>' + data[i][c] + '</div>');
				        				} else if((i + 1 == data.length) && s.html() == ""){
					        				s.html('<div class="noData">Unfortunately, there is no data available</div>');
					        			}
				        			}
			        			}
							}
						});
	                }
	                l.keyup(function(){
			        	f ? miniloader(false, $(this)) : loadFX(false);
			            clearTimeout(typingTimer);
			            typingTimer = setTimeout(searchData, doneTypingInterval);
					}).keydown(function(event){
						event.keyCode == 8 ? element.trigger('keyup') : '';
					});
				}
				this.g.is('.sort') ? filter(this.a, this.b, this.c, this.d, this.e, this.f, this.h, this.k) : exploration(this.a, this.b, this.c, this.d, this.e, this.f, this.h);
			}
			var configurations = function(type, element){
    			// grab configurations and pass into an array
    			this.tag = type;
    			this.elem = element;
    			this.options = [];
    			this.configure = type.data('configs');
    			this.data = this.configure.split("|");
    			for(i=0; i<this.data.length; i++){ this.options.push(this.data[i]); }
				this.url = this.data[0];
				this.key = this.data[1];
				this.datanode = this.data[2];
				this.image = (this.data[3] == "false" ? false : true);
				this.imagenode = this.data[4];
				this.miniload = (this.data[5] == "" ? false : true);
				this.container = (this.data[6] == "" ? "" : this.data[6]);
				// tag action
	    		var tagRemoval = new removal(this.tag, this.elem);
				// pass configs to the ajax call
				var configs = new searchOptions(this.url, this.key, this.datanode, this.image, this.imagenode, this.miniload, this.elem, this.tag, this.container);
			}
			var format = function(){
				a = $('.amount');
    			a.click(function(){
    				//if(a.createTextRange){
					//	var r = a.createTextRange();
					//	r.move('character', 0);
					//	r.collapse(true);
					//	r.select();
					//}
					//$(this).trigger('focus');
    			}).focus(function(){
					
    			}).keyup(function(){
    			//	$(this).val('$' + a + '.00'));
    			}).keydown(function(){
    				if(a.createTextRange){
						var r = a.createTextRange();
						r.move('character', 0);
						r.collapse(true);
						r.select();
					}
    			});
			}
			// authentication
			if(tag.is(authentication)){
				var c = authentication.data('configs');
				authentication.html('<div class="authBox">'
					+ '<form method="post" action=' + c + '>'
					+ '<h3>Log in using your account</h3>'
					+ '<label for="email">'
					+ 'Email Address'
					+ '<input type="text" name="email" placeholder="Email Address" />'
					+ '</label>'
					+ '<label for="password">'
					+ 'Password'
					+ '<input type="password" id="password" name="password" placeholder="Password" />'
					+ '</label>'
					+ '<input type="button" class="btn red" value="Log in" />'
					+ '</form>'
					+ '</div>'
				);
				var authenticate = $('.authBox');
				// tag action
	    		var tagRemoval = new removal(authentication, authenticate);
	    		validation();
    		}
    		// end authentication
    		// registration
			if(tag.is(registration)){
				var c = registration.data('configs');
				registration.html('<div class="regBox">'
					+ '<form method="post" action=' + c + '>'
					+ '<h3>Create an account</h3>'
					+ '<label for="email">'
					+ 'Email Address'
					+ '<input type="text" name="email" placeholder="Email Address" />'
					+ '</label>'
					+ '<label for="password">'
					+ 'Password'
					+ '<input type="password" id="password" name="password" placeholder="Password" />'
					+ '</label>'
					+ '<label for="confirmPassword">'
					+ 'Confirm Password'
					+ '<input type="password" name="confirmPassword" placeholder="Confirm Password" />'
					+ '</label>'
					+ '<input type="button" class="btn red" value="Sign Up" />'
					+ '</form>'
					+ '</div>'
				);
				var register = $('.regBox');
				// tag action
	    		var tagRemoval = new removal(registration, register);
	    		validation();
    		}
			// end registration
			// search
    		if(tag.is(explore)){
	    		explore.html('<div class="searchFilter">'
					+ '<input type="text" class="search" autocomplete="off" />'
	        		+ '<dl class="search"></dl>'
	        		+ '</div>'
	    		);
	    		var filter = $('.searchFilter');
	    		var search = new configurations(explore, filter);
    		}
    		// end search
			// filter
			if(tag.is(winnow)){
				winnow.html('<input type="text" class="sort" autocomplete="off" />');
				var filter = $('input[type=text].sort');
				var sort = new configurations(winnow, filter);
			}
    		// end filter
    		// price format
    		if(tag.is(currency)){
    			currency.html('<input type="text" class="amount" />');
    			var amount = $('input[type=text].amount');
    			amount.val('.00');
    			var tagRemoval = new removal(currency, amount);
    			format();
    		}
    		// end price format
    		// sortable table
    		if(tag.is(sortable)){
    			var a = []; // store header names
    			var c = []; // store key|value attributes
    			var count; // array checker
    			var criteria;
    			var d;
    			var f;
    			var g;
    			var h;
    			var header = $('.sortable th');
    			var id;
    			var table = $('.sortable');
    			var rows = $('.sortable tr');
    			table.wrap('<div class="tablet"></div>');
    			header.each(function(item){
    				// key data that we're checking against
    				criteria = $(this).html().toLowerCase().replace(/\s+/g, "");
    				// assign that key to a unique id
    				$(this).prop('id', criteria);
    				// sort our fields
    				a.push(criteria);
    				// determine if we're sorting the columns
    				f = $(this).attr('data-configs').split("|");
    				f[0] === '1' ? $(this).append('<span>&#9650;</span>') : "";
    			}).on('click', function(){
    				id = $(this).prop('id');
    				g = $(this).attr('data-configs').split("|");
    				g = g[0];
    				h = g[1];
    				// activate if sorting is enabled
    				if(g === '1'){
						var ascend = function(){
		    				// sort the table either alphabetically, numerically or chronologically
							c.sort(function(a,b){
								if(h === 'd'){
									console.log('date');
									return new Date(b[id]) - new Date(a[id]);
								} else if(h === 'n') {
									console.log('numerical');
									return a[id]-b[id];
								} else {
									console.log('alphabetical');
									if(a[id] < b[id]) return -1;
									if(a[id] > b[id]) return 1;
									return 0;
								}
							});
						}
						var descend = function(){
							c.sort(function(a,b){
								console.log('numerical');
								return b[id]-a[id];
							});
						}
	    				// arrow behavior
	    				if( $(this).hasClass('ascending') ){ 
	    					$(this).removeClass('ascending').children('span').html('&#9650');
	    					g === 'n' ? descend() : c.reverse();
						} else {
							ascend();
							header.not($(this)).removeClass('ascending').children('span').html('&#9650');
	    					$(this).addClass('ascending').children('span').html('&#9660;');
						}
						// table manipulation begins
						$('.sortable tr:not(:first-child)').remove();
	    				// dynamically create new table data based on sort filter
	    				for(j=0; j<c.length; j++){
	    					// get key name in array
	    					var k = Object.keys(c[0]);
	    					// append new table rows
	    					table.append('<tr></tr>');
	    					// loop through each row and dynamically add relevant table data
							for(l=0; l<k.length; l++){
								var name = k[l];
								$('.sortable tr:eq(' + (j+1) + ')').append('<td>' + c[j][name] + '</td>');
							}
	    				}
    				}
    			});
    			// for each row capture the data and place in an array
    			for(i=0; i<rows.length; i++){
    				var b = {};
    				rows.eq(i).children('td').each(function(item){
    					count = rows.eq(i).children('td').length;
    					count = count - 1;
    					b[a[item]] = $(this).html();
    					if(item === count){
    						c.push(b);
							d = JSON.stringify(c);
						}
					});
    			}
    		}
    		// end sortable table
		});// end main function
	}
})(); //calls our function immediately