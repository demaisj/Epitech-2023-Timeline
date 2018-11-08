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

    [ 'Accompagnement', 'Introduction conferences', start(24, 9, 2018), end(30, 9, 2018) ],
    [ 'Accompagnement', 'Assistance', start(18, 10, 2018), end(23, 10, 2018) ],

    [ 'Rushs (I)', 'Rush 1', start(6, 10, 2018), end(7, 10, 2018) ],
    [ 'Rushs (I)', 'Rush 2', start(13, 10, 2018), end(14, 10, 2018) ],

    [ 'Mini-projects (I)', 'Fir Tree', start(3, 10, 2018), end(7, 10, 2018) ],
    [ 'Mini-projects (I)', 'match nmatch', start(8, 10, 2018), end(14, 10, 2018) ],
    [ 'Mini-projects (I)', 'Lib Workshop', start(18, 10, 2018), end(23, 10, 2018) ],

    [ 'TPs (I)', '01', start(1, 10, 2018), end(2, 10, 2018) ],
    [ 'TPs (I)', '02', start(2, 10, 2018), end(3, 10, 2018) ],
    [ 'TPs (I)', '03', start(3, 10, 2018), end(4, 10, 2018) ],
    [ 'TPs (I)', '04', start(4, 10, 2018), end(5, 10, 2018) ],
    [ 'TPs (I)', '05', start(5, 10, 2018), end(8, 10, 2018) ],
    [ 'TPs (I)', '06', start(8, 10, 2018), end(9, 10, 2018) ],
    [ 'TPs (I)', '07', start(9, 10, 2018), end(10, 10, 2018) ],
    [ 'TPs (I)', '08', start(10, 10, 2018), end(11, 10, 2018) ],
    [ 'TPs (I)', '09', start(11, 10, 2018), end(12, 10, 2018) ],
    [ 'TPs (I)', '10', start(12, 10, 2018), end(15, 10, 2018) ],
    [ 'TPs (I)', '11', start(15, 10, 2018), end(16, 10, 2018) ],
    [ 'TPs (I)', '12', start(16, 10, 2018), end(17, 10, 2018) ],
    [ 'TPs (I)', '13', start(17, 10, 2018), end(18, 10, 2018) ],

    [ 'Stumpers (II)', 'Final Stumper', start(27, 10, 2018), end(27, 10, 2018) ],

    [ 'Mini-projects (II)', 'InfinAdd', start(22, 10, 2018), end(23, 10, 2018) ],
    [ 'Mini-projects (II)', 'EvalExpr', start(24, 10, 2018), end(28, 10, 2018) ],

    [ 'Projects (II)', 'Bistro-matic', start(22, 10, 2018), end(4, 11, 2018) ],
    //[ 'Projects (II)', 'BTTF - Bistro-matic', start(17, 12, 2018), end(30, 12, 2018) ],

    [ 'Mathematics', '101pong', start(05, 11, 2018), end(18, 11, 2018)],
    [ 'Mathematics', '102architect', start(19, 11, 2018), end(02, 12, 2018)],
    [ 'Mathematics', '103cipher', start(03, 12, 2018), end(16, 12, 2018)],
    [ 'Mathematics', '104intersection', start(17, 12, 2018), end(06, 01, 2019)],
    [ 'Mathematics', '105torus', start(07, 01, 2019), end(20, 01, 2019)],
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
