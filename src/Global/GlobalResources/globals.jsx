// Below is an example of exposing a library globally so that it can be used in
// the content of a Kinetic Core form. The library itself will determine
// somewhat how this happens, for example some like the one shown below return
// something that you have to manually add to 'window'. Some libraries might add
// themselves to the window when loaded or some might decorate something else,
// like a jQuery plugin.
// Note that the example below shows jquery but jquery is not currently
// configured as a dependency so for this code to work jquery needs to be added
// as a dependency and installed.

import jquery from 'jquery';
import moment from 'moment';

jquery.ajaxSetup({
  xhrFields: {
    withCredentials: true,
  },
});

window.$ = jquery;
window.jQuery = jquery;
window.moment = moment;

/**
 * Kinetic form customizations
 ******************************************************************************/

// Helper function to add help text to fields based on a render attribute
function addHelpTextToField(field, a, b, c) {
  var wrapper = jquery(field.wrapper());
  if (wrapper.is('[data-help-text]:not(:has(.help-text-wrapper))')) {
    wrapper.find('.field-label').after(
      jquery('<div>', {
        class: 'help-text-wrapper text-truncate',
      })
        .on('click', function() {
          jquery(this).toggleClass('text-truncate');
        })
        .append(
          window.K.translate(
            field.form().getTranslationContext(),
            wrapper.attr('data-help-text'),
          ),
        ),
    );
  }
}

window.bundle = window.bundle || {};
window.bundle.config = window.bundle.config || {};
// Create helpers namespace for importing the calendar configuration
window.bundle.helpers = window.bundle.helpers || {};

// Customization of form fields
window.bundle.config.fields = {
  text: {
    callback: function(field) {
      addHelpTextToField(field);
    },
  },
  checkbox: {
    callback: function(field) {
      addHelpTextToField(field);
    },
  },
  radio: {
    callback: function(field) {
      addHelpTextToField(field);
    },
  },
  dropdown: {
    callback: function(field) {
      addHelpTextToField(field);
    },
  },
  date: {
    callback: function(field) {
      addHelpTextToField(field);
    },
  },
  datetime: {
    callback: function(field) {
      addHelpTextToField(field);
    },
  },
  time: {
    callback: function(field) {
      addHelpTextToField(field);
    },
  },
  attachment: {
    callback: function(field) {
      addHelpTextToField(field);
    },
  },
};

// Add functionality for detailed information toggle
window.bundle.config.ready = function(form) {
  var section = jquery(form.find('#detailedInformationSection'));
  if (section.length > 0) {
    section
      .find('.section-title')
      .css('cursor', 'pointer')
      .append('<div id="caret" class="las la-angle-right"></div>')
      .click(function() {
        jquery(this)
          .find('#caret')
          .toggleClass('la-angle-right la-angle-down');
        section.find('#detailedInformation').toggle();
      });
  }
};
