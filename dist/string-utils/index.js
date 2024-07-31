"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isYearMonthFormat = exports.isYearOnlyFormat = exports.isMonthOnlyFormat = exports.extend = exports.decycle = exports.toPointer = exports.isObject = void 0;
exports.retrocycle = retrocycle;
exports.capitalize = capitalize;
exports.compareValues = compareValues;
exports.stringifyWithoutNullUndefined = stringifyWithoutNullUndefined;
exports.stringToUniqueIndex = stringToUniqueIndex;
exports.isEmpty = isEmpty;
exports.getComponentNameFromScript = getComponentNameFromScript;
exports.toSlug = toSlug;
const isObject = (value) => typeof value === 'object' &&
    value != null &&
    !(value instanceof Boolean) &&
    !(value instanceof Date) &&
    !(value instanceof Number) &&
    !(value instanceof RegExp) &&
    !(value instanceof String);
exports.isObject = isObject;
const toPointer = (parts) => '#' + parts.map((part) => String(part).replace(/~/g, '~0').replace(/\//g, '~1')).join('/');
exports.toPointer = toPointer;
const decycle = () => {
    const paths = new WeakMap();
    return function replacer(key, value) {
        var _a;
        if (key !== '$ref' && (0, exports.isObject)(value)) {
            const seen = paths.has(value);
            if (seen) {
                return { $ref: (0, exports.toPointer)(paths.get(value)) };
            }
            else {
                paths.set(value, [...((_a = paths.get(this)) !== null && _a !== void 0 ? _a : []), key]);
            }
        }
        return value;
    };
};
exports.decycle = decycle;
function retrocycle() {
    const parents = new WeakMap();
    const keys = new WeakMap();
    const refs = new Set();
    function dereference(ref) {
        const parts = ref.$ref.slice(1).split('/');
        let key, parent, value = this;
        for (var i = 0; i < parts.length; i++) {
            key = parts[i].replace(/~1/g, '/').replace(/~0/g, '~');
            value = value[key];
        }
        parent = parents.get(ref);
        parent[keys.get(ref)] = value;
    }
    return function reviver(key, value) {
        if (key === '$ref') {
            refs.add(this);
        }
        else if ((0, exports.isObject)(value)) {
            var isRoot = key === '' && Object.keys(this).length === 1;
            if (isRoot) {
                refs.forEach(dereference, this);
            }
            else {
                parents.set(value, this);
                keys.set(value, key);
            }
        }
        return value;
    };
}
const extend = (JSON) => {
    return Object.defineProperties(JSON, {
        decycle: {
            value: (object, space) => JSON.stringify(object, (0, exports.decycle)(), space),
        },
        retrocycle: {
            value: (s) => JSON.parse(s, retrocycle()),
        },
    });
};
exports.extend = extend;
function capitalize(str) {
    if (str.length === 0) {
        return str;
    }
    const firstChar = str.charAt(0).toUpperCase();
    const restOfStr = str.slice(1).toLowerCase();
    return firstChar + restOfStr;
}
/**
 *
 * @param value
 */
function isDate(value) {
    return !isNaN(Date.parse(value));
}
/**
 * compare deux valeurs qu'ils soient de type primitifs, décimaux,dates, array ou objet
 * @param a
 * @param b
 */
function compareValues(a, b) {
    // Pour des décimaux, comparer en ignorant le séparateur décimal
    if (isDecimal(a) && isDecimal(b)) {
        const numericA = convertToNumericValue(a);
        const numericB = convertToNumericValue(b);
        return numericA == numericB;
    }
    //pour des date comparer la valeur iso
    if (isDate(a) && isDate(b)) {
        const dateA = new Date(a);
        const dateB = new Date(b);
        //return dateA.toISOString().slice(0, -1) === dateB.toISOString().slice(0, -1);
        //Pour récupérer uniquement Année-Jour-Mois-Heure-minutes-secondes
        const extractDateTime = (date) => {
            return date.toISOString().slice(0, 19);
        };
        return extractDateTime(new Date(a)) === extractDateTime(new Date(b));
    }
    if ((Array.isArray(a) && a.length === 0 && Array.isArray(b) && b.length === 0) ||
        (a == null && Array.isArray(b) && b.length === 0) ||
        (Array.isArray(a) && a.length === 0 && b == null) ||
        (a === '' && Array.isArray(b) && b.length === 0) ||
        (a == null && b == null) ||
        (a === '' && b == null) ||
        (a == null && b === '')) {
        return true;
    }
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {
            return false;
        }
        //note pour comparer les tableaux indépendemment de l'ordre
        /*const sortedA = [...a].sort();
        const sortedB = [...b].sort();

        for (let i = 0; i < sortedA.length; i++) {
            if (!compareValues(sortedA[i], sortedB[i])) {
                return false;
            }
        }*/
        for (let i = 0; i < a.length; i++) {
            if (!compareValues(a[i], b[i])) {
                return false;
            }
        }
        return true;
    }
    if (typeof a === 'object' && typeof b === 'object' && a !== null && b !== null) {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        if (keysA.length !== keysB.length) {
            return false;
        }
        //note pour comparer indépendemment de l'ordre
        //keysA.sort();
        //keysB.sort();
        for (let i = 0; i < keysA.length; i++) {
            const key = keysA[i];
            if (!compareValues(a[key], b[key])) {
                return false;
            }
        }
        return true;
    }
    return JSON.stringify(a) === JSON.stringify(b);
}
// Fonction utilitaire pour vérifier si la valeur est un décimal
function isDecimal(value) {
    const decimalRegex = /^-?\d+([^0-9]\d+)$/;
    return decimalRegex.test(value);
}
// Fonction utilitaire pour convertir une valeur décimale en nombre
function convertToNumericValue(value) {
    return ('' + value).replace(/[^0-9.-]+/g, '.');
}
function stringifyWithoutNullUndefined(obj) {
    return JSON.stringify(obj, (key, value) => {
        if (value === null || value === undefined) {
            return undefined;
        }
        return value;
    });
}
function stringToUniqueIndex(key) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
        const char = key.charCodeAt(i);
        hash = (hash << 5) - hash + char;
    }
    return hash;
}
/**
 * vérifie si la valeur est vide (attention au false des types booléens)
 * @param val
 */
function isEmpty(val) {
    if (val === null || val === undefined) {
        return true;
    }
    if (typeof val === 'string') {
        return val.trim() === '';
    }
    if (Array.isArray(val)) {
        return val.length === 0;
    }
    if (typeof val === 'object') {
        return Object.keys(val).length === 0;
    }
    return false;
}
/**
 * Pour vérifier si le format contient des caractères de mois uniquement
 * @param format
 */
const isMonthOnlyFormat = (format) => {
    // Pour vérifier si le format contient des caractères de mois uniquement
    const yearOnlyRegex = /^[FMmn]$/;
    return yearOnlyRegex.test(format);
};
exports.isMonthOnlyFormat = isMonthOnlyFormat;
/**
 *  Pour vérifier si le format contient des caractères d'année uniquement
 * @param format
 */
const isYearOnlyFormat = (format) => {
    const yearOnlyRegex = /^[Yy]$/;
    return yearOnlyRegex.test(format);
};
exports.isYearOnlyFormat = isYearOnlyFormat;
/**
 *  Pour vérifier si le format contient des caractères d'année et de mois uniquement
 * @param format
 */
const isYearMonthFormat = (format) => {
    // Pour vérifier si le format contient des caractères d'année et de mois
    const yearMonthRegex = /^(([Yy][^\dA-Za-z]?[FMmn])|([FMmn][^\dA-Za-z]?[Yy]))$/;
    return yearMonthRegex.test(format);
};
exports.isYearMonthFormat = isYearMonthFormat;
/**
 * par exemple si le text est: a/b/name.ext on récupère name
 * @param text
 */
function getComponentNameFromScript(text) {
    const regex = /([^/]+)\.[^.]+$/;
    const match = text.match(regex);
    //console.log('Match: ' + match[1]);
    return match ? match[1] : text;
}
/**
 * convertit un nom en slug
 * e.g: UnLongText ---> un-long-text
 * @param name
 */
function toSlug(name) {
    return name
        .replace(/([a-z])([A-Z])/g, '$1-$2') // Ajouter un tiret entre les minuscules et majuscules
        .replace(/[\s_]+/g, '-') // Remplacer les espaces et les underscores par des tirets
        .toLowerCase(); // Convertir le tout en minuscules
}
