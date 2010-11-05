/**
 * jQuery.fn.ajaxLeftovers
 * 
 * Authors :
 *      Alexandre Paquette (alexandre.paquette@nadrox.com)
 *      Mathieu Sylvain (mathieu.sylvain@nurun.com)
 * 
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
 *     - The url of the current page calling the connector
 *
 * Server listener response should be a valid json string
 * containing an array of the following object:
 *     - selector        string    (optionnal) Contains a jquery valid selector
 *                            to target the content to be updated. May be
 *                            ommited if the "script" parameter is present
 *
 *  - content        string    The HTML that is used to update the
 *                             targetted content
 *
 * - updateMethod     string    (optionnal) Dictate how to update the
 *                             targetted content. Valid options are
 *                             "replace" (default behavior) or "append"
 * - script         string    (optional) A javascript expression to call
 *                             using eval()
 */
/*global jQuery, window, document */
/*jslint white: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true */
(function ($) {
    jQuery.fn.ajaxLeftovers = function (options) {
        var settings = {},
                pageUrl;
        $.extend(settings, options);
        // retrieve the meta value "leftovers-connector" to create the ajax request
        pageUrl = document.location.href;
        //
        this.each(function () {
            var serverUrl = this.href;
            $.getJSON(serverUrl, {from: pageUrl}, handleServerResponse);
        });

    };

    /*
    * utility method to handle the response payload
    */
    function handleServerResponse(data) {
        var i,
            target,
            item,
            selector;
        for (i in data) {
            if (data.hasOwnProperty(i)) {
                item = data[i];
                selector = item.selector;
                target = $(selector);
                if (typeof selector !== "undefined") {
                    if (typeof item.updateMethod === "undefined" ||
                            item.updateMethod === "replace") {
                        target.html(item.content);
                    } else if (item.updateMethod === "append") {
                        target.append(item.content);
                    }
                }
                if (typeof item.script !== "undefined") {
                    eval('(' + item.script + ')');
                }
            }
        }
    }

    /*
    Initialize the the events for automaticly bound connectors
     */
    $(window).load(function () {
       $("link[rel='leftovers-connector'].auto").each(function (){
           $(this).ajaxLeftovers();
       });
    });

}(jQuery));

