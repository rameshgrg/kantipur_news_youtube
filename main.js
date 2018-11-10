var search_param = {
	'channelId': 'UC3yDoaqQzOd1bNP74ZrGPTA',
	'maxResults': 50,
	'order': 'date',
	'publishedAfter': '',
	'publishedBefore': '',
	'q': 'Kantipur samachar',
	'type': 'video',
	'videoDuration': 'short',
	'key': 'replace with yours youtube key'
};

$(function () {
	var youtube_searcher = {
		d: new Date(),
		select_change: function () {
			var obj = this;
			// option button
			$('#day').change(function () {
				d = new Date();
				var date = this.value;
				if (date == "yesterday") {
					d.setDate(d.getDate() - 1);
					search_param.publishedBefore = obj.ISODateString(d).replace(/T..:..:..Z/, 'T23:59:59Z');
					$('#get_day').html(" Yesterday ");
				} else if (date == "lastweek") {
					cd = new Date();
					d.setDate(d.getDate() - 7);
					search_param.publishedBefore = obj.ISODateString(cd).replace(/T..:..:..Z/, 'T23:59:59Z');
					$('#get_day').html(" Last Week ");
				}else{
					$('#get_day').html(d);
				}

				search_param.publishedAfter = obj.ISODateString(d).replace(/T..:..:..Z/, 'T00:00:00Z');

				var url = obj.adjust_api_url();
				obj.call_api(url);
			});
		},
		call_api: function (url) {
			
			var results = [];
			var html = '';

			$('#result').html('');
			
			$.ajax({
				url: url,
				success: function (d) {
					var video = {};
					$(d.items).each(function (i, item) {
						var video = {
							'title': item.snippet.title,
							'description': item.snippet.description,
							'url': 'https://www.youtube.com/embed/' + item.id.videoId
						}
						results.push(video);
						var iframe = '<iframe src="' + video.url + '" frameborder="0" allowfullscreen></iframe>';
						var h = '<div class="box"><span class="image fit" >' + iframe + '</span><div class="inner">\
								<h3>' + video.title + '</h3>\
								<p>' + video.description + '</p>\
								</div>\
								</div>';
						html += h;
					});
					if(d.items.length == 0){
						counts = "No result/s found, please visit later!";
					}else{
						counts = d.items.length + " result/s found!";
					}
					$('#result-count').html(counts);
					$('#result').html(html);
				},
				async: false
			});
		},
		prepare: function () {
			var d = new Date();
			$('#today').html(d);
			// console.log(ISODateString(d)); // prints something like 2009-09-28T19:03:12Z
		},
		ISODateString: function (d) {
			function pad(n) {
				return n < 10 ? '0' + n : n
			}
			return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()) + 'T' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds()) + 'Z';
		},
		adjust_api_url: function () {
			var url = 'https://www.googleapis.com/youtube/v3/search?' + 'part=snippet' + '&channelId=' + search_param.channelId + '&maxResults=' + search_param.maxResults + '&order=' + search_param.order + '&publishedAfter=' + search_param.publishedAfter + '&publishedBefore=' + search_param.publishedBefore + '&q=' + search_param.q + '&type=' + search_param.type + '&videoDuration=' + search_param.videoDuration + '&key=' + search_param.key;
			return url;
		},
		init: function () {
			var obj = this;

			var d = obj.d;
			$('#get_day').html(d);
			
			search_param.publishedAfter = obj.ISODateString(d).replace(/T..:..:..Z/, 'T00:00:00Z');
			search_param.publishedBefore = obj.ISODateString(d).replace(/T..:..:..Z/, 'T23:59:59Z');
			
			var url = obj.adjust_api_url();
			obj.call_api(url);

			obj.select_change();
		}
	}.init();;
});