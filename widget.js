// widget.js

// person id, name i company tag
// dorzucic date ostatniego req do localstorage, 
// jesli ostatnia data mniejsza niz 20 min roznicy to nie rob req tylko 
const DEBUG = true;
const CSS = "";
// const ICON_BASE_64 = import from
const ICON = '<?xml version="1.0" encoding="iso-8859-1"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 356.484 356.484" style="enable-background:new 0 0 356.484 356.484;" xml:space="preserve"><g><g><path d="M293.984,7.23H62.5C28.037,7.23,0,35.268,0,69.731v142.78c0,34.463,28.037,62.5,62.5,62.5l147.443,0.001l70.581,70.58c2.392,2.393,5.588,3.662,8.842,3.662c1.61,0,3.234-0.312,4.78-0.953c4.671-1.934,7.717-6.49,7.717-11.547v-62.237c30.759-3.885,54.621-30.211,54.621-62.006V69.731C356.484,35.268,328.447,7.23,293.984,7.23z M331.484,212.512c0,20.678-16.822,37.5-37.5,37.5h-4.621c-6.903,0-12.5,5.598-12.5,12.5v44.064l-52.903-52.903c-2.344-2.345-5.522-3.661-8.839-3.661H62.5c-20.678,0-37.5-16.822-37.5-37.5V69.732c0-20.678,16.822-37.5,37.5-37.5h231.484c20.678,0,37.5,16.822,37.5,37.5V212.512z" /><path d="M270.242,95.743h-184c-6.903,0-12.5,5.596-12.5,12.5c0,6.903,5.597,12.5,12.5,12.5h184c6.903,0,12.5-5.597,12.5-12.5C282.742,101.339,277.146,95.743,270.242,95.743z" /><path d="M270.242,165.743h-184c-6.903,0-12.5,5.596-12.5,12.5s5.597,12.5,12.5,12.5h184c6.903,0,12.5-5.597,12.5-12.5S277.146,165.743,270.242,165.743z" /></g></g></svg>';
const ICON_LOADER = `<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="uil-reload"><rect x="0" y="0" width="100" height="100" fill="none" class="bk"/><g transform="rotate(302.901 50 50)"><path d="M50 15A35 35 0 1 0 74.787 25.213" fill="none" stroke="#ffffff" stroke-width="12px"/><path d="M50 0L50 30L66 15L50 0" fill="#ffffff"/></g></svg>`;
// get person and company data
const PERSON_ID = $("meta[name=person_id]").attr('content');
const COMPANY_TAG = $("meta[name=company_tag]").attr('content');
const BASE_PATH = `http://news.databridgecmms.com/api/news/${COMPANY_TAG}/${PERSON_ID}`;

// generate html base on news, if checkForNewsOnly = true then refresh list without building html
const renderWidget = function(news, checkForNewsOnly) {
    const renderStyles = function() {
            var _style = $(`<style type="text/css">${CSS}</style>`)
            $('head').append(_style);
        }
        // news list fixed wrapper
    console.log('checkForNewsOnly', checkForNewsOnly)
    if (news.length > 0) {
        if (checkForNewsOnly) {
            var _wrapper = $('.wwr');
            // remove existing list
            _wrapper.find('ul').remove();
            _wrapper.append('<ul></ul>');

            // append new elements
            news.map(function(elem, key) {
                setTimeout(function() {
                    _wrapper.find('ul').append(`<li><a href="${elem.url}" target="_blank"  title="Hey, we got new features for you!"><span>${key+1}.</span> ${elem.title}</a></div>`)
                }, 100 * key)
            })

            // add new status to get styles
            _wrapper.addClass('l');
            setTimeout(function() {
                _wrapper.removeClass('l')
            }, 1500)
        } else {

            $('.wwr').remove();

            // add styles
            renderStyles();

            // make wrapper
            var _wrapper = $('<div></div>').addClass('wwr l');
            // make link to crm
            var _toCMS = $(`<div class="wl"><a id="r">${ICON_LOADER}</a><a href="http://news.databridgecmms.com/" target="_blank" title="Hey, we got new features for you!"> Read <span class="hidden">New</span> News &rarr;</a></div>`);
            // make toggler
            var _toggler = $(`<div class="wt"><a  title="Hey, we got new features for you!">${ICON}</a></div>`);


            _wrapper.append(_toggler);
            _wrapper.append(_toCMS);
            _wrapper.append('<ul></ul>');

            news.map(function(elem, key) {
                _wrapper.find('ul').append(`<li><a href="${elem.url}" target="_blank"  title="Hey, we got new features for you!"><span>${key+1}.</span> ${elem.title}</a></div>`)
            })

            // add wrapper to DOM
            $('body').append(_wrapper);

            //events
            // toggle open wrapper
            $('.wt').on('click', function(e) {
                _wrapper.toggleClass('o');
                e.preventDefault();
                e.stopPropagation();
            })
            $('#r').on('click', function(e) {
                ajaxRequest(true)
            })

            // // hide on click outside wrapper
            $(document).mouseup(function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (!_wrapper.is(e.target) // if the target of the click isn't the container...
                    && _wrapper.has(e.target).length === 0) // ... nor a descendant of the container
                {
                    _wrapper.removeClass('o');
                } else {

                }
            });

            // stop loading state of widget
            setTimeout(function() {
                _wrapper.removeClass('l')
            }, 1500)
        }
    }
}

var ajaxRequest = function(onlyCheckingForNews) {
    const _onlyCheckingForNews = onlyCheckingForNews || false;
    var time_storage = JSON.parse(localStorage.getItem('widget.time_storage')) || 0;
    var news = JSON.parse(localStorage.getItem('widget.news')) || [];
    const time_diff = 1000 * 60 * 20; // 1000 * 1000 * 60 * 20;
    // console.log('cache', time_storage, news);

    if ((Date.now() - time_diff) > time_storage) {
        // if now is 20 min after saved time get ajax
        if (DEBUG) { console.log('widget ajax') }
        $.ajax({
                method: "GET",
                url: BASE_PATH
            })
            .done(function(data) {
                if (DEBUG) { console.log('widget data', data.news) }

                localStorage.setItem('widget.time_storage', Date.now());
                localStorage.setItem('widget.news', JSON.stringify(data.news));

                renderWidget(data.news, _onlyCheckingForNews);
                setInterval(() => {
                    if (DEBUG) { console.log('widget interval tick') }
                    renderWidget(data.news, true);
                }, 1000 * 60 * 20)
            })
            .fail(function(err) {
                if (DEBUG) { console.log('widget error', err); }
            })
    } else {
        // if now is 20 before saved time get from cache
        if (DEBUG) { console.log('widget cache', news) }
        renderWidget(news, _onlyCheckingForNews);
    }



}
var init = function() {
    if (DEBUG) { console.log('widget start') }
    ajaxRequest()
}
init();
