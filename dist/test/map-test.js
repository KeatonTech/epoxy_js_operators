"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const epoxyjs_1 = require("epoxyjs");
const epoxy_operators_1 = require("../epoxy_operators");
const chai_1 = require("chai");
// import mocha
describe('Mapped Listenable Collections', () => {
    it('returns a readonly collection', () => {
        const baseArray = epoxyjs_1.makeListenable([1, 2, 3, 4, 5, 6]);
        const mappedArray = epoxy_operators_1.map(baseArray, (val) => Math.pow(2, val));
        chai_1.expect(() => mappedArray.push(4)).throws(epoxyjs_1.ReadonlyException);
    });
    it('maps array values and mutations', () => {
        const baseArray = epoxyjs_1.makeListenable([1, 2, 3, 4, 5, 6]);
        const mappedArray = epoxy_operators_1.map(baseArray, (val) => Math.pow(2, val));
        chai_1.expect(mappedArray).eql([2, 4, 8, 16, 32, 64]);
        let lastMutation;
        mappedArray.listen().subscribe((mutation) => lastMutation = mutation);
        baseArray.splice(0, 0, 0);
        chai_1.expect(mappedArray).eql([1, 2, 4, 8, 16, 32, 64]);
        chai_1.expect(lastMutation instanceof epoxyjs_1.ArraySpliceMutation).true;
        const lastArrayMutation = lastMutation;
        chai_1.expect(lastArrayMutation.inserted[0]).equals(1);
        baseArray[6] = 7;
        chai_1.expect(mappedArray).eql([1, 2, 4, 8, 16, 32, 128]);
        chai_1.expect(lastMutation instanceof epoxyjs_1.PropertyMutation).true;
        const lastPropMutation = lastMutation;
        chai_1.expect(lastPropMutation.oldValue).equals(64);
        chai_1.expect(lastPropMutation.newValue).equals(128);
    });
    it('maps object values and mutations', () => {
        const baseObject = epoxyjs_1.makeListenable({ 'a': 1, 'b': 2 });
        const mappedObject = epoxy_operators_1.map(baseObject, (val, key) => key);
        chai_1.expect(mappedObject).eql({ 'a': 'a', 'b': 'b' });
        let lastMutation;
        mappedObject.listen().subscribe((mutation) => lastMutation = mutation);
        baseObject['c'] = 42;
        chai_1.expect(mappedObject).eql({ 'a': 'a', 'b': 'b', 'c': 'c' });
        chai_1.expect(lastMutation instanceof epoxyjs_1.PropertyMutation).true;
        let lastPropMutation = lastMutation;
        chai_1.expect(lastPropMutation.key).equals('c');
        chai_1.expect(lastPropMutation.newValue).equals('c');
        chai_1.expect(lastPropMutation.oldValue).equals(undefined);
        delete baseObject['b'];
        chai_1.expect(mappedObject).eql({ 'a': 'a', 'b': undefined, 'c': 'c' });
        chai_1.expect(lastMutation instanceof epoxyjs_1.PropertyMutation).true;
        lastPropMutation = lastMutation;
        chai_1.expect(lastPropMutation.key).equals('b');
        chai_1.expect(lastPropMutation.newValue).equals(undefined);
        chai_1.expect(lastPropMutation.oldValue).equals('b');
    });
    it('can depend on other Epoxy values', () => {
        const state = epoxyjs_1.makeListenable({ base: 2 });
        const baseArray = epoxyjs_1.makeListenable([1, 2, 3, 4, 5, 6]);
        const mappedArray = epoxy_operators_1.map(baseArray, (val) => Math.pow(state['base'], val));
        chai_1.expect(mappedArray).eql([2, 4, 8, 16, 32, 64]);
        state['base'] = 3;
        chai_1.expect(mappedArray).eql([3, 9, 27, 81, 243, 729]);
    });
});
