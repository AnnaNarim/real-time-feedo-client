import {AUTH_TOKEN} from "../constant";

export function canView(me) {
    return true;
}
export function canEdit(me) {
    return true;//me && me.roles && me.roles.includes("ADMIN");
}

export function noop() {
}

export function setToken(token) {
    localStorage.setItem(AUTH_TOKEN, JSON.stringify(token));
}

export function isAuthenticated() {
    return !!localStorage.getItem(AUTH_TOKEN);
}

export function signOut() {
    return localStorage.removeItem(AUTH_TOKEN);
}

export function isString(value) {
    return typeof value === 'string' || value instanceof String;
}

const baseIsFunction = function(value) {
    // Avoid a Chakra JIT bug in compatibility modes of IE 11.
    // See https://github.com/jashkenas/underscore/issues/1621 for more details.
    return typeof value === 'function' || false;
};

export const isFunction = !(baseIsFunction(/x/) || (Uint8Array && !baseIsFunction(Uint8Array))) ? baseIsFunction : function(value) {
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in older versions of Chrome and Safari which return 'function' for regexes
    // and Safari 8 equivalents which return 'object' for typed array constructors.
    return Object.prototype.toString.call(value) === '[object Function]';
};

export function guid() {
    let d = new Date().getTime();
    const uuid = 'guid_xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : ((r & 0x7) | 0x8)).toString(16);
    });
    return uuid;
}


export function equals(o1, o2, params) {
    try {

        if (!params)
            params = {};

        if (o1 === o2)
            return true;

        if (typeof (o1) !== typeof (o2))
            return false;

        if (typeof (o1) === 'function')
            return true;

        //            if(o1.equals)
        //                return o1.equals(o2);
        //
        //            if(o2.equals)
        //                return o2.equals(o1);


        // special case for comparing dom elements
        if (o1.tagName && o1.nodeName) {
            if (o1.id || o2.id)
                return o1.id === o2.id;
            else
                return o1 === o2;
        }

        if (params.loose && o1.id)
            return (o1.id === o2.id);

        if (o1 instanceof Date) {
            return (o1.getTime() === o2.getTime());
        } else if (Array.isArray(o1)) {
            if (o1.length !== o2.length)
                return false;

            for (var i = 0; i < o1.length; i++) {
                if (params.avoidAttrs && params.avoidAttrs[i])
                    continue;
                if (!equals(o1[i], o2[i], params)) {
                    return false;
                }
            }
        } else if (typeof (o1) === 'object') {

            var len1 = 0;
            var len2 = 0;
            for (let key in o1) {
                if (params.avoidAttrs && params.avoidAttrs[key])
                    continue;
                if (o1[key] === undefined || o1[key] === null)
                    continue;
                len1++;
            }
            for (let key in o2) {
                if (params.avoidAttrs && params.avoidAttrs[key])
                    continue;
                if (o2[key] === undefined || o2[key] === null)
                    continue;
                len2++;

                if (!equals(o1[key], o2[key], params)) {
                    return false;
                }
            }
            return (len1 === len2);
        } else {
            return (o1 === o2);
        }
        return true;

    } catch (e) {
        return false;
    }
}

export function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

export function toArray(val) {
    if (val === undefined || val === null)
        return [];
    if (!Array.isArray(val))
        val = [val];
    return val;
}

export function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

export const isArray = Array.isArray;

export function deepMixin(source, target, noArrayConcat) {
    // summary: Does a deep merge of the given target into the given source.
    // Note that arrays are concatenated during the merge unless noArrayConcat param is set to true.

    // Note: Merging joins objects, but if an array is found it concatenates the values.  As a result, merging two query configs only merges the attributes of the config, but the child arrays are concatenated not merged.
    if (source === undefined || target === undefined || source === target)
        return;

    if (!noArrayConcat && isArray(source)) {
        for (var i = 0; i < target.length; i++)
            source.push(target[i]); // join the array
    } else if (isObject(source)) {
        for (var key in target) {
            if (source[key] && (isArray(source[key]) || isObject(source[key])))
                deepMixin(source[key], target[key], noArrayConcat);
            else
                source[key] = target[key];
        }
    }
    return source;
}


export function millisecondsToSeconds(milliseconds) {
    return Math.ceil(milliseconds / 1000)
}

export function secondsToMilliseconds(seconds) {
    return seconds * 1000;
}

export function createPlayManager() {

    let timeoutHandle,
        localCurrentTime;
    // startTime;

    const cancelTimeout = () => {
        if (timeoutHandle) {
            clearTimeout(timeoutHandle);
            timeoutHandle = null;
        }
    };

    const update = function (props) {
        const {
            startTimeStamp,
            startTime,
            currentTime,
            playing,
            isEnded
        } = props;

        if (currentTime !== localCurrentTime) {
            cancelTimeout();
            localCurrentTime = currentTime;
        }

        if (playing) {

            if (props.maxDuration) {

                const maxDuration = props.maxDuration;

                if(currentTime >= maxDuration && !isEnded) {
                    props.onChange({
                        isEnded : true,
                        playing : false // stop when end is reached
                    });
                    // if(scene.loop) {
                    //     props.onChange({
                    //         currentTime : 1000 // restart
                    //     });
                    // } else {
                    //     props.onChange({
                    //         playing : false // stop when end is reached
                    //     });
                    // }
                }

                if (!timeoutHandle) {
                    timeoutHandle = setTimeout(() => {
                        timeoutHandle = null;

                        if (playing) {
                            props.onChange({
                                currentTime : Date.now() - startTimeStamp + startTime // in milliseconds
                            });
                        }
                    }, 100);
                }
            }
        } else {
            // startTime = null;
            cancelTimeout();
        }
    };

    return {
        update,
        destroy : function() {
            cancelTimeout();
        }
    };
}


export function findFirst(objTree, pattern) {
    var findKeys = Object.keys(pattern);

    var isMatch = function (obj) {
        for (var i = 0, len = findKeys.length; i < len; i++) {
            var key = findKeys[i];
            var equals = obj[key] === pattern[key];
            if (!equals)
                return false;
        }
        return true;
    };

    var run = function (obj) {
        if (isObject(obj) && obj !== null) {

            if (isMatch(obj))
                return obj;

            for (var key in obj) {
                let result = run(obj[key]);
                if (result)
                    return result;
            }
        } else if (Array.isArray(obj)) {
            for (var i = 0, len = obj.length; i < len; i++) {
                let result = run(obj[i]);
                if (result)
                    return result;
            }
        }
    };

    return run(objTree);
};


export function findAndReplace(objTree, pattern) {
    var cloneOfPattern = clone(pattern);
    var isMatch = function (obj) {
        var findKeys = Object.keys(cloneOfPattern);
        for (var i = 0, len = findKeys.length; i < len; i++) {
            var key = findKeys[i];
            var founded = obj.hasOwnProperty(key);
            if (founded) {
                obj[key] = cloneOfPattern[key]
                delete cloneOfPattern[key];
            }
        }
    };

    var run = function (obj) {
        if (isObject(obj) && obj !== null) {

            isMatch(obj)

            for (var key in obj) {
                let result = run(obj[key]);
                if (result)
                    return result;
            }
        } else if (Array.isArray(obj)) {
            for (var i = 0, len = obj.length; i < len; i++) {
                let result = run(obj[i]);
                if (result)
                    return result;
            }
        }
    };

    return run(objTree);
};


export function debounce(func, wait) {
    let timeout;
    return function () {
        const context = this,
            args = arguments;

        const later = function () {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};


export function urlHasParams(url) {
    const arr = url.split('?');
    return url.length > 1 && arr[1] !== '';
}

export function urlHasTimeParam(url) {

    const newUrl = new URL(url),
        queryString = newUrl.search;

    const urlParams = new URLSearchParams(queryString);
    return urlParams.has('t')
}

export function overrideTimeParam(url, timeValue) {
    const newUrl = new URL(url),
        query_string = url.search,
        search_params = new URLSearchParams(query_string);

    search_params.set('t', timeValue);
    newUrl.search = search_params.toString();

    return newUrl.toString();
}

export function addUrlTimeParam(url, timeValue) {
    const hasParam = urlHasParams(url);

    if (hasParam) {
        if (urlHasTimeParam(url)) {
            return overrideTimeParam(url, timeValue);
        }
        return `${url}&t=${timeValue}`;
    }
    return `${url}?t=${timeValue}`;
}


export function fromYouTubeUrlGetID(url) {
    let ID = '';
    url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if(url[2] !== undefined) {
        ID = url[2].split(/[^0-9a-z_]/i);
        ID = ID[0];
    } else {
        ID = url;
    }
    return ID;
}


export function findValByKey(object, key) {
    let value;
    Object.keys(object).some(function(k) {
        if(k === key) {
            value = object[k];
            return true;
        }
        if(object[k] && typeof object[k] === 'object') {
            value = findValByKey(object[k], key);
            return value !== undefined;
        }
        return undefined;
    });
    return value || guid();
}
