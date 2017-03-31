;(function($) {

    var PageSwitch = (function() {
        function PageSwitch(element, options) {
            this.el = element;
            this.settings = $.extend(true, $.fn.PageSwitch.default, options);
            this.init();
        }

        PageSwitch.prototype = {
            constructor: PageSwitch,

            init: function() {
                var self = this;
                self.selector = self.settings.selector;
                self.sections = self.el.find(self.selector.sections);
                self.section = self.el.find(self.selector.section);

                self.sectionNum = self._countPages();
                self.direction = self._judgeDirection();
                self.index = self._getInitialIndex();

                self.canScroll = true;

                /* renderUI */
                if (!self.direction) {
                    self._renderSections();
                }

                if (self.settings.pagination) {
                    self.page = self.selector.page.slice(1);
                    self.active = self.selector.active.slice(1);
                    self._generatePagination();
                }

                self._bind();
            },

            prev: function() {
                if (this.index > 0) {
                    this.index--;
                } else if (this.settings.loop) {
                    this.index = this.sectionNum - 1;
                } else if (this.index == 0 && !this.settings.loop) {
                    return;
                }
                this._scrollPage();
            },

            next: function() {
                if (this.index < this.sectionNum-1) {
                    this.index++;
                } else if (this.settings.loop) {
                    this.index = 0;
                } else if (this.index == this.sectionNum-1 && !this.settings.loop) {
                    return;
                }
                this._scrollPage();
            },

            _scrollPage: function() {
                var self = this;
                var itemPosition = this.section.eq(this.index).position(),
                    prefix = this._judgePrefix("transition"),
                    str;
                console.log(this.section.eq(this.index).position());
                this.canScroll = false;
                if (!prefix) {
                    str = this.direction ? "translateY(-"+itemPosition.top+"px)" : "translateX(-"+itemPosition.left+"px)";
                    this.sections.css(prefix+"transition", "all "+this.settings.duration+"ms "+this.settings.easing);
                    this.sections.css(prefix+"transform", str);
                } else {
                    str = this.direction ? {"top": "-"+itemPosition.top} : {"left": "-"+itemPosition.left};
                    this.sections.animate(str, this.settings.duration, function() {
                        self.canScroll = true;
                        if (self.settings.callback && $.type(self.settings.callback) == "function") {
                            self.settings.callback();
                        }
                    })
                }

                if (this.settings.pagination) {

                    this.el.find("li").eq(this.index).addClass(this.active).siblings("li").removeClass(this.active);
                }

            },

            _countPages: function() {
                return this.section.length;
            },

            _judgeDirection: function() {
                return this.settings.direction == "vertical";
            },

            _getInitialIndex: function() {
                return (this.settings.index>=0 || this.settings.index<this.sectionNum) ? this.settings.index : 0;
            },

            _generatePagination: function() {
                var htmlStr = "<ul>";
                for (var i=0; i<this.sectionNum; i++) {
                    htmlStr += "<li class='" + this.page + "'></li>";
                }
                htmlStr += "</ul>";
                this.el.append(htmlStr);

                var ulNode = this.el.find("ul"),
                    liNode = ulNode.find("li").eq(this.index);
                if (this.direction) {
                    ulNode.addClass("vertical");
                } else {
                    ulNode.addClass("horizontal");
                }
                liNode.addClass(this.active);
            },

            /* 横屏时渲染 */
            _renderSections: function() {
                this.el.width(this.sectionNum*100 + "%");
                this.section.width((100/this.sectionNum).toFixed(2) + "%").css("float", "left");
            },

            _bind: function() {
                var self = this;

                $(window).on("mousewheel DOMMouseScroll", function(e) {
                    e.preventDefault();
                    var wheelDirection = e.originalEvent.wheelDelta || -e.originalEvent.detail;
                    if (self.canScroll) {
                        if (wheelDirection > 0) {
                            self.prev();
                        } else {
                            self.next();
                        }
                    }
                });

                $(window).on("resize", function() {
                    self._scrollPage();
                    self.canScroll = true;
                });

                if (this.settings.pagination) {
                    this.el.on("click", ".page", function() {
                        self.index = $(this).index();
                        self._scrollPage();
                    })
                }

                if (this.settings.keyboard) {
                    $(window).on("keydown", function(e) {
                        var keyNum = e.originalEvent.keyCode;
                        if (keyNum == 37 || keyNum == 38) {
                            self.prev();
                        } else if (keyNum == 39 || keyNum == 40) {
                            self.next();
                        }
                    });
                }

                this.sections.on("transitionend webkitTransitionEnd", function() {
                    self.canScroll = true;
                    if (self.settings.callback && $.type(self.settings.callback) == "function") {
                        self.settings.callback();
                    }
                });


            },

            _judgePrefix: function(prop) {
                var item = document.createElement("test"),
                    prefixArr = ["webkit", "o", "ms", "moz"],
                    _prop = prop.replace(/^(\w){1}/, prop.match(/^(\w){1}/)[0].toUpperCase());
                for (var i= 0; i<prefixArr.length; i++) {
                    var propName = prefixArr[i] + _prop;
                    if (item.style[propName] !== undefined) {
                        return "-" + prefixArr[i] + "-";
                    }
                }
                return false;
            }
        };

        return PageSwitch;
    })();

    $.fn.PageSwitch = function(options) {
        return this.each(function() {
           var self = $(this),
               instance = self.data("pageSwitch");
            if (!instance) {
                instance = new PageSwitch(self, options);
                self.data("pageSwitch", instance);
            }

            if ($.type(options) == "string") {
                return instance[options]();
            }
        });
    };

    $.fn.PageSwitch.default = {
        selector: {
            sections: ".sections",
            section: ".section",
            page: ".page",
            active: ".active"
        },
        index: 0,
        direction: "vertical",
        loop: false,
        pagination: true,
        keyboard: true,
        easing: "ease",
        duration: 500,
        callback: null
    }

})(jQuery);