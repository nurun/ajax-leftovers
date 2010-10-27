/****
 * jQuery.fn.ajaxLeftovers
 * Author : Alexandre Paquette (alexandre.paquette@nadrox.com)
 * Project sponsored by : Nurun Inc.
 * 
 * Descriptions : Create ajax requests allowing the server to 
 * add or change current page content based on user actions
 * 
 * Requirements : 
 *  - Plugin is developped using jquery-1.4.3
 *  - A HTML meta named "leftovers-connector" with the 
 *    connector (server listener) url as its content
 * 
 * Client query includes:
 * 	- The url of the current page calling the connector
 * 	
 * Server listener response should be a valid json string 
 * containing an array of the following object: 
 * 	- selector		string	(optionnal) Contains a jquery valid selector 
 *							to target the content to be updated. May be 
 *							ommited if the "script" parameter is present
 * 	
 *  - content		string	The HTML that is used to update the 
 * 							targetted content
 * 	
 * - updateMethod 	string	(optionnal) Dictate how to update the 
 * 							targetted content. Valid options are 
 * 							"replace" (default behavior) or "append"     
 * - script 		string	(optional) A javascript expression to call 
 * 							using eval()
 */
(function( $ ){
	
	jQuery.fn.ajaxLeftovers = function(userSettings) {
		var settings = {event: 'click'}
		
		$.extend(settings,userSettings)
		// retreive the meta value "leftovers-connector" to create the ajax request
		var serverUrl = $("head meta[name=leftovers-connector]")[0].getAttribute('content');
		var pageUrl = document.location.href;
		var handleServerResponse = function(data){
			
			for (var i in data){
				if (typeof data[i].selector != "undefined"){
					if (typeof data[i].updateMethod == "undefined" 
							|| data[i].updateMethod == "replace"){
						
						$(data[i].selector).html(data[i].content);
						
					}else if(data[i].updateMethod == "append"){
						
						$(data[i].selector).append(data[i].content);
					}
				}
				if (typeof data[i].script != "undefined"){
					eval('(' + data[i].script + ')');
				}
			}
		};
		this.each(function(){
			$(this).bind(settings.event,null, function(){
				$.getJSON(serverUrl,{from:pageUrl},handleServerResponse);
			});
		});
	
	};
})( jQuery );

