System.register(["../Subscriber", "../scheduler/async"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    /**
     * Emits a value from the source Observable only after a particular time span
     * has passed without another source emission.
     *
     * <span class="informal">It's like {@link delay}, but passes only the most
     * recent value from each burst of emissions.</span>
     *
     * <img src="./img/debounceTime.png" width="100%">
     *
     * `debounceTime` delays values emitted by the source Observable, but drops
     * previous pending delayed emissions if a new value arrives on the source
     * Observable. This operator keeps track of the most recent value from the
     * source Observable, and emits that only when `dueTime` enough time has passed
     * without any other value appearing on the source Observable. If a new value
     * appears before `dueTime` silence occurs, the previous value will be dropped
     * and will not be emitted on the output Observable.
     *
     * This is a rate-limiting operator, because it is impossible for more than one
     * value to be emitted in any time window of duration `dueTime`, but it is also
     * a delay-like operator since output emissions do not occur at the same time as
     * they did on the source Observable. Optionally takes a {@link Scheduler} for
     * managing timers.
     *
     * @example <caption>Emit the most recent click after a burst of clicks</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var result = clicks.debounceTime(1000);
     * result.subscribe(x => console.log(x));
     *
     * @see {@link auditTime}
     * @see {@link debounce}
     * @see {@link delay}
     * @see {@link sampleTime}
     * @see {@link throttleTime}
     *
     * @param {number} dueTime The timeout duration in milliseconds (or the time
     * unit determined internally by the optional `scheduler`) for the window of
     * time required to wait for emission silence before emitting the most recent
     * source value.
     * @param {Scheduler} [scheduler=async] The {@link Scheduler} to use for
     * managing the timers that handle the timeout for each value.
     * @return {Observable} An Observable that delays the emissions of the source
     * Observable by the specified `dueTime`, and may drop some values if they occur
     * too frequently.
     * @method debounceTime
     * @owner Observable
     */
    function debounceTime(dueTime, scheduler) {
        if (scheduler === void 0) { scheduler = async_1.async; }
        return this.lift(new DebounceTimeOperator(dueTime, scheduler));
    }
    exports_1("debounceTime", debounceTime);
    function dispatchNext(subscriber) {
        subscriber.debouncedNext();
    }
    var Subscriber_1, async_1, DebounceTimeOperator, DebounceTimeSubscriber;
    return {
        setters: [
            function (Subscriber_1_1) {
                Subscriber_1 = Subscriber_1_1;
            },
            function (async_1_1) {
                async_1 = async_1_1;
            }
        ],
        execute: function () {
            DebounceTimeOperator = (function () {
                function DebounceTimeOperator(dueTime, scheduler) {
                    this.dueTime = dueTime;
                    this.scheduler = scheduler;
                }
                DebounceTimeOperator.prototype.call = function (subscriber, source) {
                    return source._subscribe(new DebounceTimeSubscriber(subscriber, this.dueTime, this.scheduler));
                };
                return DebounceTimeOperator;
            }());
            /**
             * We need this JSDoc comment for affecting ESDoc.
             * @ignore
             * @extends {Ignored}
             */
            DebounceTimeSubscriber = (function (_super) {
                __extends(DebounceTimeSubscriber, _super);
                function DebounceTimeSubscriber(destination, dueTime, scheduler) {
                    var _this = _super.call(this, destination) || this;
                    _this.dueTime = dueTime;
                    _this.scheduler = scheduler;
                    _this.debouncedSubscription = null;
                    _this.lastValue = null;
                    _this.hasValue = false;
                    return _this;
                }
                DebounceTimeSubscriber.prototype._next = function (value) {
                    this.clearDebounce();
                    this.lastValue = value;
                    this.hasValue = true;
                    this.add(this.debouncedSubscription = this.scheduler.schedule(dispatchNext, this.dueTime, this));
                };
                DebounceTimeSubscriber.prototype._complete = function () {
                    this.debouncedNext();
                    this.destination.complete();
                };
                DebounceTimeSubscriber.prototype.debouncedNext = function () {
                    this.clearDebounce();
                    if (this.hasValue) {
                        this.destination.next(this.lastValue);
                        this.lastValue = null;
                        this.hasValue = false;
                    }
                };
                DebounceTimeSubscriber.prototype.clearDebounce = function () {
                    var debouncedSubscription = this.debouncedSubscription;
                    if (debouncedSubscription !== null) {
                        this.remove(debouncedSubscription);
                        debouncedSubscription.unsubscribe();
                        this.debouncedSubscription = null;
                    }
                };
                return DebounceTimeSubscriber;
            }(Subscriber_1.Subscriber));
        }
    };
});
//# sourceMappingURL=debounceTime.js.map