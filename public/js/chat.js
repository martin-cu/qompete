var e_trigger = '.tab_ta';
function responseTimeCalc(res, lvl) {
	var items = res.toLowerCase().replace(/[^a-z0-9-\s]+/, '').split(' ');
	items.filter(function(item) {
	  return item.split('').reverse().join('') === item;
	});
	
	return items.length * 0.12 * lvl * 1000;
}
function catResponse(chat) {
	var triggers = {
		greetings: { count: 0, arr: ['hello', 'hi'] },
		openings: { count: 0, arr: ['share', ''] },
		problems: { count: 0, arr: ['', ''] },
		questions: { count: 0, arr: ['doing?', 'free?'] }
	};
	var trigger_keys = Object.keys(triggers);
	var difficulty = 1;
	var response = '';
	var time;

	if (chat == null || chat == undefined) {
		response = 'What can I do for you? You can share anything with me :D';
		response = 'Hey Issha, it’s been a long time, since your last check-up. How are you?';
	}
	else {
		response = chat;
	}
	sendMsg('cat', responseTimeCalc(response, difficulty), response);
}

function typingAnim() {
	var div1, div2, img;

	div1 = document.createElement('div')
	div1.setAttribute('class', 'message anim d-flex mt-2');
	div2 = document.createElement('div');
	div2.setAttribute('class', 'chat-user-sm mr-2');
	img = document.createElement('img');
	img.setAttribute('class', 'rounded-pic-sm');
	img.setAttribute('src', '../img/catPic.jpg');

	div2.appendChild(img);
	div1.appendChild(div2);

	var div, span;

	div = document.createElement('div');
	div.setAttribute('class', 'typing-anim');

	for(var i = 0; i < 3; i++) {
		span = document.createElement('span');
		div.appendChild(span);
	}

	div1.appendChild(div);
	$('.msg-cont').append(div1);
}

function sendMsg(type, time, response) {
	var msg = $('#chat_ta').html();
	var cont = $('#msg-cont').children();
	cont = cont[cont.length-1];

	if (type == 'cat') {
		msg = response;
		typingAnim();
		setTimeout(function() {
			$('.anim').remove();
		}, time);

	}
	if ($(cont).hasClass(type)) {
		cont = $(cont).children();
		cont = cont[1];
		var div = document.createElement('div');
		if (type == 'mine')
			div.setAttribute('class', 'msg-box mine text-right ml-auto');
		else
			div.setAttribute('class', 'msg-box cat');

		div.innerHTML = msg;

		setTimeout(function() {
			$(cont).append($(div));
			$(".msg-cont").stop().animate({ scrollTop: $(".msg-cont")[0].scrollHeight}, 1000);
		}, time);
	}
	else {

		var msg_cont = document.createElement('div');
		var dp_cont = document.createElement('div');
		var dp = document.createElement('img');

		if (type == 'mine') {
			msg_cont.setAttribute('class', 'mine message d-flex flex-row-reverse mt-2');
			dp_cont.setAttribute('class', 'chat-user-sm ml-2');
			dp.setAttribute('src', '../img/girl-sad.png');
			dp.setAttribute('style', 'height: 26px; width:26px;background-color: white;border: black solid 1px;border-radius: 50%;');
		}
		else {
			dp = document.createElement('img');
			msg_cont.setAttribute('class', 'cat message d-flex mt-2');
			dp_cont.setAttribute('class', 'chat-user-sm mr-2');
			dp.setAttribute('class', 'rounded-pic-sm');
			dp.setAttribute('src', '../img/catPic.jpg');
		}

		dp_cont.appendChild(dp);
		msg_cont.appendChild(dp_cont);

		var div = document.createElement('div');

		if (type == 'mine')
			div.setAttribute('class', 'msg-box mine text-right ml-auto');
		else {
			div.setAttribute('class', 'msg-box cat')
		}
		div.innerHTML = msg;

		var cont_flex = document.createElement('div');
		cont_flex.setAttribute('class', 'd-block');
		cont_flex.appendChild(div);

		msg_cont.appendChild(cont_flex);

		setTimeout(function() {
			$('#msg-cont').append(msg_cont);
			$(".chat-body").stop().animate({ scrollTop: $(".chat-body")[0].scrollHeight}, 1000);
			$(".msg-cont").animate({ scrollTop: $(".msg-cont")[0].scrollHeight}, 1000);
		}, time);
	}

	$('#chat_ta').val('');
	$('#chat_ta').html('');

	if (type == 'mine') {
		$.post('/ajaxchat', { msg: msg }, function(err, data) {
			console.log(data);
		});
		$.get('/ajaxres'+msg, function(data) {
			if (data.cat_res != null) {
				setTimeout(function() {
					catResponse(data.cat_res);
				}, time);
			}
		});
	}
}

function toggleKeyboard(bool) {
	var og_height = $('.chat-body-cont, .menu-cont');
	og_height = og_height[0].offsetHeight;
	if (bool) {
		$('#keyboard').removeClass('hide');
		$('.chat-body, .menu-cont').css('height', og_height - 230);
	}
	else {
		$('#keyboard').addClass('hide');
		$('.chat-body, .menu-cont').css('height', og_height - 85);
	}
	$(".msg-cont").stop().animate({ scrollTop: $(".msg-cont")[0].scrollHeight}, 1000);
}

$(document).ready(function() {
	if (type == 'chat') {
		var div = document.querySelector('.ta-frame');
		var ta =  document.querySelector('textarea');

		ta.addEventListener('keydown', autosize);

		function autosize() {
		  setTimeout(function() {
		    ta. style.cssText = 'height:0px';
		    var height = Math.min(20 * 5, ta.scrollHeight);
		    div.style.cssText = 'height:' + height + 'px';
		    ta. style.cssText = 'height:' + height + 'px';
		  },0);
		}

	}

	$(document).on('click', function(e) {
		var target = e.target;
		var parent = target.parentElement;
		var t_target = parent.id || target.id || parent.parentElement.id;
		if (e.target.id == 'submit_btn') {
			if (!$('#submit_btn').hasClass('disabled')) {
				sendMsg('mine', 0);
				if (type == 'chat')
					autosize();
			}
		}
		else if (e.target.className == 'fa fa-plus-circle') {
			toggleKeyboard(true);
		}
		else if (e.target.id != 'submit_btn' && $('#chat_ta').is(':focus') == true) {
			toggleKeyboard($('#chat_ta').is(':focus'));
			e_trigger = '#chat_ta';
		}
		else if (t_target != 'k1' && t_target != 'k2' && t_target != 'k3' 
			&& t_target != 'k4' && t_target != 'keyboard')
			toggleKeyboard(false);
	});
	

	$('#chat_ta').on('DOMSubtreeModified', function() {
		if ($('#chat_ta').val() == ''  || $('#chat_ta').html() == '') {
			$('#submit_btn').addClass('disabled');
		}
		else {
			$('#submit_btn').removeClass('disabled');
		}
	});

	// if (!chatstart) {
	// 	catResponse();
	// }
	catResponse();
});