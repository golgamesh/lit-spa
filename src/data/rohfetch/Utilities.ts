

/**
 * Default PageSize for tables
 */
export const DefaultPageSize = 10;

/**
 * If provided val is null or undefineed, returns true.
 * Otherwise, false.
 * @param num 
 * @returns 
 */
export function isNullish(val: any): boolean {
    if(val === null || val === undefined) {
        return true;
    }
    return false;
}

/**
 * OData querystring flag to request total row cound
 */
export function oCount(val: boolean): string {
   return val ? '$count=true' : '';
}


/**
 * OData querystring flag to request a row limit
 * @param pageSize Optional param, defaults if left empty
 * @returns 
 */
 export function oTop(pageSize: number): string {
    if(isNullish(pageSize)) {
        return "";
    }
    return `$top=${pageSize}`;
}
 
/**
 * OData querystring flag to request skipping to the correct page
 * @param pageNumber Optional param, defaults to 0
 * @param pageSize Optional param, defaults if left empty
 * @returns 
 */
export function oSkip(pageNumber = 0, pageSize = DefaultPageSize): string {
    const skip = pageNumber * pageSize;
    if(!skip) {
        return '';
    }
    return `$skip=${skip}`;
}

/**
 * Accepts any number of strings, or tuples [string, boolean]
 * If a string field name is specified, will sort by that field ascending.
 * To sort descenting, provide a tuple, of [fieldname, true], where true 
 * indicates that the field should sort descending
 * 
 * Example: oOrderBy("Title", ["Type", true], ["lastModified", false]);
 * Result: $orderBy=Title,Type desc,lastModified
 * @param args 
 * @returns 
 */
export function oOrderBy(...args: (string | [string, boolean])[]): string {
    if(!args || !args.length || !args[0]) {
        return '';
    }
    const sortCriteria: string[] = [];
    const desc = 'desc';

    for(let i = 0; i < args.length; i++) {
        const arg = args[i];
        let param: string;
        let direction: string = '';             // Default to asc
        if(typeof arg === 'object') {
            param = arg[0];
            if(arg[1]) {
                direction = desc;
            }
        } else {
            param = <string> arg;
        }

        if(!param) {
            continue;
        }

        sortCriteria.push(trimJoin([param, direction], ' '));
    }

    if(!sortCriteria.length) {
        return '';
    }

    return '$orderby='.concat(sortCriteria.join(','));
}

export function oParams(...args: [key: string, value: string | number | boolean][]): string {
    if(!args || !args.length || !args[0]) {
        return '';
    }
    const params: string[] = [];

    for(let i = 0; i < args.length; i++) {
        const arg = args[i];
        if(!arg || !arg.length) {
            continue;
        }

        const key = arg[0];
        const val = arg[1];

        if(!key || isNullish(val)) {
            continue;
        }

        params.push(`${arg[0]}=${arg[1]}`);
        
    }
    return params.join('&');
}

/**
 * Accepts a string, or a series of strings and
 * constructs the oData query string selector
 * parameter.
 * Exampe: $select=name,id
 * @param args 
 * @returns 
 */
export function oSelect(...args: string[]): string {
    const str = trimJoin(args, ',');
    if(!str) {
        return '';
    }
    return '$select='.concat(str);
}

/**
 * Accepts a string, or a series of strings and 
 * cosntructs the oData query string expand
 * parameter.
 * Multiple parameters will be separated by commas.
 * Example: $expand=matterContacts
 * @param args 
 * @returns 
 */
export function oExpand(...args: string[]): string {
    const str = trimJoin(args, ',');
    if(!str) {
        return '';
    }
    return '$expand='.concat(str);
}

/**
 * Accepts a string, or a series of strings and
 * constructs the oData query string filter parameter.
 * Multiple filters will be separated with the "and" 
 * operator.
 * Example: $filter=name eq 'fred'
 * @param args 
 */
export function oFilter(...args: string[]): string {
    const str = trimJoin(args, ' and ');
    if(!str) {
        return '';
    }
    return '$filter='.concat(str);
}

/**
 * Accepts any number of oData filter strings
 * and returns them delimited by ' and '
 * @param args 
 * @returns 
 */
export function joinFilter(...args: string[]): string {
    const str = trimJoin(args, ' and ');
    if(!str) {
        return '';
    }
    return str;
}

export function oSearch(search: string): string {
    if(!search) {
        return '';
    }
    return `$search="${search}"`;
}

/**
 * Constructs querystring from provided params
 * Example: ?$skip=3&top=3&$count=true
 * @param args Querystring parameter strings
 * @returns 
 */
export function oJoin(...args: string[]): string {
    const qs = trimJoin(args, '&');
    return qs ? '?'.concat(qs) : '';
}

/**
 * Not to be confused with SQL Inner Join
 * Simply combines the query criteria delimited
 * with semicolons instead of & to be placed in oData
 * brackets. This function includes the brackets if not empty
 * @param args 
 * @returns 
 */
export function oInnerJoin(...args: string[]): string {
    const qs = trimJoin(args, ';');
    return qs ? ['(',trimJoin(args, ';'),')'].join('') : '';
}

/**
 * Accepts a URL and a key, and appends the key to
 * the url. For example: '/api/endpoint', 'key' => /api/endpoint(key)
 * @param url 
 * @param key 
 * @returns 
 */
export function appendKey(url: string, key?: string | number): string {
    return key ? `${url}(${key})` : url;
}

export function trimJoin(arr: string[], joinOn: string): string {
    if(!arr || !arr.length) {
        return '';
    }

    return arr.filter(a => !!a).join(joinOn);
}

/**
 * Determines if a string is null or empty or undefined
 *
 * @param s The string to test
 */
export function stringIsNullOrEmpty(s: string | undefined | null): s is undefined | null | "" {
    return typeof s === "undefined" || s === null || s.length < 1;
}

/**
 * Combines an arbitrary set of paths ensuring and normalizes the slashes
 *
 * @param paths 0 to n path parts to combine
 */
export function combine(...paths: (string | number | null | undefined)[]): string {

    return paths
        .filter(path => typeof path === 'number' || !stringIsNullOrEmpty(path))
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .map(path => String(path)!.replace(/^[\\|/]/, "").replace(/[\\|/]$/, ""))
        .join("/")
        .replace(/\\/g, "/");
}

export function oSpecify(itemId: string | number): string {
    return itemId ? `(${itemId})` : '';
}

/**
 * Return the first element in an array.
 * Returns null if array is null or empty
 * @param arr 
 * @returns 
 */
export function first<T>(arr: T[]): T {
    if(!arr || !arr.length) {
        return null;
    }

    return arr[0];
} 
