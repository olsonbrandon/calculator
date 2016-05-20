$(document).ready(function(){
  //flags
  var canDec = true;
  var canOp = true;
  var canNeg = false;
  var isNeg = false;
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
    $('#window').text(0);
    canDec = true;
    canOp = true;
    isSolved = false;
    isNeg = false;
    canNeg = false;
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
        canNeg = false;
      }
    });
    $(document).keyup(function(e){
      var currDisplay = getDisplay();
      if(e.keyCode === 8) {
        if (currDisplay[currDisplay.length-1] === ')') {
          neg();
        }else
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
      if (canNeg) {
        var currDisplay = getDisplay();
        var firstHalf;
        var secondHalf;
        var wholeString;
        for (var i = currDisplay.length-1; i >= 0; i--) {
          if (isOp(currDisplay[i]) && !isNeg) {
            firstHalf = currDisplay.slice(0,i+1);
            secondHalf = currDisplay.slice(i+1);
            if (secondHalf === '0') {
              return;
            }
            wholeString = firstHalf + '(-' + secondHalf + ')';
            isNeg = true;
            break;
          }else if (isNeg && isOp(currDisplay[i])) {
            firstHalf = currDisplay.slice(0,i-1);
            secondHalf = currDisplay.slice(i+1,-1);
            wholeString = firstHalf + secondHalf;
            isNeg = false;
            break;
          }
        }
        if (currDisplay !== '0' && !wholeString) {
          firstHalf = currDisplay.slice(0,i+1);
          secondHalf = currDisplay.slice(i+1);
          wholeString = firstHalf + '(-' + secondHalf + ')';
          isNeg = true;
        }
        if (wholeString) {
          $('#window').text(wholeString);
        }
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
    //  var newStr;
    //  var needsClosedParen = false;
    //  for (var i = 0; i < str.length; i++) {
    //    if (needsClosedParen && i === str.length-1) {
    //      str += ')';
    //      needsClosedParen = false;
    //    }else if (needsClosedParen && isOp(str[i])) {
    //      newStr = str.slice(0,i);
    //      newStr += ')';
    //      newStr += str.slice(i);
    //      str = newStr;
    //      i++;
    //      needsClosedParen = false;
    //    }else if (i !== 0 && str[i] === '-' && str[i-1] === '-') {
    //      newStr = str.slice(0,i);
    //      newStr += '(';
    //      newStr += str.slice(i);
    //      str = newStr;
    //      i++;
    //      needsClosedParen = true;
    //    }
    //  }
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
      var numInput = +$(this).text();
      var currDisplay = getDisplay();
      if (currDisplay === '0') {
        $('#window').text(numInput);
      } else{
        appendChar(numInput);
      }
      canDec = true;
      canOp = true;
      canNeg = true;
      isNeg = false;
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
        var currDisplay = getDisplay();
        if (isSolved) {
          clearDisplay();
        }
        if (currDisplay === '0') {
          $('#window').text(character);
        }else {
          appendChar(character);
        }
        canOp = true;
        canDec = true;
        canNeg = true;
      }else if ($.inArray(e.keyCode.toString(), keys) !== -1 && canOp) {
        appendChar(charMap[e.keyCode]);
        canOp = false;
        canDec = true;
        canNeg = false;
      }else if ((e.keyCode === 46 || e.keyCode === 110) && canDec) {
        canDec = false;
        canOp = false;
        appendChar('.');
      }else if ((e.keyCode === 45 || e.keyCode === 109) && canOp) {
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
