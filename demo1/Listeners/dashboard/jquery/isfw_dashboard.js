var resultRootDir = "test-results";
var curResultDir = "";
var layout;
var treports;
var refreshInterval = 10000;
var interuptLoading = false;
var inprogress = false;
var chainedcls, chainedtests;
var length =0 ;
var split;
var url;

var timer = $.timer(function() {
	$('#reportlist').html('');
	loadList(true);

}, refreshInterval, false);

var pageLayout;

$(document).ready(function() {

	$("#reportlist_scroll").mCustomScrollbar({
		scrollButtons : {
			enable : true
		},
		theme : "dark-thin",
		autoDraggerLength : false,
		advanced : {
			updateOnContentResize : true,
			updateOnBrowserResize : false
		}
	});
	// create page layout
	pageLayout = $('body').layout({
		// west__onresize : initPaneScrollbar,
		defaults : {
			padding : 0,
			margin : 0
		},
		north : {
			size : 80,
			spacing_open : 0,
			closable : false,
			resizable : false
		},
		west : {
			size : 250,
			spacing_closed : 22,
			togglerLength_closed : 140,
			togglerAlign_closed : "center",
			togglerContent_closed : "R<BR>e<BR>p<BR>o<BR>r<BR>t<BR>s",
			togglerTip_closed : "Open & Pin Reports",
			sliderTip : "Slide Open Reports",
			slideTrigger_open : "mouseover"
		}
	});
	loadList();

	$(".environment_info .title_bg").click(function(event) {
		$(this).toggleClass('expanded');
		$(this).toggleClass('collapse');
	});

	$('#refreshBtn').click(function() {
		timer.toggle();
		$("#refreshBtn").toggleClass('nav-toggle');
		$("#refreshBtn").toggleClass('nav-toggle-active');
	});
	$("#stop").button({
		text : false,
		icons : {
			primary : "ui-icon-stop"
		}
	});
	$('#stop').click(function() {
		$.ajaxQueue.stop();
		$('#loading-info').hide(1000);
		setChecked('#oexpand', false);
		setChecked('#ocollapse', false);
	});
	$('#loading-info').hide();

});

function getResultRootDir() {
	return resultRootDir;
}
function progress(percent, $element) {
	var progressBarWidth = percent * $element.width() / 100;
	$element.animate({
		width : progressBarWidth
	}, 500).html(percent + "%&nbsp;");
}

function loadList() {
	loadList(false);
}

/**
 * left panel : list of all reports
 */
function loadList(loadmethods) {
	return $.getJSON(getResultRootDir() + "/meta-info.json", function(data) {
		treports = data;
		var size = treports.reports.length;
		$.each(treports.reports, function(i, item) {
			item['jobid'] = size--;
			$("#listTemplate").tmpl(item).appendTo("#reportlist");
		});
		$('#reportlist li').click(function() {
			$('#details').html('');
			if (($(this).hasClass('selected'))) {
				return 0;
			}
			var curSelceteReport = $('#reportlist li.selected');
			if (curSelceteReport) {
				$(curSelceteReport).removeClass("selected");
				$(curSelceteReport).addClass("active");
			}
			$(this).addClass("selected");
			$(this).removeClass("active");
			curResultDir = removePrefixOfResultRootDir($(this).attr("dir"));
			loadOverview(removePrefixOfResultRootDir($(this).attr("dir")));
			showOverview($("#overview-tab"));
		});

		if (loadmethods) {
			$('#details').html('');
			var curSelceteReport = $('#reportlist li.selected');
			if (curSelceteReport) {
				$(curSelceteReport).removeClass("selected");
				$(curSelceteReport).addClass("active");
			}
			$("#reportlist li:first").addClass("selected");
			$("#reportlist li:first").removeClass("active");
			curResultDir = $("#reportlist li:first").attr("dir");
			loadAllMethods($("#reportlist li:first").attr("dir"));
		} else {
			selectReport();
		}
	});

}


function selectReport() {
	
	var url = window.location.href;
	split = url.split("#");
	length = split.length;
	if (length> 1) {
		if($('#job_' + split[1]).children('li').length)       
		{
			$('#job_' + split[1]).children('li').trigger('click');
		}else{
			 $("#reportlist li:first").trigger('click');
		}
	}else{
		 $("#reportlist li:first").trigger('click');
	}

}

function removePrefixOfResultRootDir(dir){
	var index=dir.indexOf(resultRootDir);
	return dir.substr(index,dir.length);
}

function loadListAll() {
	return $.getJSON(getResultRootDir() + "/meta-info.json", function(data) {

		$('#details').html('');
		var curSelceteReport = $('#reportlist li.selected');

		if (curSelceteReport) {
			$(curSelceteReport).removeClass("selected");
			$(curSelceteReport).addClass("active");
		}
		$(curSelceteReport).addClass("selected");
		$(curSelceteReport).removeClass("active");
		loadAllMethods($(curSelceteReport).attr("dir"));
	});

}
function loaResult(dir) {
	tmp = curResultDir + "/" + dir;
	loadMethods(curResultDir, dir);
	resetFilterAndOrder();
	$("#report_details").show();
	$("#overview-tab-content").hide();
	$("ul.tabs li").removeClass("active");
	$(".data_cont").hide();
}
function loadOverview(dir) {

	$.getJSON(dir + "/meta-info.json", function(data) {
		$("#overview-tab-content").show();

		$("#overview-tab-content").html('');
		$("#overview-template").tmpl(data).appendTo("#overview-tab-content");

		$.each(data.tests, function(i, item) {
			$.getJSON(dir + "/" + item + "/overview.json", function(data1) {
				data1["name"] = item;
				$("#test-overview-template").tmpl(data1).appendTo("#tests");
			});
		});

		if(length > 2){
			setTimeout(function (){$('#result_'+split[2]).click()},10);
			length = 0;
		}
		drawPIChart(data);
		url = window.location.href;

	});
}

function loadAllMethods(dir) {
	chained1 = $.getJSON(dir + "/meta-info.json", function(data) {
		$("#overview-tab-content").hide();
		$("#method-results").html('');

		$.each(data.tests, function(i, item) {
			loaResult(item);
		});
	});

	chained1.done(function() {
		chainedtests.done(function() {
			chainedcls.done(function() {
				doSortE(true);
			});
		});
	});

}
function drawPIChart(report) {
	var data = [ [ 'Fail', report.fail ], [ 'Pass', report.pass ],
			[ 'Skip', report.skip ] ];

	jQuery.jqplot("pichart", [ data ], {
		seriesDefaults : {
			// Make this a pie chart.
			renderer : jQuery.jqplot.PieRenderer,
			rendererOptions : {
				seriesColors : [ '#D10707', '#8FC400', '#FFD800' ],
				// Put data labels on the pie slices.
				// By default, labels show the percentage of the
				// slice.
				showDataLabels : true
			}
		},
		legend : {
			show : false,
			location : 'e'
		}
	});
}

function loadMethods(cresultRoot, testDir) {

	curResultDir = cresultRoot;
	var dir = cresultRoot + "/" + testDir;
	$("#method-results").show();

	chainedtests = $.getJSON(dir + "/overview.json", function(data) {
		$.each(data.classes, function(i, cls) {
			chainedcls = $.getJSON(dir + "/" + cls + "/meta-info.json",
					function(minfo) {
						$.each(minfo.methods, function(j, mdata) {
							mdata.datafile = dir + "/" + cls + "/" + mdata.metaData.name
									+ ".json";
							$("#method-header-Template").tmpl(mdata).appendTo(
									"#method-results");
						});
					});
		});
		$("#execution_env_info").html('');
		$("#isfw_build_info").html('');
		$("#desired_capabilities").html('');
		$("#actual-capabilities").html('');
		$("#run-parameters").html('');

		$("#env-info-template").tmpl(data.envInfo['execution-env-info'])
				.appendTo("#execution_env_info");
		$("#env-info-template").tmpl(data.envInfo['isfw-build-info']).appendTo(
				"#isfw_build_info");
		;
		$("#env-info-template").tmpl(
				data.envInfo['browser-desired-capabilities']).appendTo(
				"#desired_capabilities");
		$("#env-info-template").tmpl(
				data.envInfo['browser-actual-capabilities']).appendTo(
				"#actual-capabilities");
		$("#env-info-template").tmpl(data.envInfo['run-parameters']).appendTo(
				"#run-parameters");

	});
	resetFilterAndOrder();
//	window.location.href = url;

}

function loadDetailsTemplate(data, container) {
	$("#method-details-Template").tmpl(data).appendTo(container);
	applyUi(container);
}
function loadDetails(file, container) {
	$.ajax({
		dataType : "json",
		url : file,
		async : false
	}).done(function(data) {
		loadDetailsTemplate(data, container);
	});
}

function toggleTab(ele, contentCss) {
	if (($(ele).hasClass("ui-state-active"))) {
		return 0;
	}

	container = $(ele).parent().parent();
	$(container).find('.tab-content:not(' + contentCss + ')').each(function() {
		var tab = $(this);
		tab.slideUp();
	});
	$(container).find('.action').each(function() {
		$(this).removeClass('ui-state-active');
		$(this).removeClass('ui-state-highlight');

	});
	$(container).find(".tab-content" + contentCss).slideDown();
	$(container).find('.action' + contentCss).each(function() {
		$(this).addClass('ui-state-active');
	});
}

function getIcon(type) {
	type = type.toLowerCase();

	if (type == 'pass')
		return 'ui-icon-circle-check';
	if (type == 'fail')
		return 'ui-icon-circle-close';
	if (type == 'skip')
		return 'ui-icon-cancel';
	if (type == 'warn')
		return 'ui-icon-notice';
	if (type == 'teststep')
		return 'ui-icon-pencil';
	if (type == 'teststeppass')
		return 'ui-icon-check';
	if (type == 'teststepfail')
		return 'ui-icon-closethick';

	return 'ui-icon-' + type;
}
function getHeaderIcon(type) {
	type = type.toLowerCase();

	if (type == 'pass')
		return 'ui-icon-check';
	if (type == 'fail')
		return 'ui-icon-closethick';
	if (type == 'skip')
		return 'ui-icon-cancel';

	return 'ui-icon-' + type;
}

function getHeaderState(type) {
	type = type.toLowerCase();

	if (type == 'pass')
		return 'ui-state-pass';
	if (type == 'fail')
		return 'ui-state-error';
	if (type == 'skip')
		return 'ui-state-alert';

	return '';
}
function getContainerClass(type) {
	type = type.toLowerCase();
	if (type == 'pass')
		return 'pass ui-state-pass';
	if (type == 'fail' || type == 'warn')
		return type + ' ui-state-error';
	if (type == 'info' || type == 'teststep')
		return type + ' ui-state-highlight';
	if (type == 'teststeppass')
		return type + ' ui-state-pass';
	if (type == 'teststepfail')
		return type + ' ui-state-error';
	return ' ui-state-highlight';

}
function previewImage(uri) {

	// Get the HTML Elements
	imageDialog = $("#dialog");
	imageTag = $('#image');
	newWin = $('#newwin');

	// Split the URI so we can get the file name
	uriParts = uri.split("/");

	// append dir if not absolute path
	if (uri.indexOf('http') != 0)
		uri = curResultDir + "/" + uri;

	// Set the image src
	imageTag.attr('src', uri);
	newWin.attr('href', uri);

	// When the image has loaded, display the dialog
	imageTag.load(function() {

		$('#dialog').dialog({
			modal : true,
			resizable : true,
			draggable : true,
			width : '450px',
			title : uriParts[uriParts.length - 1]
		});
	});

}
function resetFilterAndOrder() {
	// reset default filter

	setChecked('#ffail', true);
	setChecked('#fpass', true);
	setChecked('#fskip', true);
	setChecked('#ftest', true);

	setChecked('#fconfig', false);

	// reset default order
	setChecked('#oexecution', false);
	setChecked('#ocollapse', true);
	setChecked('#opass', false);
	setChecked('#ofail', false);
	setChecked('#oskip', false);
	setChecked('#oexecution', false);
	setChecked('#oname', false);

	setChecked('#ocollapse', false);
	setChecked('#oexpand', false);

	$.ajaxQueue.clear();
	$('#loading-info').hide();
}

function isChecked(objCss) {
	return $(objCss).is(":checked");
}
function setChecked(objCss, bval) {
	return $(objCss).prop('checked', bval);
}
function applyUi(container) {
	var tc_name = $(container).parent().children('.mehodheader').find(
			'.ui-icon-text').text();
	var newName = $.trim(tc_name).replace(/\s/g, ".");

	$(container).removeClass('dataloading');

	$(container).children('.detailsContainer').prepend(
			$(container).parent().children('.meta-info'));
	$(container).children('.detailsContainer').children('.meta-info')
			.slideDown();
	$(container).children('.detailsContainer').children('.check-points')
			.slideDown();

	$(container).find('.meta-info-check-points.action').addClass(
			'ui-state-active');

	$(container).find('.action').each(function() {
		$(this).addClass('ui-state-hover');
		$(this).hover(function() {
			if (!($(this).hasClass("ui-state-active")))
				$(this).toggleClass('ui-state-highlight');
		});

	});

	$(container).find('.selenium-log.action').bind("click", function(event) {
		toggleTab($(this), '.selenium-log');
	});
	$(container).find('.error-trace.action').bind("click", function(event) {
		toggleTab($(this), '.error-trace');
	});

	$(container).find('.meta-info-check-points.action').bind("click",
			function(event) {
				toggleTab($(this), '.meta-info');
				$('.check-points.tab-content').show();
			});

	$(container).find(".selenium-log tr:not(.steplog):odd").css(
			"background-color", "#eee");
	$(container).find(".selenium-log tr.steplog").css("background-color",
			"#ddd");

	$('.screenshot').click(function(event) {

		event.preventDefault();
		previewImage($(this).attr('href'));

	});
	$(".screenshot").button({
		icons : {
			primary : "ui-icon-image"
		},
		text : false
	});
	$(container).children('.detailsContainer').find('.check-points-details')
			.prepend(
					$(container).children('.detailsContainer').children(
							'.check-points'));

}

function mehodheaderClick(ele) {
	details = $(ele).parent().children('.details');
	toggleTestDetails(details);
	setChecked('#ocollapse', false);
	setChecked('#oexpand', false);
}
function setActiveTab(tab) {
	$("ul.tabs li").removeClass("active");
	$(tab).addClass("active");
	$(".tab_content").hide();
}
function showTrendChart(tab) {
	interuptLoading = true;
	setActiveTab(tab);
	$("#trends-tab-content").show();

	if ($('#trends-chart').is(":empty")) {
		ajaxindicatorstart();
		drawTrendChart(treports.reports);
	}

	ajaxindicatorstop();
	$("#report_details").hide();
	$("#method-results").html("");
	$(".data_cont").show();
}

function showOverview(tab) {
	interuptLoading = true;
	setActiveTab(tab);
	$("#overview-tab-content").show();
	$("#report_details").hide();
	$("#method-results").hide();

	$("#method-results").html("");
	$(".data_cont").show();
}
function drawTrendChart(reports) {
	var pass = [];
	var fail = [];
	var skip = [];
	var labelsX = [];
	var lstReports = [];
	var cnt = reports.length - 1;

	$.each(reports, function(i, report) {
		lstReports[cnt] = report.dir;
		cnt = cnt - 1;
	});

	$.each(lstReports, function(i, report) {
		chained = $.ajax({
			url : report + "/meta-info.json",
			dataType : 'json',
			async : false,
			success : function(details) {
				pass.push(details.pass);
				fail.push(details.fail);
				skip.push(details.skip);
			}
		});
		labelsX.push(i + 1);
	});

	chained.done(function() {
		var plot1b = $.jqplot('trends-chart', [ pass, fail, skip ], {
			stackSeries : true,
			seriesColors : [ "#8FC400", "#D10707", "#FFD800" ],
			seriesDefaults : {
				rendererOptions : {
					smooth : true
				},
				fill : true,
				fillAndStroke : true,
				fillAlpha : 0.75,
				shadow : false
			},
			axes : {
				xaxis : {
					min : 1,
					renderer : $.jqplot.CategoryAxisRenderer,
					label : 'Execution'
				},
				yaxis : {
					min : 0,
					labelRenderer : $.jqplot.CanvasAxisLabelRenderer,
					label : 'Number Of TestCases'
				}
			},

			highlighter : {
				show : true,
				showToolTip : true,
				tooltipContentEditor : function tooltipContentEditor(str,
						seriesIndex, pointIndex, plot) {
					var executionNumber = pointIndex;
					var labels = [ 'Pass', 'Fail', 'Skip' ];
					var total = plot.data[0][executionNumber]
							+ plot.data[1][executionNumber]
							+ plot.data[2][executionNumber]
					var stringToReturn = labels[0] + ": "
							+ plot.data[0][executionNumber] + "/" + total
							+ "<br/>" + labels[1] + ":&nbsp;&nbsp;&nbsp;"
							+ plot.data[1][executionNumber] + "/" + total
							+ "<br/>" + labels[2] + ":&nbsp&nbsp;"
							+ plot.data[2][executionNumber] + "/" + total;
					return stringToReturn;
				},

			},

			legend : {
				show : true,
				labels : [ 'Pass', 'Fail', 'Skip' ],
				renderer : $.jqplot.EnhancedLegendRenderer,
				location : 's',
				placement : 'outside',
				marginLeft : "-250px",
				// marginRight: "350px",
				marginTop : "30px",
				rendererOptions : {
					numberRows : '1',
					numberColumns : '3',
					seriesToggle : true
				}
			}
		});
		$('#trends-chart').bind(
				'jqplotDataClick',
				function(ev, seriesIndex, pointIndex, data) {
					var executionNumber = pointIndex + 1;

					if ($('#reportlist').find('li.selected').find('span.jobid')
							.text() != executionNumber) {
						$('#reportlist').children().find('.' + executionNumber)
								.click();
					} else {
						$('.fright').find('#overview-tab').click();
					}
				});

	});
}

function toggle(ele, childCss) {
	$(ele).children(childCss).toggle('slow');
}

function expandCollapseAll(expand) {
	if (!expand) {
		$.ajaxQueue.stop();
		$.ajaxQueue.clear();
		$('#loading-info').hide();
	}

	var tot = $('.mehod:not(:hidden) .details').length;

	if (expand) {
		$('#loading-info').show();
		if ($('.mehod:not(:hidden) .details:hidden').length < 1) {
			var len = $('.mehod:not(:hidden) .details').length;
			$('#progress').html('');
			$('#progress').append('<span>' + len + "/" + len + '</span>');
		}
	}

	$('.mehod:not(:hidden) .details').each(
			function(i) {
				if ($(this).is(":hidden") == expand) {
					var container = $(this);
					toggleTestDetails(container, true);
					if ($(this).is(":empty")) {
						$.ajaxQueue.addRequest({
							dataType : "json",
							url : $(container).attr("data-file"),
							success : function(data) {
								loadDetailsTemplate(data, container);
								$('#progress').html('');
								$('#progress').append(
										'<span>' + i + "/" + tot + "</span>");

								if (i == tot - 1) {
									$('#progress').html('');
									var j = i + 1;
									$('#progress').append(
											'<span>' + j + "/" + tot
													+ "</span>");
									$('#loading-info').hide(1000);
								}
							}
						});
					}
				}
			});
	if (expand) {
		$.ajaxQueue.run();
	}

}

function toggleTestDetails(detailsContainer, isBulk) {
	if ($(detailsContainer).is(":hidden")) {

		$(detailsContainer).show();

		if ($(detailsContainer).is(":empty") && !isBulk) {
			$(detailsContainer).addClass('dataloading');
			loadDetails($(detailsContainer).attr("data-file"), detailsContainer);
		}
	} else {
		$(detailsContainer).slideUp();
	}
	return true;

}

function wait(forTask, timeout) {
	setTimeout(forTask, timeout);
}

function doFilter(cssClass) {
	interuptLoading = true;
	var expr = '.mehod.' + cssClass;

	if (cssClass === 'pass' || cssClass === 'fail' || cssClass === 'skip') {
		expr = expr + (!isChecked('#fconfig') ? ':not(.config)' : '')
				+ (!isChecked('#ftest') ? ':not(.test)' : '');
	} else {
		expr = expr + (!isChecked('#fpass') ? ':not(.pass)' : '')
				+ (!isChecked('#ffail') ? ':not(.fail)' : '')
				+ (!isChecked('#fskip') ? ':not(.skip)' : '');

	}
	$(expr).toggle();
	setChecked('#ocollapse', false);
	setChecked('#oexpand', false);

}

function doSort(cssClass) {
	interuptLoading = true;
	$('.mehod').tsort(
			'.mehodheader .status',
			{
				sortFunction : function(a, b) {
					return a.s == b.s ? 0 : a.s == cssClass ? -1
							: b.s == cssClass ? 1 : 0;
				}
			});
}

function doSortE(isReverse) {
	interuptLoading = true;
	$('.mehod').tsort(
			'.mehodheader .oexecution',
			{
				sortFunction : function(a, b) {
					retVal = a.s == b.s ? 0
							: parseInt(a.s) > parseInt(b.s) ? (isReverse) ? -1
									: 1 : (isReverse) ? 1 : -1;
					return retVal;
				}
			});
}
function doSortN(isReverse) {
	$('.mehod').tsort('.mehodheader .ui-icon-text');
}
// utility functions

function parseArray(obj) {
	/*var blkstr = [];
	for (var i = 0, l = obj.length; i < l; i++) {
		blkstr.push(jsonToString(obj[i]));
	}*/	return JSON.stringify(obj, null, ' ');
}

function ajaxindicatorstart(text) {
	$('#trends-chart-loading').show();
}

function ajaxindicatorstop() {
	$('#trends-chart-loading').hide();
}

function jsonToString(value) {
	if (isString(value))
		return value;
	var blkstr = [];
	$.each(value, function(idx2, val2) {
		var str = idx2 + ":" + jsonToString(val2);
		blkstr.push(str);
	});
	return blkstr.valueOf();
}

isString = function(o) {
	return o == null || typeof o == "string"
			|| (typeof o == "object" && o.constructor === String);
}
function msToDateStr(ms) {
	var date = new Date(ms);
	return date;
}
function msToFormatedDateStr(ms) {
	var date = new Date(ms);
	return date.toLocaleDateString() + " " + date.toLocaleTimeString();// .customFormat(
}
function getDuration(ms) {
	if (ms < 0)
		return "N/A";
	secs = ms / 1000;
	var hours = Math.floor(secs / (60 * 60));
	var divisor_for_minutes = secs % (60 * 60);
	var minutes = Math.floor(divisor_for_minutes / 60);
	var divisor_for_seconds = divisor_for_minutes % 60;
	var seconds = Math.ceil(divisor_for_seconds);
	return hours + ":" + minutes + ":" + seconds;
}

function calcPassRate(pass, fail, skip) {
	return Math.round(pass / (pass + fail + skip) * 100);
}

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

/** * */
(function($) {
	var AjaxQueue = function(options) {
		this.options = options || {};
		var oldComplete = options.complete || function() {
		};
		var completeCallback = function(XMLHttpRequest, textStatus) {
			(function() {
				oldComplete(XMLHttpRequest, textStatus);
			})();
			$.ajaxQueue.currentRequest = null;
			$.ajaxQueue.startNextRequest();
		};
		this.options.complete = completeCallback;
	};

	AjaxQueue.prototype = {
		options : {},
		perform : function() {
			$.ajax(this.options);
		}
	}

	$.ajaxQueue = {
		queue : [],

		currentRequest : null,
		inprogrss : false,
		stopped : false,

		stop : function() {
			$.ajaxQueue.stopped = true;

		},

		run : function() {
			$.ajaxQueue.stopped = false;
			$.ajaxQueue.startNextRequest();
		},

		clear : function() {
			$.ajaxQueue.stopped = false;
			var requests = $.ajaxQueue.queue.length;
			for (var i = 0; i < requests; i++) {
				$.ajaxQueue.queue.shift();
			}
			$.ajaxQueue.currentRequest = null;
		},

		addRequest : function(options) {
			var request = new AjaxQueue(options);
			$.ajaxQueue.queue.push(request);
			$.ajaxQueue.startNextRequest();
		},

		startNextRequest : function() {
			if ($.ajaxQueue.currentRequest) {
				return false;
			}
			var request = $.ajaxQueue.queue.shift();
			if (request && !$.ajaxQueue.stopped) {
				inprogrss = true;
				$.ajaxQueue.currentRequest = request;
				request.perform();
			} else {
				inprogrss = false;
			}
		}
	}
})(jQuery);
