$(document).ready(function(){
  //flags
  var canDec = true;
  var canOp = false;
  var canNeg = true;
  var isSolved;
  var hist = [];

  //Display
  function getDisplay(){
    return $('#window').text();
  }
  $('#expand').click(function(){
    $('#history').toggle();
  });
  function clearHistory(){
    $('#history').empty();
  }
  function clearDisplay(){
    $('#window').empty();
    canDec = true;
    canOp = false;
    isSolved = false;
  }

  $('#c').click(function(){
    clearDisplay();
  });
  $('#c').dblclick(function(){
    clearHistory();
    $('#history').toggle();
  });

  function callHistory(e){
    appendChar(e.target.innerHTML);
  }

  function addToHistory(){
    hist.push(getDisplay());
    var div = $(document.createElement('div')).text(getDisplay()).click(callHistory);
    $('#history').append(div);
    $('#history').scrollTop($('#history')[0].scrollHeight);
  }

    //Operations
    $('.operation').click(function(){
      if(canOp){
        var opIn = $(this).text();
        appendChar(opIn);
        canOp = false;
      }
    });
    $(document).keyup(function(e){
      if(e.keyCode === 8) {
        $('#window').text(function (index, textContent) {
          return textContent.slice(0,-1);
        });
        canOp = true;
        canDec = true;
        canNeg = true;
      }
    });

    function isOp(char){
      return ['x','-','*','+','/'].indexOf(char) !== -1;
    }

    function neg(){
      var currDisplay = getDisplay();
      var firstHalf;
      var secondHalf;
      for (var i = currDisplay.length-1; i >= 0; i--) {
        if (isOp(currDisplay[i])) {
          firstHalf = currDisplay.slice(0,i+1);
            //if (i!== currDisplay.length-1) {
              newString += currDisplay.slice(i+1);
              break;
            }
        }else if (isOp(currDisplay[i])) {
          newString = currDisplay.slice(0,i+1);
          newString += '-';
            if (i !== currDisplay.length-1) {
              newString += currDisplay.slice(i+1);
              break;
            }
        }
      }
      if (newString) {
        $('#window').text(newString);
      }
    }

    $('#negative').click(function(){
      neg();
    });
    $(document).keyup(function(e){
      if(e.keyCode === 13) {
        addToHistory();
        solve();
      }
    });
    $('.solve').click(function(){
      addToHistory();
      solve();
    });

    function prepareCalc(str){
      str = str.replace(/x/g,'*');
      var newStr;
      var needsClosedParen = false;
      for (var i = 0; i < str.length; i++) {
        if (needsClosedParen && i === str.length-1) {
          str += ')';
          needsClosedParen = false;
        }else if (needsClosedParen && isOp(str[i])) {
          newStr = str.slice(0,i);
          newStr += ')';
          newStr += str.slice(i);
          str = newStr;
          i++;
          needsClosedParen = false;
        }else if (i !== 0 && str[i] === '-' && str[i-1] === '-') {
          newStr = str.slice(0,i);
          newStr += '(';
          newStr += str.slice(i);
          str = newStr;
          i++;
          needsClosedParen = true;
        }
      }
      return str;
    }

    function solve(){
      var calc = prepareCalc(getDisplay());
      if (calc.includes("/0")) {
        $('#window').text('DIV 0 ERROR');
      }else {
        var result = eval(calc);
        $('#window').text(result);
        isSolved = true;
        canOp = true;
        canDec = true;
      }
    }
    //Numbers
    $('.num').click(function(){
      var numImput = +$(this).text();
      appendChar(numImput);
      canDec = true;
      canOp = true;
    });
    $('#dec').click(function(){
      if(canDec){
        appendChar('.');
        canDec = false;
      }
    });

    function appendChar(char){
      $('#window').append(char);
      $('#window').scrollLeft($('#window')[0].scrollWidth);
    }
    $(document).on('keypress', function(e){
      var charMap = {
        120: 'x',
        43: '+',
        45: '-',
        47: '/',
        106: 'x',
        107: '+',
        109: '-',
        111: '/'
      };
      var character = String.fromCharCode(e.keyCode);
      character = character.toLowerCase();
      var keys = Object.keys(charMap);
      if ($.isNumeric(character)) {
        if (isSolved) {
          clearDisplay();
        }
        appendChar(character);
        canOp = true;
        canDec = true;
      }else if ($.inArray(e.keyCode.toString(), keys) !== -1 && canOp === true) {
        appendChar(charMap[e.keyCode]);
        canOp = false;
        canDec = true;
      }else if ((e.keyCode === 46 || e.keyCode === 110) && canDec === true) {
        canDec = false;
        canOp = false;
        appendChar('.');
      }else if ((e.keyCode === 45 || e.keyCode === 109)) {
         var currDisplay = getDisplay();
         var lastIndex = currDisplay.length-1;
         if (currDisplay.length === 0){
           appendChar('-');
        }
        else if (currDisplay === '-') {
          return;
        }
        else if (!isOp(currDisplay[lastIndex])) {
          appendChar('-');
        }
        else if (!isOp(currDisplay[lastIndex-1])) {
          appendChar('-');
        }
        else {
          return;
        }
      }
    });
});
