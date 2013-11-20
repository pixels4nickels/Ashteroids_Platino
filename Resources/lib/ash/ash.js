/**
 * A lightweight inheritance API which is very similar to the 
 * John Resig's Simple Inheritance API.
 *
 * Original author: Axel Rauschmayer
 * Original code: https://github.com/rauschma/class-js
 
* Code examples

// Superclass
var Person = Class.extend({
    constructor: function (name) {
        this.name = name;
    },
    describe: function() {
        return "Person called "+this.name;
    }
});

// Subclass
var Worker = Person.extend({
    constructor: function (name, title) {
        Worker.super.constructor.call(this, name);
        this.title = title;
    },
    describe: function () {
        return Worker.super.describe.call(this)+" ("+this.title+")"; // (*)
    }
});
var jane = new Worker("Jane", "CTO"); 
 */

    var Class = {
        
        extend: function (properties) {
            var superProto = this.prototype || Class;
            var proto = Object.create(superProto);
            // This method will be attached to many constructor functions
            // => must refer to "Class" via its global name (and not via "this")
            Class.copyOwnTo(properties, proto);
            
            var constr = proto.constructor;
            if (!(constr instanceof Function)) {
                throw new Error("You must define a method 'constructor'");
            }
            // Set up the constructor
            constr.prototype = proto;
            constr.super = superProto;
            constr.extend = this.extend; // inherit class method
            return constr;
        },
    
        copyOwnTo: function(source, target) {
            Object.getOwnPropertyNames(source).forEach(function(propName) {
                Object.defineProperty(target, propName,
                    Object.getOwnPropertyDescriptor(source, propName));
            });
            return target;
        }
    };

   // return Class;


/**
 * Ash-js Family
 */

    var Family = Class.extend({
        nodes: null,
        
        constructor: function (nodeObject, engine) {
            this.__defineGetter__("nodeList", function() {
                return this.nodes;
            });
        },

        newEntity: function (entity) {
            throw new Error( 'should be overriden' );
        },

        removeEntity: function (entity) {
            throw new Error( 'should be overriden' );
        },

        componentAddedToEntity: function (entity, componentClass) {
            throw new Error( 'should be overriden' );
        },

        componentRemovedFromEntity: function (entity, componentClass) {
            throw new Error( 'should be overriden' );
        },

        cleanUp: function () {
            throw new Error( 'should be overriden' );
        }
    });

   // return Family;


/**
 * Ash-js Node Pool
 */

    var NodePool = Class.extend({
        tail: null,
        cacheTail: null,
        nodeClass: null,
		components : null,
		
        constructor: function (nodeClass, components) {
            this.nodeClass = nodeClass;
			this.components = components;
        },

        get: function() {
            if( this.tail ) {
                var node = this.tail;
                this.tail = this.tail.previous;
                node.previous = null;
                return node;
            } else {
                return new this.nodeClass();
            }
        },

        dispose: function( node ) {
			this.components.forEach(function(componentClass, componentName) {
				node[componentName] = null;
			});
			node.entity = null;
            node.next = null;
            node.previous = this.tail;
            this.tail = node;
        },

        cache: function( node ) {
            node.previous = this.cacheTail;
            this.cacheTail = node;
        },

        releaseCache: function() {
            while( this.cacheTail ) {
                var node = this.cacheTail;
                this.cacheTail = node.previous;
                this.dispose( node );
            }
        }
    });

    //return NodePool;


/*jslint onevar:true, undef:true, newcap:true, regexp:true, bitwise:true, maxerr:50, indent:4, white:false, nomen:false, plusplus:false */
/*global define:false, require:false, exports:false, module:false*/

/** @license
 * JS Signals <http://millermedeiros.github.com/js-signals/>
 * Released under the MIT license
 * Author: Miller Medeiros
 * Version: 0.7.4 - Build: 252 (2012/02/24 10:30 PM)
 */

    /**
     * @namespace Signals Namespace - Custom event/messaging system based on AS3 Signals
     * @name signals
     */
    var signals = /** @lends signals */{
        /**
         * Signals Version Number
         * @type String
         * @const
         */
        VERSION : '0.7.4'
    };


    // SignalBinding -------------------------------------------------
    //================================================================

    /**
     * Object that represents a binding between a Signal and a listener function.
     * <br />- <strong>This is an internal constructor and shouldn't be called by regular users.</strong>
     * <br />- inspired by Joa Ebert AS3 SignalBinding and Robert Penner's Slot classes.
     * @author Miller Medeiros
     * @constructor
     * @internal
     * @name signals.SignalBinding
     * @param {signals.Signal} signal Reference to Signal object that listener is currently bound to.
     * @param {Function} listener Handler function bound to the signal.
     * @param {boolean} isOnce If binding should be executed just once.
     * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
     * @param {Number} [priority] The priority level of the event listener. (default = 0).
     */
    function SignalBinding(signal, listener, isOnce, listenerContext, priority) {

        /**
         * Handler function bound to the signal.
         * @type Function
         * @private
         */
        this._listener = listener;

        /**
         * If binding should be executed just once.
         * @type boolean
         * @private
         */
        this._isOnce = isOnce;

        /**
         * Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @memberOf signals.SignalBinding.prototype
         * @name context
         * @type Object|undefined|null
         */
        this.context = listenerContext;

        /**
         * Reference to Signal object that listener is currently bound to.
         * @type signals.Signal
         * @private
         */
        this._signal = signal;

        /**
         * Listener priority
         * @type Number
         * @private
         */
        this._priority = priority || 0;
    }

    SignalBinding.prototype = /** @lends signals.SignalBinding.prototype */ {

        /**
         * If binding is active and should be executed.
         * @type boolean
         */
        active : true,

        /**
         * Default parameters passed to listener during `Signal.dispatch` and `SignalBinding.execute`. (curried parameters)
         * @type Array|null
         */
        params : null,

        /**
         * Call listener passing arbitrary parameters.
         * <p>If binding was added using `Signal.addOnce()` it will be automatically removed from signal dispatch queue, this method is used internally for the signal dispatch.</p>
         * @param {Array} [paramsArr] Array of parameters that should be passed to the listener
         * @return {*} Value returned by the listener.
         */
        execute : function (paramsArr) {
            var handlerReturn, params;
            if (this.active && !!this._listener) {
                params = this.params? this.params.concat(paramsArr) : paramsArr;
                handlerReturn = this._listener.apply(this.context, params);
                if (this._isOnce) {
                    this.detach();
                }
            }
            return handlerReturn;
        },

        /**
         * Detach binding from signal.
         * - alias to: mySignal.remove(myBinding.getListener());
         * @return {Function|null} Handler function bound to the signal or `null` if binding was previously detached.
         */
        detach : function () {
            return this.isBound()? this._signal.remove(this._listener, this.context) : null;
        },

        /**
         * @return {Boolean} `true` if binding is still bound to the signal and have a listener.
         */
        isBound : function () {
            return (!!this._signal && !!this._listener);
        },

        /**
         * @return {Function} Handler function bound to the signal.
         */
        getListener : function () {
            return this._listener;
        },

        /**
         * Delete instance properties
         * @private
         */
        _destroy : function () {
            delete this._signal;
            delete this._listener;
            delete this.context;
        },

        /**
         * @return {boolean} If SignalBinding will only be executed once.
         */
        isOnce : function () {
            return this._isOnce;
        },

        /**
         * @return {string} String representation of the object.
         */
        toString : function () {
            return '[SignalBinding isOnce:' + this._isOnce +', isBound:'+ this.isBound() +', active:' + this.active + ']';
        }

    };


/*global signals:false, SignalBinding:false*/

    // Signal --------------------------------------------------------
    //================================================================

    function validateListener(listener, fnName) {
        if (typeof listener !== 'function') {
            throw new Error( 'listener is a required param of {fn}() and should be a Function.'.replace('{fn}', fnName) );
        }
    }

    /**
     * Custom event broadcaster
     * <br />- inspired by Robert Penner's AS3 Signals.
     * @author Miller Medeiros
     * @constructor
     */
    signals.Signal = function () {
        /**
         * @type Array.<SignalBinding>
         * @private
         */
        this._bindings = [];
        this._prevParams = null;
    };

    signals.Signal.prototype = {

        /**
         * If Signal should keep record of previously dispatched parameters and
         * automatically execute listener during `add()`/`addOnce()` if Signal was
         * already dispatched before.
         * @type boolean
         */
        memorize : false,

        /**
         * @type boolean
         * @private
         */
        _shouldPropagate : true,

        /**
         * If Signal is active and should broadcast events.
         * <p><strong>IMPORTANT:</strong> Setting this property during a dispatch will only affect the next dispatch, if you want to stop the propagation of a signal use `halt()` instead.</p>
         * @type boolean
         */
        active : true,

        /**
         * @param {Function} listener
         * @param {boolean} isOnce
         * @param {Object} [listenerContext]
         * @param {Number} [priority]
         * @return {SignalBinding}
         * @private
         */
        _registerListener : function (listener, isOnce, listenerContext, priority) {
            var prevIndex = this._indexOfListener(listener, listenerContext),
                binding;

            if (prevIndex !== -1) {
                binding = this._bindings[prevIndex];
                if (binding.isOnce() !== isOnce) {
                    throw new Error('You cannot add'+ (isOnce? '' : 'Once') +'() then add'+ (!isOnce? '' : 'Once') +'() the same listener without removing the relationship first.');
                }
            } else {
                binding = new SignalBinding(this, listener, isOnce, listenerContext, priority);
                this._addBinding(binding);
            }

            if(this.memorize && this._prevParams){
                binding.execute(this._prevParams);
            }

            return binding;
        },

        /**
         * @param {SignalBinding} binding
         * @private
         */
        _addBinding : function (binding) {
            //simplified insertion sort
            var n = this._bindings.length;
            do { --n; } while (this._bindings[n] && binding._priority <= this._bindings[n]._priority);
            this._bindings.splice(n + 1, 0, binding);
        },

        /**
         * @param {Function} listener
         * @return {number}
         * @private
         */
        _indexOfListener : function (listener, context) {
            var n = this._bindings.length,
                cur;
            while (n--) {
                cur = this._bindings[n];
                if (cur._listener === listener && cur.context === context) {
                    return n;
                }
            }
            return -1;
        },

        /**
         * Check if listener was attached to Signal.
         * @param {Function} listener
         * @param {Object} [context]
         * @return {boolean} if Signal has the specified listener.
         */
        has : function (listener, context) {
            return this._indexOfListener(listener, context) !== -1;
        },

        /**
         * Add a listener to the signal.
         * @param {Function} listener Signal handler function.
         * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param {Number} [priority] The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         * @return {SignalBinding} An Object representing the binding between the Signal and listener.
         */
        add : function (listener, listenerContext, priority) {
            validateListener(listener, 'add');
            return this._registerListener(listener, false, listenerContext, priority);
        },

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         * @param {Function} listener Signal handler function.
         * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param {Number} [priority] The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         * @return {SignalBinding} An Object representing the binding between the Signal and listener.
         */
        addOnce : function (listener, listenerContext, priority) {
            validateListener(listener, 'addOnce');
            return this._registerListener(listener, true, listenerContext, priority);
        },

        /**
         * Remove a single listener from the dispatch queue.
         * @param {Function} listener Handler function that should be removed.
         * @param {Object} [context] Execution context (since you can add the same handler multiple times if executing in a different context).
         * @return {Function} Listener handler function.
         */
        remove : function (listener, context) {
            validateListener(listener, 'remove');

            var i = this._indexOfListener(listener, context);
            if (i !== -1) {
                this._bindings[i]._destroy(); //no reason to a SignalBinding exist if it isn't attached to a signal
                this._bindings.splice(i, 1);
            }
            return listener;
        },

        /**
         * Remove all listeners from the Signal.
         */
        removeAll : function () {
            var n = this._bindings.length;
            while (n--) {
                this._bindings[n]._destroy();
            }
            this._bindings.length = 0;
        },

        /**
         * @return {number} Number of listeners attached to the Signal.
         */
        getNumListeners : function () {
            return this._bindings.length;
        },

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         * <p><strong>IMPORTANT:</strong> should be called only during signal dispatch, calling it before/after dispatch won't affect signal broadcast.</p>
         * @see signals.Signal.prototype.disable
         */
        halt : function () {
            this._shouldPropagate = false;
        },

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         * @param {...*} [params] Parameters that should be passed to each handler.
         */
        dispatch : function (params) {
            if (! this.active) {
                return;
            }

            var paramsArr = Array.prototype.slice.call(arguments),
                n = this._bindings.length,
                bindings;

            if (this.memorize) {
                this._prevParams = paramsArr;
            }

            if (! n) {
                //should come after memorize
                return;
            }

            bindings = this._bindings.slice(); //clone array in case add/remove items during dispatch
            this._shouldPropagate = true; //in case `halt` was called before dispatch or during the previous dispatch.

            //execute all callbacks until end of the list or until a callback returns `false` or stops propagation
            //reverse loop since listeners with higher priority will be added at the end of the list
            do { n--; } while (bindings[n] && this._shouldPropagate && bindings[n].execute(paramsArr) !== false);
        },

        /**
         * Forget memorized arguments.
         * @see signals.Signal.memorize
         */
        forget : function(){
            this._prevParams = null;
        },

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         * <p><strong>IMPORTANT:</strong> calling any method on the signal instance after calling dispose will throw errors.</p>
         */
        dispose : function () {
            this.removeAll();
            delete this._bindings;
            delete this._prevParams;
        },

        /**
         * @return {string} String representation of the object.
         */
        toString : function () {
            return '[Signal active:'+ this.active +' numListeners:'+ this.getNumListeners() +']';
        }

    };


    //module.exports = signals;


/**
 * Ash-js Node List
 */

    var NodeList = Class.extend({
        constructor: function () {
            this.head = null;
            this.tail = null;
            this.nodeAdded = new signals.Signal();
            this.nodeRemoved = new signals.Signal();
        },
        
        add: function( node ) {
            if( !this.head ) {
                this.head = this.tail = node;
            } else {
                this.tail.next = node;
                node.previous = this.tail;
                this.tail = node;
            }
            this.nodeAdded.dispatch( node );
        },
        
        remove: function( node ) {
            if( this.head == node ) {
                this.head = this.head.next;
            }
            if( this.tail == node ) {
                this.tail = this.tail.previous;
            }
            if( node.previous ) {
                node.previous.next = node.next;
            }
            if( node.next ) {
                node.next.previous = node.previous;
            }
            this.nodeRemoved.dispatch( node );
        },
        
        removeAll: function() {
            while( this.head ) {
                var node = this.head;
                this.head = node.next;
                node.previous = null;
                node.next = null;
                this.nodeRemoved.dispatch( node );
            }
            this.tail = null;
        },
        
        empty: function() {
            return this.head === null;
        },
        
        swap: function( node1, node2 ) {
            if( node1.previous == node2 ) {
                node1.previous = node2.previous;
                node2.previous = node1;
                node2.next = node1.next;
                node1.next = node2;
            } else if( node2.previous == node1 ) {
                node2.previous = node1.previous;
                node1.previous = node2;
                node1.next = node2.next;
                node2.next = node1;
            } else {
                var temp = node1.previous;
                node1.previous = node2.previous;
                node2.previous = temp;
                temp = node1.next;
                node1.next = node2.next;
                node2.next = temp;
            }
            if( this.head == node1 ) {
                this.head = node2;
            } else if( this.head == node2 ) {
                this.head = node1;
            }
            if( this.tail == node1 ) {
                this.tail = node2;
            } else if( this.tail == node2 ) {
                this.tail = node1;
            }
            if( node1.previous ) {
                node1.previous.next = node1;
            }
            if( node2.previous ) {
                node2.previous.next = node2;
            }
            if( node1.next ) {
                node1.next.previous = node1;
            }
            if( node2.next ) {
                node2.next.previous = node2;
            }
        },
        
        insertionSort: function( sortFunction ) {
            if( this.head == this.tail ) {
                return;
            }
            var remains = this.head.next;
            for( var node = remains; node; node = remains ) {
                remains = node.next;
                for( var other = node.previous; other; other = other.previous ) {
                    if( sortFunction( node, other ) >= 0 ) {
                        if( node != other.next ) {
                            if( this.tail == node ) {
                                this.tail = node.previous;
                            }
                            node.previous.next = node.next;
                            if( node.next ) {
                                node.next.previous = node.previous;
                            }
                            node.next = other.next;
                            node.previous = other;
                            node.next.previous = node;
                            other.next = node;
                        }
                        break;
                    }
                }
                if( !other ) {
                    if( this.tail == node ) {
                        this.tail = node.previous;
                    }
                    node.previous.next = node.next;
                    if( node.next ) {
                        node.next.previous = node.previous;
                    }
                    node.next = this.head;
                    this.head.previous = node;
                    node.previous = null;
                    this.head = node;
                }
            }
        },
        
        mergeSort: function( sortFunction ) {
            if( this.head == this.tail ) {
                return;
            }
            var lists = [],
                start = this.head,
                end;
            while( start ) {
                end = start;
                while( end.next && sortFunction( end, end.next ) <= 0 ) {
                    end = end.next;
                }
                var next = end.next;
                start.previous = end.next = null;
                lists.push( start );
                start = next;
            }
            while( lists.length > 1 ) {
                lists.push( this.merge( lists.shift(), lists.shift(), sortFunction ) );
            }
            this.tail = this.head = lists[0];
            while( this.tail.next ) {
                this.tail = this.tail.next;
            }
        },
        
        merge: function( head1, head2, sortFunction ) {
            var node,
                head;
            if( sortFunction( head1, head2 ) <= 0 ) {
                head = node = head1;
                head1 = head1.next;
            } else {
                head = node = head2;
                head2 = head2.next;
            }
            while( head1 && head2 ) {
                if( sortFunction( head1, head2 ) <= 0 ) {
                    node.next = head1;
                    head1.previous = node;
                    node = head1;
                    head1 = head1.next;
                } else {
                    node.next = head2;
                    head2.previous = node;
                    node = head2;
                    head2 = head2.next;
                }
            }
            if( head1 ) {
                node.next = head1;
                head1.previous = node;
            } else {
                node.next = head2;
                head2.previous = node;
            }
            return head;
        }
    });

   // return NodeList;


/**
 * Dictionary
 *
 * @author Brett Jephson
 */

    var Dictionary = Class.extend({
        VERSION: '0.1.0',
        keys: null,
        values: null,

        constructor: function () {
            this.keys = [];
            this.values = [];
            return this;
        },

        add: function (key, value) {
            var keyIndex = this.getIndex(key);
            if(keyIndex >= 0) {
                this.values[keyIndex] = value;
            } else {
                this.keys.push(key);
                this.values.push(value);
            }
        },

        remove: function (key) {
            var keyIndex = this.getIndex(key);
            if(keyIndex >= 0) {
                this.keys.splice(keyIndex, 1);
                this.values.splice(keyIndex, 1);
            } else {
                throw 'Key does not exist';
            }
        },

        retrieve: function (key) {
            var value = null;
            var keyIndex = this.getIndex(key);
            if(keyIndex >= 0) {
                value = this.values[ keyIndex ];
            }
            return value;
        },

        getIndex: function (testKey) {
            var i = 0,
                len = this.keys.length,
                key;
            for(; i<len; ++i){
                key = this.keys[i];
                if(key == testKey) {
                    return i;
                }
            }
            return -1;
        },

        has: function (testKey) {
            var i = 0,
                len = this.keys.length,
                key;
            for(; i<len; ++i){
                key = this.keys[i];
                if(key == testKey) {
                    return true;
                }
            }
            return false;
        },

        forEach: function (action) {
            var i = 0,
                len = this.keys.length,
                key,
                value;

            for(; i<len; ++i) {
                key = this.keys[i];
                value = this.values[i];
                var breakHere = action(key, value);
                if (breakHere === 'return') {
                    return false;
                }
            }
            return true;
        }
    });

    //return Dictionary;


/**
 * Ash-js Component matching family
 *
 */


    var ComponentMatchingFamily = Family.extend({
        constructor: function (nodeClass, engine) {
            this.nodeClass = nodeClass;
            this.engine = engine;
            this.__defineGetter__("nodeList", function() {
                return this.nodes;
            });

            this.nodes = new NodeList();
			this.entities = new Dictionary();
			this.components = new Dictionary();
            this.nodePool = new NodePool( this.nodeClass, this.components );
			
            this.nodePool.dispose( this.nodePool.get() );

            var nodeClassPrototype = this.nodeClass.prototype;

            for(var property in nodeClassPrototype) {
                ///TODO - tidy this up...
                if(nodeClassPrototype.hasOwnProperty(property) &&
                    property != "types" &&
                    property != "next" &&
                    property != "previous" &&
                    property != "constructor" &&
                    property != "super" &&
                    property != "extend" &&
                    property != "entity") {
                    var componentObject = nodeClassPrototype.types[property];
                    this.components.add(componentObject, property);
                }
            }
        },

        newEntity: function (entity) {
            this.addIfMatch(entity);
        },

        componentAddedToEntity: function (entity, componentClass) {
            this.addIfMatch(entity);
        },

        componentRemovedFromEntity: function (entity, componentClass) {
            if (this.components.has(componentClass)) {
                this.removeIfMatch(entity);
            }
        },

        removeEntity: function (entity) {
            this.removeIfMatch(entity);
        },

        cleanUp: function () {
            for (var node = this.nodes.head; node; node = node.next) {
                this.entities.remove(node.entity);
            }
            this.nodes.removeAll();
        },

        addIfMatch: function (entity) {
            if (!this.entities.has(entity)) {
                var componentClass;
                if (
                    !this.components.forEach(function(componentClass, componentName) {
                        if(!entity.has(componentClass)) {
                            return "return";
                        }
                    })
               ) { return; }
                var node = this.nodePool.get();
                node.entity = entity;
                this.components.forEach(function (componentClass, componentName) {
                    node[componentName] = entity.get(componentClass);
                });
                this.entities.add(entity, node);
                entity.componentRemoved.add(this.componentRemovedFromEntity, this);
                this.nodes.add(node);
            }
        },

        removeIfMatch: function (entity) {
            var entities = this.entities,
                nodes = this.nodes,
                engine = this.engine,
                nodePool = this.nodePool;

            if (entities.has(entity))
            {
                var node = entities.retrieve(entity);
                entity.componentRemoved.remove(this.componentRemovedFromEntity, this);
                entities.remove(entity);
                nodes.remove(node);
                if (engine.updating) {
                    nodePool.cache(node);
                    engine.updateComplete.add(this.releaseNodePoolCache, this);
                } else {
                    nodePool.dispose(node);
                }
            }
        },

        releaseNodePoolCache: function () {
            this.engine.updateComplete.remove(this.releaseNodePoolCache);
            this.nodePool.releaseCache();
        }
    });

   // return ComponentMatchingFamily;


/**
 * Ash-js EntityList
 */

    var EntityList = Class.extend({
        head: null, /* Entity */
        tail: null, /* Entity */

        constructor: function () { },

        add: function( entity ) {
            if( !this.head ) {
                this.head = this.tail = entity;
            } else {
                this.tail.next = entity;
                entity.previous = this.tail;
                this.tail = entity;
            }
        },

        remove: function( entity ) {
            if ( this.head == entity ) {
                this.head = this.head.next;
            }
            if ( this.tail == entity ) {
                this.tail = this.tail.previous;
            }
            if ( entity.previous ) {
                entity.previous.next = entity.next;
            }
            if ( entity.next ) {
                entity.next.previous = entity.previous;
            }
        },

        removeAll: function() {
            while( this.head ) {
                var entity = this.head;
                this.head = this.head.next;
                entity.previous = null;
                entity.next = null;
            }
            this.tail = null;
        }
    });

    //return EntityList;

/**
 * Ash-js System List
 */

    var SystemList = Class.extend({
        head: null, /* System */
        tail: null, /* System */

        constructor: function () { },

        add: function( system ) {
            if( !this.head ) {
                this.head = this.tail = system;
                system.next = system.previous = null;
            } else {
                for( var node = this.tail; node; node = node.previous ) {
                    if( node.priority <= system.priority ) {
                        break;
                    }
                }
                if( node === this.tail ) {
                    this.tail.next = system;
                    system.previous = this.tail;
                    system.next = null;
                    this.tail = system;
                } else if( !node ) {
                    system.next = this.head;
                    system.previous = null;
                    this.head.previous = system;
                    this.head = system;
                } else {
                    system.next = node.next;
                    system.previous = node;
                    node.next.previous = system;
                    node.next = system;
                }
            }
        },

        remove: function( system ) {
            if ( this.head === system ) {
                this.head = this.head.next;
            }
            if ( this.tail === system ) {
                this.tail = this.tail.previous;
            }
            if ( system.previous ) {
                system.previous.next = system.next;
            }
            if ( system.next ) {
                system.next.previous = system.previous;
            }
        },

        removeAll: function() {
            while( this.head )
            {
                var system = this.head;
                this.head = this.head.next;
                system.previous = null;
                system.next = null;
            }
            this.tail = null;
        },

        get: function( type ) {
            for( var system = this.head; system; system = system.next ) {
                if ( system.is( type ) ) {
                    return system;
                }
            }
            return null;
        }
    });

    //return SystemList;


/**
 * Ash-js engine
 *
 */

    var Engine = Class.extend({
        familyClass: ComponentMatchingFamily,
        families: null,
        entityList: null,
        systemList: null,
        updating: false,
        updateComplete: new signals.Signal(),

        constructor: function () {
            this.entityList = new EntityList(),
            this.systemList = new SystemList();
            this.families = new Dictionary();

            this.__defineGetter__('entities', function() {
                var tmpEntities = [];
                for( var entity = this.entityList.head; entity; entity = entity.next )
                {
                    tmpEntities.push( entity );
                }
                return tmpEntities;
            });

            this.__defineGetter__('systems', function() {
                var tmpSystems = [];
                for( var system = this.systemList.head; system; system = system.next )
                {
                    tmpSystems.push( system );
                }
                return tmpSystems;
            });
        },

        addEntity: function (entity) {
            this.entityList.add( entity );
            entity.componentAdded.add( this.componentAdded, this );
            this.families.forEach( function( nodeObject, family ) {
                family.newEntity( entity );
            });
        },

        removeEntity: function (entity) {
            entity.componentAdded.remove( this.componentAdded, this );
            this.families.forEach( function( nodeObject, family ) {
                family.removeEntity( entity );
            });
            this.entityList.remove( entity );
        },

        removeAllEntities: function () {
            while( this.entityList.head ) {
                this.removeEntity( this.entityList.head );
            }
        },

        componentAdded: function (entity, componentClass) {
            this.families.forEach( function( nodeObject, family ) {
                family.componentAddedToEntity( entity, componentClass );
            });
        },

        getNodeList: function (nodeObject) {
            if( this.families.has( nodeObject ) ) {
                return this.families.retrieve( nodeObject ).nodes;
            }
            var family = new this.familyClass( nodeObject, this );
            this.families.add( nodeObject, family );
            for( var entity = this.entityList.head; entity; entity = entity.next ) {
                family.newEntity( entity );
            }
            return family.nodes;
        },

        releaseNodeList : function( nodeObject ) {
            if( this.families.has( nodeObject ) ) {
                this.families.retrieve( nodeObject ).cleanUp();
            }
            this.families.remove( nodeObject );
        },

        addSystem : function( system, priority ) {
            system.priority = priority;
            system.addToEngine( this );
            this.systemList.add( system );
        },

        getSystem : function( type ) {
            return this.systemList.get( type );
        },

        removeSystem : function( system ) {
            this.systemList.remove( system );
            system.removeFromEngine( this );
        },

        removeAllSystems : function() {
            while( this.systemList.head ) {
               this.removeSystem( this.systemList.head );
            }
        },

        update : function( time ) {
            this.updating = true;
            for( var system = this.systemList.head; system; system = system.next ) {
                system.update( time );
            }
            this.updating = false;
            this.updateComplete.dispatch();
        }
    });

   // return Engine;


/**
 * Ash-js Entity
 *
 */

    var Entity = Class.extend({
        previous:null, /* Entity */
        next: null, /* Entity */
        components: null,
        
        constructor: function ()  {
            this.components = new Dictionary();
            this.componentAdded = new signals.Signal();
            this.componentRemoved = new signals.Signal();
        },
        
        add: function (component, componentClass ) {
			if( typeof componentClass === "undefined" )
			{
				componentClass = component.constructor;
			}
            if ( this.components.has( componentClass ) ) 
			{
                this.remove( componentClass );
            }
            this.components.add(componentClass, component);
            this.componentAdded.dispatch( this, componentClass );
            return this;
        },
        
        remove: function ( componentClass ) {
            var component = this.components.retrieve( componentClass );
            if ( component ) {
                this.components.remove( componentClass );
                this.componentRemoved.dispatch( this, componentClass );
                return component;
            }
            return null;
        },
        
        get: function (componentClass) {
            return this.components.retrieve( componentClass );
        },
        
        /**
         * Get all components from the entity.
         * @return {Array} Contains all the components on the entity
         */
        getAll: function () {
            var componentArray = [];
            this.components.forEach(function( componentObject, component ) {
                componentArray.push(component);
            });
            return componentArray;
        },
        
        has: function (componentClass) {
            return this.components.has( componentClass );
        }
    });

    //return Entity;

/**
 * Ash-js Node
 */

    var Node = Class.extend({
        entity: null,
        previous: null,
        next: null,
	
        constructor: function () { }
    });

    /**
    * A simpler way to create a node.
    *
    * Example: creating a node for component classes Point &amp; energy:
    *
    * var PlayerNode = Ash.Node.create({
    *   point: Point,
    *   energy: Energy
    * });
    *
    * This is the simpler version from:
    *
    * var PlayerNode = Ash.Node.extend({
    *   point: null,
    *   energy: null,
    *
    *   types: {
    *     point: Point,
    *     energy: Energy
    *   }
    * });
    */
    Node.create = function (schema) {
        var processedSchema = {
            types: {},
            constructor: function () { }
        };

        // process schema
        for (var propertyName in schema) {
            if (schema.hasOwnProperty(propertyName)) {
                var propertyType = schema[propertyName];
                if (propertyType) {
                    processedSchema.types[propertyName] = propertyType;
                }
                processedSchema[propertyName] = null;
            }
        }

        return Node.extend(processedSchema);
    };

    //return Node;


/**
 * Ash-js System
 */

    var System = Class.extend({
        previous: null, /* System */
        next: null, /* System */
        priority: 0,

        constructor: function () { },

        addToEngine: function (engine) {
            /* Left deliberately blank */
        },

        removeFromEngine: function (engine) {
            /* Left deliberately blank */
        },

        update: function (time) {
            /* Left deliberately blank */
        },

        is: function (type) {
            return type.prototype.isPrototypeOf(this);
        }
    });

   // return System;

var Point = function (x, y) {
	this.x = x || 0;
	this.y = y || 0;
};
Point.VERSION = "0.1.0";
Point.prototype.x = null;
Point.prototype.y = null;
Point.prototype.distanceSquaredTo = function( targetPoint ) {
	var dx = this.x - targetPoint.x,
		dy = this.y - targetPoint.y;
	return dx * dx + dy * dy;
};
Point.prototype.distanceTo = function( targetPoint ) {
	var dx = this.x - targetPoint.x,
		dy = this.y - targetPoint.y;
	return Math.sqrt( dx * dx + dy * dy );
};

/**
 * Ash framework core
 *
 * @author Brett Jephson
 */

    var core = {
        VERSION: '0.2.0'
    };

    core.Engine = Engine;
    core.ComponentMatchingFamily = ComponentMatchingFamily;
    core.Entity = Entity;
    core.EntityList = EntityList;
    core.Family = Family;
    core.Node = Node;
    core.NodeList = NodeList;
    core.NodePool = NodePool;
    core.System = System;
    core.SystemList = SystemList;

    // util classes
    // TODO separate this?
    core.Class = Class;
    core.Point = Point;
    core.Signals = signals;
	core.Dictionary = Dictionary;

    module.exports =  core;

