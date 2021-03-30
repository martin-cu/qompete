function consolidateForm() {
	var rose = $('.rose_tab li'), thorn = $('.thorn_tab li'), bud = $('.bud_tab li');
	var arr = [];

	for (var i = 0; i < $(rose).length; i++) {
		var str = $(rose[i]).children()[0];
		arr.push($(str).val());
	}
	$('#journalForm').attr('action', $('#journalForm').attr('action')+'?rose='+arr.join(','));
	arr = [];

	for (var i = 0; i < $(thorn).length; i++) {
		var str = $(thorn[i]).children()[0];
		arr.push($(str).val());
	}
	$('#journalForm').attr('action', $('#journalForm').attr('action')+'&&thorn='+arr.join(','));
	arr = [];

	for (var i = 0; i < $(bud).length; i++) {
		var str = $(bud[i]).children()[0];
		arr.push($(str).val());
	}
	$('#journalForm').attr('action', $('#journalForm').attr('action')+'&&bud='+arr.join(','));

	$('#journalForm').submit();
}

function clearTabs() {
	$('.rose_tab li, .thorn_tab li, .bud_tab li').remove();

	setTimeout(function() {
 		$('.mood_tab .active').removeClass('active');

 		$('.mood_tab input:checked').prop('checked', false);
	}, 1000);
}

function appendRTB(target, data, type) {
	if (type == 'tabs') {
		for (var i = 0; i < data.length; i++) {
			$($(target).children()[3]).append('<li><input class="tab_ta w-100" type="text" name="" value="'+data[i].content+'"></li>');
		}
	}
	else {
		var cont = $($($(target)).children()[1]).children();
		var str = '';
		for (var i = 0; i < data.length; i++) {
			str += '<li>'+data[i].content+'</li>';
		}
		$($(cont[cont.length-1]).children()[0]).append(str);
	}
}

function appendMoods(data, type) {
	if (type == 'tabs') {
		var table = $('.mood_tab').children()[1];
		var tr, td, inp;
		for (var i = 0; i < $(table).children().length; i++) {
			tr = $(table).children()[i];
			td = $(tr).children()[0];
			inp = $(td).children()[0];
			
			for (var x = 0; x < data.length; x++) {
				if ($(inp).val() == data[x].mood_id) {
					$(tr).addClass('active');
					$(inp).prop('checked', true);
				}
			}
		}
	}
	else {
		var table = '<table style="margin-left:-30px;">';
		var t;
		for (var i = 0; i < data.length; i++) {
			if (data[i] != '')
				t = '../img/'+data[i].img_url;
			else 
				t = '';

			if (i % 5 == 0) {
				table += '<tr>';
			}
			table += '<td class="py-1"><div class="d-block indiv_mood"><div class="w-100 mx-auto text-center"><img src="'+t+'"></div><div class="text-center">'+data[i].mood_name+'</div></div></td>';
		
			if (i % 5 == 0 && i != 0) {
				table += '</tr>';
			}
		}

		table += '</table>';

		var cont = $('.moods .d-flex .flex-column').children();

		$(cont[cont.length-1]).append(table);
	}
}

function clearDiary() {
	$('.moods .content table, .rose .content li,.thorn .content li,.bud .content li').remove();
}

function ajaxDiary(date) {
	clearDiary();

	$.get('/ajaxGetDiary', { date: date }, function(data) {

		var arr = data.diary;
		appendMoods(arr.mood, 'cont');
		appendRTB('.rose', arr.rose, 'cont');
		appendRTB('.thorn', arr.thorn, 'cont');
		appendRTB('.bud', arr.bud, 'cont');
	});
}

$(document).ready(function() {
	$('.notes, .moods, .rose, .thorn, .bud').on('click', function() {
		var arr = ['notes', 'moods', 'rose', 'thorn', 'bud'];
		var arr1 = ['note_tab', 'mood_tab', 'rose_tab', 'thorn_tab', 'bud_tab'];
		for (var i = 0; i < arr.length; i++) {
			if ($(this).attr('class') == arr[i] && !$('.journal-menu').hasClass('slide-in')) {
				var day = $('.table td .active').html().split('<');
				day = day[0]
				var month = $('#month').html();
				var year = $('#year').html();

				$.get('/ajaxGetDiary', { date: new Date(month+' '+day+' '+year) }, function(data) {
					var arr = data.diary;
					appendMoods(arr.mood, 'tabs');
					appendRTB('.rose_tab', arr.rose, 'tabs');
					appendRTB('.thorn_tab', arr.thorn, 'tabs');
					appendRTB('.bud_tab', arr.bud, 'tabs');
				});

				$('.journal-menu').addClass('slide-in');
				$('.journal').addClass('fade-out');
				for (var x = 0; x < arr1.length; x++) {
					if (i == x) {
						$('.menu-tabs .'+arr1[x]).addClass('active');
						$('.'+arr1[x]).removeClass('hide');
					}
					else {
						$('.menu-cont .'+arr1[x]).addClass('hide');
						$('.menu-tabs .'+arr1[x]).removeClass('active');
					}
				}
			}
		}
	});
	$('.calendar td div').not('.dot').on('click', function() {
		var val = $($(this).parent()).children().html();
		val = val.split('<');
		val = val[0];

		$('td .active').removeClass('active');
		$($(this).parent()).children().addClass('active');

		var day = $('.table td .active').html().split('<');
		day = day[0];
		var month = $('#month').html();
		var year = $('#year').html();
		var m = new Date(year+'-'+month+'-'+day);
		m = m.getMonth()+1;

		if (m <= 9)
			m = '0'+m.toString();
		else
			m = m.toString();

		if (day <= 9)
			day = '0'+day.toString();
		else
			day = day.toString();

		$('#date').val(year+'-'+m+'-'+day);
		$('.calendar-notes .details div:nth-child(1)').html(val+' Mar');
		$('.calendar-notes .details div:nth-child(2)').html((parseInt(val)+59)+'/365');

		ajaxDiary(new Date(month+' '+day+' '+year));
	})

	$('.calendar-notes .tabs div').on('click', function() {
		$('.calendar-notes .tabs .active').removeClass('active');
		$(this).addClass('active');

		if (!$(this).hasClass('diary')) {
			$('#detail_cont1').addClass('hide');
			$('#detail_cont2').removeClass('hide');
		}
		else {
			$('#detail_cont1').removeClass('hide');
			$('#detail_cont2').addClass('hide');
		}
	});

	$('.mood_tab tr').on('click', function() {
		var inp = $($(this).children()[0]).children()[0];
		$(inp).prop('checked', !$(inp).prop('checked'));
		if($(this).hasClass('active'))
			$(this).removeClass('active');
		else
			$(this).addClass('active');
	});

	$('.note_tab, .mood_tab, .rose_tab, .thorn_tab, .bud_tab').on('click', function() {
		var arr = ['note_tab', 'mood_tab', 'rose_tab', 'thorn_tab', 'bud_tab'];
		for (var i = 0; i < arr.length; i++) {
			if ($(this).hasClass(arr[i]) && $('.journal-menu').hasClass('slide-in')) {
				$('.menu-tabs .'+arr[i]).addClass('active');
				$('.'+arr[i]).removeClass('hide');
			}
			else  {
				$('.menu-cont .'+arr[i]).addClass('hide');
				$('.menu-tabs .'+arr[i]).removeClass('active');
			}
		}
	});

	$('.menu-cont .fa-plus-circle').on('click', function() {
		var ul = $(this).parent().children()[2];
		var length = $(ul).children().length;
		$(ul).append('<li><input class="tab_ta w-100" type="text" name="" value=""></li>');
		e_trigger = $(ul).children()[length];
	});

	$('.menu-tab-close').on('click', function() {
		$(this).parent().parent().removeClass('slide-in');
		$('.journal').removeClass('fade-out');
	});

	$('#addReminder').on('click', function() {
		$('.reminder-menu').addClass('slide-in');
		$('.journal').addClass('fade-out');
	});

	if (marked != '') {
		var td = $('#journal-calendar td > div');
		var str = '';
		for (var i = 0; i < td.length; i++) {
			str = $(td[i]).html();
			str = str.replace(/\D/g,'');
			for (var x = 0; x < marked.length; x++) {
				if (marked[x] == str) {
					$(td[i]).html(str+'<div class="dot"></div>')
				}
			}
		}
	}
});