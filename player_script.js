function Video_player(opt){;
	/* check jquery library */
	if(typeof $ == "undefined"){
	alert("Please insert jQuery library!");
	return;
	}
	/* variables */
	if(typeof opt.player_list == "undefined"){
	return;
	}
	var files = [];
	var titles = [];
	var descriptions = [];
	var images = [];
	var html_ = "";
	var video_count = 1;
	var scroll_step = 0;
	var list_item;
	var list_item_desktop = 7;
	var list_item_mobile = 4;
	var item_height = 50;
	var player = $(opt.player_container);
	var width_ = player.width();
	var ratio = opt.player_ratio.split(':');
	ratio = ratio[1]/ratio[0];
	var autocontinue;
	/* read options */
	for(var i=0; i<opt.player_list.length; i++){
	files.push(opt.player_list[i].file);
	titles.push(opt.player_list[i].title);
	descriptions.push(opt.player_list[i].description);
	images.push(opt.player_list[i].image); 
	}
	/* create html */
	html_ += '<div class="Admin855_player">';
	html_ += '<div class="Admin855_video"><span class="Admin855_loading"></span>';
	html_ += '<iframe id="video_player" src="" frameborder="0" allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe>';
	html_ += '<div class="Admin855_server" id="videoPlayerUniq"></div>';
	html_ += '</div>';
	html_ += '<div class="Admin855_videos">';
	html_ += '<ul class="Admin855_list"></ul>';
	html_ += '<div class="Admin855_control">';
	html_ += '<span class="Admin855_prevPage Admin855_btn"><i class="fa fa-chevron-left"></i><i class="fa fa-chevron-left"></i><span> prevPage</span></span>';
	html_ += '<span class="Admin855_prev Admin855_btn"><i class="fa fa-chevron-left"></i><span> prev</span></span>';
	html_ += '<span class="Admin855_next Admin855_btn"><span>next </span><i class="fa fa-chevron-right"></i></span>';
	html_ += '<span class="Admin855_nextPage Admin855_btn"><span>nextPage </span><i class="fa fa-chevron-right"></i><i class="fa fa-chevron-right"></i></span>';
	html_ += '</div>';
	html_ += '</div>';
	html_ += '</div>';
	player.html(html_);
	/* is youtube */
	function is_youtube(video_link){
	if(video_link.indexOf('watch?v')>-1){
	return video_link.substring(video_link.indexOf("?v=")+3);
	}else if(video_link.indexOf('youtube')>-1 || video_link.indexOf('youtu.be')>-1){
	return video_link.substring(video_link.lastIndexOf("/")+1);
	}
	return false;
	}
/* create list */
html_ = '';
for(var i=0; i<titles.length; i++){
	html_ += '<li>';
	html_ += '<img style="width: 80px !important; height: 50px !important; " src="';
	if(is_youtube(files[i])){
		html_ += 'http://img.youtube.com/vi/'+ is_youtube(files[i])+'/1.jpg';
	}else if(files[i].indexOf("vimeo")>-1){
		html_ += '';
	}else if(files[i].indexOf("google")>-1){
		html_ += 'https://4.bp.blogspot.com/-9qRTTs9T1Ng/WSoqrSd_57I/AAAAAAAABxQ/FzacUS5AWbAbhy3hHNxQ8A7HRwa0drSNwCLcB/s1600/r.png';		}else if(files[i].indexOf("vid")>-1){
		html_ += 'https://4.bp.blogspot.com/-9qRTTs9T1Ng/WSoqrSd_57I/AAAAAAAABxQ/FzacUS5AWbAbhy3hHNxQ8A7HRwa0drSNwCLcB/s1600/r.png';		
	
	}else{
		html_ += images[i];
	}
	html_ += '" />';
	html_ += '<div>';
	html_ += '<h2 style="text-align:left;">';
	html_ += '<i class="fa ';
	if(is_youtube(files[i])){
	html_ += 'fa-youtube';
	}else if(files[i].indexOf("vimeo")>-1){
	html_ += 'fa-vimeo-square';
	}else if(files[i].indexOf("google")>-1){
	html_ += 'fa-cloud-upload';
	}else if(files[i].indexOf("sd")>-1){
	html_ += 'fa-server';
	}
	else if(files[i].indexOf("vid")>-1){
	html_ += 'fa-facebook-square';
	}
	else{
	html_ += 'fa-file';
	}
	html_ += '';
	html_ += '"></i> ';
	html_ += titles[i]+'</h2>';
	html_ += '';
	html_ += '</div>';
	html_ += '</li>';
	}
	player.find('.Admin855_list').html(html_);
	for(var i=0; i<titles.length; i++){
	if(files[i].indexOf("vimeo")>-1){
	$.ajax({
	type:'GET',
	url: 'http://vimeo.com/api/v2/video/' + files[i].substring(files[i].lastIndexOf("/")+1) + '.json',
	jsonp: 'callback',
	dataType: 'jsonp',
	indexValue: i,
	success: function(data){; 
	var thumbnail_src = data[0].thumbnail_large;
	player.find('.Admin855_list').find('li').eq(this.indexValue).find('img').attr('src',thumbnail_src);
	}
	});
	//console.log('http://vimeo.com/api/v2/video/' + files[i].substring(files[i].lastIndexOf("/")+1) + '.json') 
	}
	} 
	//vimeo detect when video is end
	$.getScript('https://content.jwplatform.com/libraries/z1ykQ9er.js'); 
	//vimeo detect when video is end
	$.getScript('https://f.vimeocdn.com/js/froogaloop2.min.js'); 
	//youtube detect when video is end
	$.getScript('https://www.youtube.com/iframe_api');
	var youtube_end_load = false;
	function youtube_end(){ 
	youtube_end_load = true;
	new YT.Player('video_player', {
	events: {
	'onStateChange': function onPlayerStateChange(event) {
	switch(event.data) {
	case YT.PlayerState.ENDED:
	autocontinue = true;
	autocontinue_next();
	//console.log('Youtube is ended.');
	break;
	} 
	}
	}
	});
	}
	window.onYouTubeIframeAPIReady = function () {
	youtube_end();
	}
	var list = [];
	/* load video */
	function load_video(video, num){
	var video_url = video;
	player.find('.Admin855_server').find('video').remove();
	player.find('.Admin855_server').hide();
	player.find('iframe').attr('src','').hide(); 
	player.find('.Admin855_loading').show();
	if(is_youtube(video)){
	/* youtube */ 
	video_url = "http://www.youtube.com/embed/"+is_youtube(video)+"?autoplay=0&loop=1&showinfo=0&rel=0&enablejsapi=1";
	if(autocontinue){ 
	video_url = "http://www.youtube.com/embed/"+is_youtube(video)+"?autoplay=1&loop=1&showinfo=0&rel=0&enablejsapi=1";
	}
	player.find('iframe').attr('src',video_url).show(); 
	if(youtube_end_load){
	youtube_end();
	}
	}else if(video.indexOf("vimeo")>-1){
	/* vimeo */ 
	video_url = "https://player.vimeo.com/video/"+video.substring(video.lastIndexOf('/')+1);
	if(autocontinue){
	player.find('iframe').attr('src',video_url+"?api=1&amp;player_id=video_player&amp;autoplay=1").show();
	}else{
	player.find('iframe').attr('src',video_url+"?api=1&amp;player_id=video_player").show();
	}
	if(typeof (player.find('iframe')[0]).addEvent != "undefined"){
	(player.find('iframe')[0]).addEvent('ready', function(player_id) {
	(player.find('iframe')[0]).addEvent('finish', function(){
	autocontinue = true;
	autocontinue_next();
	//console.log("Vimeo is ended");
	});
	});
	}
	}
	/* else if (video.indexOf("googleusercontent")>-1 || video.indexOf("genmoviehd")>-1 ){
	html_ = '';
	if(autocontinue){
	html_ += '<video width="100%" height="100%" controls autoplay>';
	}else{
	html_ += '<video width="100%" height="100%" controls>';
	}
	html_ += '<source src="'+video_url.replace('.ogg','.mp4')+'" type="video/mp4">';
	html_ += '<source src="'+video_url.replace('.mp4','.ogg')+'" type="video/ogg">';
	html_ += '</video>';
	player.find('.Admin855_server').show().html(html_);
	player.find("video").bind("ended", function(){
	autocontinue = true;
	autocontinue_next();
	//console.log("Server is ended");
	});
	}*/
	else if (video.indexOf("googleusercontent")>-1 || video.indexOf("genmoviehd")>-1 ){
	html_ = '';
	if(autocontinue){
	html_ += '<video id="Myplayer-' + num + '" class="video-js vjs-default-skin" width="100%" height="100%" controls autoplay>';
	}else{
	html_ += '<video id="Myplayer-' + num + '" class="video-js vjs-default-skin" width="100%" height="100%" controls>';
	}
	html_ += '<source src="'+video_url.replace('.ogg','.mp4')+'" type="video/mp4">';
	html_ += '<source src="'+video_url.replace('.mp4','.ogg')+'" type="video/ogg">';
	html_ += '</video>';
	player.find('.Admin855_server').show().html(html_);
	player.find("video").bind("ended", function(){
	autocontinue = true;
	autocontinue_next();
	//console.log("Server is ended");
	});
	if (list.indexOf(num) > -1){
	videojs('Myplayer-' + num).dispose();
	}
	else{
	list.push(num);
	}
	videojs('Myplayer-' + num);
	/* server */
	/*( setTimeout(function (){
	jwplayer('videoPlayerUniq').setup({
	file: video,
	});
	}, 1200);*/
	}
	else if(video.indexOf("google")>-1 /* && false*/){ 
	/* google */ 
	player.find('iframe').attr('src',video_url).show(); 
	}
	else if(video.indexOf("sd")>-1){ 
	/* sd */ 
	player.find('iframe').attr('src',video_url).show(); 
	}
	else if(video.indexOf("vid")>-1){ 
	/* vid */ 
	player.find('iframe').attr('src',video_url).show(); 
	}
	else{
	/* server */
	html_ = '';
	if(autocontinue){
	html_ += '<video width="100%" height="100%" controls autoplay>';
	}else{
	html_ += '<video width="100%" height="100%" controls>';
	}
	html_ += '<source src="'+video_url.replace('.ogg','.mp4')+'" type="video/mp4">';
	html_ += '<source src="'+video_url.replace('.mp4','.ogg')+'" type="video/ogg">';
	html_ += '</video>';
	player.find('.Admin855_server').show().html(html_);
	player.find("video").bind("ended", function(){
	autocontinue = true;
	autocontinue_next();
	//console.log("Server is ended");
	});
	}
	player.find('iframe').load(function(){
	player.find('.Admin855_loading').hide();
	});
	}
	/* change video */
	player.find('.Admin855_list').click(function(){
	autocontinue = true;
	});
	player.find('.Admin855_list').find('li').outerHeight(item_height);
	player.find('.Admin855_list').find('li').each(function(num){
	$(this).click(function(){ 
	video_count = num;
	if(player.find('.Admin855_list').find('li').eq(num).hasClass('selected')){return;};
	player.find('.Admin855_list').find('li').removeClass('selected').eq(num).addClass('selected');
	load_video(files[num], num); 
	select();
	});
	});
	/* select video */
	function select(){
	if(video_count>0){
	player.find('.Admin855_prev').addClass('active');
	}else{
	player.find('.Admin855_prev').removeClass('active');
	}
	if(video_count<files.length-1){
	player.find('.Admin855_next').addClass('active');
	}else{
	player.find('.Admin855_next').removeClass('active');
	}
	}
	select();
	/* size */
	function size(){
	if($(window).width()<opt.player_mobile_on_width || !opt.automatic_response){ 
	list_item = list_item_mobile;
	if(opt.automatic_response){
	player.width($(window).width());
	}
	player.removeClass('Admin855_desktop');
	player.find('.Admin855_list').height(list_item*(item_height));
	player.find('.Admin855_video').height(player.find('.Admin855_video').width()*ratio);
	player.find('.Admin855_video').width('100%'); 
	player.find('.Admin855_videos').width('100%'); 
	}else{
	list_item = list_item_desktop;
	player.addClass('Admin855_desktop');
	player.width(width_);
	player.find('.Admin855_list').height(list_item*(item_height-0.8));
	player.find('.Admin855_video').height(player.find('.Admin855_videos').outerHeight());
	player.find('.Admin855_video').css('width',opt.player_desktop_video_width); 
	player.find('.Admin855_videos').css('width',100-parseInt(opt.player_desktop_video_width)+'%');
	} 
	}
	$(window).resize(function(){
	size();
	}); 
	size();
	/* scroll */
	function scroll(t){
	if(t.scrollTop()>0){
	player.find('.Admin855_prevPage').addClass('active');
	}else{
	player.find('.Admin855_prevPage').removeClass('active');
	}
	if(t[0].scrollHeight >= t.outerHeight()+t.scrollTop()+5){
	player.find('.Admin855_nextPage').addClass('active');
	}else{
	player.find('.Admin855_nextPage').removeClass('active');
	}
	}
	player.find('.Admin855_list').scroll(function(){
	scroll($(this));
	});
	scroll(player.find('.Admin855_list'));
	/* view */
	function view(direction){
	var viewTop = player.find('.Admin855_list').scrollTop();
	var viewBottom = viewTop + player.find('.Admin855_list').outerHeight();
	var elTop = player.find('.Admin855_list').find('li').eq(video_count).offset().top-player.find('.Admin855_list').find('li').eq(video_count).parent().offset().top;
	var elBottom = elTop + player.find('.Admin855_list').find('li').eq(video_count).outerHeight();
	if((elBottom+viewTop+10 >= viewBottom+player.find('.Admin855_list').find('li').eq(video_count).outerHeight())||(elBottom < 1)){
	scroll_step = video_count*(item_height);
	if(direction == 'prev'){
	scroll_step = (video_count-list_item+1)*(item_height);
	}
	player.find('.Admin855_list').animate({scrollTop:scroll_step},500);
	}
	return true;
	}
	/* CONTROL BUTTONS */
	/* prevPage */
	player.find('.Admin855_prevPage').click(function(){
	if($(this).hasClass('active')){
	scroll_step = player.find('.Admin855_list').scrollTop()-list_item*player.find('.Admin855_list').find('li').outerHeight();
	scroll_step = Math.ceil(scroll_step/item_height);
	player.find('.Admin855_list').animate({scrollTop:scroll_step*(item_height)},500);
	}
	});
	/* prev */
	player.find('.Admin855_prev').click(function(){
	if(video_count>0){
	video_count--; 
	select();
	view('prev');
	player.find('.Admin855_list').find('li').eq(video_count).trigger('click');
	}
	});
	/* next */
	player.find('.Admin855_next').click(function(){
	if(video_count<files.length-1){
	video_count++;
	select(); 
	view('next'); 
	player.find('.Admin855_list').find('li').eq(video_count).trigger('click');
	}
	});
	/* nextPage */
	player.find('.Admin855_nextPage').click(function(){
	if($(this).hasClass('active')){
	scroll_step = player.find('.Admin855_list').scrollTop()+list_item*item_height;
	scroll_step = Math.ceil(scroll_step/item_height);
	player.find('.Admin855_list').animate({scrollTop:scroll_step*(item_height)},500);
	}
	});
	player.find('.Admin855_list').animate({scrollTop:0},10);
	player.find('.Admin855_list').find('li').eq(0).trigger('click');
	$(document).ready(function(){
	$('script[src^="https://dl.dropboxusercontent.com/u/52062348/Admin855jv.js"]').remove();
	});
	function autocontinue_next(){
	if(video_count<files.length-1){
	video_count++;
	select(); 
	view('next'); 
	player.find('.Admin855_list').find('li').eq(video_count).trigger('click');
	}
	}
	}
	var timer = setInterval(function(){
	if(typeof options != 'undefined'){
	new Video_player(options);
	clearInterval(timer);
	} 
	},50);
	
