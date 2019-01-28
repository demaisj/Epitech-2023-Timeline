google.charts.load("current", {packages:["timeline"]});
google.charts.setOnLoadCallback(drawChart);
var today = new Date();

function date(day, month, year)
{
  return new Date(year, month - 1, day);
}

function start(day, month, year)
{
  return date(day, month, year);
}

function end(day, month, year)
{
  var d = date(day, month, year);
  d.setDate(d.getDate() + 1);
  return d;
}

function drawChart() {
  var container = document.getElementById('timeline-container');
  var chart = new google.visualization.Timeline(container);
  var dataTable = new google.visualization.DataTable();
  dataTable.addColumn({ type: 'string', id: 'Module' })
  dataTable.addColumn({ type: 'string', id: 'Project' });
  dataTable.addColumn({ type: 'date', id: 'Start' });
  dataTable.addColumn({ type: 'date', id: 'End' });
  var now = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  dataTable.addRows([
    [ '\0', 'Now', now, now ],

    [ 'Unix System Programming (First semester)', 'Minishell1', start(14, 01, 2019), end(03, 02, 2019)],

    ['Unix System Programming', 'Tetris', start(08, 02, 2019), end(28, 04, 2019)],
    ['Unix System Programming', 'Navy', start(18, 02, 2019), end(10, 03, 2019)],

    [ 'Mathematics', '106bombyx', start(18, 02, 2019), end(03, 03, 2019)],
    [ 'Mathematics', '107transfer', start(04, 03, 2019), end(17, 03, 2019)],
    [ 'Mathematics', '108trigo', start(18, 03, 2019), end(31, 03, 2019)],
    [ 'Mathematics', '109titration', start(01, 04, 2019), end(14, 04, 2019)],
    [ 'Mathematics', '110borwein', start(15, 04, 2019), end(28, 04, 2019)],

    ['C Graphical Programming', 'MyDefender', start(18, 02, 2019), end(17, 03, 2019)],
    ['C Graphical Programming', 'MyWorld', start(18, 02, 2019), end(17, 03, 2019)],
    ['C Graphical Programming', 'MyRPG', start(18, 03, 2019), end(05, 05, 2019)],

    ['Elementary Programming in C (I)', 'Lem-in', start(25, 02, 2019), end(24, 03, 2019)],
    ['Elementary Programming in C (I)', 'Dante\'s star', start(25, 03, 2019), end(14, 04, 2019)],

    [ 'Shell Programming', 'Minishell2', start(11, 03, 2019), end(07, 04, 2019)],
    [ 'Shell Programming', '42sh', start(29, 04, 2019), end(26, 05, 2019)],

    ['Elementary Programming in C (II)', 'Corewar', start(22, 04, 2019), end(19, 05, 2019)],
  ]);


  chart.draw(dataTable, {
    timeline: {
      colorByRowLabel: true
    }
  });

  nowLine('timeline-container');

  google.visualization.events.addListener(chart, 'onmouseover', function(obj){
    if(obj.row == 0){
      $('.google-visualization-tooltip').css('display', 'none');
    }
    nowLine('timeline-container');
  })

  google.visualization.events.addListener(chart, 'onmouseout', function(obj){
    nowLine('timeline-container');
  })
}

function nowLine(div) {

    //get the height of the timeline div
    var height;
    $('#' + div + ' rect').each(function(index) {
        var x = parseFloat($(this).attr('x'));
        var y = parseFloat($(this).attr('y'));

        if (x == 0 && y == 0) {
            height = parseFloat($(this).attr('height'))
        }
    })

    var nowWord = $('#' + div + ' text:contains("Now")');

    nowWord.prev().first().attr('height', height + 'px').attr('width', '1px').attr('y', '0');
    // add this line to remove the display:none style on the vertical line
    $('#' + div + '  text:contains("Now")').each(function(idx, value) {
        if (idx == 0) {
            $(value).parent().find("rect").first().removeAttr("style");
        } else if (idx == 1) {
            $(value).parent().find("rect").first().attr("style", "display:none;");
        }

    });
}

$(document).ready(function(){
  $.getJSON("https://api.github.com/repos/demaisj/Epitech-2023-Timeline/commits", function(json){
    var msg, el, date;

    $("#changelog-container").empty();

    for (var i = 0; i < json.length; i++) {
      msg = json[i].commit.message.split("\n");
      date = moment(json[i].commit.committer.date);
      el = $(`<p class="commit">
<a href="${json[i].html_url}" target="_blank" class="commit-msg">${msg[0]}</a>
<span title="${date.format("dddd, MMMM Do YYYY, h:mm:ss a")}" class="commit-date">${date.fromNow()}</span>
</p>`);
      if (msg.length > 1){
        for (var j = msg.length - 1; j >= 1; j--) {
          if (msg[j].length > 0){
            el.addClass("expanded");
            el.find("a").after(`<span class="commit-desc">${msg[j]}</span>`);
          }
        }
      }
      el.appendTo($("#changelog-container"));
    }

    if (json.length <= 0){
      $("#changelog-container").text("No commits !? xO");
    }
  })
  .fail(function(){
    $("#changelog-container").text("Error while loading changelog :'(");
  });

  function set_theme(dark){
    var dark = dark || false;

    window.localStorage.setItem("dark", dark);

    if (dark){
      $("body").addClass("dark");
      $("#switch").text("Switch to light");
    }
    else{
      $("body").removeClass("dark");
      $("#switch").text("Switch to dark");
    }
  }

  $("#switch").on("click", function(){
    set_theme(!$("body").hasClass("dark"));
    return false;
  })

  set_theme(window.localStorage.getItem("dark") == "true" ? true : false);
  setTimeout(function(){
    $('body').addClass('ready');
  }, 500);
});
