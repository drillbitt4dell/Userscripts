// ==UserScript==
// @name        RARBG - convert torrent timestamps to relative format
// @namespace   darkred
// @version     2020.03.06
// @description Converts torrent upload timestamps to relative format
// @author      darkred
// @license     MIT
// @include     /^(https?:)?\/\/(www\.)?(proxy|unblocked)?rarbg((2018|2019|2020|2021)?|access(ed)?|core|data|enter|get|go|index|mirror(ed)?|p2p|prox(ied|ies|y)|prx|to(r|rrents)?|unblock(ed)?|way|web)\.(to|com|org|is)\/(torrents\.php.*|catalog\/.*|tv\/.*|top10)$/
// @grant       none
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js
// ==/UserScript==


/* global moment */

// Customize the strings in the locale to display "1 minute ago" instead of "a minute ago" (https://github.com/moment/moment/issues/3764#issuecomment-279928245)
moment.updateLocale('en', {
	relativeTime: {
		future: 'in %s',
		past:   '%s ago',
		s:  'seconds',
		m:  '1 minute',
		mm: '%d minutes',
		h:  '1 hour',
		hh: '%d hours',
		d:  '1 day',
		dd: '%d days',
		M:  '1 month',
		MM: '%d months',
		y:  '1 year',
		yy: '%d years'
	}
});


function convertToLocalTimezone(timestamps) {
	for (let i = 0; i < timestamps.length; i++) {
		let initialTimestamp = timestamps[i].textContent;
		// if (moment(initialTimestamp, 'YYYY-MM-DD HH:mm:ss').isValid()) {
		if (moment(initialTimestamp, 'YYYY-MM-DD HH:mm:ss', true).isValid()) {		// As of moment.js v2.3.0, you may specify a boolean for the last argument to make Moment use strict parsing. Strict parsing requires that the format and input match exactly, including delimeters.
			let convertedToLocalTimezone = moment(initialTimestamp + '+01:00', 'YYYY-MM-DD HH:mm:ss Z');	// The server time is GMT+1
			timestamps[i].textContent = convertedToLocalTimezone.fromNow();
			// let format = 'MM/DD/YYYY HH:mm:ss';
			let format = 'YYYY-MM-DD HH:mm:ss';
			timestamps[i].title = convertedToLocalTimezone.format(format);
			// timestamps[i].title = convertedToLocalTimezone.toISOString(); // 			// Display timestamps in tooltips in ISO 8601 format, combining date and time  (https://stackoverflow.com/questions/25725019/how-do-i-format-a-date-as-iso-8601-in-moment-js/)
			// timestamps[i].title = convertedToLocalTimezone.format();
		}
	}

	// recalculate the relative times every 10 sec
	(function(){
		for (let i = 0; i < timestamps.length; i++) {
			timestamps[i].textContent = moment(timestamps[i].title).fromNow();
		}
		setTimeout(arguments.callee, 1 * 60 * 1000);
	})();

}

// const timestamps = document.querySelectorAll('tr.lista2 td:nth-child(3)');
const timestamps = document.querySelectorAll('td[width="150px"]');
convertToLocalTimezone(timestamps);
