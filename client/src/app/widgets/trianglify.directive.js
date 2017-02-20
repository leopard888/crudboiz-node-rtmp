;(function () {
  'use strict';

  angular
   .module('app.widgets')
   .directive('trianglify', trianglify);

  /* @ngInject */
  function trianglify() {

    let directive = {
      restrict: 'E',
      template: `
        <div 
          ng-show="dm.finishedInit"
          class="animate-fade pattern pattern--hidden"
        >
        </div>
      `,
      scope: {},
      bindToController: {
      },
      controller: Controller,
      controllerAs: 'dm'
    };

    return directive;
  }

  /* @ngInject */
  function Controller($window, $timeout, Trianglify) {
    var dm = this;
    
    dm.finishedInit = false;

    const SELECTORS = {
      pattern: '.pattern',
    };

    const MED_BREAKPOINT = 1100;

    /**
     * Enum of CSS classes.
     */
    const CLASSES = {
      patternHidden: 'pattern--hidden',
      polygon: 'polygon',
      polygonHidden: 'polygon--hidden'
    };

    /**
     * Map of svg paths and points.
     */
    let polygonMap = {
      paths: null,
      points: null
    };

    initBackground();
    $(window).on('window:resize', initBackground);

    function initBackground() {

      let cellSize = 100;

      if ($window.innerWidth < MED_BREAKPOINT) {
        cellSize = 60;
      }

      let pattern = Trianglify({
        width: $window.innerWidth,
        height: $window.innerHeight,
        cell_size: cellSize,
        variance: 0.8,
        stroke_width: 1,
        x_colors: ['#fff', '#f1f1f1', '#999']
      }).svg(); // Render as SVG.

      _mapPolygons(pattern);
    }

    function _mapPolygons(pattern) {

      // Append SVG to pattern container.
      $(SELECTORS.pattern).empty();
      //dm.finishedInit = false;

      requestAnimationFrame(() => {
        $(SELECTORS.pattern).append(pattern);

        $timeout(() => {
          dm.finishedInit = true;
        }, 64);

        // All polygons are hidden now, display the pattern container.
        $(SELECTORS.pattern).removeClass(CLASSES.patternHidden);
      });
     
    }

  }
})();