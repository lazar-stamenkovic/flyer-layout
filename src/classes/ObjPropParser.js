import {get, isNumber, isString} from "lodash";
import moment from "moment/moment";
//import Vue from "vue";

function applyValues(o, source) {
    const isArray = Array.isArray(o);
    const op = isArray? []: {};
    for(let p in o) {
        const sp = isArray? {p, sp:p}: sanitizeProp(p);
        //Vue.set(op, sp.sp, applyDirective(o, sp, source))
        op[sp.sp] = applyDirective(o, sp, source);
    }
    return op;
}

function sanitizeProp(p) {
    const o = p.match(/\[(.*?)\]/);
    const r = {p, sp: p};
    if(o && o[1]) {
        r.sp = p.replace(o[0], '');
        r.d = o[1];
    }
    return r;
}

function applySelfValues(source, value) {
    const regex = /__self(\.\w+)*/g;
    if(isString(value)) {
        return (value || '').replaceAll(regex, (match) => {
            return get(source, match, match);
        })
    }
    return value;
}

function toBool(value) {
    if(isString(value)) {
        const sanitized = value.trim().toLowerCase();
        if(sanitized === 'true') return true;
        if(sanitized === 'false') return false;
    }
    if(isNumber(value)){
        return Boolean(Number(value));
    }
    return Boolean(value);
}

function applyDirective(o, sp, source) {
    if(o[sp.p] && typeof o[sp.p] === 'object') return applyValues(o[sp.p], source);

    // se regex to match any __self
     //const regex = /__(\w+)(\.\w+)*/g;
    //const matches = text.match(regex);


    const value = applySelfValues(source, o[sp.p]);// get(source, o[sp.p], o[sp.p]);
    if(typeof(value) === 'string' && value.search('__') === 0) return null;
    if(typeof(value) === 'string' && value.search('null') === 0) return null;
    switch(sp.d) {
        case 'date':
            return moment.utc(value).format("YYYY-MM-DD")
            break;
        case 'int':
            return parseInt(value, 10)
            break;
        case 'bool':
            return toBool(value);
            break;
    }
    return value;
}

export function parseDateValues(str, data) {
    const m = str.match(/\{(.*?)\}/g);
    m.forEach((itm) => {
        console.log('Parsing:', itm);
        const d = itm.slice(1, -1).split('|').map((i) => i.trim());
        if(!data[d[0]]) return;
        str = str.replace(itm, data[d[0]].format(d[1]));
    })
    return str;
}

export default class {
    static Parse(o, source) {
        return applyValues(o, source);
    }

    static ApplySelfValues(o, source) {
        for(let p in o){
            if(o[p] && typeof o[p] === 'object') this.ApplySelfValues(o[p], source);
            o[p] = applySelfValues(source, o[p]);
        }
        return o;
    }
}


//In progress not tested
export function qMerge(o1, o2) {
    for(let p in o2){
        const action = p.slice(0,1);
        let sp = p.slice(1);
        switch(action) {
            case '+':
                if(typeof o2[p] === 'object'){
                    o1[sp] = qMerge({...o1[sp]}, o2[p]);
                } else {
                    o1[sp] = Object.assign(o1[sp], o2[p]);
                }
            break;
            case '-':
                //delete property
                delete o1[sp];
            break;
            default:
                Object.assign(o1[p], o2[p]);
        }
    }
    return o1;
}
