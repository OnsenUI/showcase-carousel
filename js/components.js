document.addEventListener('init', function(event) {
  var page = event.target;
  if (controllers.hasOwnProperty(page.id)) {
    controllers[page.id](page);
  }
});


var controllers = {
  login: function(page) {

  },
  range: function(page) {

  },
  dialog: function(page) {
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

      document.querySelector('#dialog-element').hide();
      input.value = '';
    }
  },
  switch: function(page) {

  },
  popover: function(page) {
    var show = function(event) {
      page.querySelector('#popover-element .popover__arrow').classList[event.target.id === 'popover-button' ? 'add' : 'remove']('center');
      page.querySelector('#popover-element').show(event.target);
    };

    page.querySelector('#popover-button').onclick = show;
    page.querySelector('#popover-toolbar-button').onclick = show;

  },
  carousel: function(page) {
    var carousel = page.querySelector('ons-carousel');
    var prev = page.querySelector('.show-prev');
    var next = page.querySelector('.show-next');
    prev.onclick = function() {
      carousel.prev();
    };
    next.onclick = function() {
      carousel.next();
    };

    page.addEventListener('postchange', function(event) {

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
  }
};