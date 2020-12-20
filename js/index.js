"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (doc) {
  var generateTitle = function generateTitle(entry, currentIndex) {
    var newEntry = document.createElement('div');
    var copy = document.createElement('p');
    var title = entry;

    if (_typeof(title) === 'object') {
      title = Object.keys(title)[0];
      copy.classList.add('arrow');
    }

    copy.innerHTML = title;
    newEntry.dataset.target = currentIndex;
    newEntry.append(copy);
    return newEntry;
  };

  var sortTitles = function sortTitles(entry, index, parentElement) {
    var currentIndex = index;
    var length = entry ? entry.length : 0;

    if (typeof entry === "string") {
      return generateTitle(entry, currentIndex);
    } else if (typeof length == 'number' && length > -1) {
      _.each(entry, function (child, i) {
        var newIndex = currentIndex + '-' + (i + 1);
        var sortedTitles = sortTitles(child, newIndex);
        parentElement.append(sortedTitles);
      });

      return parentElement;
    } else {
      var groupTitle = generateTitle(entry, currentIndex);
      var addedChildren;

      _.each(entry, function (child) {
        addedChildren = sortTitles(child, index, groupTitle);
      });

      return addedChildren;
    }
  };

  _.each(userSections.navigationTitles, function (currentEntry, i) {
    var turtle = sortTitles(currentEntry, i + 1);
    document.querySelector('.nav-buttons').append(turtle);
    console.log('turtles', turtle);
  });

  var $ = {
    // Single Item
    prevButton: doc.getElementById('prev'),
    nextButton: doc.getElementById('next'),
    videoSection: doc.querySelector('.video-section'),
    controlButtonGroup: doc.querySelector('.control-buttons'),
    navButtonGroup: doc.querySelector('.nav-buttons'),
    // Multiple Items
    allVideos: doc.querySelectorAll('video')
  };

  var togglePreviousButton = function togglePreviousButton(index) {
    if (index <= 1) $.prevButton.classList.remove('on');else $.prevButton.classList.add('on');
  };

  var playVideo = function playVideo(video) {
    if (video) {
      video.load();
      video.play();
    }
  };

  var hideActiveContent = function hideActiveContent(content) {
    // Remove on from all content containers
    _.each(content, function (el) {
      el.classList.remove('on'); // Stop All Active Videos

      _.each(el.querySelectorAll('video'), function (video) {
        video.pause();
      });
    });
  }; // Switch css to new active nav


  var changeActiveNav = function changeActiveNav(clickedNavEl) {
    $.navButtonGroup.querySelector('.background').classList.remove('background');
    clickedNavEl.classList.toggle('on');
    clickedNavEl.querySelector('p').classList.add('color-blue');
    clickedNavEl.classList.add('background');
  }; // Change Portal


  var changePortal = function changePortal(portalIndex) {
    var activePortal = $.videoSection.querySelector('.portal.on');
    var nextPortal = doc.querySelector("[data-video=\"".concat(portalIndex, "\"]"));
    var children = doc.querySelectorAll("[data-children=\"".concat(portalIndex, "\"]"));

    _.each(children, function (el) {
      el.classList.toggle('show');
    }); // Remove on class from portal


    activePortal.classList.remove('on');
    activePortal.dataset.index = 1; // Remove on from all children

    hideActiveContent(activePortal.querySelectorAll('.content-container')); // Next Portal and first child CSS

    nextPortal.classList.add('on');
    nextPortal.children[0].classList.add('on');
    playVideo(nextPortal.children[0].querySelector('video')); // Move Previous and Next Button unless last slide

    if (portalIndex <= 78 && nextPortal) {
      nextPortal.append($.controlButtonGroup);
      togglePreviousButton(+nextPortal.dataset.index);
    }
  };

  var changeView = function changeView(activePortal, newIndex) {
    var content = activePortal.querySelectorAll('.content-container');

    if (newIndex <= content.length) {
      var nextView = activePortal.querySelector("[data-content=\"".concat(newIndex, "\"]"));
      hideActiveContent(content); // Show next View

      nextView.classList.add('on');
      playVideo(nextView.querySelector('video'));
      togglePreviousButton(newIndex);
    } else {
      // Go to Next Portal
      var newPortalTarget = +activePortal.dataset.video + 1;
      changePortal(newPortalTarget);
      changeActiveNav($.navButtonGroup.querySelector("[data-target=\"".concat(newPortalTarget, "\"]")));
    }
  }; // Button Functionality


  var buttonAction = function buttonAction(button) {
    var activePortal = doc.querySelector('.portal.on');
    var currentPortalIndex = activePortal.dataset.index; // Previous / Back

    if (button.target.id === 'prev') currentPortalIndex -= 1; // Next

    if (button.target.id === 'next') currentPortalIndex += 1; // Update portal index

    activePortal.dataset.index = currentPortalIndex; // changeView

    changeView(activePortal, currentPortalIndex);
  };

  var closeModals = function closeModals() {
    if (doc.querySelector('.modal.on')) {
      doc.querySelector('.overlay.on').classList.remove('on');
      doc.querySelector('.modal.on').classList.remove('on');
    }
  };

  window.onload = function () {
    // Give nav Buttons functionality to change Portals
    _.each($.navButtonGroup.querySelectorAll('div'), function (el) {
      el.addEventListener('click', function (e) {
        e.stopPropagation();
        changePortal(el.dataset.target);
        changeActiveNav(el);
      });
    }); // changeView/Portal


    $.nextButton.addEventListener('click', buttonAction);
    $.prevButton.addEventListener('click', buttonAction);
    doc.querySelector('.header').addEventListener('click', function () {
      closeModals(); // doc.querySelector('.modal.on').classList.remove('on')
    });
    doc.querySelector('.overlay').addEventListener('click', function () {
      closeModals(); // doc.querySelector('.modal.on').classList.remove('on')
    }); // Attachments
    // doc.getElementById('attachmentButton').addEventListener('click', (e) => {
    //     e.stopPropagation();
    //     if (!e.target.classList.contains('on')){
    //         // else{
    //         closeModals();
    //         doc.querySelector('.overlay').classList.add('on');
    //         doc.getElementById('attachmentModal').classList.add('on');
    //     } else {
    //         closeModals();
    //     }
    // })
    // Bulk Fluid
    // doc.getElementById('bulkFluidButton').addEventListener('click', (e) => {
    //     e.stopPropagation();
    //     // const active = ()
    //     if (!e.target.classList.contains('on')){
    //         // else{
    //         closeModals();
    //         doc.querySelector('.overlay').classList.add('on');
    //         doc.getElementById('bulkFluidModal').classList.add('on');
    //     }
    // })
  };
})((typeof document === "undefined" ? "undefined" : _typeof(document)) === 'object' && document);