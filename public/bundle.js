this.__uniformapp = this.__uniformapp || {};
this.__uniformapp.tracker = (function () {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    var __assign$1 = (undefined && undefined.__assign) || function () {
        __assign$1 = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign$1.apply(this, arguments);
    };
    var CumulativeScoring = function () {
        var identifier = 'cumulative';
        return function (previousValue, valueToAdd, signalCount) {
            var response = __assign$1({}, previousValue);
            var signalNames = Object.keys(valueToAdd);
            signalNames.forEach(function (signal) {
                var weightedValue = valueToAdd[signal] / signalCount;
                response[signal] = (response[signal] || 0) + weightedValue;
            });
            return {
                scoring: response,
                scoringIdentifier: identifier,
                updated: new Date().valueOf()
            };
        };
    };

    var __assign$2 = (undefined && undefined.__assign) || function () {
        __assign$2 = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign$2.apply(this, arguments);
    };
    var defaultConfig = {
        maxDecay: 0.95,
        daysInMonth: 30
    };
    var calculateDifference = function (first, second) {
        var dayDiff = Math.round((first - second) / (1000 * 60 * 60 * 24));
        return dayDiff;
    };
    var calculateDecayRemainder = function (days, daysInMonth, maxDecay) {
        if (!daysInMonth) {
            console.warn('[DecayByDay]: daysInMonth is not populated.');
            return null;
        }
        var decay;
        if (maxDecay) {
            decay = Math.min(maxDecay, days / daysInMonth);
        }
        else {
            decay = days / daysInMonth;
        }
        var remainder = 1 - decay;
        return remainder;
    };
    var DecayByDay = function (parameters) {
        var options = __assign$2(__assign$2({}, defaultConfig), parameters);
        var decayByDay = function (timestamp, scoring) {
            var today = options.today || new Date().valueOf();
            var dayDiff = calculateDifference(today, timestamp);
            var remainderAfterDecay = calculateDecayRemainder(dayDiff, options.daysInMonth, options.maxDecay);
            var response = {};
            Object.keys(scoring).forEach(function (score) {
                var currentValue = scoring[score];
                if (remainderAfterDecay) {
                    response[score] = currentValue * remainderAfterDecay;
                }
            });
            return Promise.resolve(response);
        };
        return decayByDay;
    };

    var SignalType;
    (function (SignalType) {
        SignalType["Cookie"] = "CK";
        SignalType["Event"] = "EVT";
        SignalType["Behavior"] = "BEH";
        SignalType["LandingPage"] = "LP";
        SignalType["PageViewCount"] = "PVW";
        SignalType["PageVisited"] = "PVI";
        SignalType["QueryString"] = "QS";
        SignalType["UTM"] = "UTM";
    })(SignalType || (SignalType = {}));

    function IsCookieSignal(signal) {
        return signal.type == SignalType.Cookie;
    }

    function IsEventSignal(signal) {
        return signal.type == SignalType.Event;
    }

    function IsBehaviorSignal(signal) {
        return signal.type == SignalType.Behavior;
    }

    function IsLandingPageSignal(signal) {
        return signal.type == SignalType.LandingPage;
    }

    function IsPageViewCountSignal(signal) {
        return signal.type == SignalType.PageViewCount;
    }

    function IsPageVisitedSignal(signal) {
        return signal.type == SignalType.PageVisited;
    }

    function IsQueryStringSignal(signal) {
        return signal.type == SignalType.QueryString;
    }

    // long term, want more types i.e. 'regex', 'substring', 'wildcard'
    // these types may contain additional props i.e. indexes for substring, or options like /i for regex
    /** Tests if a StringMatch matches a string value */
    function IsStringMatch(value, match) {
        var _a, _b;
        var localValue = value;
        var localExpr = match.expr;
        switch (match.type) {
            case 'exact':
                if (!match.cs) {
                    _a = CaseDesensitize(localValue, localExpr), localValue = _a[0], localExpr = _a[1];
                }
                return localValue === localExpr;
            case 'contains':
                if (!match.cs) {
                    _b = CaseDesensitize(localValue, localExpr), localValue = _b[0], localExpr = _b[1];
                }
                return localValue.includes(localExpr);
            default:
                console.warn("Unknown string match type " + match.type + " will be ignored.");
                return false;
        }
    }
    function CaseDesensitize() {
        var exprs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            exprs[_i] = arguments[_i];
        }
        return exprs.map(function (e) { return e.toUpperCase(); });
    }

    function IsUTMSignal(signal) {
        return signal.type == SignalType.UTM;
    }

    var behaviorSignalEvaluator = function (signal, state) {
        if (!IsBehaviorSignal(signal)) {
            return 0;
        }
        var intent = state.intent;
        var id = intent.id;
        var signalValue = 0;
        state.behaviour.forEach(function (evt) {
            var value = evt[id];
            if (value) {
                signalValue = value;
            }
        });
        return signalValue;
    };

    var getCookie = function (name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        }
    };
    var cookieSignalEvaluator = function (signal) {
        if (!IsCookieSignal(signal)) {
            return 0;
        }
        var cookieValue = getCookie(signal.parameter);
        if (!cookieValue) {
            return 0;
        }
        var isMatch = IsStringMatch(cookieValue, signal.value);
        return isMatch ? signal.str : 0;
    };

    var eventSignalEvaluator = function (signal) {
        if (!IsEventSignal(signal)) {
            return 0;
        }
        return 0;
    };

    var landingPageSignalEvaluator = function (signal) {
        if (!IsLandingPageSignal(signal)) {
            return 0;
        }
        return 0;
    };

    var pageViewCountSignalEvaluator = function (signal) {
        if (!IsPageViewCountSignal(signal)) {
            return 0;
        }
        return 0;
    };

    var pageVisitedSignalEvaluator = function (signal) {
        if (!IsPageVisitedSignal(signal)) {
            return 0;
        }
        return 0;
    };

    var utmSignalEvaluator = function (signal) {
        if (!IsUTMSignal(signal)) {
            return 0;
        }
        var urlParams = new URLSearchParams(window.location.search);
        var parameterValue = urlParams.get(signal.parameter);
        var score = 0;
        if (parameterValue && IsStringMatch(parameterValue, signal.value)) {
            score = signal.str;
        }
        return score;
    };

    var queryStringSignalEvaluator = function (signal) {
        if (!IsQueryStringSignal(signal)) {
            return 0;
        }
        var urlParams = new URLSearchParams(window.location.search);
        var parameterValue = urlParams.get(signal.parameter);
        var score = 0;
        if (parameterValue && IsStringMatch(parameterValue, signal.value)) {
            score = signal.str;
        }
        return score;
    };

    var __assign$3 = (undefined && undefined.__assign) || function () {
        __assign$3 = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign$3.apply(this, arguments);
    };
    var buildSignalMapping = function (overrides) {
        var _a;
        return __assign$3((_a = {}, _a[SignalType.Cookie] = cookieSignalEvaluator, _a[SignalType.UTM] = utmSignalEvaluator, _a[SignalType.Behavior] = behaviorSignalEvaluator, _a[SignalType.Event] = eventSignalEvaluator, _a[SignalType.LandingPage] = landingPageSignalEvaluator, _a[SignalType.PageViewCount] = pageViewCountSignalEvaluator, _a[SignalType.PageVisited] = pageVisitedSignalEvaluator, _a[SignalType.QueryString] = queryStringSignalEvaluator, _a), overrides || {});
    };
    var DefaultSignalFactory = function (parameters) {
        var mappings = buildSignalMapping(parameters === null || parameters === void 0 ? void 0 : parameters.overrides);
        return function (signal) {
            var evaluator = mappings[signal.type];
            return evaluator;
        };
    };

    var calculateScore = function (itemBiasing, classification) {
        var score = 0;
        var hasBiasingKeys = false;
        var biasingKeys = null;
        if (itemBiasing) {
            biasingKeys = Object.keys(itemBiasing);
            hasBiasingKeys = biasingKeys.length > 0;
        }
        if (classification && biasingKeys) {
            biasingKeys.forEach(function (key) {
                score += classification[key] || 0;
            });
        }
        var isDefault = itemBiasing == null || !hasBiasingKeys;
        return { score: score, isDefault: isDefault };
    };
    var listPersonalizer = function (list, classification) {
        var wasAnythingScored = false;
        var scoredItems = list.map(function (listItem) {
            var _a = calculateScore(listItem.behaviorIntents, classification), score = _a.score, isDefault = _a.isDefault;
            if (score) {
                wasAnythingScored = true;
            }
            return {
                item: listItem,
                score: score,
                isDefault: isDefault
            };
        });
        if (wasAnythingScored) {
            scoredItems.sort(function (a, b) { return (b.score > a.score) ? 1 : -1; });
        }
        else {
            // If nothing was scored, sort default items first.
            scoredItems.sort(function (a, b) { return (Number(b.isDefault) > Number(a.isDefault)) ? 1 : -1; });
        }
        var responseItems = scoredItems.map(function (scoredItem) { return scoredItem.item; });
        return responseItems;
    };

    var __assign$4 = (undefined && undefined.__assign) || function () {
        __assign$4 = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign$4.apply(this, arguments);
    };
    var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    var TrackerInitializer = function (loadedCallback) {
        var storageLoaded = false;
        var intentMappingsLoaded = false;
        var isLoaded = function () {
            return storageLoaded && intentMappingsLoaded;
        };
        var stateChanged = function () {
            var loaded = isLoaded();
            if (loaded) {
                loadedCallback();
            }
        };
        var setStorageLoaded = function () {
            storageLoaded = true;
            stateChanged();
        };
        var setIntentMappingsLoaded = function () {
            intentMappingsLoaded = true;
            stateChanged();
        };
        return {
            setStorageLoaded: setStorageLoaded,
            setIntentMappingsLoaded: setIntentMappingsLoaded,
            isLoaded: isLoaded
        };
    };
    var OptimizeTracker = /** @class */ (function () {
        function OptimizeTracker(options) {
            var _this = this;
            this._listeners = [];
            this._itentMappings = [];
            this._behaviorValues = [];
            this._initializer = TrackerInitializer(function () { return _this.onTrackerInitialized(); });
            this._plugins = options.plugins;
            this._storage = this.findAvailableStorage(options.storage);
            this._scoringStrategy = options.scoring || CumulativeScoring();
            this._decayStrategy = options.decay || DecayByDay();
            this._intentManifestStrategy = options.intentManifest;
            this._signalFactory = DefaultSignalFactory();
            this._logger = options.logger;
        }
        OptimizeTracker.prototype.onTrackerInitialized = function () {
            this.reevaluateSignals();
        };
        OptimizeTracker.prototype.reevaluateSignals = function () {
            var _this = this;
            if (!this._itentMappings || !this._itentMappings.length) {
                console.warn('[Tracker]: Intent Mappings Not Populated');
                return;
            }
            var numberOfMatches = 0;
            var matches = {};
            this._itentMappings.forEach(function (intent) {
                var id = intent.id, signals = intent.signals;
                if (signals) {
                    signals.forEach(function (signal) {
                        var evaluator = _this._signalFactory(signal);
                        if (evaluator) {
                            var value = evaluator(signal, {
                                intent: intent,
                                behaviour: _this._behaviorValues
                            });
                            if (value) {
                                if (!matches[id]) {
                                    matches[id] = 0;
                                }
                                matches[id] += value;
                                ++numberOfMatches;
                            }
                        }
                        else {
                            console.warn("[Tracker]: Signal " + signal.type + " is not defined in signal factory.");
                        }
                    });
                }
                else {
                    console.warn("[Tracker]: Intent " + id + " does not define any signals.");
                }
            });
            this.bias(matches, numberOfMatches);
            if (this._behaviorValues.length) {
                this._behaviorValues.splice(0, this._behaviorValues.length);
            }
        };
        OptimizeTracker.prototype.loadIntentMapping = function () {
            var _this = this;
            if (this._intentManifestStrategy) {
                this._intentManifestStrategy(function (intents) { return _this.addIntentMappings(intents); });
            }
            else {
                console.log('[Tracker]: Intent Mapping Strategy Not Configured');
            }
        };
        OptimizeTracker.prototype.addIntentMappings = function (intents) {
            var _a;
            var _b, _c;
            if (Array.isArray(intents)) {
                (_b = this._logger) === null || _b === void 0 ? void 0 : _b.info('Received Intents', intents);
                (_a = this._itentMappings).push.apply(_a, intents);
            }
            else {
                (_c = this._logger) === null || _c === void 0 ? void 0 : _c.info('Received Intent', intents);
                this._itentMappings.push(intents);
            }
            this._initializer.setIntentMappingsLoaded();
        };
        OptimizeTracker.prototype.findAvailableStorage = function (allStorage) {
            var storage = allStorage === null || allStorage === void 0 ? void 0 : allStorage.find(function (storage) { return storage.isSupported(); });
            return storage;
        };
        OptimizeTracker.prototype.initialize = function () {
            return __awaiter(this, void 0, void 0, function () {
                var storeData, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.loadIntentMapping();
                            this.loadPlugins();
                            return [4 /*yield*/, this.loadStorage()];
                        case 1:
                            storeData = _b.sent();
                            _a = this;
                            return [4 /*yield*/, this.processStoredData(storeData)];
                        case 2:
                            _a._scoring = _b.sent();
                            this._initializer.setStorageLoaded();
                            return [2 /*return*/];
                    }
                });
            });
        };
        OptimizeTracker.prototype.processStoredData = function (storeData) {
            return __awaiter(this, void 0, void 0, function () {
                var scoring;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!storeData || !storeData.scoring) {
                                return [2 /*return*/, null];
                            }
                            scoring = storeData.scoring;
                            if (!this._decayStrategy) return [3 /*break*/, 2];
                            return [4 /*yield*/, this._decayStrategy(storeData.updated, storeData.scoring)];
                        case 1:
                            scoring = _a.sent();
                            _a.label = 2;
                        case 2: return [2 /*return*/, __assign$4(__assign$4({}, storeData), { scoring: scoring })];
                    }
                });
            });
        };
        OptimizeTracker.prototype.loadStorage = function () {
            var _a, _b, _c;
            return __awaiter(this, void 0, void 0, function () {
                var storeData;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            (_a = this._logger) === null || _a === void 0 ? void 0 : _a.info('Loading Scoring From Storage');
                            return [4 /*yield*/, ((_b = this._storage) === null || _b === void 0 ? void 0 : _b.load())];
                        case 1:
                            storeData = _d.sent();
                            (_c = this._logger) === null || _c === void 0 ? void 0 : _c.info('Loaded Scoring From Storage', storeData);
                            return [2 /*return*/, storeData];
                    }
                });
            });
        };
        OptimizeTracker.prototype.writeToStorage = function () {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var dataToWrite;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this._storage || !this._scoring) {
                                return [2 /*return*/, false];
                            }
                            dataToWrite = __assign$4(__assign$4({}, this._scoring), { updated: new Date().valueOf() });
                            return [4 /*yield*/, ((_a = this._storage) === null || _a === void 0 ? void 0 : _a.save(dataToWrite))];
                        case 1:
                            _b.sent();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        OptimizeTracker.prototype.loadPlugins = function () {
            var _a;
            (_a = this._plugins) === null || _a === void 0 ? void 0 : _a.forEach(function (plugin) { return plugin.initialize(); });
        };
        OptimizeTracker.prototype.getClassification = function () {
            if (!this._scoring) {
                return null;
            }
            return this._scoring.scoring;
        };
        OptimizeTracker.prototype.bias = function (biasingValues, signalCount) {
            var _a;
            this._scoring = this._scoringStrategy(((_a = this._scoring) === null || _a === void 0 ? void 0 : _a.scoring) || {}, biasingValues, signalCount);
            var classification = this.getClassification();
            this._listeners.forEach(function (listener) { return listener(classification); });
            this.writeToStorage(); // yolo
        };
        OptimizeTracker.prototype.addBehaviour = function (biasingValues) {
            this._behaviorValues.push(biasingValues);
        };
        OptimizeTracker.prototype.addScoringChangeListener = function (listener) {
            this._listeners.push(listener);
        };
        OptimizeTracker.prototype.removeScoringChangeListener = function (listener) {
            var position = this._listeners.indexOf(listener);
            if (position > -1) {
                this._listeners.splice(position, 1);
            }
        };
        OptimizeTracker.prototype.personalizeList = function (list) {
            var classification = this.getClassification();
            var personalizedList = listPersonalizer(list, classification);
            return personalizedList;
        };
        return OptimizeTracker;
    }());

    var embedIntentManifest = function (intentManifest) {
        return function (callback) {
            callback(intentManifest.site.intents);
        };
    };

    var log = function (level, message, data) {
        console.log(new Date().toISOString() + " [Uniform Tracker  " + level + "] " + message, data);
        return Promise.resolve();
    };
    var consoleLogger = function () {
        return {
            debug: function (message, data) { return log('DEBUG', message, data); },
            error: function (message, data) { return log('ERROR', message, data); },
            info: function (message, data) { return log('INFO', message, data); },
            trace: function (message, data) { return log('TRACE', message, data); },
            warn: function (message, data) { return log('WARN', message, data); }
        };
    };

    var InMemoryTrackerStorage = /** @class */ (function () {
        function InMemoryTrackerStorage() {
        }
        InMemoryTrackerStorage.prototype.isSupported = function () {
            return true;
        };
        InMemoryTrackerStorage.prototype.save = function (data) {
            return Promise.resolve();
        };
        InMemoryTrackerStorage.prototype.load = function () {
            return Promise.resolve(null);
        };
        return InMemoryTrackerStorage;
    }());
    function InitializeLocalStorage() {
        return new InMemoryTrackerStorage();
    }

    var GoogleAnalyticsTrackerPlugin = /** @class */ (function () {
        function GoogleAnalyticsTrackerPlugin() {
        }
        GoogleAnalyticsTrackerPlugin.prototype.initialize = function () {
        };
        return GoogleAnalyticsTrackerPlugin;
    }());
    function InitializeGoogleAnalytics() {
        return new GoogleAnalyticsTrackerPlugin();
    }

    var LocalStorageTrackerStorage = /** @class */ (function () {
        function LocalStorageTrackerStorage(options) {
            this._storageKey = (options === null || options === void 0 ? void 0 : options.storageKey) || 'tracking';
            this._testStorageKey = (options === null || options === void 0 ? void 0 : options.testStorageKey) || 'test';
        }
        LocalStorageTrackerStorage.prototype.isSupported = function () {
            try {
                localStorage.setItem(this._testStorageKey, 'test');
                localStorage.removeItem(this._testStorageKey);
                return true;
            }
            catch (e) {
                return false;
            }
        };
        LocalStorageTrackerStorage.prototype.save = function (data) {
            localStorage.setItem(this._storageKey, JSON.stringify(data));
            return Promise.resolve();
        };
        LocalStorageTrackerStorage.prototype.load = function () {
            var value = localStorage.getItem(this._storageKey);
            if (value) {
                try {
                    var parsed = JSON.parse(value);
                    return Promise.resolve(parsed);
                }
                catch (_a) {
                    console.log('error parsing localstorage data');
                }
            }
            return Promise.resolve(null);
        };
        return LocalStorageTrackerStorage;
    }());
    function InitializeLocalStorage$1(options) {
        return new LocalStorageTrackerStorage(options);
    }

    var defaultTrackerConfiguration = {
        plugins: [
            InitializeGoogleAnalytics()
        ],
        storage: [
            InitializeLocalStorage$1(),
            InitializeLocalStorage()
        ],
        logger: consoleLogger()
    };
    var trackerInitializer = function () {
        var getIntentManifest = function (location) {
            return location.__uniformapp.data;
        };
        var getTrackerOptions = function (location) {
            var intentManifest = getIntentManifest(location);
            return __assign(__assign({}, defaultTrackerConfiguration), { intentManifest: embedIntentManifest(intentManifest) });
        };
        var initializeTracker = function (configObject) {
            if (configObject === void 0) { configObject = window; }
            var options = getTrackerOptions(configObject);
            return new OptimizeTracker(options);
        };
        return initializeTracker;
    };
    var index = trackerInitializer();

    return index;

}());
