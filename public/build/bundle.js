
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }
    class HtmlTag {
        constructor(anchor = null) {
            this.a = anchor;
            this.e = this.n = null;
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.h(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.24.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\Project.svelte generated by Svelte v3.24.0 */

    const { console: console_1 } = globals;
    const file = "src\\Project.svelte";

    // (120:36) {#if links}
    function create_if_block_2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "links");
    			add_location(div, file, 119, 47, 2463);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			div.innerHTML = /*links*/ ctx[1];
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*links*/ 2) div.innerHTML = /*links*/ ctx[1];		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(120:36) {#if links}",
    		ctx
    	});

    	return block;
    }

    // (120:90) {#if when}
    function create_if_block_1(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*when*/ ctx[4]);
    			attr_dev(div, "class", "when svelte-3l1zwr");
    			add_location(div, file, 119, 100, 2516);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*when*/ 16) set_data_dev(t, /*when*/ ctx[4]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(120:90) {#if when}",
    		ctx
    	});

    	return block;
    }

    // (123:8) {#if desc}
    function create_if_block(ctx) {
    	let div;
    	let div_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");

    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(/*focused*/ ctx[5] || /*hovered*/ ctx[6]
    			? "desc visible"
    			: "desc") + " svelte-3l1zwr"));

    			add_location(div, file, 123, 12, 2634);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			div.innerHTML = /*desc*/ ctx[3];
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*desc*/ 8) div.innerHTML = /*desc*/ ctx[3];
    			if (dirty & /*focused, hovered*/ 96 && div_class_value !== (div_class_value = "" + (null_to_empty(/*focused*/ ctx[5] || /*hovered*/ ctx[6]
    			? "desc visible"
    			: "desc") + " svelte-3l1zwr"))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(123:8) {#if desc}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let h3;
    	let html_tag;
    	let t0;
    	let if_block0_anchor;
    	let t1;
    	let div;
    	let html_tag_1;
    	let t2;
    	let mounted;
    	let dispose;
    	let if_block0 = /*links*/ ctx[1] && create_if_block_2(ctx);
    	let if_block1 = /*when*/ ctx[4] && create_if_block_1(ctx);
    	let if_block2 = /*desc*/ ctx[3] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			h3 = element("h3");
    			t0 = space();
    			if (if_block0) if_block0.c();
    			if_block0_anchor = empty();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			div = element("div");
    			t2 = space();
    			if (if_block2) if_block2.c();
    			html_tag = new HtmlTag(t0);
    			attr_dev(h3, "class", "title");
    			add_location(h3, file, 119, 4, 2420);
    			html_tag_1 = new HtmlTag(t2);
    			attr_dev(div, "class", "img svelte-3l1zwr");
    			add_location(div, file, 120, 4, 2562);
    			attr_dev(main, "class", "project svelte-3l1zwr");
    			add_location(main, file, 113, 0, 2227);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h3);
    			html_tag.m(/*title*/ ctx[0], h3);
    			append_dev(h3, t0);
    			if (if_block0) if_block0.m(h3, null);
    			append_dev(h3, if_block0_anchor);
    			if (if_block1) if_block1.m(h3, null);
    			append_dev(main, t1);
    			append_dev(main, div);
    			html_tag_1.m(/*img*/ ctx[2], div);
    			append_dev(div, t2);
    			if (if_block2) if_block2.m(div, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(main, "click", /*click_handler*/ ctx[7], false, false, false),
    					listen_dev(main, "mouseenter", /*mouseenter_handler*/ ctx[8], false, false, false),
    					listen_dev(main, "mouseleave", /*mouseleave_handler*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 1) html_tag.p(/*title*/ ctx[0]);

    			if (/*links*/ ctx[1]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					if_block0.m(h3, if_block0_anchor);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*when*/ ctx[4]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1(ctx);
    					if_block1.c();
    					if_block1.m(h3, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*img*/ 4) html_tag_1.p(/*img*/ ctx[2]);

    			if (/*desc*/ ctx[3]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block(ctx);
    					if_block2.c();
    					if_block2.m(div, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { title } = $$props;
    	let { links } = $$props;
    	let { img } = $$props;
    	let { desc } = $$props;
    	let { when } = $$props;
    	let focused = false;
    	let hovered = false;
    	const writable_props = ["title", "links", "img", "desc", "when"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Project> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Project", $$slots, []);

    	const click_handler = () => {
    		$$invalidate(5, focused = !focused);
    		$$invalidate(6, hovered = focused);
    	};

    	const mouseenter_handler = () => {
    		$$invalidate(6, hovered = true);
    	};

    	const mouseleave_handler = () => {
    		$$invalidate(6, hovered = false);
    	};

    	$$self.$set = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("links" in $$props) $$invalidate(1, links = $$props.links);
    		if ("img" in $$props) $$invalidate(2, img = $$props.img);
    		if ("desc" in $$props) $$invalidate(3, desc = $$props.desc);
    		if ("when" in $$props) $$invalidate(4, when = $$props.when);
    	};

    	$$self.$capture_state = () => ({
    		title,
    		links,
    		img,
    		desc,
    		when,
    		focused,
    		hovered
    	});

    	$$self.$inject_state = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("links" in $$props) $$invalidate(1, links = $$props.links);
    		if ("img" in $$props) $$invalidate(2, img = $$props.img);
    		if ("desc" in $$props) $$invalidate(3, desc = $$props.desc);
    		if ("when" in $$props) $$invalidate(4, when = $$props.when);
    		if ("focused" in $$props) $$invalidate(5, focused = $$props.focused);
    		if ("hovered" in $$props) $$invalidate(6, hovered = $$props.hovered);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*links*/ 2) {
    			 console.log(links);
    		}
    	};

    	return [
    		title,
    		links,
    		img,
    		desc,
    		when,
    		focused,
    		hovered,
    		click_handler,
    		mouseenter_handler,
    		mouseleave_handler
    	];
    }

    class Project extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance, create_fragment, safe_not_equal, {
    			title: 0,
    			links: 1,
    			img: 2,
    			desc: 3,
    			when: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Project",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !("title" in props)) {
    			console_1.warn("<Project> was created without expected prop 'title'");
    		}

    		if (/*links*/ ctx[1] === undefined && !("links" in props)) {
    			console_1.warn("<Project> was created without expected prop 'links'");
    		}

    		if (/*img*/ ctx[2] === undefined && !("img" in props)) {
    			console_1.warn("<Project> was created without expected prop 'img'");
    		}

    		if (/*desc*/ ctx[3] === undefined && !("desc" in props)) {
    			console_1.warn("<Project> was created without expected prop 'desc'");
    		}

    		if (/*when*/ ctx[4] === undefined && !("when" in props)) {
    			console_1.warn("<Project> was created without expected prop 'when'");
    		}
    	}

    	get title() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get links() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set links(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get img() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set img(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get desc() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set desc(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get when() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set when(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.24.0 */
    const file$1 = "src\\App.svelte";

    function create_fragment$1(ctx) {
    	let main;
    	let div0;
    	let h1;
    	let t1;
    	let hr;
    	let t2;
    	let div1;
    	let p0;
    	let t4;
    	let p1;
    	let t5;
    	let i;
    	let t7;
    	let t8;
    	let p2;
    	let t10;
    	let div2;
    	let h30;
    	let t12;
    	let figure;
    	let img;
    	let img_src_value;
    	let t13;
    	let figcaption;
    	let t15;
    	let p3;
    	let t17;
    	let p4;
    	let t18;
    	let br;
    	let t19;
    	let t20;
    	let div3;
    	let h31;
    	let t22;
    	let p5;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "2022 Christmas Card";
    			t1 = space();
    			hr = element("hr");
    			t2 = space();
    			div1 = element("div");
    			p0 = element("p");
    			p0.textContent = "For Christmas 2022 I decided (at the very last moment) to put together a pen-plotter-based card to send out to friends and family. This page is about the process used to create the front of the card; even if you're not interested in the technical details you can scroll through the page and get a general sense of how I put it together.";
    			t4 = space();
    			p1 = element("p");
    			t5 = text("Also, due to the tight timeline, there are a ");
    			i = element("i");
    			i.textContent = "lot";
    			t7 = text(" of shortcuts and dubious code here.  Don't expect anything production grade.  (It was even worse until I cleaned it up for this page.)");
    			t8 = space();
    			p2 = element("p");
    			p2.textContent = "Also also, if you didn't get one I apologize - each card took almost an hour of machine time so I had fewer than I would've liked.";
    			t10 = space();
    			div2 = element("div");
    			h30 = element("h3");
    			h30.textContent = "Image Generation";
    			t12 = space();
    			figure = element("figure");
    			img = element("img");
    			t13 = space();
    			figcaption = element("figcaption");
    			figcaption.textContent = "Stable Diffusion-generated image";
    			t15 = space();
    			p3 = element("p");
    			p3.textContent = "The image depicted on the card was generated by the text-to-image deep learning model Stable Diffusion (v1.5).  I prompted the model for images of \"Christmas stars\" in an ink illustrated style.";
    			t17 = space();
    			p4 = element("p");
    			t18 = text("In hindsight it was very difficult to extract the \"inked\" lines from this image, and it probably would've been easier to try to generate an unstylized image and allow the style to arise from the plotting process.");
    			br = element("br");
    			t19 = text("Anyways.");
    			t20 = space();
    			div3 = element("div");
    			h31 = element("h3");
    			h31.textContent = "Outline Vectorization";
    			t22 = space();
    			p5 = element("p");
    			p5.textContent = "I wanted to emphasize the lines in the image by converting them to vectors which the pen plotter could draw directly, rather than using a shading technique intended for plotting photographs. There are lots of existing tools in this area but they weren't well suited to this image, either performing poorly in terms of accuracy or producing geometry too complex to be drawn.";
    			attr_dev(h1, "class", "current svelte-c7cp63");
    			add_location(h1, file$1, 158, 2, 8614);
    			attr_dev(hr, "class", "svelte-c7cp63");
    			add_location(hr, file$1, 159, 2, 8662);
    			attr_dev(div0, "id", "horizontal-nav");
    			attr_dev(div0, "class", "svelte-c7cp63");
    			add_location(div0, file$1, 157, 1, 8585);
    			add_location(p0, file$1, 162, 2, 8702);
    			add_location(i, file$1, 166, 48, 9111);
    			add_location(p1, file$1, 165, 2, 9058);
    			add_location(p2, file$1, 168, 2, 9268);
    			attr_dev(div1, "class", "blurb svelte-c7cp63");
    			add_location(div1, file$1, 161, 1, 8679);
    			add_location(h30, file$1, 173, 2, 9449);
    			if (img.src !== (img_src_value = "img/generated.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Raster image generated by Stable Diffusion");
    			attr_dev(img, "class", "svelte-c7cp63");
    			add_location(img, file$1, 175, 3, 9511);
    			attr_dev(figcaption, "class", "svelte-c7cp63");
    			add_location(figcaption, file$1, 176, 3, 9594);
    			attr_dev(figure, "class", "aside right svelte-c7cp63");
    			add_location(figure, file$1, 174, 2, 9478);
    			add_location(p3, file$1, 178, 2, 9668);
    			add_location(br, file$1, 182, 215, 10101);
    			add_location(p4, file$1, 181, 2, 9881);
    			attr_dev(div2, "class", "blurb svelte-c7cp63");
    			add_location(div2, file$1, 172, 1, 9426);
    			add_location(h31, file$1, 186, 2, 10157);
    			add_location(p5, file$1, 187, 2, 10191);
    			attr_dev(div3, "class", "blurb svelte-c7cp63");
    			add_location(div3, file$1, 185, 1, 10134);
    			attr_dev(main, "class", "svelte-c7cp63");
    			add_location(main, file$1, 156, 0, 8576);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div0);
    			append_dev(div0, h1);
    			append_dev(div0, t1);
    			append_dev(div0, hr);
    			append_dev(main, t2);
    			append_dev(main, div1);
    			append_dev(div1, p0);
    			append_dev(div1, t4);
    			append_dev(div1, p1);
    			append_dev(p1, t5);
    			append_dev(p1, i);
    			append_dev(p1, t7);
    			append_dev(div1, t8);
    			append_dev(div1, p2);
    			append_dev(main, t10);
    			append_dev(main, div2);
    			append_dev(div2, h30);
    			append_dev(div2, t12);
    			append_dev(div2, figure);
    			append_dev(figure, img);
    			append_dev(figure, t13);
    			append_dev(figure, figcaption);
    			append_dev(div2, t15);
    			append_dev(div2, p3);
    			append_dev(div2, t17);
    			append_dev(div2, p4);
    			append_dev(p4, t18);
    			append_dev(p4, br);
    			append_dev(p4, t19);
    			append_dev(main, t20);
    			append_dev(main, div3);
    			append_dev(div3, h31);
    			append_dev(div3, t22);
    			append_dev(div3, p5);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	const projects = [
    		{
    			title: "<a href=\"https://gitlab.com/glatteis/earthwalker\">Earthwalker</a>",
    			links: "<a href=\"https://gitlab.com/glatteis/earthwalker\"><img src=\"img/gitlab.svg\" alt=\"GitLab\" title=\"GitLab\"></a><a href=\"https://gitlab.com/glatteis/earthwalker/-/merge_requests?scope=all&state=all&author_username=jwlarocque\"><img src=\"img/merge.svg\" alt=\"Contributions\" title=\"Contributions\"></a>",
    			when: "2020",
    			img: "<img src=\"img/earthwalker_example.png\" alt=\"Earthwalker Example\">",
    			desc: `<p>An open source clone of <a href="https://www.geoguessr.com/">GeoGuessr</a> with a Go backend, which adds some extra features and works around Google's pricey dynamic Streetview API.</p>
				   <p>I rebuilt most of the application to loosen coupling between its components and better allow for future features.</p>
				   <p>The front end is written in Svelte with Leaflet maps, and  utilizes OSM Nominatim and Google StreetView.  It is served along with a REST API by a Go back end.</p>
				   <p><a href="https://gitlab.com/glatteis/earthwalker">GitLab</a>, <a href="https://gitlab.com/glatteis/earthwalker/-/merge_requests?scope=all&state=all&author_username=jwlarocque">Contributions</a></p>`
    		},
    		{
    			title: "<a href=\"http://which.jwlarocque.com\">Which?</a>",
    			links: "<a href=\"http://which.jwlarocque.com\"><img src=\"img/wysiwyg.svg\" alt=\"Live\" title=\"Live\"></a><a href=\"https://github.com/jwlarocque/which\"><img src=\"img/github.png\" alt=\"GitHub\" title=\"GitHub\"></a>",
    			when: "Spring 2020",
    			img: "<img src=\"img/which_2.jpg\" alt=\"Which New Question Page\">",
    			desc: `<p>My most recent project, a tiny voting/polling web app similar to <a href="https://www.strawpoll.me/">Straw Poll</a>, but with support for instant runoff as well as approval and plurality voting.  Still adding features and cleaning up, code quality is currently: <span class="code">gradually improving</span>.</p>
				   <p><a href="https://svelte.dev/">Svelte</a> frontend and PostgreSQL database connected by a Go server with from-scratch routing and session management.  Currently live on AWS EC2 + RDS!</p>
				   <p><a href="https://github.com/jwlarocque/which">GitHub</a>, <a href="http://which.jwlarocque.com">Live</a></p>`
    		},
    		{
    			title: "<a href=\"https://github.com/jwlarocque/svelte-dragdroplist\">Svelte-DragDropList</a>",
    			links: "<a href=\"https://svelte.dev/repl/915db3b3ed704fddb7ddfb64bcbc2624?version=3.22.2\"><img src=\"img/svelte.svg\" alt=\"REPL\" title=\"REPL\"></a><a href=\"https://github.com/jwlarocque/svelte-dragdroplist\"><img src=\"img/github.png\" alt=\"GitHub\" title=\"GitHub\"></a>",
    			when: "May 2020",
    			img: `<video autoplay loop style="object-fit: contain;">
					  <source src="img/dragdroplist.mp4" type="video/mp4">
				  </video>`,
    			desc: `<p>Sortable lists in a Svelte 3 component.  Some features: bidirectional data binding, touch support, and buttons for accessibility.</p>
				   <p><a href="https://svelte.dev/repl/915db3b3ed704fddb7ddfb64bcbc2624?version=3.22.2">REPL</a>, <a href="https://github.com/jwlarocque/svelte-dragdroplist">GitHub</a></p>`
    		},
    		{
    			title: "<a href=\"https://hacklahoma.org/\">Hacklahoma</a>",
    			links: "<a href=\"https://hacklahoma.org/\"><img src=\"img/wysiwyg.svg\" alt=\"Hacklahoma\" title=\"Hacklahoma\"></a><a href=\"https://github.com/Hacklahoma/Hacklahoma.github.io/tree/Hacklahoma2018-(DO-NOT-PULL-FROM-MASTER)\"><img src=\"img/github.png\" alt=\"GitHub (2018)\" title=\"GitHub (2018)\"></a><a href=\"https://github.com/Hacklahoma/Hacklahoma.github.io/tree/Hacklahoma2019-(DO-NOT-PULL-FROM-MASTER)\"><img src=\"img/github.png\" alt=\"GitHub (2019)\" title=\"GitHub (2019)\"></a>",
    			when: "2017 - 2019",
    			img: "<img src=\"img/hacklahoma19_centered.svg\" alt=\"Hacklahoma Logo\" style=\"background: #a9d9bc; object-fit: contain;\">",
    			desc: `<p>The first MLH hackathon in Oklahoma!</p>
				   <p>As ACM secretary during its founding (2018) and a member of the Hacklahoma advertising and media board, I'm lucky to have been a part of the great student team that made this event happen. (I worked on the website (<a href="https://2019.hacklahoma.org/">2019</a>, <a href="https://2018.hacklahoma.org/">2018</a>) quite a bit, and some other stuff.)</p>
				   <p>Thanks to all our sponsors, mentors, and attendees for making Hacklahoma awesome.</p>`
    		},
    		{
    			title: "<a href=\"https://github.com/draekris/Barrage/\">Barrage</a>",
    			links: "<a href=\"https://github.com/draekris/Barrage/\"><img src=\"img/github.png\" alt=\"GitHub\" title=\"GitHub\"></a>",
    			when: "Spring 2018",
    			img: "<img src=\"https://raw.githubusercontent.com/draekris/Barrage/master/examples/barrage-example.png\" alt=\"Barrage Screenshot\" style=\"object-fit: contain; background-color: rgba(0, 0, 0, 0.1)\">",
    			desc: `<p>An implementation of a minimal music player.</p>
                   <p>Built on Electron, with howler.js for audio and additional packages to handle metadata.  I only spent a couple of days on this, so the code isn't exactly debugged, optimized, and documented.</p>
				   <p>Since this application does quite a bit of processing to create a real-time frequency visualization, I wouldn't recommend it for mobile devices, though it's not too heavy on desktop.</p>
				   <p>Design copied from renders by <a href="http://annemunition.tv/">AnneMunition</a>.  Example audio is "After midnight kiss" by <a href="https://bisoudelenfantsauvage.bandcamp.com/">Bisou de l'enfant sauvage</a>.</p>
				   <p><a href="https://github.com/draekris/Barrage/">GitHub</a></p>`
    		},
    		{
    			title: "Other Contributions",
    			img: `<ul>
					  <li><a href="https://github.com/parker-codes/finite-state-microwave/issues?q=author%3Ajwlarocque">finite-state-microwave</a> (<a href="https://github.com/parker-codes/finite-state-microwave">GitHub</a>)</li>
					  <li><a href="https://github.com/notartom/ffreszoom/issues?utf8=%E2%9C%93&q=author%3Ajwlarocque">ffreszoom</a> (<a href="https://github.com/notartom/ffreszoom">GitHub</a>, <a href="https://addons.mozilla.org/en-US/firefox/addon/ffreszoom/">Firefox extension</a>)</li>
					  <li><a href="https://github.com/nose-devs/nose2/issues?utf8=%E2%9C%93&q=author%3Ajwlarocque">nose2</a> (<a href="https://github.com/nose-devs/nose2">GitHub</a>)</li>
				  </ul>`,
    			desc: false
    		},
    		{
    			title: "<a href=\"inversesquare.html\">Attraction</a>",
    			when: "2015",
    			img: "<iframe src=\"inversesquarethumb.html\" style=\"border: 0;\"></iframe>",
    			desc: `<p style="pointer-events: none;">This Javascript doodle was put together during my high school physics class, when I should have been studying.  It's an inverse square vector field with respect to the mouse position.  Faster than it used to be.</p>
				   <p style="pointer-events: none;">(Thanks to Chris for the idea!)</p>`
    		},
    		{
    			title: "<a href=\"https://github.com/jwlarocque/Python-Python\">Python Python</a>",
    			links: "<a href=\"https://github.com/jwlarocque/Python-Python/\"><img src=\"img/github.png\" alt=\"GitHub\" title=\"GitHub\"></a>",
    			when: "2015",
    			img: "<img src=\"img/python-python.png\" alt=\"Screenshot of Python Python\">",
    			desc: `<p>Play a quick game of snake from the comfort of your terminal!  Made in an attempt to convince a friend to stop playing Flash snake during English class and learn Python instead.</p>
				   <p><a href="https://github.com/jwlarocque/Python-Python">GitHub</a></p>`
    		}
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);
    	$$self.$capture_state = () => ({ Project, projects });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
