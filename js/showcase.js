var app = {};
ons.platform.select('ios');

ons.ready(function() {
  document.querySelector('#placeholder').remove();
  var carousel = document.querySelector('#showcase > ons-carousel');

  // Generate selectors
  for (var i = 0; i < carousel.children.length; i++) {
    var dot = ons._util.createElement('<ons-input input-id="r'+i+'" modifier="dot" type="radio" name="showcase" disable-auto-styling></ons-input>');
    document.querySelector('#selector').appendChild(dot);
  }

  var currentAbsoluteIndex = currentRelativeIndex = 4;
  carousel.setActiveCarouselItemIndex(currentAbsoluteIndex);
  document.querySelector('#selector').children[currentAbsoluteIndex].setAttribute('checked', '');


  document.querySelector('#selector').addEventListener('change', function(event) {
    var total = document.querySelector('#selector').children.length;
    var nextAbsoluteIndex = (+ event.target.id.substr(1));

    var node = document.querySelector('#c' + nextAbsoluteIndex);
    for (var nextRelativeIndex = 0; (node = node.previousElementSibling); nextRelativeIndex++);
    nextRelativeIndex = nextRelativeIndex % total;

    var next = (nextRelativeIndex - currentRelativeIndex) >= 0;
    var times = Math.abs(currentRelativeIndex - nextRelativeIndex);

    app.swipe(next, times);

    currentAbsoluteIndex = nextAbsoluteIndex;
    currentRelativeIndex = (nextRelativeIndex + (next ? -times : +times)) % total;
    if (currentRelativeIndex < 0) {
      currentRelativeIndex += total;
    }
  });

  // Handle user hovering
  app.hover = 0;
  document.getElementById('wrapper').onmouseenter = function() {
    app.hover++;
  };
  document.getElementById('wrapper').onmouseleave = function() {
    var id = app.hover;
    setTimeout(function() {
      if (id === app.hover) {
        ons._util.arrayFrom(document.querySelectorAll('#showcase ons-input:not([type=checkbox]):not([type=radio])'))
          .forEach(function(element) {
            element.value = '';
          });

        app.hover = 0;
      }
    }, 2000);
  };

  // Auto swipe the carousel
  setInterval(function() {
    if (!app.hover && document.visibilityState === 'visible') {
      app.next();
    }
  }, 6000);

  // Auto change platform
  setTimeout(function() {
    setInterval(function() {
      if (!app.hover) {
        ons.forcePlatformStyling(ons.platform._renderPlatform === 'ios' ? 'android' : 'ios');
      }
    }, 6000);
  }, 3000);

});

app.swipe = function(next, times) {
  var carousel = document.querySelector('#showcase > ons-carousel');
  var items = ons._util.arrayFrom(document.querySelectorAll('#showcase > ons-carousel > ons-carousel-item'));
  var width = parseInt(carousel.getAttribute('item-width'));

  var slide = function() {
    for (var i = 0; i < items.length; i++) {
      items[i].style.left = parseInt(items[i].style.left) - (width * times * (next ? 1 : -1)) + 'px';
    }
  };

  var update = function() {
    var limit = next ? times : items.length;
    var currentWidth = parseInt(items[0].style.left);

    for (var i = limit - times; i < limit; i++, j++) {
      if (next) {
        items[0].style.left = (items.length + i) * width + 'px';
        carousel.appendChild(items[0]);
        items.push(items.shift());
      } else {
        items.unshift(items.pop());
        var j = i - (limit - times);
        items[0].style.left = currentWidth - (width * (j + 1)) + 'px';
        carousel.insertBefore(items[0], carousel.firstChild);
      }
    }
  };

  if (next) {
    update();
    setTimeout(slide, 5);
  } else {
    setTimeout(function() {
      slide();
      setTimeout(update, 1000/30);
    }, 5);
  }
}

app.next = function() {
  var currentInput = ons._util.findParent(document.querySelector('input[name="showcase"]:checked'), 'ons-input');
  var nextInput = currentInput.nextElementSibling || currentInput.parentElement.firstElementChild;
  nextInput.checked = true;

  app.swipe(true, 1);
}

app.prev = function() {
  var currentInput = ons._util.findParent(document.querySelector('input[name="showcase"]:checked'), 'ons-input');
  var prevInput = currentInput.previousElementSibling || currentInput.parentElement.lastElementChild;
  prevInput.checked = true;

  app.swipe(false, 1);
}