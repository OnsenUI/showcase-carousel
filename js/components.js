app.lock = {};

document.addEventListener('init', function(event) {
  var page = event.target;
  if (app.controllers.hasOwnProperty(page.id) && !app.lock.hasOwnProperty(page.id)) {
    app.lock[page.id] = true;
    app.controllers[page.id](page);
  }
});


////////////////
//  ANIMATORS  //
////////////////

app.animators = {
  login: function(page) {
    var username = page.querySelector('ons-input[type=text]'),
      password = page.querySelector('ons-input[type=password]');

    app.actionBlock([
      app.generateStepsFromString(username, 'Onsen'),
      app.generateStepsFromString(password, '1234')
    ], 0, 500);
  },
  range: function(page) {
    var ranges = page.querySelectorAll('ons-range');
    var direction = [1,1];

    var modifyValue = function(index) {
      var asd = ranges[index].value;
      ranges[index].value = parseInt(ranges[index].value) + (2 * direction[index]);
      if (ranges[index].value % 100 === 0) {
        direction[index] *= -1;
      }
    };

    var generateSteps = function(index, times) {
      var steps = [];
      while(times--) {
        steps.push(modifyValue.bind(null, index));
      }
      return steps;
    }

    app.actionBlock([
      generateSteps(0, 40),
      generateSteps(1, 25)
    ], 0, 1000/30);
  },
  dialog: function(dialog, icon, click) {
    var input = dialog.querySelector('ons-input');
    app.actionBlock([
      dialog.show.bind(dialog),
      function() {
        input.value += '4';
      },
      function() {
        input.value += icon.classList.contains('failure') ? '2' : '8';
      },
      click
    ], 250);
  },
  switch: function(page) {
    var switches = page.querySelectorAll('ons-switch');
    var toggle = function(element) {
      element.checked = !element.checked;
    };

    app.actionBlock([
      toggle.bind(null, switches[0]),
      toggle.bind(null, switches[1])
    ], 1000);
  },
  popover: function(show, hide) {
    app.actionBlock([
      show.bind(null, 'popover-button'),
      hide,
      show.bind(null, 'popover-toolbar-button'),
      hide
    ], 500);
  },
  carousel: function(carousel) {
    app.actionBlock([function() {
      carousel.setActiveCarouselItemIndex((carousel.getActiveCarouselItemIndex() + 1) % carousel.getCarouselItemCount());
    }]);
  },
  fab: function(page) {
    var fabs = page.querySelectorAll('ons-speed-dial');

    app.actionBlock([
      fabs[0].toggleItems.bind(fabs[0]),
      fabs[1].toggleItems.bind(fabs[1])
    ], 750);
  },
  form: function(page) {
    var checkboxes = page.querySelectorAll('ons-input[type=checkbox]'),
      radios = page.querySelectorAll('ons-input[type=radio]'),
      name = page.querySelector('ons-input[type=text]'),
      age = page.querySelector('ons-input[type=number]');

    var toggle = function(element) {
      element.checked = !element.checked;
    };

    app.actionBlock([
      toggle.bind(null, checkboxes[0]),
      toggle.bind(null, checkboxes[1])
    ]);

    app.actionBlock([
      toggle.bind(null, radios[1]),
      toggle.bind(null, radios[0])
    ], 1000);

    app.actionBlock([
      app.generateStepsFromString(name, 'Fran'),
      app.generateStepsFromString(age, '25')
    ], 0, 500);
  }
};


////////////////
// CONTROLLERS //
////////////////

app.controllers = {
  login: app.animators.login,
  range: app.animators.range,
  dialog: function(page) {
    var dialog = document.querySelector('#dialog-element');
    var icon = page.querySelector('.page__content > ons-icon');

    page.querySelector('ons-toolbar-button').onclick = function() {
      document.querySelector('#dialog-element').show();
    };

    page.querySelector('.alert-dialog-button').onclick = function() {
      var input = page.querySelector('.alert-dialog-content ons-input');

      if (input.value === '42') {
        icon.classList.remove('failure');
        icon.setAttribute('icon', 'ion-checkmark, material:md-check');
      } else {
        icon.classList.add('failure');
        icon.setAttribute('icon', 'ion-close, material:md-close');
      }

      dialog.hide();
      input.value = '';
    };

    app.animators.dialog(dialog, icon, page.querySelector('.alert-dialog-button').onclick);
  },
  switch: app.animators.switch,
  popover: function(page) {
    var show = function(event) {
      if (typeof event === 'string' || app.hover) {
        var id = typeof event === 'string' ? event : event.target.id;
        page.querySelector('#popover-element .popover__arrow').classList[id === 'popover-button' ? 'add' : 'remove']('center');
        page.querySelector('#popover-element').show('#' + id);
      }
    };

    var hide = function() {
      if (!app.hover) {
        page.querySelector('#popover-element').hide();
      }
    };

    page.querySelector('#popover-button').onclick = show;
    page.querySelector('#popover-toolbar-button').onclick = show;

    app.animators.popover(show, hide);
  },
  carousel: function(page) {
    var carousel = page.querySelector('ons-carousel');
    var prev = page.querySelector('.show-prev');
    var next = page.querySelector('.show-next');
    prev.onclick = carousel.prev.bind(carousel);
    next.onclick = carousel.next.bind(carousel);

    page.addEventListener('postchange', function(event) {
      carousel.setAttribute('initial-index', event.activeIndex);

      if (event.activeIndex === carousel.getCarouselItemCount() - 1) {
        prev.removeAttribute('disabled');
        next.setAttribute('disabled', '');
      } else if (event.activeIndex === 0) {
        next.removeAttribute('disabled');
        prev.setAttribute('disabled', '');
      } else {
        next.removeAttribute('disabled');
        prev.removeAttribute('disabled');
      }
    });

    app.animators.carousel(carousel);
  },
  fab: app.animators.fab,
  form: app.animators.form
};


////////////////
//  ANIMATION  //
////////////////

(function(){
  var blockCounter = 0;

  var action = function(fn, block, count, order, delay) {
    setTimeout(function() {
      setInterval(function() {
        if (!app.hover && document.visibilityState === 'visible') {
          fn();
        }
      }, count * delay);
    }, delay * order);
  };

  app.actionBlock = function(actions, initialDelay, actionDelay) {
    if (actions[0] && actions[0].constructor === Array) {
      actions = actions.reduce(function(a, b) {
        return a.concat(b);
      });
    }

    setTimeout(function() {
      for(var i = 0; i < actions.length; i++) {
        action(actions[i], blockCounter, actions.length, i + 1, actionDelay || 2000);
      }
      blockCounter++;
    }, initialDelay || 0);
  };

  var modifyValue = function(element, char) {
    element.value = char ? element.value + char : '';
  };

  app.generateStepsFromString = function(element, string) {
    var steps = [], index = -1;
    steps.push(modifyValue.bind(null, element, ''));

    while(++index < string.length) {
      steps.push(modifyValue.bind(null, element, string[index]));
    }

    return steps;
  };

})();