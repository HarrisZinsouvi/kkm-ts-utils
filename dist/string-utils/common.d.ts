export declare const isObject: (value: any) => value is object;
export declare const toPointer: (parts: string[]) => string;
export declare const decycle: () => (this: any, key: string | symbol, value: any) => any;
export declare function retrocycle(): (this: object, key: string | symbol, value: any) => any;
export declare const extend: (JSON: JSON) => JSON;
export declare function capitalize(str: string): string;
/**
 * compare deux valeurs qu'ils soient de type primitifs, décimaux,dates, array ou objet
 * @param a
 * @param b
 */
export declare function compareValues(a: any, b: any): boolean;
export declare function stringifyWithoutNullUndefined(obj: any): string;
export declare function stringToUniqueIndex(key: string): number;
/**
 * vérifie si la valeur est vide (attention au false des types booléens)
 * @param val
 */
export declare function isEmpty(val: any): boolean;
/**
 * Pour vérifier si le format contient des caractères de mois uniquement
 * @param format
 */
export declare const isMonthOnlyFormat: (format: any) => boolean;
/**
 *  Pour vérifier si le format contient des caractères d'année uniquement
 * @param format
 */
export declare const isYearOnlyFormat: (format: any) => boolean;
/**
 *  Pour vérifier si le format contient des caractères d'année et de mois uniquement
 * @param format
 */
export declare const isYearMonthFormat: (format: any) => boolean;
/**
 * par exemple si le text est: a/b/name.ext on récupère name
 * @param text
 */
export declare function getComponentNameFromScript(text: string): string;
/**
 * convertit un nom en slug
 * e.g: UnLongText ---> un-long-text
 * @param name
 */
export declare function toSlug(name: string): string;
