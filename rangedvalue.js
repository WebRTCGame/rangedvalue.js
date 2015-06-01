   const range = function range(icurrent, imin, imax, iminHitCallback, imaxHitCallback) {
       'use strict';
       let _minHitCallback,
           _maxHitCallback,
           _current,
           _min,
           _max;

       Object.defineProperties(this, {
           minHitCallback: {
               get: function() {
                   return _minHitCallback;
               },
               set: function(value) {
                   value !== _minHitCallback && ('function' === typeof value) && (_minHitCallback = value);
               },
               enumerable: true,
               configurable: false
           },
           maxHitCallback: {
               get: function() {
                   return _maxHitCallback;
               },
               set: function(value) {
                   value !== _maxHitCallback && ('function' === typeof value) && (_maxHitCallback = value);
               },
               enumerable: true,
               configurable: false
           },
           current: {
               get: function() {
                   return _current;
               },
               set: function(value) {
                   if (value !== _current && ('number' === typeof value)) {
                       _current = this.clamp(value, _min, _max);
                       _current === this.max && this.maxHitCallback();
                       _current === this.min && this.minHitCallback();
                   }
               },
               enumerable: true,
               configurable: false
           },
           min: {
               get: function() {
                   return _min;
               },
               set: function(value) {
                   if (value !== _min && ('number' === typeof value)) {
                       if (value >= this.max) {
                           value = this.max;
                           this.current = value;
                       }
                       if (value >= this.current) {
                           this.current = value;
                       }
                       _min = value;
                   }
               },
               enumerable: true,
               configurable: false
           },
           max: {
               get: function() {
                   return _max;
               },
               set: function(value) {
                   if (value !== _max && ('number' === typeof value)) {
                       if (value <= this.min) {
                           this.min = value;
                           this.current = value;
                       }
                       if (value <= this.current) {
                           this.current = value;
                       }
                       _max = value;
                   }
               },
               enumerable: true,
               configurable: false
           },
           percentage: {
               get: function() {
                   return ((this.current - this.min) / (this.max - this.min)) * 100;
               },
               set: function(value) {
                   if ('number' === typeof value) {
                       this.current = ((this.clamp(value, 0, 100) / 100) * (this.max - this.min)) + this.min;
                   }
               },
               enumerable: true,
               configurable: false
           }
       });
       Object.assign(this, {
           minHitCallback: arguments[3] || (function() {})
       }, {
           maxHitCallback: arguments[4] || (function() {})
       }, {
           max: arguments[2] || 0
       }, {
           min: arguments[1] || 0
       }, {
           current: arguments[0] || 0
       });

       return this;
   };
   range.prototype = {
       toArray: function() {
           return [this.current, this.min, this.max];
       },
       fromArray: function(arrayVal) {
           this.setValues(arrayVal[0], arrayVal[1], arrayVal[2]);
           return this;
       },
       /*test:function(){},*/
       setValues: function(icurrent, imin, imax) {
           this.max = imax;
           this.current = icurrent;
           this.min = imin;
           return this;
       },
       applyFnc: function(func) {
           ('function' === typeof func) && func(this);
           return this;
       },
       shift: function(value) {
           0 !== value && ('number' === typeof value) && (0 < value ? (this.max += value, this.current += value, this.min += value) : (this.min += value, this.current += value, this.max += value));
           return this;
       },
       /*Fix me*/
       shiftByPercent: function(value) {
           const num = ((this.clamp(value, 0, 100) / 100) * (this.max - this.min)) + this.min;
           this.max += num;
           this.current += num;
           this.min += num;
           return this;
       },
       rangeLength: function() {
           return this.max - this.min;
       },
       addPercent: function(value) {
           if (0 !== value && ('number' === typeof value)) {
               const perc = this.clamp(Math.abs(value), 0, 100);
               this.percentage = 0 < value ? this.percentage + perc : this.percentage - perc;
           }
           return this;
       },
       getUnboundPercent: function(value) {
           if ('number' === typeof value) {
               if (value === 0) {
                   return this.min;
               }
               return ((value / 100) * (this.max - this.min)) + this.min;
           }
       },
       addUnboundPercent: function(value) {
           this.current += this.getUnboundPercent(value);
           return this;
       },
       setMinMaintain: function(value) {
           const perc = this.percentage;
           this.min = value;
           this.percentage = perc;
           return this;
       },
       setMaxMaintain: function(value) {
           const perc = this.percentage;
           this.max = value;
           this.percentage = perc;
           return this;
       },
       maximize: function() {
           this.percentage = 100;
           return this;
       },
       minimize: function() {
           this.percentage = 0;
           return this;
       },
       clamp: function(x, a, b) {
           return Math.min(Math.max(x, a), b);
       },
       copyPercent: function(newMin, newMax) {
           return ((this.clamp(this.percentage, 0, 100) / 100) * (newMax - newMin)) + newMin;
       },
       getCurrentInPixelsHLR: function(minPx, maxPx) {

           return this.copyPercent(minPx, maxPx);
       },
       getCurrentInPixelsHRL: function(minPx, maxPx) {},
       getCurrentInPixelsVLR: function(minPy, maxPy) {},
       getCurrentInPixelsVRL: function(minPy, maxPy) {},
       getPercColor: function(){
           return ~~this.copyPercent(0, 255);
       }
   };
